// Generates public/sitemap-blogs.xml (CMS blog posts) and public/sitemap-index.xml.
// Runs before dev and build so newly published blogs are crawlable without manual edits.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { routeInventory } from './seo-routes.mjs';

const BASE_URL = "https://www.innersparkafrica.com";
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://hnjpsvpudwwyzrrwzbpa.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuanBzdnB1ZHd3eXpycnd6YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDgyODAsImV4cCI6MjA3Nzc4NDI4MH0.2s0TlAxFujnY2FMz0SDbzrjbsMCsgg1eCBHfUiiAGIQ";

async function fetchPosts() {
  const posts = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,last_updated_at,published_at&status=eq.published&order=slug.asc&limit=100&offset=${offset}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`blog fetch failed [${res.status}]`);
    const page = await res.json();
    posts.push(...page);
    if (page.length < 100) break;
  }
  if (!posts.length) throw new Error('No published articles returned');
  return posts;
}

function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildUrlset(posts) {
  const seen = new Set();
  const redirects = new Set(routeInventory().filter(r => r.redirect).map(r => r.path));
  const urls = posts
    .filter((p) => {
      const slug = String(p.slug || "").trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug) || redirects.has(`/blog/${slug}`)) return false;
      seen.add(slug);
      return true;
    })
    .map((p) => {
      // Only editorial content-change or publication timestamps; never build time.
      const lastmod = (p.last_updated_at || p.published_at || "").slice(0, 10);
      return [
        "  <url>",
        `    <loc>${BASE_URL}/blog/${xmlEscape(p.slug)}/</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
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
  console.error(`sitemap-blogs.xml failed: ${error.message}`);
  process.exitCode = 1;
}
