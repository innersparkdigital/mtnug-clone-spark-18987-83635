import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import groundingImage from "@/assets/blog/grounding-5-4-3-2-1-infographic.png";
import panicHeroImage from "@/assets/blog/panic-attack-hero.jpg";

const PanicAttackPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "How Do I Stop a Panic Attack? Proven Grounding & Breathing Tools to Calm Down",
    "description": "Learn how to stop or reduce the intensity of a panic attack using grounding techniques, sensory tools, and expert-backed breathing exercises. Practical steps to regain calm quickly.",
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
    "datePublished": "2025-12-06",
    "dateModified": "2026-02-11",
    "inLanguage": "en",
    "keywords": ["panic attack", "stop panic attack", "grounding techniques", "breathing exercises", "anxiety relief", "panic disorder"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long do panic attacks last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Usually 10–15 minutes, although you may feel tired afterward."
        }
      },
      {
        "@type": "Question",
        "name": "Can panic attacks harm me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. They feel scary but are not physically dangerous."
        }
      },
      {
        "@type": "Question",
        "name": "Can breathing really stop panic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes—slow breathing signals to your brain that you're safe."
        }
      },
      {
        "@type": "Question",
        "name": "Should I avoid triggers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avoiding everything that scares you can increase anxiety long-term. It's better to learn coping tools."
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
        "name": "How to Stop a Panic Attack",
        "item": "https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How Do I Stop a Panic Attack? Proven Grounding & Breathing Tools | Innerspark Africa</title>
        <meta name="description" content="Learn how to stop or reduce the intensity of a panic attack using grounding techniques, sensory tools, and expert-backed breathing exercises. Practical steps to regain calm quickly." />
        <meta name="keywords" content="panic attack, stop panic attack, grounding techniques, breathing exercises, anxiety relief, mental health, calm down fast, panic disorder" />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How Do I Stop a Panic Attack? Simple, Fast Techniques to Regain Control" />
        <meta property="og:description" content="Panic attacks can feel terrifying, but with the right tools, you can ease their intensity and return to balance." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <meta property="article:published_time" content="2025-12-06" />
        <meta property="article:author" content="Innerspark Africa" />
        <meta property="article:section" content="Mental Health" />
        <meta property="article:tag" content="panic attack" />
        <meta property="article:tag" content="mental health" />
        <meta property="article:tag" content="anxiety" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Do I Stop a Panic Attack? Expert-Backed Tools" />
        <meta name="twitter:description" content="Learn practical techniques to stop or reduce the intensity of a panic attack." />
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
              src={panicHeroImage} 
              alt="Person meditating peacefully by a window with soft morning light - representing calm and recovery from panic attacks"
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
                  Panic Management
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  How Do I Stop a Panic Attack? Simple, Fast Techniques to Regain Control
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    December 6, 2025
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    10 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack"
                      title="How Do I Stop a Panic Attack? Simple, Fast Techniques to Regain Control"
                      description="Learn how to stop or reduce the intensity of a panic attack using grounding techniques."
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
                      Panic attacks can feel terrifying, but with the right tools, you can ease their intensity and return to balance. Here's what mental health professionals say about stopping panic attacks—plus practical techniques you can use right away.
                    </p>
                  </div>
                </section>

                {/* Introduction */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Introduction</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    If you've ever experienced a panic attack, you know how frightening it can be. Your heart pounds, your breath shortens, your chest tightens, and suddenly your mind jumps to the worst-case scenario. For many people, the first panic attack feels so intense that they fear they're having a heart attack.
                  </p>
                  
                  <p className="text-muted-foreground mb-6">
                    According to WellPower clinician Lexxus Washington, LSW, panic attacks usually last 10–15 minutes, even though those minutes can feel endless. She explains that you can't always stop a panic attack completely, but you can significantly reduce its intensity by accepting it and grounding yourself.
                  </p>

                  <blockquote className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
                    <p className="text-foreground text-lg mb-2">
                      "Your mind floats far above your body during panic, making you feel disconnected or out of control. The goal is to gently guide yourself back into your body using sensory input, breathing, and awareness."
                    </p>
                    <cite className="text-muted-foreground not-italic">— Braulio Rivera, LPC, LAC</cite>
                  </blockquote>

                  <p className="text-muted-foreground">
                    In this expert-backed guide, we'll look at what panic attacks really are, why they happen, and—most importantly—how to manage them with practical, science-supported tools you can use anytime, anywhere.
                  </p>
                </section>

                {/* What Is a Panic Attack */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">What Exactly Is a Panic Attack?</h2>
                  <p className="text-muted-foreground mb-6">
                    Panic attacks are sudden waves of intense fear triggered by a perceived threat—real or imagined. They're physical, psychological, and emotional all at once.
                  </p>

                  <h3 className="text-2xl font-semibold text-foreground mb-4">Common symptoms include:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                    <li>Rapid heartbeat</li>
                    <li>Shortness of breath</li>
                    <li>Sweating or shaking</li>
                    <li>Chest pressure</li>
                    <li>Dizziness or nausea</li>
                    <li>Feeling detached or unreal</li>
                    <li>Fear of losing control</li>
                  </ul>

                  <p className="text-muted-foreground mb-6">
                    For a deeper look at symptoms, you can check out this overview from the{" "}
                    <a href="https://www.nimh.nih.gov/health/publications/panic-disorder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      National Institute of Mental Health (NIMH)
                    </a>.
                  </p>

                  <div className="bg-secondary p-6 rounded-xl my-8">
                    <p className="text-foreground font-medium mb-0">
                      <strong>Important:</strong> Panic attacks are not dangerous, but your brain believes something is. That's why grounding and sensory tools help—they bring your body back to safety so your mind can follow.
                    </p>
                  </div>
                </section>

                {/* Can You Stop a Panic Attack */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Can You Actually Stop a Panic Attack?</h2>
                  <p className="text-muted-foreground mb-4">
                    Here's the truth most people don't hear:
                  </p>

                  <div className="bg-accent/30 p-6 rounded-xl my-6">
                    <p className="text-foreground mb-2">👉 You can't fully stop a panic attack once it's triggered.</p>
                    <p className="text-foreground mb-0">👉 But you <strong>can dramatically reduce its intensity</strong>.</p>
                  </div>

                  <blockquote className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
                    <p className="text-foreground text-lg mb-2">
                      "Accepting the panic instead of fighting it is the fastest way to calm the body."
                    </p>
                    <cite className="text-muted-foreground not-italic">— Lexxus Washington, LSW</cite>
                  </blockquote>

                  <p className="text-muted-foreground">
                    Fighting panic makes your brain feel even more threatened. Accepting it—"Okay, this is panic, and it will pass"—signals to your brain that the danger isn't real.
                  </p>
                </section>

                {/* Techniques Section */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Techniques to Reduce the Intensity of a Panic Attack</h2>
                  <p className="text-muted-foreground mb-8">
                    Below are expert-approved, research-backed tools to bring your mind and body back into balance.
                  </p>

                  {/* Technique 1: 5-4-3-2-1 */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">1. Ground Yourself with the 5-4-3-2-1 Method</h3>
                    <p className="text-muted-foreground mb-4">
                      This is one of the most effective tools during panic, recommended by therapists everywhere.
                    </p>

                    <figure className="my-8">
                      <img 
                        src={groundingImage} 
                        alt="5-4-3-2-1 grounding technique infographic showing the five senses method"
                        className="w-full rounded-xl shadow-lg"
                        loading="lazy"
                      />
                      <figcaption className="text-center text-sm text-muted-foreground mt-3">
                        The 5-4-3-2-1 grounding technique uses all five senses to bring you back to the present
                      </figcaption>
                    </figure>

                    <div className="bg-secondary p-6 rounded-xl my-6">
                      <h4 className="text-xl font-semibold text-foreground mb-4">Here's how it works:</h4>
                      <ul className="list-none space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
                          <span className="text-muted-foreground">things you can <strong>see</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                          <span className="text-muted-foreground">things you can <strong>touch</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                          <span className="text-muted-foreground">things you can <strong>hear</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                          <span className="text-muted-foreground">things you can <strong>smell</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                          <span className="text-muted-foreground">thing you can <strong>taste</strong></span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-muted-foreground">
                      This technique pulls the mind out of fear and into sensory awareness. Learn more through this helpful guide on{" "}
                      <a href="https://www.healthline.com/health/grounding-techniques" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        grounding techniques from Healthline
                      </a>.
                    </p>
                  </div>

                  {/* Technique 2: Cold Water */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">2. Use Cold Water to Reset Your Nervous System</h3>
                    <p className="text-muted-foreground mb-4">
                      Cold exposure activates the "dive reflex," a built-in calming switch.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 my-6">
                      {[
                        "Splashing cold water on your face",
                        "Holding an ice cube",
                        "Pressing a cold bottle to your neck or wrists"
                      ].map((tip, index) => (
                        <div key={index} className="bg-accent/30 p-4 rounded-lg flex items-start gap-3">
                          <span className="text-primary text-xl">❄️</span>
                          <span className="text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-muted-foreground">
                      This can quickly lower your heart rate and stop the panic from escalating.
                    </p>
                  </div>

                  {/* Technique 3: Deep Breathing */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">3. Deep Breathing (The Right Way)</h3>
                    <p className="text-muted-foreground mb-4">
                      Not all breathing is equal when you're panicked. What works best is slow, controlled breathing that engages your diaphragm.
                    </p>

                    <div className="bg-primary/10 p-6 rounded-xl my-6">
                      <h4 className="text-xl font-semibold text-foreground mb-4">Try this: Box Breathing</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary mb-2">4s</div>
                          <div className="text-sm text-muted-foreground">Breathe in</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary mb-2">4s</div>
                          <div className="text-sm text-muted-foreground">Hold</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary mb-2">4s</div>
                          <div className="text-sm text-muted-foreground">Exhale</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary mb-2">4s</div>
                          <div className="text-sm text-muted-foreground">Hold</div>
                        </div>
                      </div>
                      <p className="text-center text-muted-foreground mt-4">Repeat 4–6 cycles</p>
                    </div>

                    <p className="text-muted-foreground">
                      You can read more about this method on{" "}
                      <a href="https://www.webmd.com/balance/what-is-box-breathing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        WebMD's box breathing guide
                      </a>.
                    </p>
                  </div>

                  {/* Technique 4: Anchor Yourself */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">4. Anchor Yourself Back Into Your Body</h3>
                    <p className="text-muted-foreground mb-4">
                      Rivera explains that panic attacks happen because the mind disconnects from the body. You can reverse this by engaging your physical senses.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      {[
                        "Pressing your feet firmly into the floor",
                        "Wrapping yourself in a weighted blanket",
                        "Holding a textured object",
                        "Hugging yourself tightly",
                        "Tensing and relaxing your muscles"
                      ].map((tip, index) => (
                        <div key={index} className="bg-accent/30 p-4 rounded-lg flex items-start gap-3">
                          <span className="text-primary text-xl">✓</span>
                          <span className="text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-muted-foreground">
                      This helps you feel present and in control again.
                    </p>
                  </div>

                  {/* Technique 5: Sensory Input */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">5. Use Strong Sensory Input</h3>
                    <p className="text-muted-foreground mb-4">
                      This is one of Rivera's favorite tools for clients during panic:
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      {[
                        "Smell something strong (peppermint, citrus, coffee grounds)",
                        "Use a cold compress",
                        "Put your hands under warm water",
                        "Hold something heavy"
                      ].map((tip, index) => (
                        <div key={index} className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                          <span className="text-primary text-xl">🔹</span>
                          <span className="text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-accent/50 border-l-4 border-primary p-6 rounded-r-lg my-6">
                      <p className="text-foreground font-medium mb-0">
                        <strong>Key insight:</strong> The brain cannot stay in panic mode when strong sensory signals are being sent.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Understanding Triggers */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Understanding Your Triggers</h2>
                  <p className="text-muted-foreground mb-6">
                    Washington recommends reflecting on what activates your panic so you can reduce episodes over time.
                  </p>

                  <div className="bg-secondary p-6 rounded-xl my-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Ask yourself:</h4>
                    <ul className="list-none space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">❓</span>
                        <span className="text-muted-foreground">What brings up anxiety or panic in me?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">❓</span>
                        <span className="text-muted-foreground">What support systems do I need?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">❓</span>
                        <span className="text-muted-foreground">How can I communicate my needs to the people around me?</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground">
                    The more you understand the "why," the less power panic has over you. To learn more about recognizing triggers, visit{" "}
                    <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      APA's anxiety resources
                    </a>.
                  </p>
                </section>

                {/* Mindset Tools */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Helpful Mindset Tools for Panic Moments</h2>

                  <div className="space-y-6">
                    <div className="bg-accent/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Remind Yourself: "This Is Panic, Not Danger."</h4>
                      <p className="text-muted-foreground mb-0">
                        This simple phrase tells your brain it's okay to relax.
                      </p>
                    </div>

                    <div className="bg-accent/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Say: "This feeling will pass."</h4>
                      <p className="text-muted-foreground mb-0">
                        Because it will. It always does.
                      </p>
                    </div>

                    <div className="bg-accent/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Keep your body loose.</h4>
                      <p className="text-muted-foreground mb-0">
                        Clenching sends the brain "danger!" signals. Loosening your muscles brings calm.
                      </p>
                    </div>

                    <div className="bg-accent/30 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Don't try to control your thoughts.</h4>
                      <p className="text-muted-foreground mb-0">
                        Let them be noisy in the background. Focus on your senses instead.
                      </p>
                    </div>
                  </div>
                </section>

                {/* When to Seek Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When Should I Seek Help?</h2>
                  <p className="text-muted-foreground mb-6">
                    If panic attacks happen frequently or impact your daily life, support can make a huge difference. The{" "}
                    <a href="https://www.nimh.nih.gov/health/publications/panic-disorder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      NIMH guide on panic disorder
                    </a>{" "}
                    explains signs that it's time to talk to a professional.
                  </p>

                  <div className="bg-secondary p-6 rounded-xl my-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Therapists can teach:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Panic interruption techniques</li>
                      <li>Body-based calming skills</li>
                      <li>Cognitive reframing tools</li>
                      <li>Long-term anxiety management strategies</li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground font-medium">
                    You're never alone in this.
                  </p>
                </section>

                {/* FAQs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">FAQs About Panic Attacks</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-background border border-border p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">How long do panic attacks last?</h4>
                      <p className="text-muted-foreground mb-0">
                        Usually 10–15 minutes, although you may feel tired afterward.
                      </p>
                    </div>

                    <div className="bg-background border border-border p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Can panic attacks harm me?</h4>
                      <p className="text-muted-foreground mb-0">
                        No. They feel scary but are not physically dangerous. Learn more at the{" "}
                        <a href="https://www.cdc.gov/mentalhealth/stress-coping/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          CDC's stress resources
                        </a>.
                      </p>
                    </div>

                    <div className="bg-background border border-border p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Can breathing really stop panic?</h4>
                      <p className="text-muted-foreground mb-0">
                        Yes—slow breathing signals to your brain that you're safe.
                      </p>
                    </div>

                    <div className="bg-background border border-border p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-foreground mb-2">Should I avoid triggers?</h4>
                      <p className="text-muted-foreground mb-0">
                        Avoiding everything that scares you can increase anxiety long-term. It's better to learn coping tools.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Final Note */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">A Gentle Final Note</h2>
                  <p className="text-muted-foreground mb-6">
                    Panic attacks are incredibly uncomfortable, but they're also incredibly common—and treatable. Learning how to ground your body, shift your breathing, and speak to yourself with compassion can transform panic from something terrifying into something manageable.
                  </p>

                  <div className="bg-primary/10 p-8 rounded-xl text-center my-8">
                    <p className="text-xl text-foreground font-medium mb-0">
                      You're stronger than your panic. And every time you practice these tools, you're teaching your brain safety, resilience, and balance.
                    </p>
                  </div>
                </section>

                {/* Helpful Resources */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Helpful External Resources</h2>
                  <div className="bg-secondary p-6 rounded-xl">
                    <ul className="list-none space-y-3">
                      <li>
                        <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <span>→</span> APA Anxiety Resources
                        </a>
                      </li>
                      <li>
                        <a href="https://www.nimh.nih.gov/health/publications/panic-disorder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <span>→</span> NIMH Panic Disorder Guide
                        </a>
                      </li>
                      <li>
                        <a href="https://www.cdc.gov/mentalhealth/stress-coping/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <span>→</span> CDC Stress & Coping Tools
                        </a>
                      </li>
                      <li>
                        <a href="https://www.healthline.com/health/grounding-techniques" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <span>→</span> Grounding Techniques (Healthline)
                        </a>
                      </li>
                      <li>
                        <a href="https://www.webmd.com/balance/what-is-box-breathing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <span>→</span> Box Breathing (WebMD)
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Share Section */}
                <section className="border-t border-border pt-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Found this helpful?</h3>
                      <p className="text-muted-foreground">Share it with someone who might need it.</p>
                    </div>
                    <SocialShareButtons 
                      url="https://www.innersparkafrica.com/blog/how-to-stop-a-panic-attack"
                      title="How Do I Stop a Panic Attack? Simple, Fast Techniques to Regain Control"
                      description="Learn how to stop or reduce the intensity of a panic attack using grounding techniques."
                    />
                  </div>
                </section>

              </div>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Need Professional Support?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              If panic attacks are affecting your quality of life, speaking to a mental health professional can help you develop personalized coping strategies.
            </p>
            <a 
              href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20speak%20with%20a%20therapist%20about%20managing%20panic%20attacks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Talk to a Therapist
            </a>
          </div>
        </section>
      </main>

      <RelatedArticles currentSlug="how-to-stop-a-panic-attack" />
      {/* <AppDownload /> */}
      <Footer />
    </>
  );
};

export default PanicAttackPost;
