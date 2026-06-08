import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const DEFAULT_SITE = "https://www.innersparkafrica.com/";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function gsc(path: string, init: RequestInit = {}) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!lovableKey || !gscKey) {
    return { ok: false, status: 503, body: { error: "Google Search Console connector not linked. Connect it in Lovable Cloud settings." } };
  }
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gscKey,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch { /* keep as text */ }
  return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // ---- admin auth ----
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id, _role: "admin",
    });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "overview");
    const siteUrl = String(body.siteUrl || DEFAULT_SITE);
    const encodedSite = encodeURIComponent(siteUrl);

    // ---- list verified sites ----
    if (action === "sites") {
      const r = await gsc("/webmasters/v3/sites");
      return json(r.body, r.ok ? 200 : r.status);
    }

    // ---- query searchanalytics: top queries OR top pages OR overview ----
    if (action === "overview" || action === "queries" || action === "pages") {
      const today = new Date();
      const endDate = body.endDate || new Date(today.getTime() - 2 * 86400000).toISOString().slice(0, 10);
      const startDate = body.startDate || new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);
      const rowLimit = Math.min(Number(body.rowLimit) || 25, 100);

      if (action === "overview") {
        // Run two queries in parallel: queries + pages
        const [q, p, totals] = await Promise.all([
          gsc(`/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
            method: "POST",
            body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit }),
          }),
          gsc(`/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
            method: "POST",
            body: JSON.stringify({ startDate, endDate, dimensions: ["page"], rowLimit }),
          }),
          gsc(`/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
            method: "POST",
            body: JSON.stringify({ startDate, endDate, dimensions: [], rowLimit: 1 }),
          }),
        ]);
        if (!q.ok && !p.ok) return json({ error: "GSC error", details: q.body }, q.status);
        return json({
          startDate, endDate, siteUrl,
          queries: q.body?.rows || [],
          pages: p.body?.rows || [],
          totals: totals.body?.rows?.[0] || null,
        });
      }

      const dim = action === "queries" ? "query" : "page";
      const r = await gsc(`/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: [dim], rowLimit }),
      });
      return json(r.ok ? { startDate, endDate, rows: r.body?.rows || [] } : r.body, r.ok ? 200 : r.status);
    }

    // ---- inspect / request indexing ----
    if (action === "inspect") {
      const inspectionUrl = String(body.url || "");
      if (!inspectionUrl) return json({ error: "url required" }, 400);
      const r = await gsc(`/v1/urlInspection/index:inspect`, {
        method: "POST",
        body: JSON.stringify({ inspectionUrl, siteUrl }),
      });
      return json(r.body, r.ok ? 200 : r.status);
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});