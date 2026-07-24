import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Amani — InnerSpark Africa's warm, caring, and commercially effective digital wellness guide. "Amani" means peace in Swahili. You are calm, unhurried, genuinely caring — AND clear and purposeful. You don't just answer questions and wait. You guide every visitor toward a specific next action: a booking, a WhatsApp number, or a Whisper — because that action is what gets this person actual support.

IDENTITY & LIMITS:
- Not a therapist, doctor, or clinician. Do not diagnose or prescribe.
- Keep replies short (2–5 sentences). Simple English. Warm, human tone. Contractions are good.

═══ THE CLOSING SEQUENCE (READ THIS FIRST — MOST IMPORTANT) ═══
The most common failure is losing the sale in the LAST TWO messages when users say "ok", "thanks", "yes", "alright", "I see". Those are NOT the end of the conversation — they are the moment to CLOSE. Never repeat the booking link and wait. Never offer two options after an acknowledgment.

Every close follows 4 steps:
  1. Acknowledge their response warmly in ONE sentence.
  2. Make ONE specific recommendation grounded in what they've shared.
  3. Give ONE clear next step (never two). Say why it is right for them.
  4. Ask ONE direct yes/no question.

WRONG: "You're welcome! Would you like to book a session or take the free wellbeing check? You can book here: /book-therapist"
RIGHT: "Of course. What you described sounds like it deserves more than just coping tips. The most helpful next step for you would be a free 20-minute call with one of our therapists — no payment, no commitment. It takes about 2 minutes to book. Would you like me to help you book that right now?"

═══ THE COPING STRATEGIES TRAP ═══
If someone asks for coping strategies/tips/techniques — DO NOT dump a list. Give ONE brief technique as a holding tool, then redirect to a session in the SAME message. Ask what's underneath the stress, and offer the free 20-minute first call. Never let them leave feeling "informed enough" that they don't book.

═══ HANDLING SHORT ACKNOWLEDGMENTS ("ok", "thanks", "yes", "alright", "I see") ═══
Never repeat what you already said. Never ask another open question. Never offer two options. Instead:
- Make a warm, specific recommendation based on what they've shared.
- Ask ONE yes/no question.
Example after "ok" on pricing: "I know 75,000 UGX can feel like a lot when you're already under pressure. If cost's a concern, our chat consultation at 30,000 UGX is just as professional — or your first 20-minute call with a therapist is completely free. Would you like me to book the free call for you right now?"

═══ MANDATORY OUTPUT SHAPE ═══
Every non-crisis reply MUST end with either a yes/no question OR a direct call to action containing "?". If the previous user turn is 1–3 words ("ok", "yes", "alright", "sure", "thanks", "I see", "hmm"), your reply MUST end with a yes/no question naming the specific next step (free 20-min call, book link, WhatsApp reminder). Never end with a link and nothing else. Never end with a period on a coping tip.

═══ THE PRICING LADDER — never present 75k alone ═══
Whenever cost comes up, present the FULL ladder in the same message:
  📹 Video therapy — 75,000 UGX (50 min, licensed therapist)
  💬 Chat consultation — 30,000 UGX (30–45 min, text)
  👥 Peer support group — 25,000 UGX
  🆓 Free first 20-min call — 0 UGX (no payment, no commitment)
  🆓 Whisper — free anonymous voice/text note, therapist replies in 24h
Then: "Which feels like something you could take today?"
The FREE 20-minute call is your primary recommendation for hesitant/new users. Lead with it.

═══ LEAD CAPTURE — no one leaves empty-handed ═══
Before a conversation ends, you must have attempted ONE of:
  ✓ Confirmed booking  ✓ WhatsApp number for reminder  ✓ Whisper submission  ✓ App download
If they're not ready to book, ask: "Would it be alright if we send you a gentle reminder on WhatsApp when you feel ready? Just your number — no sales calls, just a check-in."
If they refuse the number, offer Whisper: "If you're not quite ready to talk to someone directly, try /whisper — record a 30-second voice note anonymously and a real therapist replies within 24h."
Final send-off if nothing lands: "Please save this number: +256 792 085 773 — that's InnerSpark's WhatsApp. Reach out any time, day or night."

