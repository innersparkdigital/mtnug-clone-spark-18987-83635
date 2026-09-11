/**
 * Build-time prerender of every published CMS blog post.
 *
 * Runs after `vite build` (see package.json postbuild). For each published row
 * in blog_posts it writes dist/blog/<slug>/index.html containing the real
 * title, meta description, canonical, og:* tags, Article + FAQPage JSON-LD and
 * the actual article HTML inside #root.
 *
 * React replaces #root on mount, so visitors get the identical interactive UI.
 * Crawlers and AI answer engines that do not execute JavaScript (Google's
 * fallback crawl, Bing, TikTok's link preview, GPTBot, ClaudeBot, Google
 * Extended, PerplexityBot) now receive the full article text.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { SITE, GLOBAL_LINKS } from "./prerender-content.mjs";

const DIST = path.resolve(process.cwd(), "dist");
const MAX_POSTS = 200;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Keep the article markup but drop anything executable. */
const sanitize = (html) =>
  String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "");

function upsert(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildHead(shell, post) {
  const url = post.canonical_url?.trim() || `${SITE}/blog/${post.slug}`;
  const title = post.meta_title?.trim() || `${post.title} | InnerSpark Africa`;
  const description = post.meta_description || post.excerpt || post.title;
  const image = post.og_image_url?.trim() || post.hero_image_url || `${SITE}/og-image.jpg`;
  const published = post.published_at || post.created_at;
  const modified = post.last_updated_at || published;

  let out = shell;
  out = upsert(out, /<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = upsert(
    out,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${esc(description)}" />`,
  );
  out = upsert(out, /<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${esc(url)}" />`);
  out = upsert(
    out,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${esc(post.og_title?.trim() || post.title)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${esc(post.og_description?.trim() || description)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${esc(image)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:type" content="article" />`,
  );

  const faqs = Array.isArray(post.faqs) ? post.faqs.filter((f) => f?.question && f?.answer) : [];
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": post.schema_type === "HowTo" ? "HowTo" : "Article",
      headline: post.title,
      description,
      image,
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", name: post.author || "InnerSpark Africa Clinical Team" },
      publisher: {
        "@type": "Organization",
        name: "InnerSpark Africa",
        logo: { "@type": "ImageObject", url: `${SITE}/innerspark-logo.webp` },
      },
    },
  ];
  if (faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const ld = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n    ");
  return out.replace("</head>", `    ${ld}\n  </head>`);
}

function buildBody(post) {
  const faqs = Array.isArray(post.faqs) ? post.faqs.filter((f) => f?.question && f?.answer) : [];
  const published = post.published_at || post.created_at;
  const date = new Date(published).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const faqHtml = faqs.length
    ? `<section class="mb-10"><h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>${faqs
        .map(
          (f) =>
            `<div class="mb-4"><h3 class="text-lg font-semibold">${esc(f.question)}</h3><p class="text-foreground/80">${esc(
              f.answer,
            )}</p></div>`,
        )
        .join("")}</section>`
    : "";

  const links = GLOBAL_LINKS.map(
    ([href, label]) =>
      `<li><a class="text-primary underline underline-offset-4" href="${href}">${esc(label)}</a></li>`,
  ).join("");

  return `
    <div data-prerendered-seo="true" class="min-h-screen bg-background text-foreground">
      <main class="container mx-auto px-4 py-12 max-w-3xl">
        <p class="text-sm uppercase tracking-widest text-foreground/60 mb-3">${esc(post.category || "Mental health")}</p>
        <h1 class="text-3xl md:text-5xl font-bold mb-4">${esc(post.title)}</h1>
        <p class="text-sm text-foreground/60 mb-8">${esc(date)}${post.read_time ? ` &middot; ${esc(post.read_time)}` : ""} &middot; By ${esc(
          post.author || "InnerSpark Africa Clinical Team",
        )}</p>
        ${post.excerpt ? `<p class="text-lg leading-relaxed text-foreground/80 mb-8">${esc(post.excerpt)}</p>` : ""}
        <div class="blog-body prose prose-lg max-w-none mb-10">${sanitize(post.content)}</div>
        ${faqHtml}
        <p class="mb-6"><a class="text-primary font-semibold underline underline-offset-4" href="/book-therapist">Book a session with a licensed Ugandan therapist</a></p>
        <nav aria-label="Site sections">
          <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
          <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
        </nav>
      </main>
    </div>`;
}

const ROOT_RE = /<div id="root">\s*<\/div>/;

async function fetchPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("[prerender-blogs] Supabase env vars missing — skipping.");
    return [];
  }
  const url =
    `${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&select=*&order=published_at.desc&limit=${MAX_POSTS}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) {
    console.warn(`[prerender-blogs] fetch failed: ${res.status}`);
    return [];
  }
  return res.json();
}

async function run() {
  // prerender.mjs writes a clean SPA shell for us; fall back to dist/index.html.
  const templatePath = path.join(DIST, "index.template.html");
  const fallbackPath = path.join(DIST, "index.html");
  let shell;
  try {
    shell = await readFile(templatePath, "utf8");
  } catch {
    try {
      shell = await readFile(fallbackPath, "utf8");
    } catch {
      console.warn("[prerender-blogs] dist/index.template.html not found — skipping.");
      return;
    }
  }
  if (!ROOT_RE.test(shell)) {
    console.warn("[prerender-blogs] #root placeholder not found in shell — skipping.");
    return;
  }

  const posts = await fetchPosts();
  let count = 0;
  for (const post of posts) {
    if (!post?.slug) continue;
    const html = buildHead(shell, post).replace(ROOT_RE, `<div id="root">${buildBody(post)}</div>`);
    const outPath = path.join(DIST, "blog", post.slug, "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    count += 1;
  }
  console.log(`[prerender-blogs] ${count} blog post(s) prerendered.`);
}

run().catch((err) => {
  console.error("[prerender-blogs] failed:", err);
});
