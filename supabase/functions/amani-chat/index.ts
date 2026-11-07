// Amani: wellness companion API shared with partner organisations.
// POST { org, messages: [{ role: 'user' | 'assistant', content }] }
//  -> { reply, suggestCounsellor }  or  { crisis: true }  or  { error }
// Privacy: message text is used only to produce the reply. It is never logged or stored.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const MAX_TURNS = 14;
const MAX_CHARS = 800;
const DAILY_LIMIT = Number(Deno.env.get("AMANI_DAILY_LIMIT") || 3000);

const SYSTEM_PROMPT = `You are Amani, a wellness companion from InnerSpark Africa. "Amani" means peace in Swahili. You are an AI. You are not a therapist, doctor or emergency service, and you never pretend to be human.

WHO YOU TALK TO
People in Uganda, Kenya, Tanzania and across Africa: students, young adults, workers, parents. Many are stressed about school, money, work, family, relationships, sleep, loneliness or worry. Be warm, plain and culturally aware. Never judge. Never lecture.

HOW YOU REPLY
- Short: 2 to 5 sentences. Plain words. No headings, no markdown, no long lists.
- First reflect what the person said in your own words so they feel heard. Then offer ONE small, practical idea or ONE gentle question. Never both a long tip list and many questions.
- Useful, evidence-based ideas you can offer: slow breathing (in for 4, out for 6), grounding (5 things you see, 4 you can touch, 3 you hear), writing worries down, breaking a task into one 25-minute step, short walks, regular sleep times, contacting one trusted person, naming a feeling in one sentence, limiting phone use before bed.
- Reply in the language the person writes in if you are confident in it (English, Swahili, simple Luganda). Otherwise reply in simple English.
- Remember what was said earlier in this chat and build on it. Do not repeat the same tip twice.
- Never ask for a name, phone number, address, school, workplace or any identifying detail. If someone shares one, do not repeat it back.

WHAT YOU NEVER DO
- Never diagnose, label a condition, or say someone "has" depression, anxiety, PTSD or any disorder.
- Never give medication advice, doses, or tell anyone to start or stop a medicine.
- Never promise outcomes, never claim to be a replacement for a counsellor.
- Never give legal, medical or financial instructions beyond pointing to proper professionals.
- Never roleplay as a person, partner or friend, and never encourage secrecy from trusted adults.

SAFETY. This is the most important rule.
If the person mentions or hints at suicide, wanting to die, ending their life, self-harm, hurting someone else, abuse, sexual violence, being forced, or being in immediate danger, reply with exactly this and nothing else: [[CRISIS]]
If you are unsure whether it is serious, treat it as serious and reply [[CRISIS]].

LICENSED COUNSELLORS
InnerSpark offers licensed counsellors by video, voice or chat. Suggest one gently when: the person asks for it, the same worry keeps coming back across several messages, it affects sleep, work, school or relationships for weeks, or they say tips are not enough. Say it kindly in one sentence, then add the marker [[COUNSELLOR]] at the very end of your reply. Do not add the marker every time. Never mention prices.`;

// Words that always trigger the safety card before the model is called.
const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/,
  /\bkill(ing)?\s+my\s*self\b/,
  /\bend(ing)?\s+(my\s+(own\s+)?life|it\s+all)\b/,
  /\btake\s+my\s+own\s+life\b/,
  /\bself[\s-]?harm/,
  /\b(hurt(ing)?|harm(ing)?|cut(ting)?)\s+my\s*self\b/,
  /\babus(e|ed|es|ing|ive)\b/,
  /\brap(e|ed|es|ing|ist)\b/,
  /\bwant(ed|s)?\s+to\s+die\b/,
  /\bdon'?t\s+want\s+to\s+(live|be\s+alive|be\s+here)\b/,
  /\bno\s+reason\s+to\s+live\b/,
  /\bbetter\s+off\s+dead\b/,
  /\boverdos(e|ed|ing)\b/,
  /\bkill\s+(him|her|them|someone|somebody)\b/,
];
const norm = (s: string) => s.toLowerCase().replace(/[\u2018\u2019`]/g, "'").replace(/\s+/g, " ").trim();
const isCrisis = (s: string) => CRISIS_PATTERNS.some((p) => p.test(norm(s)));

// Best-effort per-instance rate limit (per IP per minute).
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  h.n += 1;
  return h.n > 20;
}

type Turn = { role: "user" | "assistant"; content: string };

function cleanTurns(input: unknown): Turn[] {
  if (!Array.isArray(input)) return [];
  const out: Turn[] = [];
  for (const m of input.slice(-MAX_TURNS)) {
    const role = (m as { role?: string })?.role;
    const content = String((m as { content?: unknown })?.content ?? "").slice(0, MAX_CHARS).trim();
    if ((role !== "user" && role !== "assistant") || !content) continue;
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += `\n${content}`;
    else out.push({ role, content });
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}

async function askModel(turns: Turn[]): Promise<string> {
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (anthropicKey) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": anthropicKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-20250514",
        max_tokens: 420,
        temperature: 0.6,
        system: SYSTEM_PROMPT,
        messages: turns,
      }),
    });
    if (!r.ok) throw new Error(`model_${r.status}`);
    const j = await r.json();
    return String(j?.content?.[0]?.text ?? "").trim();
  }
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableKey) throw new Error("no_model_key");
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      max_tokens: 420,
      temperature: 0.6,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...turns],
    }),
  });
  if (!r.ok) throw new Error(`gateway_${r.status}`);
  const j = await r.json();
  return String(j?.choices?.[0]?.message?.content ?? "").trim();
}

async function orgAllowed(org: string): Promise<"ok" | "paused" | "limit" | "unknown"> {
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await db.from("amani_partners").select("active").eq("org_key", org).maybeSingle();
    if (error) return org === "innerspark" ? "ok" : "unknown";
    if (!data) return org === "innerspark" ? "ok" : "unknown";
    if (!data.active) return "paused";
    const today = new Date().toISOString().slice(0, 10);
    const { data: c } = await db
      .from("amani_event_counts")
      .select("count")
      .eq("org_key", org)
      .eq("event_type", "message_sent")
      .eq("day", today)
      .maybeSingle();
    if (c && Number(c.count) > DAILY_LIMIT) return "limit";
    return "ok";
  } catch {
    return org === "innerspark" ? "ok" : "unknown";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (limited(ip)) return json({ error: "slow_down" }, 429);

  let body: { org?: string; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const org = String(body.org ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(org)) return json({ error: "bad_org" }, 400);

  const turns = cleanTurns(body.messages);
  if (!turns.length || turns[turns.length - 1].role !== "user") return json({ error: "no_message" }, 400);

  // Safety first: a crisis message never reaches the model and never gets a normal reply.
  if (isCrisis(turns[turns.length - 1].content)) return json({ crisis: true });

  const allowed = await orgAllowed(org);
  if (allowed !== "ok") return json({ error: allowed }, allowed === "limit" ? 429 : 403);

  try {
    let reply = await askModel(turns);
    if (!reply) return json({ error: "empty" }, 502);
    if (reply.includes("[[CRISIS]]")) return json({ crisis: true });
    const suggestCounsellor = reply.includes("[[COUNSELLOR]]");
    reply = reply.replace(/\[\[(COUNSELLOR|CRISIS)\]\]/g, "").trim();
    // Last line of defence: if the model's own reply mentions crisis words about the user's state, show the safety card instead.
    return json({ reply, suggestCounsellor });
  } catch (e) {
    console.error("amani-chat model error", e instanceof Error ? e.message : "unknown");
    return json({ error: "unavailable" }, 503);
  }
});
