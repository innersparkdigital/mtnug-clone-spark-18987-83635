// Score-to-Business-Impact engine for corporate wellbeing screening.
// All UGX figures use mid-point of WHO/Deloitte productivity-loss ranges.

export const DEFAULT_MONTHLY_SALARY_UGX = 1_200_000;
export const STANDARD_EAP_PER_EMPLOYEE_UGX = 400_000; // mid-point of 400k–650k tier

export const PRODUCTIVITY_LOSS = {
  healthy: { min: 0.0, max: 0.05 },
  at_risk: { min: 0.2, max: 0.35 },
  critical: { min: 0.4, max: 0.6 },
} as const;

export const DAYS_LOST = {
  healthy: { min: 0, max: 5 },
  at_risk: { min: 8, max: 18 },
  critical: { min: 20, max: 30 },
} as const;

export type Distribution = { healthy: number; at_risk: number; critical: number };

export interface BusinessImpactResult {
  baselineSalaryUGX: number;
  totalEmployees: number;
  distribution: Distribution;
  estimatedAnnualCostMin: number;
  estimatedAnnualCostMax: number;
  estimatedAnnualCostMidpoint: number;
  estimatedDaysLostMin: number;
  estimatedDaysLostMax: number;
  estimatedDaysLostMidpoint: number;
  estimatedEAPCost: number;
  estimatedROI: number; // multiple, e.g. 3.4
  costOfInactionPerMonth: number;
  perCategory: {
    key: keyof Distribution;
    label: string;
    count: number;
    pct: number;
    lossMin: number; lossMax: number;
    annualCostMin: number; annualCostMax: number; annualCostMid: number;
    daysMin: number; daysMax: number; daysMid: number;
  }[];
}

const mid = (a: number, b: number) => (a + b) / 2;

export function calculateBusinessImpact(
  distribution: Distribution,
  baselineSalaryUGX: number = DEFAULT_MONTHLY_SALARY_UGX,
): BusinessImpactResult {
  const total = distribution.healthy + distribution.at_risk + distribution.critical;
  const annualSalary = baselineSalaryUGX * 12;

  const cats: (keyof Distribution)[] = ["healthy", "at_risk", "critical"];
  const labels: Record<keyof Distribution, string> = { healthy: "Healthy", at_risk: "At Risk", critical: "Critical" };

  let costMin = 0, costMax = 0, daysMin = 0, daysMax = 0;

  const perCategory = cats.map((k) => {
    const count = distribution[k];
    const loss = PRODUCTIVITY_LOSS[k];
    const days = DAYS_LOST[k];
    const aMin = Math.round(count * annualSalary * loss.min);
    const aMax = Math.round(count * annualSalary * loss.max);
    const aMid = Math.round(count * annualSalary * mid(loss.min, loss.max));
    const dMin = count * days.min;
    const dMax = count * days.max;
    const dMid = Math.round(count * mid(days.min, days.max));
    costMin += aMin; costMax += aMax;
    daysMin += dMin; daysMax += dMax;
    return {
      key: k,
      label: labels[k],
      count,
      pct: total === 0 ? 0 : Math.round((count / total) * 100),
      lossMin: loss.min, lossMax: loss.max,
      annualCostMin: aMin, annualCostMax: aMax, annualCostMid: aMid,
      daysMin: dMin, daysMax: dMax, daysMid: dMid,
    };
  });

  const costMid = Math.round((costMin + costMax) / 2);
  const daysMid = Math.round((daysMin + daysMax) / 2);
  const eapCost = total * STANDARD_EAP_PER_EMPLOYEE_UGX;
  const roi = eapCost === 0 ? 0 : Math.round(((costMid - eapCost) / eapCost) * 10) / 10;

  return {
    baselineSalaryUGX,
    totalEmployees: total,
    distribution,
    estimatedAnnualCostMin: costMin,
    estimatedAnnualCostMax: costMax,
    estimatedAnnualCostMidpoint: costMid,
    estimatedDaysLostMin: daysMin,
    estimatedDaysLostMax: daysMax,
    estimatedDaysLostMidpoint: daysMid,
    estimatedEAPCost: eapCost,
    estimatedROI: roi,
    costOfInactionPerMonth: Math.round(costMid / 12),
    perCategory,
  };
}

export const formatUGX = (n: number) => `UGX ${Math.round(n).toLocaleString("en-UG")}`;

export function businessImpactPlainText(r: BusinessImpactResult, companyName: string): string {
  return [
    `Business Impact Summary — ${companyName}`,
    `Based on WHO and Deloitte workplace mental-health benchmarks. Baseline salary: ${formatUGX(r.baselineSalaryUGX)}/month.`,
    ``,
    `1. Estimated annual productivity value at risk: ${formatUGX(r.estimatedAnnualCostMin)} – ${formatUGX(r.estimatedAnnualCostMax)} per year`,
    `2. Estimated working days lost: ${r.estimatedDaysLostMin} – ${r.estimatedDaysLostMax} days per year`,
    `3. Cost of InnerSpark Standard EAP: ${formatUGX(r.estimatedEAPCost)} per year`,
    `4. Estimated ROI: ${r.estimatedROI} to 1 — every UGX 1 invested returns approximately UGX ${r.estimatedROI}`,
    `5. Cost of inaction per month: ${formatUGX(r.costOfInactionPerMonth)} per month`,
  ].join("\n");
}