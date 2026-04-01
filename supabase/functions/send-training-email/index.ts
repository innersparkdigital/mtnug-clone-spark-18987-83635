import { corsHeaders } from "@supabase/supabase-js/cors";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      recipientEmail,
      recipientName,
      trainingTitle,
      trainingDate,
      trainingTime,
      meetingLink,
      meetingPassword,
      facilitatorName,
      facilitatorTitle,
    } = await req.json();

    if (!recipientEmail || !recipientName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const passwordLine = meetingPassword
      ? `🔒 Password: ${meetingPassword}`
      : "";

    const emailBody = `
Dear ${recipientName},

Thank you for registering for the InnerSpark Wellness Training.

We are excited to have you join us.

🧠 Session Details:
📅 Date: ${trainingDate}
⏰ Time: ${trainingTime}
📍 Platform: Google Meet

🔗 Meeting Link: ${meetingLink}
${passwordLine}

👩‍⚕️ Facilitator: ${facilitatorName}
${facilitatorTitle}

💙 We look forward to supporting your mental wellbeing.

If you have any questions, feel free to reply to this email.

Warm regards,
InnerSpark Africa
www.innersparkafrica.com
    `.trim();

    // Send via Resend or SMTP — for now, use a simple fetch to a mail API
    // We'll use the built-in Deno SMTP or a simple approach
    // For production, integrate with an email service

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "InnerSpark Africa <info@innersparkafrica.com>",
          to: [recipientEmail],
          subject: `Registration Confirmed: ${trainingTitle}`,
          text: emailBody,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Email send failed:", errText);
      }
    } else {
      // Fallback: open WhatsApp with the info
      console.log("No email API key configured. Email content:", emailBody);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-training-email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

Deno.serve(handler);
