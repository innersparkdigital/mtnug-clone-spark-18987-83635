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
  // Consolidated into /online-therapy (client redirects)
  "/virtual-therapy",
  "/video-therapy",
  "/mental-health-support",
  "/find-therapist",
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

const paths = routePaths();
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((p) => [
    "  <url>",
    `    <loc>${BASE_URL}${p === "/" ? "/" : p}</loc>`,
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${paths.length} urls)`);
