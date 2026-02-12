import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, Check, Heart, Sparkles, Users, Brain, Sun } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import depressionHeroImage from "@/assets/blog/depression-hero.jpg";

const DepressionPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "How to Deal With Depression: Effective Tools, Support & Daily Strategies",
    "description": "Learn how to deal with depression using expert-approved strategies, evidence-based tools, and supportive habits. Understand symptoms, reduce avoidance, rebuild motivation, and take small steps toward healing.",
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
    "datePublished": "2025-12-08",
    "dateModified": "2026-02-11",
    "inLanguage": "en",
    "keywords": ["depression", "deal with depression", "depression treatment", "mental health", "coping strategies", "behavioral activation", "therapy"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.innersparkafrica.com/blog/how-to-deal-with-depression"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why can't I snap out of depression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because depression affects brain chemistry. It's not a choice."
        }
      },
      {
        "@type": "Question",
        "name": "Is it normal to feel numb with depression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Emotional numbness is a common symptom of depression."
        }
      },
      {
        "@type": "Question",
        "name": "How long does depression last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It varies. Some episodes last weeks, others months. Treatment shortens its length."
        }
      },
      {
        "@type": "Question",
        "name": "Should I tell loved ones about my depression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you feel safe, yes. Support helps recovery."
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
        "name": "How to Deal With Depression",
        "item": "https://www.innersparkafrica.com/blog/how-to-deal-with-depression"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How to Deal With Depression: Effective Tools, Support & Daily Strategies | Innerspark Africa</title>
        <meta name="description" content="Learn how to deal with depression using expert-approved strategies, evidence-based tools, and supportive habits. Understand symptoms, reduce avoidance, rebuild motivation, and take small steps toward healing." />
        <meta name="keywords" content="depression, deal with depression, depression treatment, mental health, coping strategies, behavioral activation, therapy, depression recovery" />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/how-to-deal-with-depression" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How to Deal With Depression? Simple, Compassionate Strategies That Actually Help" />
        <meta property="og:description" content="Depression can feel heavy and isolating, but you're not alone—and you're not stuck. Here's a clear, gentle, research-backed guide to dealing with depression." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.innersparkafrica.com/blog/how-to-deal-with-depression" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <meta property="article:published_time" content="2025-12-08" />
        <meta property="article:author" content="Innerspark Africa" />
        <meta property="article:section" content="Depression" />
        <meta property="article:tag" content="depression" />
        <meta property="article:tag" content="mental health" />
        <meta property="article:tag" content="healing" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Deal With Depression: Expert-Backed Tools" />
        <meta name="twitter:description" content="Learn practical strategies to cope with depression using evidence-based tools." />
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
              src={depressionHeroImage} 
              alt="Person sitting by a window with warm sunlight streaming in, surrounded by plants - representing hope and healing from depression"
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
                  Depression Support
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  How to Deal With Depression? Simple, Compassionate Strategies That Actually Help
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    December 8, 2025
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    12 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://www.innersparkafrica.com/blog/how-to-deal-with-depression"
                      title="How to Deal With Depression? Simple, Compassionate Strategies That Actually Help"
                      description="Learn how to deal with depression using expert-approved strategies and supportive habits."
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
                      Depression can feel heavy and isolating, but you're not alone—and you're not stuck. Here's a clear, gentle, research-backed guide to dealing with depression using small actions, supportive habits, and professional insights.
                    </p>
                  </div>
                </section>

                {/* Introduction */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Introduction</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    Depression is more than just feeling sad—it's a deep emotional, physical, and mental slowdown that can touch every part of your life. It can make getting out of bed feel impossible, sap your energy, and convince you that nothing will ever change. But here's something important to remember:
                  </p>
                  
                  <div className="bg-accent/30 p-6 rounded-xl my-6">
                    <p className="text-foreground mb-2">👉 <strong>Depression isn't a personal failure.</strong></p>
                    <p className="text-foreground mb-0">👉 <strong>It's a real condition with real treatments that help.</strong></p>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    According to WellPower clinician <strong>Lexxus Washington, LSW</strong>, depression doesn't have a "cure," but it <em>does</em> have multiple layers and many options for relief. The first step is understanding whether you're experiencing depressive <strong>feelings</strong> or a <strong>depressive disorder</strong>, because each level benefits from different types of support, tools, and treatment.
                  </p>

                  <blockquote className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
                    <p className="text-foreground text-lg mb-2">
                      "With the right strategies, depression can become more manageable, predictable, and less overwhelming."
                    </p>
                    <cite className="text-muted-foreground not-italic">— Lexxus Washington, LSW</cite>
                  </blockquote>

                  <p className="text-muted-foreground">
                    This blog walks you through expert-backed steps to deal with depression in compassionate, realistic ways—without pressure, shame, or "just think positive" nonsense.
                  </p>
                </section>

                {/* What Depression Really Is */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">What Depression Really Is (and Isn't)</h2>
                  <p className="text-muted-foreground mb-6">
                    Depression affects both the mind and body. Symptoms can include:
                  </p>

                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                    <li>Low mood</li>
                    <li>Numbness or emptiness</li>
                    <li>Loss of interest in activities</li>
                    <li>Fatigue</li>
                    <li>Problems sleeping</li>
                    <li>Difficulty concentrating</li>
                    <li>Feelings of guilt or worthlessness</li>
                  </ul>

                  <p className="text-muted-foreground mb-6">
                    A full explanation of symptoms can be found at the{" "}
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      National Institute of Mental Health (NIMH)
                    </a>.
                  </p>

                  <div className="bg-secondary p-6 rounded-xl my-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">What depression isn't:</h3>
                    <ul className="list-none space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-destructive">✗</span> Laziness
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-destructive">✗</span> A weakness
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-destructive">✗</span> Something you can "snap out of"
                      </li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground">
                    Depression changes brain chemistry, thinking patterns, and energy levels. Treating it with compassion—not criticism—is essential.
                  </p>
                </section>

                {/* Breaking the Depression Cycle */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Breaking the "Depression Cycle"</h2>
                  <p className="text-muted-foreground mb-6">
                    Depression creates a vicious cycle:
                  </p>

                  <div className="bg-accent/30 p-6 rounded-xl my-6 text-center">
                    <p className="text-foreground font-semibold text-lg">
                      Depression → Low energy → Avoidance → Feeling worse → More depression
                    </p>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Avoidance feels good in the moment ("I'll do it later"), but makes depression heavier over time. Washington emphasizes that one of the most effective tools is <strong>Behavioral Activation</strong>—a research-backed method that focuses on doing small, meaningful activities to lift mood gradually.
                  </p>

                  <p className="text-muted-foreground">
                    Learn more about this method through the{" "}
                    <a href="https://www.apa.org/depression-guideline/patient-guide" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      American Psychological Association's guide
                    </a>.
                  </p>
                </section>

                {/* Effective Ways to Deal With Depression */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Effective Ways to Deal With Depression</h2>
                  <p className="text-muted-foreground mb-8">
                    Here are actionable, gentle strategies supported by mental health professionals.
                  </p>

                  {/* Strategy 1 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                      <h3 className="text-2xl font-semibold text-foreground">Track Your Moods and Activities</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Depression clouds memory, making it hard to notice patterns. Mood tracking helps you see:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                      <li>What lifts you up</li>
                      <li>What drains you</li>
                      <li>What triggers dips</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                      Try journaling or using apps like Daylio or MoodKit. Simple prompts like:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg space-y-2 mb-4">
                      <p className="text-muted-foreground italic">"Today I felt…"</p>
                      <p className="text-muted-foreground italic">"What helped me feel 1% better?"</p>
                      <p className="text-muted-foreground italic">"What drained me today?"</p>
                    </div>
                    <p className="text-muted-foreground">can reveal powerful insights.</p>
                  </div>

                  {/* Strategy 2 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                      <h3 className="text-2xl font-semibold text-foreground">Start Small—Very Small</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      When you're depressed, big tasks feel impossible. Small tasks feel manageable. Examples of micro-goals:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {["Sit up in bed", "Drink a glass of water", "Open the shades", "Put on clean clothes", "Step outside for 30 seconds"].map((goal, index) => (
                        <div key={index} className="bg-accent/30 p-3 rounded-lg text-center">
                          <Check className="h-5 w-5 text-primary mx-auto mb-1" />
                          <span className="text-muted-foreground text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      These micro-wins build momentum, which is exactly what depression steals.
                    </p>
                    <p className="text-muted-foreground">
                      The{" "}
                      <a href="https://www.cdc.gov/mentalhealth/learn/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        CDC's mental health tools
                      </a>{" "}
                      offer more small, healthy habits to practice.
                    </p>
                  </div>

                  {/* Strategy 3 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                      <h3 className="text-2xl font-semibold text-foreground">Build an "Upward Spiral" of Activities</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Depression creates a downward spiral, but you can reverse it with tiny sparks of joy. Try 5 minutes of:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {[
                        { icon: <Sparkles className="h-5 w-5" />, text: "Reading" },
                        { icon: <Heart className="h-5 w-5" />, text: "Watering a plant" },
                        { icon: <Sparkles className="h-5 w-5" />, text: "Listening to music" },
                        { icon: <Heart className="h-5 w-5" />, text: "Stretching" },
                        { icon: <Sun className="h-5 w-5" />, text: "Sitting in the sun" },
                        { icon: <Sparkles className="h-5 w-5" />, text: "Coloring or drawing" }
                      ].map((item, index) => (
                        <div key={index} className="bg-secondary p-3 rounded-lg text-center">
                          <span className="text-primary mx-auto mb-1 flex justify-center">{item.icon}</span>
                          <span className="text-muted-foreground text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Little by little, these small actions tell your brain, <em>"Life has moments worth showing up for."</em>
                    </p>
                  </div>

                  {/* Strategy 4 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">4</span>
                      <h3 className="text-2xl font-semibold text-foreground">Identify Your Values and Goals</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Washington recommends choosing even one simple, meaningful goal like:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                      <li>"Shower three times a week"</li>
                      <li>"Eat one nourishing meal daily"</li>
                      <li>"Take a walk twice a week"</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Even small goals create structure and purpose, which depression often strips away.
                    </p>
                  </div>

                  {/* Strategy 5 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">5</span>
                      <h3 className="text-2xl font-semibold text-foreground">Reduce Avoidance (Gently)</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Avoidance is depression's best friend—and your worst enemy. But instead of "Get everything done right now," try:
                    </p>
                    <div className="bg-accent/30 p-6 rounded-xl my-6">
                      <p className="text-foreground font-semibold text-lg text-center mb-4">👉 Do 1% of the task.</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Wash one dish</li>
                        <li>Respond to one message</li>
                        <li>Fold one piece of laundry</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground">
                      Small actions weaken depression's grip.
                    </p>
                  </div>

                  {/* Strategy 6 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">6</span>
                      <h3 className="text-2xl font-semibold text-foreground">Use Support Systems</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No one heals alone. Support can include:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {[
                        { icon: <Users className="h-5 w-5" />, text: "Friends" },
                        { icon: <Heart className="h-5 w-5" />, text: "Family" },
                        { icon: <Brain className="h-5 w-5" />, text: "Therapists" },
                        { icon: <Users className="h-5 w-5" />, text: "Support groups" },
                        { icon: <Heart className="h-5 w-5" />, text: "Community centers" }
                      ].map((item, index) => (
                        <div key={index} className="bg-secondary p-3 rounded-lg text-center">
                          <span className="text-primary mx-auto mb-1 flex justify-center">{item.icon}</span>
                          <span className="text-muted-foreground text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      If you're unsure where to start, check out the{" "}
                      <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH resources for finding help
                      </a>.
                    </p>
                    <p className="text-muted-foreground font-medium">
                      Reaching out isn't weakness—it's strength.
                    </p>
                  </div>

                  {/* Strategy 7 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">7</span>
                      <h3 className="text-2xl font-semibold text-foreground">Practice Self-Compassion (Not Pressure)</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Depression already weighs heavily. The last thing you need is self-blame. Try shifting your inner voice from:
                    </p>
                    <div className="bg-secondary p-6 rounded-xl my-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-destructive text-xl">❌</span>
                        <span className="text-muted-foreground">"Why can't I do anything right?"</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-primary text-xl">✔</span>
                        <span className="text-foreground font-medium">"This is really hard, and I'm doing the best I can."</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Research shows self-compassion improves emotional resilience. Learn more at the{" "}
                      <a href="https://www.apa.org/topics" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        APA's mental health page
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 8 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">8</span>
                      <h3 className="text-2xl font-semibold text-foreground">Consider Therapy and/or Medication</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      There is <em>no shame</em> in needing professional help. Options include:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                      <li>Cognitive Behavioral Therapy (CBT)</li>
                      <li>Behavioral Activation</li>
                      <li>Interpersonal Therapy</li>
                      <li>Medication (SSRIs, SNRIs, etc.)</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                      Therapy helps you understand patterns, build coping tools, and find support. Medication helps correct chemical imbalances when depression affects functioning.
                    </p>
                    <p className="text-muted-foreground">
                      Learn more at the{" "}
                      <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        NIMH treatment overview
                      </a>.
                    </p>
                  </div>
                </section>

                {/* Daily Habits */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Daily Habits That Gently Support Depression Recovery</h2>
                  <p className="text-muted-foreground mb-6">
                    These habits don't need to be perfect—just practiced.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Light movement", desc: "Even 5 minutes makes a difference." },
                      { title: "Hydration", desc: "Low water = lower mood and energy." },
                      { title: "Basic nutrition", desc: "Small meals, simple foods." },
                      { title: "Sunlight", desc: "Boosts serotonin and resets your body clock." },
                      { title: "Sleep routine", desc: "Go to bed and wake up at similar times." },
                      { title: "Limit alcohol", desc: "It worsens depressive symptoms." }
                    ].map((habit, index) => (
                      <div key={index} className="bg-secondary p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">{habit.title}</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">{habit.desc}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-muted-foreground mt-6 font-medium text-center">
                    Small habits = big impact over time.
                  </p>
                </section>

                {/* When to Seek Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When Should I Seek Professional Help?</h2>
                  <p className="text-muted-foreground mb-4">
                    It's time to reach out if you notice:
                  </p>

                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                    <li>Depression lasting 2+ weeks</li>
                    <li>Thoughts of self-harm</li>
                    <li>Inability to function normally</li>
                    <li>Extreme fatigue</li>
                    <li>Sudden withdrawal from loved ones</li>
                    <li>Loss of interest in everything</li>
                  </ul>

                  <p className="text-muted-foreground mb-4">
                    If you're unsure, here's a helpful resource from NIMH:{" "}
                    <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      When to Seek Help
                    </a>
                  </p>

                  <div className="bg-primary/10 p-6 rounded-xl">
                    <p className="text-foreground font-semibold text-center text-lg">
                      You deserve support.
                    </p>
                  </div>
                </section>

                {/* FAQs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">FAQs About Dealing With Depression</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-2">1. Why can't I "snap out of it"?</h3>
                      <p className="text-muted-foreground">Because depression affects brain chemistry. It's not a choice.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-2">2. Is it normal to feel numb?</h3>
                      <p className="text-muted-foreground">Yes. Emotional numbness is a common symptom.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-2">3. How long does depression last?</h3>
                      <p className="text-muted-foreground">It varies. Some episodes last weeks, others months. Treatment shortens its length.</p>
                    </div>

                    <div className="bg-secondary p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-foreground mb-2">4. Should I tell loved ones?</h3>
                      <p className="text-muted-foreground">If you feel safe, yes. Support helps recovery.</p>
                    </div>
                  </div>
                </section>

                {/* External Resources */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Helpful External Resources</h2>
                  
                  <div className="bg-secondary p-6 rounded-xl">
                    <ul className="space-y-3">
                      <li>
                        <a href="https://www.apa.org/depression-guideline/patient-guide" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          APA Depression Resource
                        </a>
                      </li>
                      <li>
                        <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          NIMH Depression Overview
                        </a>
                      </li>
                      <li>
                        <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          NIMH Find Help
                        </a>
                      </li>
                      <li>
                        <a href="https://www.cdc.gov/mentalhealth/learn/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          CDC Mental Health Tools
                        </a>
                      </li>
                      <li>
                        <a href="https://www.apa.org/topics" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          APA Mental Health Topics
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Final Note */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">A Gentle Final Note</h2>
                  
                  <div className="bg-gradient-to-br from-primary/10 to-accent/30 p-8 rounded-xl">
                    <p className="text-muted-foreground mb-4">
                      Depression tells you that you're stuck.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      It tells you that your efforts don't matter.
                    </p>
                    <p className="text-muted-foreground mb-6">
                      It whispers that nothing will ever change.
                    </p>
                    <p className="text-foreground font-semibold text-xl mb-6">
                      But depression lies.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Every small action you take—every moment of courage, every tiny step—chips away at it.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      You don't have to climb a mountain today.
                    </p>
                    <p className="text-muted-foreground mb-6">
                      You just have to take one small step forward.
                    </p>
                    <p className="text-foreground font-bold text-xl">
                      You're not alone. And healing <em>is</em> possible.
                    </p>
                  </div>
                </section>

                {/* CTA */}
                <section className="mb-12">
                  <div className="bg-primary text-primary-foreground p-8 rounded-xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Talk to Someone?</h2>
                    <p className="mb-6 opacity-90">
                      Our compassionate therapists are here to support your journey toward healing.
                    </p>
                    <a 
                      href="https://wa.me/256792085773?text=Hi%2C%20I%20read%20your%20blog%20about%20depression%20and%20would%20like%20to%20speak%20with%20a%20therapist"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-background/90 transition-colors"
                    >
                      Talk to a Therapist
                    </a>
                  </div>
                </section>

                {/* Share */}
                <section className="border-t border-border pt-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground font-medium">Share this article:</p>
                    <SocialShareButtons 
                      url="https://www.innersparkafrica.com/blog/how-to-deal-with-depression"
                      title="How to Deal With Depression? Simple, Compassionate Strategies That Actually Help"
                      description="Learn how to deal with depression using expert-approved strategies and supportive habits."
                    />
                  </div>
                </section>

              </div>
            </div>
          </div>
        </article>
      </main>

      <RelatedArticles currentSlug="how-to-deal-with-depression" />
      {/* <AppDownload /> */}
      <Footer />
    </>
  );
};

export default DepressionPost;