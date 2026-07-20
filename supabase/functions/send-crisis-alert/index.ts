// Crisis alert emailer — invoked by the notify_admin_on_crisis_session DB trigger
// whenever a therapist logs a session with progress_status = 'at_risk' or
// 'crisis_activated'. Emails the InnerSpark admin team via Resend.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "InnerSpark Alerts <noreply@innersparkafrica.com>";
const ADMIN_EMAILS = ["info@innersparkafrica.com", "reagan@innersparkafrica.com", "raymond@innersparkafrica.com"];
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json().catch(() => ({}));
    const feedbackId = body?.feedback_id;
    if (!feedbackId) return new Response(JSON.stringify({ error: "feedback_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: fb } = await supabase
      .from("therapist_session_feedback")
      .select("id, session_date, progress_status, notes, homework_given, homework_text, next_appt_booked, next_appt_date, therapist_id, client_id")
      .eq("id", feedbackId)
      .maybeSingle();
    if (!fb) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: therapist } = await supabase.from("therapist_accounts").select("full_name, email, phone").eq("id", fb.therapist_id).maybeSingle();
    const { data: client } = await supabase.from("therapist_clients").select("full_name, phone, email, presenting_concern").eq("id", fb.client_id).maybeSingle();

    const severity = fb.progress_status === "crisis_activated" ? "CRISIS PROTOCOL ACTIVATED" : "CLIENT AT RISK";
    const color = fb.progress_status === "crisis_activated" ? "#dc2626" : "#f59e0b";

    const html = `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:2px solid ${color};">
        <div style="background:${color};color:#fff;padding:18px 22px;">
          <div style="font-weight:800;font-size:16px;">🚨 ${severity}</div>
          <div style="font-size:12px;opacity:.9;margin-top:2px;">Logged ${new Date(fb.session_date as string).toDateString()}</div>
        </div>
        <div style="padding:20px 22px;font-size:14px;line-height:1.6;">
          <p><strong>Client:</strong> ${esc(client?.full_name || "—")} · ${esc(client?.phone || client?.email || "no contact")}</p>
          <p><strong>Therapist:</strong> ${esc(therapist?.full_name || "—")} · ${esc(therapist?.email || "")}</p>
          <p><strong>Presenting concern:</strong> ${esc(client?.presenting_concern || "—")}</p>
          <p><strong>Next appointment:</strong> ${esc(fb.next_appt_booked || "—")}${fb.next_appt_date ? ` (${fb.next_appt_date})` : ""}</p>
          <p><strong>Homework given:</strong> ${fb.homework_given ? "Yes" : "No"}${fb.homework_text ? ` — ${esc(fb.homework_text)}` : ""}</p>
          <div style="margin-top:14px;padding:12px 14px;background:#f8fafc;border-left:3px solid ${color};border-radius:4px;">
            <div style="font-weight:600;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;">Therapist notes</div>
            <div style="margin-top:6px;white-space:pre-wrap;">${esc(fb.notes || "(none)")}</div>
          </div>
          <p style="margin-top:18px;">Review this case in the admin dashboard immediately.</p>
          <a href="https://www.innersparkafrica.com/admin" style="display:inline-block;margin-top:8px;background:${color};color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700;">Open Admin →</a>
        </div>
      </div>
    </div>`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const resp = await fetch(RESEND_API_KEY ? "https://api.resend.com/emails" : `${RESEND_GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(RESEND_API_KEY
          ? { Authorization: `Bearer ${RESEND_API_KEY}` }
          : { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": Deno.env.get("RESEND_API_KEY") || "" }),
      },
      body: JSON.stringify({ from: FROM, to: ADMIN_EMAILS, subject: `🚨 ${severity} — ${client?.full_name || "client"}`, html }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error("crisis alert failed", resp.status, t);
      return new Response(JSON.stringify({ error: t.slice(0, 300) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Also mirror into safety_alerts for the Safety tab
    await supabase.from("safety_alerts").insert({
      client_id: fb.client_id,
      therapist_id: fb.therapist_id,
      severity: fb.progress_status === "crisis_activated" ? "red" : "amber",
      payload: { source: "session_log", feedback_id: fb.id, notes: fb.notes, next_appt: fb.next_appt_date } as never,
    } as never);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-crisis-alert error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});