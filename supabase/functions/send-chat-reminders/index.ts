// Scheduled sender for WhatsApp chat reminders captured by Amani.
// Cron-invoked (or manually invoked from admin) every ~15 minutes.
// Picks chat_leads with intent='whatsapp_reminder', delivery_status='scheduled',
// and remind_at <= now(). For each row we:
//   1) email the InnerSpark team a one-tap WhatsApp link (via Resend)
//   2) mark delivery_status='sent' with delivered_at (or 'failed' with error)
// The team taps the link to open pre-filled WhatsApp — this is the "human in the
// loop" delivery model (the site does not run a WhatsApp Business API).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@innersparkafrica.com";
const FROM = "InnerSpark Reminders <noreply@innersparkafrica.com>";
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function normalisePhone(raw: string): string {
  // digits only, strip leading zero, add 256 default if 9-digit UG local
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("256")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "256" + digits.slice(1);
  return digits;
}

function buildWaLink(phone: string, name: string | null) {
  const num = normalisePhone(phone);
  const first = (name || "").split(/\s+/)[0] || "there";
  const text = encodeURIComponent(
    `Hi ${first} 💙 This is Amani from InnerSpark Africa. You asked us to check in when you felt ready — are you still open to booking a session? No pressure, just here whenever you are. — InnerSpark team`
  );
  return `https://wa.me/${num}?text=${text}`;
}

function buildEmail(rows: Array<Record<string, unknown>>) {
  const rowsHtml = rows.map((r) => {
    const phone = String(r.phone || "");
    const name = (r.name as string) || null;
    const link = buildWaLink(phone, name);
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;">
          <div style="font-weight:600;color:#0f172a;">${esc(name || "(unknown)")} <span style="color:#64748b;font-weight:400;">— ${esc(phone)}</span></div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Source: ${esc((r.source_path as string) || "n/a")}</div>
          ${r.message ? `<div style=\"font-size:12px;color:#334155;margin-top:6px;\">${esc((r.message as string).slice(0, 240))}</div>` : ""}
          <a href="${link}" style="display:inline-block;margin-top:8px;background:#25D366;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;font-weight:700;font-size:12px;">Open WhatsApp →</a>
        </td>
      </tr>`;
  }).join("");
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#2563eb;color:#fff;padding:18px 22px;">
          <div style="font-weight:800;font-size:16px;">💬 ${rows.length} scheduled WhatsApp reminder${rows.length === 1 ? "" : "s"} ready</div>
          <div style="font-size:12px;opacity:.9;margin-top:2px;">Tap "Open WhatsApp" to send each reminder — the message is pre-filled.</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        <div style="padding:14px 22px;font-size:11px;color:#64748b;">These leads were captured by Amani and scheduled ~24h ago. Delivery status is logged in Admin → Chat Analytics.</div>
      </div>
    </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const nowIso = new Date().toISOString();
    const { data: due, error } = await supabase
      .from("chat_leads")
      .select("id, name, phone, message, source_path, session_id, created_at")
      .eq("intent", "whatsapp_reminder")
      .in("delivery_status", ["scheduled", "pending"])
      .lte("remind_at", nowIso)
      .not("phone", "is", null)
      .limit(50);

    if (error) throw error;
    if (!due || due.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark attempted
    const ids = due.map((r) => r.id as string);
    await supabase.from("chat_leads")
      .update({ delivery_attempts: 1 as never, last_attempt_at: nowIso })
      .in("id", ids);

    // Send single digest email to admin with per-reminder WhatsApp links
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    let sent = false;
    let errMsg: string | null = null;
    try {
      const resp = await fetch(RESEND_API_KEY ? "https://api.resend.com/emails" : RESEND_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(RESEND_API_KEY ? { Authorization: `Bearer ${RESEND_API_KEY}` } : {}),
        },
        body: JSON.stringify({
          from: FROM,
          to: [ADMIN_EMAIL],
          subject: `💬 ${due.length} WhatsApp reminder${due.length === 1 ? "" : "s"} ready to send`,
          html: buildEmail(due as Array<Record<string, unknown>>),
        }),
      });
      sent = resp.ok;
      if (!resp.ok) errMsg = `Resend ${resp.status}: ${(await resp.text()).slice(0, 200)}`;
    } catch (e) {
      errMsg = e instanceof Error ? e.message : "send failed";
    }

    // Log delivery status per row
    await supabase.from("chat_leads")
      .update({
        delivery_status: sent ? "sent" : "failed",
        delivered_at: sent ? nowIso : null,
        delivery_error: sent ? null : errMsg,
      } as never)
      .in("id", ids);

    // Emit chat_events so admin analytics can chart reminder throughput
    for (const r of due) {
      await supabase.from("chat_events").insert({
        session_id: (r as { session_id?: string }).session_id || null,
        event_type: sent ? "reminder_sent" : "reminder_failed",
        metadata: { lead_id: r.id, error: errMsg } as never,
      });
    }

    return new Response(JSON.stringify({ processed: due.length, sent, error: errMsg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-chat-reminders error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});