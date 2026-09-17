import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { SITE, GLOBAL_LINKS } from "./prerender-content.mjs";

const DIST = path.resolve(process.cwd(), "dist");
const ROOT_RE = /<div id="root">\s*<\/div>/;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://hnjpsvpudwwyzrrwzbpa.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sanitize = (html) => String(html ?? "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<iframe[\s\S]*?<\/iframe>/gi, "").replace(/\son\w+="[^"]*"/gi, "");

function upsert(html, matcher, tag) {
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function head(shell, post) {
  const url = `${SITE}/blog/${post.slug}`;
  const title = post.meta_title || `${post.title} | InnerSpark Africa`;
  const description = post.meta_description || post.excerpt || post.title;
  let html = shell;
  html = upsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = upsert(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${esc(description)}" />`);
  html = upsert(html, /<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${url}" />`);
  html = upsert(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  return html;
}

function body(post) {
  const links = GLOBAL_LINKS.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("");
  return `<main data-prerendered-seo="true"><article><h1>${esc(post.title)}</h1>${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ""}<div>${sanitize(post.content)}</div></article><p><a href="/book-therapist">Book a session with a licensed therapist</a></p><nav aria-label="Site sections"><h2>Explore InnerSpark Africa</h2><ul>${links}</ul></nav></main>`;
}

async function run() {
  if (!SUPABASE_KEY) return;
  let shell;
  try { shell = await readFile(path.join(DIST, "index.template.html"), "utf8"); }
  catch { shell = await readFile(path.join(DIST, "index.html"), "utf8"); }
  if (!ROOT_RE.test(shell)) return;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&select=slug,title,excerpt,content,meta_title,meta_description&limit=1000`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!response.ok) return;
  const posts = await response.json();
  for (const post of posts) {
    if (!post.slug) continue;
    const html = head(shell, post).replace(ROOT_RE, `<div id="root">${body(post)}</div>`);
    const output = path.join(DIST, "blog", post.slug, "index.html");
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html, "utf8");
  }
}

run().catch((error) => console.error("[prerender-blogs] failed:", error));
