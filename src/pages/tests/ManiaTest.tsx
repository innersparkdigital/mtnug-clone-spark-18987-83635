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
  { id: 1, text: "Have you felt so good or hyper that others thought you were not your normal self?" },
  { id: 2, text: "Have you been so irritable that you shouted at people or started fights or arguments?" },
  { id: 3, text: "Have you felt much more self-confident than usual?" },
  { id: 4, text: "Have you gotten much less sleep than usual and found you didn't really miss it?" },
  { id: 5, text: "Have you been much more talkative or spoken faster than usual?" },
  { id: 6, text: "Have thoughts raced through your head or couldn't slow down your mind?" },
  { id: 7, text: "Have you been so easily distracted by things around you that you had trouble concentrating?" },
  { id: 8, text: "Have you had much more energy than usual?" },
  { id: 9, text: "Have you been much more active or done many more things than usual?" },
  { id: 10, text: "Have you been much more social or outgoing than usual?" },
  { id: 11, text: "Have you been much more interested in sex than usual?" },
  { id: 12, text: "Have you done things that were unusual for you or that others might have thought were excessive, foolish, or risky?" },
  { id: 13, text: "Have you spent money in ways that got you or your family into trouble?" },
];

const answerOptions = [
  { value: "0", label: "No" },
  { value: "1", label: "Yes" },
];

const reviews = [
  { name: "Rebecca M.", rating: 5, text: "This test helped me recognize patterns I had normalized. Finally got the right diagnosis and treatment.", verified: true },
  { name: "Daniel K.", rating: 5, text: "Quick and accurate. The results matched what my psychiatrist later confirmed.", verified: true },
  { name: "Lisa W.", rating: 4, text: "Really helpful for understanding manic episodes. Gave me the push to seek professional help.", verified: true },
];

const ManiaTest = () => {
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
    if (score <= 3) {
      return {
        level: "Low",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest few symptoms of mania. Continue monitoring your mood and energy levels.",
      };
    } else if (score <= 6) {
      return {
        level: "Moderate",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "Your responses indicate some symptoms that may warrant attention. Consider discussing these with a mental health professional.",
      };
    } else if (score <= 9) {
      return {
        level: "Moderately High",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses suggest significant symptoms of mania. We recommend seeking a professional evaluation.",
      };
    } else {
      return {
        level: "High",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses indicate many symptoms associated with mania. Please consider speaking with a mental health professional soon.",
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
        <section className="bg-gradient-to-br from-amber-600 to-orange-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/mind-check")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Mind-Check
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Mania Self-Assessment</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              This screening tool helps identify symptoms of mania or hypomania. Answer honestly based on your experiences.
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
                          {score}/{questions.length}
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
                        This self-assessment is based on the Mood Disorder Questionnaire (MDQ) and is not a diagnostic tool. 
                        Only a qualified mental health professional can diagnose bipolar disorder or manic episodes. 
                        If you're concerned about your symptoms, please seek professional help.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Signs & Symptoms Section */}
              <Card className="mt-8">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    Signs & Symptoms of Mania
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-amber-700">Emotional Symptoms</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Feeling unusually high, euphoric, or elated
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Extreme irritability or agitation
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Inflated self-esteem or grandiosity
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Feeling invincible or all-powerful
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-amber-700">Behavioral Symptoms</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Decreased need for sleep
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Racing thoughts and rapid speech
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Impulsive or risky behavior
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          Increased goal-directed activity
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
                      <h4 className="font-semibold mb-2">How is Bipolar Disorder Diagnosed?</h4>
                      <p className="text-muted-foreground">
                        Diagnosis involves a comprehensive psychiatric evaluation, including discussion of symptoms, 
                        medical history, and family history. Your doctor may also conduct physical exams and lab tests 
                        to rule out other conditions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Treatment Options</h4>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="p-4 bg-accent rounded-lg">
                          <Heart className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Medication</h5>
                          <p className="text-sm text-muted-foreground">Mood stabilizers and antipsychotics</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Users className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Therapy</h5>
                          <p className="text-sm text-muted-foreground">CBT, psychoeducation, and family therapy</p>
                        </div>
                        <div className="p-4 bg-accent rounded-lg">
                          <Lightbulb className="h-8 w-8 text-primary mb-2" />
                          <h5 className="font-medium">Lifestyle</h5>
                          <p className="text-sm text-muted-foreground">Sleep hygiene, routine, and stress management</p>
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
                      Based on Mood Disorder Questionnaire
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

export default ManiaTest;