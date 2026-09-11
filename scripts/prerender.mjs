/**
 * Build-time prerender of static SEO HTML for the highest-traffic routes.
 *
 * Runs after `vite build`. For each route in scripts/prerender-content.mjs it
 * writes dist/<route>/index.html containing:
 *   - a route-specific <title>, meta description, canonical and og:* tags
 *   - the real H1, section headings, body copy and internal links inside #root
 *
 * React's createRoot replaces the contents of #root on mount, so the visual UI
 * and every client-side behaviour (booking flow, chat widget, forms) are
 * unchanged. Crawlers that do not execute JavaScript now see real content.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ROUTES, GLOBAL_LINKS, SITE } from "./prerender-content.mjs";
import { GLOBAL_LANDING_PAGES } from "./global-landing-content.mjs";

/**
 * Country / segment landing pages, converted into the same route shape as
 * ROUTES so their unique copy (headline, intro, every body section, bullets and
 * FAQs) is written into the raw HTML instead of an empty #root.
 */
const COUNTRY_ROUTES = Object.values(GLOBAL_LANDING_PAGES).map((page) => ({
  path: `/${page.slug}`,
  title: page.title,
  description: page.metaDescription,
  h1: page.h1,
  intro: page.intro,
  sections: [
    ...page.bodySections.map((s) => ({
      h2: s.heading,
      p: [...s.paragraphs, ...(s.bullets ?? [])].join(" "),
    })),
    ...page.faqs.map((f) => ({ h2: f.q, p: f.a })),
  ],
  extraLinks: page.relatedLinks?.map((l) => [l.to, l.label]) ?? [],
}));

// Safety cap so this can never balloon the published output.
const MAX_PRERENDER_PAGES = 50;

const DIST = path.resolve(process.cwd(), "dist");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Replace an existing meta/title value, or append the tag before </head>. */
function upsert(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildHead(html, route) {
  const url = `${SITE}${route.path === "/" ? "/" : `${route.path}/`}`;
  let out = html;
  out = upsert(out, /<title>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`);
  out = upsert(
    out,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${esc(route.description)}" />`,
  );
  out = upsert(
    out,
    /<link\s+rel="canonical"[\s\S]*?\/?>/i,
    `<link rel="canonical" href="${url}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${esc(route.title)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${esc(route.description)}" />`,
  );
  out = upsert(
    out,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${url}" />`,
  );
  return out;
}

/**
 * Tailwind-styled fallback markup. It looks like a plain, readable version of
 * the page for the split second before React mounts, and reads as real content
 * for crawlers — no hiding, no cloaking.
 */
function buildBody(route) {
  const seen = new Set([route.path]);
  const links = [...(route.extraLinks ?? []), ...GLOBAL_LINKS]
    .filter(([href]) => {
      if (seen.has(href)) return false;
      seen.add(href);
      return true;
    })
    .map(
      ([href, label]) =>
        `<li><a class="text-primary underline underline-offset-4" href="${href}">${esc(label)}</a></li>`,
    )
    .join("");

  const sections = route.sections
    .map(
      (s) => `
        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-2">${esc(s.h2)}</h2>
          <p class="leading-relaxed text-foreground/80">${esc(s.p)}</p>
        </section>`,
    )
    .join("");

  return `
    <div data-prerendered-seo="true" class="min-h-screen bg-background text-foreground">
      <main class="container mx-auto px-4 py-12 max-w-3xl">
        <h1 class="text-3xl md:text-5xl font-bold mb-5">${esc(route.h1)}</h1>
        <p class="text-lg leading-relaxed text-foreground/80 mb-10">${esc(route.intro)}</p>
        ${sections}
        <p class="mb-6"><a class="text-primary font-semibold underline underline-offset-4" href="/book-therapist">Book a session with a licensed therapist</a></p>
        <nav aria-label="Site sections">
          <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
          <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
        </nav>
      </main>
    </div>`;
}

const ROOT_RE = /<div id="root">\s*<\/div>/;

async function sitemapRoutes() {
  try {
    const xml = await readFile(path.resolve(process.cwd(), "public/sitemap.xml"), "utf8");
    return [...xml.matchAll(/<loc>https:\/\/www\.innersparkafrica\.com(\/[^<]*)<\/loc>/g)]
      .map((match) => match[1])
      .filter(Boolean);
  } catch {
    return [];
  }
}

function canonicalOnlyHead(shell, routePath) {
  const normalizedPath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+|\/+$/g, "")}/`;
  const url = `${SITE}${normalizedPath}`;
  let out = shell;
  out = upsert(out, /<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${url}" />`);
  out = upsert(
    out,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${url}" />`,
  );
  return out;
}

async function run() {
  const shellPath = path.join(DIST, "index.html");
  let shell;
  try {
    shell = await readFile(shellPath, "utf8");
  } catch {
    console.warn("[prerender] dist/index.html not found — skipping.");
    return;
  }

  if (!ROOT_RE.test(shell)) {
    console.warn("[prerender] #root placeholder not found in dist/index.html — skipping.");
    return;
  }

  // Keep a clean SPA shell so downstream prerender-blogs.mjs can stamp posts.
  await writeFile(path.join(DIST, "index.template.html"), shell, "utf8");

  const routes = ROUTES.slice(0, MAX_PRERENDER_PAGES);
  for (const route of routes) {
    const html = buildHead(shell, route).replace(
      ROOT_RE,
      `<div id="root">${buildBody(route)}</div>`,
    );

    const outPath =
      route.path === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.path.replace(/^\//, ""), "index.html");

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`[prerender] wrote ${path.relative(DIST, outPath)}`);
  }

  // Every other public sitemap route receives its own server-visible canonical
  // instead of inheriting the homepage canonical from the SPA shell.
  const richPaths = new Set(routes.map((route) => route.path));
  const publicPaths = await sitemapRoutes();
  let canonicalShells = 0;
  for (const routePath of publicPaths) {
    const normalizedPath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+|\/+$/g, "")}`;
    if (richPaths.has(normalizedPath)) continue;
    const html = canonicalOnlyHead(shell, routePath);
    const outPath = path.join(DIST, routePath.replace(/^\/+|\/+$/g, ""), "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    canonicalShells += 1;
  }
  console.log(`[prerender] ${routes.length} rich route(s) and ${canonicalShells} canonical route shell(s) written.`);
}

run().catch((err) => {
  // Never fail the production build over SEO markup.
  console.error("[prerender] failed:", err);
});
