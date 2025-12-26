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
  "I have intense fears of being abandoned by those close to me.",
  "My relationships tend to be unstable and intense, swinging between extremes.",
  "I have an unstable sense of who I am or what I want.",
  "I engage in impulsive behaviors that could be harmful (spending, substance use, reckless driving).",
  "I have recurring thoughts of self-harm or suicidal behavior.",
  "My moods can change rapidly within hours or days.",
  "I often feel empty inside.",
  "I have difficulty controlling intense anger.",
  "During times of stress, I feel disconnected from reality or suspicious of others.",
  "I idealize people at first but then become disappointed in them quickly."
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Quite a bit" },
  { value: "4", label: "Extremely" }
];

const reviews = [
  { name: "Rachel M.", rating: 5, text: "This test helped me understand patterns I've struggled with for years. Very insightful.", tags: ["Insightful", "Helpful"] },
  { name: "David K.", rating: 5, text: "Accurate and compassionate. It gave me the push to seek professional help.", tags: ["Accurate", "Supportive"] },
  { name: "Emma T.", rating: 4, text: "The questions really captured my experiences. Feeling validated.", tags: ["Validating", "Reflective"] },
  { name: "Michael R.", rating: 5, text: "Very thorough assessment. It opened my eyes to seek proper treatment.", tags: ["Thorough", "Enlightening"] }
];

const BorderlinePersonalityTest = () => {
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
    if (score <= 10) {
      return {
        level: "Low",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Your responses suggest minimal BPD-related symptoms. Continue practicing healthy coping strategies."
      };
    } else if (score <= 20) {
      return {
        level: "Mild",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: "You may be experiencing some BPD-related symptoms. Consider speaking with a mental health professional for guidance."
      };
    } else if (score <= 30) {
      return {
        level: "Moderate",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Your responses indicate moderate BPD-related symptoms. We recommend consulting with a mental health professional."
      };
    } else {
      return {
        level: "High",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Your responses suggest significant BPD-related symptoms. Please consider seeking help from a qualified mental health professional."
      };
    }
  };

  const score = calculateScore();
  const result = getResultInterpretation(score);

  return (
    <>
      <Helmet>
        <title>Borderline Personality Disorder Test | Free BPD Assessment | Innerspark</title>
        <meta name="description" content="Take our free Borderline Personality Disorder test. Get instant confidential results and learn about BPD symptoms, diagnosis, and treatment options." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-purple-200 text-sm uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">BORDERLINE PERSONALITY DISORDER</h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
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
                  <p className="text-lg text-muted-foreground mb-4">Score: {score} out of 40</p>
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
                <h2 className="text-3xl font-bold text-foreground">Signs & Symptoms of BPD</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>Borderline Personality Disorder (BPD) is a mental health condition characterized by patterns of instability in moods, behavior, self-image, and functioning. These patterns often result in impulsive actions and unstable relationships.</p>
                <p className="mt-4">Common symptoms include:</p>
                <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
                  {[
                    "Intense fear of abandonment",
                    "Unstable and intense relationships",
                    "Unclear or shifting self-image",
                    "Impulsive, risky behaviors",
                    "Self-harming behavior",
                    "Extreme mood swings",
                    "Chronic feelings of emptiness",
                    "Explosive anger",
                    "Paranoia or dissociation under stress"
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
                <p>BPD is typically diagnosed by a mental health professional through clinical interviews and assessment of symptoms against established diagnostic criteria.</p>
                <p className="mt-4">Effective treatments include:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Dialectical Behavior Therapy (DBT)</h3>
                    <p className="text-sm">The gold standard treatment, focusing on mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Mentalization-Based Therapy</h3>
                    <p className="text-sm">Helps individuals better understand their own and others' mental states and emotions.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Schema-Focused Therapy</h3>
                    <p className="text-sm">Addresses deep-rooted patterns and helps develop healthier ways of thinking and behaving.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Medication</h3>
                    <p className="text-sm">While no medication specifically treats BPD, some can help manage specific symptoms like mood swings or depression.</p>
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
                  <li>Frequent, intense mood swings affecting your daily life</li>
                  <li>Unstable relationships that follow a pattern of idealization and devaluation</li>
                  <li>Chronic feelings of emptiness or identity confusion</li>
                  <li>Impulsive behaviors that put you at risk</li>
                  <li>Thoughts of self-harm or suicide</li>
                </ul>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-red-800 mb-2">Crisis Resources</h3>
                  <p className="text-red-700 text-sm">If you're in crisis, please reach out immediately:</p>
                  <ul className="text-red-700 text-sm mt-2">
                    <li>National Suicide Prevention Lifeline: 988</li>
                    <li>Crisis Text Line: Text HOME to 741741</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Did You Know */}
            <section className="bg-primary/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Did you know?</h3>
              <p className="text-muted-foreground">BPD affects approximately 1.4% of the adult U.S. population. With proper treatment, many people with BPD experience significant improvement and can lead fulfilling lives.</p>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Reviews for this BPD Test</h2>
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

export default BorderlinePersonalityTest;
