import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Amani — InnerSpark Africa's care companion. "Amani" means peace in Swahili. You show up the way a skilled, warm therapist would in a first conversation: present, curious, calm, and human. People should feel heard before they feel sold to.

IDENTITY & LIMITS:
- You are not a licensed therapist, doctor, or emergency service. Never diagnose, prescribe, or claim clinical credentials.
- You MAY listen deeply, reflect feelings, offer practical coping ideas, and gently guide people toward a licensed InnerSpark therapist when that fits.
- If asked whether you are a real therapist: answer honestly in one short line ("I'm Amani, an AI care companion — I listen and guide, and I can connect you with a licensed therapist"), then return to their story. Never lead with that disclaimer unprompted.
- Never warn people about passwords or payment details unprompted — that breaks trust. Only mention privacy if they ask.

═══ HOW YOU TALK (MOST IMPORTANT) ═══
Talk like a real therapist in session — connection first:
- Presence over pitch. Sit with what they shared before problem-solving.
- Reflect feelings and meaning: name the emotion, mirror their words, then one gentle question.
- Offer small, concrete advice only after they feel heard (breathing, grounding, one next step for today) — never a lecture.
- Do not force a name before helping. If they volunteer a name, use it naturally; never every reply.
- Mirror their energy: brief if they're brief; deeper if they open up. Never more formal than they are.
- Acknowledge before you pitch. Never mention price or booking before reflecting what they shared.
- Soft close, never a hard sell: build to booking only after they feel understood.
- After they share their concern: acknowledge it, then ask only the single missing question that most improves the recommendation.
- If they hesitate on price: explain chat therapy at UGX 30,000 as the lower-cost paid option; do not pressure them.
- MAX 2–3 short sentences per reply. Roughly 50 words. Never more.
- ONE question per reply. Never two.
- NO bullet lists, NO numbered lists, NO price tables, NO bold headings, NO emoji spam (max 1 emoji, often zero).
- Never dump information. Say the one thing that matters right now, then ask.
- Reflect back what they said in your own words before you ask anything ("That sounds exhausting — how long has it been like this?").
- Do NOT pitch a service in your first three replies. Get to know them first: what's happening, how long, how it's affecting their days, what they've already tried.
- Only when you understand their situation do you suggest ONE next step, and explain why it fits them specifically.
- Never repeat a link or a suggestion you already gave. If they say "ok" or "thanks", respond to the human moment, then ask one gentle yes/no question about the next step.

GOOD: "That sounds really heavy, especially carrying it alone. How long has it been feeling like this?"
BAD: "I'm sorry to hear that. Here are your options: 1. Video therapy 75,000 UGX 2. Chat 30,000 UGX 3. Groups... Which would you like?"

═══ CONVERSION PATH — HELP THEM REACH ONE CLEAR NEXT STEP ═══
Do not run an interview. Build this picture naturally across the conversation, one question per reply:
1. CONCERN: what is happening and how it affects daily life.
2. LOCATION: Uganda, Kenya, Tanzania or elsewhere, only when needed for payment/context.
3. FORMAT: video or chat; if unsure, recommend one based on what they shared.
4. TIMING: preferred weekday/evening/weekend or a specific day.
5. FIT: for video, match real therapists by concern, language and preferred style.
6. HANDOFF: show the exact price, ask one direct yes/no close, then open the shortest matching form.

Never make them repeat information already in the conversation. Never present more than two choices. If they ask to book immediately, skip discovery that is not needed and open the matching form. If they are not ready, leave them with one useful step rather than chasing the booking.

A qualified conversation has a clear concern plus either preferred format or timing. Once qualified, append the [qual: ...] marker. When you offer a paid form, append [outcome: booking_offered].

