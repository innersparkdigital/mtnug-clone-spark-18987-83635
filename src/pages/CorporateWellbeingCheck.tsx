import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Lock, ArrowRight, ArrowLeft, CheckCircle, Heart, Brain, Users, RotateCcw, Download, MessageCircle, Share2, Copy, ExternalLink, Mail, Volume2, Globe, RefreshCw } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/innerspark-logo.png';
import { Checkbox } from '@/components/ui/checkbox';
import EmployeeResultsBreakdown from '@/components/wellbeing/EmployeeResultsBreakdown';
import { computeAnswers, computeAggregate, AnswerMap } from '@/lib/wellbeingIntelligence';
import { CampaignBrandingHeader } from '@/components/wellbeing/CampaignBrandingHeader';
import { ScreeningAnxietyFAQ } from '@/components/wellbeing/ScreeningAnxietyFAQ';

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

// === Wave 3: Multilingual + emoji-scale fallbacks ===
const SCALE_EMOJI = ['😞', '😕', '😐', '🙂', '😊', '🤩'];

// Per-spec emoji + soft background by question type and option value (0..5)
const EMOJI_SETS = {
  // WHO-5 positive: value 5 = best ("All of the time")
  who5: [
    { emoji: '😞', bg: '#F7C1C1' },
    { emoji: '😟', bg: '#FCEBEB' },
    { emoji: '😔', bg: '#FAECE7' },
    { emoji: '😐', bg: '#FAEEDA' },
    { emoji: '🙂', bg: '#EAF3DE' },
    { emoji: '😄', bg: '#E1F5EE' },
  ],
  // Frequency-negative: value 0 = best ("Not at all")
  negFreq: [
    { emoji: '😌', bg: '#E1F5EE' },
    { emoji: '🙂', bg: '#EAF3DE' },
    { emoji: '😐', bg: '#FAEEDA' },
    { emoji: '😟', bg: '#FAECE7' },
    { emoji: '😣', bg: '#FCEBEB' },
    { emoji: '😰', bg: '#F7C1C1' },
  ],
} as const;

// Question index → emoji/colour set. Overwhelm (last) is frequency-negative;
// WHO-5 (0-4) and workload/support (5,6) are positive.
const getEmojiSet = (qIndex: number) =>
  qIndex === 7 ? EMOJI_SETS.negFreq : EMOJI_SETS.who5;

type Lang = 'en' | 'lg' | 'sw';
const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'lg', label: 'Luganda', native: 'Luganda' },
  { code: 'sw', label: 'Kiswahili', native: 'Kiswahili' },
];

