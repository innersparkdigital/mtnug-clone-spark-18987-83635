import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, Brain, MessageCircle, Users, Video, Heart, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import stressHeroImage from "@/assets/blog/stress-management-hero.jpg";

const TypesOfTherapyPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Types of Therapy Explained: Which One Is Right for You?",
    description: "CBT, psychodynamic, trauma therapy, couples counseling — confused? This guide explains the most common types of therapy and helps you choose the right one.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["types of therapy", "therapy types explained", "CBT therapy", "psychodynamic therapy", "which therapy is right for me", "types of counseling"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/types-of-therapy" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the main types of therapy?",
        acceptedAnswer: { "@type": "Answer", text: "The most common types are Cognitive Behavioral Therapy (CBT), Psychodynamic Therapy, Person-Centered Therapy, Trauma-Focused Therapy (including EMDR), Couples/Family Therapy, and Group Therapy. Each uses different techniques and is suited for different concerns." }
      },
      {
        "@type": "Question",
        name: "Which type of therapy is best for anxiety?",
        acceptedAnswer: { "@type": "Answer", text: "Cognitive Behavioral Therapy (CBT) is the most evidence-based treatment for anxiety. It helps you identify and challenge anxious thoughts and develop practical coping strategies. Exposure therapy, a subset of CBT, is especially effective for phobias and panic disorder." }
      },
      {
        "@type": "Question",
        name: "How do I choose the right type of therapy?",
        acceptedAnswer: { "@type": "Answer", text: "Consider your main concern (anxiety, trauma, relationships, etc.), your preference for structured vs exploratory approaches, and whether you want individual, couples, or group therapy. A good therapist will recommend the approach that fits your needs during your first consultation." }
      }
    ]
  };

  const therapyTypes = [
    {
      name: "Cognitive Behavioral Therapy (CBT)",
      icon: Brain,
      bestFor: "Anxiety, depression, phobias, OCD, insomnia",
      description: "CBT is the most researched form of therapy. It works by identifying negative thought patterns and replacing them with healthier, more balanced thinking. CBT is structured, goal-oriented, and typically short-term (8-16 sessions).",
      howItWorks: "Your therapist helps you notice automatic negative thoughts ('I'm a failure'), challenge their accuracy, and develop realistic alternatives ('I made a mistake, but I can learn from it').",
    },
    {
      name: "Psychodynamic Therapy",
      icon: Lightbulb,
      bestFor: "Deep-rooted patterns, childhood issues, relationship problems, self-understanding",
      description: "Psychodynamic therapy explores how your past experiences — especially early relationships — shape your current behavior and emotions. It's less structured than CBT and focuses on understanding the 'why' behind your patterns.",
      howItWorks: "Through open-ended conversation, your therapist helps you uncover unconscious patterns, unresolved conflicts, and defense mechanisms that affect your daily life.",
    },
    {
      name: "Person-Centered Therapy",
      icon: Heart,
      bestFor: "Self-esteem, personal growth, general emotional support, life transitions",
      description: "Developed by Carl Rogers, this approach trusts that you are the expert on your own life. The therapist provides unconditional positive regard, empathy, and a non-judgmental space for you to explore your feelings and find your own solutions.",
      howItWorks: "Your therapist creates a warm, accepting environment where you lead the conversation. There's no homework or techniques — just a safe space to process.",
    },
    {
      name: "Trauma-Focused Therapy",
      icon: CheckCircle,
      bestFor: "PTSD, childhood trauma, abuse, accidents, grief after traumatic loss",
      description: "Specialized approaches like EMDR (Eye Movement Desensitization and Reprocessing) and Trauma-Focused CBT help your brain process traumatic memories so they no longer trigger intense emotional responses.",
      howItWorks: "In EMDR, your therapist guides you through specific eye movements while recalling traumatic memories, helping your brain reprocess them. In TF-CBT, you gradually work through the trauma narrative in a structured way.",
    },
    {
      name: "Couples & Family Therapy",
      icon: Users,
      bestFor: "Relationship conflicts, communication breakdowns, infidelity, family dynamics",
      description: "Instead of focusing on one individual, this approach works with relationships. A therapist helps couples or families improve communication, resolve conflicts, and strengthen their connection.",
      howItWorks: "Both partners (or family members) attend sessions together. The therapist acts as a neutral mediator, teaching communication skills and helping each person understand the other's perspective.",
    },
    {
      name: "Group Therapy",
      icon: MessageCircle,
      bestFor: "Social anxiety, addiction recovery, grief, shared experiences",
      description: "In group therapy, a therapist leads a small group (usually 5-10 people) who share similar challenges. You benefit from both professional guidance and peer support — often at a lower cost than individual therapy.",
      howItWorks: "Sessions involve guided discussions, shared exercises, and mutual support. Hearing others' experiences can reduce isolation and provide new perspectives.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Types of Therapy Explained: Which One Is Right for You? | Innerspark Africa</title>
        <meta name="description" content="CBT, psychodynamic, trauma therapy, couples counseling — which type of therapy is right for you? A clear guide to the most common therapy approaches." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/types-of-therapy" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </nav>

          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Therapy Guide</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">Types of Therapy Explained: Which One Is Right for You?</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 12 min read</span>
            </div>
            <img src={stressHeroImage} alt="Types of therapy explained" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              You've decided to try therapy — great decision. But then you see terms like "CBT," "psychodynamic," and "EMDR" and wonder: <em>what does any of this mean?</em> This guide breaks down the 6 most common types of therapy in simple language to help you choose.
            </p>

            <h2>Quick Comparison: Which Therapy Is Best for What?</h2>
            <div className="bg-accent/50 rounded-xl p-6 my-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-bold">Type</th>
                    <th className="text-left py-2 pr-4 font-bold">Best For</th>
                    <th className="text-left py-2 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">CBT</td>
                    <td className="py-2 pr-4">Anxiety, depression, OCD</td>
                    <td className="py-2">8-16 sessions</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">Psychodynamic</td>
                    <td className="py-2 pr-4">Deep patterns, childhood issues</td>
                    <td className="py-2">6-24+ months</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">Person-Centered</td>
                    <td className="py-2 pr-4">Self-esteem, personal growth</td>
                    <td className="py-2">Flexible</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">Trauma-Focused</td>
                    <td className="py-2 pr-4">PTSD, abuse, accidents</td>
                    <td className="py-2">8-12 sessions</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">Couples/Family</td>
                    <td className="py-2 pr-4">Relationship conflicts</td>
                    <td className="py-2">12-20 sessions</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Group Therapy</td>
                    <td className="py-2 pr-4">Shared experiences, social anxiety</td>
                    <td className="py-2">Ongoing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {therapyTypes.map((therapy, index) => {
              const Icon = therapy.icon;
              return (
                <div key={index}>
                  <h2 className="flex items-center gap-2">
                    <Icon className="w-6 h-6 text-primary" />
                    {therapy.name}
                  </h2>
                  <p className="text-sm font-medium text-primary mb-2">Best for: {therapy.bestFor}</p>
                  <p>{therapy.description}</p>
                  <div className="bg-muted/50 rounded-lg p-4 my-4">
                    <p className="font-bold mb-1">How it works:</p>
                    <p className="text-muted-foreground mb-0">{therapy.howItWorks}</p>
                  </div>
                </div>
              );
            })}

            <h2>How to Choose the Right Type</h2>
            <p>Don't stress about choosing the "perfect" type. Here's a simple framework:</p>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Know your main concern:</strong> Anxiety/depression → CBT. Trauma → Trauma-focused. Relationships → Couples therapy.</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Consider your preference:</strong> Want practical tools? → CBT. Want to explore deeply? → Psychodynamic. Want a safe space? → Person-centered.</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Ask your therapist:</strong> A good therapist will recommend the approach that fits you. <Link to="/specialists" className="text-primary hover:underline">Browse our specialists</Link> and their specializations.</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Not sure?</strong> Start with a <a href="https://wa.me/256792085773?text=Hi,%20I'm%20not%20sure%20which%20type%20of%20therapy%20I%20need" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">free consultation</a> — we'll help you find the right fit.</div>
              </div>
            </div>

            <h2>Online vs In-Person: Does It Matter?</h2>
            <p>
              Research shows that <Link to="/blog/online-therapy-effective-africa" className="text-primary hover:underline">online therapy is equally effective</Link> as in-person for most therapy types, including CBT, psychodynamic, and person-centered therapy. The key factor isn't the format — it's the relationship between you and your therapist.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">What are the main types of therapy?</h3>
                <p className="text-muted-foreground">The most common types are CBT, Psychodynamic, Person-Centered, Trauma-Focused (EMDR), Couples/Family, and Group Therapy.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Which therapy is best for anxiety?</h3>
                <p className="text-muted-foreground">CBT is the most evidence-based treatment for anxiety. It helps you identify and challenge anxious thoughts with practical techniques.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">How do I choose the right type?</h3>
                <p className="text-muted-foreground">Consider your main concern and preference for structured vs exploratory approaches. A good therapist will recommend the right fit during your first consultation.</p>
              </div>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Which Therapy You Need?</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              Our licensed therapists will recommend the right approach for you. Start with a free consultation — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Browse Therapists</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I%20need%20help%20choosing%20the%20right%20type%20of%20therapy" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="Types of Therapy Explained" url="https://www.innersparkafrica.com/blog/types-of-therapy" />
          <RelatedArticles currentSlug="types-of-therapy" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default TypesOfTherapyPost;
