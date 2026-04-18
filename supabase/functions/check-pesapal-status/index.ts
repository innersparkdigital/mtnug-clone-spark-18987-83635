import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderTrackingId } = await req.json();
    if (!orderTrackingId) {
      throw new Error("orderTrackingId is required");
    }

    // Get auth token
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
    if (!consumerKey || !consumerSecret) {
      throw new Error("PesaPal credentials not configured");
    }

    const authRes = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret }),
    });
    const authData = await authRes.json();
    if (!authRes.ok) throw new Error(`Auth failed: ${JSON.stringify(authData)}`);

    // Check transaction status
    const statusRes = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      }
    );
    const statusData = await statusRes.json();

    return new Response(JSON.stringify(statusData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
