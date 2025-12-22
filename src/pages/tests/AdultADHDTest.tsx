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
  Focus
} from "lucide-react";

const adhdQuestions = [
  {
    id: 1,
    question: "How often do you have trouble wrapping up the final details of a project once the challenging parts have been done?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 2,
    question: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 3,
    question: "How often do you have problems remembering appointments or obligations?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 4,
    question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 5,
    question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 6,
    question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 7,
    question: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 8,
    question: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 9,
    question: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 10,
    question: "How often do you misplace or have difficulty finding things at home or at work?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 11,
    question: "How often are you distracted by activity or noise around you?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 12,
    question: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  }
];

const reviews = [
  { name: "Mark T.", rating: 5, comment: "Finally understood why I've struggled with focus my whole life.", tag: "Enlightening" },
  { name: "Sarah K.", rating: 5, comment: "Accurate questions that really captured my experience.", tag: "Accurate" },
  { name: "David R.", rating: 4, comment: "Gave me the validation I needed to seek professional help.", tag: "Validating" },
  { name: "Jennifer L.", rating: 5, comment: "Quick and insightful. Helped me understand my symptoms.", tag: "Helpful" },
  { name: "Michael P.", rating: 5, comment: "The results empowered me to take action.", tag: "Empowering" },
  { name: "Lisa M.", rating: 4, comment: "Comprehensive questions covering all aspects of ADHD.", tag: "Thorough" }
];

const symptoms = [
  { title: "Inattention", description: "Difficulty sustaining focus, easily distracted, forgetful in daily activities." },
  { title: "Hyperactivity", description: "Feeling restless, difficulty sitting still, excessive talking or movement." },
  { title: "Impulsivity", description: "Acting without thinking, interrupting others, difficulty waiting your turn." },
  { title: "Disorganization", description: "Trouble with organization, poor time management, messy spaces." },
  { title: "Poor Working Memory", description: "Difficulty following through on instructions, losing things frequently." },
  { title: "Emotional Dysregulation", description: "Mood swings, low frustration tolerance, difficulty managing emotions." },
  { title: "Hyperfocus", description: "Intense focus on interesting tasks while neglecting others." },
  { title: "Procrastination", description: "Difficulty starting tasks, especially complex or boring ones." },
  { title: "Time Blindness", description: "Difficulty estimating time, often running late or losing track of time." }
];

const AdultADHDTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < adhdQuestions.length - 1) {
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
    if (score <= 12) {
      return {
        level: "Unlikely",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Your responses suggest ADHD symptoms are unlikely. However, if you're concerned about attention or focus issues, consider speaking with a healthcare professional."
      };
    } else if (score <= 24) {
      return {
        level: "Possible",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Your responses suggest possible ADHD symptoms. Consider monitoring your symptoms and speaking with a healthcare professional for a comprehensive evaluation."
      };
    } else if (score <= 36) {
      return {
        level: "Likely",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Your responses suggest likely ADHD symptoms. We recommend scheduling an evaluation with a mental health professional who specializes in ADHD."
      };
    } else {
      return {
        level: "Highly Likely",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Your responses suggest highly likely ADHD symptoms. We strongly recommend seeking a comprehensive evaluation from a mental health professional. Treatment can significantly improve quality of life."
      };
    }
  };

  const progress = ((currentQuestion + 1) / adhdQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Adult ADHD Test - Free Mental Health Screening | InnerSpark</title>
        <meta name="description" content="Take our free, confidential Adult ADHD screening test (ASRS-based). Get instant results and learn about symptoms, diagnosis, and treatment options for ADHD." />
      </Helmet>
      
      <Header />
      
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-200 text-sm font-medium uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">ADULT ADHD</h1>
            <p className="text-xl text-red-100 mb-8">
              Take this mental health test. It's quick, free, and you'll get your confidential results instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>4-6 minutes</span>
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
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Focus className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Adult ADHD Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    This screening test is based on the Adult ADHD Self-Report Scale (ASRS-v1.1), developed by the World Health Organization. 
                    Answer each question honestly based on how you have felt and conducted yourself over the past 6 months.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
                    <p className="text-amber-800 text-sm">
                      <strong>Important:</strong> This test is for educational purposes only and is not a diagnostic tool. 
                      ADHD can only be diagnosed by a qualified healthcare professional.
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setTestStarted(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
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
                    <p className="text-muted-foreground">Based on your responses to the ADHD screening</p>
                  </div>
                  
                  {(() => {
                    const score = calculateScore();
                    const result = getResultInterpretation(score);
                    return (
                      <div className={`${result.bgColor} ${result.borderColor} border rounded-xl p-6 md:p-8 mb-8`}>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                          <p className={`text-5xl font-bold ${result.color} mb-2`}>{score}</p>
                          <p className="text-sm text-muted-foreground mb-4">out of 48</p>
                          <div className={`inline-block px-4 py-2 rounded-full ${result.bgColor} ${result.borderColor} border`}>
                            <span className={`font-semibold ${result.color}`}>{result.level} ADHD</span>
                          </div>
                        </div>
                        <p className="mt-6 text-center text-foreground/80">{result.description}</p>
                      </div>
                    );
                  })()}

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• Consider a comprehensive ADHD evaluation by a psychiatrist or psychologist</li>
                      <li>• Learn about ADHD management strategies and coping techniques</li>
                      <li>• Download the InnerSpark app to connect with specialists</li>
                      <li>• Implement organizational tools and time management strategies</li>
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
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => window.location.href = '/find-therapist'}
                    >
                      Find a Specialist
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
                      <span>Question {currentQuestion + 1} of {adhdQuestions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">
                      {adhdQuestions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[adhdQuestions[currentQuestion].id]?.toString()}
                      onValueChange={(value) => handleAnswer(adhdQuestions[currentQuestion].id, parseInt(value))}
                      className="space-y-3"
                    >
                      {adhdQuestions[currentQuestion].options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            answers[adhdQuestions[currentQuestion].id] === option.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-border hover:border-red-300 hover:bg-muted/50'
                          }`}
                          onClick={() => handleAnswer(adhdQuestions[currentQuestion].id, option.value)}
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
                      disabled={answers[adhdQuestions[currentQuestion].id] === undefined}
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                      {currentQuestion === adhdQuestions.length - 1 ? 'See Results' : 'Next'}
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Signs & Symptoms of Adult ADHD</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              ADHD in adults often looks different than in children. While hyperactivity may decrease, issues with attention, impulsivity, and executive function often persist or become more apparent.
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Diagnosis & Treatment of Adult ADHD</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Adult ADHD is a neurodevelopmental disorder that can significantly impact work performance, relationships, and daily functioning. With proper diagnosis and treatment, individuals with ADHD can thrive.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Treatment Approaches</h3>
              <p className="mb-4">Effective treatment for adult ADHD often involves a multimodal approach:</p>
              <ul className="space-y-2">
                <li><strong>Behavioral Strategies:</strong> Organizational tools, time management techniques, and structured routines.</li>
                <li><strong>Coaching:</strong> ADHD coaching focuses on developing practical skills and accountability.</li>
                <li><strong>Cognitive Behavioral Therapy:</strong> Addresses negative thought patterns and develops coping strategies.</li>
                <li><strong>Lifestyle Modifications:</strong> Regular exercise, adequate sleep, and proper nutrition support brain function.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Did you know?</span>
            </div>
            <p className="text-lg text-muted-foreground">
              Approximately 4.4% of U.S. adults have ADHD, but most are undiagnosed. Many adults discover they have ADHD when their children are diagnosed, or when life demands exceed their coping strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Reviews for this ADHD Test</h2>
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
                <div key={index} className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{review.tag}</span>
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

export default AdultADHDTest;
