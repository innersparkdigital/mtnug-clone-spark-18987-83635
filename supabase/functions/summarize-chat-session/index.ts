import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUMMARY_PROMPT = `You summarize a short user-support chat for an admin dashboard.

Return ONE plain sentence (max 22 words) describing what the user wanted and the outcome / next step.
No markdown, no quotes, no emojis. If the conversation is empty or only greetings, reply: "Greeting only — no clear intent."
If the user expressed self-harm or suicide content, START the sentence with "[CRISIS] ".
Examples:
- "User asked about therapy pricing in UGX and was directed to /book-therapist."
- "User reported anxiety at work and was offered a free wellbeing check plus WhatsApp follow-up."
- "[CRISIS] User expressed suicidal thoughts; safety helpline and WhatsApp escalation provided."`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string") {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: msgs, error } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(40);
    if (error) throw error;
    if (!msgs || msgs.length === 0) {
      return new Response(JSON.stringify({ summary: "Empty conversation." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transcript = (msgs as Array<{ role: string; content: string }>)
      .map((m) => `${m.role.toUpperCase()}: ${(m.content || "").slice(0, 400)}`)
      .join("\n");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SUMMARY_PROMPT },
          { role: "user", content: `Transcript:\n${transcript}` },
        ],
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI gateway summarize error", aiResp.status, txt);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds at Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const ai = await aiResp.json();
    let summary: string = ai?.choices?.[0]?.message?.content?.trim() || "";
    summary = summary.replace(/^["'`]+|["'`]+$/g, "").slice(0, 400);

    if (summary) {
      await supabase
        .from("chat_sessions")
        .update({ summary, summary_updated_at: new Date().toISOString() })
        .eq("id", session_id);
    }

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize-chat-session error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});