const TRANSLATIONS: Record<Lang, { questions: string[]; who5Options: string[]; workplaceOptions: string[]; ui: Record<string, string> }> = {
  en: {
    questions: [...WHO5_QUESTIONS, ...WORKPLACE_QUESTIONS],
    who5Options: WHO5_OPTIONS.map(o => o.label),
    workplaceOptions: WORKPLACE_OPTIONS.map(o => o.label),
    ui: { over_two_weeks: 'Over the past 2 weeks...', listen: 'Listen', question_label: 'Question', of: 'of', back: 'Back', next: 'Next', see_results: 'See My Results', community_mode: 'Community Wellbeing Check', community_subtitle: 'A facilitator-supported check-in. Your responses stay private.', completed_today: 'people have completed this check on this device today', reset_counter: 'Reset counter' },
  },
  lg: {
    questions: [
      "Nzizeemu essanyu n'okusanyuka",
      "Nzizeemu emirembe n'okuwummula",
      "Mbadde nnamaanyi era nga nkola",
      "Nzuukuse nga mpummudde era nga muggya",
      "Obulamu bwange obwa buli lunaku bujjuziddwa ebintu ebinsanyusa",
      "Emirimu gyo musobola gukwatibwa otya?",
      "Owulira ng'oyambibwa ku mulimu?",
      "Emirundi emeka gy'owulira ng'omulimu gukuyitiridde?",
    ],
    who5Options: ["Tewali kiseera", "Ebiseera ebimu", "Wansi w'ekitundu", "Waggulu w'ekitundu", "Ebiseera ebisinga", "Ebiseera byonna"],
    workplaceOptions: ["Tekiri kyonna", "Mu butono", "Oluusi", "Emirundi mingi", "Emirundi mingi nnyo", "Bulijjo"],
    ui: { over_two_weeks: 'Mu wiiki bbiri eziyise...', listen: 'Wuliriza', question_label: 'Ekibuuzo', of: 'ku', back: 'Ddayo', next: 'Mu maaso', see_results: 'Laba ebivudemu', community_mode: 'Okukebera Obulamu obw\u2019Omutima mu Kitundu', community_subtitle: 'Ekikebera ekiyambibwa omuyigiriza. Eby\'oddamu byonna bya kyama.', completed_today: 'abantu bamaze okukola okukebera ku kyuma kino leero', reset_counter: 'Sazaamu omuwendo' },
  },
  sw: {
    questions: [
      "Nimejisikia mchangamfu na mwenye furaha",
      "Nimejisikia mtulivu na nimepumzika",
      "Nimejisikia mwenye nguvu na shughuli",
      "Niliamka nikijisikia mpya na nimepumzika",
      "Maisha yangu ya kila siku yamejaa mambo yanayonivutia",
      "Mzigo wako wa kazi unawezekana kushughulikiwa kiasi gani?",
      "Je, unahisi unapata msaada kazini?",
      "Mara ngapi unahisi umelemewa kazini?",
    ],
    who5Options: ["Kamwe", "Mara chache", "Chini ya nusu ya wakati", "Zaidi ya nusu ya wakati", "Mara nyingi", "Wakati wote"],
    workplaceOptions: ["Hapana kabisa", "Mara chache sana", "Mara nyingine", "Mara nyingi", "Mara nyingi sana", "Daima"],
    ui: { over_two_weeks: 'Katika wiki 2 zilizopita...', listen: 'Sikiliza', question_label: 'Swali', of: 'kati ya', back: 'Rudi', next: 'Endelea', see_results: 'Ona Matokeo Yangu', community_mode: 'Ukaguzi wa Ustawi wa Jamii', community_subtitle: 'Ukaguzi unaosaidiwa na mwezeshaji. Majibu yako ni ya siri.', completed_today: 'watu wamekamilisha ukaguzi huu kwenye kifaa hiki leo', reset_counter: 'Anzisha upya hesabu' },
  },
};

type Phase = 'entry' | 'welcome' | 'consent' | 'test' | 'results';

interface ScreeningHistory {
  id: string;
  completed_at: string;
  total_score: number;
  who5_percentage: number;
  wellbeing_category: string;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  company_id: string;
  company_name?: string;
  screening_history: ScreeningHistory[];
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
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [consentChecked, setConsentChecked] = useState(false);

  // Wave 3: language + community mode + facilitator counter
  const isCommunityMode = searchParams.get('mode') === 'community';
  const campaignSlug = searchParams.get('slug') || '';
  const [employeeCampaignSlug, setEmployeeCampaignSlug] = useState('');
  const activeCampaignSlug = campaignSlug || employeeCampaignSlug;
  const [lang, setLang] = useState<Lang>(() => {
    const fromUrl = (searchParams.get('lang') || '').toLowerCase();
    if (fromUrl === 'lg' || fromUrl === 'sw' || fromUrl === 'en') return fromUrl as Lang;
    try { return (localStorage.getItem('isa_wb_lang') as Lang) || 'en'; } catch { return 'en'; }
  });
  useEffect(() => { try { localStorage.setItem('isa_wb_lang', lang); } catch {} }, [lang]);
  const t = TRANSLATIONS[lang];

