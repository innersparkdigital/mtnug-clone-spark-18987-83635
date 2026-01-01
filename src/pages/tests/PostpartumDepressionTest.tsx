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
  { id: 1, text: "I have been able to laugh and see the funny side of things" },
  { id: 2, text: "I have looked forward with enjoyment to things" },
  { id: 3, text: "I have blamed myself unnecessarily when things went wrong" },
  { id: 4, text: "I have been anxious or worried for no good reason" },
  { id: 5, text: "I have felt scared or panicky for no good reason" },
  { id: 6, text: "Things have been getting on top of me" },
  { id: 7, text: "I have been so unhappy that I have had difficulty sleeping" },
  { id: 8, text: "I have felt sad or miserable" },
  { id: 9, text: "I have been so unhappy that I have been crying" },
  { id: 10, text: "The thought of harming myself has occurred to me" },
];

const answerOptionsPositive = [
  { value: "0", label: "As much as I always could" },
  { value: "1", label: "Not quite so much now" },
  { value: "2", label: "Definitely not so much now" },
  { value: "3", label: "Not at all" },
];

const answerOptionsNegative = [
  { value: "0", label: "No, never" },
  { value: "1", label: "Hardly ever" },
  { value: "2", label: "Yes, sometimes" },
  { value: "3", label: "Yes, very often" },
];

const reviews = [
  { name: "Amanda P.", rating: 5, text: "This test helped me realize what I was feeling wasn't just 'baby blues'. I got help and feel so much better now.", verified: true },
  { name: "Michelle K.", rating: 5, text: "Quick, easy, and eye-opening. Encouraged me to talk to my doctor about my feelings.", verified: true },
  { name: "Sarah J.", rating: 4, text: "Validated what I was experiencing. The resources provided were incredibly helpful.", verified: true },
];

const PostpartumDepressionTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTherapistPopup, setShowTherapistPopup] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getAnswerOptions = (questionId: number) => {
    // Questions 1, 2 use positive scoring (reversed)
    // Questions 3-10 use negative scoring
    if (questionId <= 2) {
      return answerOptionsPositive;
    }
    return answerOptionsNegative;
  };

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
    if (score <= 8) {
      return {
        level: "Low",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest you're coping well. However, if you're struggling, don't hesitate to seek support.",
      };
    } else if (score <= 12) {
      return {
        level: "Possible Depression",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "Your responses suggest you may be experiencing some symptoms of depression. Consider speaking with your healthcare provider.",
      };
    } else if (score <= 19) {
      return {
        level: "Likely Depression",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses indicate you may be experiencing postpartum depression. We recommend speaking with a healthcare professional soon.",
      };
    } else {
      return {
        level: "Significant Symptoms",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses suggest significant symptoms that require immediate attention. Please reach out to a healthcare provider or mental health professional today.",
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
        <section className="bg-gradient-to-br from-pink-500 to-rose-600 text-white py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/mind-check")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Mind-Check
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Postpartum Depression Screening</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              This screening tool helps identify symptoms of postpartum depression. Answer based on how you have felt in the past 7 days.
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

                    <p className="text-sm text-muted-foreground mb-2">In the past 7 days...</p>
                    <h2 className="text-xl font-semibold mb-6">
                      {questions[currentQuestion].text}
                    </h2>

                    <RadioGroup
                      value={answers[questions[currentQuestion].id] || ""}
                      onValueChange={handleAnswer}
                      className="space-y-3"
                    >
                      {getAnswerOptions(questions[currentQuestion].id).map((option) => (
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
                          {score}/30
                        </div>
                        <div>
                          <div className={`text-lg font-semibold ${result.color}`}>
                            {result.level}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Based on your responses
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{result.description}</p>
                      
                      {/* Special warning for question 10 */}
                      {answers[10] && parseInt(answers[10]) > 0 && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                          <p className="text-red-700 font-medium">
                            ⚠️ You indicated thoughts of self-harm. Please reach out to a healthcare provider or crisis line immediately.
                          </p>
                        </div>
                      )}
                      
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
                        This screening is based on the Edinburgh Postnatal Depression Scale (EPDS). 
                        It is not a diagnostic tool. Only a qualified healthcare professional can diagnose 
                        postpartum depression. If you're concerned, please speak with your doctor or midwife.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Signs & Symptoms Section */}
              <Card className="mt-8">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-pink-600" />
                    Signs & Symptoms of Postpartum Depression
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-pink-700">Emotional Symptoms</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Persistent sadness or low mood
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Feeling disconnected from your baby
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Overwhelming guilt or worthlessness
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Anxiety or panic attacks
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-pink-700">Physical Symptoms</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Difficulty sleeping (even when baby sleeps)
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Changes in appetite
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Low energy and fatigue
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          Difficulty concentrating
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
                      <h4 className="font-semibold mb-2">How is PPD Diagnosed?</h4>
                      <p className="text-muted-foreground">
                        Diagnosis involves screening questionnaires and clinical evaluation by your healthcare 
                        provider. They will assess your symptoms, medical history, and rule out other conditions 
                        like thyroid disorders that can mimic depression.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Treatment Options</h4>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="p-4 bg-accent rounded-lg">
                          <Heart className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Therapy</h5>
                          <p className="text-sm text-muted-foreground">CBT and interpersonal therapy</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Users className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Support Groups</h5>
                          <p className="text-sm text-muted-foreground">Connect with other mothers</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Lightbulb className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Medication</h5>
                          <p className="text-sm text-muted-foreground">Safe options for breastfeeding</p>
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
                      Based on Edinburgh Postnatal Depression Scale
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Takes 3-5 minutes to complete
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
                    If you're having thoughts of harming yourself or your baby, please reach out immediately.
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

export default PostpartumDepressionTest;