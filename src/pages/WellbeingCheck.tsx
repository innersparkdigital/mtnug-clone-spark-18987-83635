import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowRight, ArrowLeft, Shield, Download, MessageCircle, Users, Brain, Lock, ChevronDown } from 'lucide-react';
import { useWho5Tracking } from '@/hooks/useWho5Tracking';
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

type WellbeingLevel = 'very-low' | 'low' | 'moderate' | 'good';

const getWellbeingLevel = (percentage: number): WellbeingLevel => {
  if (percentage <= 28) return 'very-low';
  if (percentage <= 50) return 'low';
  if (percentage <= 75) return 'moderate';
  return 'good';
};

const getWellbeingConfig = (level: WellbeingLevel) => {
  switch (level) {
    case 'very-low':
      return {
        label: 'Very Low Wellbeing',
        color: '#ef4444',
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-700',
        barClass: 'bg-red-500',
        message: "You may be experiencing reduced mental wellbeing. You're not alone, and support can help. Consider reaching out to a professional.",
        emoji: '💛',
      };
    case 'low':
      return {
        label: 'Low Wellbeing',
        color: '#eab308',
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-700',
        barClass: 'bg-yellow-500',
        message: "Your wellbeing could use some attention. Small steps like talking to someone or joining a support group can make a big difference.",
        emoji: '🌤️',
      };
    case 'moderate':
      return {
        label: 'Moderate Wellbeing',
        color: '#84cc16',
        bgClass: 'bg-lime-50 border-lime-200',
        textClass: 'text-lime-700',
        barClass: 'bg-lime-500',
        message: "Your wellbeing is okay, but there's room to improve. Keep nurturing your mental health with healthy habits.",
        emoji: '🌿',
      };
    case 'good':
      return {
        label: 'Good Wellbeing',
        color: '#22c55e',
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-700',
        barClass: 'bg-green-500',
        message: "You're doing well! Keep maintaining your mental health through self-care, connection, and balance.",
        emoji: '✨',
      };
  }
};

type Phase = 'hero' | 'test' | 'results';