  const COUNTER_KEY = `isa_facilitator_count_${new Date().toISOString().slice(0, 10)}`;
  const [facilitatorCount, setFacilitatorCount] = useState<number>(() => {
    if (!isCommunityMode) return 0;
    try { return parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) || 0; } catch { return 0; }
  });

  const speakText = (text: string) => {
    try {
      if (!('speechSynthesis' in window)) { toast.info('Audio not supported on this device'); return; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      // Best-effort voice mapping. Browsers may fall back to default.
      utter.lang = lang === 'sw' ? 'sw-KE' : lang === 'lg' ? 'en-UG' : 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch (e) { console.warn('TTS failed', e); }
  };
  // Results email state
  const [resultsEmail, setResultsEmail] = useState<string>('');
  const [sendingResultsEmail, setSendingResultsEmail] = useState(false);
  const [resultsEmailSent, setResultsEmailSent] = useState(false);
  const [intelligenceAnswers, setIntelligenceAnswers] = useState<AnswerMap | null>(null);

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
        .rpc('lookup_employee_by_token', { _token: token }) as { data: any; error: any };

      if (error || !data) {
        toast.error('Invalid or expired link. Please use your access code.');
        setLoading(false);
        return;
      }

      // Fetch company name and screening history in parallel
      const [companyRes, historyRes] = await Promise.all([
        supabase.from('corporate_companies').select('name, slug').eq('id', data.company_id).single(),
        supabase.from('corporate_screenings').select('id, completed_at, total_score, who5_percentage, wellbeing_category').eq('employee_id', data.id).order('completed_at', { ascending: false }),
      ]);

      setEmployeeCampaignSlug(companyRes.data?.slug || '');

      setEmployee({
        id: data.id,
        name: data.name,
        email: data.email,
        company_id: data.company_id,
        company_name: companyRes.data?.name || '',
        screening_history: (historyRes.data || []) as ScreeningHistory[],
      });
      setPhase('welcome');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const lookupByCode = async () => {
    // Sanitize: strip whitespace and any non-alphanumeric characters, uppercase
    const cleaned = accessCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!cleaned) {
      toast.error('Please enter your 8-character access code.');
      return;
    }
    if (cleaned.length !== 8) {
      toast.error(`Access code must be 8 characters. You entered ${cleaned.length}.`);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('lookup_employee_by_code', { _code: cleaned }) as { data: any; error: any };

      if (error) {
        console.error('lookup_employee_by_code error', error);
        toast.error('Network issue verifying code. Please try again.');
        setLoading(false);
        return;
      }
      if (!data) {
        toast.error('That code was not found. Double-check the code from your employer (letters O/0 and I/1 are easy to mix up).');
        setLoading(false);
        return;
      }
      // Normalize stored value to the cleaned version
      setAccessCode(cleaned);

      const [companyRes, historyRes] = await Promise.all([
        supabase.from('corporate_companies').select('name, slug').eq('id', data.company_id).single(),
        supabase.from('corporate_screenings').select('id, completed_at, total_score, who5_percentage, wellbeing_category').eq('employee_id', data.id).order('completed_at', { ascending: false }),
      ]);

      setEmployeeCampaignSlug(companyRes.data?.slug || '');

      setEmployee({
        id: data.id,
        name: data.name,
        email: data.email,
        company_id: data.company_id,
        company_name: companyRes.data?.name || '',
        screening_history: (historyRes.data || []) as ScreeningHistory[],
      });
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
      const attemptNumber = employee.screening_history.length + 1;

      // Per-question intelligence
      const intelligence = computeAnswers(answers as number[]);
      const aggregate = computeAggregate(intelligence);
      setIntelligenceAnswers(intelligence);

      const { data: screeningRow } = await supabase.from('corporate_screenings').insert({
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
        per_question: intelligence as any,
        triggered_flags: aggregate.triggeredFlags,
        triggered_clusters: aggregate.triggeredClusters,
        crisis_alert_level: aggregate.crisisAlertLevel,
        risk_category: aggregate.riskCategory,
      } as any).select('id').single();

      // Crisis alert (independent — must fire even if email/report fails)
      if (aggregate.crisisAlertRequired && aggregate.crisisAlertLevel) {
        const triggers = [
          ...aggregate.triggeredFlags,
          ...(intelligence.q5.criticalFlag ? ['Q5_ZERO_ANHEDONIA'] : []),
          ...(aggregate.overallScore.percentage < 20 ? ['OVERALL_BELOW_20'] : []),
        ];
        supabase.from('corporate_crisis_alerts').insert({
          company_id: employee.company_id,
          employee_id: employee.id,
          screening_id: screeningRow?.id ?? null,
          level: aggregate.crisisAlertLevel,
          triggers,
        } as any).then(({ error }) => {
          if (error) console.error('crisis alert insert failed', error);
        });
      }

      // Update employee record (gender + mark screening done)
      await supabase
        .rpc('complete_employee_screening', { 
          _employee_id: employee.id, 
          _gender: selectedGender || null 
        });

      // Send branded private results email (non-blocking)
      if (employee.email) {
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'b2b-employee-results',
            recipientEmail: employee.email,
            idempotencyKey: `b2b-emp-results-${employee.id}-${Date.now()}`,
            templateData: {
              employee_name: employee.name,
              company_name: employee.company_name,
              who5_percentage: who5Percentage,
              total_percentage: totalPercentage,
              wellbeing_category: category.key,
            },
          },
        }).catch(e => console.error('b2b-employee-results email failed', e));
      }

      setPhase('results');

      // Wave 3: bump facilitator counter (community mode only)
      if (isCommunityMode) {
        try {
          const next = facilitatorCount + 1;
          localStorage.setItem(COUNTER_KEY, String(next));
          setFacilitatorCount(next);
        } catch {}
      }
      // Pre-fill the results-email input with the address on file
      setResultsEmail(employee.email || '');
      setResultsEmailSent(true); // auto-send already fired above
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
        <title>Corporate Wellbeing Screening — Enter Your Access Code | InnerSpark Africa</title>
        <meta name="description" content="InnerSpark's corporate mental health screening tool. Enter your access code to complete your confidential wellbeing check." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-blue-50/40">
        {/* Standard header (hidden when arriving via a branded campaign link — the campaign hero takes over) */}
        {!activeCampaignSlug && (
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
        )}

        <main className={`pb-16 ${activeCampaignSlug ? 'pt-0' : 'max-w-lg mx-auto px-4 pt-20'}`}>
          {activeCampaignSlug && (phase === 'entry' || phase === 'welcome') && (
            <CampaignBrandingHeader
              slug={activeCampaignSlug}
              language={lang as 'en' | 'lg' | 'sw'}
              onLanguageChange={(lng) => setLang(lng)}
            />
          )}
          <div className="max-w-lg mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* ENTRY PHASE */}
            {phase === 'entry' && (
              <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{isCommunityMode ? t.ui.community_mode : 'Corporate Wellbeing Check'}</h1>
                <p className="text-muted-foreground mb-6">{isCommunityMode ? t.ui.community_subtitle : 'Enter your access code to begin.'}</p>
                {isCommunityMode && (
                  <div className="mb-4 inline-flex items-center gap-2 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" /> Facilitator mode • {facilitatorCount} completed today
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Your individual responses are completely private. Your employer will only see anonymized company-wide results — no names, no personal data.
                </p>

                <div className="space-y-4 max-w-xs mx-auto">
                  <Input
                    placeholder="Enter Access Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())}
                    className="text-center text-lg tracking-widest font-mono uppercase"
                    maxLength={8}
                    onKeyDown={(e) => e.key === 'Enter' && lookupByCode()}
                  />
                  <p className="text-xs text-muted-foreground -mt-2">
                    8 characters · letters &amp; numbers only (e.g. <span className="font-mono">1CF0846B</span>)
                  </p>
                  <Button onClick={lookupByCode} disabled={loading} className="w-full rounded-full">
                    {loading ? 'Verifying...' : 'Start Screening'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-8">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Your responses are private and confidential
                </p>

                <div className="mt-10 grid gap-4 text-left">
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-sm font-semibold text-foreground mb-1">No access code?</p>
                    <p className="text-xs text-muted-foreground">
                      If you are an employee who hasn't received a code, ask your HR manager. Or take our free public wellbeing check at{' '}
                      <Link to="/mind-check" className="text-primary underline">/mind-check</Link>.
                    </p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-foreground mb-1">For HR managers</p>
                    <p className="text-xs text-muted-foreground">
                      Want to run a confidential wellbeing screening for your team? Request your company's access code and dashboard —{' '}
                      <Link to="/for-business" className="text-primary underline">visit /for-business</Link> or email{' '}
                      <a href="mailto:info@innersparkafrica.com" className="text-primary underline">info@innersparkafrica.com</a>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* WELCOME PHASE */}
            {phase === 'welcome' && employee && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-12 text-center">
                <div className="text-4xl mb-4">👋</div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Hi {employee.name.split(' ')[0]}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {employee.screening_history.length > 0
                    ? `Welcome back! This will be your check #${employee.screening_history.length + 1}.`
                    : 'Welcome to your confidential wellbeing check.'}
                </p>

                {employee.company_name && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full text-sm text-primary mb-6">
                    <Users className="w-3.5 h-3.5" />
                    {employee.company_name}
                  </div>
                )}

                {/* Previous Screening History */}
                {employee.screening_history.length > 0 && (
                  <div className="bg-card rounded-2xl border p-5 text-left mb-6">
                    <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-primary" />
                      Your Previous Check-ins ({employee.screening_history.length})
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {employee.screening_history.slice(0, 5).map((entry, idx) => {
                        const cat = getCategory(Math.round((entry.total_score / (ALL_QUESTIONS.length * 5)) * 100));
                        const pct = Math.round((entry.total_score / (ALL_QUESTIONS.length * 5)) * 100);
                        return (
                          <div key={entry.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0 border-border/50">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">#{employee.screening_history.length - idx}</span>
                              <span className="text-muted-foreground">{new Date(entry.completed_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold" style={{ color: cat.color }}>{pct}%</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.bgClass} ${cat.textClass}`}>{cat.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {employee.screening_history.length > 1 && (
                      <div className="mt-3 pt-2 border-t border-border/50">
                        {(() => {
                          const latest = Math.round((employee.screening_history[0].total_score / (ALL_QUESTIONS.length * 5)) * 100);
                          const previous = Math.round((employee.screening_history[1].total_score / (ALL_QUESTIONS.length * 5)) * 100);
                          const diff = latest - previous;
                          return (
                            <p className="text-xs text-muted-foreground text-center">
                              {diff > 0 ? `📈 +${diff}% improvement since last check` : diff < 0 ? `📉 ${diff}% change since last check` : '➡️ Same score as last check'}
                            </p>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-card rounded-2xl border p-6 text-left space-y-3 mb-6">
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

                {/* Gender Selection */}
                <ScreeningAnxietyFAQ
                  language={lang as 'en' | 'lg' | 'sw'}
                  companyId={employee.company_id}
                />

                <div className="mt-8 mb-8 max-w-xs mx-auto">
                  <p className="text-sm font-medium text-foreground mb-3">Please select your gender</p>
                  <div className="flex gap-3 justify-center">
                    {['Male', 'Female'].map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                          selectedGender === g
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setPhase('consent')} className="rounded-full px-8" size="lg" disabled={!selectedGender}>
                  {employee.screening_history.length > 0 ? 'Take Another Check' : 'Begin Check'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* CONSENT PHASE */}
            {phase === 'consent' && (
              <motion.div key="consent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                <div className="bg-card rounded-2xl border p-6 text-left space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Employee Consent Form</h2>
                    <p className="text-xs text-muted-foreground mt-1">InnerSpark Corporate Mental Health Screening Program</p>
                  </div>

                  <p className="text-sm text-muted-foreground">By proceeding with this assessment, you confirm that you have read and understood the following:</p>

                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-foreground">1. Voluntary Participation</h3>
                      <p className="text-muted-foreground">Your participation in this mental health screening is <strong>completely voluntary</strong>. You may choose not to participate or to stop at any time.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">2. Purpose of the Screening</h3>
                      <p className="text-muted-foreground">This screening is designed to:</p>
                      <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1 space-y-0.5">
                        <li>Assess general wellbeing</li>
                        <li>Identify potential stress or burnout risks</li>
                        <li>Provide personal insights and recommendations</li>
                      </ul>
                      <p className="text-muted-foreground mt-1">It is <strong>not a medical diagnosis</strong>.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">3. Data Collection</h3>
                      <p className="text-muted-foreground">The assessment will collect:</p>
                      <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1 space-y-0.5">
                        <li>Your responses to wellbeing-related questions</li>
                        <li>Basic, non-sensitive identification (if required for access)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">4. Confidentiality &amp; Privacy</h3>
                      <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-0.5">
                        <li>Your individual responses will remain <strong>strictly confidential</strong></li>
                        <li>Your employer will <strong>NOT</strong> have access to your personal results</li>
                        <li>Only <strong>aggregated and anonymized data</strong> will be shared with your organization</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">5. Use of Data</h3>
                      <p className="text-muted-foreground">Your data will be used to:</p>
                      <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1 space-y-0.5">
                        <li>Generate your personal wellbeing feedback</li>
                        <li>Produce anonymized organizational reports</li>
                        <li>Improve mental health support services</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">6. No Individual Disclosure</h3>
                      <p className="text-muted-foreground">Under no circumstances will your <strong>personal identity or individual results</strong> be disclosed to your employer without your explicit consent.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">7. Right to Withdraw</h3>
                      <p className="text-muted-foreground">You may stop the assessment at any time without any consequence.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">8. Consent</h3>
                      <p className="text-muted-foreground">By clicking <strong>&quot;I Agree&quot;</strong> or proceeding with this assessment, you confirm that:</p>
                      <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1 space-y-0.5">
                        <li>You understand the purpose of this screening</li>
                        <li>You voluntarily consent to participate</li>
                        <li>You agree to the collection and use of your data as described above</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={consentChecked}
                        onCheckedChange={(checked) => setConsentChecked(checked === true)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-foreground font-medium leading-snug">
                        I Agree and Consent to Participate
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setConsentChecked(false); setPhase('welcome'); }} className="rounded-full flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={() => setPhase('test')} className="rounded-full flex-1" disabled={!consentChecked}>
                    Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TEST PHASE */}
            {phase === 'test' && (
              <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-8">
                {/* Language selector + audio + community banner */}
                <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
                  <div className="inline-flex items-center gap-1 bg-muted/50 rounded-full p-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${lang === l.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                      >
                        {l.native}
                      </button>
                    ))}
                  </div>
                  {isCommunityMode && (
                    <div className="text-xs text-primary inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                      <Users className="w-3 h-3" /> {facilitatorCount} {t.ui.completed_today}
                    </div>
                  )}
                </div>

                {/* Card-list redesign — single full-screen question with progress bar */}
                <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#F8F9FF' }}>
                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="uppercase font-medium"
                        style={{ fontSize: '12px', letterSpacing: '0.5px', color: '#9CA3AF' }}
                      >
                        {t.ui.question_label} {currentQuestion + 1} {t.ui.of} {ALL_QUESTIONS.length}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                        {sectionLabel}
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={currentQuestion + 1}
                      aria-valuemin={1}
                      aria-valuemax={ALL_QUESTIONS.length}
                      className="w-full overflow-hidden"
                      style={{ height: '4px', borderRadius: '2px', background: '#F3F4F6' }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${progress}%`,
                          background: '#3B4FD4',
                          borderRadius: '2px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      {currentQuestion < 5 && (
                        <p className="mb-2" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          {t.ui.over_two_weeks}
                        </p>
                      )}
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <h2
                          className="flex-1 font-medium"
                          style={{
                            color: '#1A1A2E',
                            lineHeight: 1.5,
                            fontWeight: 500,
                            fontSize: 'clamp(16px, 4.2vw, 17px)',
                          }}
                        >
                          {t.questions[currentQuestion]}
                        </h2>
                        <button
                          type="button"
                          onClick={() => speakText(t.questions[currentQuestion])}
                          className="shrink-0 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
                          aria-label={t.ui.listen}
                          title={t.ui.listen}
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col" style={{ gap: '12px' }}>
                        {currentOptions.map((option, idx) => {
                          const translatedLabel =
                            currentQuestion < 5 ? t.who5Options[idx] : t.workplaceOptions[idx];
                          const selected = answers[currentQuestion] === option.value;
                          const { emoji, bg } = getEmojiSet(currentQuestion)[option.value];
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleAnswer(option.value)}
                              aria-label={translatedLabel}
                              aria-pressed={selected}
                              className="w-full flex items-center text-left transition-all duration-200"
                              style={{
                                minHeight: '56px',
                                gap: '12px',
                                padding:
                                  typeof window !== 'undefined' && window.innerWidth < 480
                                    ? '12px 14px'
                                    : '14px 16px',
                                borderRadius: '12px',
                                background: selected ? '#EEF0FD' : '#FFFFFF',
                                border: `1.5px solid ${selected ? '#3B4FD4' : '#E5E7EB'}`,
                                color: selected ? '#3B4FD4' : '#1A1A2E',
                                fontWeight: selected ? 500 : 400,
                                fontSize: 'clamp(14px, 3.8vw, 15px)',
                              }}
                            >
                              <span
                                aria-hidden
                                className="shrink-0 inline-flex items-center justify-center"
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: bg,
                                  fontSize: '26px',
                                  lineHeight: 1,
                                }}
                              >
                                {emoji}
                              </span>
                              <span className="flex-1">{translatedLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="inline-flex items-center gap-1 disabled:opacity-40"
                      style={{ fontSize: '14px', color: '#6B7280' }}
                    >
                      <ArrowLeft className="w-4 h-4" /> {t.ui.back}
                    </button>

                    {isLastQuestion ? (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!allAnswered || submitting}
                        className="inline-flex items-center gap-1 transition disabled:cursor-not-allowed"
                        style={{
                          background: !allAnswered || submitting ? '#C7CBE8' : '#3B4FD4',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '10px 22px',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {submitting ? 'Submitting...' : t.ui.see_results}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={answers[currentQuestion] === null}
                        className="inline-flex items-center gap-1 transition disabled:cursor-not-allowed"
                        style={{
                          background: answers[currentQuestion] === null ? '#C7CBE8' : '#3B4FD4',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '10px 22px',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {t.ui.next}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isCommunityMode && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => { try { localStorage.setItem(COUNTER_KEY, '0'); } catch {} setFacilitatorCount(0); toast.success('Counter reset'); }}
                      className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> {t.ui.reset_counter}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESULTS PHASE */}
            {phase === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-8">
                <img src={logo} alt="InnerSpark Africa" className="h-12 mx-auto mb-4" />

                {/* Attempt Badge */}
                {employee && employee.screening_history.length > 0 && (
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      <RotateCcw className="w-3 h-3" />
                      Check-in #{employee.screening_history.length + 1}
                    </span>
                  </div>
                )}

                {/* Score Display */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-extrabold mb-1" style={{ color: category.color }}>
                    {totalPercentage}%
                  </div>
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${category.bgClass} ${category.textClass}`}>
                    {category.label}
                  </div>
                  {/* Trend vs previous */}
                  {employee && employee.screening_history.length > 0 && (() => {
                    const prevPct = Math.round((employee.screening_history[0].total_score / (ALL_QUESTIONS.length * 5)) * 100);
                    const diff = totalPercentage - prevPct;
                    if (diff === 0) return <p className="text-xs text-muted-foreground mt-2">➡️ Same as your last check</p>;
                    return <p className="text-xs mt-2" style={{ color: diff > 0 ? '#22c55e' : '#ef4444' }}>{diff > 0 ? `📈 +${diff}%` : `📉 ${diff}%`} compared to your last check</p>;
                  })()}
                </div>

                {/* Score Bar */}
                <div className="mb-6">
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${totalPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${category.barClass}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="flex text-xs mt-0.5">
                    <span className="flex-[50] text-red-400 text-center">Low</span>
                    <span className="flex-[25] text-yellow-500 text-center">Moderate</span>
                    <span className="flex-[25] text-green-500 text-center">High</span>
                  </div>
                </div>

                {/* Insight */}
                <div className={`rounded-2xl p-5 border mb-6 ${category.bgClass}`}>
                  <p className={`text-base leading-relaxed ${category.textClass}`}>
                    {category.message}
                  </p>
                </div>

                {/* Raw Score */}
                <div className="text-center text-sm text-muted-foreground mb-6">
                  Raw score: {totalScore}/{ALL_QUESTIONS.length * 5} • WHO-5 + Workplace Index
                </div>

                {/* Per-question intelligence breakdown */}
                {intelligenceAnswers && (
                  <div className="mb-6">
                    <EmployeeResultsBreakdown answers={intelligenceAnswers} />
                  </div>
                )}

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

                {/* Email My Results */}
                <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 mb-6 text-left">
                  <h3 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Get a private copy by email
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {resultsEmailSent
                      ? `We've already sent a copy to ${employee?.email}. Want it sent somewhere else? Edit below and send again.`
                      : 'Enter the email where you would like to receive your private results.'}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={resultsEmail}
                      onChange={(e) => setResultsEmail(e.target.value)}
                      className="flex-1 h-10 text-sm"
                    />
                    <Button
                      size="sm"
                      className="rounded-md px-4"
                      disabled={sendingResultsEmail || !resultsEmail.trim()}
                      onClick={async () => {
                        const email = resultsEmail.trim();
                        // Simple email validation
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                          toast.error('Please enter a valid email address.');
                          return;
                        }
                        if (!employee) return;
                        setSendingResultsEmail(true);
                        try {
                          const { error } = await supabase.functions.invoke('send-transactional-email', {
                            body: {
                              templateName: 'b2b-employee-results',
                              recipientEmail: email,
                              idempotencyKey: `b2b-emp-results-self-${employee.id}-${email}-${Date.now()}`,
                              templateData: {
                                employee_name: employee.name,
                                company_name: employee.company_name,
                                who5_percentage: who5Percentage,
                                total_percentage: totalPercentage,
                                wellbeing_category: category.key,
                              },
                            },
                          });
                          if (error) throw error;
                          toast.success(`Results sent to ${email}. Check your inbox (and spam folder).`);
                          setResultsEmailSent(true);
                        } catch (e: any) {
                          toast.error(`Failed to send: ${e?.message || 'please try again'}`);
                        }
                        setSendingResultsEmail(false);
                      }}
                    >
                      {sendingResultsEmail ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>

                {/* Talk to someone prompt - for low/moderate */}
                {category.key !== 'green' && (
                  <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-5 mb-6 text-left">
                    <p className="text-sm font-medium text-foreground mb-3">Would you like to talk to someone about how you're feeling?</p>
                    <div className="space-y-2">
                      <a href="https://wa.me/256792085773?text=Hi%20InnerSpark%2C%20I%20just%20completed%20the%20corporate%20wellbeing%20check%20and%20would%20like%20to%20talk%20to%20someone." target="_blank" rel="noopener noreferrer">
                        <Button className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                          ✅ Yes, I'd like to talk to someone
                        </Button>
                      </a>
                      <Button variant="outline" className="w-full rounded-full text-sm" size="sm" onClick={() => toast.info("That's okay! You can reach out anytime.")}>
                        ⏳ Maybe later
                      </Button>
                      <Button variant="ghost" className="w-full text-sm text-muted-foreground" size="sm" onClick={() => toast.info("No worries. Take care of yourself!")}>
                        ❌ No, I'm okay for now
                      </Button>
                    </div>
                  </div>
                )}

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

                {/* Share Results */}
                <div className="bg-card rounded-2xl border p-5 mb-6">
                  <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Your Results
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`I scored ${totalPercentage}% on my wellbeing check. Take yours at innersparkafrica.com/wellbeing-check`)}`, '_blank'); }}>
                      💬 WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${totalPercentage}% on my wellbeing check with @InnerSparkAfrica. Check yours!`)}`, '_blank'); }}>
                      🐦 Twitter/X
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.innersparkafrica.com/wellbeing-check')}`, '_blank'); }}>
                      📘 Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => { navigator.clipboard.writeText(`I scored ${totalPercentage}% on my wellbeing check. Take yours at innersparkafrica.com/wellbeing-check`); toast.success('Link copied!'); }}>
                      <Copy className="w-3 h-3 mr-1" /> Copy Link
                    </Button>
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="space-y-3 mb-8">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-base shadow-lg" onClick={() => toast.info('App coming soon!')}>
                    <Download className="w-5 h-5 mr-2" />
                    Download the InnerSpark App
                  </Button>

                  <Link to="/specialists">
                    <Button variant="outline" size="lg" className="w-full rounded-xl py-6 text-base border-2 border-primary text-primary hover:bg-primary/5 mt-2">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Talk to a Therapist
                    </Button>
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/support-groups">
                      <Button variant="outline" className="w-full rounded-xl py-5 text-sm">
                        <Users className="w-4 h-4 mr-1.5" />
                        Support Groups
                      </Button>
                    </Link>
                    <Link to="/mind-check">
                      <Button variant="outline" className="w-full rounded-xl py-5 text-sm">
                        <Brain className="w-4 h-4 mr-1.5" />
                        Detailed Tests
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Bridge to Detailed Assessments */}
                <div className="bg-card rounded-2xl p-6 border shadow-sm text-center mb-8">
                  <h3 className="text-lg font-bold text-foreground mb-2">Need a deeper understanding?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Take detailed clinical assessments for depression, anxiety, PTSD, and 34+ more conditions.
                  </p>
                  <Link to="/mind-check">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                      👉 Take Detailed Mental Health Assessments
                    </Button>
                  </Link>
                </div>

                {/* Privacy */}
                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your responses are private and confidential.
                  </p>
                  <p>Your organisation only sees aggregated, anonymous data.</p>
                  <p>This is not a diagnosis, but a mental wellbeing screening tool.</p>
                </div>

                {/* Retake */}
                <div className="text-center mt-6 mb-4">
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={() => {
                      setPhase('welcome');
                      setCurrentQuestion(0);
                      setAnswers(Array(ALL_QUESTIONS.length).fill(null));
                      setSelectedGender('');
                      // Refresh history
                      if (employee) {
                        supabase.from('corporate_screenings')
                          .select('id, completed_at, total_score, who5_percentage, wellbeing_category')
                          .eq('employee_id', employee.id)
                          .order('completed_at', { ascending: false })
                          .then(({ data }) => {
                            setEmployee({ ...employee, screening_history: (data || []) as ScreeningHistory[] });
                          });
                      }
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Another Check-in
                  </Button>
                </div>

                {/* Completion */}
                <div className="text-center mt-4">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Screening complete. Thank you for participating.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};

export default CorporateWellbeingCheck;
