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
    const action = String(body.action || "create");

    // ---- RESEND credentials email ----
    if (action === "resend_credentials") {
      const doctor_id = String(body.doctor_id || "");
      const password = String(body.password || "").trim();
      if (!doctor_id) throw new Error("doctor_id required");
      if (!password || password.length < 8) {
        return new Response(JSON.stringify({ error: "A new password (8+ chars) is required to resend credentials" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: doc, error: docErr } = await admin
        .from("doctors")
        .select("id, user_id, full_name, phone, email")
        .eq("id", doctor_id)
        .single();
      if (docErr || !doc) throw new Error("Doctor not found");

      // Reset auth password so what we email actually works
      try {
        await admin.auth.admin.updateUserById(doc.user_id, { password, email_confirm: true });
      } catch (e) {
        console.error("password reset failed", e);
        throw new Error("Failed to reset password: " + (e as Error).message);
      }

      const LOGIN_URL = "https://www.innersparkafrica.com/for-professionals/refer";
      let email_sent = false;
      let email_error: string | null = null;
      try {
        const { data: emailData, error: emailErr } = await admin.functions.invoke("send-transactional-email", {
          body: {
            templateName: "account-credentials",
            recipientEmail: doc.email,
            idempotencyKey: `doctor-creds-${doctor_id}-${Date.now()}`,
            templateData: {
              full_name: doc.full_name,
              account_type: "doctor",
              login_url: LOGIN_URL,
              login_id: doc.phone,
              login_id_label: "Phone",
              password,
            },
          },
        });
        if (emailErr) throw emailErr;
        if ((emailData as any)?.error) throw new Error((emailData as any).error);
        email_sent = true;
      } catch (e) {
        email_error = (e as Error).message || String(e);
        console.error("resend credentials email failed", email_error);
      }

      await admin.from("doctors").update({
        credentials_email_status: email_sent ? "sent" : "failed",
        credentials_email_sent_at: email_sent ? new Date().toISOString() : null,
        credentials_email_error: email_sent ? null : email_error,
      }).eq("id", doctor_id);

      return new Response(JSON.stringify({ ok: true, email_sent, email_error }), {
        status: email_sent ? 200 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- DEACTIVATE / REACTIVATE ----
    if (action === "deactivate" || action === "reactivate") {
      const doctor_id = String(body.doctor_id || "");
      if (!doctor_id) throw new Error("doctor_id required");
      if (action === "deactivate" && !String(body.reason || "").trim()) {
        return new Response(JSON.stringify({ error: "Deactivation reason is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: doc, error: docErr } = await admin
        .from("doctors")
        .select("id, user_id")
        .eq("id", doctor_id)
        .single();
      if (docErr || !doc) throw new Error("Doctor not found");

      const isDeactivate = action === "deactivate";
      const { error: updErr } = await admin
        .from("doctors")
        .update({
          is_active: !isDeactivate,
          deactivated_at: isDeactivate ? new Date().toISOString() : null,
          deactivated_reason: isDeactivate ? (String(body.reason || "").trim() || null) : null,
        })
        .eq("id", doctor_id);
      if (updErr) throw updErr;

      // Ban / unban auth user so they cannot log in
      try {
        await admin.auth.admin.updateUserById(doc.user_id, {
          ban_duration: isDeactivate ? "876000h" : "none", // ~100y or remove ban
        });
      } catch (e) {
        console.warn("auth ban update failed (non-fatal)", e);
      }

      // Activity log
      try {
        await admin.from("activity_logs").insert({
          user_id: userData.user.id,
          action: isDeactivate ? "doctor_deactivated" : "doctor_reactivated",
          entity_type: "doctor",
          entity_id: doctor_id,
          details: { reason: isDeactivate ? String(body.reason || "").trim() : null },
        });
      } catch (e) {
        console.warn("activity log insert failed (non-fatal)", e);
      }

      return new Response(JSON.stringify({ ok: true, is_active: !isDeactivate }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- UPDATE doctor profile ----
    if (action === "update_doctor") {
      const doctor_id = String(body.doctor_id || "");
      if (!doctor_id) throw new Error("doctor_id required");

      const patch: Record<string, unknown> = {};
      if (typeof body.full_name === "string") patch.full_name = body.full_name.trim();
      if (typeof body.phone === "string") patch.phone = body.phone.trim();
      if (typeof body.email === "string") patch.email = body.email.trim().toLowerCase();
      if (typeof body.facility !== "undefined") patch.facility = body.facility ? String(body.facility).trim() : null;
      if (typeof body.location !== "undefined") patch.location = body.location ? String(body.location).trim() : null;
      if (typeof body.is_active === "boolean") {
        patch.is_active = body.is_active;
        patch.deactivated_at = body.is_active ? null : new Date().toISOString();
        if (!body.is_active && typeof body.deactivated_reason === "string") {
          patch.deactivated_reason = body.deactivated_reason.trim() || null;
        }
        if (body.is_active) patch.deactivated_reason = null;
      }

      if (Object.keys(patch).length === 0) {
        return new Response(JSON.stringify({ error: "No fields to update" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Uniqueness checks for phone/email if being changed
      if (patch.phone) {
        const { data: dup } = await admin.from("doctors").select("id").eq("phone", patch.phone as string).neq("id", doctor_id).maybeSingle();
        if (dup) return new Response(JSON.stringify({ error: "Phone already used by another doctor" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (patch.email) {
        const { data: dup } = await admin.from("doctors").select("id").eq("email", patch.email as string).neq("id", doctor_id).maybeSingle();
        if (dup) return new Response(JSON.stringify({ error: "Email already used by another doctor" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: updated, error: updErr } = await admin
        .from("doctors")
        .update(patch)
        .eq("id", doctor_id)
        .select()
        .single();
      if (updErr) throw updErr;

      // Mirror auth user (email + ban status) when changed
      try {
        const authPatch: Record<string, unknown> = {};
        if (patch.email) authPatch.email = patch.email;
        if (typeof body.is_active === "boolean") authPatch.ban_duration = body.is_active ? "none" : "876000h";
        if (Object.keys(authPatch).length > 0 && updated?.user_id) {
          await admin.auth.admin.updateUserById(updated.user_id, authPatch);
        }
      } catch (e) {
        console.warn("auth update failed (non-fatal)", e);
      }

      try {
        await admin.from("activity_logs").insert({
          user_id: userData.user.id,
          action: "doctor_updated",
          entity_type: "doctor",
          entity_id: doctor_id,
          details: { changed: Object.keys(patch) },
        });
      } catch (e) {
        console.warn("activity log insert failed (non-fatal)", e);
      }

      return new Response(JSON.stringify({ ok: true, doctor: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const full_name = String(body.full_name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const facility = body.facility ? String(body.facility).trim() : null;
    const location = body.location ? String(body.location).trim() : null;
    const password = String(body.password || "").trim();

    if (!full_name || !phone || !email || !password || password.length < 8) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields (password must be 8+ chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
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
      .insert({ user_id: userId, full_name, phone, email, facility, location, credentials_email_status: "pending" })
      .select()
      .single();
    if (insertErr) {
      // Only rollback the auth user if we created it in this call
      if (createdAuthUser) await admin.auth.admin.deleteUser(userId);
      throw insertErr;
    }

    // Send credentials email (best-effort, non-fatal). Track outcome on the doctor row.
    const LOGIN_URL = "https://www.innersparkafrica.com/for-professionals/refer";
    let email_sent = false;
    let email_error: string | null = null;
    try {
      const { data: emailData, error: emailErr } = await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "account-credentials",
          recipientEmail: email,
          idempotencyKey: `doctor-creds-${doctor.id}`,
          templateData: {
            full_name,
            account_type: "doctor",
            login_url: LOGIN_URL,
            login_id: phone,
            login_id_label: "Phone",
            password,
          },
        },
      });
      if (emailErr) throw emailErr;
      if ((emailData as any)?.error) throw new Error((emailData as any).error);
      email_sent = true;
    } catch (e) {
      email_error = (e as Error).message || String(e);
      console.error("credentials email failed (non-fatal)", email_error);
    }

    try {
      await admin.from("doctors").update({
        credentials_email_status: email_sent ? "sent" : "failed",
        credentials_email_sent_at: email_sent ? new Date().toISOString() : null,
        credentials_email_error: email_sent ? null : email_error,
      }).eq("id", doctor.id);
    } catch (e) {
      console.warn("failed to update email tracking", e);
    }

    return new Response(
      JSON.stringify({ ok: true, doctor, email_sent, email_error, credentials: { phone, email, password, login_url: LOGIN_URL } }),
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