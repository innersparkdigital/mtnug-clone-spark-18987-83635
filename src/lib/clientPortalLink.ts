/** Builds the private client-portal link with a friendly, name-based path. */
export const clientNameSlug = (fullName: string) =>
  (fullName || "client")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40) || "client";

export const buildClientPortalUrl = (fullName: string, token: string, origin?: string) =>
  `${origin ?? window.location.origin}/my-progress/${clientNameSlug(fullName)}/${token}`;
