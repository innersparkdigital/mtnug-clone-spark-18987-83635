// Daily digest of chat activity (last 24h, EAT) emailed to admin.
// Triggered by pg_cron once per day. Idempotent — safe to re-run.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@innersparkafrica.com";
const FROM = "InnerSpark Alerts <noreply@innersparkafrica.com>";
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

function escapeHtml(s: string): string {
  return (s ?? "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function nairobiDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { timeZone: "Africa/Nairobi", day: "2-digit", month: "short", year: "numeric" });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch in parallel
    const [sessionsRes, leadsRes, crisesRes, messagesRes] = await Promise.all([
      supabase.from("chat_sessions").select("id, created_at, summary, tag, risk_level").gte("created_at", since),
      supabase.from("chat_leads").select("id, created_at, name, phone, email, intent, status, source_path").gte("created_at", since).order("created_at", { ascending: false }),
      supabase.from("chat_sessions").select("id, created_at, summary, anonymous_id, source_path").gte("created_at", since).eq("risk_level", "high").order("created_at", { ascending: false }),
      supabase.from("chat_messages").select("id").gte("created_at", since),
    ]);

    const sessions = sessionsRes.data || [];
    const leads = leadsRes.data || [];
    const crises = crisesRes.data || [];
    const messageCount = messagesRes.data?.length || 0;

    // Topic counts
    const tagCounts: Record<string, number> = {};
    for (const s of sessions) {
      const t = (s as any).tag || "uncategorized";
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
    const topTopics = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const newLeads = leads.filter((l: any) => l.status === "new").length;

    const todayLabel = nairobiDate(new Date());

    const subject = `📊 InnerSpark Chat Digest — ${todayLabel} (${sessions.length} chats, ${leads.length} leads${crises.length ? `, ${crises.length} 🚨` : ""})`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;padding:22px;">
            <div style="font-weight:800;font-size:18px;">📊 Chat Activity Digest</div>
            <div style="font-size:13px;opacity:.9;margin-top:4px;">Last 24 hours • ${escapeHtml(todayLabel)} (EAT)</div>
          </div>

          <div style="padding:20px 22px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
              <tr>
                <td style="background:#eff6ff;border-radius:8px;padding:14px;text-align:center;width:25%;">
                  <div style="font-size:11px;color:#1e40af;text-transform:uppercase;font-weight:700;">Chats</div>
                  <div style="font-size:24px;font-weight:800;color:#1e3a8a;">${sessions.length}</div>
                </td>
                <td style="width:6px;"></td>
                <td style="background:#ecfdf5;border-radius:8px;padding:14px;text-align:center;width:25%;">
                  <div style="font-size:11px;color:#047857;text-transform:uppercase;font-weight:700;">New leads</div>
                  <div style="font-size:24px;font-weight:800;color:#064e3b;">${newLeads}</div>
                </td>
                <td style="width:6px;"></td>
                <td style="background:${crises.length ? "#fef2f2" : "#f1f5f9"};border-radius:8px;padding:14px;text-align:center;width:25%;">
                  <div style="font-size:11px;color:${crises.length ? "#991b1b" : "#475569"};text-transform:uppercase;font-weight:700;">Crises</div>
                  <div style="font-size:24px;font-weight:800;color:${crises.length ? "#7f1d1d" : "#0f172a"};">${crises.length}</div>
                </td>
                <td style="width:6px;"></td>
                <td style="background:#fef3c7;border-radius:8px;padding:14px;text-align:center;width:25%;">
                  <div style="font-size:11px;color:#92400e;text-transform:uppercase;font-weight:700;">Messages</div>
                  <div style="font-size:24px;font-weight:800;color:#78350f;">${messageCount}</div>
                </td>
              </tr>
            </table>

            ${crises.length ? `
              <h3 style="font-size:14px;color:#991b1b;margin:18px 0 8px;">🚨 High-risk sessions (${crises.length})</h3>
              <div style="border:1px solid #fecaca;border-radius:8px;overflow:hidden;">
                ${crises.slice(0, 10).map((c: any) => `
                  <div style="padding:10px 12px;border-bottom:1px solid #fee2e2;font-size:13px;">
                    <div style="color:#7f1d1d;font-weight:600;">${escapeHtml(c.summary || "(no summary)")}</div>
                    <div style="font-size:11px;color:#991b1b;margin-top:2px;">${escapeHtml(new Date(c.created_at).toLocaleString("en-GB", { timeZone: "Africa/Nairobi" }))} • ${escapeHtml(c.source_path || "—")}</div>
                  </div>
                `).join("")}
              </div>
              <a href="https://www.innersparkafrica.com/admin?tab=crisis-queue" style="display:inline-block;background:#dc2626;color:#fff;padding:9px 16px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;margin-top:10px;">Open Crisis Queue →</a>
            ` : ""}

            ${leads.length ? `
              <h3 style="font-size:14px;color:#1e40af;margin:22px 0 8px;">🆕 Leads (${leads.length})</h3>
              <div style="border:1px solid #dbeafe;border-radius:8px;overflow:hidden;">
                ${leads.slice(0, 15).map((l: any) => `
                  <div style="padding:10px 12px;border-bottom:1px solid #e0e7ff;font-size:13px;display:flex;justify-content:space-between;gap:8px;">
                    <div>
                      <strong>${escapeHtml(l.name || "—")}</strong>
                      ${l.phone ? ` • <a href="tel:${escapeHtml(l.phone)}" style="color:#2563eb;">${escapeHtml(l.phone)}</a>` : ""}
                      ${l.intent ? ` <span style="background:#dbeafe;color:#1e40af;padding:1px 6px;border-radius:999px;font-size:10px;font-weight:600;">${escapeHtml(l.intent)}</span>` : ""}
                      <div style="font-size:11px;color:#64748b;margin-top:2px;">${escapeHtml(new Date(l.created_at).toLocaleString("en-GB", { timeZone: "Africa/Nairobi" }))}</div>
                    </div>
                    <span style="font-size:10px;text-transform:uppercase;background:#f1f5f9;color:#475569;padding:2px 6px;border-radius:4px;height:fit-content;">${escapeHtml(l.status)}</span>
                  </div>
                `).join("")}
              </div>
              <a href="https://www.innersparkafrica.com/admin?tab=chat-leads" style="display:inline-block;background:#2563eb;color:#fff;padding:9px 16px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;margin-top:10px;">Open Leads →</a>
            ` : ""}

            ${topTopics.length ? `
              <h3 style="font-size:14px;color:#0f172a;margin:22px 0 8px;">🏷️ Top topics</h3>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${topTopics.map(([t, n]) => `<span style="background:#f1f5f9;color:#0f172a;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;">${escapeHtml(t)} · ${n}</span>`).join("")}
              </div>
            ` : ""}

            ${sessions.length === 0 && leads.length === 0 ? `
              <p style="color:#64748b;font-size:13px;text-align:center;padding:20px;">No chat activity in the last 24 hours.</p>
            ` : ""}

            <p style="font-size:11px;color:#94a3b8;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px;">Automated daily summary from the InnerSpark AI assistant.</p>
          </div>
        </div>
      </div>`;

    const resp = await fetch(RESEND_GATEWAY_URL + "/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY || RESEND_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [ADMIN_EMAIL], subject, html }),
    });

    // Fallback to direct Resend API if gateway not used
    if (!resp.ok) {
      const direct = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [ADMIN_EMAIL], subject, html }),
      });
      if (!direct.ok) {
        const txt = await direct.text();
        throw new Error(`Resend send failed: ${direct.status} ${txt}`);
      }
    }

    return new Response(JSON.stringify({ ok: true, sessions: sessions.length, leads: leads.length, crises: crises.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat-daily-digest error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});