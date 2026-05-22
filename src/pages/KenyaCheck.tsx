import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import logo from "@/assets/innerspark-logo.png";
import { useWho5Tracking } from "@/hooks/useWho5Tracking";
import WellbeingHero from "@/components/wellbeing/WellbeingHero";
import WellbeingTest from "@/components/wellbeing/WellbeingTest";
import WellbeingResults, { getWellbeingLevel, getWellbeingConfig } from "@/components/wellbeing/WellbeingResults";

type Phase = "hero" | "test" | "results";

export default function KenyaCheck() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("hero");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);
  const { trackStart, trackProgress, trackCompletion, trackAbandonment, trackCtaClick, sessionId } = useWho5Tracking();

  useEffect(() => {
    return () => {
      if (phase === "test" && !showResults) trackAbandonment();
    };
  }, [phase, showResults, trackAbandonment]);

  const rawScore = answers.reduce<number>((s, a) => s + (a || 0), 0);
  const percentage = rawScore * 4;

  const handleSubmit = () => {
    const level = getWellbeingLevel(percentage);
    const config = getWellbeingConfig(level);
    trackCompletion(rawScore, percentage, config.label);
    setShowResults(true);
    setPhase("results");
  };

  const handleCtaClick = (type: string, url?: string) => {
    trackCtaClick(type);
    if (type === "book" || url === "/book-therapist") {
      navigate("/book-therapist?market=kenya");
      return;
    }
    if (url?.startsWith("/")) navigate(url);
    else if (url) window.open(url, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Free Mental Health Check Kenya | WHO-5 Wellbeing Screening | InnerSpark Africa</title>
        <meta name="description" content="Take InnerSpark's free 3-minute WHO-5 mental health check for Kenya. Private results, no account needed. Find out if you need to talk to a therapist." />
        <meta name="keywords" content="mental health check Kenya, wellbeing screening Kenya, free mental health test Kenya, WHO-5 Kenya, free therapy assessment Kenya, how do I know if I need therapy Kenya, mental health screening Nairobi, anxiety test Kenya, depression test Kenya" />
        <link rel="canonical" href="https://www.innersparkafrica.com/check/kenya" />
        <meta property="og:title" content="Free Mental Health Check Kenya | InnerSpark Africa" />
        <meta property="og:description" content="3-minute WHO-5 wellbeing screening for Kenyans. Private results. No account needed." />
        <meta property="og:url" content="https://www.innersparkafrica.com/check/kenya" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "How do I know if I need therapy in Kenya?", acceptedAnswer: { "@type": "Answer", text: "The WHO-5 wellbeing index is a clinically validated 5-question screen used worldwide. A score below 50% suggests it may help to talk to a licensed therapist. InnerSpark's check is free, takes 3 minutes and gives you private results." } },
            { "@type": "Question", name: "Is the wellbeing check really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. The Kenya WHO-5 check is completely free, no account needed, no payment information requested. Results are private to you." } },
            { "@type": "Question", name: "What happens after I take the check?", acceptedAnswer: { "@type": "Answer", text: "You see your wellbeing score and a private summary. If your score suggests you'd benefit from talking to someone, you can optionally book a licensed African therapist from KES 2,600 — paid via M-Pesa." } },
          ],
        })}</script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-orange-50/50">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/kenya" className="flex items-center gap-2">
              <img src={logo} alt="InnerSpark Africa" className="h-8" />
              <span className="font-bold text-lg text-gray-800">InnerSpark</span>
              <span className="ml-1 px-2 py-0.5 text-[10px] font-medium rounded-xl" style={{ background: "#EEF0FD", color: "#0C447C", border: "0.5px solid #C5CAF5" }}>Kenya</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Private & Confidential
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 pt-20 pb-16">
          {phase === "hero" && (
            <div className="text-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6">Your free Kenya wellbeing check</h1>
              <p className="text-sm text-gray-600 mt-2">3 minutes. Private results. No account needed.</p>
            </div>
          )}
          <AnimatePresence mode="wait">
            {phase === "hero" && <WellbeingHero onStart={() => { trackStart(); setPhase("test"); }} />}
            {phase === "test" && !showResults && (
              <WellbeingTest
                currentQuestion={currentQuestion}
                answers={answers}
                onAnswer={(value: number) => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = value;
                  setAnswers(newAnswers);
                  trackProgress(currentQuestion);
                  setTimeout(() => {
                    if (currentQuestion < 4) setCurrentQuestion((p) => p + 1);
                  }, 300);
                }}
                onNext={() => setCurrentQuestion((p) => p + 1)}
                onBack={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                onSubmit={handleSubmit}
              />
            )}
            {phase === "results" && (
              <>
                <WellbeingResults
                  rawScore={rawScore}
                  percentage={percentage}
                  sessionId={sessionId}
                  source="kenya"
                  deviceType={/Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"}
                  onCtaClick={handleCtaClick}
                  onRetake={() => { setPhase("hero"); setCurrentQuestion(0); setAnswers(Array(5).fill(null)); setShowResults(false); }}
                />
                <div className="mt-6 text-center">
                  <Link to="/book-therapist?market=kenya" className="inline-flex font-medium text-white rounded-lg px-6 py-3" style={{ background: "#F2994A" }}>
                    Book a therapy session from KES 2,600 →
                  </Link>
                </div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}