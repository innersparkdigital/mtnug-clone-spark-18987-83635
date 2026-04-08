import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create the user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: "info@innersparkafrica.com",
      password: "innerspark2023",
      email_confirm: true,
    });

    if (createError) {
      // If user exists, get their ID
      if (createError.message.includes("already been registered")) {
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        const existingUser = users.find((u: any) => u.email === "info@innersparkafrica.com");
        if (!existingUser) throw new Error("User not found");

        // Update password
        await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: "innerspark2023",
        });

        // Assign admin role
        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: existingUser.id, role: "admin" }, { onConflict: "user_id,role" });

        return new Response(JSON.stringify({ success: true, message: "User updated with admin role", userId: existingUser.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw createError;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: "admin" });

    if (roleError) throw roleError;

    // Create profile
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: userData.user.id, display_name: "Innerspark Africa" });

    return new Response(JSON.stringify({ success: true, message: "Admin user created", userId: userData.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
