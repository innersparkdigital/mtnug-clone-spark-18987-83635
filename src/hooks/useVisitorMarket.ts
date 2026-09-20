import { useEffect, useState } from "react";

export type VisitorMarket = "kenya" | "nigeria" | "tanzania" | "gambia" | "ghana" | "usa";

const COUNTRY_MARKETS: Record<string, VisitorMarket> = {
  KE: "kenya",
  NG: "nigeria",
  TZ: "tanzania",
  GM: "gambia",
  GH: "ghana",
  US: "usa",
};

const TIMEZONE_MARKETS: Record<string, VisitorMarket> = {
  "Africa/Nairobi": "kenya",
  "Africa/Lagos": "nigeria",
  "Africa/Dar_es_Salaam": "tanzania",
  "Africa/Banjul": "gambia",
  "Africa/Accra": "ghana",
};

/** Privacy-friendly country hint based only on browser locale and timezone. */
export function detectVisitorMarket(): VisitorMarket | null {
  try {
    const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const locale of locales) {
      const country = locale.match(/[-_]([A-Za-z]{2})$/)?.[1]?.toUpperCase();
      if (country && COUNTRY_MARKETS[country]) return COUNTRY_MARKETS[country];
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_MARKETS[timezone]) return TIMEZONE_MARKETS[timezone];
    if (timezone.startsWith("America/")) return "usa";
  } catch {
    return null;
  }
  return null;
}

export function useVisitorMarket(): VisitorMarket | null {
  const [market, setMarket] = useState<VisitorMarket | null>(null);
  useEffect(() => setMarket(detectVisitorMarket()), []);
  return market;
}