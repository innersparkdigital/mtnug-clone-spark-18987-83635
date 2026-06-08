import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Idle-time prefetcher for high-traffic routes.
 *
 * Once the current page is interactive, we use requestIdleCallback to warm up
 * the route chunks visitors most often navigate to next. This means the JS
 * bundle for the next page is already in the browser cache by the time the
 * user clicks the link — navigations feel instant without hurting LCP.
 *
 * Skips entirely on Save-Data / 2G to respect low-bandwidth Uganda visitors.
 */

// Map of pathname -> dynamic importer. Keep this list short and high-intent.
const PREFETCH_BY_PATH: Record<string, () => Promise<unknown>> = {
  "/": () => Promise.all([
    import("@/pages/Specialists"),
    import("@/pages/BookTherapist"),
    import("@/pages/WellbeingCheck"),
    import("@/pages/MindCheck"),
    import("@/pages/About"),
  ]),
  "/specialists": () => Promise.all([
    import("@/pages/SpecialistProfile"),
    import("@/pages/BookTherapist"),
  ]),
  "/wellbeing-check": () => Promise.all([
    import("@/pages/MindCheck"),
    import("@/pages/BookTherapist"),
  ]),
  "/mind-check": () => Promise.all([
    import("@/pages/BookTherapist"),
    import("@/pages/Specialists"),
  ]),
  "/blog": () => Promise.all([
    import("@/pages/CmsBlogPost"),
  ]),
  "/about": () => Promise.all([
    import("@/pages/Contact"),
    import("@/pages/Services"),
  ]),
};

const shouldSkipPrefetch = () => {
  if (typeof navigator === "undefined") return false;
  const nav: any = navigator;
  if (nav?.connection?.saveData) return true;
  const eff = nav?.connection?.effectiveType;
  if (eff && /(^|-)2g$/i.test(eff)) return true;
  return false;
};

const RoutePrefetcher = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (shouldSkipPrefetch()) return;
    const importer = PREFETCH_BY_PATH[pathname];
    if (!importer) return;

    const w = window as any;
    let handle: number | undefined;
    const run = () => {
      importer().catch(() => {
        /* network hiccups are fine — user will pay the cost on click */
      });
    };
    if (typeof w.requestIdleCallback === "function") {
      handle = w.requestIdleCallback(run, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const t = window.setTimeout(run, 2000);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
};

export default RoutePrefetcher;