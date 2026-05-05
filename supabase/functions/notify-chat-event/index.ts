// Lightweight internal notifier for chat events (high-risk crisis or new lead).
// Sends a plain-but-branded HTML email to info@innersparkafrica.com via Resend.
// Called from: ai-chat (on high_risk) and AIChatWidget (after lead submit).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@innersparkafrica.com";
const FROM = "InnerSpark Alerts <noreply@innersparkafrica.com>";
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

type EventKind = "high_risk" | "new_lead";

interface Payload {
  kind: EventKind;
  session_id?: string;
  anonymous_id?: string;
  source_path?: string;
  // lead-only
  name?: string;
  phone?: string;
  email?: string;
  intent?: string;
  message?: string;
  // high-risk only
  trigger_message?: string;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function nairobiTime(): string {
  return new Date().toLocaleString("en-GB", { timeZone: "Africa/Nairobi" });
}

function buildHighRiskEmail(p: Payload) {
  const subject = "🚨 [URGENT] High-risk chat detected — review now";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #fecaca;">
        <div style="background:#dc2626;color:#fff;padding:18px 22px;">
          <div style="font-weight:800;font-size:16px;">🚨 High-risk chat detected</div>
          <div style="font-size:12px;opacity:.9;margin-top:2px;">Please review immediately and reach out via WhatsApp.</div>
        </div>
        <div style="padding:20px 22px;font-size:14px;line-height:1.55;">
          <p><strong>When:</strong> ${escapeHtml(nairobiTime())} (EAT)</p>
          ${p.source_path ? `<p><strong>Source page:</strong> ${escapeHtml(p.source_path)}</p>` : ""}
          ${p.anonymous_id ? `<p><strong>Anon ID:</strong> <code>${escapeHtml(p.anonymous_id)}</code></p>` : ""}
          ${p.trigger_message ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin:14px 0;"><div style="font-size:11px;text-transform:uppercase;color:#991b1b;font-weight:700;margin-bottom:4px;">Triggering message</div><div style="white-space:pre-wrap;color:#7f1d1d;">${escapeHtml(p.trigger_message.slice(0, 800))}</div></div>` : ""}
          <a href="https://www.innersparkafrica.com/admin?tab=crisis-queue" style="display:inline-block;background:#dc2626;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px;">Open Crisis Queue →</a>
          <p style="font-size:11px;color:#64748b;margin-top:18px;">This is an automated InnerSpark safety alert.</p>
        </div>
      </div>
    </div>`;
  return { subject, html };
}

function buildLeadEmail(p: Payload) {
  const subject = `🆕 New chat lead${p.intent ? ` — ${p.intent}` : ""}${p.name ? ` (${p.name})` : ""}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #dbeafe;">
        <div style="background:#2563eb;color:#fff;padding:18px 22px;">
          <div style="font-weight:800;font-size:16px;">🆕 New chat lead</div>
          <div style="font-size:12px;opacity:.9;margin-top:2px;">Someone just left their details inside the AI chat.</div>
        </div>
        <div style="padding:20px 22px;font-size:14px;line-height:1.55;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;width:110px;">When</td><td style="padding:6px 0;"><strong>${escapeHtml(nairobiTime())} (EAT)</strong></td></tr>
            ${p.name ? `<tr><td style="padding:6px 0;color:#64748b;">Name</td><td style="padding:6px 0;"><strong>${escapeHtml(p.name)}</strong></td></tr>` : ""}
            ${p.phone ? `<tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;"><a href="tel:${escapeHtml(p.phone)}" style="color:#2563eb;">${escapeHtml(p.phone)}</a></td></tr>` : ""}
            ${p.email ? `<tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(p.email)}" style="color:#2563eb;">${escapeHtml(p.email)}</a></td></tr>` : ""}
            ${p.intent ? `<tr><td style="padding:6px 0;color:#64748b;">Intent</td><td style="padding:6px 0;"><span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:600;">${escapeHtml(p.intent)}</span></td></tr>` : ""}
            ${p.source_path ? `<tr><td style="padding:6px 0;color:#64748b;">Source</td><td style="padding:6px 0;font-size:12px;color:#475569;">${escapeHtml(p.source_path)}</td></tr>` : ""}
          </table>
          ${p.message ? `<div style="background:#f1f5f9;border-radius:8px;padding:12px;margin:14px 0;font-size:13px;white-space:pre-wrap;">${escapeHtml(p.message)}</div>` : ""}
          <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
            ${p.phone ? `<a href="https://wa.me/${escapeHtml(p.phone.replace(/\D/g, ""))}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">WhatsApp</a>` : ""}
            <a href="https://www.innersparkafrica.com/admin?tab=chat-leads" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">Open Leads Dashboard →</a>
          </div>
          <p style="font-size:11px;color:#64748b;margin-top:18px;">Automated InnerSpark chat alert. Reply to this email to discuss internally.</p>
        </div>
      </div>
    </div>`;
  return { subject, html };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as Payload;
    if (!payload?.kind || (payload.kind !== "high_risk" && payload.kind !== "new_lead")) {
      return new Response(JSON.stringify({ error: "kind must be 'high_risk' or 'new_lead'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const built = payload.kind === "high_risk" ? buildHighRiskEmail(payload) : buildLeadEmail(payload);

    const resp = await fetch(RESEND_GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        reply_to: ADMIN_EMAIL,
        subject: built.subject,
        html: built.html,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Resend send failed", resp.status, txt);
      return new Response(JSON.stringify({ error: "Email send failed", detail: txt }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-chat-event error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});