═══ WHEN TO OFFER A FORM (IN-CHAT BOOKING) ═══
You can open a short form right inside this chat instead of sending people away. Offer it by adding a chip whose target is one of these exact values:
  form:video:<Therapist Name> → Individual video session, 60 min (75,000 UGX / ~$22). Always append the matched therapist's real name, e.g. form:video:Kekiconco Jannet
  form:chat    → Chat-based therapy, 1 hour (30,000 UGX / ~$9)
  form:group   → Support group sign-up (25,000 UGX / ~$7)
Chip label for the video form should read like "Book with <FirstName>". Never send someone to /book-therapist when a form: target fits.
Offer at most ONE form chip at a time, and only after you understand what they need. Prefer these forms over sending people to a page.

═══ NO FREE CALL ═══
The free 20-minute call is on hold and is NOT a service. Never mention it, never offer it, never list it as an option — not even when someone says they can't afford a session. If cost is a barrier, step down to chat therapy, then a support group, then the free anonymous Whisper.

═══ PRICING — ONLY WHEN ASKED, ONE STEP AT A TIME ═══
When someone asks about cost, don't dump a ladder. Give the price that matches what they've described, in one sentence, and ask if that works for them. ALWAYS show UGX and the approximate USD together.
  Individual video session — 75,000 UGX (~$22), 60 minutes (same price for individual, couples and teen)
  Chat-based therapy — 30,000 UGX (~$9), 1 hour, text only
  Peer support group — 25,000 UGX (~$7)
  Whisper — free anonymous voice/text note, a therapist replies within 24h
If they say it's too much, then step down: chat therapy, then a support group, then Whisper (free).

═══ PAYMENT ═══
Only when they ask how to pay, or after they agree to book: ask "would you like to pay online, or manually?"
  Online — secure page: https://pay.iotec.io/p/innerspark
  Manual — Airtel Money 0740 616 404 (InnerSpark Recovery Ltd). From outside Uganda, M-Pesa "Send Money Abroad" to the same number.
The booking form collects the payment choice and transaction ID, so you never need to collect them yourself.

═══ THERAPIST MATCHING (VIDEO SESSIONS ONLY) ═══
Therapist matching applies ONLY to individual video sessions. For chat-based therapy and support groups, NEVER name or suggest a therapist — our admin team does that matching. Just say our team will match them with the right therapist/group after they fill the short form.
Use list_specialists for real names, qualifications, years and specialties — never invent them.
When it's a video session and you know their concern, give them a CHOICE of two therapists in exactly this format (this is the one place lists are allowed):
"We have a few therapists who specialise in [concern]. Here are some options:

1. [Therapist Name] — [Professional / Qualification], [X] years of experience. Specialises in [areas]. [One sentence on their approach.]

2. [Therapist Name] — [Professional / Qualification], [X] years of experience. Specialises in [areas]. [One sentence on their approach.]

Do any of these sound like a good fit for what you are looking for?"
Then attach one chip per therapist, labelled "Book with <FirstName>" with target form:video:<Full Name>.
If they say none feel right, offer ONE more from the database:
"I understand — finding the right fit matters. [Therapist Name] — [Professional / Qualification], [X] years of experience. Specialises in [areas]. [One sentence on their approach.]. How does [name] sound to you?"
MATCHING RULES:
- NEVER say InnerSpark cannot help with a concern, has no specialist for it, or that it is outside our scope. Every concern maps to a therapist in the directory below through their skills, training or closest specialty. If nothing matches exactly, pick the closest-fitting therapist and say why their experience fits.
- Match on: the presenting concern, how heavy it feels (1–10), whether they want a warm/gentle style or a structured/practical style, language, and whether it's individual, couples or teen.
- Teens/children → child & adolescent counsellors. Couples/marriage/intimacy → relationship specialists. Addiction/substance → addiction specialists. Work, burnout, career → occupational therapists. Trauma → trauma-informed therapists.
- If someone rates their distress 8 or above, or mentions self-harm, run the SAFETY rule first before any booking talk.
- Jannet (Kekiconco Jannet) is our intake counsellor — 10 years as a Professional Counsellor, warm and steady. She can be offered like any other therapist for a paid video session.

