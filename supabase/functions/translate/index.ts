import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const languageNames: Record<string, string> = {
  en: "English",
  fr: "French",
  sw: "Kiswahili (Swahili)",
  pt: "Portuguese",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, texts, targetLang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const targetLanguage = languageNames[targetLang] || "English";

    // Handle batch translation
    if (texts && Array.isArray(texts)) {
      const prompt = `Translate the following texts from English to ${targetLanguage}. 
Return ONLY a JSON array of translated strings in the same order, nothing else.
Keep proper nouns, brand names like "Innerspark", and technical terms unchanged.
Maintain the same tone and formatting.

Texts to translate:
${JSON.stringify(texts)}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a professional translator. Return only valid JSON arrays with translated strings. No explanations.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("AI Gateway error:", error);
        throw new Error("Translation service unavailable");
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "[]";
      
      // Parse the JSON array
      let translations: string[];
      try {
        // Clean the response - remove markdown code blocks if present
        const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
        translations = JSON.parse(cleaned);
      } catch {
        console.error("Failed to parse translations:", content);
        translations = texts; // Return original texts on parse failure
      }

      return new Response(JSON.stringify({ translations }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle single text translation
    if (text) {
      const prompt = `Translate the following text from English to ${targetLanguage}.
Return ONLY the translated text, nothing else.
Keep proper nouns, brand names like "Innerspark", and technical terms unchanged.
Maintain the same tone and formatting.

Text: ${text}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a professional translator. Return only the translated text. No explanations or quotes.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("AI Gateway error:", error);
        throw new Error("Translation service unavailable");
      }

      const data = await response.json();
      const translation = data.choices[0]?.message?.content?.trim() || text;

      return new Response(JSON.stringify({ translation }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No text provided for translation");
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Translation failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
