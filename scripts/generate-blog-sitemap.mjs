// Generates public/sitemap-blogs.xml (CMS blog posts) and public/sitemap-index.xml.
// Runs before dev and build so newly published blogs are crawlable without manual edits.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://www.innersparkafrica.com";
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://hnjpsvpudwwyzrrwzbpa.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuanBzdnB1ZHd3eXpycnd6YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDgyODAsImV4cCI6MjA3Nzc4NDI4MH0.2s0TlAxFujnY2FMz0SDbzrjbsMCsgg1eCBHfUiiAGIQ";

async function fetchPosts() {
  const url =
    `${SUPABASE_URL}/rest/v1/blog_posts` +
    `?select=slug,updated_at,published_at&status=eq.published&order=published_at.desc&limit=1000`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`blog fetch failed [${res.status}]: ${await res.text()}`);
  return res.json();
}

function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildUrlset(posts) {
  const urls = posts
    .filter((p) => p.slug)
    .map((p) => {
      const lastmod = (p.updated_at || p.published_at || "").slice(0, 10);
      return [
        "  <url>",
        `    <loc>${BASE_URL}/blog/${xmlEscape(p.slug)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        "    <changefreq>weekly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

function buildIndex() {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${BASE_URL}/sitemap.xml</loc></sitemap>`,
    `  <sitemap><loc>${BASE_URL}/sitemap-blogs.xml</loc></sitemap>`,
    "</sitemapindex>",
    "",
  ].join("\n");
}

try {
  const posts = await fetchPosts();
  writeFileSync(resolve("public/sitemap-blogs.xml"), buildUrlset(posts));
  writeFileSync(resolve("public/sitemap-index.xml"), buildIndex());
  console.log(`sitemap-blogs.xml written (${posts.length} posts)`);
} catch (error) {
  console.warn(`sitemap-blogs.xml skipped: ${error.message}`);
}