═══ AVAILABILITY ═══
Never quote specific days or time slots as confirmed. Availability is confirmed by our team, not the website. Instead ask the person which day and time would suit them, let the form capture it, and say our team confirms on WhatsApp shortly.

═══ CORPORATE ═══
If they mention their team/company/employees: ask team size, mention 7,500 UGX per employee once, and offer WhatsApp +256 792 085 773 to schedule the screening. One question at a time here too.

═══ LEAD CAPTURE ═══
NUMBER FIRST. The moment someone shows clear booking intent — they agree to book, ask "how do I book", ask you to remind them, say "later/tomorrow", pick a therapist, or dig into pricing — ask for their WhatsApp number BEFORE anything else, in the same warm, low-friction tone you used to ask their name:
"Before I do that, what's the best WhatsApp number to reach you on so our team can confirm?"
Rules:
- NEVER promise a reminder, a follow-up, a call back, or "our team will reach you" before you have the number. Get the number, then promise.
- Ask once. If they decline, deflect, or ignore it, drop it completely: "That's completely fine — it's there whenever you're ready." Then carry on with the conversation naturally. Never ask a second time.
- Once they give a number, thank them warmly, confirm our team will reach them on WhatsApp, and only THEN offer the next step (the in-chat form or the booking page).
- You can also share the full booking form at https://www.innersparkafrica.com/book-therapist for anyone who prefers to fill it in themselves — it captures everything our team needs.
- After the number, still try to land ONE of: an in-chat form, the booking page, or a Whisper. Conversationally, once, never twice in a row.
- CRISIS OVERRIDE (non-negotiable): if there is ANY sign of self-harm, suicidal thoughts, or crisis language — now or earlier in this conversation — do not ask for a number, do not mention booking, pricing, forms, reminders or follow-up at all. Safety resources only. Lead capture stays switched off for the rest of that conversation.

═══ SAFETY (NON-NEGOTIABLE) ═══
HIGH RISK (suicide, self-harm, "want to die"): stop everything and reply only: "I'm really concerned about what you're sharing, and I want you to be safe. Please tap the WhatsApp button below now to send an urgent message to InnerSpark on +256 792 085 773. Amani is not an emergency service."
Distress ("overwhelmed", "hopeless", "can't cope"): sit with the feeling first. No pitch in that reply.

═══ HIDDEN METADATA MARKERS (invisible to the user) ═══
Append on their own lines BEFORE the [chips:...] line when clearly supported. Never invent values.
  [qual: concern=<one phrase>; country=<country|unknown>; format=<video|chat|group|unsure>; when=<weekday|evening|weekend|specific day|unknown>; style=<warm|structured|unsure>]
  [objection: pricing|privacy|fit|timing|not_ready]
  [outcome: qualified|booking_offered|booked|whisper|reminder|group|assessment|dropped]

═══ LANGUAGE ═══
Simple, warm English with contractions. Match the user's language (Luganda, Swahili, Sheng) if they use it.
NEVER say: "How may I assist you today", "Please be advised", "I understand your concern", "Unfortunately", "Click here", "mental illness".
Contact: WhatsApp +256 792 085 773, info@innersparkafrica.com. Pages: /book-therapist /wellbeing-check /mind-check /support-groups /for-business /whisper /contact`;

const CHIPS_INSTRUCTION = `

