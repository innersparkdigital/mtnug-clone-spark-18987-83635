import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHO5_QUESTIONS = [
  "I have felt cheerful and in good spirits",
  "I have felt calm and relaxed",
  "I have felt active and vigorous",
  "I woke up feeling fresh and rested",
  "My daily life has been filled with things that interest me",
];

const ANSWER_OPTIONS = [
  { value: 0, label: "At no time" },
  { value: 1, label: "Some of the time" },
  { value: 2, label: "Less than half the time" },
  { value: 3, label: "More than half the time" },
  { value: 4, label: "Most of the time" },
  { value: 5, label: "All of the time" },
];

interface WellbeingTestProps {
  currentQuestion: number;
  answers: (number | null)[];
  onAnswer: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

const WellbeingTest = ({ currentQuestion, answers, onAnswer, onNext, onBack, onSubmit }: WellbeingTestProps) => {
  const allAnswered = answers.every(a => a !== null);

  return (
    <motion.div
      key="test"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-8"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQuestion + 1} of 5</span>
          <span>Over the past 2 weeks...</span>
        </div>
        <Progress value={((currentQuestion + 1) / 5) * 100} className="h-2 [&>div]:bg-[#F97316]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 leading-snug">
            "{WHO5_QUESTIONS[currentQuestion]}"
          </h2>

          <div className="space-y-3">
            {ANSWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-base font-medium
                  ${answers[currentQuestion] === option.value
                    ? 'border-[#F97316] bg-[#F97316]/10 text-[#F97316]'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={currentQuestion === 0}
          className="text-gray-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        {currentQuestion === 4 && allAnswered && (
          <Button
            onClick={onSubmit}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-8"
          >
            See My Results <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {currentQuestion < 4 && answers[currentQuestion] !== null && (
          <Button
            variant="ghost"
            onClick={onNext}
            className="text-[#F97316]"
          >
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default WellbeingTest;