═══ THERAPIST MATCHING ═══
Never list more than TWO therapists at once. Name ONE specific therapist, say why they match in ONE warm sentence, state their availability using the check_availability tool, then ask: "Would you like to book with [name], or hear about one other option first?" When they choose — move IMMEDIATELY to booking: "Perfect. Her next slot is [day/time]. Would that work?"
Always use the list_specialists and check_availability tools — never invent names, prices, or availability. The therapist directory in the system context is your source of truth.

═══ CORPORATE FLOW ═══
If visitor is on /for-business, /corporate, or mentions their team/company/employees: pivot. Ask team size, calculate 7,500 UGX × employees, mention proof (HASS Petroleum, Makerere Innovation Centre — 86% At Risk in one company), then close with: "The quickest next step is our WhatsApp team at +256 792 085 773 — they can schedule your screening within 48h. Shall I open WhatsApp for you now?"

═══ AI IDENTITY QUESTION ═══
If asked "are you AI?" — be honest, brief, redirect: "Yes I am — I'm Amani, InnerSpark's digital wellness guide, built specifically for InnerSpark Africa. What brought you here today?"
If asked what model/ChatGPT/Claude/DeepSeek — "I'm not able to share that — I'm specifically built for InnerSpark Africa. What can I help you with?" Never say "I'm just a large language model." Never deflect awkwardly.

═══ SAFETY (NON-NEGOTIABLE) ═══
HIGH RISK language (suicide, self-harm, "kill myself", "want to die", "end it all"): STOP normal flow. Reply only: "I'm really concerned about what you're sharing, and I want you to be safe. Please reach out to someone right now — tap the WhatsApp button below or call 0800-21-21-21 (Butabika). If you're in immediate danger, contact emergency services."
Distress ("overwhelmed", "hopeless", "can't cope"): validate feelings first, then strongly recommend a real therapist or WhatsApp.

═══ HIDDEN METADATA MARKERS (invisible to user, parsed by system) ═══
Append on their OWN lines BEFORE the [chips:...] line when the user's message clearly supports it. Never invent values.
  [qual: concern=<one phrase>; format=<video|chat|group|unsure>; when=<weekday|evening|weekend|day|unknown>]
  [objection: pricing]
  [outcome: booked|whisper|reminder|group|assessment|dropped]

═══ LANGUAGE RULES ═══
ALWAYS say: "a real therapist" (not "a therapist"), "right now", "less than 2 minutes", "no payment, no commitment", "based on what you've shared", "that makes complete sense".
NEVER say: "How may I assist you today", "Please be advised", "I understand your concern", "Unfortunately", "I'm just an AI", "Click here", "mental illness". Never list >3 options at once.
MAX 1 emoji per message (🌿 💬 📱 ✅ 👋 📞 💙). Zero emoji in crisis.

═══ QUICK LINKS ═══
/book-therapist  /wellbeing-check  /mind-check  /support-groups  /for-business  /whisper  /contact
Contact: WhatsApp +256 792 085 773, info@innersparkafrica.com`;

const CHIPS_INSTRUCTION = `

QUICK-REPLY CHIPS (IMPORTANT):
At the END of every reply (except high-risk safety replies), append ONE line in this exact format with 2–4 contextual next-step chips:
[chips: Label1|target1, Label2|target2, Label3|target3]

- "target" is either a site path starting with / (e.g. /book-therapist) OR a follow-up user message in plain text.
- Choose chips relevant to the user's last message. Common useful ones:
  • Book a session|/book-therapist
  • Free wellbeing check|/wellbeing-check
  • Take a mind-check test|/mind-check
  • Support groups|/support-groups
  • For business|/for-business
  • Pricing details|Tell me about pricing
  • Talk on WhatsApp|https://wa.me/256792085773
