import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { MessageCircle, Sparkles, ShieldCheck, Clock, Heart, Globe2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import amaniAvatar from "@/assets/amani-avatar.jpg";
import heroImg from "@/assets/blog/amani-ai-hero.jpg";

const URL = "https://www.innersparkafrica.com/amani-ai";
const TITLE = "Amani AI — Free Mental Wellness Chatbot for Uganda & Africa";
const DESC = "Meet Amani, InnerSpark's free AI mental wellness companion. Chat 24/7 in English, get matched to a therapist, take a wellbeing check or just talk through how you feel — private and instant.";

const faqs = [
  { q: "Is Amani AI free to use?", a: "Yes. Chatting with Amani is completely free. You can ask questions, get matched to a therapist or take a wellbeing check at no cost." },
  { q: "Is Amani a real therapist?", a: "No. Amani is a friendly AI wellness assistant trained to listen, share coping strategies and guide you to the right next step — including booking a licensed InnerSpark therapist when you need one." },
  { q: "Is what I share with Amani private?", a: "Yes. Conversations are private. We don't sell your data and we never share your messages with your employer, family or anyone else." },
  { q: "Can Amani help in a crisis?", a: "If you are in crisis or thinking about self-harm, please contact our 24/7 line on +256 792 085 773 or use the Emergency Support page. Amani will always direct you to a human in serious moments." },
  { q: "What can I ask Amani?", a: "Anything mental-health related — stress, sleep, anxiety, relationship struggles, work burnout, or how to book a therapist. Amani can also guide you to the right free assessment." },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Amani AI by InnerSpark Africa",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, Android",
  url: URL,
  description: DESC,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", name: "InnerSpark Africa", url: "https://www.innersparkafrica.com" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "2150" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const openAmani = () => {
  // The global AIChatWidget listens on the document for this event in supported builds;
  // as a graceful fallback we scroll the user to the bottom-right where the bubble lives.
  window.dispatchEvent(new CustomEvent("amani:open"));
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

const AmaniAI = () => (
  <>
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESC} />
      <meta name="keywords" content="Amani AI, mental health chatbot Uganda, AI therapist Africa, free mental wellness chatbot, online therapy chatbot Uganda, mental health AI assistant" />
      <link rel="canonical" href={URL} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESC} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={URL} />
      <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
    <Header />
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background pt-16 pb-12">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Free · 24/7 · Private
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Meet <span className="text-primary">Amani</span> — your free AI mental wellness companion
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Amani is InnerSpark's friendly AI assistant. Chat anytime about stress, anxiety, burnout, sleep or relationships — and get matched to a real Ugandan therapist whenever you're ready.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full" onClick={openAmani}>
                <MessageCircle className="w-5 h-5 mr-2" /> Chat with Amani now
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link to="/mind-check">Take the free wellbeing check</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <img src={amaniAvatar} alt="Amani AI avatar" width={40} height={40} className="rounded-full" loading="lazy" />
              <span>Trusted by 10,000+ Africans on their wellness journey</span>
            </div>
          </div>
          <div>
            <img
              src={heroImg}
              alt="Woman smiling while chatting with Amani AI on her phone"
              width={1280}
              height={720}
              className="w-full rounded-2xl shadow-xl object-cover aspect-video"
            />
          </div>
        </div>
      </section>

      {/* Why Amani */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why thousands of Ugandans talk to Amani first</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Clock, title: "Always available", body: "2am, lunch break, Sunday morning — Amani is online whenever you need to talk things through." },
              { Icon: ShieldCheck, title: "Completely private", body: "No employer, family or friend sees what you share. Your conversation stays between you and Amani." },
              { Icon: Heart, title: "Built for African life", body: "Amani understands Kampala stress, family expectations, faith life and East African workplace culture." },
              { Icon: Sparkles, title: "Smart next step", body: "Whether it's a free assessment, a support group or a licensed therapist, Amani points you to the right help." },
              { Icon: Globe2, title: "English-first, multi-lingual", body: "Built for Uganda, Kenya and the wider African diaspora — accessible anywhere with internet." },
              { Icon: MessageCircle, title: "No signup required", body: "Just open the chat bubble. No long forms, no waiting list, no credit card." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl border bg-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">How Amani works</h2>
          <ol className="space-y-5">
            {[
              "Tap the blue chat bubble at the bottom-right of any InnerSpark page.",
              "Tell Amani what's on your mind — there's no right or wrong way to start.",
              "Amani listens, suggests coping ideas, and helps you decide a next step.",
              "If you'd like, Amani matches you to a licensed therapist or a free check.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">{i + 1}</span>
                <p className="pt-1.5 text-base text-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border bg-card p-5 group">
                <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to chat with Amani?</h2>
          <p className="text-lg text-primary-foreground/90 mb-7">It's free, private, and only takes a moment to start.</p>
          <Button size="lg" variant="secondary" className="rounded-full" onClick={openAmani}>
            <MessageCircle className="w-5 h-5 mr-2" /> Open Amani chat
          </Button>
        </div>
      </section>
    </main>
    <AppDownload />
    <Footer />
  </>
);

export default AmaniAI;