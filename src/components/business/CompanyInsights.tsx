import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, TrendingDown, Users, CheckCircle2, MessageSquare, ShieldAlert } from "lucide-react";
import {
  CompanyAggregateResult,
  CLUSTER_INFO,
  QUESTION_INTELLIGENCE,
  QUESTION_ORDER,
} from "@/lib/wellbeingIntelligence";
import { HR_FOCUS_STRATEGIES } from "@/lib/hrFocusStrategies";

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
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Focus areas & what HR can do
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Ranked by how many people are affected. Each card has this-week actions, this-month actions, team coping
          ideas, and a manager conversation script — still aggregate only, never individuals.
        </p>
        {result.triggeredFlags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No flags triggered. Keep up the supportive culture.</p>
        ) : (
          <div className="space-y-4">
            {result.triggeredFlags.map((flag) => {
              const meta = QUESTION_INTELLIGENCE[flag.qid];
              const play = HR_FOCUS_STRATEGIES[flag.qid];
              return (
                <div key={flag.flagName} className="rounded-xl border p-4 bg-background space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{flag.flagName}</p>
                      <p className="text-sm font-semibold">{play?.title || meta.shortLabel}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{meta.text}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-sm font-bold justify-end">
                        <Users className="w-3 h-3" /> {flag.affectedEmployees}
                      </div>
                      <div className="text-xs text-muted-foreground">{flag.averagePct}% avg</div>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed">{flag.recommendation}</p>
                  {play && (
                    <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-amber-300 pl-3">
                      {play.whyItMatters}
                    </p>
                  )}

                  {play && (
                    <div className="grid md:grid-cols-3 gap-3 pt-1">
                      <div className="rounded-lg bg-amber-50/80 border border-amber-100 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> This week
                        </p>
                        <ul className="space-y-1.5 text-xs text-foreground/85 list-disc pl-4">
                          {play.thisWeek.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-blue-50/80 border border-blue-100 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-900 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> This month
                        </p>
                        <ul className="space-y-1.5 text-xs text-foreground/85 list-disc pl-4">
                          {play.thisMonth.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-emerald-50/80 border border-emerald-100 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Team coping
                        </p>
                        <ul className="space-y-1.5 text-xs text-foreground/85 list-disc pl-4">
                          {play.teamCoping.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {play && (
                    <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Manager script
                      </p>
                      <p className="text-xs italic leading-relaxed">“{play.managerScript}”</p>
                      <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-1">
                        <ShieldAlert className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>
                          <strong>Escalate when:</strong> {play.escalateWhen}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
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
            const badge =
              status === "green"
                ? "text-green-700 bg-green-50"
                : status === "amber"
                  ? "text-amber-700 bg-amber-50"
                  : "text-red-700 bg-red-50";
            const play = status !== "green" ? HR_FOCUS_STRATEGIES[qid] : null;
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
                    <span
                      className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${badge}`}
                    >
                      {status === "green" ? "Healthy" : status === "amber" ? "Watch" : "Action"}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${avg}%` }} />
                </div>
                {status !== "green" && (
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-muted-foreground leading-relaxed">{meta.companyRecommendation}</p>
                    {play && (
                      <p className="text-xs text-foreground/80">
                        <strong>Start this week:</strong> {play.thisWeek[0]}
                      </p>
                    )}
                  </div>
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
      <p className="text-xs text-muted-foreground mb-4">
        Generated from triggered flags. Pair this with the detailed focus-area playbooks above. InnerSpark consultants
        can override sections in notes.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {result.actionPlan.map((wk) => (
          <div key={wk.week} className="border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Week {wk.week}</p>
            <p className="text-sm font-semibold mb-2">{wk.title}</p>
            <ul className="space-y-1 text-xs text-foreground/80 list-disc pl-4">
              {wk.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
