/**
 * Client portal session helpers.
 * The opaque session token is issued by the backend (client_login / client_accept_invite /
 * client_complete_reset) and lives only in this tab's sessionStorage. The permanent
 * portal access token is never sent to or stored in the browser.
 */
import { supabase } from "@/integrations/supabase/client";

const KEY = "isp_client_session";
const LOGOUT_SIGNAL = "isp_client_logout";
export const CLIENT_IDLE_MS = 30 * 60 * 1000;

export const getClientSession = (): string | null => {
  try { return sessionStorage.getItem(KEY); } catch { return null; }
};

export const setClientSession = (token: string) => {
  try { sessionStorage.setItem(KEY, token); } catch { /* storage unavailable */ }
};

export const clearClientSession = () => {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
};

/** Revokes the session on the server, clears it locally and tells other tabs. */
export const logoutClient = async () => {
  const s = getClientSession();
  clearClientSession();
  try { localStorage.setItem(LOGOUT_SIGNAL, String(Date.now())); } catch { /* ignore */ }
  if (s) await supabase.rpc("client_logout", { _session: s }).then(() => undefined, () => undefined);
};

/** Subscribe to logout performed in another tab. */
export const onCrossTabLogout = (cb: () => void) => {
  const handler = (e: StorageEvent) => { if (e.key === LOGOUT_SIGNAL) cb(); };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
};

export const isSessionError = (err: { message?: string; code?: string } | null | undefined) =>
  !!err && (err.code === "28000" || /session_invalid/i.test(err.message || ""));
