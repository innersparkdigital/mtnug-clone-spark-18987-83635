import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hides the site-wide floating chat widgets on the Amani pages, so visitors
 * never see two different chat bubbles at once (and the embed stays clean).
 */
export default function HideOnAmaniPages({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  if (/^\/(talk-to-amani|amani-embed)(\/|$)/.test(pathname)) return null;
  return <>{children}</>;
}
