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

const SEO_OVERRIDES = {
  "how-to-stop-a-panic-attack": {
    title: "How to Stop a Panic Attack Now: 7 Safe Steps | InnerSpark",
    description: "Use seven practical steps to manage a panic attack safely, then book confidential support with a licensed African therapist if attacks continue.",
  },
  "spark-framework-mental-wellbeing": {
    title: "S.P.A.R.K Mental Wellbeing Routine for Ugandans",
    description: "Use InnerSpark Africa's five-step S.P.A.R.K routine to strengthen sleep, purpose, activity, relationships and self-awareness in a realistic Ugandan week.",
  },
  "types-of-therapy": {
    title: "Types of Therapy: Choose the Right Support in Uganda",
    description: "Compare common types of therapy and choose a licensed African therapist for anxiety, trauma, relationships, stress or personal growth.",
  },
  "therapy-cost-uganda": {
    title: "Therapy Cost in Uganda: Video UGX 75,000 | InnerSpark",
    description: "Compare therapy costs in Uganda. InnerSpark video therapy is UGX 75,000 per session and chat therapy is UGX 30,000.",
  },
  "cost-of-therapy-in-kampala-2026": {
    title: "Therapy Cost in Kampala 2026: Prices and Booking",
    description: "Compare therapy prices in Kampala and book a licensed African therapist. Video sessions cost UGX 75,000; chat costs UGX 30,000.",
  },
  "affordable-online-counselling-uganda": {
    title: "Online Counselling Uganda: Video UGX 75,000",
    description: "Book online counselling in Uganda with a licensed African therapist. Video sessions cost UGX 75,000 and chat sessions cost UGX 30,000.",
  },
  "best-therapist-for-anxiety-in-uganda": {
    title: "Anxiety Therapist Uganda: Find and Book Online",
    description: "Find a licensed anxiety therapist in Uganda for confidential video or chat sessions, with local payment options and clear pricing.",
  },
  "how-to-find-psychologist-in-kampala": {
    title: "Psychologist Kampala: How to Find and Book One",
    description: "Find a licensed psychologist in Kampala and compare credentials, session format, pricing and availability before you book.",
  },
  "find-therapist-kampala": {
    title: "Find a Therapist in Kampala and Book Online",
    description: "Find and book a licensed therapist in Kampala for confidential video or chat support with clear local pricing.",
  },
  "find-a-therapist-in-uganda": {
    title: "Find a Therapist in Uganda: Licensed Online Support",
    description: "Choose a licensed therapist in Uganda for confidential online support by video or chat. Compare fit, availability and price before booking.",
  },
  "relationship-counselling-uganda-online": {
    title: "Online Relationship Counselling Uganda | InnerSpark",
    description: "Book confidential online relationship counselling in Uganda with a licensed African therapist who understands local family and cultural context.",
  },
  "online-vs-in-person-therapy-uganda": {
    title: "Online vs In-Person Therapy Uganda: Cost and Fit",
    description: "Compare online and in-person therapy in Uganda by cost, privacy, convenience and therapist access before choosing where to book.",
  },
  "cost-of-therapy-in-kenya": {
    title: "Therapy Cost in Kenya: Online Prices and Booking",
    description: "Compare therapy costs in Kenya and book a licensed African therapist online for confidential support by video or chat.",
  },
  "find-a-therapist-in-nairobi": {
    title: "Find a Therapist in Nairobi and Book Online",
    description: "Find a licensed therapist in Nairobi for confidential online therapy, with clear session options, local context and simple booking.",
  },
  "cost-of-therapy-in-nigeria": {
    title: "Therapy Cost in Nigeria: Online Prices and Booking",
    description: "Compare therapy costs in Nigeria and book confidential online support with a licensed African therapist using card payment.",
  },
  "find-a-therapist-in-lagos": {
    title: "Find a Therapist in Lagos and Book Online",
    description: "Find a licensed therapist in Lagos for confidential online therapy by video or chat, with clear availability and simple booking.",
  },
  "cost-of-therapy-in-ghana": {
    title: "Therapy Cost in Ghana: Online Prices and Booking",
    description: "Compare therapy costs in Ghana and book confidential online support with a licensed African therapist using card payment.",
  },
  "find-a-therapist-in-accra": {
    title: "Find a Therapist in Accra and Book Online",
    description: "Find a licensed therapist in Accra for confidential online therapy by video or chat, with clear availability and simple booking.",
  },
  "mental-health-support-students-uganda": {
    title: "Student Counselling Uganda: Find Support Online",
    description: "Find confidential student counselling in Uganda for study pressure, anxiety, relationships and family difficulties with a licensed therapist.",
  },
  "burnout-kampala-professionals": {
    title: "Burnout Therapy Kampala: Online Support for Work Stress",
    description: "Book confidential burnout therapy in Kampala with a licensed therapist who understands workplace pressure and professional life in Uganda.",
  },
  "men-therapy-uganda": {
    title: "Therapy for Men in Uganda: Confidential Online Support",
    description: "Find confidential therapy for men in Uganda with licensed African therapists and private video or chat sessions.",
  },
  "uganda-workplace-mental-health-crisis": {
    title: "Workplace Mental Health Support Uganda | InnerSpark",
    description: "Get workplace mental health training and confidential employee support in Uganda for stress, burnout and healthier teams.",
  },
};

