import { supabase } from "@/integrations/supabase/client";

/**
 * Auto-subscribe an email to the newsletter list.
 * Silently ignores duplicates or errors so it never blocks form submission.
 */
export async function autoSubscribeNewsletter(email: string) {
  try {
    await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: email.toLowerCase().trim(), is_active: true },
        { onConflict: "email" }
      );
  } catch {
    // Silent fail – newsletter subscription is secondary
  }
}
