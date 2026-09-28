import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalize = (value: string) => {
  const v = value.trim().toLowerCase();
  if (v.includes("@")) return v;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : digits;
};

const mask = (value: string) =>
  value.includes("@")
    ? value.replace(/^(.{2}).*(@.*)$/, "$1••••$2")
    : `••••${normalize(value).slice(-4)}`;

const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("") + "!7";
};

const matchesIdentifier = (
  needle: string,
  ...candidates: Array<string | null | undefined>
) => candidates.some((v) => v && normalize(String(v)) === needle);

const notifyAdmin = async (
  requestId: string,
  accountType: string,
  identifierMasked: string,
): Promise<{ ok: boolean; error?: string }> => {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) {
    return { ok: false, error: "Email keys not configured — request is still in the admin queue" };
  }
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
        "Idempotency-Key": `manual-reset-${requestId}`,
      },
      body: JSON.stringify({
        from: "InnerSpark Africa <info@innersparkafrica.com>",
        to: ["info@innersparkafrica.com"],
        reply_to: "info@innersparkafrica.com",
        subject: `Action needed: ${accountType} password reset (${identifierMasked})`,
        text:
          `A ${accountType} requested a manual password reset (${identifierMasked}). ` +
          `Open Admin Dashboard → Password Resets, verify identity, generate temporary credential, share manually.`,
      }),
    });
    const result = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok || !result?.id) return { ok: false, error: `Admin email not accepted (${res.status})` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Email send failed" };
  }
};

