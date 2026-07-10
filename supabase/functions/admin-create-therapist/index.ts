import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p + "!@";
};

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
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = String(body.action || "create");

    if (action === "set_active") {
      const therapist_id = String(body.therapist_id || "");
      const is_active = Boolean(body.is_active);
      if (!therapist_id) throw new Error("therapist_id required");
      const { error } = await admin.from("therapist_accounts").update({ is_active }).eq("id", therapist_id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const therapist_id = String(body.therapist_id || "");
      if (!therapist_id) throw new Error("therapist_id required");
      const { data: row } = await admin.from("therapist_accounts").select("user_id").eq("id", therapist_id).maybeSingle();
      await admin.from("therapist_accounts").delete().eq("id", therapist_id);
      if (row?.user_id) {
        await admin.auth.admin.deleteUser(row.user_id).catch(() => {});
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CREATE
    const full_name = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim() || null;
    const specialisation = String(body.specialisation || "").trim() || null;

    if (!full_name || !email) {
      return new Response(JSON.stringify({ error: "Name and email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const password = generatePassword();
    let userId: string | undefined;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { display_name: full_name, is_therapist: true },
    });

    if (createErr) {
      const msg = (createErr as Error).message || "";
      if (!/already been registered|already registered|email_exists/i.test(msg)) throw createErr;
      // Look up existing user
      let foundId: string | undefined;
      for (let page = 1; page <= 20 && !foundId; page++) {
        const { data: list } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        const match = list?.users.find((u) => (u.email || "").toLowerCase() === email);
        if (match) foundId = match.id;
        if (!list?.users.length || list.users.length < 200) break;
      }
      if (!foundId) throw new Error("Email exists but user not found");
      userId = foundId;
      await admin.auth.admin.updateUserById(userId, {
        password, email_confirm: true,
        user_metadata: { display_name: full_name, is_therapist: true },
      });
    } else {
      userId = created.user?.id;
    }
    if (!userId) throw new Error("Failed to resolve user id");

    await admin.from("profiles").upsert({ id: userId, display_name: full_name }, { onConflict: "id" });

    const { data: acct, error: acctErr } = await admin.from("therapist_accounts").upsert({
      user_id: userId, full_name, email, phone, specialisation,
      is_active: true, must_change_password: true,
    }, { onConflict: "user_id" }).select().single();
    if (acctErr) throw acctErr;

    const LOGIN_URL = "https://www.innersparkafrica.com/therapist";
    let email_sent = false;
    try {
      const { data: emailData, error: emailErr } = await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "therapist-welcome",
          recipientEmail: email,
          idempotencyKey: `therapist-welcome-${acct.id}-${Date.now()}`,
          templateData: { full_name, email, password, login_url: LOGIN_URL },
        },
      });
      if (emailErr) throw emailErr;
      if ((emailData as { error?: string })?.error) throw new Error((emailData as { error: string }).error);
      email_sent = true;
    } catch (e) {
      console.warn("therapist welcome email failed (non-fatal)", e);
    }

    return new Response(
      JSON.stringify({ ok: true, therapist_id: acct.id, email_sent, credentials: { email, password, login_url: LOGIN_URL } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-create-therapist error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});