import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Check, Heart, Brain, Shield, Wind, Activity, Users, Moon, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import anxietyHeroImage from "@/assets/blog/anxiety-management-hero.jpg";

const AnxietyManagementPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Manage Anxiety: Expert-Backed Strategies for Finding Calm",
    "description": "Learn effective, research-backed strategies for managing anxiety. Discover breathing techniques, grounding exercises, lifestyle changes, and when to seek professional help for anxiety relief.",
    "image": "https://innerspark.africa/assets/blog/anxiety-management-hero.jpg",
    "author": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "url": "https://innerspark.africa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://innerspark.africa/innerspark-logo.png"
      }
    },
    "datePublished": "2025-12-09",
    "dateModified": "2025-12-09",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://innerspark.africa/blog/how-to-manage-anxiety"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the 3-3-3 rule for anxiety?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Name 3 things you see, 3 sounds you hear, and move 3 body parts. It's a quick grounding technique to bring you back to the present moment."
        }
      },
      {
        "@type": "Question",
        "name": "Can anxiety be cured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While anxiety may not be 'cured,' it can be managed effectively with the right tools, therapy, and sometimes medication."
        }
      },
      {
        "@type": "Question",
        "name": "When should I seek professional help for anxiety?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Seek help when anxiety interferes with daily life, causes physical symptoms, lasts for weeks, or feels uncontrollable."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between normal worry and anxiety disorder?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Normal worry is occasional and proportional to the situation. Anxiety disorder involves persistent, excessive worry that's hard to control and affects daily functioning."
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
        "item": "https://innerspark.africa"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://innerspark.africa/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "How to Manage Anxiety",
        "item": "https://innerspark.africa/blog/how-to-manage-anxiety"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How to Manage Anxiety: Expert-Backed Strategies for Finding Calm | Innerspark Africa</title>
        <meta name="description" content="Learn effective, research-backed strategies for managing anxiety. Discover breathing techniques, grounding exercises, lifestyle changes, and when to seek professional help for anxiety relief." />
        <meta name="keywords" content="anxiety management, anxiety relief, how to manage anxiety, anxiety coping strategies, anxiety techniques, breathing exercises, grounding techniques, anxiety help" />
        <link rel="canonical" href="https://innerspark.africa/blog/how-to-manage-anxiety" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How to Manage Anxiety: Expert-Backed Strategies for Finding Calm" />
        <meta property="og:description" content="Discover practical, evidence-based techniques to manage anxiety and find peace. Learn breathing exercises, grounding techniques, and lifestyle changes that actually work." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://innerspark.africa/blog/how-to-manage-anxiety" />
        <meta property="og:image" content="https://innerspark.africa/assets/blog/anxiety-management-hero.jpg" />
        <meta property="article:published_time" content="2025-12-09" />
        <meta property="article:author" content="Innerspark Africa" />
        <meta property="article:section" content="Anxiety" />
        <meta property="article:tag" content="anxiety" />
        <meta property="article:tag" content="mental health" />
        <meta property="article:tag" content="coping strategies" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Manage Anxiety: Expert-Backed Strategies" />
        <meta name="twitter:description" content="Practical techniques for managing anxiety, from breathing exercises to lifestyle changes." />
        <meta name="twitter:image" content="https://innerspark.africa/assets/blog/anxiety-management-hero.jpg" />
        
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
              src={anxietyHeroImage} 
              alt="Person practicing meditation in peaceful nature setting - representing anxiety relief and calm"
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
                  Anxiety Management
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  How to Manage Anxiety: Expert-Backed Strategies for Finding Calm
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    December 9, 2025
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    14 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://innerspark.africa/blog/how-to-manage-anxiety"
                      title="How to Manage Anxiety: Expert-Backed Strategies for Finding Calm"
                      description="Discover practical, evidence-based techniques to manage anxiety and find peace."
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
                      Anxiety can feel overwhelming, but you don't have to face it alone. This guide provides practical, research-backed strategies to help you manage anxiety, find calm, and reclaim your peace of mind.
                    </p>
                  </div>
                </section>

                {/* Introduction */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Introduction</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    Anxiety is one of the most common mental health experiences worldwide. It's that racing heart before a big presentation, the endless "what ifs" at 3 AM, or the constant tension that won't let go. While some anxiety is normal and even helpful, chronic anxiety can interfere with your daily life, relationships, and overall well-being.
                  </p>
                  
                  <div className="bg-accent/30 p-6 rounded-xl my-6">
                    <p className="text-foreground mb-2">✨ <strong>The good news?</strong></p>
                    <p className="text-foreground mb-0">Anxiety is highly treatable, and there are many effective strategies to manage it—from simple breathing techniques to professional therapy.</p>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    According to the{" "}
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      National Institute of Mental Health (NIMH)
                    </a>, anxiety disorders affect nearly 31% of adults at some point in their lives. Understanding what anxiety is and learning practical coping tools can make all the difference.
                  </p>

                  <blockquote className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
                    <p className="text-foreground text-lg mb-0">
                      "You don't have to control your thoughts. You just have to stop letting them control you."
                    </p>
                    <footer className="text-muted-foreground mt-2">— Dan Millman</footer>
                  </blockquote>
                </section>

                {/* Understanding Anxiety */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Understanding Anxiety</h2>
                  <p className="text-muted-foreground mb-6">
                    Anxiety is your body's natural response to stress. It's the fight-or-flight system activating to protect you from perceived danger. The problem arises when this system becomes overactive or triggers without real threats.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-secondary p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-3">Physical Symptoms</h3>
                      <ul className="text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Racing heart or palpitations
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Shortness of breath
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Muscle tension
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Sweating or trembling
                        </li>
                      </ul>
                    </div>
                    <div className="bg-secondary p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-3">Mental Symptoms</h3>
                      <ul className="text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Excessive worry
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Racing or intrusive thoughts
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Difficulty concentrating
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          Fear of losing control
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    Learn more about anxiety symptoms from the{" "}
                    <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      American Psychological Association (APA)
                    </a>.
                  </p>
                </section>

                {/* Types of Anxiety */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Types of Anxiety Disorders</h2>
                  <p className="text-muted-foreground mb-6">
                    Anxiety comes in different forms. Understanding which type you may be experiencing can help guide treatment:
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-secondary/50 p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Generalized Anxiety Disorder (GAD)</h3>
                      <p className="text-muted-foreground text-sm">Persistent, excessive worry about many different things for at least 6 months.</p>
                    </div>
                    <div className="bg-secondary/50 p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Social Anxiety Disorder</h3>
                      <p className="text-muted-foreground text-sm">Intense fear of social situations and being judged or embarrassed.</p>
                    </div>
                    <div className="bg-secondary/50 p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Panic Disorder</h3>
                      <p className="text-muted-foreground text-sm">Recurrent, unexpected panic attacks and fear of having more attacks.</p>
                    </div>
                    <div className="bg-secondary/50 p-5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Specific Phobias</h3>
                      <p className="text-muted-foreground text-sm">Intense fear of specific objects or situations (heights, spiders, flying, etc.).</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    For detailed information, visit the{" "}
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      NIMH Anxiety Disorders page
                    </a>.
                  </p>
                </section>

                {/* Effective Strategies */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Effective Strategies to Manage Anxiety</h2>
                  <p className="text-muted-foreground mb-8">
                    Here are proven, practical techniques to help you manage anxiety in your daily life:
                  </p>

                  {/* Strategy 1 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                      <h3 className="text-2xl font-semibold text-foreground">Practice Deep Breathing</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Deep breathing activates your parasympathetic nervous system, signaling your body to calm down. Try the 4-7-8 technique:
                    </p>
                    <div className="bg-background p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Wind className="h-5 w-5 text-primary" />
                        <span className="text-foreground font-medium">4-7-8 Breathing</span>
                      </div>
                      <ul className="text-muted-foreground space-y-1 pl-8">
                        <li>• Breathe in through your nose for 4 seconds</li>
                        <li>• Hold your breath for 7 seconds</li>
                        <li>• Exhale slowly through your mouth for 8 seconds</li>
                        <li>• Repeat 3-4 times</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground">
                      Learn more breathing techniques from{" "}
                      <a href="https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Harvard Health
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 2 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                      <h3 className="text-2xl font-semibold text-foreground">Use Grounding Techniques</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Grounding brings you back to the present moment when anxiety pulls you into "what ifs." Try the 5-4-3-2-1 technique:
                    </p>
                    <div className="bg-background p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-foreground font-medium">5-4-3-2-1 Grounding</span>
                      </div>
                      <ul className="text-muted-foreground space-y-1 pl-8">
                        <li>• <strong>5</strong> things you can see</li>
                        <li>• <strong>4</strong> things you can touch</li>
                        <li>• <strong>3</strong> things you can hear</li>
                        <li>• <strong>2</strong> things you can smell</li>
                        <li>• <strong>1</strong> thing you can taste</li>
                      </ul>
                    </div>
                  </div>

                  {/* Strategy 3 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                      <h3 className="text-2xl font-semibold text-foreground">Challenge Anxious Thoughts</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Anxiety often involves cognitive distortions—patterns of thinking that aren't accurate. Challenge them by asking:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Is this thought based on facts or feelings?
                      </li>
                      <li className="flex items-start gap-2">
                        <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        What's the worst that could happen? How likely is it?
                      </li>
                      <li className="flex items-start gap-2">
                        <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        What would I tell a friend in this situation?
                      </li>
                    </ul>
                    <p className="text-muted-foreground">
                      This is a core technique in{" "}
                      <a href="https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Cognitive Behavioral Therapy (CBT)
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 4 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">4</span>
                      <h3 className="text-2xl font-semibold text-foreground">Move Your Body</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Physical activity is one of the most effective natural anxiety relievers. Exercise releases endorphins and reduces cortisol.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-background p-3 rounded-lg text-center">
                        <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">10-min walk</span>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-center">
                        <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">Yoga or stretching</span>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-center">
                        <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">Dancing</span>
                      </div>
                      <div className="bg-background p-3 rounded-lg text-center">
                        <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">Swimming</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      The{" "}
                      <a href="https://www.cdc.gov/physicalactivity/basics/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        CDC
                      </a>{" "}
                      recommends at least 150 minutes of moderate exercise per week.
                    </p>
                  </div>

                  {/* Strategy 5 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">5</span>
                      <h3 className="text-2xl font-semibold text-foreground">Limit Caffeine and Alcohol</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Both substances can worsen anxiety symptoms:
                    </p>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <strong>Caffeine</strong> increases heart rate and can trigger panic symptoms
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <strong>Alcohol</strong> may feel calming initially but disrupts sleep and worsens anxiety long-term
                      </li>
                    </ul>
                  </div>

                  {/* Strategy 6 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">6</span>
                      <h3 className="text-2xl font-semibold text-foreground">Prioritize Sleep</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Poor sleep and anxiety create a vicious cycle. Improve your sleep hygiene:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <Moon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Maintain a consistent sleep schedule
                      </li>
                      <li className="flex items-start gap-2">
                        <Moon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Create a relaxing bedtime routine
                      </li>
                      <li className="flex items-start gap-2">
                        <Moon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Limit screens 1 hour before bed
                      </li>
                      <li className="flex items-start gap-2">
                        <Moon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Keep your bedroom cool and dark
                      </li>
                    </ul>
                    <p className="text-muted-foreground">
                      Learn more at the{" "}
                      <a href="https://www.sleepfoundation.org/mental-health/anxiety-and-sleep" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Sleep Foundation
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 7 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">7</span>
                      <h3 className="text-2xl font-semibold text-foreground">Practice Mindfulness</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Mindfulness helps you observe anxious thoughts without getting swept away by them. Regular practice can rewire your brain's response to stress.
                    </p>
                    <div className="bg-background p-4 rounded-lg mb-4">
                      <p className="text-foreground font-medium mb-2">Simple mindfulness practice:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Set a timer for 5 minutes</li>
                        <li>• Focus on your breath</li>
                        <li>• When your mind wanders, gently return to the breath</li>
                        <li>• No judgment—just observation</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground">
                      Explore guided meditations at{" "}
                      <a href="https://www.mindful.org/meditation/mindfulness-getting-started/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Mindful.org
                      </a>.
                    </p>
                  </div>

                  {/* Strategy 8 */}
                  <div className="mb-8 bg-secondary/50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">8</span>
                      <h3 className="text-2xl font-semibold text-foreground">Build Your Support System</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You don't have to manage anxiety alone. Connection is a powerful antidote to anxiety:
                    </p>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Talk to trusted friends or family
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Join support groups (online or in-person)
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Work with a therapist or counselor
                      </li>
                    </ul>
                  </div>
                </section>

                {/* When to Seek Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When to Seek Professional Help</h2>
                  <p className="text-muted-foreground mb-6">
                    While self-help strategies are valuable, sometimes professional support is needed. Consider reaching out if:
                  </p>
                  <ul className="text-muted-foreground space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Anxiety interferes with work, relationships, or daily activities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>You experience panic attacks regularly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Symptoms persist for more than 2-4 weeks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>You use alcohol or substances to cope</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>You have thoughts of self-harm</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Find professional help through the{" "}
                    <a href="https://www.nimh.nih.gov/health/find-help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      NIMH Find Help page
                    </a>{" "}
                    or{" "}
                    <a href="https://findtreatment.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      SAMHSA Treatment Locator
                    </a>.
                  </p>
                </section>

                {/* FAQs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-secondary/30 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-foreground mb-2">What is the 3-3-3 rule for anxiety?</h3>
                      <p className="text-muted-foreground">
                        Name 3 things you see, 3 sounds you hear, and move 3 body parts. It's a quick grounding technique to bring you back to the present moment.
                      </p>
                    </div>

                    <div className="bg-secondary/30 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Can anxiety be cured?</h3>
                      <p className="text-muted-foreground">
                        While anxiety may not be "cured," it can be managed effectively with the right tools, therapy, and sometimes medication. Many people learn to live fulfilling lives with anxiety.
                      </p>
                    </div>

                    <div className="bg-secondary/30 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-foreground mb-2">When should I seek professional help for anxiety?</h3>
                      <p className="text-muted-foreground">
                        Seek help when anxiety interferes with daily life, causes physical symptoms, lasts for weeks, or feels uncontrollable. A mental health professional can provide personalized treatment.
                      </p>
                    </div>

                    <div className="bg-secondary/30 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-foreground mb-2">What's the difference between normal worry and anxiety disorder?</h3>
                      <p className="text-muted-foreground">
                        Normal worry is occasional and proportional to the situation. Anxiety disorder involves persistent, excessive worry that's hard to control and affects daily functioning.
                      </p>
                    </div>
                  </div>
                </section>

                {/* External Resources */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Helpful Resources</h2>
                  <ul className="space-y-3">
                    <li>
                      <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        NIMH Anxiety Disorders
                      </a>
                    </li>
                    <li>
                      <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        APA Anxiety Resources
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cdc.gov/mentalhealth/learn/index.htm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        CDC Mental Health Tools
                      </a>
                    </li>
                    <li>
                      <a href="https://www.mindful.org/meditation/mindfulness-getting-started/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Mindfulness Getting Started Guide
                      </a>
                    </li>
                    <li>
                      <a href="https://findtreatment.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        SAMHSA Treatment Locator
                      </a>
                    </li>
                  </ul>
                </section>

                {/* Closing */}
                <section className="mb-12">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/30 p-8 rounded-2xl">
                    <Sparkles className="h-10 w-10 text-primary mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-4">A Gentle Reminder</h2>
                    <p className="text-foreground text-lg mb-4">
                      Anxiety may feel like it controls you, but with practice, patience, and support, you can learn to manage it. Every small step you take—every deep breath, every grounding exercise, every moment of self-compassion—builds your resilience.
                    </p>
                    <p className="text-foreground text-lg mb-0">
                      <strong>You are not your anxiety. You are so much more.</strong>
                    </p>
                  </div>
                </section>

                {/* Share */}
                <section className="mb-12">
                  <div className="border-t border-b border-border py-6">
                    <p className="text-foreground font-medium mb-4">Share this article to help others:</p>
                    <SocialShareButtons 
                      url="https://innerspark.africa/blog/how-to-manage-anxiety"
                      title="How to Manage Anxiety: Expert-Backed Strategies for Finding Calm"
                      description="Discover practical, evidence-based techniques to manage anxiety and find peace."
                    />
                  </div>
                </section>

                {/* CTA */}
                <section>
                  <div className="bg-primary text-primary-foreground p-8 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Need Support Managing Anxiety?</h2>
                    <p className="mb-6 opacity-90">
                      Our trained counselors are here to help you develop personalized coping strategies and find lasting relief.
                    </p>
                    <a 
                      href="https://wa.me/256792085773?text=Hi%2C%20I%20need%20help%20managing%20my%20anxiety.%20I%20would%20like%20to%20speak%20with%20a%20counselor."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-background/90 transition-colors"
                    >
                      Talk to a Counselor
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* <AppDownload /> */}
      <Footer />
    </>
  );
};

export default AnxietyManagementPost;
