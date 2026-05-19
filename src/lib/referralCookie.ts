const COOKIE_NAME = "innerspark_ref";
const COOKIE_DAYS = 30;

export function setReferralCookie(slug: string) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_DAYS * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(slug)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  try {
    sessionStorage.setItem(COOKIE_NAME, slug);
  } catch {}
}

export function getReferralCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (m) return decodeURIComponent(m[1]);
  try {
    return sessionStorage.getItem(COOKIE_NAME);
  } catch {
    return null;
  }
}

export function clearReferralCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  try {
    sessionStorage.removeItem(COOKIE_NAME);
  } catch {}
}