import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/innerspark-logo.png';
import { useWho5Tracking } from '@/hooks/useWho5Tracking';
import { AnimatePresence } from 'framer-motion';
import WellbeingHero from '@/components/wellbeing/WellbeingHero';
import WellbeingTest from '@/components/wellbeing/WellbeingTest';
import WellbeingResults, { getWellbeingLevel, getWellbeingConfig } from '@/components/wellbeing/WellbeingResults';

type Phase = 'hero' | 'test' | 'results';

const WellbeingCheck = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('hero');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);

  const { trackStart, trackProgress, trackCompletion, trackAbandonment, trackCtaClick, sessionId } = useWho5Tracking();

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

    setTimeout(() => {
      if (currentQuestion < 4) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  };

  const rawScore = answers.reduce((sum, a) => sum + (a || 0), 0);
  const percentage = rawScore * 4;

  const handleSubmit = () => {
    const level = getWellbeingLevel(percentage);
    const config = getWellbeingConfig(level);
    trackCompletion(rawScore, percentage, config.label);
    setShowResults(true);
    setPhase('results');
  };

  const handleCtaClick = (type: string, url?: string) => {
    trackCtaClick(type);
    if (url) {
      if (url.startsWith('/')) {
        navigate(url);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  const handleRetake = () => {
    setPhase('hero');
    setCurrentQuestion(0);
    setAnswers(Array(5).fill(null));
    setShowResults(false);
  };

  // Get source/device for callback form
  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get('source') || 'website';
  const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : /Tablet|iPad/i.test(navigator.userAgent) ? 'tablet' : 'desktop';

  return (
    <>
      <Helmet>
        <title>Mental Wellbeing Check — Free WHO-5 Test | InnerSpark Africa</title>
        <meta name="description" content="Take a free 2-minute WHO-5 mental wellbeing check. Understand your mental health score and get connected to support in Africa." />
        <link rel="canonical" href="https://www.innersparkafrica.com/wellbeing-check" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-orange-50/50">
        {/* Minimal Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="InnerSpark Africa" className="h-8" />
              <span className="font-bold text-lg text-gray-800">InnerSpark</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Private & Confidential
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pt-20 pb-16">
          <AnimatePresence mode="wait">
            {phase === 'hero' && <WellbeingHero onStart={handleStart} />}
            {phase === 'test' && !showResults && (
              <WellbeingTest
                currentQuestion={currentQuestion}
                answers={answers}
                onAnswer={handleAnswer}
                onNext={() => setCurrentQuestion(prev => prev + 1)}
                onBack={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                onSubmit={handleSubmit}
              />
            )}
            {phase === 'results' && (
              <WellbeingResults
                rawScore={rawScore}
                percentage={percentage}
                sessionId={sessionId}
                source={source}
                deviceType={deviceType}
                onCtaClick={handleCtaClick}
                onRetake={handleRetake}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default WellbeingCheck;
