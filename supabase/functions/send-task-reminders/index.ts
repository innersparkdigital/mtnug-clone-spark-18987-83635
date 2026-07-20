// Task reminder sender for the Client Portal.
// Modes (via ?mode= query param):
//   hourly  — email clients whose assigned task time_of_day falls in the next hour
//              on today's local Africa/Nairobi date, and hasn't been logged for today
//   weekly  — Sunday evening summary of the coming week's scheduled tasks
// Deduped via client_reminder_log (kind + sent_for_date).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "InnerSpark <noreply@innersparkafrica.com>";
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TZ = "Africa/Nairobi";

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

function scheduleMatchesDate(s: { frequency: string; days_of_week: number[] | null; start_date: string; end_date: string | null }, iso: string): boolean {
  if (s.start_date > iso) return false;
  if (s.end_date && s.end_date < iso) return false;
  if (s.frequency === "daily") return true;
  if (s.frequency === "one_time") return s.start_date === iso;
  const dow = new Date(iso + "T12:00:00").getDay();
  return (s.days_of_week || []).includes(dow);
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
        <div style="font-size:12px;opacity:.9;margin-top:2px;">Your private wellbeing space</div>
      </div>
      <div style="padding:24px;font-size:14px;line-height:1.6;">${inner}</div>
      <div style="padding:16px 24px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;">You're receiving this because your therapist scheduled a check-in. Reply to your therapist if you need to adjust the schedule.</div>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const mode = (url.searchParams.get("mode") || "hourly").toLowerCase();
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const local = nowInNairobi();
    const today = isoDate(local);
    const hourNow = local.getHours();

    // Fetch active schedules + client + tool
    const { data: schedules, error } = await supabase
      .from("assignment_schedules")
      .select("id, assignment_tool_id, client_id, frequency, days_of_week, time_of_day, start_date, end_date, assignment_tools!inner(id, tool_key, title, status), therapist_clients!inner(id, full_name, email, access_token)");
    if (error) throw error;

    const rows = (schedules || []) as unknown as Array<{
      id: string; assignment_tool_id: string; client_id: string; frequency: string;
      days_of_week: number[] | null; time_of_day: string | null; start_date: string; end_date: string | null;
      assignment_tools: { id: string; tool_key: string; title: string | null; status: string };
      therapist_clients: { id: string; full_name: string; email: string | null; access_token: string };
    }>;

    let processed = 0;

    if (mode === "hourly") {
      const kind = "task_hourly";
      // Group tasks by client where time_of_day is within the current hour and today matches
      const perClient = new Map<string, { client: typeof rows[0]["therapist_clients"]; tasks: Array<{ title: string; time: string }> }>();
      for (const r of rows) {
        if (r.assignment_tools.status === "completed") continue;
        if (!scheduleMatchesDate({ frequency: r.frequency, days_of_week: r.days_of_week, start_date: r.start_date, end_date: r.end_date }, today)) continue;
        if (!r.time_of_day) continue;
        const h = parseInt(r.time_of_day.split(":")[0], 10);
        if (h !== hourNow) continue;
        if (!r.therapist_clients.email) continue;
        const bucket = perClient.get(r.client_id) || { client: r.therapist_clients, tasks: [] };
        bucket.tasks.push({ title: r.assignment_tools.title || r.assignment_tools.tool_key, time: r.time_of_day.slice(0, 5) });
        perClient.set(r.client_id, bucket);
      }

      for (const [clientId, { client, tasks }] of perClient) {
        // Dedupe
        const { data: existing } = await supabase
          .from("client_reminder_log")
          .select("id")
          .eq("client_id", clientId)
          .eq("kind", kind)
          .eq("sent_for_date", today)
          .maybeSingle();
        if (existing) continue;

        const first = client.full_name.split(" ")[0];
        const link = `https://www.innersparkafrica.com/my-space/${client.access_token}`;
        const list = tasks.map((t) => `<li><strong>${esc(t.title)}</strong> at ${esc(t.time)}</li>`).join("");
        const html = shell(`
          <p>Hi ${esc(first)} 💙</p>
          <p>A gentle reminder — you have ${tasks.length} check-in${tasks.length === 1 ? "" : "s"} scheduled today:</p>
          <ul style="padding-left:20px;">${list}</ul>
          <p style="margin-top:16px;"><a href="${link}" style="display:inline-block;background:#3B4FD4;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Open my space →</a></p>
          <p style="color:#64748b;font-size:12px;margin-top:20px;">Small steps count. Be proud of showing up.</p>
        `);
        const res = await sendEmail(client.email!, `Your check-in is ready, ${first}`, html);
        if (res.ok) {
          await supabase.from("client_reminder_log").insert({ client_id: clientId, kind, sent_for_date: today });
          processed++;
        } else {
          console.error("send failed", clientId, res.err);
        }
      }
    } else if (mode === "weekly") {
      const kind = "task_weekly";
      // Week ahead: today .. today+6
      const week: string[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(local);
        d.setDate(local.getDate() + i);
        week.push(isoDate(d));
      }
      const perClient = new Map<string, { client: typeof rows[0]["therapist_clients"]; byDay: Record<string, Array<{ title: string; time: string | null }>> }>();
      for (const r of rows) {
        if (r.assignment_tools.status === "completed") continue;
        if (!r.therapist_clients.email) continue;
        for (const iso of week) {
          if (!scheduleMatchesDate({ frequency: r.frequency, days_of_week: r.days_of_week, start_date: r.start_date, end_date: r.end_date }, iso)) continue;
          const bucket = perClient.get(r.client_id) || { client: r.therapist_clients, byDay: {} };
          const list = bucket.byDay[iso] || [];
          list.push({ title: r.assignment_tools.title || r.assignment_tools.tool_key, time: r.time_of_day ? r.time_of_day.slice(0, 5) : null });
          bucket.byDay[iso] = list;
          perClient.set(r.client_id, bucket);
        }
      }
      for (const [clientId, { client, byDay }] of perClient) {
        if (Object.keys(byDay).length === 0) continue;
        const { data: existing } = await supabase
          .from("client_reminder_log")
          .select("id")
          .eq("client_id", clientId)
          .eq("kind", kind)
          .eq("sent_for_date", today)
          .maybeSingle();
        if (existing) continue;

        const first = client.full_name.split(" ")[0];
        const link = `https://www.innersparkafrica.com/my-space/${client.access_token}`;
        const dayRows = week
          .filter((iso) => byDay[iso])
          .map((iso) => {
            const label = new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: TZ });
            const items = byDay[iso].map((t) => `<li>${esc(t.title)}${t.time ? ` <span style="color:#64748b;">· ${esc(t.time)}</span>` : ""}</li>`).join("");
            return `<div style="margin-bottom:14px;"><div style="font-weight:600;color:#3B4FD4;">${esc(label)}</div><ul style="padding-left:20px;margin:6px 0;">${items}</ul></div>`;
          })
          .join("");
        const html = shell(`
          <p>Hi ${esc(first)} 💙</p>
          <p>Here's your week ahead — small, gentle steps your therapist has set for you:</p>
          ${dayRows}
          <p style="margin-top:16px;"><a href="${link}" style="display:inline-block;background:#3B4FD4;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Open my space →</a></p>
        `);
        const res = await sendEmail(client.email!, `Your week ahead at InnerSpark`, html);
        if (res.ok) {
          await supabase.from("client_reminder_log").insert({ client_id: clientId, kind, sent_for_date: today });
          processed++;
        }
      }
    } else {
      return new Response(JSON.stringify({ error: "unknown mode" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ processed, mode }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-task-reminders error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});