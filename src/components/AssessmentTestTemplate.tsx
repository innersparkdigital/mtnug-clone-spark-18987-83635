import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TherapistCTAPopup from "@/components/TherapistCTAPopup";
import BookingFormModal from "@/components/BookingFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAssessmentTest } from "@/hooks/useAssessmentTest";
import { trackAssessmentCompleted } from "@/lib/analytics";
import { 
  Brain, 
  Heart, 
  ChevronRight,
  Clock,
  Shield,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from "lucide-react";

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

export interface AssessmentTestConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metaDescription: string;
  heroColor: string;
  heroGradient: string;
  questions: AssessmentQuestion[];
  recommendation: string;
  recommendedFormat: string;
  maxScore: number;
  getSeverity: (score: number) => {
    level: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  };
  symptoms?: { title: string; description: string }[];
}

interface AssessmentTestTemplateProps {
  config: AssessmentTestConfig;
}

const AssessmentTestTemplate = ({ config }: AssessmentTestTemplateProps) => {
  const {
    testStarted,
    setTestStarted,
    currentQuestion,
    answers,
    showResults,
    showTherapistPopup,
    setShowTherapistPopup,
    showBookingForm,
    setShowBookingForm,
    pendingAction,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleRestart,
    handleContinueToBooking,
    calculateScore,
    getResultInterpretation,
  } = useAssessmentTest({
    assessmentType: config.id,
    assessmentLabel: config.title,
    maxScore: config.maxScore,
    recommendation: config.recommendation,
    recommendedFormat: config.recommendedFormat,
    getSeverity: config.getSeverity,
  });

  const progress = ((currentQuestion + 1) / config.questions.length) * 100;

  // Track when results are shown
  const renderResults = () => {
    const score = calculateScore();
    const result = getResultInterpretation(score);
    
    // Track analytics
    trackAssessmentCompleted(config.id, result.level, score);
    
    return (
      <Card className="shadow-xl border-0">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Results</h2>
            <p className="text-muted-foreground">Based on your responses</p>
          </div>
          
          <div className={`${result.bgColor} ${result.borderColor} border rounded-xl p-6 md:p-8 mb-8`}>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className={`text-5xl font-bold ${result.color} mb-2`}>{score}</p>
              <p className="text-sm text-muted-foreground mb-4">out of {config.maxScore}</p>
              <div className={`inline-block px-4 py-2 rounded-full ${result.bgColor} ${result.borderColor} border`}>
                <span className={`font-semibold ${result.color}`}>{result.level}</span>
              </div>
            </div>
            <p className="mt-6 text-center text-foreground/80">{result.description}</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-center">
            <p className="text-foreground font-medium">You're not alone. Support is available.</p>
          </div>

          <div className="bg-muted rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Consider speaking with a mental health professional for a comprehensive evaluation</li>
              <li>• Connect with licensed therapists through Innerspark</li>
              <li>• Practice self-care and maintain healthy routines</li>
              <li>• Reach out to friends, family, or support groups</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Test
            </Button>
            <Button 
              size="lg"
              onClick={handleContinueToBooking}
            >
              Book a Therapist Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{config.title} Test - Free Mental Health Screening | InnerSpark</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={`https://www.innersparkafrica.com/mind-check/${config.id}`} />
      </Helmet>
      
      <Header />
      
      {/* Hero Section */}
      <section className={`relative ${config.heroGradient} text-white py-16 md:py-24`}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className={`${config.heroColor} text-sm font-medium uppercase tracking-wider mb-4`}>FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{config.title.toUpperCase()}</h1>
            <p className="text-xl text-white/90 mb-8">
              {config.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>3-5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {!testStarted && !showResults ? (
              <Card className="shadow-xl border-0">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className={`w-20 h-20 ${config.heroColor.replace('text-', 'bg-').replace('-200', '-100')} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Brain className={`h-10 w-10 ${config.heroColor.replace('-200', '-600')}`} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{config.title} Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    {config.description}
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> This test is for educational purposes only and is not a diagnostic tool. 
                      Please consult a healthcare professional for a proper diagnosis.
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setTestStarted(true)}
                    className="px-8 py-6 text-lg"
                  >
                    Start Test <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ) : showResults ? (
              renderResults()
            ) : (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6 md:p-8">
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Question {currentQuestion + 1} of {config.questions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">
                      {config.questions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[config.questions[currentQuestion].id]?.toString()}
                      onValueChange={(value) => handleAnswer(config.questions[currentQuestion].id, parseInt(value))}
                      className="space-y-3"
                    >
                      {config.questions[currentQuestion].options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                          <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={() => handleNext(config.questions.length)}
                      disabled={answers[config.questions[currentQuestion].id] === undefined}
                      className="flex items-center gap-2"
                    >
                      {currentQuestion === config.questions.length - 1 ? "See Results" : "Next"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
      
      <TherapistCTAPopup
        isOpen={showTherapistPopup}
        onClose={() => setShowTherapistPopup(false)}
      />

      <BookingFormModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        formType={pendingAction === "group" ? "group" : "book"}
      />
    </div>
  );
};

export default AssessmentTestTemplate;
