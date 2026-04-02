import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Lock, ArrowRight, ArrowLeft, CheckCircle, Heart, Brain, Users, RotateCcw, Download, MessageCircle, Share2, Copy, ExternalLink } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/innerspark-logo.png';

const WHO5_QUESTIONS = [
  "I have felt cheerful and in good spirits",
  "I have felt calm and relaxed",
  "I have felt active and vigorous",
  "I woke up feeling fresh and rested",
  "My daily life has been filled with things that interest me",
];

const WORKPLACE_QUESTIONS = [
  "How manageable is your workload?",
  "Do you feel supported at work?",
  "How often do you feel overwhelmed at work?",
];

const ALL_QUESTIONS = [...WHO5_QUESTIONS, ...WORKPLACE_QUESTIONS];

const WHO5_OPTIONS = [
  { value: 0, label: "At no time" },
  { value: 1, label: "Some of the time" },
  { value: 2, label: "Less than half the time" },
  { value: 3, label: "More than half the time" },
  { value: 4, label: "Most of the time" },
  { value: 5, label: "All of the time" },
];

const WORKPLACE_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Very often" },
  { value: 5, label: "Always" },
];

type Phase = 'entry' | 'welcome' | 'test' | 'results';

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  company_id: string;
  company_name?: string;
}

const getCategory = (percentage: number) => {
  if (percentage >= 70) return { label: 'High Wellbeing', color: '#22c55e', bgClass: 'bg-green-50 border-green-200', textClass: 'text-green-700', barClass: 'bg-green-500', emoji: '✨', key: 'green', message: "Your responses suggest good mental wellbeing at this time. Continue maintaining the habits that are supporting you." };
  if (percentage >= 40) return { label: 'Moderate Wellbeing', color: '#eab308', bgClass: 'bg-yellow-50 border-yellow-200', textClass: 'text-yellow-700', barClass: 'bg-yellow-500', emoji: '🌤️', key: 'yellow', message: "Your wellbeing is at a moderate level. There are areas that seem to be going well, and others that may need more attention." };
  return { label: 'Low Wellbeing', color: '#ef4444', bgClass: 'bg-red-50 border-red-200', textClass: 'text-red-700', barClass: 'bg-red-500', emoji: '💛', key: 'red', message: "Your responses suggest that your mental wellbeing may be lower at the moment. It might help to take a closer look at what's been affecting you and consider getting support." };
};

