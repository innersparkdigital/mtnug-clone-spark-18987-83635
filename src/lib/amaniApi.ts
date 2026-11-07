// Anonymous usage counts for the Amani widget.
// Only an organisation key, an event name and a day are counted. No message
// text, no user id, no IP address and no session id ever leave the browser.
import { supabase } from "@/integrations/supabase/client";

export const AMANI_EVENTS = [
  "chat_started",
  "message_sent",
  "chip_used",
  "crisis_card_shown",
  "urgent_help_opened",
  "counsellor_prompt_shown",
  "counsellor_prompt_dismissed",
  "next_step_clicked",
  "privacy_notice_opened",
] as const;

export type AmaniEvent = (typeof AMANI_EVENTS)[number];

export const DEFAULT_ORG = "innerspark";
const ORG_RE = /^[a-z0-9-]{2,40}$/;

/** Returns a valid organisation key, or null when it is missing or malformed. */
export function cleanOrgKey(value?: string | null): string | null {
  const key = (value ?? "").trim().toLowerCase();
  return ORG_RE.test(key) ? key : null;
}

// The Amani tables are newer than the generated database types, so the client
// is used through a loose type here. Tables are read only by admins (see the
// SQL migration); the counter function is the only public write path.
type LooseResult = { data: unknown; error: { message: string } | null };
export type AmaniDb = {
  rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<LooseResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};
export const amaniDb = supabase as unknown as AmaniDb;

export function recordAmaniEvent(orgKey: string | null | undefined, event: AmaniEvent): void {
  const org = cleanOrgKey(orgKey);
  if (!org) return;
  try {
    void Promise.resolve(amaniDb.rpc("amani_record_event", { _org: org, _event: event })).catch(() => {});
  } catch {
    /* counting must never break the chat */
  }
}
