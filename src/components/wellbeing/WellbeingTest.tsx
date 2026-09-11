import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WHO5_QUESTIONS, WHO5_ANSWER_OPTIONS } from '@/lib/who5Insights';

interface WellbeingTestProps {
  currentQuestion: number;
  answers: (number | null)[];
  onAnswer: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const WellbeingTest = ({ currentQuestion, answers, onAnswer, onNext, onBack, onSubmit }: WellbeingTestProps) => {
  const allAnswered = answers.every((a) => a !== null);
  const answeredCount = answers.filter((a) => a !== null).length;
  const completion = Math.round((answeredCount / 5) * 100);

  return (
    <motion.div
      key="test"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="pt-8 pb-28"
    >
      {/* Progress */}
      <div className="mb-7">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-foreground">Question {currentQuestion + 1} of 5</span>
          <span className="font-semibold text-primary">{completion}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2" aria-hidden>
          {answers.map((a, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                a !== null ? 'bg-primary/70' : i === currentQuestion ? 'bg-primary/30' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Over the past 2 weeks…</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-7 leading-snug">
            "{WHO5_QUESTIONS[currentQuestion]}"
          </h2>

          <div className="space-y-3.5" role="radiogroup" aria-label={WHO5_QUESTIONS[currentQuestion]}>
            {WHO5_ANSWER_OPTIONS.map((option) => {
              const selected = answers[currentQuestion] === option.value;
              return (
                <button
                  key={option.value}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onAnswer(option.value)}
                  className={`w-full flex items-center justify-between gap-3 text-left px-4 py-4 min-h-[58px] rounded-2xl border-2 text-base font-medium
                    transition-all duration-200 active:scale-[0.985]
                    ${
                      selected
                        ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                    }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      selected ? 'border-primary-foreground bg-primary-foreground/20' : 'border-muted-foreground/30'
                    }`}
                    aria-hidden
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={currentQuestion === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        {currentQuestion === 4 && allAnswered && (
          <Button
            onClick={onSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-lg"
          >
            See My Results <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {currentQuestion < 4 && answers[currentQuestion] !== null && (
          <Button variant="ghost" onClick={onNext} className="text-primary">
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default WellbeingTest;