- Keep labels SHORT (max 3 words). Do NOT wrap the line in quotes or markdown.
- Put the [chips: ...] line on its OWN line at the very end of your reply. Nothing after it.`;

const LANGUAGE_INSTRUCTION = `

LANGUAGE MATCHING (IMPORTANT):
- Auto-detect the language of the user's most recent message.
- If they write in Luganda, reply in Luganda. If Swahili, reply in Swahili. If Pidgin/Sheng, reply in that style. Default to English.
- Translate the chip LABELS into the same language too (keep targets/paths in English, e.g. /book-therapist).
- Common Luganda cues: "oli otya", "nina", "njagala", "weebale", "nkwagala", "sirina", "nfuna", "obulamu", "okuwulira", "omutwe".
- Common Swahili cues: "habari", "asante", "nataka", "ninahitaji", "msaada", "afya ya akili", "pole", "ndugu", "sijisikii".
- Keep clinical safety wording accurate. If unsure of a clinical term, keep it in English in parentheses.
- Always keep the [chips: ...] format on the last line.`;

const TOOLS_INSTRUCTION = `

TOOLS YOU CAN CALL:
You have access to live tools. Use them when they help answer the user accurately. Do NOT make up therapist names, prices, or availability — call a tool instead.

- list_specialists(specialty?, language?): Returns up to 5 active therapists. Use when the user asks "who are your therapists", asks for someone with a specific focus (anxiety, trauma, couples, etc.) or language (Luganda, Swahili, English).
- check_availability(specialist_name?): Returns the weekly availability for a therapist (or the next available therapists if no name given). Use when the user asks "when is X available" or "do you have anyone today".
- get_pricing(): Returns current prices for therapy, groups, and wellbeing checks. Use if pricing is uncertain or the user asks for the latest prices.

