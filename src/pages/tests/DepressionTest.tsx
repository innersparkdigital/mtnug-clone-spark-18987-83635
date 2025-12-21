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
  RotateCcw
} from "lucide-react";

const depressionQuestions = [
  {
    id: 1,
    question: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 2,
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 3,
    question: "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 4,
    question: "Over the past 2 weeks, how often have you felt tired or had little energy?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 5,
    question: "Over the past 2 weeks, how often have you had poor appetite or been overeating?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 6,
    question: "Over the past 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 7,
    question: "Over the past 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 8,
    question: "Over the past 2 weeks, how often have you moved or spoken so slowly that other people could have noticed? Or the opposite — being fidgety or restless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: 9,
    question: "Over the past 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const reviews = [
  { name: "Sarah M.", rating: 5, comment: "Very informative and helped me understand what I was feeling.", tag: "Informative" },
  { name: "James K.", rating: 5, comment: "The questions were thoughtful and the results gave me clarity.", tag: "Helpful" },
  { name: "Emily R.", rating: 4, comment: "Made me reflect on my mental health in a meaningful way.", tag: "Reflective" },
  { name: "Michael T.", rating: 5, comment: "Accurate assessment that matched what my therapist later confirmed.", tag: "Accurate" },
  { name: "Lisa P.", rating: 5, comment: "Felt supported throughout the process. Great resource.", tag: "Supportive" },
  { name: "David H.", rating: 4, comment: "Reassuring to have a starting point for understanding my symptoms.", tag: "Reassuring" }
];

const symptoms = [
  { title: "Persistent Sadness", description: "Prolonged feelings of sadness or emptiness." },
  { title: "Lack of Interest", description: "Loss of interest or pleasure in activities once enjoyed." },
  { title: "Changes in Appetite", description: "Significant weight loss or gain unrelated to dieting." },
  { title: "Sleep Disturbances", description: "Insomnia or sleeping too much." },
  { title: "Fatigue", description: "Persistent feelings of tiredness or lack of energy." },
  { title: "Difficulty Concentrating", description: "Trouble focusing, making decisions, or remembering details." },
  { title: "Feelings of Worthlessness", description: "Intense feelings of guilt or self-criticism." },
  { title: "Physical Symptoms", description: "Unexplained aches, pains, or gastrointestinal issues." },
  { title: "Thoughts of Death", description: "Recurrent thoughts of death or suicide." }
];

const DepressionTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < depressionQuestions.length - 1) {
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
        description: "Your responses suggest minimal symptoms of depression. Continue maintaining your mental wellness through healthy habits and self-care practices."
      };
    } else if (score <= 9) {
      return {
        level: "Mild",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "Your responses suggest mild symptoms of depression. Consider monitoring your symptoms and implementing self-care strategies. If symptoms persist, consider speaking with a healthcare professional."
      };
    } else if (score <= 14) {
      return {
        level: "Moderate",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Your responses suggest moderate symptoms of depression. We recommend speaking with a mental health professional for further evaluation and support."
      };
    } else if (score <= 19) {
      return {
        level: "Moderately Severe",
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Your responses suggest moderately severe symptoms of depression. We strongly recommend seeking help from a mental health professional as soon as possible."
      };
    } else {
      return {
        level: "Severe",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-300",
        description: "Your responses suggest severe symptoms of depression. Please reach out to a mental health professional or crisis helpline immediately. You don't have to face this alone."
      };
    }
  };

  const progress = ((currentQuestion + 1) / depressionQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Depression Test - Free Mental Health Screening | InnerSpark</title>
        <meta name="description" content="Take our free, confidential depression screening test. Get instant results and learn about symptoms, diagnosis, and treatment options for depression." />
      </Helmet>
      
      <Header />
      
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-4">FIND OUT IF YOU HAVE</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">DEPRESSION</h1>
            <p className="text-xl text-blue-100 mb-8">
              Take this mental health test. It's quick, free, and you'll get your confidential results instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>5-10 minutes</span>
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
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Depression Screening Test</h2>
                  <p className="text-muted-foreground mb-6">
                    This screening test is based on the PHQ-9, a widely-used tool for screening depression. 
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
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
                    <p className="text-muted-foreground">Based on your responses to the PHQ-9 screening</p>
                  </div>
                  
                  {(() => {
                    const score = calculateScore();
                    const result = getResultInterpretation(score);
                    return (
                      <div className={`${result.bgColor} ${result.borderColor} border rounded-xl p-6 md:p-8 mb-8`}>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                          <p className={`text-5xl font-bold ${result.color} mb-2`}>{score}</p>
                          <p className="text-sm text-muted-foreground mb-4">out of 27</p>
                          <div className={`inline-block px-4 py-2 rounded-full ${result.bgColor} ${result.borderColor} border`}>
                            <span className={`font-semibold ${result.color}`}>{result.level} Depression</span>
                          </div>
                        </div>
                        <p className="mt-6 text-center text-foreground/80">{result.description}</p>
                      </div>
                    );
                  })()}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      What's Next?
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• Consider speaking with a mental health professional for a comprehensive evaluation</li>
                      <li>• Download the InnerSpark app to connect with licensed therapists</li>
                      <li>• Practice self-care and maintain healthy routines</li>
                      <li>• Reach out to friends, family, or support groups</li>
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
                      className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      <span>Question {currentQuestion + 1} of {depressionQuestions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">
                      {depressionQuestions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[depressionQuestions[currentQuestion].id]?.toString()}
                      onValueChange={(value) => handleAnswer(depressionQuestions[currentQuestion].id, parseInt(value))}
                      className="space-y-3"
                    >
                      {depressionQuestions[currentQuestion].options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            answers[depressionQuestions[currentQuestion].id] === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-border hover:border-blue-300 hover:bg-muted/50'
                          }`}
                          onClick={() => handleAnswer(depressionQuestions[currentQuestion].id, option.value)}
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
                      disabled={answers[depressionQuestions[currentQuestion].id] === undefined}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      {currentQuestion === depressionQuestions.length - 1 ? 'See Results' : 'Next'}
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
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Signs & Symptoms of Depression</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Depression is a common and serious mood disorder that affects how individuals feel, think, and handle daily activities. 
                While occasional sadness is a natural part of life, depression involves persistent feelings of sadness and hopelessness 
                that interfere with daily functioning. Recognizing the signs and symptoms of depression is essential for early intervention 
                and effective treatment.
              </p>
              <p className="font-medium text-foreground">The symptoms of depression can vary from person to person but often include:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{symptom.title}</h3>
                    <p className="text-sm text-muted-foreground">{symptom.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Depression not only impacts emotions but also behaviors. Individuals with depression may withdraw socially, 
                isolate themselves from friends and family, or avoid activities they once found fulfilling. Irritability, 
                frustration, or angry outbursts can also be common, further straining relationships and daily interactions.
              </p>
              <p>
                In addition to emotional and cognitive symptoms, depression often manifests physically. Fatigue, headaches, 
                muscle pain, and digestive issues are common complaints among those with depression. These physical symptoms 
                may lead individuals to seek help from a healthcare provider without initially realizing the underlying cause is depression.
              </p>
              <p>
                For a diagnosis of depression, symptoms must persist for at least two weeks and represent a change from previous functioning. 
                The severity and duration of symptoms can vary widely, from mild to severe, and may significantly impair daily life, work, or relationships.
              </p>
              <p>
                Understanding the signs and symptoms of depression is the first step toward recovery. If you or someone you know is experiencing 
                these symptoms, consider reaching out to a healthcare professional for an evaluation and support. Early recognition and treatment 
                can improve quality of life and reduce the long-term impact of depression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis & Treatment Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Diagnosis & Treatment of Depression</h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Depression is a complex mood disorder that requires careful diagnosis and a comprehensive treatment plan. 
                Early detection and intervention can significantly improve outcomes and help individuals regain control of their lives. 
                Understanding how depression is diagnosed and treated is key to effective management.
              </p>
              <p>
                Depression is typically diagnosed through a thorough evaluation conducted by a healthcare professional. 
                The diagnostic process often includes:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Clinical Interviews</h3>
                  <p className="text-muted-foreground text-sm">
                    Discussing symptoms, their duration, and their impact on daily life.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Diagnostic Criteria</h3>
                  <p className="text-muted-foreground text-sm">
                    Using established guidelines, such as those in the DSM-5, to identify the presence of depressive symptoms.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Physical Examinations</h3>
                  <p className="text-muted-foreground text-sm">
                    Ruling out medical conditions that may mimic depressive symptoms, such as thyroid disorders or vitamin deficiencies.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Assessment Tools</h3>
                  <p className="text-muted-foreground text-sm">
                    Utilizing questionnaires or scales to measure the severity of symptoms.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-2xl font-bold mb-4">Treatment Approaches</h3>
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Effective treatment for depression often involves a combination of therapy, lifestyle changes, and other interventions. 
                Each treatment plan is tailored to the individual's unique needs and circumstances.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-3">Psychotherapy</h4>
                  <p className="text-muted-foreground mb-4">
                    Talk therapy, or psychotherapy, is one of the most effective treatments for depression. Common approaches include:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps individuals identify and change negative thought patterns and behaviors.</li>
                    <li><strong>Interpersonal Therapy (IPT):</strong> Focuses on improving communication and relationships.</li>
                    <li><strong>Behavioral Activation:</strong> Encourages engagement in activities that bring joy or fulfillment.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-teal-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-3">Group and Family Therapy</h4>
                  <p className="text-muted-foreground">
                    In addition to individual therapy, group therapy provides a supportive environment where individuals can share experiences 
                    and learn coping strategies. Family therapy may also be beneficial in improving communication and understanding within 
                    households affected by depression.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-3">Lifestyle Modifications</h4>
                  <p className="text-muted-foreground">
                    Adopting healthy habits can complement other treatments for depression. Regular physical activity, a balanced diet, 
                    adequate sleep, and stress management techniques, such as mindfulness or meditation, are all important components of 
                    a holistic approach to recovery.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800">
                <strong>Depression is treatable</strong>, and many individuals experience significant improvement with the right interventions. 
                If you suspect you or a loved one may have depression, seeking help from a healthcare professional is the first step toward recovery. 
                With early diagnosis and a personalized treatment plan, it is possible to lead a fulfilling and productive life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Seek Help Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">When to Seek Help for Depression</h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Depression can have a profound impact on mental, emotional, and physical well-being. Recognizing when to seek professional help 
                is crucial to prevent symptoms from worsening and to begin the journey toward recovery.
              </p>
              <p className="font-medium text-foreground">It's important to seek professional help if you experience any of the following symptoms:</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                {[
                  "Persistent sadness or hopelessness lasting more than two weeks",
                  "Difficulty functioning at work, school, or in relationships",
                  "Loss of interest in activities you once enjoyed",
                  "Significant changes in appetite, weight, or sleep patterns",
                  "Feelings of worthlessness or excessive guilt",
                  "Thoughts of self-harm or suicide"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p>
                Depression is a treatable condition, but delaying help can lead to worsening symptoms and a greater impact on daily life. 
                Early intervention not only alleviates suffering but also reduces the risk of complications such as substance abuse or chronic physical health problems.
              </p>
            </div>

            <h3 className="text-xl font-bold mb-4">Crisis Resources</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { name: "National Suicide Prevention Lifeline", contact: "988" },
                { name: "National Alliance on Mental Illness (NAMI)", contact: "1-800-950-6264" },
                { name: "Crisis Text Line", contact: "Text HOME to 741741" },
                { name: "Anxiety and Depression Association of America", contact: "adaa.org" }
              ].map((resource, index) => (
                <Card key={index} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900">{resource.name}</h4>
                    <p className="text-blue-700 font-medium">{resource.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
              <p className="text-lg mb-2">
                Seeking help for depression is a sign of strength, not weakness.
              </p>
              <p className="text-blue-100">
                With the right support and treatment, individuals can manage their symptoms and lead fulfilling lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Did you know?</h2>
            <p className="text-xl text-indigo-100">
              Depression is the leading cause of disability worldwide, and about <strong className="text-white">17 million adults</strong> in the U.S. 
              experience at least one major depressive episode annually.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Reviews for this Depression Test</h2>
              <p className="text-muted-foreground">All reviews have been submitted by users after completing the test.</p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">4.6</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400/50'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">34 reviews</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Informative", "Helpful", "Reflective", "Accurate", "Supportive", "Reassuring", "Compassionate", "Enlightening", "Validating", "Empowering"].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{review.tag}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">"{review.comment}"</p>
                    <p className="text-sm font-medium">{review.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need help? We recommend these therapists</h2>
            <p className="text-muted-foreground mb-8">
              Connect with licensed mental health professionals who specialize in depression treatment.
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/find-therapist'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Find a Therapist <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DepressionTest;
