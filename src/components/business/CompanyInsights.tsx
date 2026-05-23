import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, TrendingDown, Users } from "lucide-react";
import {
  CompanyAggregateResult,
  CLUSTER_INFO,
  QUESTION_INTELLIGENCE,
  QUESTION_ORDER,
} from "@/lib/wellbeingIntelligence";

export function CompanyTriggersDashboard({ result }: { result: CompanyAggregateResult }) {
  if (result.totalEmployees === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Triggers and insights will appear here once employees complete the screening.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Triggers Dashboard
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          What is actually causing your team's wellbeing score to be low? Ranked by team impact.
        </p>
        {result.triggeredFlags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No flags triggered. Keep up the supportive culture.</p>
        ) : (
          <div className="space-y-3">
            {result.triggeredFlags.map((flag) => {
              const meta = QUESTION_INTELLIGENCE[flag.qid];
              return (
                <div key={flag.flagName} className="rounded-xl border p-4 bg-background">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{flag.flagName}</p>
                      <p className="text-sm font-semibold">{meta.text}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Users className="w-3 h-3" /> {flag.affectedEmployees}
                      </div>
                      <div className="text-xs text-muted-foreground">{flag.averagePct}% avg</div>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed mb-3">{flag.recommendation}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      ~{flag.productivityCostDaysPerMonth} productive days/month at risk
                    </span>
                    <Link
                      to={flag.serviceHref}
                      className="text-xs font-medium text-primary inline-flex items-center gap-1"
                    >
                      {flag.serviceLabel} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-lg font-semibold mb-3">Question-by-question averages</h3>
        <div className="space-y-2">
          {QUESTION_ORDER.map((qid) => {
            const meta = QUESTION_INTELLIGENCE[qid];
            const avg = result.questionAverages[qid];
            const status = result.questionFlagStatus[qid];
            const color = status === "green" ? "bg-green-500" : status === "amber" ? "bg-amber-500" : "bg-red-500";
            const badge = status === "green" ? "text-green-700 bg-green-50" : status === "amber" ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
            return (
              <div key={qid} className="border rounded-lg p-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {meta.domain === "who5" ? "Wellbeing" : "Workplace"} · {meta.shortLabel}
                    </p>
                    <p className="text-sm">{meta.text}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold">{avg}%</div>
                    <span className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${badge}`}>
                      {status === "green" ? "Healthy" : status === "amber" ? "Watch" : "Action"}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${avg}%` }} />
                </div>
                {status !== "green" && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{meta.companyRecommendation}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {result.triggeredClusters.length > 0 && (
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="text-lg font-semibold mb-3">Detected patterns</h3>
          <div className="space-y-3">
            {result.triggeredClusters.map((cid) => (
              <div key={cid} className="rounded-xl bg-amber-50/60 border border-amber-200 p-4">
                <p className="text-sm font-semibold text-amber-900 mb-1">{CLUSTER_INFO[cid].label}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{CLUSTER_INFO[cid].interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompanyActionPlan({ result }: { result: CompanyAggregateResult }) {
  if (result.totalEmployees === 0 || result.actionPlan.length === 0) return null;
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="text-lg font-semibold mb-1">Auto-generated 30-day action plan</h3>
      <p className="text-xs text-muted-foreground mb-4">Generated from triggered flags. InnerSpark consultants can override sections in notes.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {result.actionPlan.map((wk) => (
          <div key={wk.week} className="border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Week {wk.week}</p>
            <p className="text-sm font-semibold mb-2">{wk.title}</p>
            <ul className="space-y-1 text-xs text-foreground/80 list-disc pl-4">
              {wk.items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}