import { motion } from 'framer-motion';
import { Info, Lightbulb, ShieldAlert } from 'lucide-react';
import { buildWho5Breakdown } from '@/lib/who5Insights';

interface WellbeingBreakdownProps {
  answers: (number | null)[];
  /** Overall percentage — used only to keep low-score guidance visible, never to reinterpret answers. */
  percentage: number;
}

const bandStyles: Record<string, { dot: string; chip: string; label: string }> = {
  lower: { dot: 'bg-red-400', chip: 'bg-red-50 text-red-700 border-red-200', label: 'Needs attention' },
  middle: { dot: 'bg-yellow-400', chip: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Mixed' },
  higher: { dot: 'bg-green-400', chip: 'bg-green-50 text-green-700 border-green-200', label: 'Going well' },
};

const WellbeingBreakdown = ({ answers, percentage }: WellbeingBreakdownProps) => {
  const breakdown = buildWho5Breakdown(answers);
  const isLow = percentage <= 50;

  return (
    <section className="mb-8" aria-label="Your responses question by question">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Your responses, question by question</h2>
        <p className="text-sm text-gray-500 mt-1">
          A closer look at each of the five statements and one small thing that may help.
        </p>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, index) => {
          const style = bandStyles[item.band];
          return (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${style.dot}`} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                      {item.area}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                      "{item.question}"
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${style.chip}`}
                >
                  {style.label}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                <span className="text-gray-400">Your answer: </span>
                <span className="font-semibold">{item.answerLabel}</span>
              </p>

              <div className="flex items-start gap-2 text-sm text-gray-600 mb-2.5">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" aria-hidden />
                <p className="leading-relaxed">{item.note}</p>
              </div>

              <div className="flex items-start gap-2 text-sm bg-gray-50 rounded-xl p-3">
                <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed text-gray-700">
                  <span className="font-semibold text-gray-900">Try this: </span>
                  {item.suggestion}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {isLow && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-red-600" aria-hidden />
          <p className="text-sm text-red-700 leading-relaxed">
            These small steps sit alongside — not instead of — the guidance above. With an overall score in
            this range, we still recommend booking a session with a licensed therapist so someone can look at
            the full picture with you.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400 leading-relaxed text-center">
        These notes offer general wellbeing insight, not a diagnosis. Only a licensed therapist can give you a
        full assessment.
      </p>
    </section>
  );
};

export default WellbeingBreakdown;
