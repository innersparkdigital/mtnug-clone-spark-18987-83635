import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Brain, AlertCircle, Heart, Users, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TherapistCTAPopup from "@/components/TherapistCTAPopup";

const questions = [
  "Have you become restless, irritable, or anxious when trying to stop or cut down on gambling?",
  "Have you tried to keep your family or friends from knowing how much you gamble?",
  "Do you gamble to escape from problems or feelings of helplessness, guilt, or depression?",
  "Have you risked or lost a significant relationship, job, or opportunity because of gambling?",
  "Have you ever borrowed money or sold anything to get money to gamble?",
  "Have you felt the need to gamble with increasing amounts of money to achieve the excitement you desire?",
  "Have you made repeated unsuccessful efforts to control, cut back, or stop gambling?",
  "Do you often think about gambling (planning the next venture, thinking of ways to get money)?",
  "After losing money gambling, do you often return another day to try to win back your losses?",
  "Have you committed or considered committing illegal acts to finance gambling?"
];

const answerOptions = [
  { value: "0", label: "Never" },
  { value: "1", label: "Sometimes" },
  { value: "2", label: "Most of the time" },
  { value: "3", label: "Almost always" }
];

const reviews = [
  { name: "Robert J.", rating: 5, text: "This test made me realize my gambling had become a serious problem. Thank you for the wake-up call.", tags: ["Eye-opening", "Helpful"] },
  { name: "Linda S.", rating: 5, text: "Very accurate questions. It helped me understand the severity of my situation.", tags: ["Accurate", "Insightful"] },
  { name: "Marcus T.", rating: 4, text: "The test was straightforward and helped me see patterns I was ignoring.", tags: ["Reflective", "Honest"] },
  { name: "Diana R.", rating: 5, text: "Non-judgmental assessment that encouraged me to seek help. Very grateful.", tags: ["Supportive", "Compassionate"] }
];

const GamblingAddictionTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showResults, setShowResults] = useState(false);
  const [showTherapistPopup, setShowTherapistPopup] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setShowTherapistPopup(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + parseInt(answer || "0"), 0);
  };

  const getResultInterpretation = (score: number) => {
    if (score <= 5) {
      return {
        level: "No Problem Gambling",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest no significant gambling problems. Continue gambling responsibly if you choose to gamble."
      };
    } else if (score <= 12) {
      return {
        level: "At-Risk Gambling",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "You may be at risk for developing gambling problems. Consider setting limits on your gambling activities."
      };
    } else if (score <= 20) {
      return {
        level: "Problem Gambling",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses indicate problem gambling behavior. We recommend speaking with a professional for support."
      };
    } else {
      return {
        level: "Severe Gambling Problem",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses suggest a severe gambling problem. Please seek help from a qualified addiction specialist or counselor."
      };
    }
  };

  const score = calculateScore();
  const result = getResultInterpretation(score);

  return (
    <>
      <Helmet>
        <title>Gambling Addiction Test | Free Assessment | Innerspark</title>
        <meta name="description" content="Take our free gambling addiction screening test. Get instant confidential results and learn about problem gambling signs, symptoms, and treatment options." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900 text-white overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-amber-200 text-sm uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE A</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">GAMBLING ADDICTION</h1>
            <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
              Take this mental health test. It's quick, free, and you'll get your confidential results instantly.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {!showResults ? (
            /* Assessment Section */
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
                      <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <h2 className="text-xl md:text-2xl font-semibold mb-8 text-foreground">
                    {questions[currentQuestion]}
                  </h2>

                  <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer} className="space-y-4">
                    {answerOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <Button onClick={handleNext} disabled={!answers[currentQuestion]} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      {currentQuestion === questions.length - 1 ? "See Results" : "Next"} <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Results Section */
            <div className="max-w-4xl mx-auto">
              <Card className={`shadow-xl border-0 ${result.bgColor} mb-8`}>
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Your Results</h2>
                  <div className={`text-5xl font-bold ${result.color} mb-4`}>{result.level}</div>
                  <p className="text-lg text-muted-foreground mb-4">Score: {score} out of 30</p>
                  <p className="text-foreground max-w-2xl mx-auto">{result.description}</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate("/find-therapist")} className="bg-primary hover:bg-primary/90">
                      Find a Therapist
                    </Button>
                    <Button variant="outline" onClick={() => { setShowResults(false); setCurrentQuestion(0); setAnswers(Array(questions.length).fill("")); }}>
                      Retake Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Information Sections */}
          <div className="max-w-4xl mx-auto mt-16 space-y-16">
            {/* Signs & Symptoms */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Brain className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Signs & Symptoms of Gambling Addiction</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>Gambling addiction, also known as gambling disorder or compulsive gambling, is an impulse-control disorder. It's characterized by a persistent and recurring urge to gamble despite negative consequences on personal, financial, and social well-being.</p>
                <p className="mt-4">Warning signs include:</p>
                <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
                  {[
                    "Preoccupation with gambling",
                    "Needing to gamble with increasing amounts",
                    "Failed attempts to control or stop gambling",
                    "Restlessness when trying to cut down",
                    "Gambling to escape problems or relieve stress",
                    "Chasing losses",
                    "Lying about gambling extent",
                    "Jeopardizing relationships or career",
                    "Borrowing money to gamble",
                    "Feeling helpless to stop"
                  ].map((symptom, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Diagnosis & Treatment */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Diagnosis & Treatment</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>Gambling disorder is diagnosed when gambling behavior causes significant problems or distress. A mental health professional can help assess the severity and develop an appropriate treatment plan.</p>
                <p className="mt-4">Effective treatments include:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Cognitive Behavioral Therapy (CBT)</h3>
                    <p className="text-sm">Helps identify and change unhealthy gambling behaviors and thoughts, teaching coping skills to fight urges.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Gamblers Anonymous</h3>
                    <p className="text-sm">A 12-step program similar to AA that provides peer support and accountability for recovery.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Financial Counseling</h3>
                    <p className="text-sm">Addresses the financial consequences of gambling and helps develop strategies to manage debt.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Family Therapy</h3>
                    <p className="text-sm">Helps repair relationships damaged by gambling and builds a supportive recovery environment.</p>
                  </Card>
                </div>
              </div>
            </section>

            {/* When to Seek Help */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">When to Seek Help</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>Seek professional help if you experience:</p>
                <ul className="space-y-2 mt-4">
                  <li>Inability to control your gambling despite trying to stop</li>
                  <li>Financial problems due to gambling</li>
                  <li>Relationship issues caused by gambling behavior</li>
                  <li>Lying to cover up your gambling</li>
                  <li>Feeling anxious, depressed, or irritable when not gambling</li>
                </ul>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-red-800 mb-2">Crisis Resources</h3>
                  <p className="text-red-700 text-sm">If you're in crisis, please reach out immediately:</p>
                  <ul className="text-red-700 text-sm mt-2">
                    <li>National Problem Gambling Helpline: 1-800-522-4700</li>
                    <li>Available 24/7, 365 days a year</li>
                    <li>Text or Chat: ncpgambling.org/chat</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Did You Know */}
            <section className="bg-primary/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Did you know?</h3>
              <p className="text-muted-foreground">About 2-3% of adults in the U.S. meet criteria for gambling disorder. Problem gambling can affect anyone regardless of age, gender, or background. The earlier treatment begins, the better the outcomes for recovery.</p>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Reviews for this Gambling Addiction Test</h2>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold">4.7</span>
                <span className="text-muted-foreground">{reviews.length} reviews</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-3">"{review.text}"</p>
                    <p className="font-semibold text-foreground mb-2">{review.name}</p>
                    <div className="flex gap-2">
                      {review.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Need help? We recommend these therapists</h2>
              <Button onClick={() => navigate("/find-therapist")} size="lg" className="bg-green-600 hover:bg-green-700">
                Find a Therapist <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      
      <TherapistCTAPopup 
        isOpen={showTherapistPopup} 
        onClose={() => setShowTherapistPopup(false)} 
      />
    </>
  );
};

export default GamblingAddictionTest;
