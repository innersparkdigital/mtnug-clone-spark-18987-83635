import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is an admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const full_name = String(body.full_name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const facility = body.facility ? String(body.facility).trim() : null;
    const password = String(body.password || "").trim();

    if (!full_name || !phone || !email || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields (password must be 8+ chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reject if phone already linked to a doctor
    const { data: existingByPhone } = await admin
      .from("doctors")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (existingByPhone) {
      return new Response(JSON.stringify({ error: "Phone already registered" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reject if email already linked to a doctor
    const { data: existingByEmail } = await admin
      .from("doctors")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingByEmail) {
      return new Response(JSON.stringify({ error: "Email already registered as a doctor" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try to create auth user (auto-confirmed). If email exists, reuse it and reset its password.
    let userId: string | undefined;
    let createdAuthUser = false;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: full_name, is_doctor: true },
    });

    if (createErr) {
      const code = (createErr as { code?: string }).code;
      const msg = (createErr as Error).message || "";
      const isExists = code === "email_exists" || /already been registered|already registered/i.test(msg);
      if (!isExists) throw createErr;

      // Find the existing user by email
      let foundId: string | undefined;
      for (let page = 1; page <= 20 && !foundId; page++) {
        const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (listErr) throw listErr;
        const match = list.users.find((u) => (u.email || "").toLowerCase() === email);
        if (match) foundId = match.id;
        if (list.users.length < 200) break;
      }
      if (!foundId) throw new Error("Email already registered but user not found");
      userId = foundId;

      // Reset the password and ensure metadata is set
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
        user_metadata: { display_name: full_name, is_doctor: true },
      });
      if (updErr) throw updErr;
    } else {
      userId = created.user?.id;
      createdAuthUser = true;
    }
    if (!userId) throw new Error("Failed to resolve auth user");

    const { data: doctor, error: insertErr } = await admin
      .from("doctors")
      .insert({ user_id: userId, full_name, phone, email, facility })
      .select()
      .single();
    if (insertErr) {
      // Only rollback the auth user if we created it in this call
      if (createdAuthUser) await admin.auth.admin.deleteUser(userId);
      throw insertErr;
    }

    return new Response(
      JSON.stringify({ ok: true, doctor, credentials: { phone, email, password } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("admin-create-doctor error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});