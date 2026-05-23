import {
  AnswerMap,
  QUESTION_INTELLIGENCE,
  QUESTION_ORDER,
  QuestionId,
  computeAggregate,
  getAnswerLabel,
  getBand,
  RISK_LABEL,
  CLUSTER_INFO,
} from "@/lib/wellbeingIntelligence";
import { CheckCircle2, AlertTriangle, AlertOctagon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  answers: AnswerMap;
  completedAt: string;
  attemptNumber?: number;
  previousOverallPct?: number | null;
  employeeLabel: string;
}

function FlagIcon({ pct, isQ5 }: { pct: number; isQ5: boolean }) {
  if (isQ5 && pct === 0) return <Star className="w-3.5 h-3.5 text-red-700 fill-red-200" />;
  if (pct === 0) return <Star className="w-3.5 h-3.5 text-red-600 fill-red-100" />;
  if (pct < 40) return <AlertOctagon className="w-3.5 h-3.5 text-red-500" />;
  if (pct < 60) return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
}

function flagText(pct: number, isQ5: boolean) {
  if (isQ5 && pct === 0) return "CRITICAL — anhedonia signal";
  if (pct === 0) return "CRITICAL — score 0";
  if (pct < 40) return "RED — action recommended";
  if (pct < 60) return "AMBER — monitor";
  return "GREEN — no action";
}

export default function PerQuestionEmployeeBreakdown({ answers, completedAt, attemptNumber, previousOverallPct, employeeLabel }: Props) {
  const agg = computeAggregate(answers);
  const trend = previousOverallPct != null ? agg.overallScore.percentage - previousOverallPct : null;
  const flaggedQs = QUESTION_ORDER.filter((q) => answers[q].flagged);
  const lowest = [...QUESTION_ORDER].sort((a, b) => answers[a].percentageScore - answers[b].percentageScore).slice(0, 2);

  // Build internal consultation note
  const flagSummary = flaggedQs
    .map((q) => `${q.toUpperCase()} (${QUESTION_INTELLIGENCE[q].shortLabel}: ${answers[q].percentageScore}%)`)
    .join(", ");
  const clusterLine = agg.triggeredClusters.length
    ? `Pattern: ${agg.triggeredClusters.map((c) => CLUSTER_INFO[c].label).join(" + ")}.`
    : "No cluster pattern.";
  const recService = lowest.length ? QUESTION_INTELLIGENCE[lowest[0]].recommendedServiceLabel : "Self-help tools";
  const consultantNote = `Lowest scores: ${lowest.map((q) => `${q.toUpperCase()} (${answers[q].percentageScore}%)`).join(" and ")}. ${
    flaggedQs.length ? `Flagged: ${flagSummary}.` : "No flagged questions."
  } ${clusterLine} Recommended service for this individual: ${recService}.`;

  return (
    <div className="bg-muted/30 rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{employeeLabel}</p>
          <p className="text-[11px] text-muted-foreground">
            Completed {new Date(completedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
            {attemptNumber && attemptNumber > 1 && ` · Check-in #${attemptNumber}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase">Overall</p>
            <p className="text-base font-bold">{agg.overallScore.percentage}%</p>
          </div>
          <Badge
            className={
              agg.riskCategory === "critical"
                ? "bg-red-100 text-red-700 border-red-200"
                : agg.riskCategory === "at_risk"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-green-100 text-green-700 border-green-200"
            }
          >
            {RISK_LABEL[agg.riskCategory]}
          </Badge>
          {trend !== null && trend !== 0 && (
            <span className={`text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs previous
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-md bg-background border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">WHO-5 (mental wellbeing)</p>
          <p className="font-bold">{agg.who5Score.percentage}%</p>
        </div>
        <div className="rounded-md bg-background border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">Workplace</p>
          <p className="font-bold">{agg.workplaceScore.percentage}%</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-background">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Question</th>
              <th className="text-left p-2">Answer</th>
              <th className="text-right p-2">Score</th>
              <th className="text-right p-2">%</th>
              <th className="text-left p-2 w-24">Bar</th>
              <th className="text-left p-2">Flag</th>
              <th className="text-left p-2">Domain</th>
            </tr>
          </thead>
          <tbody>
            {QUESTION_ORDER.map((qid, i) => {
              const meta = QUESTION_INTELLIGENCE[qid];
              const a = answers[qid];
              const color = a.percentageScore >= 76 ? "bg-green-500" : a.percentageScore >= 36 ? "bg-amber-500" : "bg-red-500";
              return (
                <tr key={qid} className="border-b last:border-b-0 align-top">
                  <td className="p-2 text-muted-foreground">Q{i + 1}</td>
                  <td className="p-2 font-medium">{meta.shortLabel}{meta.reverseScored && <span className="text-[9px] text-muted-foreground"> (rev.)</span>}</td>
                  <td className="p-2 text-muted-foreground">{getAnswerLabel(qid as QuestionId, a.rawAnswer)}</td>
                  <td className="p-2 text-right font-mono">{a.effectiveScore}/5</td>
                  <td className="p-2 text-right font-bold">{a.percentageScore}%</td>
                  <td className="p-2">
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full ${color}`} style={{ width: `${a.percentageScore}%` }} />
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="inline-flex items-center gap-1 text-[10px]">
                      <FlagIcon pct={a.percentageScore} isQ5={qid === "q5"} />
                      {flagText(a.percentageScore, qid === "q5")}
                    </span>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline" className="text-[9px]">
                      {meta.domain === "who5" ? "WHO-5" : "Workplace"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border-l-4 border-primary bg-background p-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">
          Internal consultation note (InnerSpark only — not sent to HR)
        </p>
        <p className="text-xs text-foreground/85 leading-relaxed">{consultantNote}</p>
      </div>
    </div>
  );
}