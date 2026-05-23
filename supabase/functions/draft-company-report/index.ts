import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      companyName,
      industry,
      employeeCount,
      contextNotes,
      summary,
      triggeredFlags,
      questionAverages,
      triggeredClusters,
    } = body || {};

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a senior workplace mental-health consultant for InnerSpark Africa writing a confidential report to the HR lead of a specific company in Uganda/East Africa.

Your job: produce SHORT, SPECIFIC, NON-GENERIC consultant observations that explicitly reference (a) what THIS company does, (b) its workforce realities, and (c) the actual screening data triggered. Avoid boilerplate like "We recommend manager training" unless you tie it to a real trigger. Reference specific flags by their plain English name.

Tone: warm, clinical, decisive. No emojis. No markdown headings. Plain paragraphs separated by blank lines. 180-280 words total. Never invent statistics — only use the numbers provided.`;

    const userPrompt = `COMPANY: ${companyName}${industry ? ` (${industry})` : ""}${employeeCount ? `, ~${employeeCount} employees` : ""}

COMPANY CONTEXT (provided by HR / consultant):
${contextNotes?.trim() || "(none provided — keep observations cautious and ask HR for more context at the end)"}

SCREENING SUMMARY:
- Completed screenings: ${summary?.completed ?? 0} of ${summary?.totalEmployees ?? 0} (${summary?.completionRate ?? 0}%)
- Average WHO-5 wellbeing: ${summary?.avgWho5 ?? 0}%
- Distribution: Healthy ${summary?.high ?? 0} / At-risk ${summary?.moderate ?? 0} / Critical ${summary?.low ?? 0}
- Needs immediate support: ${summary?.needsSupport ?? 0}

TOP TRIGGERED FLAGS (ranked by team impact):
${(triggeredFlags || []).slice(0, 6).map((f: any, i: number) => `${i + 1}. ${f.flagName} — ${f.affectedEmployees} employees, ${f.averagePct}% avg`).join("\n") || "(no flags triggered)"}

DETECTED PATTERNS: ${(triggeredClusters || []).join(", ") || "(none)"}

QUESTION AVERAGES (lower = worse for workplace items, varies for WHO-5):
${questionAverages ? Object.entries(questionAverages).map(([q, v]) => `- ${q}: ${v}%`).join("\n") : "(unavailable)"}

Write the consultant observations now. Begin with one sentence that names what the company does (drawn from the context). Then explain — in this company's specific language — what the data is really showing, who is most at risk, and what the next 30 days should look like for THIS workforce. End with one sentence inviting HR to confirm or correct anything.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const observations = data?.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ observations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("draft-company-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});