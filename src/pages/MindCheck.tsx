import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Brain, Heart, AlertTriangle, Users, Zap, Shield, Clock, CheckCircle } from "lucide-react";

interface MentalHealthTest {
  id: string;
  name: string;
  description: string;
  questions: number;
  duration: string;
  color: string;
  category: "common" | "addiction" | "mood" | "personality" | "other";
}

const mentalHealthTests: MentalHealthTest[] = [
  // Common tests (always visible)
  { id: "depression", name: "Depression", description: "Assess symptoms of depression", questions: 10, duration: "3 min", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200", category: "common" },
  { id: "anxiety", name: "Anxiety", description: "Evaluate anxiety levels", questions: 10, duration: "3 min", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200", category: "common" },
  { id: "adult-adhd", name: "Adult ADHD", description: "Screen for ADHD symptoms", questions: 12, duration: "4 min", color: "bg-red-100 hover:bg-red-200 text-red-800 border-red-200", category: "common" },
  { id: "ptsd", name: "PTSD", description: "Post-traumatic stress screening", questions: 10, duration: "3 min", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200", category: "common" },
  { id: "bpd", name: "Borderline Personality Disorder", description: "BPD symptoms assessment", questions: 15, duration: "5 min", color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200", category: "common" },
  { id: "eating-disorder", name: "Eating Disorder", description: "Eating habits assessment", questions: 12, duration: "4 min", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200", category: "common" },
  { id: "gambling-addiction", name: "Gambling Addiction", description: "Gambling behavior screening", questions: 10, duration: "3 min", color: "bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200", category: "common" },
  { id: "mania", name: "Mania", description: "Manic episode screening", questions: 10, duration: "3 min", color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-200", category: "common" },
  { id: "npd", name: "Narcissistic Personality Disorder", description: "NPD symptoms assessment", questions: 12, duration: "4 min", color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-200", category: "common" },
  { id: "postpartum", name: "Postpartum Depression", description: "Post-birth mood assessment", questions: 10, duration: "3 min", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200", category: "common" },
  
  // Additional tests (shown when expanded)
  { id: "sex-addiction", name: "Sex Addiction", description: "Sexual behavior assessment", questions: 10, duration: "3 min", color: "bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 border-fuchsia-200", category: "addiction" },
  { id: "video-game-addiction", name: "Video Game Addiction", description: "Gaming habits screening", questions: 10, duration: "3 min", color: "bg-violet-100 hover:bg-violet-200 text-violet-800 border-violet-200", category: "addiction" },
  { id: "internet-addiction", name: "Internet Addiction", description: "Online behavior assessment", questions: 10, duration: "3 min", color: "bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-200", category: "addiction" },
  { id: "job-burnout", name: "Job Burnout", description: "Work stress assessment", questions: 12, duration: "4 min", color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200", category: "other" },
  { id: "toxic-workplace", name: "Toxic Workplace", description: "Work environment screening", questions: 10, duration: "3 min", color: "bg-red-100 hover:bg-red-200 text-red-800 border-red-200", category: "other" },
  { id: "panic-disorder", name: "Panic Disorder", description: "Panic attack screening", questions: 10, duration: "3 min", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200", category: "mood" },
  { id: "ocd", name: "Obsessive-Compulsive Disorder", description: "OCD symptoms assessment", questions: 12, duration: "4 min", color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-200", category: "mood" },
  { id: "bipolar", name: "Bipolar Disorder", description: "Bipolar screening test", questions: 15, duration: "5 min", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200", category: "mood" },
  { id: "social-anxiety", name: "Social Anxiety Disorder", description: "Social anxiety assessment", questions: 10, duration: "3 min", color: "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200", category: "mood" },
  { id: "hoarding", name: "Hoarding Disorder", description: "Hoarding behavior screening", questions: 10, duration: "3 min", color: "bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200", category: "personality" },
  { id: "psychosis", name: "Psychosis", description: "Psychosis symptoms screening", questions: 12, duration: "4 min", color: "bg-red-100 hover:bg-red-200 text-red-800 border-red-200", category: "personality" },
  { id: "grief", name: "Complicated Grief", description: "Grief assessment test", questions: 10, duration: "3 min", color: "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200", category: "other" },
  { id: "did", name: "Dissociative Identity Disorder", description: "DID symptoms screening", questions: 15, duration: "5 min", color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200", category: "personality" },
  { id: "schizophrenia", name: "Schizophrenia", description: "Schizophrenia screening", questions: 15, duration: "5 min", color: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200", category: "personality" },
  { id: "stress", name: "Stress", description: "Stress level assessment", questions: 10, duration: "3 min", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200", category: "other" },
  { id: "agoraphobia", name: "Agoraphobia", description: "Agoraphobia screening", questions: 10, duration: "3 min", color: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-200", category: "mood" },
  { id: "separation-anxiety", name: "Separation Anxiety", description: "Separation anxiety assessment", questions: 10, duration: "3 min", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200", category: "mood" },
  { id: "sleep-disorder", name: "Sleep Disorder", description: "Sleep quality assessment", questions: 10, duration: "3 min", color: "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200", category: "other" },
  { id: "empathy-deficit", name: "Empathy Deficit Disorder", description: "Empathy assessment", questions: 10, duration: "3 min", color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-200", category: "personality" },
  { id: "binge-eating", name: "Binge Eating Disorder", description: "Binge eating screening", questions: 10, duration: "3 min", color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200", category: "other" },
  { id: "gender-dysphoria", name: "Gender Dysphoria", description: "Gender identity assessment", questions: 12, duration: "4 min", color: "bg-violet-100 hover:bg-violet-200 text-violet-800 border-violet-200", category: "other" },
  { id: "relationship-health", name: "Relationship Health", description: "Relationship assessment", questions: 12, duration: "4 min", color: "bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-200", category: "other" },
  { id: "sociopath", name: "Sociopath", description: "Antisocial behavior screening", questions: 12, duration: "4 min", color: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200", category: "personality" },
  { id: "job-satisfaction", name: "Job Satisfaction", description: "Work satisfaction assessment", questions: 10, duration: "3 min", color: "bg-green-100 hover:bg-green-200 text-green-800 border-green-200", category: "other" },
  { id: "work-life-balance", name: "Work-Life Balance", description: "Life balance assessment", questions: 10, duration: "3 min", color: "bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-200", category: "other" },
  { id: "imposter-syndrome", name: "Imposter Syndrome", description: "Imposter feelings assessment", questions: 10, duration: "3 min", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200", category: "other" },
  { id: "sad", name: "Seasonal Affective Disorder", description: "Seasonal depression screening", questions: 10, duration: "3 min", color: "bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-200", category: "mood" },
];

const MindCheck = () => {
  const [showAllTests, setShowAllTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState<MentalHealthTest | null>(null);
  const navigate = useNavigate();

  const displayedTests = showAllTests ? mentalHealthTests : mentalHealthTests.slice(0, 10);

  const handleTestClick = (test: MentalHealthTest) => {
    const availableTests = ["depression", "anxiety", "adult-adhd", "ptsd", "bpd", "eating-disorder", "gambling-addiction", "mania", "npd", "postpartum"];
    if (availableTests.includes(test.id)) {
      navigate(`/mind-check/${test.id}`);
      return;
    }
    setSelectedTest(test);
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Mental Health Self-Assessment Tests",
    "description": "Free online mental health screening tests for depression, anxiety, ADHD, PTSD, and more. Get instant, confidential results.",
    "url": "https://innerspark.africa/mind-check",
    "specialty": "Psychiatry",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Mental Health Tests",
      "numberOfItems": mentalHealthTests.length,
      "itemListElement": mentalHealthTests.slice(0, 10).map((test, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${test.name} Test`,
        "description": test.description
      }))
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are online mental health tests accurate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Online mental health tests are screening tools that can help identify potential symptoms. While they are not diagnostic, they are based on clinically validated questionnaires like PHQ-9 and GAD-7. Always consult a mental health professional for proper diagnosis."
        }
      },
      {
        "@type": "Question",
        "name": "Are mental health tests confidential?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our mental health tests are 100% confidential. Your results are not stored or shared. You receive instant, private results that only you can see."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do after taking a mental health test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your test results suggest you may be experiencing mental health symptoms, we recommend speaking with a licensed therapist or mental health professional. Innerspark can connect you with qualified therapists for proper evaluation and support."
        }
      },
      {
        "@type": "Question",
        "name": "How long do mental health tests take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most of our mental health screening tests take only 3-5 minutes to complete. Each test clearly shows the estimated time before you start."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://innerspark.africa" },
      { "@type": "ListItem", "position": 2, "name": "Mind-Check", "item": "https://innerspark.africa/mind-check" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Free Mental Health Tests Online | Depression, Anxiety, ADHD Screening | Innerspark</title>
        <meta 
          name="description" 
          content="Take free online mental health tests for depression, anxiety, ADHD, PTSD, bipolar, OCD & more. Get instant, confidential results. Clinically-based screening tools to understand your mental health symptoms." 
        />
        <meta name="keywords" content="mental health test, depression test online, anxiety test, am I depressed quiz, do I have anxiety quiz, ADHD test adults, PTSD screening, bipolar test, OCD test, mental health quiz, free mental health assessment, self-assessment mental health, mental health screening, depression symptoms test, anxiety symptoms quiz, mental health check" />
        <link rel="canonical" href="https://innerspark.africa/mind-check" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Mental Health Tests | Depression, Anxiety, ADHD Screening" />
        <meta property="og:description" content="Take free, confidential mental health screening tests. Get instant results for depression, anxiety, ADHD, PTSD, and 30+ other conditions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://innerspark.africa/mind-check" />
        <meta property="og:image" content="https://innerspark.africa/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Mental Health Tests | Innerspark Africa" />
        <meta name="twitter:description" content="Take free online mental health tests. Screen for depression, anxiety, ADHD & more. Instant, confidential results." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-purple-50 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Free Mental Health Screening</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Make Sense of Your{" "}
              <span className="text-primary">Mental Health</span> Symptoms
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Taking an online mental health test is one of the quickest and easiest ways to find out if you are experiencing symptoms of a mental health condition.
            </p>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Tap Any Test Below
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              They're quick, free, and you'll get your confidential results instantly.
            </p>
          </div>

          {/* Test Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
            {displayedTests.map((test) => (
              <button
                key={test.id}
                onClick={() => handleTestClick(test)}
                className={`group relative aspect-square rounded-full flex items-center justify-center p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 ${test.color}`}
              >
                <span className="text-sm md:text-base font-medium text-center leading-tight">
                  {test.name}
                </span>
              </button>
            ))}
          </div>

          {/* View More/Less Button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowAllTests(!showAllTests)}
              className="px-8"
            >
              {showAllTests ? "View fewer tests" : "View more tests"}
            </Button>
          </div>
        </div>
      </section>

      {/* Selected Test Modal/Info */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTest(null)}>
          <div 
            className="bg-background rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${selectedTest.color} mb-4`}>
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{selectedTest.name} Test</h3>
              <p className="text-muted-foreground mb-4">{selectedTest.description}</p>
              
              <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{selectedTest.questions} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedTest.duration}</span>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-primary font-medium">
                  This test is coming soon! We're working on bringing you comprehensive mental health assessments.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTest(null)}>
                  Close
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What is Mental Health Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              What is Mental Health?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Mental health is a combination of our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life from childhood and adolescence through adulthood.
              </p>
              <p className="mb-6">
                Over the course of your life, if you experience mental health problems, your thinking, mood, and behavior could be affected. Many factors contribute to mental health problems, including:
              </p>
              <ul className="grid md:grid-cols-3 gap-4 list-none p-0">
                <li className="bg-background rounded-lg p-4 shadow-sm border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Biological factors</h4>
                      <p className="text-sm text-muted-foreground">Such as genes or brain chemistry</p>
                    </div>
                  </div>
                </li>
                <li className="bg-background rounded-lg p-4 shadow-sm border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Life experiences</h4>
                      <p className="text-sm text-muted-foreground">Such as trauma or abuse</p>
                    </div>
                  </div>
                </li>
                <li className="bg-background rounded-lg p-4 shadow-sm border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Family history</h4>
                      <p className="text-sm text-muted-foreground">Of mental health problems</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Why Take a Mental Health Test?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quick & Easy</h3>
                <p className="text-sm text-muted-foreground">Most tests take only 3-5 minutes to complete</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">100% Confidential</h3>
                <p className="text-sm text-muted-foreground">Your responses are private and secure</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get your screening results immediately</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">First Step to Help</h3>
                <p className="text-sm text-muted-foreground">Understanding symptoms is the first step</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Important Notice</span>
            </div>
            <p className="text-muted-foreground text-sm">
              These tests are not a diagnosis. They are intended to help you identify possible symptoms and understand when it may be time to seek professional help. If you are experiencing a mental health emergency, please contact emergency services or a crisis helpline immediately.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MindCheck;
