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
  "I am terrified about being overweight.",
  "I avoid eating when I am hungry.",
  "I find myself preoccupied with food.",
  "I have gone on eating binges where I feel I cannot stop.",
  "I cut my food into small pieces.",
  "I am aware of the calorie content of foods I eat.",
  "I particularly avoid foods with high carbohydrate content.",
  "I feel that others would prefer if I ate more.",
  "I vomit after I have eaten.",
  "I feel extremely guilty after eating.",
  "I am preoccupied with a desire to be thinner.",
  "I think about burning up calories when I exercise.",
  "Other people think I am too thin.",
  "I am preoccupied with the thought of having fat on my body.",
  "I take longer than others to eat my meals."
];

const answerOptions = [
  { value: "0", label: "Never" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very Often" },
  { value: "5", label: "Always" }
];

const reviews = [
  { name: "Jessica L.", rating: 5, text: "This test helped me realize I needed help. It was the first step in my recovery journey.", tags: ["Life-changing", "Supportive"] },
  { name: "Amanda K.", rating: 5, text: "Very comprehensive questions that captured my struggles with food.", tags: ["Accurate", "Helpful"] },
  { name: "Chris M.", rating: 4, text: "I didn't realize how many of these behaviors I had. Eye-opening assessment.", tags: ["Enlightening", "Reflective"] },
  { name: "Sarah W.", rating: 5, text: "Compassionate and non-judgmental. Helped me understand I'm not alone.", tags: ["Compassionate", "Validating"] }
];

const EatingDisorderTest = () => {
  const navigate = useNavigate();
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showResults, setShowResults] = useState(false);
  const [showTherapistPopup, setShowTherapistPopup] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleRestart = () => {
    setTestStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(""));
  };

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
    if (score <= 15) {
      return {
        level: "Low Risk",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest minimal eating disorder symptoms. Continue maintaining a healthy relationship with food."
      };
    } else if (score <= 30) {
      return {
        level: "Mild Concern",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "You may have some concerns about eating behaviors. Consider speaking with a healthcare provider for guidance."
      };
    } else if (score <= 45) {
      return {
        level: "Moderate Concern",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses indicate moderate eating-related concerns. We recommend consulting with a mental health professional."
      };
    } else {
      return {
        level: "High Concern",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses suggest significant eating disorder symptoms. Please seek help from a qualified healthcare professional."
      };
    }
  };

  const score = calculateScore();
  const result = getResultInterpretation(score);

  return (
    <>
      <Helmet>
        <title>Eating Disorder Test | Free Assessment | Innerspark</title>
        <meta name="description" content="Take our free eating disorder screening test. Get instant confidential results and learn about eating disorder symptoms, types, and treatment options." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-rose-900 via-pink-800 to-red-900 text-white overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-pink-200 text-sm uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE AN</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">EATING DISORDER</h1>
            <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
              Take this mental health test. It's quick, free, and you'll get your confidential results instantly.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {!testStarted && !showResults ? (
            /* Start Test Card */
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-xl border-0">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-rose-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Eating Disorder Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    This screening test helps identify patterns associated with eating disorders.
                    Answer each question honestly based on your experiences.
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
                    className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 text-lg"
                  >
                    Start Test <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : !showResults ? (
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
                  <p className="text-lg text-muted-foreground mb-4">Score: {score} out of 75</p>
                  <p className="text-foreground max-w-2xl mx-auto">{result.description}</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate("/find-therapist")} className="bg-primary hover:bg-primary/90">
                      Find a Therapist
                    </Button>
                    <Button variant="outline" onClick={handleRestart}>
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
                <h2 className="text-3xl font-bold text-foreground">Signs & Symptoms of Eating Disorders</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>Eating disorders are serious mental health conditions characterized by severe disturbances in eating behaviors and related thoughts and emotions. They can affect physical health, emotions, and ability to function in important areas of life.</p>
                <p className="mt-4">Common types include:</p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Anorexia Nervosa</h3>
                    <p className="text-sm">Characterized by weight loss, difficulty maintaining appropriate body weight, and distorted body image.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Bulimia Nervosa</h3>
                    <p className="text-sm">Involves cycles of binge eating followed by compensatory behaviors like purging or excessive exercise.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Binge Eating Disorder</h3>
                    <p className="text-sm">Recurring episodes of eating large quantities of food, often quickly and to the point of discomfort.</p>
                  </Card>
                </div>
                <p className="mt-6">Warning signs include:</p>
                <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
                  {[
                    "Preoccupation with weight, food, and dieting",
                    "Refusal to eat certain foods or food groups",
                    "Discomfort eating around others",
                    "Food rituals (excessive chewing, not allowing foods to touch)",
                    "Skipping meals or eating small portions",
                    "Withdrawal from friends and activities",
                    "Extreme concern with body size and shape",
                    "Frequent checking in the mirror"
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
                <p>Eating disorders require professional diagnosis and treatment. Early intervention significantly improves outcomes.</p>
                <p className="mt-4">Treatment often involves a multidisciplinary approach:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Psychotherapy</h3>
                    <p className="text-sm">Cognitive Behavioral Therapy (CBT), Family-Based Treatment (FBT), and other therapies address thoughts and behaviors around food.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Nutritional Counseling</h3>
                    <p className="text-sm">Working with dietitians to develop healthy eating patterns and repair the relationship with food.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Medical Monitoring</h3>
                    <p className="text-sm">Regular health check-ups to address physical complications of eating disorders.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Support Groups</h3>
                    <p className="text-sm">Connecting with others who understand the challenges of recovery provides valuable support.</p>
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
                <p>Seek professional help if you or someone you know experiences:</p>
                <ul className="space-y-2 mt-4">
                  <li>Preoccupation with weight, food, or body image that affects daily life</li>
                  <li>Significant changes in eating patterns or weight</li>
                  <li>Using food restriction, purging, or excessive exercise to control weight</li>
                  <li>Feeling out of control around food</li>
                  <li>Physical symptoms like dizziness, fatigue, or fainting</li>
                </ul>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-red-800 mb-2">Crisis Resources</h3>
                  <p className="text-red-700 text-sm">If you're in crisis, please reach out immediately:</p>
                  <ul className="text-red-700 text-sm mt-2">
                    <li>National Eating Disorders Association Helpline: 1-800-931-2237</li>
                    <li>Crisis Text Line: Text "NEDA" to 741741</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Did You Know */}
            <section className="bg-primary/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Did you know?</h3>
              <p className="text-muted-foreground">Eating disorders affect at least 9% of the population worldwide and are among the deadliest mental illnesses, second only to opioid overdose. However, with proper treatment, full recovery is possible.</p>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Reviews for this Eating Disorder Test</h2>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold">4.8</span>
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

export default EatingDisorderTest;
