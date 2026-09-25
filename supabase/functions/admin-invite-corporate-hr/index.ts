import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return response({ error: "Unauthorized" }, 401);
    const caller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error: authError } = await caller.auth.getUser();
    if (authError || !user) return response({ error: "Unauthorized" }, 401);
    const admin = createClient(url, key);
    const { data: allowed, error: roleError } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (roleError || !allowed) return response({ error: "Staff admin access required" }, 403);
    const body = await req.json();
    const companyId = String(body.company_id || "");
    const name = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[0-9a-f-]{36}$/i.test(companyId) || name.length < 2 || name.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response({ error: "Valid company, name and email required" }, 400);
    }
    const { data: company, error: companyError } = await admin.from("corporate_companies").select("id,is_active").eq("id", companyId).single();
    if (companyError || !company?.is_active) return response({ error: "Company not found or inactive" }, 404);
    const { data: existing } = await admin.from("corporate_hr_admins").select("id").eq("email", email).maybeSingle();
    if (existing) return response({ error: "An HR account already uses this email. Review it before inviting again." }, 409);
    // Do not attach existing auth users to a company automatically: this requires identity verification.
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: "https://www.innersparkafrica.com/corporate-dashboard",
      data: { display_name: name },
    });
    if (inviteError || !invited.user) return response({ error: inviteError?.message || "Invitation failed; check whether this email already has an account" }, 409);
    const { error: linkError } = await admin.from("corporate_hr_admins").insert({
      company_id: companyId, user_id: invited.user.id, full_name: name, email,
      is_active: true, must_change_password: false,
    });
    if (linkError) {
      // Never grant company access if the account could not be linked. Leave auth user for manual review.
      console.error("HR invitation link failed", linkError);
      return response({ error: "Invitation sent but company link failed. Contact an administrator before retrying." }, 500);
    }
    return response({ ok: true, email });
  } catch (err) {
    console.error("HR invitation failed", err);
    return response({ error: "Invitation failed" }, 500);
  }
});
