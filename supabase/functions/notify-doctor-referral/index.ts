import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@innersparkafrica.com";
const FROM_EMAIL = "InnerSpark Africa <info@innersparkafrica.com>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : null;
    const messageId = `doctor-referral-${payload.referral_id || payload.patient_phone || crypto.randomUUID()}-${Date.now()}`;

    if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
      console.warn("Email keys not configured; skipping notification");
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const submittedAt = payload.submitted_at
      ? new Date(payload.submitted_at)
      : new Date();
    const formattedTimestamp = submittedAt.toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      dateStyle: "full",
      timeStyle: "short",
    }) + " (EAT)";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B4D89; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">New Doctor Referral</h1>
          <p style="color: #cfe0f5; margin: 6px 0 0; font-size: 13px;">${formattedTimestamp}</p>
        </div>
        <div style="padding: 24px; background: #f9fafb;">
          <p style="font-size: 16px;">A doctor has just submitted a new patient referral via InnerSpark Africa.</p>

          <h3 style="color: #1B4D89; border-bottom: 2px solid #1B4D89; padding-bottom: 6px; margin-top: 20px;">Patient</h3>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 4px 0; color: #6b7280;">Name:</td><td><strong>${payload.patient_name}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Phone:</td><td><a href="tel:${payload.patient_phone}" style="color: #1B4D89;">${payload.patient_phone}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Location:</td><td>${payload.location || "—"}</td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Concern:</td><td>${payload.concern || "—"}</td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Preferred Mode:</td><td style="text-transform: capitalize;">${payload.preferred_mode}</td></tr>
          </table>

          <h3 style="color: #1B4D89; border-bottom: 2px solid #1B4D89; padding-bottom: 6px; margin-top: 20px;">Referring Doctor</h3>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 4px 0; color: #6b7280;">Name:</td><td><strong>Dr. ${payload.doctor_name}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Phone:</td><td><a href="tel:${payload.doctor_phone}" style="color: #1B4D89;">${payload.doctor_phone}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Email:</td><td>${payload.doctor_email ? `<a href="mailto:${payload.doctor_email}" style="color: #1B4D89;">${payload.doctor_email}</a>` : "—"}</td></tr>
            <tr><td style="padding: 4px 0; color: #6b7280;">Submitted:</td><td>${formattedTimestamp}</td></tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: white; border-left: 4px solid #1B4D89; border-radius: 4px;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">View and manage this referral in the Admin Dashboard → Referrals tab.</p>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          InnerSpark Africa · Mental Health for Everyone
        </div>
      </div>
    `;

    if (supabase) {
      await supabase.from("email_send_log").insert({
        message_id: messageId,
        template_name: "doctor-referral-notification",
        recipient_email: ADMIN_EMAIL,
        status: "pending",
        metadata: { patient_name: payload.patient_name, doctor_name: payload.doctor_name },
      });
    }

    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🩺 New Referral: ${payload.patient_name} from Dr. ${payload.doctor_name}`,
        html,
        ...(payload.doctor_email ? { reply_to: payload.doctor_email } : {}),
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Resend notification failed", response.status, result);
      if (supabase) {
        await supabase.from("email_send_log").insert({
          message_id: messageId,
          template_name: "doctor-referral-notification",
          recipient_email: ADMIN_EMAIL,
          status: "failed",
          error_message: JSON.stringify(result).slice(0, 1000),
          metadata: { provider: "resend", response_status: response.status },
        });
      }
      return new Response(JSON.stringify({ ok: false, error: result }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (supabase) {
      await supabase.from("email_send_log").insert({
        message_id: messageId,
        template_name: "doctor-referral-notification",
        recipient_email: ADMIN_EMAIL,
        status: "sent",
        metadata: { provider: "resend", provider_message_id: result.id },
      });
    }
    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-doctor-referral error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});