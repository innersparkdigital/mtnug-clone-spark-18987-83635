// Single source of truth for session type options used by the Therapy Session
// Tracker table and the "Add a new client session" modal.
export const SESSION_TYPES = [
  "Video individual session",
  "Chat-based session",
  "Video Couple session",
  "Online Support session",
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const DEFAULT_SESSION_TYPE: SessionType = "Video individual session";

// Legacy values recorded before the taxonomy change. Anything not listed here
// is flagged for manual review instead of being guessed.
const LEGACY_MAP: Record<string, SessionType> = {
  individual: "Video individual session",
  couple: "Video Couple session",
  couples: "Video Couple session",
  chat: "Chat-based session",
  group: "Online Support session",
};

/** Normalises a stored value to a canonical option, or null when unmappable. */
export const normalizeSessionType = (value?: string | null): SessionType | null => {
  if (!value) return null;
  const match = SESSION_TYPES.find((t) => t.toLowerCase() === value.trim().toLowerCase());
  if (match) return match;
  return LEGACY_MAP[value.trim().toLowerCase()] ?? null;
};
