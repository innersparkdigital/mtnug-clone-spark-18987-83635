// Doctor referral commission tier model (monthly, flat per-patient).
// A "successful" referral = status === 'completed' AND payment_status === 'paid'.
// Tier resets each calendar month; the tier rate applies to ALL successful
// referrals in that month.

export const SESSION_FEE_UGX = 75000;
export const THERAPIST_SHARE_UGX = 63750; // 85%
export const INNERSPARK_MARGIN_UGX = 11250; // 15%

export type Tier = {
  level: 1 | 2 | 3;
  label: string;
  range: string;
  perPatient: number;
  marginPct: number;
  min: number;
  max: number; // exclusive upper bound for level (Infinity for top tier)
};

export const TIERS: Tier[] = [
  { level: 1, label: "Tier 1", range: "1–5 referrals", perPatient: 3375, marginPct: 30, min: 1, max: 6 },
  { level: 2, label: "Tier 2", range: "6–15 referrals", perPatient: 4500, marginPct: 40, min: 6, max: 16 },
  { level: 3, label: "Tier 3", range: "16+ referrals", perPatient: 5625, marginPct: 50, min: 16, max: Infinity },
];

export const tierForCount = (count: number): Tier => {
  if (count <= 5) return TIERS[0];
  if (count <= 15) return TIERS[1];
  return TIERS[2];
};

export const nextTier = (count: number): Tier | null => {
  const cur = tierForCount(count);
  if (cur.level === 3) return null;
  return TIERS[cur.level]; // next index
};

export const referralsToNextTier = (count: number): number => {
  const next = nextTier(count);
  if (!next) return 0;
  return Math.max(0, next.min - count);
};

export const fmtUGX = (n: number) =>
  `UGX ${Math.round(n || 0).toLocaleString()}`;

export const monthKey = (d: Date | string) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
};

export type ReferralLike = {
  status: string;
  payment_status: string;
  created_at: string;
};

export const isSuccessful = (r: ReferralLike) =>
  r.status === "completed" && r.payment_status === "paid";

export type MonthlyBreakdown = {
  monthKey: string;
  monthLabel: string;
  successCount: number;
  totalCount: number;
  tier: Tier;
  perPatient: number;
  earned: number; // tier perPatient * successCount
};

export const buildMonthlyBreakdown = (referrals: ReferralLike[]): MonthlyBreakdown[] => {
  const buckets = new Map<string, { success: number; total: number }>();
  referrals.forEach((r) => {
    const k = monthKey(r.created_at);
    const cur = buckets.get(k) || { success: 0, total: 0 };
    cur.total += 1;
    if (isSuccessful(r)) cur.success += 1;
    buckets.set(k, cur);
  });
  return Array.from(buckets.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([k, v]) => {
      const tier = tierForCount(v.success);
      return {
        monthKey: k,
        monthLabel: monthLabel(k),
        successCount: v.success,
        totalCount: v.total,
        tier,
        perPatient: v.success > 0 ? tier.perPatient : 0,
        earned: v.success * (v.success > 0 ? tier.perPatient : 0),
      };
    });
};