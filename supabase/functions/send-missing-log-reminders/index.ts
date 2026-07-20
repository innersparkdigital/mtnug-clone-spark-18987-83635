// Monday 8am Africa/Nairobi cron. Finds sessions expected to have happened last
// week (session_feedback rows with next_appt_date in the previous 7 days) that
// do NOT have a follow-up therapist_session_feedback logged for the same client.
// Sends a digest email to admin with pre-filled wa.me links per therapist.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "InnerSpark Ops <noreply@innersparkafrica.com>";
const ADMIN_EMAILS = ["info@innersparkafrica.com", "raymond@innersparkafrica.com"];
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function normPhone(raw: string): string {
  const d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("256")) return d;
  if (d.startsWith("0") && d.length === 10) return "256" + d.slice(1);
  return d;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const today = new Date();
    const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
    const isoAgo = weekAgo.toISOString().slice(0, 10);
    const isoToday = today.toISOString().slice(0, 10);

    // Expected sessions: previous logs with next_appt_date in last 7 days
    const { data: expected } = await supabase
      .from("therapist_session_feedback")
      .select("client_id, therapist_id, next_appt_date, next_appt_service")
      .gte("next_appt_date", isoAgo)
      .lt("next_appt_date", isoToday)
      .eq("next_appt_booked", "yes");

    if (!expected || expected.length === 0) {
      return new Response(JSON.stringify({ missing: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Actual: sessions logged in the last 7 days
    const { data: actual } = await supabase
      .from("therapist_session_feedback")
      .select("client_id, session_date")
      .gte("session_date", isoAgo)
      .lte("session_date", isoToday);
    const loggedSet = new Set((actual || []).map((r) => `${r.client_id}|${r.session_date}`));

    const missing = expected.filter((e) => !loggedSet.has(`${e.client_id}|${e.next_appt_date}`));
    if (missing.length === 0) return new Response(JSON.stringify({ missing: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const clientIds = Array.from(new Set(missing.map((r) => r.client_id)));
    const therapistIds = Array.from(new Set(missing.map((r) => r.therapist_id)));
    const [{ data: clients }, { data: therapists }] = await Promise.all([
      supabase.from("therapist_clients").select("id, full_name, phone").in("id", clientIds),
      supabase.from("therapist_accounts").select("id, full_name, phone, email").in("id", therapistIds),
    ]);
    const clientMap = new Map((clients || []).map((c) => [c.id, c]));
    const therapistMap = new Map((therapists || []).map((t) => [t.id, t]));

    const rowsHtml = missing.map((m) => {
      const c = clientMap.get(m.client_id);
      const t = therapistMap.get(m.therapist_id);
      const waMsg = encodeURIComponent(`Hi ${(t?.full_name || "").split(" ")[0]}, could you please log the session with ${c?.full_name || "the client"} scheduled for ${m.next_appt_date}? Thank you 💙`);
      const link = t?.phone ? `https://wa.me/${normPhone(t.phone)}?text=${waMsg}` : null;
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;">
          <div style="font-weight:600;">${esc(c?.full_name || "(unknown)")}</div>
          <div style="font-size:12px;color:#64748b;">Therapist: ${esc(t?.full_name || "—")} · Session ${esc(m.next_appt_date || "")} · ${esc(m.next_appt_service || "—")}</div>
          ${link ? `<a href="${link}" style="display:inline-block;margin-top:8px;background:#25D366;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;font-weight:700;font-size:12px;">WhatsApp therapist →</a>` : `<span style="font-size:11px;color:#94a3b8;">(no phone)</span>`}
        </td>
      </tr>`;
    }).join("");

    const html = `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#f59e0b;color:#fff;padding:18px 22px;">
          <div style="font-weight:800;font-size:16px;">📋 ${missing.length} missing session log${missing.length === 1 ? "" : "s"} from last week</div>
          <div style="font-size:12px;opacity:.9;margin-top:2px;">Tap "WhatsApp therapist" to nudge — messages are pre-filled.</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
      </div>
    </div>`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    await fetch(RESEND_API_KEY ? "https://api.resend.com/emails" : `${RESEND_GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(RESEND_API_KEY
          ? { Authorization: `Bearer ${RESEND_API_KEY}` }
          : { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": Deno.env.get("RESEND_API_KEY") || "" }),
      },
      body: JSON.stringify({ from: FROM, to: ADMIN_EMAILS, subject: `📋 ${missing.length} missing session log${missing.length === 1 ? "" : "s"} — last week`, html }),
    });

    return new Response(JSON.stringify({ missing: missing.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-missing-log-reminders error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});