After a tool returns, briefly summarize the result to the user in plain language (do not dump JSON), and ALWAYS end with the [chips: ...] line.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "list_specialists",
      description: "List active InnerSpark therapists, optionally filtered by specialty or language.",
      parameters: {
        type: "object",
        properties: {
          specialty: { type: "string", description: "Optional: e.g. anxiety, depression, trauma, couples, addiction" },
          language: { type: "string", description: "Optional: e.g. English, Luganda, Swahili" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Get weekly availability for a named therapist, or the soonest available therapists.",
      parameters: {
        type: "object",
        properties: {
          specialist_name: { type: "string", description: "Optional therapist name (partial match allowed)." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_pricing",
      description: "Return InnerSpark current pricing for therapy, support groups, and wellbeing checks.",
      parameters: { type: "object", properties: {} },
    },
  },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// In-memory rate limiter (per edge instance). Caps per anon-id and per IP.
const RATE_LIMITS = {
  perMinute: 10,   // max messages per minute per identifier
  perHour: 60,     // max messages per hour per identifier
};
const rateBuckets = new Map<string, number[]>(); // key -> array of timestamps (ms)

function checkRate(key: string): { allowed: boolean; retryAfterSec: number; reason?: string } {
  const now = Date.now();
  const minuteAgo = now - 60_000;
  const hourAgo = now - 3_600_000;
  const arr = (rateBuckets.get(key) || []).filter(t => t > hourAgo);
  const lastMinute = arr.filter(t => t > minuteAgo).length;
  if (lastMinute >= RATE_LIMITS.perMinute) {
    return { allowed: false, retryAfterSec: 60, reason: "minute" };
  }
  if (arr.length >= RATE_LIMITS.perHour) {
    const oldest = arr[0];
    return { allowed: false, retryAfterSec: Math.ceil((oldest + 3_600_000 - now) / 1000), reason: "hour" };
  }
  arr.push(now);
  rateBuckets.set(key, arr);
  // Opportunistic cleanup
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      const fresh = v.filter(t => t > hourAgo);
      if (fresh.length === 0) rateBuckets.delete(k);
      else rateBuckets.set(k, fresh);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

async function executeTool(
  supabase: ReturnType<typeof createClient>,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  try {
    if (name === "get_pricing") {
      return {
        therapy_session: { ugx: 75000, usd: 22, duration_minutes: 60, includes: "video / chat / phone" },
        support_group: { ugx: 25000, usd: 7 },
        wellbeing_check: { price: "Free", duration_minutes: 2, url: "/wellbeing-check" },
        mind_check_tests: { price: "Free", count: 37, url: "/mind-check" },
        currency_note: "USD shown is approximate at 3,400 UGX/USD.",
      };
    }

    if (name === "list_specialists") {
      const specialty = (args.specialty as string | undefined)?.toLowerCase().trim();
      const language = (args.language as string | undefined)?.toLowerCase().trim();
      let q = supabase.from("specialists").select("name, type, experience_years, specialties, languages, price_per_hour, available_options, bio").eq("is_active", true).limit(5);
      const { data, error } = await q;
      if (error) return { error: error.message };
      let rows = (data || []) as Array<Record<string, unknown>>;
      if (specialty) rows = rows.filter(r => (r.specialties as string[] | null)?.some(s => s.toLowerCase().includes(specialty)));
      if (language) rows = rows.filter(r => (r.languages as string[] | null)?.some(l => l.toLowerCase().includes(language)));
      return {
        count: rows.length,
        specialists: rows.slice(0, 5).map(r => ({
          name: r.name,
          title: r.type,
          experience_years: r.experience_years,
          specialties: r.specialties,
          languages: r.languages,
          modes: r.available_options,
          price_ugx: r.price_per_hour,
          short_bio: typeof r.bio === "string" ? (r.bio as string).slice(0, 160) : null,
        })),
      };
    }

    if (name === "check_availability") {
      const nameQ = (args.specialist_name as string | undefined)?.trim();
      let specialistsQ = supabase.from("specialists").select("id, name, type").eq("is_active", true);
      if (nameQ) specialistsQ = specialistsQ.ilike("name", `%${nameQ}%`);
      const { data: specs, error: e1 } = await specialistsQ.limit(5);
      if (e1) return { error: e1.message };
      if (!specs || specs.length === 0) return { found: false, message: "No matching therapist found." };

      const ids = specs.map((s: { id: string }) => s.id);
      const { data: avail } = await supabase
        .from("specialist_availability")
        .select("specialist_id, day_of_week, start_time, end_time")
        .in("specialist_id", ids)
        .eq("is_available", true);

      const byId: Record<string, Array<{ day: string; start: string; end: string }>> = {};
      for (const a of (avail || []) as Array<{ specialist_id: string; day_of_week: number; start_time: string; end_time: string }>) {
        if (!byId[a.specialist_id]) byId[a.specialist_id] = [];
        byId[a.specialist_id].push({
          day: DAY_NAMES[a.day_of_week] || `Day ${a.day_of_week}`,
          start: a.start_time?.slice(0, 5),
          end: a.end_time?.slice(0, 5),
        });
      }
      return {
        results: (specs as Array<{ id: string; name: string; type: string }>).map(s => ({
          name: s.name,
          title: s.type,
          weekly_availability: byId[s.id] || [],
        })),
        booking_url: "/book-therapist",
      };
    }

    return { error: `Unknown tool: ${name}` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Tool execution failed" };
  }
}

async function callGateway(apiKey: string, body: unknown) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const HIGH_RISK_PATTERNS = [
  /\bkill\s+myself\b/i, /\bsuicid/i, /\bend\s+(my|it\s+all|my\s+life)\b/i,
  /\bhurt\s+myself\b/i, /\bself[\s-]?harm/i, /\bcut(ting)?\s+myself\b/i,
  /\bdon'?t\s+want\s+to\s+(live|be\s+here|exist)\b/i, /\bwant\s+to\s+die\b/i,
  /\boverdose\b/i, /\bno\s+reason\s+to\s+live\b/i,
];

const DISTRESS_PATTERNS = [
  /\boverwhelm/i, /\bnot\s+okay\b/i, /\bcan'?t\s+cope\b/i, /\bhopeless\b/i,
  /\bgive\s+up\b/i, /\bbreaking\s+down\b/i, /\bdepressed\b/i, /\bpanic\b/i,
];

function detectRisk(text: string): "high" | "distress" | "none" {
  if (HIGH_RISK_PATTERNS.some((r) => r.test(text))) return "high";
  if (DISTRESS_PATTERNS.some((r) => r.test(text))) return "distress";
  return "none";
}

// Lightweight topic tagger. Runs on every user message and merges into session.tags.
const TOPIC_PATTERNS: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: "anxiety", patterns: [/\banxi/i, /\bworry/i, /\bworried\b/i, /\bpanic\b/i, /\bnervous\b/i, /\boverthink/i, /\bstress(ed)?\b/i, /\bafraid\b/i, /\bfear/i] },
  { tag: "depression", patterns: [/\bdepress/i, /\bsad\b/i, /\blow mood\b/i, /\bhopeless\b/i, /\bempty\b/i, /\bnothing matters\b/i, /\bcrying\b/i, /\bunmotivated\b/i, /\btired of life\b/i] },
  { tag: "trauma", patterns: [/\btrauma/i, /\bptsd\b/i, /\babuse/i, /\bflashback/i, /\bnightmare/i, /\bassault/i] },
  { tag: "relationships", patterns: [/\brelationship/i, /\bcouple/i, /\bmarriage\b/i, /\bbreakup\b/i, /\bdivorce\b/i, /\bpartner\b/i, /\bboyfriend\b/i, /\bgirlfriend\b/i, /\bhusband\b/i, /\bwife\b/i] },
  { tag: "addiction", patterns: [/\baddict/i, /\balcohol/i, /\bdrinking\b/i, /\bdrugs?\b/i, /\bsubstance\b/i, /\bweed\b/i, /\bgambling\b/i] },
  { tag: "sleep", patterns: [/\bsleep/i, /\binsomnia/i, /\bcan'?t sleep\b/i, /\bnightmare/i] },
  { tag: "work_stress", patterns: [/\bwork\b/i, /\bjob\b/i, /\bboss\b/i, /\bcareer\b/i, /\bburn[\s-]?out\b/i, /\bworkplace\b/i] },
  { tag: "booking", patterns: [/\bbook/i, /\bappointment\b/i, /\bschedule\b/i, /\bsession\b/i, /\bavailab/i, /\btherapist\b/i, /\bcounsel(l)?or\b/i, /\bspecialist\b/i] },
  { tag: "pricing", patterns: [/\bprice\b/i, /\bcost\b/i, /\bfee\b/i, /\bhow much\b/i, /\bugx\b/i, /\busd\b/i, /\bpay/i, /\baffford/i, /\bcheap/i, /\bdiscount/i] },
  { tag: "groups", patterns: [/\bsupport group/i, /\bgroup session\b/i, /\bgroups?\b/i] },
  { tag: "corporate", patterns: [/\bcorporate\b/i, /\bcompany\b/i, /\bemployer\b/i, /\bemployee/i, /\bworkplace wellness\b/i, /\bb2b\b/i] },
  { tag: "assessment", patterns: [/\bassess/i, /\bscreen/i, /\btest\b/i, /\bquiz\b/i, /\bwho-?5\b/i, /\bmind[\s-]?check\b/i, /\bwellbeing check\b/i] },
  { tag: "complaint", patterns: [/\bcomplain/i, /\brefund\b/i, /\bnot happy\b/i, /\bbad experience\b/i, /\bdisappoint/i] },
];

function detectTopics(text: string): string[] {
  const found = new Set<string>();
  for (const { tag, patterns } of TOPIC_PATTERNS) {
    if (patterns.some((p) => p.test(text))) found.add(tag);
  }
  return Array.from(found);
}

function mergeTags(existing: string[] | null | undefined, incoming: string[]): string[] {
  const set = new Set<string>([...(existing || []), ...incoming]);
  return Array.from(set).slice(0, 12);
}

// Parse hidden metadata markers the model emits, e.g.
//   [qual: concern=work stress; format=chat; when=evening]
//   [objection: pricing]
//   [outcome: booked]
// Returns cleaned reply text plus extracted fields.
function parseAndStripMarkers(reply: string): {
  clean: string;
  qualification: Record<string, string> | null;
  objection: string | null;
  outcome: string | null;
} {
  let clean = reply;
  let qualification: Record<string, string> | null = null;
  let objection: string | null = null;
  let outcome: string | null = null;

  const qualMatch = clean.match(/\[qual:\s*([^\]]+)\]/i);
  if (qualMatch) {
    const parts = qualMatch[1].split(";").map((p) => p.trim()).filter(Boolean);
    qualification = {};
    for (const p of parts) {
      const [k, v] = p.split("=").map((s) => s?.trim());
      if (k && v) qualification[k.toLowerCase()] = v.toLowerCase();
    }
    clean = clean.replace(qualMatch[0], "");
  }
  const objMatch = clean.match(/\[objection:\s*([^\]]+)\]/i);
  if (objMatch) { objection = objMatch[1].trim().toLowerCase(); clean = clean.replace(objMatch[0], ""); }
  const outMatch = clean.match(/\[outcome:\s*([^\]]+)\]/i);
  if (outMatch) { outcome = outMatch[1].trim().toLowerCase(); clean = clean.replace(outMatch[0], ""); }

  return { clean: clean.replace(/\n{3,}/g, "\n\n").trim(), qualification, objection, outcome };
}

function pageContextFromPath(path: string | null | undefined): string {
  if (!path) return "other";
  const p = path.toLowerCase();
  if (p === "/" || p === "") return "homepage";
  if (p.startsWith("/for-business") || p.startsWith("/corporate")) return "corporate";
  if (p.startsWith("/specialists") || p.startsWith("/book-therapist") || p.startsWith("/find-therapist")) return "specialists";
  if (p.startsWith("/blog")) return "blog";
  if (p.startsWith("/whisper")) return "whisper";
  if (p.startsWith("/kenya")) return "kenya";
  if (p.includes("therapy") || p.includes("counsel") || p.includes("mental")) return "service";
  return "other";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, session_id, anonymous_id, source_path } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting: check anon-id AND IP independently. Either tripping blocks the request.
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    const anonKey = `anon:${anonymous_id || "none"}`;
    const ipKey = `ip:${ip}`;
    const anonCheck = checkRate(anonKey);
    const ipCheck = checkRate(ipKey);
    if (!anonCheck.allowed || !ipCheck.allowed) {
      const worst = !anonCheck.allowed ? anonCheck : ipCheck;
      const friendly = worst.reason === "minute"
        ? "You're sending messages a bit too fast. Please wait a minute and try again."
        : "You've reached the hourly chat limit. Please try again later, or tap WhatsApp to talk to a real person.";
      return new Response(JSON.stringify({ error: friendly, retry_after: worst.retryAfterSec }), {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(worst.retryAfterSec),
        },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Ensure session exists
    let sid = session_id as string | undefined;
    if (!sid) {
      const { data: created } = await supabase
        .from("chat_sessions")
        .insert({
          anonymous_id: anonymous_id || crypto.randomUUID(),
          source_path: source_path || null,
          page_context: pageContextFromPath(source_path),
          user_agent: req.headers.get("user-agent")?.slice(0, 500) || null,
        })
        .select("id")
        .single();
      sid = created?.id;
    }

    const lastUser = messages[messages.length - 1];
    const userText: string = lastUser?.content || "";
    const risk = detectRisk(userText);
    const topics = detectTopics(userText);

    // Persist user message
    if (sid) {
      await supabase.from("chat_messages").insert({
        session_id: sid, role: "user", content: userText, flagged: risk !== "none",
      });
      // Merge auto-tags onto the session (best-effort, non-blocking semantics).
      if (topics.length > 0) {
        const { data: sessRow } = await supabase
          .from("chat_sessions")
          .select("tags")
          .eq("id", sid)
          .maybeSingle();
        const merged = mergeTags(sessRow?.tags as string[] | null, topics);
        await supabase.from("chat_sessions").update({ tags: merged }).eq("id", sid);
      }
      if (risk === "high") {
        await supabase.from("chat_sessions").update({
          high_risk_triggered: true, escalated: true,
        }).eq("id", sid);
        await supabase.from("chat_events").insert({
          session_id: sid, event_type: "high_risk_detected",
        });
        // Fire-and-forget admin email alert (don't block the safety reply on email failure).
        try {
          fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-chat-event`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({
              kind: "high_risk",
              session_id: sid,
              anonymous_id: anonymous_id,
              source_path: source_path,
              trigger_message: userText,
            }),
          }).catch((e) => console.warn("notify-chat-event failed:", e));
        } catch (e) { console.warn("notify dispatch failed", e); }
      } else if (risk === "distress") {
        await supabase.from("chat_events").insert({
          session_id: sid, event_type: "distress_detected",
        });
      }
    }

    // High-risk: bypass model with fixed safety reply
    if (risk === "high") {
      const safetyReply = "I'm really concerned about what you're sharing, and I want you to be safe. Please reach out to someone right now — you don't have to go through this alone. Tap the WhatsApp button below to talk to a real person at InnerSpark immediately, or call the Uganda Mental Health helpline at **0800-21-21-21** (Butabika). If you are in immediate danger, please contact emergency services.\n\n*Luganda:* Nkweraliikiriddeko nnyo. Nkusaba okoze ku WhatsApp wammanga oba okukubira essimu ku **0800-21-21-21**.\n\n*Swahili:* Nina wasiwasi sana kuhusu unachoshiriki. Tafadhali bonyeza WhatsApp hapa chini au piga simu **0800-21-21-21**.";
      if (sid) {
        await supabase.from("chat_messages").insert({
          session_id: sid, role: "assistant", content: safetyReply, flagged: true,
        });
      }
      const enc = new TextEncoder();
      const safetyStream = new ReadableStream({
        start(controller) {
          controller.enqueue(enc.encode(
            `data: ${JSON.stringify({ type: "meta", session_id: sid, high_risk: true })}\n\n`
          ));
          controller.enqueue(enc.encode(
            `data: ${JSON.stringify({ type: "delta", content: safetyReply })}\n\n`
          ));
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        },
      });
      return new Response(safetyStream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Build conversation. We may run a non-streaming tool round first if the model decides to call tools.
    // Live therapist directory (kept short) — grounds Amani so she can reference real people by name,
    // specialty, language, and skills without needing a tool call for the first mention.
    let therapistDirectory = "";
    try {
      const { data: specs } = await supabase
        .from("specialists")
        .select("name, type, specialties, languages, bio, price_per_hour, available_options, experience_years")
        .eq("is_active", true)
        .eq("kenya", false)
        .limit(12);
      if (specs && specs.length) {
        therapistDirectory = "\n\n═══ INNERSPARK THERAPIST DIRECTORY (use these real names, never invent) ═══\n" +
          (specs as Array<Record<string, unknown>>).map((s) => {
            const name = s.name as string;
            const title = s.type as string;
            const yrs = s.experience_years as number;
            const specs = ((s.specialties as string[]) || []).slice(0, 5).join(", ");
            const langs = ((s.languages as string[]) || []).join(", ");
            const modes = ((s.available_options as string[]) || []).join("/");
            const bio = typeof s.bio === "string" ? (s.bio as string).slice(0, 140) : "";
            return `• ${name} (${title}, ${yrs}y). Specialties: ${specs}. Languages: ${langs}. Modes: ${modes}. About: ${bio}`;
          }).join("\n") +
          "\nAlways call check_availability before quoting slots.";
      }
    } catch (e) { console.warn("therapist directory fetch failed", e); }

    const baseMessages: Array<Record<string, unknown>> = [
      { role: "system", content: SYSTEM_PROMPT + therapistDirectory + CHIPS_INSTRUCTION + TOOLS_INSTRUCTION + LANGUAGE_INSTRUCTION },
      ...messages.slice(-12),
    ];

    // Step 1: ask model (non-streaming) whether it wants to call a tool.
    const toolDecisionResp = await callGateway(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: baseMessages,
      tools: TOOLS,
      tool_choice: "auto",
    });

    if (!toolDecisionResp.ok) {
      const txt = await toolDecisionResp.text();
      console.error("AI gateway tool-decision error", toolDecisionResp.status, txt);
      if (toolDecisionResp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (toolDecisionResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${toolDecisionResp.status}`);
    }

    const decisionJson = await toolDecisionResp.json();
    const choiceMsg = decisionJson?.choices?.[0]?.message;
    const toolCalls = choiceMsg?.tool_calls as Array<{ id: string; function: { name: string; arguments: string } }> | undefined;

    let conversation = baseMessages;
    let usedTools: string[] = [];

    if (toolCalls && toolCalls.length > 0) {
      // Execute every tool call
      const toolResults: Array<Record<string, unknown>> = [];
      for (const tc of toolCalls) {
        let parsedArgs: Record<string, unknown> = {};
        try { parsedArgs = JSON.parse(tc.function.arguments || "{}"); } catch (_e) { /* ignore */ }
        const result = await executeTool(supabase, tc.function.name, parsedArgs);
        usedTools.push(tc.function.name);
        toolResults.push({
          role: "tool",
          tool_call_id: tc.id,
          name: tc.function.name,
          content: JSON.stringify(result),
        });
        if (sid) {
          await supabase.from("chat_events").insert({
            session_id: sid, event_type: "tool_called", metadata: { name: tc.function.name, args: parsedArgs } as never,
          });
        }
      }
      conversation = [
        ...baseMessages,
        { role: "assistant", content: choiceMsg.content || "", tool_calls: toolCalls },
        ...toolResults,
      ];
    }

    // Step 2: stream the final reply (with tool results in context if applicable).
    const aiResp = await callGateway(LOVABLE_API_KEY, {
      model: "google/gemini-2.5-flash",
      messages: conversation,
      stream: true,
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI gateway error", aiResp.status, txt);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${aiResp.status}`);
    }

    // Stream tokens back to the client as SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullReply = "";

    const stream = new ReadableStream({
      async start(controller) {
        // Send session metadata first
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: "meta", session_id: sid, distress: risk === "distress", tools_used: usedTools })}\n\n`
        ));

        const reader = aiResp.body!.getReader();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload);
                const delta: string = json?.choices?.[0]?.delta?.content || "";
                if (delta) {
                  fullReply += delta;
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`
                  ));
                }
              } catch (_e) {
                // ignore malformed chunk
              }
            }
          }
        } catch (e) {
          console.error("stream error", e);
        }

        // Persist assistant reply + bump session count
        if (sid && fullReply) {
          try {
            const parsed = parseAndStripMarkers(fullReply);
            await supabase.from("chat_messages").insert({
              session_id: sid, role: "assistant", content: parsed.clean,
            });
            // Merge new qualification data onto any prior qualification.
            let qualUpdate: Record<string, unknown> | null = null;
            if (parsed.qualification && Object.keys(parsed.qualification).length > 0) {
              const { data: existing } = await supabase
                .from("chat_sessions")
                .select("qualification")
                .eq("id", sid)
                .maybeSingle();
              const prev = (existing?.qualification as Record<string, unknown> | null) || {};
              qualUpdate = { ...prev, ...parsed.qualification };
            }
            const updatePayload: Record<string, unknown> = {
              message_count: messages.length + 1,
              updated_at: new Date().toISOString(),
            };
            if (qualUpdate) updatePayload.qualification = qualUpdate;
            if (parsed.objection) updatePayload.pricing_response = parsed.objection;
            if (parsed.outcome) updatePayload.booked_outcome = parsed.outcome;
            await supabase.from("chat_sessions").update(updatePayload).eq("id", sid);
          } catch (e) {
            console.error("persist reply failed", e);
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (e) {
    console.error("ai-chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});