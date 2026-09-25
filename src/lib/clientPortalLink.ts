/**
 * Client portal link shared by staff. Clients now sign in with contact + passcode,
 * so the link is the login page — the permanent access token is never put in a URL.
 */
export const clientNameSlug = (fullName: string) =>
  (fullName || "client")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40) || "client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const buildClientPortalUrl = (_fullName?: string, _token?: string, origin?: string) =>
  `${origin ?? window.location.origin}/client-login`;
