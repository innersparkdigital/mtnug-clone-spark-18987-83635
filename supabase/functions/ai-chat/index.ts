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
      const safetyReply = "I'm really concerned about what you're sharing, and I want you to be safe. Please reach out to someone right now — you don't have to go through this alone. Tap the WhatsApp button below to talk to a real person at InnerSpark immediately, or call the Uganda Mental Health helpline at **0800-21-21-21** (Butabika). If you are in immediate danger, please contact emergency services.";
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

    // Call Lovable AI Gateway (non-streaming for simplicity + reliability)
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + CHIPS_INSTRUCTION },
          ...messages.slice(-12),
        ],
        stream: true,
      }),
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
          `data: ${JSON.stringify({ type: "meta", session_id: sid, distress: risk === "distress" })}\n\n`
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