const CorporateWellbeingCheck = () => {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>('entry');
  const [accessCode, setAccessCode] = useState('');
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(ALL_QUESTIONS.length).fill(null));
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check for token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      lookupByToken(token);
    }
  }, [searchParams]);

  const lookupByToken = async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('corporate_employees')
        .select('id, name, email, company_id, screening_completed')
        .eq('secure_token', token)
        .single();

      if (error || !data) {
        toast.error('Invalid or expired link. Please use your access code.');
        setLoading(false);
        return;
      }

      if (data.screening_completed) {
        toast.info('You have already completed this screening.');
        setLoading(false);
        return;
      }

      // Get company name
      const { data: company } = await supabase
        .from('corporate_companies')
        .select('name')
        .eq('id', data.company_id)
        .single();

      setEmployee({ ...data, company_name: company?.name || '' });
      setPhase('welcome');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const lookupByCode = async () => {
    if (!accessCode.trim()) {
      toast.error('Please enter your access code.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('corporate_employees')
        .select('id, name, email, company_id, screening_completed')
        .eq('access_code', accessCode.trim().toUpperCase())
        .single();

      if (error || !data) {
        toast.error('Invalid access code. Please check and try again.');
        setLoading(false);
        return;
      }

      if (data.screening_completed) {
        toast.info('You have already completed this screening.');
        setLoading(false);
        return;
      }

      const { data: company } = await supabase
        .from('corporate_companies')
        .select('name')
        .eq('id', data.company_id)
        .single();

      setEmployee({ ...data, company_name: company?.name || '' });
      setPhase('welcome');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < ALL_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  };

  const who5Score = answers.slice(0, 5).reduce((sum, a) => sum + (a || 0), 0);
  const who5Percentage = who5Score * 4;
  const workplaceScores = answers.slice(5).map(a => a || 0);
  const totalScore = answers.reduce((sum, a) => sum + (a || 0), 0);
  const totalPercentage = Math.round((totalScore / (ALL_QUESTIONS.length * 5)) * 100);
  const category = getCategory(totalPercentage);

  const handleSubmit = async () => {
    if (!employee) return;
    setSubmitting(true);
    try {
      await supabase.from('corporate_screenings').insert({
        employee_id: employee.id,
        company_id: employee.company_id,
        who5_score: who5Score,
        who5_percentage: who5Percentage,
        workplace_responses: {
          workload: workplaceScores[0],
          support: workplaceScores[1],
          overwhelm: workplaceScores[2],
        },
        total_score: totalScore,
        wellbeing_category: category.key,
      });

      await supabase
        .from('corporate_employees')
        .update({ screening_completed: true })
        .eq('id', employee.id);

      setPhase('results');
    } catch {
      toast.error('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  const isLastQuestion = currentQuestion === ALL_QUESTIONS.length - 1;
  const allAnswered = answers.every(a => a !== null);
  const currentOptions = currentQuestion < 5 ? WHO5_OPTIONS : WORKPLACE_OPTIONS;
  const sectionLabel = currentQuestion < 5 ? 'Wellbeing' : 'Workplace';
  const progress = ((currentQuestion + 1) / ALL_QUESTIONS.length) * 100;

  return (
    <>
      <Helmet>
        <title>Corporate Wellbeing Check | InnerSpark Africa</title>
        <meta name="description" content="Confidential employee wellbeing screening by InnerSpark Africa." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-blue-50/40">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="InnerSpark Africa" className="h-8" />
              <span className="font-bold text-lg text-foreground">InnerSpark</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Confidential
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pt-20 pb-16">
          <AnimatePresence mode="wait">
            {/* ENTRY PHASE */}
            {phase === 'entry' && (
              <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Corporate Wellbeing Check</h1>
                <p className="text-muted-foreground mb-8">Enter your access code or use the link from your email to begin.</p>

                <div className="space-y-4 max-w-xs mx-auto">
                  <Input
                    placeholder="Enter Access Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="text-center text-lg tracking-widest font-mono uppercase"
                    maxLength={8}
                    onKeyDown={(e) => e.key === 'Enter' && lookupByCode()}
                  />
                  <Button onClick={lookupByCode} disabled={loading} className="w-full rounded-full">
                    {loading ? 'Verifying...' : 'Start Screening'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-8">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Your responses are private and confidential
                </p>
              </motion.div>
            )}

            {/* WELCOME PHASE */}
            {phase === 'welcome' && employee && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-12 text-center">
                <div className="text-4xl mb-4">👋</div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Hi {employee.name.split(' ')[0]}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">Welcome to your confidential wellbeing check.</p>

                {employee.company_name && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full text-sm text-primary mb-6">
                    <Users className="w-3.5 h-3.5" />
                    {employee.company_name}
                  </div>
                )}

                <div className="bg-card rounded-2xl border p-6 text-left space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">⏱️</span>
                    <p className="text-sm text-muted-foreground">Takes only 2–3 minutes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔒</span>
                    <p className="text-sm text-muted-foreground">Your responses are completely private</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">💙</span>
                    <p className="text-sm text-muted-foreground">Designed to support your wellbeing</p>
                  </div>
                </div>

                <Button onClick={() => setPhase('test')} className="rounded-full px-8" size="lg">
                  Begin Check <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* TEST PHASE */}
            {phase === 'test' && (
              <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Question {currentQuestion + 1} of {ALL_QUESTIONS.length}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{sectionLabel}</span>
                  </div>
                  <Progress value={progress} className="h-2 [&>div]:bg-primary" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentQuestion < 5 && (
                      <p className="text-xs text-muted-foreground mb-2">Over the past 2 weeks...</p>
                    )}
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8 leading-snug">
                      "{ALL_QUESTIONS[currentQuestion]}"
                    </h2>

                    <div className="space-y-3">
                      {currentOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(option.value)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-base font-medium
                            ${answers[currentQuestion] === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-card hover:border-muted-foreground/30 text-foreground hover:bg-muted'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8">
                  <Button variant="ghost" onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))} disabled={currentQuestion === 0} className="text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>

                  {isLastQuestion && allAnswered && (
                    <Button onClick={handleSubmit} disabled={submitting} className="rounded-full px-8">
                      {submitting ? 'Submitting...' : 'See My Results'} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}

                  {!isLastQuestion && answers[currentQuestion] !== null && (
                    <Button variant="ghost" onClick={() => setCurrentQuestion(prev => prev + 1)} className="text-primary">
                      Next <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* RESULTS PHASE */}
            {phase === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8 text-center">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Your Wellbeing Score</h2>

                {/* Score Display */}
                <div className={`rounded-2xl border p-6 mb-6 ${category.bg}`}>
                  <div className={`text-5xl font-bold mb-1 ${category.color}`}>{totalPercentage}%</div>
                  <div className={`text-lg font-semibold ${category.color}`}>{category.label}</div>
                  <div className="w-full bg-white/50 rounded-full h-3 mt-4">
                    <div className={`h-3 rounded-full ${category.bar} transition-all`} style={{ width: `${totalPercentage}%` }} />
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-card rounded-2xl border p-5 mb-6 text-left space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">Score Breakdown</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">WHO-5 Wellbeing</span>
                    <span className="font-medium">{who5Percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Workplace Wellbeing</span>
                    <span className="font-medium">{Math.round((workplaceScores.reduce((a, b) => a + b, 0) / 15) * 100)}%</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-2xl border p-5 mb-6 text-left">
                  <h3 className="font-semibold text-foreground text-sm mb-3">💡 Recommendations</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {category.key === 'green' && (
                      <>
                        <p>• Continue maintaining your healthy habits</p>
                        <p>• Practice regular mindfulness and self-care</p>
                        <p>• Stay connected with supportive colleagues</p>
                      </>
                    )}
                    {category.key === 'yellow' && (
                      <>
                        <p>• Take regular breaks during your workday</p>
                        <p>• Consider exploring the InnerSpark app for guided support</p>
                        <p>• Talk to someone you trust about how you're feeling</p>
                      </>
                    )}
                    {category.key === 'red' && (
                      <>
                        <p>• We encourage you to reach out for professional support</p>
                        <p>• InnerSpark offers confidential therapy sessions</p>
                        <p>• Speaking to a counsellor can make a big difference</p>
                      </>
                    )}
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <a href="https://wa.me/256792085773?text=Hi%20InnerSpark%2C%20I%20just%20completed%20the%20corporate%20wellbeing%20check%20and%20would%20like%20to%20learn%20more%20about%20support%20options." target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-full" size="lg">
                      <Heart className="w-4 h-4 mr-2" /> Talk to a Counsellor
                    </Button>
                  </a>
                  <Link to="/specialists">
                    <Button variant="outline" className="w-full rounded-full mt-2" size="lg">
                      <Users className="w-4 h-4 mr-2" /> Browse Specialists
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Your individual results are private. Your organisation only sees aggregated, anonymous data.
                </p>

                <div className="mt-6">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Screening complete. Thank you for participating.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default CorporateWellbeingCheck;
