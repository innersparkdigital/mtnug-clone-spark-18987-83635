import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the InnerSpark Africa Support Assistant — a warm, calm, culturally-aware guide for users on innersparkafrica.com.

IDENTITY & LIMITS (NEVER BREAK):
- You are a SUPPORT GUIDE, not a therapist, doctor, or clinician.
- You MUST NOT diagnose, prescribe, or give clinical advice.
- Always encourage users to book a licensed therapist for real support.
- Keep replies short (2–4 sentences) and friendly. Use simple English.

WHAT YOU HELP WITH:
1. Explain InnerSpark services: online therapy (video/chat/phone), support groups, mental wellbeing screening, corporate wellness, doctor referrals.
2. Pricing: Therapy session 75,000 UGX (~$22). Support groups 25,000 UGX. First wellbeing check is FREE.
3. Booking: Guide users to "Book a Therapist" — the flow starts with a short pre-assessment then a booking form.
4. Mental wellbeing screening: Direct users to /wellbeing-check (WHO-5, ~2 minutes, free) or /mind-check (37 specific tests).
5. Basic non-clinical wellness tips: breathing (box breathing 4-4-4-4), grounding (5-4-3-2-1 senses), sleep hygiene, journaling.
6. Contact: WhatsApp +256 792 085 773, email info@innersparkafrica.com.

QUICK LINKS (suggest as plain URLs in your replies when relevant):
- Book therapist: /book-therapist
- Free wellbeing check: /wellbeing-check
- Mind-check tests: /mind-check
- Support groups: /support-groups
- For business: /for-business
- Contact: /contact

SAFETY TRIAGE:
- If user expresses distress ("overwhelmed", "not okay", "can't cope", "hopeless"), respond with empathy, validate their feelings, then strongly suggest booking a therapist or WhatsApp.
- If user expresses HIGH RISK language (self-harm, suicide, "want to end it", "kill myself", "hurt myself"), STOP normal flow. Reply ONLY with: "I'm really concerned about what you're sharing, and I want you to be safe. Please reach out to someone right now — you don't have to go through this alone. Tap the WhatsApp button below to talk to a real person at InnerSpark immediately, or call the Uganda Mental Health helpline at 0800-21-21-21 (Butabika). If you are in immediate danger, please contact emergency services."
- Never minimize, never give clinical instructions, never argue.

TONE: Warm, hopeful, never preachy. Acknowledge feelings before guiding. Use emojis sparingly (💙 🌿) only when it fits.

Always end longer answers with a gentle CTA like: "Would you like to book a session or take the free wellbeing check?"`;

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
          user_agent: req.headers.get("user-agent")?.slice(0, 500) || null,
        })
        .select("id")
        .single();
      sid = created?.id;
    }

    const lastUser = messages[messages.length - 1];
    const userText: string = lastUser?.content || "";
    const risk = detectRisk(userText);

    // Persist user message
    if (sid) {
      await supabase.from("chat_messages").insert({
        session_id: sid, role: "user", content: userText, flagged: risk !== "none",
      });
      if (risk === "high") {
        await supabase.from("chat_sessions").update({
          high_risk_triggered: true, escalated: true,
        }).eq("id", sid);
        await supabase.from("chat_events").insert({
          session_id: sid, event_type: "high_risk_detected",
        });
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
    const baseMessages: Array<Record<string, unknown>> = [
      { role: "system", content: SYSTEM_PROMPT + CHIPS_INSTRUCTION + TOOLS_INSTRUCTION + LANGUAGE_INSTRUCTION },
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
            await supabase.from("chat_messages").insert({
              session_id: sid, role: "assistant", content: fullReply,
            });
            await supabase.from("chat_sessions").update({
              message_count: messages.length + 1, updated_at: new Date().toISOString(),
            }).eq("id", sid);
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