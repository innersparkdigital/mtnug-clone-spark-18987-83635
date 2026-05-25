import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/workplace-burnout-uganda.jpg";

const BurnoutKampalaProfessionalsPost = () => {
  const url = "https://www.innersparkafrica.com/blog/burnout-kampala-professionals";
  const title = "Burnout at Work in Kampala: How to Know When You Need More Than a Holiday";
  const desc = "Burnout in Kampala professionals is rising. Learn the warning signs, why a vacation won't fix it, and how online therapy helps you recover properly.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["burnout Uganda","work stress Kampala","burnout therapy Uganda","therapy for work stress Uganda","burnout recovery Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is the difference between stress and burnout?", acceptedAnswer: { "@type": "Answer", text: "Stress is short-term overload. Burnout is the chronic state that follows when stress never resolves — emotional exhaustion, cynicism about your work, and a sense that nothing you do matters." } },
    { "@type": "Question", name: "Will a holiday fix burnout?", acceptedAnswer: { "@type": "Answer", text: "Not by itself. A holiday gives temporary relief, but the symptoms return within days of going back to the same role, the same workload, and the same lack of recovery practices. Real recovery usually requires structural changes plus therapeutic support." } },
    { "@type": "Question", name: "How can therapy help with burnout?", acceptedAnswer: { "@type": "Answer", text: "A therapist helps you identify the specific drivers of your burnout (workload, lack of control, values mismatch, etc.), build sustainable recovery routines, and renegotiate boundaries — at work and at home." } }
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="burnout Uganda, work stress Kampala, burnout therapy Uganda, therapy for work stress Uganda, burnout recovery Uganda, professional burnout Kampala" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Workplace Wellbeing</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />9 min read</span></div>
            <img src={hero} alt="Exhausted professional at desk in Kampala office" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">If you work in an NGO office in Kololo, a bank in the CBD, or a ministry in Nakasero, you probably know the feeling. You start the week tired. By Wednesday, you are operating on coffee and dread. By Friday, you don't even want the weekend — you want to disappear. You tell yourself you just need a holiday. But somewhere underneath, you suspect a holiday will not be enough. You are probably right.</p>
            <h2>Burnout is not the same as stress</h2>
            <p>The World Health Organization formally defines burnout as a syndrome resulting from chronic workplace stress that has not been successfully managed. It has three dimensions: <strong>energy depletion</strong> (you feel exhausted in a way that sleep doesn't fix), <strong>increased mental distance from your job</strong> (cynicism, irritability, going through the motions), and <strong>reduced professional efficacy</strong> (a creeping sense that nothing you do matters or works).</p>
            <p>Stress is what you feel before a deadline. Burnout is what you feel when the deadline never ends and you've stopped believing the work counts.</p>
            <h2>The signs Kampala professionals should not ignore</h2>
            <ul>
              <li>You wake up tired even after eight hours of sleep.</li>
              <li>You're irritable with your spouse, children, or staff in ways that are out of character.</li>
              <li>Things that used to motivate you — promotion, recognition, money — feel flat.</li>
              <li>You're drinking, scrolling, or eating more than you used to in the evenings.</li>
              <li>You've stopped exercising, calling friends, or doing anything that is just for you.</li>
              <li>You've started fantasising about quitting — not to do something else, just to escape.</li>
              <li>Your body is sending bills: chest tightness, stomach issues, headaches your doctor cannot explain.</li>
            </ul>
            <p>If three or more of those describe your last month, you're not "just tired." You're somewhere on the burnout spectrum.</p>
            <h2>Why a holiday alone will not fix it</h2>
            <p>A holiday gives temporary relief. But because nothing structural has changed — the same workload, the same boss, the same unmanageable inbox — the relief evaporates within days of returning. Many Kampala professionals notice this and conclude that something must be wrong with them. Nothing is wrong with them. They are responding normally to a sustained imbalance between demand and recovery.</p>
            <h2>What actually helps</h2>
            <ol>
              <li><strong>Honest diagnosis.</strong> Is this burnout, depression, anxiety, or all three? They look similar but need different responses. A licensed therapist can sort this out in one or two sessions.</li>
              <li><strong>Recovery routines that fit your life.</strong> Not "do yoga at 5am" — actual, small, daily recovery rituals you can sustain in a Kampala professional schedule.</li>
              <li><strong>Boundary work.</strong> Burnout almost always involves boundaries that have collapsed — with your manager, your phone, your weekends, your family expectations. Therapy gives you language and scripts to renegotiate these.</li>
              <li><strong>A plan for the next 90 days.</strong> Not a five-year life redesign. Just the next quarter, with weekly check-ins to make sure recovery is actually happening.</li>
            </ol>
            <h2>Doing it privately</h2>
            <p>Most Kampala professionals do not want their employer to know they are working on burnout — at least not at first. With Innerspark you can take a free <Link to="/wellbeing-check" className="text-primary hover:underline">WHO-5 wellbeing check</Link> anonymously, book a session online, and meet with a therapist via WhatsApp video, voice, or chat from your home or your car. Payment is via Mobile Money. No one at work sees anything.</p>
            <h2>Frequently asked questions</h2>
            <h3>How do I know if it's burnout or depression?</h3>
            <p>They overlap. A licensed therapist can usually distinguish them in one or two sessions and recommend the right path.</p>
            <h3>Will a holiday fix it?</h3>
            <p>Temporarily. Without structural and therapeutic work, the symptoms come back within days of returning.</p>
            <h3>How does therapy help with burnout?</h3>
            <p>It identifies the specific drivers, builds sustainable recovery routines, and gives you tools to renegotiate boundaries at work and at home.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Recover properly — not just briefly</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">Talk to a licensed Ugandan therapist who understands professional burnout. From UGX 75,000 per session.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8"><Link to="/specialists">Book a Burnout Therapist</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/wellbeing-check">Take the free check</Link></Button>
            </div>
          </div>
          <SocialShareButtons title={title} url={url} />
          <RelatedArticles currentSlug="burnout-kampala-professionals" />
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};
export default BurnoutKampalaProfessionalsPost;