// deno-lint-ignore no-explicit-any
const softUpdate = async (admin: any, id: string, patch: Record<string, unknown>) => {
  const { error } = await admin.from("manual_password_reset_requests").update(patch).eq("id", id);
  if (error) console.error("softUpdate", id, error.message);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!url || !serviceKey || !anonKey) {
      return json({
        ok: true,
        message: "Your request has been received for admin review.",
      });
    }

    const admin = createClient(url, serviceKey);
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request body" }, 400);
    }
    const action = String(body.action || "request");

    if (action === "request") {
      const okMsg = {
        ok: true as const,
        message:
          "Your request has been received for admin review. Staff will contact you if the details match an account.",
        queued: true as const,
      };

      try {
        const accountType = body.account_type === "therapist" ? "therapist" : "client";
        const identifier = String(body.identifier || "").trim();
        if (!identifier || identifier.length > 255) return json(okMsg);

        const needle = normalize(identifier);
        let accountId: string | null = null;
        let userId: string | null = null;
        let matchFound = false;

        if (accountType === "therapist") {
          const { data, error } = await admin
            .from("therapist_accounts")
            .select("id,user_id,email,phone")
            .eq("is_active", true)
            .limit(5000);
          if (error) throw error;
          const hit = data?.find((r) => matchesIdentifier(needle, r.email, r.phone));
          if (hit) {
            accountId = hit.id;
            userId = hit.user_id || null;
            matchFound = true;
          }
        } else {
          const { data, error } = await admin
            .from("therapist_clients")
            .select("id,email,phone")
            .limit(8000);
          if (error) throw error;
          const hit = data?.find((r) => matchesIdentifier(needle, r.email, r.phone));
          if (hit) {
            accountId = hit.id;
            matchFound = true;
          }
        }

        let reset: { id: string; status: string } | null = null;

        if (accountId) {
          const { data: existing } = await admin
            .from("manual_password_reset_requests")
            .select("id,status,expires_at")
            .eq("account_type", accountType)
            .eq("account_id", accountId)
            .in("status", ["pending", "ready", "sent", "processing"])
            .order("requested_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (
            existing &&
            (existing.status === "pending" ||
              existing.status === "processing" ||
              !existing.expires_at ||
              new Date(existing.expires_at) > new Date())
          ) {
            reset = existing;
          }
        }

        if (!reset) {
          const { data: byMask } = await admin
            .from("manual_password_reset_requests")
            .select("id,status")
            .eq("account_type", accountType)
            .eq("identifier_masked", mask(identifier))
            .eq("status", "pending")
            .order("requested_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (byMask) reset = byMask;
        }

        if (!reset) {
          const baseRow: Record<string, unknown> = {
            account_type: accountType,
            account_id: accountId,
            user_id: userId,
            identifier_masked: mask(identifier),
            status: "pending",
          };

          let inserted: { id: string; status: string } | null = null;
          let insertError: { message?: string } | null = null;

          ({
            data: inserted,
            error: insertError,
          } = await admin
            .from("manual_password_reset_requests")
            .insert({ ...baseRow, match_found: matchFound })
            .select("id,status")
            .single());

          if (insertError) {
            console.error("insert match_found failed", insertError.message);
            const fallback = { ...baseRow };
            if (!accountId) fallback.account_id = "00000000-0000-0000-0000-000000000000";
            ({
              data: inserted,
              error: insertError,
            } = await admin
              .from("manual_password_reset_requests")
              .insert(fallback)
              .select("id,status")
              .single());
          }

          if (insertError || !inserted) {
            console.error("password reset insert failed", insertError);
            return json(okMsg);
          }
          reset = inserted;
        }

        if (reset && reset.status === "pending") {
          const notified = await notifyAdmin(reset.id, accountType, mask(identifier));
          if (notified.ok) {
            await softUpdate(admin, reset.id, {
              admin_notified_at: new Date().toISOString(),
              admin_notification_error: null,
            });
          } else {
            await softUpdate(admin, reset.id, {
              admin_notification_error: notified.error || "Staff email failed — check Password Resets tab",
            });
          }
        }

        return json({ ...okMsg, match_found: matchFound, request_id: reset?.id });
      } catch (inner) {
        console.error("manual-password-reset request path", inner);
        return json(okMsg);
      }
    }

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData } = await userClient.auth.getUser();
    const user = authData.user;
    if (!user) return json({ error: "Please sign in again and retry." }, 401);

    if (action === "consume_therapist") {
      const { data: request } = await admin
        .from("manual_password_reset_requests")
        .select("id,expires_at,status")
        .eq("account_type", "therapist")
        .eq("user_id", user.id)
        .in("status", ["ready", "sent"])
        .order("revealed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!request) return json({ temporary: false });
      const expired = !request.expires_at || new Date(request.expires_at) <= new Date();
      await admin.auth.admin.updateUserById(user.id, { password: generatePassword() });
      await admin
        .from("manual_password_reset_requests")
        .update({
          status: expired ? "expired" : "used",
          consumed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.id)
        .in("status", ["ready", "sent"]);
      return json({ temporary: true, expired, request_id: request.id });
    }

    if (action === "complete_therapist") {
      let query = admin
        .from("manual_password_reset_requests")
        .select("id")
        .eq("user_id", user.id)
        .eq("account_type", "therapist")
        .eq("status", "used")
        .order("consumed_at", { ascending: false })
        .limit(1);
      if (body.request_id) query = query.eq("id", String(body.request_id));
      const { data: used } = await query.maybeSingle();
      if (used?.id) {
        await admin
          .from("manual_password_reset_requests")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", used.id)
          .eq("status", "used");
      }
      return json({ ok: true });
    }

    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    if (action === "retry_notification") {
      const requestId = String(body.request_id || "");
      const { data: reset } = await admin
        .from("manual_password_reset_requests")
        .select("id,account_type,identifier_masked,status")
        .eq("id", requestId)
        .maybeSingle();
      if (!reset || reset.status !== "pending") {
        return json({ error: "Pending request not found" }, 404);
      }
      const notified = await notifyAdmin(reset.id, reset.account_type, reset.identifier_masked);
      if (!notified.ok) return json({ error: notified.error || "Could not send staff alert" }, 502);
      await softUpdate(admin, reset.id, {
        admin_notified_at: new Date().toISOString(),
        admin_notification_error: null,
      });
      return json({ ok: true });
    }

    if (action === "mark_sent") {
      const requestId = String(body.request_id || "");
      await admin
        .from("manual_password_reset_requests")
        .update({ status: "sent", updated_at: new Date().toISOString() })
        .eq("id", requestId)
        .eq("status", "ready");
      return json({ ok: true });
    }

    if (action === "list") {
      await admin
        .from("manual_password_reset_requests")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .in("status", ["ready", "sent"])
        .lt("expires_at", new Date().toISOString());

      let { data, error } = await admin
        .from("manual_password_reset_requests")
        .select(
          "id,account_type,account_id,identifier_masked,status,requested_at,expires_at,revealed_at,consumed_at,completed_at,admin_notified_at,admin_notification_error,match_found",
        )
        .order("requested_at", { ascending: false })
        .limit(200);

      if (error) {
        console.error("list full select failed", error.message);
        ({ data, error } = await admin
          .from("manual_password_reset_requests")
          .select(
            "id,account_type,account_id,identifier_masked,status,requested_at,expires_at,revealed_at,consumed_at,completed_at",
          )
          .order("requested_at", { ascending: false })
          .limit(200));
      }
      if (error) throw error;
      return json({ requests: data || [] });
    }

    if (action === "reveal") {
      const requestId = String(body.request_id || "");
      const { data: request } = await admin
        .from("manual_password_reset_requests")
        .select("*")
        .eq("id", requestId)
        .eq("status", "pending")
        .maybeSingle();
      if (!request || request.revealed_at) {
        return json({ error: "This temporary password was already viewed or is unavailable." }, 409);
      }

      if (
        request.account_type === "client" &&
        (!request.account_id || request.account_id === "00000000-0000-0000-0000-000000000000")
      ) {
        return json({
          error:
            "No client account matched this request. Find the client under Therapist clients and reset passcode there, or ask them to re-submit with the exact registered phone/email.",
        }, 409);
      }

      const temporaryPassword = generatePassword();

      if (request.account_type === "client") {
        const { data: ok, error } = await admin.rpc("issue_client_temporary_passcode", {
          _request_id: request.id,
          _admin_id: user.id,
          _temporary_passcode: temporaryPassword,
        });
        if (error) {
          console.error("issue_client_temporary_passcode", error);
          const { data: claimed, error: claimErr } = await admin.rpc("claim_manual_password_reset", {
            _request_id: request.id,
            _admin_id: user.id,
          });
          if (claimErr) throw claimErr;
          if (!claimed) return json({ error: "This request is unavailable. Refresh before trying again." }, 409);
          const { data: setOk, error: setErr } = await admin.rpc("admin_set_client_temporary_passcode", {
            _request_id: request.id,
            _client_id: request.account_id,
            _temporary_passcode: temporaryPassword,
          });
          if (setErr || !setOk) throw setErr || new Error("Could not set temporary passcode");
        } else if (!ok) {
          return json({ error: "This request is unavailable. Refresh before trying again." }, 409);
        }
      } else {
        if (!request.user_id) {
          return json({
            error: "Therapist login is not linked on this request. Reset from therapist accounts or ask them to re-submit.",
          }, 409);
        }
        const { data: claimed, error: claimError } = await admin.rpc("claim_manual_password_reset", {
          _request_id: request.id,
          _admin_id: user.id,
        });
        if (claimError) throw claimError;
        if (!claimed) return json({ error: "Another administrator already opened this request." }, 409);

        const { error: authError } = await admin.auth.admin.updateUserById(request.user_id, {
          password: temporaryPassword,
        });
        if (authError) throw authError;

        await admin
          .from("therapist_accounts")
          .update({ must_change_password: true })
          .eq("id", request.account_id);

        const hash = Array.from(
          new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(temporaryPassword))),
        )
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const { data: saved, error: saveError } = await admin
          .from("manual_password_reset_requests")
          .update({
            temp_secret_hash: hash,
            status: "ready",
            revealed_at: new Date().toISOString(),
            revealed_by: user.id,
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", request.id)
          .eq("status", "processing")
          .select("id")
          .maybeSingle();
        if (saveError || !saved) throw saveError || new Error("Reset state was not saved");
      }

      return json({ temporary_password: temporaryPassword, expires_in_minutes: 60 });
    }

    return json({ error: "Unsupported action" }, 400);
  } catch (error) {
    console.error("manual-password-reset", error);
    return json({ error: "Could not complete the reset action. Please try again or contact support." }, 500);
  }
});
