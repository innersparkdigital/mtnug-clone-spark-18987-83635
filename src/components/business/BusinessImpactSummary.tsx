import { useState } from "react";
import { Copy, TrendingDown, Calendar, Wallet, Repeat, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BusinessImpactResult, businessImpactPlainText, formatUGX } from "@/lib/businessImpact";

interface Props {
  result: BusinessImpactResult;
  companyName: string;
  onIncludeChange?: (include: boolean) => void;
  defaultInclude?: boolean;
}

export default function BusinessImpactSummary({ result, companyName, onIncludeChange, defaultInclude = true }: Props) {
  const [include, setInclude] = useState(defaultInclude);

  const copy = () => {
    navigator.clipboard.writeText(businessImpactPlainText(result, companyName));
    toast.success("Business impact summary copied");
  };

  if (result.totalEmployees === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Business impact figures will appear once at least one employee completes the screening.
      </div>
    );
  }

  const figures = [
    { icon: Wallet, label: "Estimated annual productivity value at risk", value: `${formatUGX(result.estimatedAnnualCostMin)} – ${formatUGX(result.estimatedAnnualCostMax)} / year` },
    { icon: Calendar, label: "Estimated working days lost to wellbeing challenges", value: `${result.estimatedDaysLostMin} – ${result.estimatedDaysLostMax} working days / year` },
    { icon: TrendingDown, label: "Cost of InnerSpark Standard EAP for this team", value: `${formatUGX(result.estimatedEAPCost)} / year` },
    { icon: Repeat, label: "Estimated ROI on InnerSpark EAP investment", value: `${result.estimatedROI} to 1 — every UGX 1 invested returns ~UGX ${result.estimatedROI}` },
    { icon: AlertOctagon, label: "Estimated monthly cost of taking no action", value: `${formatUGX(result.costOfInactionPerMonth)} / month` },
  ];

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Business Impact Summary — {companyName}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Based on WHO and Deloitte workplace mental-health benchmarks. Estimates use an average monthly salary of {formatUGX(result.baselineSalaryUGX)} as the baseline. Actual figures may vary based on your salary structure.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {figures.map((f, i) => (
          <div key={i} className="rounded-xl border p-4 bg-background">
            <f.icon className="w-4 h-4 text-primary mb-2" />
            <p className="text-sm font-bold leading-tight">{f.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Category</th>
              <th className="text-right p-2 font-medium">Count</th>
              <th className="text-right p-2 font-medium">% of team</th>
              <th className="text-right p-2 font-medium">Productivity loss</th>
              <th className="text-right p-2 font-medium">Annual cost</th>
              <th className="text-right p-2 font-medium">Days lost / yr</th>
            </tr>
          </thead>
          <tbody>
            {result.perCategory.map((c) => {
              const bg = c.key === "healthy" ? "bg-green-50" : c.key === "at_risk" ? "bg-amber-50" : "bg-red-50";
              return (
                <tr key={c.key} className={`${bg} border-b`}>
                  <td className="p-2 font-medium">{c.label}</td>
                  <td className="p-2 text-right">{c.count}</td>
                  <td className="p-2 text-right">{c.pct}%</td>
                  <td className="p-2 text-right">{Math.round(c.lossMin * 100)}–{Math.round(c.lossMax * 100)}%</td>
                  <td className="p-2 text-right">{formatUGX(c.annualCostMin)} – {formatUGX(c.annualCostMax)}</td>
                  <td className="p-2 text-right">{c.daysMin}–{c.daysMax}</td>
                </tr>
              );
            })}
            <tr className="bg-foreground text-background font-semibold">
              <td className="p-2">TOTAL</td>
              <td className="p-2 text-right">{result.totalEmployees}</td>
              <td className="p-2 text-right">100%</td>
              <td className="p-2 text-right">—</td>
              <td className="p-2 text-right">{formatUGX(result.estimatedAnnualCostMin)} – {formatUGX(result.estimatedAnnualCostMax)}</td>
              <td className="p-2 text-right">{result.estimatedDaysLostMin}–{result.estimatedDaysLostMax}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={include}
            onChange={(e) => { setInclude(e.target.checked); onIncludeChange?.(e.target.checked); }}
          />
          Include this section in the company report
        </label>
        <Button size="sm" variant="outline" onClick={copy}>
          <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy to clipboard
        </Button>
      </div>
    </div>
  );
}