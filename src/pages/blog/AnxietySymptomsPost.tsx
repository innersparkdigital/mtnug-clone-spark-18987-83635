import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, Brain, Heart, Zap, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import anxietyHeroImage from "@/assets/blog/anxiety-management-hero.jpg";

const AnxietySymptomsPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Anxiety Symptoms: How to Recognize if You Have Anxiety Disorder",
    "description": "Learn to identify the physical, emotional, and behavioral symptoms of anxiety. Understand the difference between normal worry and anxiety disorder.",
    "image": "https://www.innersparkafrica.com/innerspark-logo.png",
    "author": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.innersparkafrica.com/innerspark-logo.png"
      }
    },
    "datePublished": "2026-01-12",
    "dateModified": "2026-02-11",
    "inLanguage": "en",
    "keywords": ["anxiety symptoms", "signs of anxiety", "anxiety disorder symptoms", "physical symptoms of anxiety", "what does anxiety feel like"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.innersparkafrica.com/blog/anxiety-symptoms"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the main symptoms of anxiety?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Main anxiety symptoms include excessive worry, restlessness, rapid heartbeat, difficulty breathing, trouble sleeping, muscle tension, difficulty concentrating, irritability, and avoidance of anxiety-triggering situations."
        }
      },
      {
        "@type": "Question",
        "name": "What does anxiety feel like physically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Physically, anxiety can cause racing heart, sweating, trembling, shortness of breath, chest tightness, nausea, dizziness, tingling sensations, and muscle tension. Some people experience headaches or digestive issues."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know if I have an anxiety disorder?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You may have an anxiety disorder if your worry is excessive, difficult to control, and persists for 6+ months. If anxiety interferes with work, relationships, or daily activities, a mental health professional can provide proper diagnosis."
        }
      },
      {
        "@type": "Question",
        "name": "Can anxiety be cured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While anxiety may not be completely 'cured,' it is highly treatable. Most people experience significant improvement with therapy (especially CBT), medication, lifestyle changes, or a combination of treatments."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.innersparkafrica.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.innersparkafrica.com/blog" },
      { "@type": "ListItem", "position": 3, "name": "Anxiety Symptoms", "item": "https://www.innersparkafrica.com/blog/anxiety-symptoms" }
    ]
  };

  const physicalSymptoms = [
    "Racing or pounding heart (palpitations)",
    "Sweating, even when not hot",
    "Trembling or shaking",
    "Shortness of breath or feeling smothered",
    "Chest pain or tightness",
    "Nausea or stomach upset",
    "Dizziness or lightheadedness",
    "Muscle tension and aches",
    "Headaches",
    "Fatigue despite adequate sleep"
  ];

  const emotionalSymptoms = [
    "Excessive worry that's hard to control",
    "Feeling on edge or restless",
    "Irritability",
    "Fear of losing control",
    "Sense of impending doom",
    "Feeling detached from yourself",
    "Difficulty concentrating",
    "Mind going blank"
  ];

  const behavioralSymptoms = [
    "Avoiding situations that trigger anxiety",
    "Difficulty sleeping or staying asleep",
    "Procrastination due to fear",
    "Seeking constant reassurance",
    "Nervous habits (nail biting, pacing)",
    "Social withdrawal"
  ];

  return (
    <>
      <Helmet>
        <title>Anxiety Symptoms: How to Recognize Signs of Anxiety Disorder | Innerspark</title>
        <meta name="description" content="Learn the physical, emotional, and behavioral symptoms of anxiety. Recognize the signs of anxiety disorder including racing heart, excessive worry, and difficulty sleeping. Know when to seek help." />
        <meta name="keywords" content="anxiety symptoms, signs of anxiety, do I have anxiety, anxiety disorder symptoms, physical symptoms of anxiety, anxiety signs, what does anxiety feel like, anxiety symptoms checklist, generalized anxiety symptoms, panic attack symptoms, anxiety warning signs" />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/anxiety-symptoms" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Anxiety Symptoms: Recognize the Signs of Anxiety Disorder" />
        <meta property="og:description" content="Learn to identify physical, emotional, and behavioral symptoms of anxiety. Know when normal worry becomes an anxiety disorder." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.innersparkafrica.com/blog/anxiety-symptoms" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <meta property="article:published_time" content="2026-01-12" />
        <meta property="article:section" content="Anxiety" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Anxiety Symptoms: Know the Signs" />
        <meta name="twitter:description" content="Recognize the physical, emotional, and behavioral symptoms of anxiety disorder." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      <main>
        <article className="bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img 
              src={anxietyHeroImage} 
              alt="Person experiencing anxiety symptoms"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto">
                <nav className="mb-4">
                  <Link to="/blog" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-primary/80 px-3 py-1 rounded-full text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Link>
                </nav>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Anxiety
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  Anxiety Symptoms: How to Recognize if You Have Anxiety Disorder
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    January 12, 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    10 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://www.innersparkafrica.com/blog/anxiety-symptoms"
                      title="Anxiety Symptoms: How to Recognize Anxiety Disorder"
                      description="Learn to identify the symptoms of anxiety."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                {/* Introduction */}
                <section className="mb-12">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Anxiety is one of the most common mental health conditions, affecting over 300 million people globally. While everyone experiences occasional anxiety, an anxiety disorder involves persistent, excessive worry that interferes with daily life. Learning to recognize anxiety symptoms is the first step toward getting the help you need.
                  </p>
                  
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8">
                    <p className="text-foreground font-medium mb-0">
                      <strong>Key Insight:</strong> According to the <a href="https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">World Health Organization</a>, anxiety disorders are the most prevalent mental disorders worldwide, yet many people don't recognize their symptoms or seek treatment.
                    </p>
                  </div>
                </section>

                {/* Physical Symptoms */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Physical Symptoms of Anxiety</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Anxiety triggers your body's "fight or flight" response, causing very real physical sensations that can be frightening:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {physicalSymptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-3 bg-red-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-foreground">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Emotional Symptoms */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Emotional & Cognitive Symptoms</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Anxiety affects how you think and feel, often creating a cycle of worry that's hard to break:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {emotionalSymptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-foreground">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Behavioral Symptoms */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Behavioral Symptoms</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Anxiety often changes your behavior as you try to avoid or cope with uncomfortable feelings:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {behavioralSymptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-foreground">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Normal Worry vs Anxiety Disorder */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Normal Worry vs. Anxiety Disorder</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="font-semibold text-green-800 mb-4">Normal Worry</h3>
                      <ul className="space-y-2 text-green-700 text-sm">
                        <li>• Related to specific, realistic concerns</li>
                        <li>• Doesn't significantly interfere with life</li>
                        <li>• You can "turn off" the worry</li>
                        <li>• Physical symptoms are mild</li>
                        <li>• Worry passes after the situation resolves</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <h3 className="font-semibold text-amber-800 mb-4">Anxiety Disorder</h3>
                      <ul className="space-y-2 text-amber-700 text-sm">
                        <li>• Excessive, persistent, hard to control</li>
                        <li>• Interferes with work, relationships, daily life</li>
                        <li>• Worry continues even when there's no threat</li>
                        <li>• Causes significant physical symptoms</li>
                        <li>• Lasts 6 months or longer</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* When to Seek Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When to Seek Professional Help</h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Consider reaching out to a mental health professional if:
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Your worry is excessive and difficult to control",
                      "Anxiety interferes with work, school, or relationships",
                      "You avoid situations due to anxiety",
                      "Physical symptoms are distressing or persistent",
                      "You use alcohol or substances to cope",
                      "You're experiencing panic attacks"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Think You Might Have Anxiety?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Take our free anxiety screening test or speak with a licensed therapist today.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/mind-check/anxiety">
                      <Button size="lg" variant="outline">
                        Take Anxiety Test
                      </Button>
                    </Link>
                    <Link to="/specialists">
                      <Button size="lg">
                        Talk to a Therapist
                      </Button>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>

      <RelatedArticles currentSlug="anxiety-symptoms" />
      <Footer />
    </>
  );
};

export default AnxietySymptomsPost;