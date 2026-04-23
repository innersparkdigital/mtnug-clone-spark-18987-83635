import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AppRole = "admin" | "moderator" | "user" | "finance_admin" | "operations_admin" | "content_admin";
const VALID_ROLES: AppRole[] = ["admin", "moderator", "user", "finance_admin", "operations_admin", "content_admin"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Super Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = String(body.action || "create");

    // ---- DELETE USER ----
    if (action === "delete") {
      const target_user_id = String(body.user_id || "");
      if (!target_user_id) throw new Error("user_id required");
      if (target_user_id === userData.user.id) throw new Error("You cannot delete yourself");
      await admin.from("admin_page_permissions").delete().eq("user_id", target_user_id);
      await admin.from("user_roles").delete().eq("user_id", target_user_id);
      const { error: delErr } = await admin.auth.admin.deleteUser(target_user_id);
      if (delErr) throw delErr;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- UPDATE ROLES + PERMISSIONS ----
    if (action === "update_access") {
      const target_user_id = String(body.user_id || "");
      const roles: AppRole[] = Array.isArray(body.roles) ? body.roles.filter((r: string) => VALID_ROLES.includes(r as AppRole)) : [];
      const pages: string[] = Array.isArray(body.pages) ? body.pages.map(String) : [];
      if (!target_user_id) throw new Error("user_id required");

      await admin.from("user_roles").delete().eq("user_id", target_user_id);
      if (roles.length > 0) {
        const rows = roles.map((role) => ({ user_id: target_user_id, role }));
        const { error: roleErr } = await admin.from("user_roles").insert(rows);
        if (roleErr) throw roleErr;
      }

      await admin.from("admin_page_permissions").delete().eq("user_id", target_user_id);
      if (pages.length > 0) {
        const rows = pages.map((page_key) => ({ user_id: target_user_id, page_key, granted_by: userData.user!.id }));
        const { error: permErr } = await admin.from("admin_page_permissions").insert(rows);
        if (permErr) throw permErr;
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- CREATE USER ----
    const full_name = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const roles: AppRole[] = Array.isArray(body.roles)
      ? body.roles.filter((r: string) => VALID_ROLES.includes(r as AppRole))
      : [];
    const pages: string[] = Array.isArray(body.pages) ? body.pages.map(String) : [];

    if (!full_name || !email || password.length < 8) {
      return new Response(JSON.stringify({ error: "Name, email and 8+ char password required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let userId: string | undefined;
    let createdAuthUser = false;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { display_name: full_name, is_admin_user: true },
    });

    if (createErr) {
      const code = (createErr as { code?: string }).code;
      const msg = (createErr as Error).message || "";
      const isExists = code === "email_exists" || /already been registered|already registered/i.test(msg);
      if (!isExists) throw createErr;
      let foundId: string | undefined;
      for (let page = 1; page <= 20 && !foundId; page++) {
        const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (listErr) throw listErr;
        const match = list.users.find((u) => (u.email || "").toLowerCase() === email);
        if (match) foundId = match.id;
        if (list.users.length < 200) break;
      }
      if (!foundId) throw new Error("Email exists but user not found");
      userId = foundId;
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
        password, email_confirm: true,
        user_metadata: { display_name: full_name, is_admin_user: true },
      });
      if (updErr) throw updErr;
    } else {
      userId = created.user?.id;
      createdAuthUser = true;
    }
    if (!userId) throw new Error("Failed to resolve user id");

    // Ensure profile
    await admin.from("profiles").upsert({ id: userId, display_name: full_name }, { onConflict: "id" });

    // Replace roles
    await admin.from("user_roles").delete().eq("user_id", userId);
    if (roles.length > 0) {
      const { error: roleErr } = await admin.from("user_roles").insert(
        roles.map((role) => ({ user_id: userId, role })),
      );
      if (roleErr) {
        if (createdAuthUser) await admin.auth.admin.deleteUser(userId);
        throw roleErr;
      }
    }

    // Replace page permissions
    await admin.from("admin_page_permissions").delete().eq("user_id", userId);
    if (pages.length > 0) {
      await admin.from("admin_page_permissions").insert(
        pages.map((page_key) => ({ user_id: userId, page_key, granted_by: userData.user!.id })),
      );
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, credentials: { email, password } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-create-user error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});