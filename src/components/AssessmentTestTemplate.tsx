import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingFormModal from "@/components/BookingFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAssessmentTest } from "@/hooks/useAssessmentTest";
import { trackAssessmentCompleted } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Heart, 
  ChevronRight,
  Clock,
  Shield,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Users,
  BookOpen,
  AlertCircle,
  Phone,
  Star
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
  aboutText?: string;
  treatmentApproaches?: { title: string; description: string }[];
  whenToSeekHelp?: string[];
  didYouKnow?: string;
}

interface AssessmentTestTemplateProps {
  config: AssessmentTestConfig;
}

// Generic reviews for all tests
const genericReviews = [
  { name: "Sarah M.", rating: 5, comment: "Very informative and helped me understand what I was feeling.", tag: "Informative" },
  { name: "James K.", rating: 5, comment: "The questions were thoughtful and the results gave me clarity.", tag: "Helpful" },
  { name: "Emily R.", rating: 4, comment: "Made me reflect on my mental health in a meaningful way.", tag: "Reflective" },
  { name: "Michael T.", rating: 5, comment: "Accurate assessment that matched what my therapist later confirmed.", tag: "Accurate" },
  { name: "Lisa P.", rating: 5, comment: "Felt supported throughout the process. Great resource.", tag: "Supportive" },
  { name: "David H.", rating: 4, comment: "Reassuring to have a starting point for understanding my symptoms.", tag: "Reassuring" }
];

