import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, Check, Heart, Brain, Users, Sun, AlertTriangle, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import mentalHealthHeroImage from "@/assets/blog/mental-health-hero.jpg";

const MentalHealthPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "What Is Mental Health? Conditions, Warning Signs & How to Improve Your Well-Being",
    "description": "Discover what mental health really means, common mental health conditions, early warning signs, and practical ways to improve emotional well-being. Learn when to seek help and how to recognize if you may have a mental health problem.",
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
    "datePublished": "2025-12-09",
    "dateModified": "2026-02-11",
    "inLanguage": "en",
    "keywords": ["mental health", "mental wellness", "mental health conditions", "anxiety", "depression", "emotional well-being", "warning signs"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.innersparkafrica.com/blog/what-is-mental-health"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is mental health the same as mental illness?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Everyone has mental health. Mental illness refers to specific conditions that affect it."
        }
      },
      {
        "@type": "Question",
        "name": "Can mental health improve over time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! With support, habits, and treatment, mental health can improve significantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is it normal to struggle even if life seems fine?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You don't need a 'reason' to struggle."
        }
      },
      {
        "@type": "Question",
        "name": "How do I help a loved one with mental health issues?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Listen, validate, encourage them to seek support, and check in often."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.innersparkafrica.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.innersparkafrica.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "What Is Mental Health",
        "item": "https://www.innersparkafrica.com/blog/what-is-mental-health"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>What Is Mental Health? Conditions, Warning Signs & How to Improve Your Well-Being | Innerspark Africa</title>
        <meta name="description" content="Discover what mental health really means, common mental health conditions, early warning signs, and practical ways to improve emotional well-being. Learn when to seek help and how to recognize if you may have a mental health problem." />
        <meta name="keywords" content="mental health, mental wellness, mental health conditions, anxiety, depression, PTSD, bipolar disorder, ADHD, warning signs, emotional well-being" />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/what-is-mental-health" />
        
        {/* Open Graph */}
        <meta property="og:title" content="What Is Mental Health? A Complete Guide to Conditions, Warning Signs & Everyday Wellness" />
        <meta property="og:description" content="Mental health influences how we think, feel, and act every day. This guide explains what mental health is, common conditions, early warning signs, and proven tools to strengthen your emotional well-being." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.innersparkafrica.com/blog/what-is-mental-health" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <meta property="article:published_time" content="2025-12-09" />
        <meta property="article:author" content="Innerspark Africa" />
        <meta property="article:section" content="Mental Health" />
        <meta property="article:tag" content="mental health" />
        <meta property="article:tag" content="wellness" />
        <meta property="article:tag" content="mental health conditions" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What Is Mental Health? Conditions, Warning Signs & Well-Being" />
        <meta name="twitter:description" content="Learn what mental health means, common conditions, warning signs, and how to improve your well-being." />
        <meta name="twitter:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      <main>
        {/* Hero Section */}
        <article className="bg-background">
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img 
              src={mentalHealthHeroImage} 
              alt="Person embracing sunlight in a peaceful meadow - representing mental wellness and well-being"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto">
                <nav className="mb-4">
                  <Link to="/blog" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-primary/80 px-3 py-1 rounded-full text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Link>
                </nav>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Mental Health
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  What Is Mental Health? A Complete Guide to Conditions, Warning Signs & Everyday Wellness
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    December 9, 2025
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    15 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://innerspark.africa/blog/what-is-mental-health"
                      title="What Is Mental Health? A Complete Guide to Conditions, Warning Signs & Everyday Wellness"
                      description="Mental health influences how we think, feel, and act every day. This guide explains what mental health is, common conditions, and warning signs."
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
                
                {/* Excerpt */}
                <section className="mb-12">
                  <div className="bg-accent/50 border-l-4 border-primary p-6 rounded-r-lg my-8">
                    <p className="text-foreground font-medium text-lg mb-0">
                      Mental health influences how we think, feel, and act every day. This guide explains what mental health is, common conditions, early warning signs, and proven tools to strengthen your emotional well-being.
                    </p>
                  </div>
                </section>

                {/* Introduction */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Introduction</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    Mental health isn't just the absence of mental illness. It's the foundation of how we think, feel, connect with others, and deal with life's challenges. Whether you're handling stress, making decisions, or building relationships, your mental health plays a role behind the scenes.
                  </p>
                  
                  <div className="bg-accent/30 p-6 rounded-xl my-6">
                    <p className="text-foreground mb-2">➡️ <strong>Everyone has mental health.</strong></p>
                    <p className="text-foreground mb-2">➡️ <strong>Everyone can struggle with it.</strong></p>
                    <p className="text-foreground mb-0">➡️ <strong>And everyone can strengthen it.</strong></p>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Good mental health doesn't mean you're happy 24/7. It means you can cope, adapt, and bounce back. When mental health becomes shaky, knowing the early signs—and understanding common conditions—can help you seek support before things escalate.
                  </p>

                  <blockquote className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
                    <p className="text-foreground text-lg mb-0">
                      "With the right strategies, mental health can become more manageable, predictable, and less overwhelming."
                    </p>
                  </blockquote>

                  <p className="text-muted-foreground">
                    This blog breaks everything down in simple, friendly language, with research-backed tips and helpful resources throughout.
                  </p>
                </section>

                {/* What Is Mental Health */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">What Is Mental Health?</h2>
                  <p className="text-muted-foreground mb-6">
                    According to the{" "}
                    <a href="https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      World Health Organization (WHO)
                    </a>, mental health includes:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-secondary p-5 rounded-xl text-center">
                      <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Emotional Well-being</h3>
                      <p className="text-sm text-muted-foreground">How you manage feelings</p>
                    </div>
                    <div className="bg-secondary p-5 rounded-xl text-center">
                      <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Psychological Well-being</h3>
                      <p className="text-sm text-muted-foreground">How you think and make decisions</p>
                    </div>
                    <div className="bg-secondary p-5 rounded-xl text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Social Well-being</h3>
                      <p className="text-sm text-muted-foreground">How you connect with others</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">It affects:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                    <li>How you handle stress</li>
                    <li>How you relate to people</li>
                    <li>How you function at work or school</li>
                    <li>How you make choices</li>
                  </ul>

                  <p className="text-muted-foreground">
                    Mental health matters at <strong>every age</strong>, from childhood to older adulthood.
                  </p>
                </section>

                {/* Common Mental Health Conditions */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Common Mental Health Conditions</h2>
                  <p className="text-muted-foreground mb-8">
                    Mental health conditions are extremely common—1 in 5 adults experience one each year, according to the{" "}
                    <a href="https://www.nimh.nih.gov/health/statistics/mental-illness" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      National Institute of Mental Health (NIMH)
                    </a>.
                  </p>

                  {/* Condition 1 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                      <h3 className="text-2xl font-semibold text-foreground">Anxiety Disorders</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">Symptoms may include:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                      <li>Excessive worry</li>
                      <li>Racing thoughts</li>
                      <li>Trouble sleeping</li>
                      <li>Panic attacks</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Learn more from the{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH Anxiety Disorders page
                      </a>.
                    </p>
                  </div>

                  {/* Condition 2 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                      <h3 className="text-2xl font-semibold text-foreground">Depression</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">A mood disorder marked by:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                      <li>Persistent sadness or emptiness</li>
                      <li>Loss of interest</li>
                      <li>Fatigue</li>
                      <li>Changes in sleep or appetite</li>
                    </ul>
                    <p className="text-muted-foreground">
                      More details at{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH Depression
                      </a>.
                    </p>
                  </div>

                  {/* Condition 3 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                      <h3 className="text-2xl font-semibold text-foreground">PTSD (Post-Traumatic Stress Disorder)</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Triggered by traumatic events. Symptoms include flashbacks, avoidance, and hypervigilance.
                    </p>
                    <p className="text-muted-foreground">
                      More info at{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH PTSD
                      </a>.
                    </p>
                  </div>

                  {/* Condition 4 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">4</span>
                      <h3 className="text-2xl font-semibold text-foreground">Bipolar Disorder</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Involves cycles of depressive and manic episodes.
                    </p>
                    <p className="text-muted-foreground">
                      Learn more at{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/bipolar-disorder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH Bipolar Disorder
                      </a>.
                    </p>
                  </div>

                  {/* Condition 5 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">5</span>
                      <h3 className="text-2xl font-semibold text-foreground">ADHD</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      A neurological condition that affects focus, organization, and impulse control.
                    </p>
                    <p className="text-muted-foreground">
                      Read more at{" "}
                      <a href="https://www.cdc.gov/ncbddd/adhd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        CDC ADHD
                      </a>.
                    </p>
                  </div>

                  {/* Condition 6 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">6</span>
                      <h3 className="text-2xl font-semibold text-foreground">Eating Disorders</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Serious conditions affecting eating habits, body image, and health.
                    </p>
                    <p className="text-muted-foreground">
                      Learn more from{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/eating-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH Eating Disorders
                      </a>.
                    </p>
                  </div>

                  {/* Condition 7 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">7</span>
                      <h3 className="text-2xl font-semibold text-foreground">Substance Use Disorders</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      A condition where substance use affects daily life, relationships, or health.
                    </p>
                    <p className="text-muted-foreground">
                      Details at{" "}
                      <a href="https://www.samhsa.gov/find-help/disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        SAMHSA Substance Use
                      </a>.
                    </p>
                  </div>
                </section>

                {/* Warning Signs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Warning Signs of Mental Health Problems</h2>
                  <p className="text-muted-foreground mb-8">
                    Mental health issues don't always show up dramatically. Sometimes they appear as subtle changes.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Emotional */}
                    <div className="bg-accent/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Emotional Warning Signs</h3>
                      </div>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Feeling sad, numb, or hopeless</li>
                        <li>Sudden mood swings</li>
                        <li>Irritability or anger</li>
                        <li>Feeling overwhelmed for long periods</li>
                      </ul>
                    </div>

                    {/* Behavioral */}
                    <div className="bg-accent/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Behavioral Warning Signs</h3>
                      </div>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Withdrawal from family or friends</li>
                        <li>Loss of interest in activities</li>
                        <li>Decline in work or school performance</li>
                        <li>Avoiding responsibilities</li>
                      </ul>
                    </div>

                    {/* Physical */}
                    <div className="bg-accent/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Sun className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Physical Warning Signs</h3>
                      </div>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Changes in sleep</li>
                        <li>Fatigue</li>
                        <li>Headaches or stomachaches</li>
                        <li>Appetite changes</li>
                      </ul>
                    </div>

                    {/* Cognitive */}
                    <div className="bg-accent/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Cognitive Warning Signs</h3>
                      </div>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Trouble concentrating</li>
                        <li>Memory issues</li>
                        <li>Negative or intrusive thoughts</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    More warning signs are described by the{" "}
                    <a href="https://www.cdc.gov/mentalhealth/learn/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      CDC Mental Health page
                    </a>.
                  </p>
                </section>

                {/* How Do I Know If I Have a Mental Health Problem */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="text-primary">⭐</span> How Do I Know If I Have a Mental Health Problem?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Great question—and one many people are afraid to ask.
                  </p>
                  <p className="text-muted-foreground mb-4">You might be experiencing a mental health issue if:</p>
                  
                  <div className="bg-secondary p-6 rounded-xl my-6">
                    <ul className="space-y-3">
                      {[
                        "Your emotions feel too intense or last too long",
                        "Your daily life is being affected",
                        "You feel unlike yourself",
                        "You struggle to function at work, school, or home",
                        "Your relationships feel strained",
                        "You're overwhelmed and can't pinpoint why"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-muted-foreground">
                          <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Another key sign is when symptoms persist for <strong>two weeks or more</strong>, especially with depression or anxiety.
                  </p>

                  <p className="text-muted-foreground">
                    For deeper guidance, check out{" "}
                    <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      NIMH's "When to Seek Help" guide
                    </a>.
                  </p>
                </section>

                {/* How Can I Improve My Mental Health */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="text-primary">⭐</span> How Can I Improve My Mental Health?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    You don't need a full lifestyle overhaul. Small steps make a big difference. Here are science-backed ways to strengthen mental well-being:
                  </p>

                  {/* Strategy 1 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                      <h3 className="text-2xl font-semibold text-foreground">Build a Support System</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Talk to people who make you feel safe and supported.
                    </p>
                  </div>

                  {/* Strategy 2 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                      <h3 className="text-2xl font-semibold text-foreground">Move Your Body (A Little!)</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Even 10 minutes can boost mood and reduce anxiety. More at{" "}
                      <a href="https://www.cdc.gov/physicalactivity/basics/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        CDC Benefits of Physical Activity
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 3 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                      <h3 className="text-2xl font-semibold text-foreground">Create a Routine</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Routines add structure, which helps regulate mood.
                    </p>
                  </div>

                  {/* Strategy 4 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">4</span>
                      <h3 className="text-2xl font-semibold text-foreground">Prioritize Sleep</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Aim for 7–9 hours. Learn more at the{" "}
                      <a href="https://www.sleepfoundation.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Sleep Foundation
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 5 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">5</span>
                      <h3 className="text-2xl font-semibold text-foreground">Try Mindfulness or Deep Breathing</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Calms the nervous system and reduces stress. Explore{" "}
                      <a href="https://www.mindful.org/meditation/mindfulness-getting-started/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Mindfulness Exercises
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 6 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">6</span>
                      <h3 className="text-2xl font-semibold text-foreground">Limit Alcohol and Substances</h3>
                    </div>
                    <p className="text-muted-foreground">
                      These can worsen depression and anxiety.
                    </p>
                  </div>

                  {/* Strategy 7 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">7</span>
                      <h3 className="text-2xl font-semibold text-foreground">Seek Professional Support</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Therapists, counselors, psychologists, and psychiatrists can help. Find help at{" "}
                      <a href="https://findtreatment.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        SAMHSA Treatment Locator
                      </a>.
                    </p>
                  </div>
                </section>

                {/* What Causes Mental Health Issues */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">What Causes Mental Health Issues?</h2>
                  <p className="text-muted-foreground mb-6">Mental health problems can arise from:</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {["Genetics", "Brain chemistry", "Trauma or stressful life experiences", "Childhood challenges", "Chronic medical conditions", "Social isolation", "Lifestyle factors"].map((cause, index) => (
                      <div key={index} className="bg-accent/30 p-3 rounded-lg text-center">
                        <span className="text-muted-foreground text-sm">{cause}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-muted-foreground">
                    The <strong>biopsychosocial model</strong> explains that mental health is influenced by many factors interacting together.
                  </p>
                </section>

                {/* When to Seek Professional Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When to Seek Professional Help</h2>
                  <p className="text-muted-foreground mb-4">You should consider reaching out when:</p>
                  
                  <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-lg my-6">
                    <ul className="space-y-3">
                      {[
                        "Symptoms last more than a few weeks",
                        "Your functioning is affected",
                        "You feel disconnected from life",
                        "You think you may harm yourself",
                        "You feel overwhelmed and can't manage alone"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-foreground">
                          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-muted-foreground">
                    Need resources? Visit the{" "}
                    <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      NIMH Find Help page
                    </a>.
                  </p>
                </section>

                {/* FAQs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">FAQs About Mental Health</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-3">1. Is mental health the same as mental illness?</h3>
                      <p className="text-muted-foreground">No. Everyone has mental health. Mental illness refers to specific conditions that affect it.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-3">2. Can mental health improve over time?</h3>
                      <p className="text-muted-foreground">Absolutely! With support, habits, and treatment, mental health can improve significantly.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-3">3. Is it normal to struggle even if life seems "fine"?</h3>
                      <p className="text-muted-foreground">Yes. You don't need a "reason" to struggle.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-3">4. How do I help a loved one?</h3>
                      <p className="text-muted-foreground">Listen, validate, encourage them to seek support, and check in often.</p>
                    </div>
                  </div>
                </section>

                {/* Final Thought */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">A Final Thought</h2>
                  <div className="bg-primary/5 p-8 rounded-xl">
                    <p className="text-muted-foreground mb-4">
                      Mental health isn't something you "fix" once—it's something you care for continuously, like physical health. And here's the good news: small, steady actions can make a massive difference over time.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      You don't have to figure everything out today.<br />
                      Just take one small step.<br />
                      Then another.
                    </p>
                    <p className="text-foreground font-semibold text-lg">
                      You deserve peace, support, and well-being.
                    </p>
                  </div>
                </section>

                {/* CTA */}
                <section className="mb-12">
                  <div className="bg-primary/10 p-8 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Need Support?</h3>
                    <p className="text-muted-foreground mb-6">
                      If you're struggling with your mental health, you don't have to face it alone. Our team at Innerspark Africa is here to help.
                    </p>
                    <a 
                      href="https://wa.me/256792085773?text=Hi%2C%20I%20would%20like%20to%20talk%20about%20mental%20health%20support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Talk to Us on WhatsApp
                    </a>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </article>

        {/* <AppDownload /> */}
        <RelatedArticles currentSlug="what-is-mental-health" />
      </main>

      <Footer />
    </>
  );
};

export default MentalHealthPost;
