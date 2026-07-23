// Public RSS 2.0 feed for InnerSpark Africa blog.
// Serves at /feed via a rewrite; feeds pull from the `blog_posts` table.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://www.innersparkafrica.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function xmlEscape(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data } = await supabase
    .from("blog_posts")
    .select("slug,title,excerpt,published_at,updated_at,author")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (data ?? [])
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const pubDate = new Date(p.published_at ?? p.updated_at ?? Date.now()).toUTCString();
      return `    <item>
      <title>${xmlEscape(p.title ?? "")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${xmlEscape(p.author ?? "InnerSpark Africa")}</dc:creator>
      <description>${xmlEscape(p.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const now = new Date().toUTCString();
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InnerSpark Africa Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/feed" rel="self" type="application/rss+xml" />
    <description>Expert-backed articles on therapy, anxiety, depression, addiction recovery and mental wellbeing in Africa.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
});