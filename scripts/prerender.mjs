import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ROUTES, GLOBAL_LINKS, SITE } from "./prerender-content.mjs";

const DIST = path.resolve(process.cwd(), "dist");
const ROOT_RE = /<div id="root">\s*<\/div>/;
const esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function upsert(html, matcher, tag) {
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildHead(shell, route) {
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  let html = shell;
  html = upsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`);
  html = upsert(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${esc(route.description)}" />`);
  html = upsert(html, /<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${url}" />`);
  html = upsert(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${esc(route.title)}" />`);
  html = upsert(html, /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${esc(route.description)}" />`);
  html = upsert(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);
  return html;
}

function buildBody(route) {
  const sections = route.sections.map((section) => `<section><h2>${esc(section.h2)}</h2><p>${esc(section.p)}</p></section>`).join("");
  const links = GLOBAL_LINKS.filter(([href]) => href !== route.path).map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("");
  return `<main data-prerendered-seo="true"><h1>${esc(route.h1)}</h1><p>${esc(route.intro)}</p>${sections}<p><a href="/book-therapist">Book a session with a licensed therapist</a></p><nav aria-label="Site sections"><h2>Explore InnerSpark Africa</h2><ul>${links}</ul></nav></main>`;
}

async function run() {
  const shellPath = path.join(DIST, "index.html");
  const shell = await readFile(shellPath, "utf8");
  if (!ROOT_RE.test(shell)) return;
  await writeFile(path.join(DIST, "index.template.html"), shell, "utf8");
  for (const route of ROUTES) {
    const html = buildHead(shell, route).replace(ROOT_RE, `<div id="root">${buildBody(route)}</div>`);
    const output = route.path === "/" ? shellPath : path.join(DIST, route.path.slice(1), "index.html");
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html, "utf8");
  }
}

run().catch((error) => console.error("[prerender] failed:", error));