// Node does not automatically load Vite's .env file during postbuild.
// Keep the public read-only project details as fallbacks so blog prerendering
// still runs on hosts that expose these values only to the browser bundle.
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://hnjpsvpudwwyzrrwzbpa.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuanBzdnB1ZHd3eXpycnd6YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDgyODAsImV4cCI6MjA3Nzc4NDI4MH0.2s0TlAxFujnY2FMz0SDbzrjbsMCsgg1eCBHfUiiAGIQ";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SPARK_PILLARS_SECTION = `<section class="blog-callout">
  <h2>The five S.P.A.R.K wellbeing pillars</h2>
  <h3>S — Sleep</h3><p>Protect a regular sleep window and reduce late-night screen time where your routine allows.</p>
  <h3>P — Purpose</h3><p>Choose one meaningful priority for the week instead of trying to solve everything at once.</p>
  <h3>A — Activity</h3><p>Move your body in a realistic way: walking, stretching, sport or active household work all count.</p>
  <h3>R — Relationships</h3><p>Make time for at least one honest conversation with someone you trust.</p>
  <h3>K — Knowledge</h3><p>Notice patterns in your mood, stress and coping, then seek reliable information or professional support when needed.</p>
</section>`;

const THERAPY_TYPES_SECTION = `<section class="blog-callout">
  <h2>Therapy options available through InnerSpark Africa</h2>
  <p>Choose the kind of support that matches what you want help with. A licensed therapist can explain the best starting point during your first confidential session.</p>
  <h3>Individual therapy</h3><p>One-to-one support for anxiety, depression, grief, trauma, stress, burnout and major life changes.</p>
  <h3>Couples therapy</h3><p>Practical support for communication, conflict, trust and relationship decisions.</p>
  <h3>Teen and student counselling</h3><p>Age-appropriate support for school pressure, family difficulties, confidence and emotional wellbeing.</p>
  <h3>Video and chat therapy</h3><p>Video therapy costs UGX 75,000 per session. Chat therapy costs UGX 30,000 for people who prefer written support.</p>
  <p><a href="/book-therapist">Choose a licensed African therapist and book a session</a>.</p>
