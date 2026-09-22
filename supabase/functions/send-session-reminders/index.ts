// Automated next-session reminders for therapy clients.
// Sends an email 2 days before and 1 day before the stored next_session_date.
// Deduped via client_reminder_log (kind + sent_for_date).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "InnerSpark <noreply@innersparkafrica.com>";
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TZ = "Africa/Nairobi";
const SUPPORT_WHATSAPP = "+256 792 085 773";

function nowInNairobi(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
}
function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; err?: string }> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  try {
    const resp = await fetch(RESEND_API_KEY ? "https://api.resend.com/emails" : `${RESEND_GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(RESEND_API_KEY
          ? { Authorization: `Bearer ${RESEND_API_KEY}` }
          : { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": Deno.env.get("RESEND_API_KEY") || "" }),
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!resp.ok) return { ok: false, err: `${resp.status}: ${(await resp.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : "send failed" };
  }
}

function shell(inner: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#3B4FD4;color:#fff;padding:20px 24px;">
        <div style="font-weight:800;font-size:18px;">InnerSpark 💙</div>
        <div style="font-size:12px;opacity:.9;margin-top:2px;">Your therapy session reminder</div>
      </div>
      <div style="padding:24px;font-size:14px;line-height:1.6;">${inner}</div>
      <div style="padding:16px 24px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;">
        Need to reschedule? WhatsApp us on ${SUPPORT_WHATSAPP} and we'll sort it out.
      </div>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const local = nowInNairobi();
    const today = isoDate(local);
    const targets: Array<{ offset: number; kind: string }> = [
      { offset: 2, kind: "session_2d" },
      { offset: 1, kind: "session_1d" },
    ];

    let processed = 0;
    const skipped: string[] = [];

    for (const { offset, kind } of targets) {
      const d = new Date(local);
      d.setDate(local.getDate() + offset);
      const sessionDate = isoDate(d);

      const { data: clients, error } = await supabase
        .from("therapist_clients")
        .select("id, full_name, email, session_type, next_session_date, therapist_id, therapist_accounts(full_name)")
        .eq("next_session_date", sessionDate)
        .not("email", "is", null);
      if (error) throw error;

      for (const c of (clients || []) as any[]) {
        const { data: existing } = await supabase
          .from("client_reminder_log")
          .select("id")
          .eq("client_id", c.id)
          .eq("kind", kind)
          .eq("sent_for_date", sessionDate)
          .maybeSingle();
        if (existing) { skipped.push(c.id); continue; }

        const first = String(c.full_name || "there").split(" ")[0];
        const therapist = c.therapist_accounts?.full_name || "your therapist";
        const pretty = new Date(sessionDate + "T12:00:00").toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long", timeZone: TZ,
        });
        const when = offset === 2 ? "in 2 days" : "tomorrow";
        const html = shell(`
          <p>Hi ${esc(first)} 💙</p>
          <p>This is a gentle reminder that your ${esc(c.session_type || "therapy")} session with
          <strong>${esc(therapist)}</strong> is <strong>${when}</strong> — ${esc(pretty)}.</p>
          <p>A few things that help:</p>
          <ul style="padding-left:20px;">
            <li>Find a quiet, private spot where you won't be interrupted</li>
            <li>Have water and a notebook nearby</li>
            <li>Jot down anything you'd like to talk about</li>
          </ul>
          <p style="color:#64748b;font-size:12px;margin-top:20px;">
            If this time no longer works, WhatsApp us on ${SUPPORT_WHATSAPP} and we'll rebook you.
          </p>
        `);
        const res = await sendEmail(
          c.email,
          offset === 2 ? `Your session is in 2 days, ${first}` : `Reminder: your session is tomorrow, ${first}`,
          html,
        );
        if (res.ok) {
          await supabase.from("client_reminder_log").insert({ client_id: c.id, kind, sent_for_date: sessionDate });
          processed++;
        } else {
          console.error("session reminder send failed", c.id, res.err);
        }
      }
    }

    // --- Admin digest: everyone with a session tomorrow (new AND returning) ---
    let adminDigestSent = 0;
    {
      const d = new Date(local);
      d.setDate(local.getDate() + 1);
      const sessionDate = isoDate(d);

      const { data: tomorrow } = await supabase
        .from("therapist_clients")
        .select("id, full_name, email, phone, client_code, client_type, session_type, next_session_date, therapist_id, therapist_accounts(full_name)")
        .eq("next_session_date", sessionDate);

      const pending: any[] = [];
      for (const c of (tomorrow || []) as any[]) {
        const { data: logged } = await supabase
          .from("client_reminder_log")
          .select("id")
          .eq("client_id", c.id)
          .eq("kind", "admin_digest_1d")
          .eq("sent_for_date", sessionDate)
          .maybeSingle();
        if (!logged) pending.push(c);
      }

      if (pending.length > 0) {
        const pretty = new Date(sessionDate + "T12:00:00").toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ,
        });
        const rows = pending.map((c) => `
          <tr>
            <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;">
              <strong>${esc(c.full_name || "(unnamed)")}</strong>
              ${c.client_code ? `<span style="color:#64748b;"> · ${esc(c.client_code)}</span>` : ""}
              <div style="color:#64748b;font-size:12px;margin-top:2px;">
                ${esc(c.client_type || "—")} · ${esc(c.session_type || "session")} · with ${esc(c.therapist_accounts?.full_name || "unassigned")}
              </div>
              <div style="color:#334155;font-size:12px;margin-top:2px;">
                ${esc(c.phone || "no phone")} · ${esc(c.email || "no email")}
              </div>
            </td>
          </tr>`).join("");

        const html = shell(`
          <p><strong>${pending.length} session${pending.length === 1 ? "" : "s"} tomorrow</strong> — ${esc(pretty)}.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>
          <p style="color:#64748b;font-size:12px;margin-top:18px;">
            Open Admin → Upcoming Sessions for the live follow-up list.
          </p>
        `);
        const res = await sendEmail(
          "info@innersparkafrica.com",
          `Tomorrow: ${pending.length} client session${pending.length === 1 ? "" : "s"} (${pretty})`,
          html,
        );
        if (res.ok) {
          for (const c of pending) {
            await supabase.from("client_reminder_log").insert({
              client_id: c.id, kind: "admin_digest_1d", sent_for_date: sessionDate,
            });
          }
          adminDigestSent = pending.length;
        } else {
          console.error("admin digest send failed", res.err);
        }
      }
    }


    return new Response(JSON.stringify({ processed, skipped: skipped.length, adminDigestSent, today }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-session-reminders error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
