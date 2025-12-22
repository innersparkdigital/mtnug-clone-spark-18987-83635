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
  ShieldAlert
} from "lucide-react";

const ptsdQuestions = [
  {
    id: 1,
    question: "In the past month, have you had nightmares about a traumatic event or thought about it when you did not want to?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 2,
    question: "In the past month, have you tried hard not to think about a traumatic event or went out of your way to avoid situations that reminded you of it?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 3,
    question: "In the past month, have you been constantly on guard, watchful, or easily startled?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 4,
    question: "In the past month, have you felt numb or detached from others, activities, or your surroundings?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 5,
    question: "In the past month, have you felt guilty or been unable to stop blaming yourself or others for the traumatic event?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 6,
    question: "In the past month, have you had disturbing memories, thoughts, or images of a traumatic event?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 7,
    question: "In the past month, have you had physical reactions (like heart pounding, sweating, trouble breathing) when reminded of a traumatic event?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 8,
    question: "In the past month, have you had trouble falling or staying asleep?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 9,
    question: "In the past month, have you had difficulty concentrating?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  },
  {
    id: 10,
    question: "In the past month, have you felt irritable or had angry outbursts?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little bit" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Quite a bit" },
      { value: 4, label: "Extremely" }
    ]
  }
];

const reviews = [
  { name: "Alex R.", rating: 5, comment: "Helped me recognize symptoms I had been ignoring.", tag: "Eye-opening" },
  { name: "Michelle S.", rating: 5, comment: "Compassionate approach to a difficult topic.", tag: "Compassionate" },
  { name: "James W.", rating: 4, comment: "Gave me the courage to finally seek help.", tag: "Empowering" },
  { name: "Patricia L.", rating: 5, comment: "Accurate questions that captured my experience.", tag: "Accurate" },
  { name: "Robert H.", rating: 5, comment: "Felt validated and understood.", tag: "Validating" },
  { name: "Susan M.", rating: 4, comment: "Important first step in my healing journey.", tag: "Helpful" }
];

const symptoms = [
  { title: "Intrusive Memories", description: "Recurring, unwanted distressing memories of the traumatic event." },
  { title: "Flashbacks", description: "Reliving the traumatic event as if it were happening again." },
  { title: "Nightmares", description: "Distressing dreams about the traumatic event." },
  { title: "Avoidance", description: "Trying to avoid thinking about or being reminded of the trauma." },
  { title: "Negative Thoughts", description: "Negative beliefs about yourself, others, or the world." },
  { title: "Emotional Numbness", description: "Feeling emotionally numb or detached from others." },
  { title: "Hypervigilance", description: "Being easily startled or feeling constantly on guard." },
  { title: "Irritability", description: "Irritable behavior, angry outbursts, or aggressive behavior." },
  { title: "Sleep Problems", description: "Difficulty falling or staying asleep." }
];

const PTSDTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < ptsdQuestions.length - 1) {
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
    if (score <= 10) {
      return {
        level: "Minimal",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Your responses suggest minimal PTSD symptoms. If you have experienced trauma and are concerned, consider speaking with a mental health professional."
      };
    } else if (score <= 20) {
      return {
        level: "Mild",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Your responses suggest mild PTSD symptoms. Consider monitoring your symptoms and speaking with a healthcare professional if they persist or worsen."
      };
    } else if (score <= 30) {
      return {
        level: "Moderate",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Your responses suggest moderate PTSD symptoms. We recommend seeking evaluation from a mental health professional who specializes in trauma."
      };
    } else {
      return {
        level: "Severe",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Your responses suggest significant PTSD symptoms. We strongly recommend seeking help from a trauma-specialized mental health professional. Effective treatments are available, and recovery is possible."
      };
    }
  };

  const progress = ((currentQuestion + 1) / ptsdQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>PTSD Test - Free Mental Health Screening | InnerSpark</title>
        <meta name="description" content="Take our free, confidential PTSD screening test (PCL-5 based). Get instant results and learn about symptoms, diagnosis, and treatment options for post-traumatic stress disorder." />
      </Helmet>
      
      <Header />
      
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-purple-200 text-sm font-medium uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">PTSD</h1>
            <p className="text-xl text-purple-100 mb-8">
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

      {/* Trigger Warning */}
      <section className="py-4 bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">
              Content Warning: This test asks about traumatic experiences. Please take care of yourself while completing it.
            </p>
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
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="h-10 w-10 text-purple-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">PTSD Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    This screening test is based on the PCL-5 (PTSD Checklist), a widely-used tool for screening post-traumatic stress disorder. 
                    Answer each question based on how much you have been bothered by each problem in the past month.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> This test is for educational purposes only and is not a diagnostic tool. 
                      If you are in crisis, please reach out to a crisis helpline immediately.
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setTestStarted(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
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
                    <p className="text-muted-foreground">Based on your responses to the PTSD screening</p>
                  </div>
                  
                  {(() => {
                    const score = calculateScore();
                    const result = getResultInterpretation(score);
                    return (
                      <div className={`${result.bgColor} ${result.borderColor} border rounded-xl p-6 md:p-8 mb-8`}>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                          <p className={`text-5xl font-bold ${result.color} mb-2`}>{score}</p>
                          <p className="text-sm text-muted-foreground mb-4">out of 40</p>
                          <div className={`inline-block px-4 py-2 rounded-full ${result.bgColor} ${result.borderColor} border`}>
                            <span className={`font-semibold ${result.color}`}>{result.level} PTSD Symptoms</span>
                          </div>
                        </div>
                        <p className="mt-6 text-center text-foreground/80">{result.description}</p>
                      </div>
                    );
                  })()}

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• Consider seeking evaluation from a trauma-specialized mental health professional</li>
                      <li>• Learn about trauma-focused treatments like EMDR and trauma-focused CBT</li>
                      <li>• Download the InnerSpark app to connect with trauma-informed therapists</li>
                      <li>• Practice grounding techniques and self-care</li>
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
                      className="bg-purple-600 hover:bg-purple-700 text-white"
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
                      <span>Question {currentQuestion + 1} of {ptsdQuestions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">
                      {ptsdQuestions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[ptsdQuestions[currentQuestion].id]?.toString()}
                      onValueChange={(value) => handleAnswer(ptsdQuestions[currentQuestion].id, parseInt(value))}
                      className="space-y-3"
                    >
                      {ptsdQuestions[currentQuestion].options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            answers[ptsdQuestions[currentQuestion].id] === option.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-border hover:border-purple-300 hover:bg-muted/50'
                          }`}
                          onClick={() => handleAnswer(ptsdQuestions[currentQuestion].id, option.value)}
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
                      disabled={answers[ptsdQuestions[currentQuestion].id] === undefined}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      {currentQuestion === ptsdQuestions.length - 1 ? 'See Results' : 'Next'}
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Signs & Symptoms of PTSD</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              PTSD can develop after experiencing or witnessing a traumatic event. Symptoms may appear shortly after the event or years later, and can significantly impact daily life.
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Diagnosis & Treatment of PTSD</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                PTSD is a treatable condition. With proper care and support, most people can recover and regain quality of life. Early intervention often leads to better outcomes.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Evidence-Based Treatments</h3>
              <p className="mb-4">Several trauma-focused treatments have been proven effective:</p>
              <ul className="space-y-2">
                <li><strong>EMDR (Eye Movement Desensitization and Reprocessing):</strong> Helps process traumatic memories through guided eye movements.</li>
                <li><strong>Trauma-Focused CBT:</strong> Addresses negative thought patterns related to the trauma.</li>
                <li><strong>Prolonged Exposure Therapy:</strong> Gradually and safely confronts trauma-related memories and situations.</li>
                <li><strong>CPT (Cognitive Processing Therapy):</strong> Helps change unhelpful beliefs related to the trauma.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Crisis Resources</h3>
                  <p className="text-purple-800 mb-4">
                    If you are experiencing a mental health crisis or having thoughts of suicide, please reach out for help immediately.
                  </p>
                  <div className="space-y-2 text-purple-800">
                    <p>• National Suicide Prevention Lifeline: 988</p>
                    <p>• Crisis Text Line: Text HOME to 741741</p>
                    <p>• Veterans Crisis Line: 1-800-273-8255, Press 1</p>
                    <p>• SAMHSA National Helpline: 1-800-662-4357</p>
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
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Did you know?</span>
            </div>
            <p className="text-lg text-muted-foreground">
              About 6% of the U.S. population will experience PTSD at some point in their lives. Women are twice as likely as men to develop PTSD. With treatment, most people experience significant improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Reviews for this PTSD Test</h2>
              <p className="text-muted-foreground">All reviews have been submitted by users after completing the test.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-3xl font-bold">4.8</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
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
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{review.tag}</span>
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

export default PTSDTest;
