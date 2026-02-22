import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import mentalHealthHeroImage from "@/assets/blog/mental-health-hero.jpg";

const WhatIsTherapyPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "What Is Therapy? A Simple Guide to How It Works & Why It Helps",
    description: "Wondering what therapy actually is? This beginner-friendly guide explains how therapy works, what happens in a session, who it's for, and how it can change your life.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["what is therapy", "how does therapy work", "therapy explained", "what happens in therapy", "therapy for beginners"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/what-is-therapy" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is therapy?",
        acceptedAnswer: { "@type": "Answer", text: "Therapy (also called psychotherapy or counseling) is a process where you talk with a trained mental health professional to understand your feelings, thoughts, and behaviors. It helps you develop coping strategies, heal from past experiences, and improve your mental well-being." }
      },
      {
        "@type": "Question",
        name: "What happens in a therapy session?",
        acceptedAnswer: { "@type": "Answer", text: "In a typical session, you talk with your therapist about what's on your mind. Your therapist listens, asks questions, and helps you explore patterns in your thinking and behavior. Sessions are usually 45-60 minutes. Everything you share is confidential." }
      },
      {
        "@type": "Question",
        name: "Do I need to be 'sick' to go to therapy?",
        acceptedAnswer: { "@type": "Answer", text: "No. Therapy is for everyone, not just people with mental health diagnoses. Many people use therapy for personal growth, relationship improvement, stress management, career decisions, and general emotional well-being." }
      },
      {
        "@type": "Question",
        name: "How long does therapy take to work?",
        acceptedAnswer: { "@type": "Answer", text: "Many people notice improvements within 6-8 sessions. However, the timeline depends on your goals, the type of therapy, and the complexity of your concerns. Some people benefit from short-term therapy (8-12 sessions), while others prefer ongoing support." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>What Is Therapy? How It Works & Why It Helps | Innerspark Africa</title>
        <meta name="description" content="What is therapy and how does it work? A beginner-friendly guide explaining types of therapy, what happens in sessions, and how therapy can improve your life." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/what-is-therapy" />
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
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Therapy Basics</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">What Is Therapy? A Simple Guide to How It Works & Why It Helps</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 10 min read</span>
            </div>
            <img src={mentalHealthHeroImage} alt="What is therapy - a guide" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              You've probably heard people say <em>"you should try therapy"</em> — but what does that actually mean? If you're curious, confused, or considering it for the first time, this guide explains everything in simple terms.
            </p>

            <h2>Therapy in Plain Language</h2>
            <p>
              <strong>Therapy</strong> (also called psychotherapy, counseling, or talk therapy) is a structured conversation with a trained professional who helps you understand your thoughts, feelings, and behaviors. Think of a therapist as a guide who helps you navigate your inner world — without judgment.
            </p>
            <p>
              Unlike talking to a friend, therapy is guided by evidence-based techniques. Your therapist is trained to identify patterns you can't see yourself and help you develop practical strategies for managing life's challenges.
            </p>

            <h2>What Actually Happens in a Therapy Session?</h2>
            <p>If you've never been to therapy, here's what a typical session looks like:</p>
            <ol>
              <li><strong>Check-in (5 minutes):</strong> Your therapist asks how you've been since the last session</li>
              <li><strong>Exploration (30-40 minutes):</strong> You discuss what's on your mind — stress, relationships, feelings, events. Your therapist listens actively, asks clarifying questions, and helps you see patterns</li>
              <li><strong>Reflection & tools (10 minutes):</strong> You discuss insights, coping strategies, or homework to practice before the next session</li>
              <li><strong>Wrap-up:</strong> Schedule your next session</li>
            </ol>
            <p>
              Sessions typically last <strong>45-60 minutes</strong>. Everything you share is <strong>completely confidential</strong>.
            </p>

            <h2>Who Is Therapy For?</h2>
            <p>Short answer: <strong>everyone</strong>. You don't need to be in crisis to benefit from therapy.</p>
            <div className="space-y-3 my-6">
              {[
                "You're feeling overwhelmed, stressed, or anxious",
                "You've experienced a loss, breakup, or life change",
                "Your relationships aren't working the way you want",
                "You want to understand yourself better",
                "You're dealing with depression, trauma, or grief",
                "You want to grow personally or professionally",
                "You need someone to talk to without judgment"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <h2>Common Myths About Therapy</h2>
            <div className="space-y-4 my-6">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
                <p className="font-bold mb-1">❌ "Therapy is only for crazy people"</p>
                <p className="text-muted-foreground mb-0">Therapy is for anyone who wants to improve their mental well-being. Athletes, CEOs, students, and parents all benefit from therapy.</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
                <p className="font-bold mb-1">❌ "If I go to therapy, it means I'm weak"</p>
                <p className="text-muted-foreground mb-0">Seeking help is a sign of <strong>strength</strong>, not weakness. Read more: <Link to="/blog/signs-you-need-a-therapist" className="text-primary hover:underline">Signs you need a therapist</Link>.</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
                <p className="font-bold mb-1">❌ "Therapy is too expensive"</p>
                <p className="text-muted-foreground mb-0">Online therapy starts at UGX 30,000 per session. <Link to="/blog/therapy-cost-uganda" className="text-primary hover:underline">See full pricing guide</Link>.</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
                <p className="font-bold mb-1">❌ "Therapy takes years to work"</p>
                <p className="text-muted-foreground mb-0">Many people see improvements within 6-8 sessions. Some goals can be achieved in as few as 4 sessions.</p>
              </div>
            </div>

            <h2>How Does Therapy Help?</h2>
            <p>Research from the <a href="https://www.apa.org/ptsd-guideline/patients-and-families/seeking-therapy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">American Psychological Association</a> shows therapy helps by:</p>
            <ul>
              <li>Reducing symptoms of anxiety and depression by up to 75%</li>
              <li>Improving relationship satisfaction and communication</li>
              <li>Building healthier coping mechanisms</li>
              <li>Processing trauma and grief</li>
              <li>Increasing self-awareness and emotional intelligence</li>
              <li>Reducing physical symptoms caused by stress</li>
            </ul>

            <h2>How to Get Started</h2>
            <p>Getting started is easier than you think:</p>
            <ol>
              <li><strong>Decide your format:</strong> <Link to="/virtual-therapy" className="text-primary hover:underline">Video therapy</Link>, voice calls, or <Link to="/chat-therapy" className="text-primary hover:underline">chat-based therapy</Link></li>
              <li><strong>Find your therapist:</strong> <Link to="/specialists" className="text-primary hover:underline">Browse our licensed specialists</Link> and read their profiles</li>
              <li><strong>Book a session:</strong> Most therapists offer a free initial consultation</li>
              <li><strong>Show up:</strong> No preparation needed — just be yourself</li>
            </ol>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">What is therapy?</h3>
                <p className="text-muted-foreground">Therapy is a structured conversation with a trained mental health professional who helps you understand your thoughts, feelings, and behaviors, and develop strategies for managing life's challenges.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">What happens in a session?</h3>
                <p className="text-muted-foreground">You talk with your therapist about what's on your mind. They listen, ask questions, and help you explore patterns. Sessions are 45-60 minutes and completely confidential.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Do I need to be "sick" to go to therapy?</h3>
                <p className="text-muted-foreground">No. Therapy is for everyone — from personal growth to managing stress to processing difficult emotions.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">How long does therapy take to work?</h3>
                <p className="text-muted-foreground">Many people notice improvements within 6-8 sessions, though the timeline varies based on your goals and situation.</p>
              </div>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Try Therapy?</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              Start with a free consultation. No pressure, no commitment — just a conversation with a licensed professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Find a Therapist</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I'm%20curious%20about%20therapy%20and%20would%20like%20a%20free%20consultation" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="What Is Therapy?" url="https://www.innersparkafrica.com/blog/what-is-therapy" />
          <RelatedArticles currentSlug="what-is-therapy" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default WhatIsTherapyPost;
