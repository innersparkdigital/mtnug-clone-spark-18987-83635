import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/mental-health-hero.jpg";

const MenTherapyUgandaPost = () => {
  const url = "https://www.innersparkafrica.com/blog/men-therapy-uganda";
  const title = "Men and Therapy in Uganda: Why More Ugandan Men Are Seeking Help Online";
  const desc = "Ugandan men strongly prefer anonymous, online therapy over clinic visits. Voice and chat sessions, no video required, from UGX 75,000.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["men mental health Uganda","therapy for men Uganda","male therapist Uganda","men counselling Kampala","anonymous therapy for men Uganda","men depression help Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Can men do therapy without video in Uganda?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can choose voice call or chat — your face is never on screen. Many Ugandan men start with voice or chat and switch to video only if and when they're ready." } },
    { "@type": "Question", name: "Are there male therapists in Uganda?", acceptedAnswer: { "@type": "Answer", text: "Yes. Innerspark Africa has licensed male and female therapists. You can filter the therapist directory by gender, language and specialty before booking." } },
    { "@type": "Question", name: "How private is online therapy for men?", acceptedAnswer: { "@type": "Answer", text: "Completely. Sessions are anonymous to your employer and your family. You pay from your personal Mobile Money account, and there is no clinic visit and no paper trail." } }
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="men mental health Uganda, therapy for men Uganda, male therapist Uganda, men counselling Kampala, anonymous therapy for men Uganda, men depression help Uganda, men stress management Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Men's Mental Health</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />8 min read</span></div>
            <img src={hero} alt="Ugandan man on a private voice therapy call" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">For a long time, the story about men and therapy in Uganda was simple: men don't go. They tough it out, they pray about it, they drink about it, or they don't talk about it at all. But the data — and what we're seeing on our platform — tells a more interesting story. Ugandan men <em>are</em> seeking help. They are just doing it on their own terms: privately, anonymously, online.</p>
            <h2>What men in Uganda actually want from therapy</h2>
            <p>When you talk to Ugandan men about why they've avoided counselling, the same three answers come up:</p>
            <ol>
              <li><strong>Privacy.</strong> "I cannot be seen walking into a clinic." For a man with a wife, a job, and a reputation, being spotted is a real cost.</li>
              <li><strong>Control.</strong> Many men want to talk on their own terms — at night, from their car, in their own language, without a stranger looking at their face on day one.</li>
              <li><strong>Practicality.</strong> "Don't make me take a half-day off work to sit in traffic to Kololo." A 45-minute voice call after the kids are asleep is something he can do.</li>
            </ol>
            <p>Online therapy — done well — answers all three.</p>
            <h2>Voice and chat first, video later (if ever)</h2>
            <p>One of the most important things to know about online therapy on Innerspark: you do not have to turn your camera on. Many Ugandan men start with a voice call. Some start with chat. Your therapist's face does not appear if you don't want it to, and yours certainly doesn't. This single design choice — making video optional — has done more to bring men onto the platform than any other feature.</p>
            <h2>What Ugandan men are actually coming to therapy for</h2>
            <ul>
              <li><strong>Work stress and burnout.</strong> Long hours, financial pressure, the weight of being the family's main earner.</li>
              <li><strong>Anger and irritability.</strong> Often the first sign that something deeper — usually grief or untreated depression — needs attention.</li>
              <li><strong>Relationship and marriage stress.</strong> Especially the silent kind that doesn't get talked about at home.</li>
              <li><strong>Sexual difficulties and performance anxiety.</strong> Almost never discussed elsewhere — but very common in private sessions.</li>
              <li><strong>Loss.</strong> Fathers, brothers, friends. Many men carry grief from years ago that has never been spoken aloud.</li>
              <li><strong>Drinking that has slowly gotten heavier.</strong> A common entry point into other underlying issues.</li>
            </ul>
            <h2>"Therapy isn't for men like me"</h2>
            <p>This is the most common objection, and it is worth answering directly. Therapy is not weakness, it is not crying about your childhood, and it is not pretending that prayer or hard work don't matter. A good therapist is closer to a strategic advisor for your inner life: someone who helps you understand what is actually going on, build a plan, and execute it. Most Ugandan men describe their first session as "more practical than I expected."</p>
            <h2>What it costs and how to pay</h2>
            <p>Sessions are UGX 75,000 (~$22). Payment is by MTN Mobile Money or Airtel Money, from your personal number. No insurance forms, no HR paperwork, no one at home needs to see the line item.</p>
            <h2>Where to start, if you've been thinking about it</h2>
            <p>The simplest first step: take the free <Link to="/wellbeing-check" className="text-primary hover:underline">3-minute mental wellbeing check</Link>. It is completely anonymous. No name, no email required. You'll get a personal score with a short explanation of what it means. Most men are surprised by their own result. From there, you can <Link to="/specialists" className="text-primary hover:underline">choose a therapist</Link> — male or female, in English or Luganda — and book a voice or chat session yourself.</p>
            <h2>Frequently asked questions</h2>
            <h3>Can I do therapy without video?</h3>
            <p>Yes. Voice call or chat. Your face never has to be on screen.</p>
            <h3>Are there male therapists?</h3>
            <p>Yes. You can filter by gender on the <Link to="/specialists" className="text-primary hover:underline">specialists page</Link>.</p>
            <h3>How private is it?</h3>
            <p>Completely. No clinic, no paper trail, no one at work or home is informed.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">On your own terms</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">Voice or chat. No video required. Talk to a licensed therapist — privately, from your phone.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8"><Link to="/specialists">Choose a Therapist</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/wellbeing-check">Free anonymous check</Link></Button>
            </div>
          </div>
          <SocialShareButtons title={title} url={url} />
          <RelatedArticles currentSlug="men-therapy-uganda" />
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};
export default MenTherapyUgandaPost;