</section>`;

const removeLeakedTemplateCode = (input) => {
  let source = String(input ?? "");
  if (/therapyTypes\.map|therapy\.icon|therapy\.name/.test(source)) {
    source = source.replace(/\{therapyTypes\.map\([\s\S]*?(?:\}\)\}|\}\);?)/g, THERAPY_TYPES_SECTION);
    if (!source.includes(THERAPY_TYPES_SECTION)) source += THERAPY_TYPES_SECTION;
  }
  if (/pillars\.map|p\.letter|p\.name|p\.body/.test(source)) {
    source = source.replace(/\{pillars\.map\([\s\S]*?(?:\)\)\}|\}\);?)/g, SPARK_PILLARS_SECTION);
    if (!source.includes(SPARK_PILLARS_SECTION)) source += SPARK_PILLARS_SECTION;
  }
  return source
    .split(/\r?\n/)
    .filter((line) => !/^\s*(?:\{?[A-Za-z_$][\w$]*\.map\(|const\s+Icon\s*=|return\s*\(|\{[A-Za-z_$][\w$]*\.(?:name|description|icon)\}|[)};,]+\s*$)/.test(line))
    .join("\n")
    .replace(/\{(?:therapy|p)\.(?:name|description|icon|letter|body)\}/g, "")
    .replace(/\{(?:therapyTypes|pillars)\.map\([^\n]*/g, "")
    .replace(/\{(?:title|desc|description|category|date|readTime)\}/g, "")
    .replace(/(?:Back to Blog\s*){2,}/gi, "Back to Blog ")
    .replace(/<[^>]+>\s*<\/[^>]+>/g, "");
};

/** Keep the article markup but drop anything executable. */
const sanitize = (html) =>
  removeLeakedTemplateCode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<h1([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<[^>]+>\s*(?:Back to Blog|desc|\{title\})\s*<\/[^>]+>/gi, "")
    .replace(/browse 20\+ licensed therapists/gi, "browse licensed therapists")
    .replace(/start with a free consultation/gi, "start by choosing a therapist")
    .replace(/free initial consultations?/gi, "an introductory conversation where available")
    .replace(/free consultation/gi, "therapist matching support")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/video, voice or chat from UGX 30,000/gi, "video therapy at UGX 75,000 or chat therapy at UGX 30,000")
    .replace(/online therapy starting from UGX 30,000 per session/gi, "video therapy at UGX 75,000 per session and chat therapy at UGX 30,000")
    .replace(/therapy starting from UGX 30,000 per session/gi, "video therapy at UGX 75,000 per session and chat therapy at UGX 30,000")
    .replace(/video sessions? (?:start at|costs?) UGX 30,000/gi, "video sessions cost UGX 75,000")
    .replace(/sessions? from UGX 30,000/gi, "video sessions at UGX 75,000 or chat sessions at UGX 30,000")
    .replace(/UGX 30,000\s*[–-]\s*75,000 per session/gi, "UGX 75,000 for video or UGX 30,000 for chat per session");

function upsert(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildHead(shell, post) {
  const defaultUrl = `${SITE}/blog/${post.slug}/`;
  const configuredUrl = post.canonical_url?.trim();
  const url = configuredUrl
    ? configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`
    : defaultUrl;
  const override = SEO_OVERRIDES[post.slug];
  const title = override?.title || post.meta_title?.trim() || `${post.title} | InnerSpark Africa`;
  const description = override?.description || post.meta_description || post.excerpt || post.title;
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
    <div data-prerendered-seo="true" class="min-h-screen bg-[#F7F3EA] text-[#111827]">
      <main>
        <header class="border-b border-[#D9D0BF]">
          <div class="container mx-auto px-4 py-12 max-w-5xl">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">${esc(post.category || "Mental health")}</p>
            <h1 class="font-serif text-4xl md:text-6xl font-semibold leading-tight mb-5">${esc(post.title)}</h1>
            ${post.excerpt ? `<p class="text-xl leading-relaxed text-[#4B5563] mb-6 max-w-3xl">${esc(post.excerpt)}</p>` : ""}
            <p class="text-sm text-[#4B5563]">${esc(date)}${post.read_time ? ` &middot; ${esc(post.read_time)}` : ""} &middot; By ${esc(
              post.author || "InnerSpark Africa Clinical Team",
            )}</p>
            <div class="mt-8 rounded-2xl bg-white border border-[#D9D0BF] p-5 max-w-2xl">
              <p class="font-bold mb-1">Video therapy: UGX 75,000 per session</p>
              <p class="text-[#4B5563]">Chat therapy: UGX 30,000. Pay by Mobile Money or card.</p>
            </div>
          </div>
        </header>
        <article class="container mx-auto px-4 py-12 max-w-3xl">
          <div class="blog-body prose prose-lg max-w-none mb-10">${sanitize(post.content)}</div>
          ${faqHtml}
          <p class="mb-6"><a class="text-primary font-semibold underline underline-offset-4" href="/book-therapist">Book video therapy with a licensed African therapist</a></p>
          <nav aria-label="Site sections">
            <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
            <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
          </nav>
        </article>
      </main>
    </div>`;
}

function buildListingBody(posts) {
  const links = GLOBAL_LINKS.map(
    ([href, label]) =>
      `<li><a class="text-primary underline underline-offset-4" href="${href}">${esc(label)}</a></li>`,
  ).join("");

  const items = posts
    .map((post) => {
      const published = post.published_at || post.created_at;
      const date = new Date(published).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const url = `/blog/${post.slug}/`;
      return `
        <article class="mb-8">
          <h2 class="text-xl font-bold mb-1"><a class="text-primary underline underline-offset-4" href="${url}">${esc(post.title)}</a></h2>
          <p class="text-sm text-foreground/60 mb-2">${esc(date)}${post.read_time ? ` &middot; ${esc(post.read_time)}` : ""}</p>
          ${post.excerpt ? `<p class="text-foreground/80">${esc(post.excerpt)}</p>` : ""}
        </article>`;
    })
    .join("");

  return `
    <div data-prerendered-seo="true" class="min-h-screen bg-background text-foreground">
      <main class="container mx-auto px-4 py-12 max-w-3xl">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Mental Health Blog Uganda | InnerSpark Africa</h1>
        <p class="text-lg leading-relaxed text-foreground/80 mb-10">Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.</p>
        ${items}
        <nav aria-label="Site sections" class="mt-12">
          <h2 class="text-xl font-bold mb-3">Explore InnerSpark Africa</h2>
          <ul class="grid gap-2 sm:grid-cols-2">${links}</ul>
        </nav>
      </main>
    </div>`;
}

const ROOT_RE = /<div id="root">\s*<\/div>/;

async function fetchPosts() {
  const url =
    `${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&select=*&order=published_at.desc&limit=${MAX_POSTS}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`[prerender-blogs] blog fetch failed: ${res.status} ${await res.text()}`);
  }
  const posts = await res.json();
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("[prerender-blogs] no published blog posts returned; refusing to ship homepage fallbacks for blog URLs");
  }
  return posts;
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

  // Prerender the /blog listing page so crawlers see all article links.
  const listingHead = buildHead(shell, {
    slug: "blog",
    title: "Mental Health Blog Uganda | InnerSpark Africa",
    excerpt: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    meta_title: "Mental Health Blog Uganda | InnerSpark Africa",
    meta_description: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    canonical_url: `${SITE}/blog/`,
    og_title: "Mental Health Blog Uganda | InnerSpark Africa",
    og_description: "Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today.",
    og_image_url: `${SITE}/og-image.jpg`,
    schema_type: "CollectionPage",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
    author: "InnerSpark Africa",
  });
  const listingHtml = listingHead.replace(ROOT_RE, `<div id="root">${buildListingBody(posts)}</div>`);
  await mkdir(path.join(DIST, "blog"), { recursive: true });
  await writeFile(path.join(DIST, "blog", "index.html"), listingHtml, "utf8");

  console.log(`[prerender-blogs] ${count} blog post(s) + listing prerendered.`);
}

run().catch((err) => {
  console.error("[prerender-blogs] failed:", err);
});
