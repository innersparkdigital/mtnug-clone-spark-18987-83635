import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AnswerMap,
  QUESTION_INTELLIGENCE,
  QUESTION_ORDER,
  QuestionId,
  getAnswerLabel,
  getBand,
  getNextSteps,
  getPriorityAreas,
} from "@/lib/wellbeingIntelligence";

interface Props {
  answers: AnswerMap;
}

export default function EmployeeResultsBreakdown({ answers }: Props) {
  const priorityAreas = getPriorityAreas(answers, 3);
  const nextSteps = getNextSteps(answers);

  return (
    <div className="space-y-6 text-left">
      {priorityAreas.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Your priority areas right now
          </h3>
          <div className="space-y-3">
            {priorityAreas.map((qid) => {
              const meta = QUESTION_INTELLIGENCE[qid];
              const det = answers[qid];
              return (
                <div key={qid} className="bg-white rounded-xl p-3 border border-amber-100">
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-sm font-medium text-foreground">{meta.text}</p>
                    <span className="text-sm font-bold text-amber-700 whitespace-nowrap">{det.percentageScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{getBand(qid, det.percentageScore).meaning}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Question-by-question breakdown</h3>
        <div className="space-y-3">
          {QUESTION_ORDER.map((qid, idx) => (
            <QuestionCard key={qid} qid={qid} index={idx} detail={answers[qid]} />
          ))}
        </div>
      </section>

      {nextSteps.length > 0 && (
        <section className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Recommended next steps</h3>
          <div className="space-y-2">
            {nextSteps.map((step) => (
              <Link
                key={step.href}
                to={step.href}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 hover:border-primary transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.rationale}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionCard({ qid, index, detail }: { qid: QuestionId; index: number; detail: AnswerMap[QuestionId] }) {
  const meta = QUESTION_INTELLIGENCE[qid];
  const band = getBand(qid, detail.percentageScore);
  const tone = detail.percentageScore < 40 ? "red" : detail.percentageScore < 60 ? "amber" : "green";
  const toneStyles = {
    red: "border-red-200 bg-red-50/40",
    amber: "border-amber-200 bg-amber-50/40",
    green: "border-border bg-card",
  } as const;
  const barColor = tone === "red" ? "bg-red-500" : tone === "amber" ? "bg-amber-500" : "bg-green-500";

  return (
    <div className={`rounded-xl border p-4 ${toneStyles[tone]}`}>
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Q{index + 1} · {meta.domain === "who5" ? "Wellbeing" : "Workplace"}
          </p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{meta.text}</p>
          <p className="text-xs text-muted-foreground mt-1">Your answer: <span className="font-medium text-foreground">{getAnswerLabel(qid, detail.rawAnswer)}</span></p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{detail.effectiveScore}/5</div>
          <div className="text-xs text-muted-foreground">{detail.percentageScore}%</div>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-3">
        <motion.div initial={{ width: 0 }} animate={{ width: `${detail.percentageScore}%` }} transition={{ duration: 0.6 }} className={`h-full ${barColor}`} />
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed mb-2"><span className="font-medium">{band.label}.</span> {band.meaning}</p>
      {detail.flagged && (
        <p className="text-xs text-foreground/70 italic leading-relaxed border-l-2 border-amber-300 pl-3">{meta.individualRecommendation}</p>
      )}
    </div>
  );
}