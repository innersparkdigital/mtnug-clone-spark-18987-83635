import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEMO = {
  email: "demo.doctor@innersparkafrica.com",
  password: "DemoDoctor@2025",
  full_name: "Demo Doctor",
  phone: "+256700000001",
  facility: "InnerSpark Demo Clinic",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if demo doctor already exists
    const { data: existingDoctor } = await supabase
      .from("doctors")
      .select("id, user_id")
      .eq("phone", DEMO.phone)
      .maybeSingle();

    if (existingDoctor) {
      // Reset password for the existing auth user so credentials are guaranteed
      await supabase.auth.admin.updateUserById(existingDoctor.user_id, {
        password: DEMO.password,
        email_confirm: true,
      });
      return new Response(
        JSON.stringify({
          status: "exists",
          credentials: { phone: DEMO.phone, email: DEMO.email, password: DEMO.password },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create the auth user (auto-confirmed)
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: DEMO.email,
      password: DEMO.password,
      email_confirm: true,
      user_metadata: { display_name: DEMO.full_name, is_doctor: true },
    });
    if (createErr) throw createErr;
    const userId = created.user?.id;
    if (!userId) throw new Error("No user id returned");

    const { error: insertErr } = await supabase.from("doctors").insert({
      user_id: userId,
      full_name: DEMO.full_name,
      phone: DEMO.phone,
      email: DEMO.email,
      facility: DEMO.facility,
    });
    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({
        status: "created",
        credentials: { phone: DEMO.phone, email: DEMO.email, password: DEMO.password },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});