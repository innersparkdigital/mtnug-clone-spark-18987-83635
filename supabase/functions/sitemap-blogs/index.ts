// Public XML sitemap of every published CMS blog post, so posts added from the
// admin "New Post" button are discoverable by Google without a redeploy.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://mtnug-clone-spark-18987-83635.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, published_at, last_updated_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return new Response(`<!-- ${error.message} -->`, { status: 500, headers: { "Content-Type": "application/xml" } });
  }

  const urls = (data || []).map((p: Record<string, string | null>) => {
    const lastmod = p.last_updated_at || p.updated_at || p.published_at;
    return [
      "  <url>",
      `    <loc>${SITE}/blog/${p.slug}</loc>`,
      lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : null,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.7</priority>",
      "  </url>",
    ].filter(Boolean).join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "Access-Control-Allow-Origin": "*",
    },
  });
});