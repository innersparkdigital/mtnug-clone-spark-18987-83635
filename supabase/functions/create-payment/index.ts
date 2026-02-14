import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { customerEmail, customerName, bookingDetails } = await req.json();
    
    if (!customerEmail && !customerName) {
      throw new Error("Customer email or name is required");
    }

    logStep("Request parsed", { customerEmail, customerName });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Build metadata from booking details
    const metadata: Record<string, string> = {};
    if (bookingDetails) {
      if (bookingDetails.name) metadata.customer_name = bookingDetails.name;
      if (bookingDetails.phone) metadata.phone = bookingDetails.phone;
      if (bookingDetails.preferredDay) metadata.preferred_day = bookingDetails.preferredDay;
      if (bookingDetails.preferredTime) metadata.preferred_time = bookingDetails.preferredTime;
      if (bookingDetails.preferredLanguage) metadata.preferred_language = bookingDetails.preferredLanguage;
      if (bookingDetails.country) metadata.country = bookingDetails.country;
      if (bookingDetails.specialistName) metadata.specialist = bookingDetails.specialistName;
      if (bookingDetails.assessmentType) metadata.assessment_type = bookingDetails.assessmentType;
      if (bookingDetails.severity) metadata.severity = bookingDetails.severity;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price: "price_1T0dekD2HjwgbgoMoAHFxd5H",
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
