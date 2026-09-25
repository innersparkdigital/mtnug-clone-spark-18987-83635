import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});
const normalize = (value: string) => value.trim().toLowerCase().replace(/[\s()+-]/g, "");
const mask = (value: string) => value.includes("@")
  ? value.replace(/^(.{2}).*(@.*)$/, "$1••••$2")
  : `••••${normalize(value).slice(-4)}`;
// Notify staff only after a matched request has been stored. Never email a credential.
const notifyAdmin = async (requestId: string, accountType: string, identifierMasked: string): Promise<void> => {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) throw new Error("Admin email is not configured");
  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
      "Idempotency-Key": `manual-reset-${requestId}`,
    },
    body: JSON.stringify({
      from: "InnerSpark Alerts <noreply@innersparkafrica.com>",
      to: ["info@innersparkafrica.com"],
      reply_to: "info@innersparkafrica.com",
      subject: "Password reset request awaiting staff review",
      text: `A ${accountType} requested a manual password reset. Registered contact: ${identifierMasked}. Open https://www.innersparkafrica.com/admin?tab=password-resets and verify identity before sharing a temporary credential. Do not reply with a password to this automated alert.`,
    }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok || !result?.id) throw new Error(`Admin email not accepted (${res.status})`);
};
const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("") + "!7";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const admin = createClient(url, serviceKey);
    const body = await req.json();
    const action = String(body.action || "request");

    if (action === "request") {
      const accountType = body.account_type === "therapist" ? "therapist" : "client";
      const identifier = String(body.identifier || "").trim();
      if (!identifier) return json({ ok: true });
      const needle = normalize(identifier);
      let account: { id: string; user_id?: string | null; email?: string | null; phone?: string | null } | undefined;
      if (accountType === "therapist") {
        const { data, error } = await admin.from("therapist_accounts").select("id,user_id,email,phone").eq("is_active", true).limit(1000);
        if (error) throw error;
        account = data?.find((r) => [r.email, r.phone].some((v) => v && normalize(v) === needle));
      } else {
        const { data, error } = await admin.from("therapist_clients").select("id,email,phone").limit(2000);
        if (error) throw error;
        account = data?.find((r) => [r.email, r.phone].some((v) => v && normalize(v) === needle));
      }
      if (account) {
        const { data: existing, error: lookupError } = await admin.from("manual_password_reset_requests")
          .select("id,status,expires_at,admin_notified_at").eq("account_type", accountType).eq("account_id", account.id)
          .in("status", ["pending", "ready", "sent"]).order("requested_at", { ascending: false }).limit(1).maybeSingle();
        if (lookupError) throw lookupError;
        const stillActive = existing && (existing.status === "pending" || !existing.expires_at || new Date(existing.expires_at) > new Date());
        let reset = stillActive ? existing : null;
        if (!reset) {
          const { data: inserted, error: insertError } = await admin.from("manual_password_reset_requests").insert({
            account_type: accountType, account_id: account.id, user_id: account.user_id || null,
            identifier_masked: mask(identifier), status: "pending",
          }).select("id,status,admin_notified_at").single();
          if (insertError || !inserted) throw insertError || new Error("Reset request was not stored");
          reset = inserted;
        }
        if (reset.status === "pending" && !reset.admin_notified_at) {
          try {
            await notifyAdmin(reset.id, accountType, mask(identifier));
            const { error: saved } = await admin.from("manual_password_reset_requests")
              .update({ admin_notified_at: new Date().toISOString(), admin_notification_error: null })
              .eq("id", reset.id);
            if (saved) throw saved;
          } catch (notificationError) {
            console.error("Reset request stored but staff alert failed", reset.id, notificationError);
            await admin.from("manual_password_reset_requests")
              .update({ admin_notification_error: "Delivery failed; retry from the admin queue" })
              .eq("id", reset.id);
          }
        }
      }
      return json({ ok: true, message: "If the details match an account, your request has been received for admin review." });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: authData } = await userClient.auth.getUser();
    const user = authData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    if (action === "consume_therapist") {
      const { data: request } = await admin.from("manual_password_reset_requests")
        .select("id,expires_at,status").eq("account_type", "therapist").eq("user_id", user.id)
        .in("status", ["ready", "sent"]).order("revealed_at", { ascending: false }).limit(1).maybeSingle();
      if (!request) return json({ temporary: false });
      const expired = !request.expires_at || new Date(request.expires_at) <= new Date();
      await admin.auth.admin.updateUserById(user.id, { password: generatePassword() });
      await admin.from("manual_password_reset_requests").update({
        status: expired ? "expired" : "used", consumed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).eq("id", request.id).in("status", ["ready", "sent"]);
      return json({ temporary: true, expired, request_id: request.id });
    }

    if (action === "complete_therapist") {
      let query = admin.from("manual_password_reset_requests").select("id")
        .eq("user_id", user.id).eq("account_type", "therapist").eq("status", "used")
        .order("consumed_at", { ascending: false }).limit(1);
      if (body.request_id) query = query.eq("id", String(body.request_id));
      const { data: used } = await query.maybeSingle();
      if (used?.id) await admin.from("manual_password_reset_requests").update({
        status: "completed", completed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).eq("id", used.id).eq("status", "used");
      return json({ ok: true });
    }

    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    if (action === "retry_notification") {
      const requestId = String(body.request_id || "");
      const { data: reset, error: lookupError } = await admin.from("manual_password_reset_requests")
        .select("id,account_type,identifier_masked,status,admin_notified_at").eq("id", requestId).maybeSingle();
      if (lookupError || !reset || reset.status !== "pending") return json({ error: "Pending request not found" }, 404);
      if (reset.admin_notified_at) return json({ ok: true, already_notified: true });
      await notifyAdmin(reset.id, reset.account_type, reset.identifier_masked);
      const { error: updateError } = await admin.from("manual_password_reset_requests")
        .update({ admin_notified_at: new Date().toISOString(), admin_notification_error: null }).eq("id", reset.id);
      if (updateError) throw updateError;
      return json({ ok: true });
    }

    if (action === "mark_sent") {
      const requestId = String(body.request_id || "");
      await admin.from("manual_password_reset_requests").update({ status: "sent", updated_at: new Date().toISOString() })
        .eq("id", requestId).eq("status", "ready");
      return json({ ok: true });
    }

    if (action === "list") {
      await admin.from("manual_password_reset_requests").update({ status: "expired", updated_at: new Date().toISOString() })
        .in("status", ["ready", "sent"]).lt("expires_at", new Date().toISOString());
      const { data, error } = await admin.from("manual_password_reset_requests")
        .select("id,account_type,identifier_masked,status,requested_at,expires_at,revealed_at,consumed_at,completed_at,admin_notified_at,admin_notification_error")
        .order("requested_at", { ascending: false }).limit(200);
      if (error) throw error;
      return json({ requests: data || [] });
    }

    if (action === "reveal") {
      const requestId = String(body.request_id || "");
      const { data: request } = await admin.from("manual_password_reset_requests").select("*")
        .eq("id", requestId).eq("status", "pending").maybeSingle();
      if (!request || request.revealed_at) return json({ error: "This temporary password was already viewed or is unavailable." }, 409);
      const { data: claimed } = await admin.rpc("claim_manual_password_reset", { _request_id: request.id, _admin_id: user.id });
      if (!claimed) return json({ error: "Another administrator already opened this request." }, 409);
      const temporaryPassword = generatePassword();
      if (request.account_type === "client") {
        const { data: ok, error } = await admin.rpc("admin_set_client_temporary_passcode", {
          _request_id: request.id, _client_id: request.account_id, _temporary_passcode: temporaryPassword,
        });
        if (error || !ok) throw error || new Error("Client account not found");
      } else {
        if (!request.user_id) throw new Error("Therapist login is not linked");
        const { error: authError } = await admin.auth.admin.updateUserById(request.user_id, { password: temporaryPassword });
        if (authError) throw authError;
        await admin.from("therapist_accounts").update({ must_change_password: true }).eq("id", request.account_id);
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(temporaryPassword))))
          .map((b) => b.toString(16).padStart(2, "0")).join("");
        await admin.from("manual_password_reset_requests").update({
          temp_secret_hash: hash, status: "ready", revealed_at: new Date().toISOString(), revealed_by: user.id,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(),
        }).eq("id", request.id).eq("status", "processing");
      }
      return json({ temporary_password: temporaryPassword, expires_in_minutes: 60 });
    }

    return json({ error: "Unsupported action" }, 400);
  } catch (error) {
    console.error("manual-password-reset", error);
    return json({ error: "Could not complete the reset action." }, 500);
  }
});
