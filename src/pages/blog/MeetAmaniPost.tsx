import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/amani-ai-hero.jpg";

const MeetAmaniPost = () => {
  const url = "https://www.innersparkafrica.com/blog/meet-amani-ai-mental-wellness-uganda";
  const title = "Meet Amani: The Free AI Mental Wellness Companion Built for Uganda";
  const desc = "Amani is InnerSpark's free AI mental health chatbot — built for Ugandans who need someone to talk to right now. Here's how it works, what it can do, and where it can't replace a therapist.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-06-03", dateModified: "2026-06-03", inLanguage: "en", keywords: ["Amani AI","mental health chatbot Uganda","AI therapist Africa","free mental health AI","online therapy Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Is Amani really free?", acceptedAnswer: { "@type": "Answer", text: "Yes — chatting with Amani costs nothing. You only pay if you choose to book a session with a licensed InnerSpark therapist." } },
    { "@type": "Question", name: "Can an AI chatbot replace therapy?", acceptedAnswer: { "@type": "Answer", text: "No. Amani is excellent for first conversations, daily check-ins, coping ideas and finding the right next step. For diagnosis, trauma work or medication, you still need a licensed human therapist — which Amani can book for you." } },
    { "@type": "Question", name: "Will Amani share my conversation with my employer?", acceptedAnswer: { "@type": "Answer", text: "Never. Your chat with Amani is private. Even if your company uses InnerSpark, employers only see anonymous team-level data — never individual conversations." } },
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Amani AI, AI mental health Uganda, mental health chatbot Uganda, free therapy AI Africa, online therapy Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Product</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />June 3, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />6 min read</span></div>
            <img src={hero} alt="Amani AI mental wellness chatbot from InnerSpark Africa" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">It's 11pm in Kampala. You can't sleep. Your chest feels tight from a meeting that won't leave your head. You don't want to wake anyone, you don't want to burden a friend, and a therapist's office is closed. This is exactly the moment we built <strong>Amani</strong> for.</p>

            <h2>What is Amani?</h2>
            <p>Amani is InnerSpark Africa's free AI mental wellness companion. Think of it as a calm, well-informed friend in your pocket — one that knows how to listen, when to suggest a breathing exercise, and when to gently steer you toward a real licensed therapist. Amani lives inside every InnerSpark page as the friendly blue chat bubble at the bottom-right.</p>

            <h2>What Amani is great at</h2>
            <ul>
              <li><strong>First conversations.</strong> When you don't know where to start, Amani helps you put a name to what you're feeling.</li>
              <li><strong>Late-night moments.</strong> 24/7. No appointment, no waiting list, no cost.</li>
              <li><strong>Practical coping tools.</strong> Grounding exercises, journaling prompts, sleep tips — tuned for Ugandan daily life.</li>
              <li><strong>Finding the right next step.</strong> A free wellbeing check, a support group, or a 1:1 with a Ugandan therapist — Amani matches you to what fits.</li>
              <li><strong>Reducing the friction.</strong> Booking, payment options (PesaPal, MTN Mobile Money, card) — Amani walks you through it.</li>
            </ul>

            <h2>What Amani is not</h2>
            <p>Amani is not a therapist, not a clinician and not a diagnosis tool. AI is a wonderful bridge to professional care — but for trauma, medication, or sustained therapeutic work, you need a licensed human. The good news: Amani makes booking that human two taps away.</p>

            <h2>Privacy: who sees what you write</h2>
            <p>Conversations with Amani are private. We don't sell your data, we don't share with employers, and even if you joined through your company, your individual chat never leaves your account. Employers only ever see anonymous, aggregated team trends — that's a hard rule InnerSpark is legally bound to.</p>

            <h2>When Amani will gently escalate</h2>
            <p>If you mention thoughts of self-harm, suicide, or being in immediate danger, Amani will pause the casual flow and surface our 24/7 crisis line (+256 792 085 773) and the Emergency Support page. We'd rather over-respond to a serious moment than miss one.</p>

            <h2>How to start</h2>
            <p>Open any InnerSpark page. Tap the blue chat bubble. Type <em>"Hi"</em>. That's the whole onboarding.</p>

            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Chat with Amani today</h3>
              <p className="text-muted-foreground mb-4">Free, private, available right now — built for Uganda.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/amani-ai">Learn more about Amani</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/mind-check">Take the Free Check</Link></Button>
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

export default MeetAmaniPost;