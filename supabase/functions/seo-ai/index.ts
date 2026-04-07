import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "meta-tags") {
      systemPrompt = `You are an expert SEO specialist for a mental health therapy platform in Africa called Innerspark Africa (innersparkafrica.com). Generate optimized SEO meta tags for the given page. Return a JSON object with these fields: title (under 60 chars, include primary keyword), description (under 160 chars, compelling with CTA), keywords (comma-separated, 8-12 relevant terms), ogTitle, ogDescription. Focus on Uganda/Africa mental health therapy keywords.`;
      userPrompt = `Generate SEO meta tags for this page:\nPage URL: ${input.url || "/"}\nPage Content/Topic: ${input.content || input.topic}\nTarget Audience: ${input.audience || "People seeking mental health support in Uganda/Africa"}`;
    } else if (mode === "blog-content") {
      systemPrompt = `You are an expert SEO content writer for Innerspark Africa, a mental health therapy platform in Uganda/Africa. Write SEO-optimized blog articles (800-1500 words) following this structure:
1. Compelling H1 title with primary keyword (under 60 chars)
2. Hook paragraph (2-3 sentences)
3. Clear definition/explanation section
4. Statistics with citations (use reputable sources like WHO, APA, NIMH)
5. Step-by-step actionable advice (5-7 steps)
6. Expert insight paragraph
7. Call-to-action linking to Innerspark Africa services
8. FAQ section (3-4 questions) for Google rich snippets

Include internal links to /book-therapist, /mind-check, /wellbeing-check, and /specialists. Use semantic HTML heading hierarchy. Target long-tail keywords relevant to mental health in Uganda/Africa.

Return a JSON object with: title, metaDescription, keywords, content (full article in markdown), faqItems (array of {question, answer}), suggestedSlug, estimatedReadTime.`;
      userPrompt = `Write an SEO-optimized blog article about: ${input.topic}\nTarget keyword: ${input.keyword || input.topic}\nSecondary keywords: ${input.secondaryKeywords || "therapy Uganda, mental health Africa, online counseling"}`;
    } else if (mode === "seo-audit") {
      systemPrompt = `You are an expert SEO auditor for Innerspark Africa (innersparkafrica.com), a mental health therapy platform. Analyze the provided page content and return a comprehensive SEO audit as a JSON object with:
- score (0-100 overall SEO score)
- issues (array of {severity: "critical"|"warning"|"info", category: string, message: string, fix: string})
- strengths (array of strings - what's done well)
- recommendations (array of {priority: "high"|"medium"|"low", action: string, impact: string})
- keywordAnalysis: {primaryKeyword: string, density: number, suggestions: string[]}
- technicalChecks: {hasTitle: boolean, hasMetaDesc: boolean, hasCanonical: boolean, hasJsonLd: boolean, hasH1: boolean, headingHierarchy: boolean, hasAltText: boolean, mobileReady: boolean}
Be specific and actionable in your recommendations.`;
      userPrompt = `Audit this page for SEO:\nURL: ${input.url}\nTitle: ${input.title || "Not provided"}\nMeta Description: ${input.metaDescription || "Not provided"}\nPage Content: ${input.content}\nTarget Keywords: ${input.targetKeywords || "online therapy Uganda, mental health Africa"}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid mode. Use: meta-tags, blog-content, or seo-audit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "seo_result",
            description: "Return the SEO analysis result as structured JSON",
            parameters: {
              type: "object",
              properties: {
                result: { type: "object" }
              },
              required: ["result"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "seo_result" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      // The AI may return data under "result" key or directly as the arguments
      result = args.result && Object.keys(args.result).length > 0 ? args.result : args;
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = { rawContent: content };
      }
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