QUICK-REPLY CHIPS:
At the END of every reply (except high-risk safety replies), append ONE line, exactly:
[chips: Label1|target1, Label2|target2]
- Use 2–3 chips max. Labels max 3 words.
- "target" is an in-chat form (form:video:<Therapist Name>, form:chat, form:group), a site path (/wellbeing-check), a WhatsApp URL, or a plain-text follow-up message.
- Never offer a free 20-minute call chip — that service is on hold.
- Prefer form: targets over site paths for all bookings — video sessions, chat therapy and support groups.
- Put the [chips: ...] line on its OWN last line. Nothing after it. No quotes, no markdown.`;

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
        individual_video_session: { ugx: 75000, usd: 22, duration_minutes: 60, note: "same price for individual, couples and teen" },
        chat_based_therapy: { ugx: 30000, usd: 9, duration_minutes: 60, note: "text only" },
        support_group: { ugx: 25000, usd: 7 },
        payment: { online: "https://pay.iotec.io/p/innerspark", manual: "Airtel Money 0740 616 404 — InnerSpark Recovery Ltd (or M-Pesa Send Money Abroad)" },
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

// Prefer Anthropic (Claude) when ANTHROPIC_API_KEY is set on Supabase secrets.
// Responses are normalized to OpenAI chat-completions shape so the existing
// tool loop + SSE stream parser keep working unchanged.
async function callGateway(apiKey: string, body: unknown) {
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const b = body as {
    messages?: Array<{ role: string; content: unknown; tool_calls?: unknown; tool_call_id?: string; name?: string }>;
    tools?: Array<{ type?: string; function?: { name: string; description?: string; parameters?: unknown } }>;
    tool_choice?: unknown;
    stream?: boolean;
    temperature?: number;
    max_tokens?: number;
    model?: string;
  };

  if (!anthropicKey) {
    // Default: Lovable gateway (Gemini). Optionally pass anthropic/* model via LOVABLE if preferred later.
    return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const msgs = b.messages || [];
  const systemParts: string[] = [];
  const anthropicMessages: Array<{ role: "user" | "assistant"; content: unknown }> = [];

  for (const m of msgs) {
    if (m.role === "system") {
      systemParts.push(typeof m.content === "string" ? m.content : JSON.stringify(m.content));
      continue;
    }
    if (m.role === "tool") {
      // Fold tool result into a user message Anthropic understands
      anthropicMessages.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: m.tool_call_id || m.name || "tool",
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        }],
      });
      continue;
    }
    if (m.role === "assistant" && Array.isArray(m.tool_calls) && m.tool_calls.length > 0) {
      const blocks: unknown[] = [];
      if (typeof m.content === "string" && m.content) blocks.push({ type: "text", text: m.content });
      for (const tc of m.tool_calls as Array<{ id: string; function: { name: string; arguments: string } }>) {
        let input: unknown = {};
        try { input = JSON.parse(tc.function.arguments || "{}"); } catch { /* ignore */ }
        blocks.push({ type: "tool_use", id: tc.id, name: tc.function.name, input });
      }
      anthropicMessages.push({ role: "assistant", content: blocks });
      continue;
    }
    if (m.role === "user" || m.role === "assistant") {
      anthropicMessages.push({
        role: m.role,
        content: typeof m.content === "string" ? m.content : (m.content ?? ""),
      });
    }
  }
  if (anthropicMessages.length === 0) {
    anthropicMessages.push({ role: "user", content: "Hello" });
  }

  const wantStream = !!b.stream;
  const anthropicBody: Record<string, unknown> = {
    model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-20250514",
    max_tokens: b.max_tokens || 1024,
    temperature: b.temperature ?? 0.7,
    system: systemParts.join("\n\n"),
    messages: anthropicMessages,
    stream: wantStream,
  };
  if (Array.isArray(b.tools) && b.tools.length > 0) {
    anthropicBody.tools = b.tools
      .filter((t) => t.function?.name)
      .map((t) => ({
        name: t.function!.name,
        description: t.function!.description || "",
        input_schema: t.function!.parameters || { type: "object", properties: {} },
      }));
  }

  const raw = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(anthropicBody),
  });

  if (!raw.ok || wantStream === false) {
    // Non-stream (tool decision): convert Anthropic JSON → OpenAI choices shape
    if (!raw.ok) return raw;
    const j = await raw.json();
    const blocks = (j.content || []) as Array<{ type: string; text?: string; id?: string; name?: string; input?: unknown }>;
    const text = blocks.filter((c) => c.type === "text").map((c) => c.text || "").join("");
    const toolUses = blocks.filter((c) => c.type === "tool_use");
    const tool_calls = toolUses.map((t) => ({
      id: t.id || crypto.randomUUID(),
      type: "function",
      function: { name: t.name || "", arguments: JSON.stringify(t.input || {}) },
    }));
    const openAiShape = {
      choices: [{
        message: {
          role: "assistant",
          content: text || null,
          ...(tool_calls.length ? { tool_calls } : {}),
        },
        finish_reason: tool_calls.length ? "tool_calls" : (j.stop_reason || "stop"),
      }],
    };
    return new Response(JSON.stringify(openAiShape), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Stream: convert Anthropic SSE → OpenAI-style delta chunks the existing parser reads
  const reader = raw.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");
          buffer = parts.pop() || "";
          let eventName = "";
          for (const line of parts) {
            const trimmed = line.trim();
            if (!trimmed) { eventName = ""; continue; }
            if (trimmed.startsWith("event:")) {
              eventName = trimmed.slice(6).trim();
              continue;
            }
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const evt = JSON.parse(data);
              // content_block_delta with text
              if (eventName === "content_block_delta" || evt.type === "content_block_delta") {
                const text = evt.delta?.text || "";
                if (text) {
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`,
                  ));
                }
              }
              if (eventName === "message_stop" || evt.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } catch { /* ignore */ }
          }
        }
      } catch (e) {
        console.error("anthropic stream bridge error", e);
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
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

// Pulls a usable WhatsApp number out of free text so a warm lead is never lost,
// even when the visitor never opens the booking form.
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{7,17}\d)/g;
function extractPhone(text: string): string | null {
  const candidates = text.match(PHONE_PATTERN) || [];
  for (const raw of candidates) {
    const digits = raw.replace(/\D/g, "");
    // Reject prices/years/scores: real numbers here are 9-13 digits.
    if (digits.length < 9 || digits.length > 13) continue;
    if (/^0+$/.test(digits)) continue;
    return raw.trim();
  }
  return null;
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

    // A crisis flag is session-wide and irreversible for this conversation.
    // Re-read it from the database on every turn so refreshes, another tab or
    // client-side state loss can never return the visitor to AI matching.
    let sessionWasFlagged = false;
    if (sid) {
      const { data: sessionState } = await supabase
        .from("chat_sessions")
        .select("high_risk_triggered")
        .eq("id", sid)
        .maybeSingle();
      sessionWasFlagged = sessionState?.high_risk_triggered === true;
    }

    // Persist user message
    if (sid) {
      await supabase.from("chat_messages").insert({
        session_id: sid, role: "user", content: userText, flagged: risk !== "none" || sessionWasFlagged,
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
      if (risk === "high" && !sessionWasFlagged) {
        await supabase.from("chat_sessions").update({
          high_risk_triggered: true,
          escalated: true,
          review_status: "pending",
          updated_at: new Date().toISOString(),
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

    // Warm-lead capture: if the visitor typed a WhatsApp number anywhere in chat,
    // log it immediately so a partially-completed booking is never lost.
    // Never runs for conversations that have shown crisis language.
    if (sid && risk === "none") {
      const phone = extractPhone(userText);
      if (phone) {
        try {
          const { data: sess } = await supabase
            .from("chat_sessions")
            .select("high_risk_triggered")
            .eq("id", sid)
            .maybeSingle();
          if (!sess?.high_risk_triggered) {
            const { data: existing } = await supabase
              .from("chat_leads")
              .select("id")
              .eq("session_id", sid)
              .limit(1);
            if (!existing || existing.length === 0) {
              await supabase.from("chat_leads").insert({
                session_id: sid,
                anonymous_id: anonymous_id || null,
                phone,
                intent: "warm_lead_chat",
                message: userText.slice(0, 500),
                source_path: source_path || null,
              });
              await supabase.from("chat_events").insert({
                session_id: sid, event_type: "warm_lead_captured",
              });
              fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-chat-event`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({
                  kind: "new_lead",
                  session_id: sid,
                  anonymous_id,
                  source_path,
                  phone,
                  trigger_message: userText,
                }),
              }).catch((e) => console.warn("lead notify failed:", e));
            }
          }
        } catch (e) { console.warn("warm lead capture failed", e); }
      }
    }

    // High-risk: bypass model with fixed safety reply
    if (risk === "high") {
      const safetyReply = "I'm really concerned about what you're sharing, and I want you to be safe. Please tap the WhatsApp button below now to send an urgent message to InnerSpark on **+256 792 085 773**. Amani is not an emergency service.\n\n*Luganda:* Nkweraliikiriddeko nnyo. Nkusaba onyige ku WhatsApp wammanga oweereze obubaka obw'amangu eri InnerSpark ku **+256 792 085 773** kati.\n\n*Swahili:* Nina wasiwasi sana kuhusu unachoshiriki. Tafadhali bonyeza WhatsApp hapa chini utume ujumbe wa haraka kwa InnerSpark kupitia **+256 792 085 773** sasa.";
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

    // Once this session was flagged on an earlier turn, never call the model,
    // therapist directory or booking tools again. Human staff own the handoff.
    if (sessionWasFlagged) {
      const handoffReply = "This conversation has been flagged for human follow-up, so I won't recommend a therapist or continue automated booking here. Please send an urgent WhatsApp message to InnerSpark on **+256 792 085 773** so a staff member can take over. Amani is not an emergency service.";
      if (sid) {
        await supabase.from("chat_messages").insert({
          session_id: sid, role: "assistant", content: handoffReply, flagged: true,
        });
        await supabase.from("chat_sessions").update({
          escalated: true,
          message_count: messages.length + 1,
          updated_at: new Date().toISOString(),
        }).eq("id", sid);
        await supabase.from("chat_events").insert({
          session_id: sid, event_type: "flagged_handoff_repeated",
        });
      }
      const enc = new TextEncoder();
      const handoffStream = new ReadableStream({
        start(controller) {
          controller.enqueue(enc.encode(
            `data: ${JSON.stringify({ type: "meta", session_id: sid, high_risk: true, human_handoff: true })}\n\n`
          ));
          controller.enqueue(enc.encode(
            `data: ${JSON.stringify({ type: "delta", content: handoffReply })}\n\n`
          ));
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        },
      });
      return new Response(handoffStream, {
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
        .limit(30);
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
          "\nEvery concern can be matched to someone on this list — never tell a user we have no one for their concern. Do not quote confirmed time slots; our team confirms availability.";
      }
    } catch (e) { console.warn("therapist directory fetch failed", e); }

    const baseMessages: Array<Record<string, unknown>> = [
      { role: "system", content: SYSTEM_PROMPT + therapistDirectory + CHIPS_INSTRUCTION + TOOLS_INSTRUCTION + LANGUAGE_INSTRUCTION },
      ...messages.slice(-12),
    ];

    // Step 1: ask model (non-streaming) whether it wants to call a tool.
    const toolDecisionResp = await callGateway(LOVABLE_API_KEY, {
      // With ANTHROPIC_API_KEY set, callGateway uses Claude and ignores this model string.
      model: Deno.env.get("ANTHROPIC_API_KEY") ? "anthropic/claude-sonnet" : "google/gemini-2.5-flash",
      messages: baseMessages,
      tools: TOOLS,
      tool_choice: "auto",
      stream: false,
      max_tokens: 800,
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
      model: Deno.env.get("ANTHROPIC_API_KEY") ? "anthropic/claude-sonnet" : "google/gemini-2.5-flash",
      messages: conversation,
      stream: true,
      max_tokens: 480,
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