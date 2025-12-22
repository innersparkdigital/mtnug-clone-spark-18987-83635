import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart, 
  AlertCircle, 
  Phone, 
  Star, 
  ChevronRight,
  Clock,
  Shield,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Zap
} from "lucide-react";

const anxietyQuestions = [
  {
    id: 1,
    question: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 2,
    question: "Over the past 2 weeks, how often have you not been able to stop or control worrying?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 3,
    question: "Over the past 2 weeks, how often have you worried too much about different things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 4,
    question: "Over the past 2 weeks, how often have you had trouble relaxing?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 5,
    question: "Over the past 2 weeks, how often have you been so restless that it's hard to sit still?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 6,
    question: "Over the past 2 weeks, how often have you become easily annoyed or irritable?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 7,
    question: "Over the past 2 weeks, how often have you felt afraid as if something awful might happen?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 8,
    question: "Over the past 2 weeks, how often have you had difficulty concentrating due to worry?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 9,
    question: "Over the past 2 weeks, how often have you experienced physical symptoms like racing heart, sweating, or trembling?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 10,
    question: "Over the past 2 weeks, how often have you avoided situations because they made you anxious?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const reviews = [
  { name: "Anna L.", rating: 5, comment: "Really helped me understand my anxiety patterns.", tag: "Informative" },
  { name: "Robert M.", rating: 5, comment: "Quick and gave me the push to seek professional help.", tag: "Helpful" },
  { name: "Jessica T.", rating: 4, comment: "Made me realize I've been ignoring my symptoms.", tag: "Reflective" },
  { name: "Daniel K.", rating: 5, comment: "Accurate representation of my daily struggles.", tag: "Accurate" },
  { name: "Maria S.", rating: 5, comment: "Felt understood and not alone. Thank you.", tag: "Supportive" },
  { name: "Chris P.", rating: 4, comment: "Good starting point for understanding anxiety.", tag: "Reassuring" }
];

const symptoms = [
  { title: "Excessive Worry", description: "Persistent and uncontrollable worry about various aspects of life." },
  { title: "Restlessness", description: "Feeling keyed up, on edge, or unable to relax." },
  { title: "Fatigue", description: "Being easily tired due to constant mental strain." },
  { title: "Difficulty Concentrating", description: "Mind going blank or trouble focusing on tasks." },
  { title: "Irritability", description: "Being easily annoyed or frustrated." },
  { title: "Muscle Tension", description: "Physical tension in shoulders, neck, or jaw." },
  { title: "Sleep Problems", description: "Difficulty falling or staying asleep due to racing thoughts." },
  { title: "Physical Symptoms", description: "Racing heart, sweating, trembling, or shortness of breath." },
  { title: "Avoidance Behavior", description: "Avoiding situations that trigger anxiety." }
];

const AnxietyTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < anxietyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const getResultInterpretation = (score: number) => {
    if (score <= 4) {
      return {
        level: "Minimal",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Your responses suggest minimal anxiety symptoms. Continue practicing healthy coping strategies and self-care routines."
      };
    } else if (score <= 9) {
      return {
        level: "Mild",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Your responses suggest mild anxiety. Consider implementing relaxation techniques and monitoring your symptoms. If they persist, speaking with a professional may be helpful."
      };
    } else if (score <= 14) {
      return {
        level: "Moderate",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Your responses suggest moderate anxiety. We recommend consulting with a mental health professional for proper evaluation and guidance on treatment options."
      };
    } else if (score <= 19) {
      return {
        level: "Moderately Severe",
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Your responses suggest moderately severe anxiety. We strongly recommend seeking help from a mental health professional for a comprehensive evaluation and treatment plan."
      };
    } else {
      return {
        level: "Severe",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-300",
        description: "Your responses suggest severe anxiety symptoms. Please reach out to a mental health professional as soon as possible. Treatment is highly effective, and you don't have to manage this alone."
      };
    }
  };

  const progress = ((currentQuestion + 1) / anxietyQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Anxiety Test - Free Mental Health Screening | InnerSpark</title>
        <meta name="description" content="Take our free, confidential anxiety screening test (GAD-7 based). Get instant results and learn about symptoms, diagnosis, and treatment options for anxiety disorders." />
      </Helmet>
      
      <Header />
      
      <section className="relative bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-pink-200 text-sm font-medium uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">ANXIETY</h1>
            <p className="text-xl text-pink-100 mb-8">
              Take this mental health test. It's quick, free, and you'll get your confidential results instantly.
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
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-pink-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Anxiety Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    This screening test is based on the GAD-7, a widely-used tool for screening generalized anxiety disorder. 
                    Answer each question honestly based on how you've been feeling over the past two weeks.
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
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
                  >
                    Start Test <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ) : showResults ? (
              <Card className="shadow-xl border-0">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Results</h2>
                    <p className="text-muted-foreground">Based on your responses to the anxiety screening</p>
                  </div>
                  
                  {(() => {
                    const score = calculateScore();
                    const result = getResultInterpretation(score);
                    return (
                      <div className={`${result.bgColor} ${result.borderColor} border rounded-xl p-6 md:p-8 mb-8`}>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                          <p className={`text-5xl font-bold ${result.color} mb-2`}>{score}</p>
                          <p className="text-sm text-muted-foreground mb-4">out of 30</p>
                          <div className={`inline-block px-4 py-2 rounded-full ${result.bgColor} ${result.borderColor} border`}>
                            <span className={`font-semibold ${result.color}`}>{result.level} Anxiety</span>
                          </div>
                        </div>
                        <p className="mt-6 text-center text-foreground/80">{result.description}</p>
                      </div>
                    );
                  })()}

                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-pink-900 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-pink-800 text-sm">
                      <li>• Consider speaking with a mental health professional for a comprehensive evaluation</li>
                      <li>• Practice relaxation techniques like deep breathing and meditation</li>
                      <li>• Download the InnerSpark app to connect with licensed therapists</li>
                      <li>• Limit caffeine and maintain regular sleep patterns</li>
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
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={() => window.location.href = '/find-therapist'}
                    >
                      Find a Therapist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6 md:p-8">
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Question {currentQuestion + 1} of {anxietyQuestions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">
                      {anxietyQuestions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[anxietyQuestions[currentQuestion].id]?.toString()}
                      onValueChange={(value) => handleAnswer(anxietyQuestions[currentQuestion].id, parseInt(value))}
                      className="space-y-3"
                    >
                      {anxietyQuestions[currentQuestion].options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            answers[anxietyQuestions[currentQuestion].id] === option.value
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-border hover:border-pink-300 hover:bg-muted/50'
                          }`}
                          onClick={() => handleAnswer(anxietyQuestions[currentQuestion].id, option.value)}
                        >
                          <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                          <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer font-medium">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
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
                      onClick={handleNext}
                      disabled={answers[anxietyQuestions[currentQuestion].id] === undefined}
                      className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2"
                    >
                      {currentQuestion === anxietyQuestions.length - 1 ? 'See Results' : 'Next'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Signs & Symptoms of Anxiety</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Anxiety disorders are among the most common mental health conditions, affecting millions of people worldwide. While everyone experiences anxiety at times, anxiety disorders involve excessive fear or worry that interferes with daily life.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {symptoms.map((symptom, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">{symptom.title}</h3>
                  <p className="text-sm text-muted-foreground">{symptom.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Information Sections */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Diagnosis & Treatment of Anxiety</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Anxiety disorders are highly treatable conditions. Early detection and intervention can significantly improve outcomes and help individuals regain control of their lives.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Treatment Approaches</h3>
              <p className="mb-4">Effective treatment for anxiety often involves a combination of approaches:</p>
              <ul className="space-y-2">
                <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps identify and change negative thought patterns and behaviors that contribute to anxiety.</li>
                <li><strong>Exposure Therapy:</strong> Gradually exposing individuals to feared situations in a safe, controlled way.</li>
                <li><strong>Relaxation Techniques:</strong> Deep breathing, progressive muscle relaxation, and mindfulness meditation.</li>
                <li><strong>Lifestyle Changes:</strong> Regular exercise, adequate sleep, limiting caffeine, and stress management.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pink-900 mb-2">When to Seek Help</h3>
                  <p className="text-pink-800 mb-4">
                    If anxiety is interfering with your daily life, relationships, or work, it's important to seek professional help. Treatment is highly effective.
                  </p>
                  <div className="space-y-2 text-pink-800">
                    <p><strong>Crisis Resources:</strong></p>
                    <p>• National Alliance on Mental Illness (NAMI): 1-800-950-NAMI</p>
                    <p>• Crisis Text Line: Text HOME to 741741</p>
                    <p>• Anxiety and Depression Association of America (ADAA)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Did you know?</span>
            </div>
            <p className="text-lg text-muted-foreground">
              Anxiety disorders are the most common mental illness in the U.S., affecting 40 million adults (18.1% of the population) every year. Yet only 36.9% of those suffering receive treatment.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Reviews for this Anxiety Test</h2>
              <p className="text-muted-foreground">All reviews have been submitted by users after completing the test.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-3xl font-bold">4.7</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400/50'}`} />
                  ))}
                </div>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">{review.tag}</span>
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
    </div>
  );
};

export default AnxietyTest;
