import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import depressionHeroImage from "@/assets/blog/depression-hero.jpg";

const SignsYouNeedTherapistPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "8 Signs You Need a Therapist (And Why That's Completely Okay)",
    description: "Not sure if you need therapy? Here are 8 clear signs it's time to talk to a professional — and why seeking help is a sign of strength, not weakness.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["signs you need a therapist", "do I need therapy", "when to see a therapist", "should I go to therapy", "therapy signs"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/signs-you-need-a-therapist" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I know if I need a therapist?",
        acceptedAnswer: { "@type": "Answer", text: "You may need a therapist if you're experiencing persistent sadness, overwhelming anxiety, difficulty functioning at work or in relationships, sleep problems, substance dependence, or if you've experienced trauma. If your emotions are affecting your daily life for more than two weeks, it's time to seek help." }
      },
      {
        "@type": "Question",
        name: "Is it normal to go to therapy?",
        acceptedAnswer: { "@type": "Answer", text: "Absolutely. Therapy is a normal, healthy way to manage life's challenges. Just as you'd see a doctor for physical health, seeing a therapist for mental health is equally important. In Africa, the stigma around therapy is decreasing as more people discover its benefits." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>8 Signs You Need a Therapist – When to Seek Help | Innerspark Africa</title>
        <meta name="description" content="Not sure if you need therapy? Here are 8 clear signs it's time to talk to a professional. Learn when to seek help and how to take the first step." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/signs-you-need-a-therapist" />
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
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Self-Assessment</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">8 Signs You Need a Therapist (And Why That's Completely Okay)</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 8 min read</span>
            </div>
            <img src={depressionHeroImage} alt="Signs you need therapy" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Many people wait too long before seeing a therapist. In Africa, where mental health stigma is still common, recognizing when you need help is the first — and bravest — step. Here are 8 signs it might be time.
            </p>

            <h2>1. Your Emotions Feel Out of Control</h2>
            <p>
              Everyone experiences sadness, anger, or frustration. But if your emotions are disproportionate to the situation — explosive anger over small things, crying without clear reason, or feeling numb — this is a signal your mind needs support. A <Link to="/specialists" className="text-primary hover:underline">licensed therapist</Link> can help you understand and regulate these emotions.
            </p>

            <h2>2. You're Struggling to Sleep</h2>
            <p>
              Chronic insomnia or sleeping too much (hypersomnia) are often linked to anxiety, depression, or unresolved stress. If your sleep has changed significantly for more than two weeks, it's worth exploring with a professional.
            </p>

            <h2>3. You've Lost Interest in Things You Used to Enjoy</h2>
            <p>
              When hobbies, socializing, food, or activities that once brought joy now feel meaningless, this is called <strong>anhedonia</strong> — a hallmark of depression. Take our <Link to="/mind-check/depression" className="text-primary hover:underline">free depression screening</Link> to check your symptoms.
            </p>

            <h2>4. Your Relationships Are Suffering</h2>
            <p>
              Constant conflict with your partner, withdrawal from friends, difficulty trusting people, or feeling isolated can all indicate underlying mental health challenges. Therapy provides a safe space to explore these patterns.
            </p>

            <h2>5. You're Using Substances to Cope</h2>
            <p>
              If you're relying on alcohol, drugs, food, or other substances to manage your feelings, this is a significant warning sign. A therapist can help you develop healthier coping strategies without judgment.
            </p>

            <h2>6. You've Experienced a Traumatic Event</h2>
            <p>
              Loss of a loved one, accident, assault, divorce, job loss, or any overwhelming event can trigger trauma responses. Even if the event happened years ago, unprocessed trauma affects your daily life. <Link to="/blog/how-to-find-a-therapist" className="text-primary hover:underline">Find the right trauma therapist for you</Link>.
            </p>

            <h2>7. You Feel Anxious or Worried Most of the Time</h2>
            <p>
              Constant worry, racing thoughts, difficulty concentrating, physical tension, or panic attacks are signs of anxiety disorder. Learn more about <Link to="/blog/anxiety-symptoms" className="text-primary hover:underline">recognizing anxiety symptoms</Link>. Anxiety is highly treatable with professional help.
            </p>

            <h2>8. You've Had Thoughts of Self-Harm</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 my-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-destructive mb-2">If you're having thoughts of suicide or self-harm, please reach out immediately:</p>
                  <ul className="space-y-1 mb-0">
                    <li>Call <strong>0792 085 773</strong> (Innerspark crisis line)</li>
                    <li>Visit our <Link to="/emergency-support" className="text-primary hover:underline font-bold">Emergency Support page</Link></li>
                    <li>Go to the nearest hospital emergency department</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>Why Seeking Help Is a Sign of Strength</h2>
            <p>
              In many African cultures, mental health challenges are seen as weakness or spiritual failure. But the truth is: <strong>seeking therapy takes courage</strong>. Just as you would see a doctor for a broken bone, a therapist helps heal emotional wounds.
            </p>
            <p>
              According to the <a href="https://www.apa.org/ptsd-guideline/patients-and-families/seeking-therapy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">American Psychological Association</a>, 75% of people who enter therapy show measurable improvement. You don't have to suffer in silence.
            </p>

            <h2>How to Take the First Step</h2>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Take a free assessment:</strong> Our <Link to="/mind-check" className="text-primary hover:underline">Mind-Check tool</Link> helps you understand your symptoms</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Browse therapists:</strong> <Link to="/specialists" className="text-primary hover:underline">View our licensed specialists</Link> and read their profiles</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Start with a free consultation:</strong> No commitment, no pressure — just a conversation</div>
              </div>
            </div>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">How do I know if I need a therapist?</h3>
                <p className="text-muted-foreground">If your emotions, behavior, or thoughts are affecting your daily life, relationships, or work for more than two weeks, it's time to speak with a professional.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Is it normal to go to therapy?</h3>
                <p className="text-muted-foreground">Absolutely. Therapy is for everyone, not just people in crisis. It's a proactive way to build emotional resilience and navigate life's challenges.</p>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Talk to Someone?</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              You deserve support. Book a confidential session with a licensed therapist today — from UGX 30,000.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Book a Therapist</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I%20think%20I%20need%20to%20talk%20to%20a%20therapist" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="8 Signs You Need a Therapist" url="https://www.innersparkafrica.com/blog/signs-you-need-a-therapist" />
          <RelatedArticles currentSlug="signs-you-need-a-therapist" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default SignsYouNeedTherapistPost;
