import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, RotateCcw, Star, CheckCircle2, AlertTriangle, Brain, Heart, Users, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TherapistCTAPopup from "@/components/TherapistCTAPopup";

const questions = [
  { id: 1, text: "Do you often feel that you are more special or unique than others?" },
  { id: 2, text: "Do you frequently fantasize about unlimited success, power, or brilliance?" },
  { id: 3, text: "Do you believe that you can only be understood by or associate with other special or high-status people?" },
  { id: 4, text: "Do you require excessive admiration from others?" },
  { id: 5, text: "Do you have a sense of entitlement and expect especially favorable treatment?" },
  { id: 6, text: "Do you often exploit others to achieve your own goals?" },
  { id: 7, text: "Do you lack empathy and have difficulty recognizing others' feelings and needs?" },
  { id: 8, text: "Are you often envious of others or believe that others are envious of you?" },
  { id: 9, text: "Do you display arrogant or haughty behaviors or attitudes?" },
  { id: 10, text: "Do you become angry or dismissive when you don't receive special treatment?" },
  { id: 11, text: "Do you have difficulty handling criticism or perceived slights?" },
  { id: 12, text: "Do you often exaggerate your achievements and talents?" },
  { id: 13, text: "Do you tend to monopolize conversations and belittle others?" },
  { id: 14, text: "Do you have difficulty maintaining healthy relationships?" },
  { id: 15, text: "Do you often feel secretly insecure despite projecting confidence?" },
];

const answerOptions = [
  { value: "0", label: "Rarely or never" },
  { value: "1", label: "Sometimes" },
  { value: "2", label: "Often" },
  { value: "3", label: "Very often or always" },
];

const reviews = [
  { name: "Michael T.", rating: 5, text: "This test opened my eyes to patterns I never recognized. It was the first step toward getting help.", verified: true },
  { name: "Jennifer R.", rating: 4, text: "Very insightful questions. Helped me understand why my relationships were struggling.", verified: true },
  { name: "David L.", rating: 5, text: "Accurate and thought-provoking. Encouraged me to seek professional evaluation.", verified: true },
];

const NarcissisticPersonalityTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTherapistPopup, setShowTherapistPopup] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
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

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowTherapistPopup(false);
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
  };

  const getResultInterpretation = (score: number) => {
    const maxScore = questions.length * 3;
    const percentage = (score / maxScore) * 100;

    if (percentage <= 25) {
      return {
        level: "Low",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest few narcissistic traits. Everyone has some self-focused tendencies, which is normal and healthy.",
      };
    } else if (percentage <= 50) {
      return {
        level: "Moderate",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "Your responses indicate some narcissistic traits. While not necessarily problematic, consider reflecting on how these may affect your relationships.",
      };
    } else if (percentage <= 75) {
      return {
        level: "Elevated",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses suggest elevated narcissistic traits that may be impacting your relationships. Consider speaking with a mental health professional.",
      };
    } else {
      return {
        level: "High",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses indicate significant narcissistic traits. We recommend seeking a professional evaluation to better understand these patterns.",
      };
    }
  };

  const score = calculateScore();
  const result = getResultInterpretation(score);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/mind-check")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Mind-Check
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Narcissistic Personality Assessment</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              This screening tool helps identify traits associated with narcissistic personality patterns. Answer honestly based on your typical behavior.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {!showResults ? (
                <Card className="shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <h2 className="text-xl font-semibold mb-6">
                      {questions[currentQuestion].text}
                    </h2>

                    <RadioGroup
                      value={answers[questions[currentQuestion].id] || ""}
                      onValueChange={handleAnswer}
                      className="space-y-3"
                    >
                      {answerOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!answers[questions[currentQuestion].id]}
                      >
                        {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className={`shadow-lg ${result.bgColor}`}>
                    <CardContent className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`text-4xl font-bold ${result.color}`}>
                          {score}/{questions.length * 3}
                        </div>
                        <div>
                          <div className={`text-lg font-semibold ${result.color}`}>
                            {result.level} Indication
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Based on your responses
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{result.description}</p>
                      
                      <div className="flex gap-4 mt-6">
                        <Button onClick={handleRestart} variant="outline">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Retake Test
                        </Button>
                        <Button onClick={() => navigate("/find-therapist")}>
                          Find a Specialist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Important Note</h3>
                      <p className="text-muted-foreground">
                        This self-assessment is a screening tool and is not a diagnostic instrument. 
                        Only a qualified mental health professional can diagnose narcissistic personality disorder. 
                        If you're concerned about these patterns, please seek professional guidance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Signs & Symptoms Section */}
              <Card className="mt-8">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-indigo-600" />
                    Signs & Symptoms of NPD
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-indigo-700">Core Features</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Grandiose sense of self-importance
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Preoccupation with fantasies of success
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Need for excessive admiration
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Sense of entitlement
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-indigo-700">Interpersonal Patterns</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Exploitative relationships
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Lack of empathy for others
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Envy of others or believing others envy them
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          Arrogant behaviors and attitudes
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis & Treatment Section */}
              <Card className="mt-6">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    Diagnosis & Treatment
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">How is NPD Diagnosed?</h4>
                      <p className="text-muted-foreground">
                        Diagnosis requires a thorough evaluation by a mental health professional. It involves 
                        clinical interviews, behavioral assessments, and review of personal history and 
                        relationship patterns over time.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Treatment Options</h4>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="p-4 bg-accent rounded-lg">
                          <Heart className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Psychotherapy</h5>
                          <p className="text-sm text-muted-foreground">Talk therapy focused on self-awareness</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Users className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Group Therapy</h5>
                          <p className="text-sm text-muted-foreground">Learning interpersonal skills</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Lightbulb className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Skills Training</h5>
                          <p className="text-sm text-muted-foreground">Developing empathy and emotional regulation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About This Test</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Based on DSM-5 criteria
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Takes 5-7 minutes to complete
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Completely confidential
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Instant results
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">User Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{review.text}</p>
                        <p className="text-xs font-medium">{review.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    If you're experiencing a mental health crisis, please reach out for support.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => navigate("/emergency-support")}
                  >
                    Get Crisis Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <TherapistCTAPopup 
        isOpen={showTherapistPopup} 
        onClose={() => setShowTherapistPopup(false)} 
      />
    </div>
  );
};

export default NarcissisticPersonalityTest;