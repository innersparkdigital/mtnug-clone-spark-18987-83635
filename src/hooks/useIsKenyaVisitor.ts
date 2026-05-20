import { useEffect, useState } from "react";

/**
 * Detects whether the visitor is likely browsing from Kenya based on
 * browser timezone (Africa/Nairobi) or locale (sw-KE / sw / *-ke).
 * Returns null while detecting on first paint, then true/false.
 */
export function useIsKenyaVisitor(): boolean | null {
  const [isKE, setIsKE] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lang = (navigator.language || "").toLowerCase();
      const ke =
        tz === "Africa/Nairobi" ||
        lang === "sw-ke" ||
        lang === "sw" ||
        lang.startsWith("sw-") ||
        lang.endsWith("-ke");
      setIsKE(ke);
    } catch {
      setIsKE(false);
    }
  }, []);

  return isKE;
}