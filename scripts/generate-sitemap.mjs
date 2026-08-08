// Generates public/sitemap.xml from the routes declared in src/App.tsx.
// Excludes dynamic, private and duplicate/redirect routes so Google only sees
// canonical, indexable pages. Runs before dev and build.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://www.innersparkafrica.com";

// Private / non-indexable routes (portals, dashboards, auth, transactional).
const EXCLUDE = new Set([
  "*",
  "/auth",
  "/reset-password",
  "/app-coming-soon",
  "/payment-success",
  "/payment-canceled",
  "/chat-sessions",
  "/my-goals",
  "/mood-check-in",
  "/profile-settings",
  "/account-deletion",
  "/corporate-admin",
  "/wellness-reports",
  "/therapist",
  "/admin/finance",
  "/learning/dashboard",
  "/learning/student-dashboard",
  "/learning/admin-dashboard",
  "/mind-check/analytics",
  "/unsubscribe",
  "/feedback",
  "/careers",
  "/corporate/service-request",
  "/thank-you-booking",
  "/thank-you-contact",
  "/thank-you-corporate",
  "/thank-you-referral",
  "/thank-you-newsletter",
  "/thank-you-download",
  // Consolidated into /online-therapy (301-style client redirects)
  "/virtual-therapy",
  "/video-therapy",
  "/mental-health-support",
]);

function routePaths() {
  const src = readFileSync(resolve("src/App.tsx"), "utf8");
  const paths = [...src.matchAll(/path="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  return paths.filter((p) => {
    if (p.includes(":") || EXCLUDE.has(p)) return false;
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}

function meta(path) {
  if (path === "/") return { changefreq: "daily", priority: "1.0" };
  if (/^\/(online-therapy|book-therapist|specialists|find-therapist|chat-therapy|services)$/.test(path))
    return { changefreq: "weekly", priority: "0.95" };
  if (/^\/(therapy-in-|depression-|anxiety-|relationship-|trauma-|marriage-|psychiatrist-|counselling-|therapist-near-|therapy-for-|online-therapy-)/.test(path))
    return { changefreq: "weekly", priority: "0.9" };
  if (path.startsWith("/blog")) return { changefreq: "weekly", priority: "0.8" };
  if (path.startsWith("/mind-check")) return { changefreq: "monthly", priority: "0.75" };
  if (path.startsWith("/events-training")) return { changefreq: "monthly", priority: "0.6" };
  if (/^\/(privacy-policy|terms-of-service|cookie-policy)$/.test(path))
    return { changefreq: "yearly", priority: "0.3" };
  return { changefreq: "monthly", priority: "0.7" };
}

const paths = routePaths();
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((p) => {
    const { changefreq, priority } = meta(p);
    return [
      "  <url>",
      `    <loc>${BASE_URL}${p === "/" ? "/" : p}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  }),
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${paths.length} urls)`);
