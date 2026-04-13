import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[PESAPAL-PAYMENT] ${step}${detailsStr}`);
};

async function getAuthToken(): Promise<string> {
  const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    throw new Error("PesaPal credentials not configured");
  }

  const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`PesaPal auth failed: ${JSON.stringify(data)}`);
  }

  logStep("Auth token obtained");
  return data.token;
}

async function registerIPN(token: string, callbackUrl: string): Promise<string> {
  const response = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: callbackUrl,
      ipn_notification_type: "GET",
    }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`IPN registration failed: ${JSON.stringify(data)}`);
  }

  logStep("IPN registered", { ipn_id: data.ipn_id });
  return data.ipn_id;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const {
      customerName,
      customerPhone,
      customerEmail,
      amount,
      currency,
      description,
      callbackUrl,
    } = await req.json();

    if (!customerName || !customerPhone || !amount) {
      throw new Error("Missing required fields: customerName, customerPhone, amount");
    }

    logStep("Request parsed", { customerName, amount, currency });

    // Step 1: Get auth token
    const token = await getAuthToken();

    // Step 2: Register IPN callback
    const ipnUrl = `${callbackUrl || req.headers.get("origin")}/payment-success`;
    const ipnId = await registerIPN(token, ipnUrl);

    // Step 3: Submit order
    const merchantReference = `INS-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const orderPayload = {
      id: merchantReference,
      currency: currency || "UGX",
      amount: Number(amount),
      description: description || "InnerSpark Africa Therapy Session",
      callback_url: `${req.headers.get("origin")}/payment-success?merchant_reference=${merchantReference}`,
      notification_id: ipnId,
      billing_address: {
        email_address: customerEmail || "",
        phone_number: customerPhone,
        first_name: customerName.split(" ")[0] || customerName,
        last_name: customerName.split(" ").slice(1).join(" ") || "",
        country_code: "UG",
      },
    };

    logStep("Submitting order", { merchantReference, amount: orderPayload.amount });

    const orderResponse = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const orderData = await orderResponse.json();
    if (!orderResponse.ok || orderData.error) {
      throw new Error(`Order submission failed: ${JSON.stringify(orderData)}`);
    }

    logStep("Order submitted", {
      order_tracking_id: orderData.order_tracking_id,
      redirect_url: orderData.redirect_url,
    });

    return new Response(
      JSON.stringify({
        url: orderData.redirect_url,
        orderTrackingId: orderData.order_tracking_id,
        merchantReference,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