const AssessmentTestTemplate = ({ config }: AssessmentTestTemplateProps) => {
  const navigate = useNavigate();
  const {
    testStarted,
    setTestStarted,
    currentQuestion,
    answers,
    showResults,
    showBookingForm,
    setShowBookingForm,
    pendingAction,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleRestart,
    handleContinueToBooking,
    handleJoinSupportGroup,
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

          {/* CTAs - show all 3 when user came from Mind-Check (no pendingAction) */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                onClick={handleContinueToBooking}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Book a Therapy Session
              </Button>
              <Button 
                size="lg"
                variant="secondary"
                onClick={handleJoinSupportGroup}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Join a Support Group
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/services")}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Explore Resources
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Test
              </Button>
            </div>
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
                  <p className="text-muted-foreground mb-4">
                    {config.description}
                  </p>
                  
                  {/* What this test covers */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Clinically-informed questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{config.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Instant results</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Personalized guidance</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> This test is for educational purposes only and is not a diagnostic tool. 
                      Please consult a healthcare professional for a proper diagnosis.
                    </p>
                  </div>

                  {/* Privacy notice */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-6 text-left">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <strong>Privacy:</strong> Your answers are completely confidential. Results are not stored or shared with anyone. 
                        Only you can see your results.
                      </p>
                    </div>
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

                  {/* Question with animation */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="mb-8"
                    >
                      <h3 className="text-xl md:text-2xl font-semibold mb-6">
                        {config.questions[currentQuestion].question}
                      </h3>
                      <RadioGroup
                        key={`question-${currentQuestion}`}
                        value={answers[config.questions[currentQuestion].id]?.toString()}
                        onValueChange={(value) => handleAnswer(config.questions[currentQuestion].id, parseInt(value))}
                        className="space-y-3"
                      >
                        {config.questions[currentQuestion].options.map((option) => (
                          <div 
                            key={option.value} 
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              answers[config.questions[currentQuestion].id] === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30 hover:bg-muted/50'
                            }`}
                            onClick={() => handleAnswer(config.questions[currentQuestion].id, parseInt(option.value.toString()))}
                          >
                            <RadioGroupItem 
                              value={option.value.toString()} 
                              id={`q${currentQuestion}-opt-${option.value}`} 
                            />
                            <Label 
                              htmlFor={`q${currentQuestion}-opt-${option.value}`} 
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  </AnimatePresence>

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

      {/* Signs & Symptoms Section */}
      {config.symptoms && config.symptoms.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Signs & Symptoms of {config.title}</h2>
              </div>
              
              <p className="text-muted-foreground mb-8 text-lg">
                {config.aboutText || `Understanding the signs and symptoms of ${config.title.toLowerCase()} is essential for early recognition and seeking appropriate support. If you identify with several of these symptoms, consider speaking with a mental health professional.`}
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {config.symptoms.map((symptom, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{symptom.title}</h3>
                      <p className="text-sm text-muted-foreground">{symptom.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Diagnosis & Treatment Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Understanding & Treatment</h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                {config.title} is a recognized condition that responds well to professional treatment. Early intervention 
                can significantly improve outcomes and quality of life. Treatment approaches are tailored to each 
                individual's unique needs and circumstances.
              </p>
            </div>

            {config.treatmentApproaches && config.treatmentApproaches.length > 0 ? (
              <div className="space-y-4 mb-8">
                {config.treatmentApproaches.map((approach, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-2">{approach.title}</h4>
                      <p className="text-muted-foreground text-sm">{approach.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">Psychotherapy</h4>
                    <p className="text-muted-foreground text-sm">
                      Talk therapy, including Cognitive Behavioral Therapy (CBT), helps identify and change unhelpful thought patterns and behaviors.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">Support Groups</h4>
                    <p className="text-muted-foreground text-sm">
                      Connecting with others who share similar experiences provides validation, coping strategies, and a sense of community.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">Lifestyle Changes</h4>
                    <p className="text-muted-foreground text-sm">
                      Regular exercise, healthy sleep habits, balanced nutrition, and stress management techniques complement professional treatment.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2">Professional Evaluation</h4>
                    <p className="text-muted-foreground text-sm">
                      A thorough assessment by a qualified mental health professional ensures accurate diagnosis and an effective treatment plan.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800">
                <strong>{config.title} is treatable.</strong> With the right support and evidence-based interventions, 
                individuals can experience significant improvement. If you or someone you know may be affected, 
                reaching out to a healthcare professional is the first step toward recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">When to Seek Help</h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Recognizing when to seek professional help is crucial for your wellbeing. 
                Early intervention can prevent symptoms from worsening and help you get back on track.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                {(config.whenToSeekHelp || [
                  "Your symptoms persist for more than two weeks",
                  "Difficulty functioning at work, school, or in relationships",
                  "Loss of interest in activities you once enjoyed",
                  "Significant changes in sleep, appetite, or energy levels",
                  "Feelings of hopelessness or that things won't improve",
                  "Thoughts of self-harm or harming others"
                ]).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="text-xl font-bold mb-4">Crisis Resources</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { name: "National Suicide Prevention Lifeline", contact: "988" },
                { name: "National Alliance on Mental Illness (NAMI)", contact: "1-800-950-6264" },
                { name: "Crisis Text Line", contact: "Text HOME to 741741" },
                { name: "Innerspark Emergency Support", contact: "+256 792 085773" }
              ].map((resource, index) => (
                <Card key={index} className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">{resource.name}</h4>
                    <p className="text-primary font-medium">{resource.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className={`${config.heroGradient} rounded-xl p-8 text-white text-center`}>
              <p className="text-lg mb-2">
                Seeking help is a sign of strength, not weakness.
              </p>
              <p className="text-white/80">
                With the right support and treatment, you can manage your symptoms and lead a fulfilling life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know */}
      {config.didYouKnow && (
        <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Did you know?</h2>
              <p className="text-xl text-indigo-100">{config.didYouKnow}</p>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Reviews for this {config.title} Test</h2>
              <p className="text-muted-foreground">All reviews have been submitted by users after completing the test.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-3xl font-bold">4.6</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400/50'}`} />
                  ))}
                </div>
                <span className="text-muted-foreground">({genericReviews.length} reviews)</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {genericReviews.map((review, index) => (
                <div key={index} className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{review.tag}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">"{review.comment}"</p>
                  <p className="text-xs font-medium">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <BookingFormModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        formType={pendingAction === "group" ? "group" : "book"}
      />
    </div>
  );
};

export default AssessmentTestTemplate;
