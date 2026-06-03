import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/find-therapist-uganda-hero.jpg";

const FindTherapistUgandaPost = () => {
  const url = "https://www.innersparkafrica.com/blog/find-a-therapist-in-uganda";
  const title = "How to Find a Licensed Therapist in Uganda — A 2026 Guide";
  const desc = "Looking for a therapist in Uganda? Here's how InnerSpark's vetted network of licensed Ugandan counsellors works — pricing from UGX 30,000, online video/voice/chat, MTN & Airtel Money accepted.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-06-03", dateModified: "2026-06-03", inLanguage: "en", keywords: ["therapist Uganda","find a therapist Kampala","licensed counsellor Uganda","online therapy Uganda","InnerSpark specialists"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "How much does therapy cost in Uganda on InnerSpark?", acceptedAnswer: { "@type": "Answer", text: "Sessions start at UGX 30,000 (~$8). A full 1-hour session with a senior therapist is UGX 75,000 (~$22). You only pay per session — no subscription." } },
    { "@type": "Question", name: "Are InnerSpark therapists really licensed?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every therapist on InnerSpark goes through credential verification, background checks, an interview, and references before they take a single client." } },
    { "@type": "Question", name: "Can I choose a male or female therapist?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can filter by gender, specialty, language and country, then book the specific therapist you're most comfortable with." } },
    { "@type": "Question", name: "What if my therapist isn't the right fit?", acceptedAnswer: { "@type": "Answer", text: "You can switch therapists at any time at no extra cost. Message support and we'll help you transition." } },
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="find a therapist Uganda, therapist Kampala, licensed counsellor Uganda, online therapy Uganda, InnerSpark specialists" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Find a Therapist</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />June 3, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />7 min read</span></div>
            <img src={hero} alt="Licensed Ugandan therapist on InnerSpark Africa" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">Finding a good therapist in Uganda has historically meant waiting weeks for a clinic appointment, paying upwards of UGX 200,000 per session in private practice, or hoping a friend can recommend someone. InnerSpark Africa exists to make that simpler — a vetted directory of licensed Ugandan therapists you can browse, filter and book in under five minutes.</p>

            <h2>Why people use InnerSpark to find a therapist</h2>
            <ul>
              <li><strong>Every therapist is vetted.</strong> Credentials verified, background-checked, interviewed.</li>
              <li><strong>Transparent pricing.</strong> Sessions from UGX 30,000. No subscription.</li>
              <li><strong>Your choice of format.</strong> Video, voice-only, or chat — whatever feels safest.</li>
              <li><strong>Filter by specialty.</strong> Anxiety, depression, trauma, addiction, relationships, work stress, parenting.</li>
              <li><strong>Pay how you want.</strong> MTN Mobile Money, Airtel Money, card, or PesaPal.</li>
              <li><strong>Confidential.</strong> No-one in your family, workplace or church needs to know.</li>
            </ul>

            <h2>How the matching works</h2>
            <p>You can either <Link to="/specialists" className="text-primary underline">browse the full specialists directory</Link> and pick someone yourself, or take a free 3-minute assessment and we'll recommend the best 3 therapists for what you're going through. Most people prefer the assessment route — it removes the guesswork.</p>

            <h2>What a first session looks like</h2>
            <p>The first session is mostly listening. Your therapist will ask what brought you to therapy, what you'd like to be different in 3 months, and a bit about your history. There's no homework, no judgement, and no obligation to come back if it doesn't feel right.</p>

            <h2>How to start today</h2>
            <ol>
              <li>Open the <Link to="/specialists" className="text-primary underline">Find a Therapist</Link> directory.</li>
              <li>Filter by what matters most (specialty, language, gender, price).</li>
              <li>Tap "Book" — pick a time that fits your schedule.</li>
              <li>Pay via Mobile Money. Get a confirmation within minutes.</li>
            </ol>

            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Find your therapist today</h3>
              <p className="text-muted-foreground mb-4">Browse licensed Ugandan therapists. Filter by specialty. Book in minutes.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/specialists">Browse Therapists</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/mind-check">Take the Free Assessment</Link></Button>
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

export default FindTherapistUgandaPost;