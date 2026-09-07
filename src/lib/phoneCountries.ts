/**
 * Country dial codes + E.164 helpers for every phone field on the site.
 *
 * Numbers are stored as E.164 (e.g. "+233597090052") so the admin dashboard,
 * WhatsApp links and reminder automation all know which country a lead is in.
 */

export interface PhoneCountry {
  iso: string;
  name: string;
  dial: string; // without "+"
  flag: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "UG", name: "Uganda", dial: "256", flag: "🇺🇬" },
  { iso: "KE", name: "Kenya", dial: "254", flag: "🇰🇪" },
  { iso: "TZ", name: "Tanzania", dial: "255", flag: "🇹🇿" },
  { iso: "RW", name: "Rwanda", dial: "250", flag: "🇷🇼" },
  { iso: "GH", name: "Ghana", dial: "233", flag: "🇬🇭" },
  { iso: "NG", name: "Nigeria", dial: "234", flag: "🇳🇬" },
  { iso: "ZA", name: "South Africa", dial: "27", flag: "🇿🇦" },
  { iso: "SS", name: "South Sudan", dial: "211", flag: "🇸🇸" },
  { iso: "BI", name: "Burundi", dial: "257", flag: "🇧🇮" },
  { iso: "CD", name: "DR Congo", dial: "243", flag: "🇨🇩" },
  { iso: "ET", name: "Ethiopia", dial: "251", flag: "🇪🇹" },
  { iso: "SO", name: "Somalia", dial: "252", flag: "🇸🇴" },
  { iso: "ZM", name: "Zambia", dial: "260", flag: "🇿🇲" },
  { iso: "ZW", name: "Zimbabwe", dial: "263", flag: "🇿🇼" },
  { iso: "MW", name: "Malawi", dial: "265", flag: "🇲🇼" },
  { iso: "BW", name: "Botswana", dial: "267", flag: "🇧🇼" },
  { iso: "NA", name: "Namibia", dial: "264", flag: "🇳🇦" },
  { iso: "EG", name: "Egypt", dial: "20", flag: "🇪🇬" },
  { iso: "MA", name: "Morocco", dial: "212", flag: "🇲🇦" },
  { iso: "SN", name: "Senegal", dial: "221", flag: "🇸🇳" },
  { iso: "CM", name: "Cameroon", dial: "237", flag: "🇨🇲" },
  { iso: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { iso: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { iso: "IE", name: "Ireland", dial: "353", flag: "🇮🇪" },
  { iso: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { iso: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { iso: "SE", name: "Sweden", dial: "46", flag: "🇸🇪" },
  { iso: "NO", name: "Norway", dial: "47", flag: "🇳🇴" },
  { iso: "DK", name: "Denmark", dial: "45", flag: "🇩🇰" },
  { iso: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { iso: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { iso: "ES", name: "Spain", dial: "34", flag: "🇪🇸" },
  { iso: "BE", name: "Belgium", dial: "32", flag: "🇧🇪" },
  { iso: "CH", name: "Switzerland", dial: "41", flag: "🇨🇭" },
  { iso: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", flag: "🇸🇦" },
  { iso: "QA", name: "Qatar", dial: "974", flag: "🇶🇦" },
  { iso: "KW", name: "Kuwait", dial: "965", flag: "🇰🇼" },
  { iso: "OM", name: "Oman", dial: "968", flag: "🇴🇲" },
  { iso: "TR", name: "Turkey", dial: "90", flag: "🇹🇷" },
  { iso: "IN", name: "India", dial: "91", flag: "🇮🇳" },
  { iso: "CN", name: "China", dial: "86", flag: "🇨🇳" },
];

export const DEFAULT_DIAL = "256";

/** Path fragments that imply a country for the phone field default. */
const PATH_DIAL_HINTS: Array<[RegExp, string]> = [
  [/ghana/i, "233"],
  [/nigeria/i, "234"],
  [/south-africa/i, "27"],
  [/kenya/i, "254"],
  [/tanzania/i, "255"],
  [/rwanda/i, "250"],
  [/uganda|kampala/i, "256"],
];

/**
 * Best-guess dial code for the current page: explicit country pages win, then
 * the browser locale region, then Uganda.
 */
export function detectDefaultDial(pathname?: string): string {
  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  for (const [re, dial] of PATH_DIAL_HINTS) {
    if (re.test(path)) return dial;
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    const region = navigator.language.split("-")[1]?.toUpperCase();
    const match = region && PHONE_COUNTRIES.find((c) => c.iso === region);
    if (match) return match.dial;
  }
  return DEFAULT_DIAL;
}

/** Combine a dial code and locally typed digits into an E.164 number. */
export function toE164(dial: string, local: string): string {
  const localDigits = String(local).replace(/\D/g, "").replace(/^0+/, "");
  const dialDigits = String(dial).replace(/\D/g, "");
  if (!localDigits) return "";
  // User pasted a full international number — trust it over the selector.
  if (localDigits.startsWith(dialDigits) && localDigits.length > dialDigits.length + 5) {
    return `+${localDigits}`;
  }
  return `+${dialDigits}${localDigits}`;
}

/** A phone value is usable if it has a country code and enough digits. */
export function isValidE164(value: string): boolean {
  return /^\+\d{8,15}$/.test(String(value).replace(/[\s()-]/g, ""));
}

/** Split a stored E.164 value back into selector + local digits. */
export function splitE164(value: string, fallbackDial = DEFAULT_DIAL): { dial: string; local: string } {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return { dial: fallbackDial, local: "" };
  const dials = [...new Set(PHONE_COUNTRIES.map((c) => c.dial))].sort((a, b) => b.length - a.length);
  const hit = dials.find((d) => digits.startsWith(d));
  if (hit) return { dial: hit, local: digits.slice(hit.length) };
  return { dial: fallbackDial, local: digits };
}

/** Display helper for tables: shows "+256 792085773", legacy numbers untouched. */
export function formatPhoneDisplay(value?: string | null): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!raw.startsWith("+")) return raw;
  const { dial, local } = splitE164(raw);
  return local ? `+${dial} ${local}` : raw;
}

/** Digits-only form for wa.me links. */
export function toWhatsAppDigits(value: string): string {
  return String(value || "").replace(/\D/g, "");
}
