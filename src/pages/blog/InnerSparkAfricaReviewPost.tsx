import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/online-therapy-africa-hero.jpg";

const InnerSparkAfricaReviewPost = () => {
  const url = "https://www.innersparkafrica.com/blog/innerspark-africa-review";
  const title = "InnerSpark Africa Review (2026): Honest Look at Uganda's Online Therapy Platform";
  const desc = "A detailed 2026 review of InnerSpark Africa — pricing, therapists, privacy, payment methods and how it compares with other online therapy options for Uganda.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["InnerSpark Africa review","online therapy Uganda review","best online therapy Uganda","teletherapy Uganda","therapy app Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Is InnerSpark Africa legitimate?", acceptedAnswer: { "@type": "Answer", text: "Yes. InnerSpark Africa is a Uganda-registered mental health platform that works exclusively with licensed Ugandan therapists. All practitioners are vetted, hold valid qualifications and operate under standard clinical ethics." } },
    { "@type": "Question", name: "How much does an InnerSpark Africa session cost?", acceptedAnswer: { "@type": "Answer", text: "Standard online therapy sessions are UGX 75,000 (about US$22). Group support sessions are UGX 25,000. A free 3-minute mental health check is available at innersparkafrica.com/check." } },
    { "@type": "Question", name: "How do you pay?", acceptedAnswer: { "@type": "Answer", text: "You can pay through MTN Mobile Money, Airtel Money, or card via PesaPal. Payment happens at the time of booking and you receive a confirmation immediately." } },
    { "@type": "Question", name: "Is it confidential?", acceptedAnswer: { "@type": "Answer", text: "Yes. Sessions are private, your data is encrypted, and your employer, insurance company or family member is never notified — even if you book through a corporate program." } }
  ] };
  const pros = ["Licensed Ugandan therapists, vetted and clinically supervised","Sessions by video, voice or chat — your choice","Pay with MTN, Airtel or card (PesaPal)","Free 3-minute confidential mental health check","Corporate / EAP option for employers","Specialists for trauma, burnout, anxiety, relationships and depression"];
  const cons = ["No physical clinic — fully online only","Currently English and basic Luganda — more local languages coming","Session times limited to evenings on some specialists' calendars"];
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="InnerSpark Africa review, online therapy Uganda review, best online therapy Uganda, teletherapy Uganda, therapy app Uganda, mental health platform Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Platform Review</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />10 min read</span></div>
            <img src={hero} alt="Person reviewing InnerSpark Africa online therapy on a phone" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">If you've been searching "online therapy Uganda" in 2026, InnerSpark Africa probably keeps coming up. This is a candid review — what the platform does well, where it can improve, who it is genuinely suited to, and how it compares to other options available to Ugandans today.</p>
            <h2>What is InnerSpark Africa?</h2>
            <p>InnerSpark Africa is a Uganda-based online therapy and mental wellbeing platform. It connects users — individuals, students, professionals and entire workplaces — to licensed Ugandan therapists via video, voice and chat sessions. It also offers a free anonymous mental health screening, a workplace wellbeing dashboard, and a 24/7 crisis pathway.</p>
            <h2>Who it's for</h2>
            <ul>
              <li>Kampala professionals who want private therapy without sitting in a waiting room.</li>
              <li>Ugandan men who prefer voice or chat sessions to face-to-face.</li>
              <li>University students looking for affordable, discreet support.</li>
              <li>HR and People teams that want a real EAP designed for Uganda.</li>
              <li>Anyone outside Kampala who can't easily reach a clinic.</li>
            </ul>
            <h2>Pricing</h2>
            <p>InnerSpark's standard online therapy session is <strong>UGX 75,000</strong> (about US$22). That is meaningfully below the Kampala in-person average of UGX 120,000–200,000 per hour. Group support sessions are <strong>UGX 25,000</strong>. Corporate screening starts from <strong>UGX 7,500 per employee</strong>. The 3-minute mental health check is free.</p>
            <h2>Therapists and specialisations</h2>
            <p>All practitioners are licensed in Uganda and vetted by InnerSpark's clinical team. Specialisations include trauma, burnout, anxiety, depression, relationship counselling, grief, postpartum mental health and substance use support.</p>
            <h2>Privacy and confidentiality</h2>
            <p>This is one of InnerSpark's strongest areas. Bookings are confidential. Employers and insurers receive only anonymised aggregate data — never individual sessions, names or diagnoses. For a Ugandan audience where stigma is still real, this matters.</p>
            <div className="not-prose grid md:grid-cols-2 gap-6 my-8">
              <div className="p-6 rounded-xl border bg-card"><h3 className="font-bold text-lg mb-3">Pros</h3><ul className="space-y-2">{pros.map((p, i) => (<li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{p}</li>))}</ul></div>
              <div className="p-6 rounded-xl border bg-card"><h3 className="font-bold text-lg mb-3">Things to know</h3><ul className="space-y-2">{cons.map((c, i) => (<li key={i} className="text-sm text-muted-foreground">• {c}</li>))}</ul></div>
            </div>
            <h2>How it compares</h2>
            <p>Compared to international platforms (BetterHelp, Talkspace), InnerSpark wins on local context, currency (UGX), payment methods (MTN, Airtel) and cultural fit. Compared to in-person Kampala clinics, it wins on price, privacy and convenience — at the cost of not being in the same physical room as your therapist.</p>
            <h2>Verdict</h2>
            <p>For most Ugandans seeking quality, confidential, online mental health support in 2026, InnerSpark Africa is the most credible option available. The pricing is fair, the therapists are local and licensed, and the platform is built for how Ugandans actually use the internet — on a phone, often paying with Mobile Money.</p>
            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Try it for yourself</h3>
              <p className="text-muted-foreground mb-4">Start with the free 3-minute mental health check, or book your first session today.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/book-therapist">Book a Session</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/mind-check">Free Check</Link></Button>
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

export default InnerSparkAfricaReviewPost;