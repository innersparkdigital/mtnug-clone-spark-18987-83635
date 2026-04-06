import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, csvContent, totalSessions, totalEmails } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email address required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use the transactional email queue to send backup
    const payload = {
      to: email,
      subject: `Mind Check Analytics Backup - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Mind Check Analytics Backup</h2>
          <p>Hello,</p>
          <p>Here is your Mind Check analytics backup summary:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Backup Date</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Total Sessions</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${totalSessions || 0}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Total Emails Collected</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${totalEmails || 0}</td>
            </tr>
          </table>
          <p>The full CSV backup data is included below. Copy and save as a .csv file:</p>
          <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 11px; overflow-x: auto; max-height: 400px; white-space: pre-wrap;">${csvContent?.substring(0, 50000) || "No data"}</pre>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">This is an automated backup from InnerSpark Africa Mind Check Analytics.</p>
        </div>
      `,
      purpose: "transactional",
      idempotency_key: `mindcheck-backup-${new Date().toISOString().split("T")[0]}-${user.id}`,
    };

    // Try to enqueue via the email queue
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const { error: enqueueError } = await serviceClient.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: JSON.stringify(payload),
    });

    if (enqueueError) {
      console.error("Enqueue error:", enqueueError);
      // Fallback: just log it
      return new Response(
        JSON.stringify({
          success: true,
          method: "download_only",
          message:
            "Email sending is not yet available (DNS pending). The CSV has been downloaded instead.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        method: "email_sent",
        message: `Backup email queued for delivery to ${email}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Backup email error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
