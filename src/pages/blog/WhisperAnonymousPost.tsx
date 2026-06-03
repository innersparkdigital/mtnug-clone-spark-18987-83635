import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/whisper-hero.jpg";

const WhisperAnonymousPost = () => {
  const url = "https://www.innersparkafrica.com/blog/whisper-anonymous-therapy-uganda";
  const title = "Too Heavy to Type? Try Whisper — Anonymous, Free Therapist Replies in Uganda";
  const desc = "Whisper lets you send a 3-minute anonymous voice note to a real Ugandan therapist — and get a thoughtful reply within 24 hours. Free, private, no signup. Here's how it works.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-06-03", dateModified: "2026-06-03", inLanguage: "en", keywords: ["anonymous therapy Uganda","free voice therapy","Whisper InnerSpark","anonymous mental health support Africa","free therapist reply Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Is Whisper really anonymous?", acceptedAnswer: { "@type": "Answer", text: "Yes. You don't need to give your name. We only ask for an email so we can send the therapist's reply privately to you — the therapist never sees your email." } },
    { "@type": "Question", name: "How fast will I get a reply?", acceptedAnswer: { "@type": "Answer", text: "Usually within 24 hours. A real licensed Ugandan therapist listens to your whisper and records or writes a thoughtful reply back to you." } },
    { "@type": "Question", name: "How much does Whisper cost?", acceptedAnswer: { "@type": "Answer", text: "Nothing. Whisper is completely free. If you'd like a private 1:1 session afterwards you can book a paid therapy session, but the Whisper exchange itself is on us." } },
    { "@type": "Question", name: "What can I talk about?", acceptedAnswer: { "@type": "Answer", text: "Anything. People whisper about anxiety, relationship pain, grief, work stress, loneliness, or things they've never said out loud. There is no wrong topic." } },
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="anonymous therapy Uganda, free therapist reply, Whisper InnerSpark, voice therapy Africa, mental health support Kampala" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Mental Health</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />June 3, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />7 min read</span></div>
            <img src={hero} alt="Person quietly recording an anonymous Whisper voice note in low blue light" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">Some things are too heavy to type. You sit down to write a message and the words won't come — but if you could just <em>say</em> it, even into the dark, you would. That's what <strong>Whisper</strong> is for.</p>

            <h2>What is Whisper?</h2>
            <p>Whisper is a free InnerSpark feature that lets you record up to 3 minutes of voice — anonymously — and have a real, licensed Ugandan therapist listen and reply within 24 hours. No video. No name. No appointment. Just your voice, and a thoughtful, human response back.</p>

            <h2>Why voice, not chat?</h2>
            <p>Typing forces you to edit. Voice doesn't. When someone speaks, you hear the pauses, the tightness, the relief — and so does a trained listener. For people who carry shame, grief or shock that they've never said out loud, simply speaking the words is itself part of the healing.</p>

            <h2>How it works — three steps</h2>
            <ol>
              <li><strong>Record.</strong> Visit the Whisper page, tap the microphone, and speak for up to 3 minutes. You can re-record as many times as you like.</li>
              <li><strong>Send.</strong> Add an email (only used to deliver your reply — the therapist never sees it). Submit. That's it.</li>
              <li><strong>Receive.</strong> Within 24 hours, you'll get a private link to a personal reply from a real Ugandan therapist — usually a short voice note, sometimes written words. Yours forever, no one else's.</li>
            </ol>

            <h2>What people whisper about</h2>
            <p>Loneliness. A breakup. A baby they lost. A boss they're afraid of. Faith doubts. Late-night thoughts that feel too big for the morning. Some whispers are 30 seconds. Some are 3 minutes. None are wrong.</p>

            <h2>How private is this, really?</h2>
            <p>Whisper is built for true anonymity. No name needed. Your email never reaches the therapist. The audio is stored encrypted and the reply link is unique to you. We will never share Whisper content — not with employers, not with family, not with anyone.</p>

            <h2>Why we built Whisper</h2>
            <p>In Uganda, mental health support carries layers of stigma. Many people would never walk into an office, but they will press a microphone button at 11pm. Whisper is our way of making sure that the first courageous step — saying what hurts out loud — is always free, always private, and always met with care.</p>

            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Send your first Whisper</h3>
              <p className="text-muted-foreground mb-4">Anonymous, free, replied to by a real Ugandan therapist within 24 hours.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/whisper">Try Whisper</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/amani-ai">Meet Amani AI</Link></Button>
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

export default WhisperAnonymousPost;