const WellbeingCheck = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('hero');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);

  const { trackStart, trackProgress, trackCompletion, trackAbandonment, trackCtaClick } = useWho5Tracking();

  // Track abandonment on unmount
  useEffect(() => {
    return () => {
      if (phase === 'test' && !showResults) {
        trackAbandonment();
      }
    };
  }, [phase, showResults, trackAbandonment]);

  const handleStart = () => {
    trackStart();
    setPhase('test');
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    trackProgress(currentQuestion);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestion < 4) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  };

  const handleSubmit = () => {
    const rawScore = answers.reduce((sum, a) => sum + (a || 0), 0);
    const percentage = rawScore * 4;
    const level = getWellbeingLevel(percentage);
    const config = getWellbeingConfig(level);
    trackCompletion(rawScore, percentage, config.label);
    setShowResults(true);
    setPhase('results');
  };

  const handleCtaClick = (type: string, url: string) => {
    trackCtaClick(type);
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const rawScore = answers.reduce((sum, a) => sum + (a || 0), 0);
  const percentage = rawScore * 4;
  const level = getWellbeingLevel(percentage);
  const config = getWellbeingConfig(level);
  const allAnswered = answers.every(a => a !== null);

  return (
    <>
      <Helmet>
        <title>Mental Wellbeing Check — Free WHO-5 Test | InnerSpark Africa</title>
        <meta name="description" content="Take a free 2-minute WHO-5 mental wellbeing check. Understand your mental health score and get connected to support in Africa." />
        <link rel="canonical" href="https://www.innersparkafrica.com/wellbeing-check" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf9] via-white to-[#f0fdf9]">
        {/* Minimal Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800">InnerSpark</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              Private & Confidential
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pt-20 pb-16">
          <AnimatePresence mode="wait">
            {/* ===== HERO PHASE ===== */}
            {phase === 'hero' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center pt-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d9488]/10 text-[#0d9488] text-sm font-medium mb-8">
                  <Heart className="w-4 h-4" />
                  Supporting your mental health
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
                  How is your mental
                </h1>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                  <span className="text-[#0d9488]">wellbeing today?</span>
                </h1>

                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                  Take a 2-minute private mental health check — based on the WHO-5, the world's most trusted wellbeing screening tool.
                </p>

                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-[#0d9488] hover:bg-[#0b7e73] text-white text-lg px-10 py-6 rounded-full shadow-lg shadow-[#0d9488]/25 mb-6"
                >
                  Start Mind-Check
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Anonymous</span>
                  <span className="flex items-center gap-1">⏱ 2 minutes</span>
                  <span className="flex items-center gap-1">📋 5 questions</span>
                </div>

                {/* Scroll indicator */}
                <div className="mt-16 animate-bounce text-gray-300">
                  <ChevronDown className="w-6 h-6 mx-auto" />
                </div>

                {/* What is WHO-5 section */}
                <div className="mt-12 text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-lg text-gray-800 mb-3">What is the WHO-5?</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    The WHO-5 Well-Being Index is a short, internationally recognized questionnaire developed by the World Health Organization. It measures your subjective psychological well-being over the past two weeks with just 5 simple questions.
                  </p>
                </div>

                <div className="mt-6 text-xs text-gray-400 space-y-1">
                  <p>🔒 Your responses are private and confidential.</p>
                  <p>This is not a diagnosis, but a mental wellbeing screening tool.</p>
                </div>
              </motion.div>
            )}

            {/* ===== TEST PHASE ===== */}
            {phase === 'test' && !showResults && (
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
                  <Progress value={((currentQuestion + 1) / 5) * 100} className="h-2" />
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
                          onClick={() => handleAnswer(option.value)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-base font-medium
                            ${answers[currentQuestion] === option.value
                              ? 'border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488]'
                              : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span className="inline-block w-8 h-8 rounded-full border-2 text-center leading-7 mr-3 text-sm
                            {answers[currentQuestion] === option.value ? 'border-[#0d9488] bg-[#0d9488] text-white' : 'border-gray-300'}">
                            {option.value}
                          </span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="text-gray-500"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>

                  {currentQuestion === 4 && allAnswered && (
                    <Button
                      onClick={handleSubmit}
                      className="bg-[#0d9488] hover:bg-[#0b7e73] text-white rounded-full px-8"
                    >
                      See My Results <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}

                  {currentQuestion < 4 && answers[currentQuestion] !== null && (
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      className="text-[#0d9488]"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== RESULTS PHASE ===== */}
            {phase === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-8"
              >
                {/* Score Display */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-extrabold mb-1" style={{ color: config.color }}>
                    {percentage}%
                  </div>
                  <div className="text-2xl mb-2">{config.emoji}</div>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${config.bgClass} ${config.textClass}`}>
                    {config.label}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mb-6">
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${config.barClass}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span>28%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="flex text-xs mt-0.5">
                    <span className="flex-[28] text-red-400 text-center">Very Low</span>
                    <span className="flex-[22] text-yellow-500 text-center">Low</span>
                    <span className="flex-[25] text-lime-500 text-center">Moderate</span>
                    <span className="flex-[25] text-green-500 text-center">Good</span>
                  </div>
                </div>

                {/* Insight */}
                <div className={`rounded-2xl p-5 border mb-8 ${config.bgClass}`}>
                  <p className={`text-base leading-relaxed ${config.textClass}`}>
                    {config.message}
                  </p>
                </div>

                {/* Raw Score */}
                <div className="text-center text-sm text-gray-400 mb-8">
                  Raw score: {rawScore}/25 • WHO-5 Well-Being Index
                </div>

                {/* Primary CTA */}
                <div className="space-y-3 mb-10">
                  <Button
                    onClick={() => handleCtaClick('app_download', '/app-coming-soon')}
                    size="lg"
                    className="w-full bg-[#0d9488] hover:bg-[#0b7e73] text-white rounded-xl py-6 text-base shadow-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download the InnerSpark App
                  </Button>

                  <Button
                    onClick={() => handleCtaClick('talk_therapist', '/specialists')}
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl py-6 text-base border-2 border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/5"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Talk to a Therapist
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleCtaClick('support_group', '/support-groups')}
                      variant="outline"
                      className="rounded-xl py-5 text-sm"
                    >
                      <Users className="w-4 h-4 mr-1.5" />
                      Support Groups
                    </Button>
                    <Button
                      onClick={() => handleCtaClick('detailed_assessment', '/mind-check')}
                      variant="outline"
                      className="rounded-xl py-5 text-sm"
                    >
                      <Brain className="w-4 h-4 mr-1.5" />
                      Detailed Tests
                    </Button>
                  </div>
                </div>

                {/* Bridge to Detailed Assessments */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Need a deeper understanding?</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Take detailed clinical assessments for depression, anxiety, PTSD, and 34+ more conditions.
                  </p>
                  <Button
                    onClick={() => handleCtaClick('detailed_assessment', '/mind-check')}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8"
                  >
                    👉 Take Detailed Mental Health Assessments
                  </Button>
                </div>

                {/* Privacy */}
                <div className="text-center text-xs text-gray-400 space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your responses are private and confidential.
                  </p>
                  <p>This is not a diagnosis, but a mental wellbeing screening tool.</p>
                </div>

                {/* Retake */}
                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPhase('hero');
                      setCurrentQuestion(0);
                      setAnswers(Array(5).fill(null));
                      setShowResults(false);
                    }}
                    className="text-gray-400 text-sm"
                  >
                    Retake Assessment
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default WellbeingCheck;
