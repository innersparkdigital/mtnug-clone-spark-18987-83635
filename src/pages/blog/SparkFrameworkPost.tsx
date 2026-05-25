import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/anxiety-management-hero.jpg";

const SparkFrameworkPost = () => {
  const url = "https://www.innersparkafrica.com/blog/spark-framework-mental-wellbeing";
  const title = "The S.P.A.R.K Framework: A 5-Step Mental Wellbeing Routine Built for Ugandans";
  const desc = "InnerSpark's S.P.A.R.K framework — Sleep, Purpose, Activity, Relationships, Knowledge — gives Ugandan professionals a practical weekly routine for stronger mental health.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["mental wellbeing framework Uganda","mental health routine Uganda","self-care Uganda","mental wellness Uganda","stress management Kampala"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is the S.P.A.R.K framework?", acceptedAnswer: { "@type": "Answer", text: "S.P.A.R.K stands for Sleep, Purpose, Activity, Relationships and Knowledge — the five everyday habits that, in combination, protect long-term mental wellbeing. It is InnerSpark Africa's clinically-informed weekly check-in framework." } },
    { "@type": "Question", name: "Can S.P.A.R.K replace therapy?", acceptedAnswer: { "@type": "Answer", text: "No. It is a daily practice that supports mental wellbeing and helps you notice problems early. If two or more pillars stay broken for more than 2–3 weeks, that's a signal to speak to a licensed therapist." } },
    { "@type": "Question", name: "How long does it take to feel a difference?", acceptedAnswer: { "@type": "Answer", text: "Most people notice meaningful improvements in mood, energy and focus within 2–4 weeks of consistently strengthening 3 or more pillars. Sleep and Activity usually move the fastest." } }
  ] };
  const pillars = [
    { letter: "S", name: "Sleep", body: "7–9 hours, same bedtime most nights, no screens for 30 minutes before bed. In Uganda's heat, a fan, hydration and dim light in the evening matter more than people realise." },
    { letter: "P", name: "Purpose", body: "One thing each week that connects you to meaning — your faith, your family, a cause, a skill you're building. Burnout almost always begins when purpose disappears." },
    { letter: "A", name: "Activity", body: "30 minutes of movement, 4–5 days a week. A walk through your estate counts. Exercise is one of the most evidence-backed mood treatments we have." },
    { letter: "R", name: "Relationships", body: "One real conversation, not WhatsApp, with a person who knows you — every single week. Loneliness is now considered as harmful to long-term health as smoking." },
    { letter: "K", name: "Knowledge", body: "Learn something about your own mind. Read one article, take a free mental health check, or notice a pattern in your moods. Awareness is half the work." },
  ];
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="S.P.A.R.K framework, mental wellbeing framework Uganda, mental health routine Uganda, self-care Uganda, mental wellness Uganda, stress management Kampala" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Mental Wellbeing</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />8 min read</span></div>
            <img src={hero} alt="Ugandan professional practicing a mental wellbeing routine" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">Mental wellbeing isn't a single skill. It's a small set of daily habits that, together, decide how resilient you are when life gets heavy. At InnerSpark Africa, we teach our community a simple five-pillar framework called <strong>S.P.A.R.K</strong>. It's the routine our therapists use themselves — and it's tuned to how Ugandans actually live, work and rest.</p>
            <h2>Why we built S.P.A.R.K</h2>
            <p>Most Western "self-care" advice assumes infinite time, quiet apartments and a personal car. Ugandan reality is louder, busier, more communal and more financially stretched. We needed a framework that fits a real Kampala week — long commutes, family expectations, faith life, side hustles. S.P.A.R.K is the result.</p>
            <h2>The five pillars</h2>
            <div className="not-prose space-y-4 my-6">
              {pillars.map((p) => (
                <div key={p.letter} className="flex gap-4 p-5 rounded-xl border bg-card">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">{p.letter}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <h2>How to use it</h2>
            <p>Every Sunday evening, rate each pillar honestly out of 10 for the week just gone. Anything under 6 is a pillar to actively improve next week. Pick <strong>one</strong> — never all five at once — and design a small, specific action. "Bed by 11pm Monday to Friday" beats "sleep better."</p>
            <h2>When S.P.A.R.K is not enough</h2>
            <p>If two or more pillars stay below 5 for three weeks in a row, or if you notice persistent low mood, hopelessness, panic or thoughts of self-harm — that's the moment to bring in a professional. Therapy isn't a sign you've failed at S.P.A.R.K. It's the part of the framework that requires another person.</p>
            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Start with a free 3-minute check</h3>
              <p className="text-muted-foreground mb-4">See where your wellbeing stands today — anonymous, no signup.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/mind-check">Take the Free Check</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/book-therapist">Book a Therapist</Link></Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};

export default SparkFrameworkPost;