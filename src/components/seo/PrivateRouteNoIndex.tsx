import { useLocation } from "react-router-dom";
import NoIndex from "./NoIndex";

/** Route prefixes that must never appear in search results. */
const PRIVATE_PREFIXES = [
  "/admin",
  "/therapist-portal",
  "/client-portal",
  "/my-space",
  "/dashboard",
  "/student-dashboard",
  "/learning-dashboard",
  "/corporate-admin",
  "/profile-settings",
  "/mind-check-analytics",
  "/wellness-reports",
  "/chat-sessions",
  "/my-goals",
  "/auth",
  "/reset-password",
  "/course-certificate",
  "/session-feedback",
  "/unsubscribe",
  "/payment-success",
  "/payment-canceled",
];

/**
 * Mounted once inside the router: applies noindex to private app surfaces
 * without touching each page component.
 */
export default function PrivateRouteNoIndex() {
  const { pathname } = useLocation();
  const isPrivate = PRIVATE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isPrivate) return null;
  return <NoIndex />;
}