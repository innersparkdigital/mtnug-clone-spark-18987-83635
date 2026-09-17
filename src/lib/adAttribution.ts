export interface AdAttribution {
  leadReference: string;
  landingPath: string;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

const STORAGE_KEY = "innerspark_ad_attribution_v1";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

interface StoredAttribution extends AdAttribution {
  capturedAt: number;
}

const getParam = (params: URLSearchParams, name: string) => {
  const value = params.get(name)?.trim();
  return value || null;
};

const newReference = () => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `ISA-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
};

export const captureAdAttribution = (): AdAttribution => {
  const params = new URLSearchParams(window.location.search);
  let stored: StoredAttribution | null = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredAttribution) : null;
    if (parsed && Date.now() - parsed.capturedAt <= MAX_AGE_MS) stored = parsed;
  } catch {
    stored = null;
  }

  const hasNewAttribution = [
    "gclid", "gbraid", "wbraid", "utm_source", "utm_medium",
    "utm_campaign", "utm_content", "utm_term",
  ].some((key) => params.has(key));

  const attribution: StoredAttribution = {
    leadReference: hasNewAttribution || !stored ? newReference() : stored.leadReference,
    landingPath: hasNewAttribution || !stored
      ? `${window.location.pathname}${window.location.search}`
      : stored.landingPath,
    gclid: getParam(params, "gclid") ?? stored?.gclid ?? null,
    gbraid: getParam(params, "gbraid") ?? stored?.gbraid ?? null,
    wbraid: getParam(params, "wbraid") ?? stored?.wbraid ?? null,
    utmSource: getParam(params, "utm_source") ?? stored?.utmSource ?? null,
    utmMedium: getParam(params, "utm_medium") ?? stored?.utmMedium ?? null,
    utmCampaign: getParam(params, "utm_campaign") ?? stored?.utmCampaign ?? null,
    utmContent: getParam(params, "utm_content") ?? stored?.utmContent ?? null,
    utmTerm: getParam(params, "utm_term") ?? stored?.utmTerm ?? null,
    capturedAt: hasNewAttribution || !stored ? Date.now() : stored.capturedAt,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Tracking must never block a booking.
  }

  return attribution;
};
