import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/innerspark-logo.png';
import { useWho5Tracking } from '@/hooks/useWho5Tracking';
import { trackGadsWellbeingCompleted } from '@/lib/gadsTracking';
import { AnimatePresence } from 'framer-motion';
import WellbeingHero from '@/components/wellbeing/WellbeingHero';
import WellbeingTest from '@/components/wellbeing/WellbeingTest';
import WellbeingResults, { getWellbeingLevel, getWellbeingConfig } from '@/components/wellbeing/WellbeingResults';
import WellbeingUgandaGuide from '@/components/wellbeing/WellbeingUgandaGuide';

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
    trackGadsWellbeingCompleted(percentage, config.label);
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
        <title>Free WHO-5 Wellbeing Check Uganda | 2-Min Mental Health Test</title>
        <meta name="description" content="Take a free 2-minute WHO-5 mental wellbeing check for Uganda. Private results, no account. Find out if you should talk to a Ugandan therapist." />
        <meta name="keywords" content="WHO-5 Uganda, wellbeing check Uganda, free mental health test Uganda, mental health screening Kampala, depression test Uganda, anxiety test Uganda, am I depressed Uganda, online therapy Uganda" />
        <link rel="canonical" href="https://www.innersparkafrica.com/wellbeing-check" />
        <meta property="og:title" content="Free WHO-5 Wellbeing Check Uganda | InnerSpark Africa" />
        <meta property="og:description" content="2-minute WHO-5 wellbeing screening for Ugandans. Private. Free. No account needed." />
        <meta property="og:url" content="https://www.innersparkafrica.com/wellbeing-check" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
            {"@type":"Question","name":"What is the WHO-5 Wellbeing Index?","acceptedAnswer":{"@type":"Answer","text":"The WHO-5 is a 5-question wellbeing tool developed by the World Health Organization in 1998. It is validated in over 30 countries and gives a quick snapshot of your mental wellbeing in under 2 minutes."}},
            {"@type":"Question","name":"Is the WHO-5 wellbeing check really free in Uganda?","acceptedAnswer":{"@type":"Answer","text":"Yes. The check is 100% free, anonymous, and requires no account. You only pay if you choose to book a follow-up therapy session with a licensed Ugandan therapist."}},
            {"@type":"Question","name":"Is the WHO-5 a diagnosis of depression?","acceptedAnswer":{"@type":"Answer","text":"No. The WHO-5 is a screening tool that indicates the likelihood of low wellbeing or depression. Only a licensed mental health professional can diagnose depression."}},
            {"@type":"Question","name":"How accurate is the WHO-5 for Ugandans?","acceptedAnswer":{"@type":"Answer","text":"The WHO-5 has been validated across more than 30 countries, including studies in sub-Saharan Africa. It is one of the most widely validated wellbeing instruments in the world."}},
            {"@type":"Question","name":"What does my wellbeing score mean?","acceptedAnswer":{"@type":"Answer","text":"Scores 0–28% suggest low wellbeing and we recommend talking to a therapist. 29–50% is below average. 51–75% is moderate wellbeing. 76–100% indicates good wellbeing."}},
            {"@type":"Question","name":"How often should I take the wellbeing check?","acceptedAnswer":{"@type":"Answer","text":"Every 4 weeks is ideal. Trends across multiple checks are far more meaningful than any single score."}},
            {"@type":"Question","name":"What does therapy cost in Uganda through InnerSpark?","acceptedAnswer":{"@type":"Answer","text":"Therapy sessions start from UGX 30,000, with the standard 60-minute session at UGX 75,000 (~$22). Payment is via Mobile Money, card, or bank transfer through PesaPal."}}
          ]})}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({"@context":"https://schema.org","@type":"MedicalWebPage","name":"WHO-5 Wellbeing Check Uganda","url":"https://www.innersparkafrica.com/wellbeing-check","about":{"@type":"MedicalCondition","name":"Mental Wellbeing"},"audience":{"@type":"PeopleAudience","geographicArea":{"@type":"Country","name":"Uganda"}},"provider":{"@type":"Organization","name":"InnerSpark Africa","url":"https://www.innersparkafrica.com"}})}
        </script>
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
        <WellbeingUgandaGuide />
      </div>
    </>
  );
};

export default WellbeingCheck;
