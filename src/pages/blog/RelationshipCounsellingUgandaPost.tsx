import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/benefits-therapy-hero.jpg";

const RelationshipCounsellingUgandaPost = () => {
  const url = "https://www.innersparkafrica.com/blog/relationship-counselling-uganda-online";
  const title = "Relationship Counselling in Uganda: Can It Be Done Online?";
  const desc = "Online relationship counselling in Uganda — for couples and individuals. Private video, voice or chat sessions with licensed therapists, from UGX 75,000.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["relationship counselling Uganda","couples therapy Uganda","marriage counselling Kampala","therapist for couples Uganda","online relationship counselling Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Can couples do therapy online in Uganda?", acceptedAnswer: { "@type": "Answer", text: "Yes. Couples can join the same WhatsApp video session from one device, or from two different locations. Many couples in long-distance arrangements use this to stay connected with the same therapist." } },
    { "@type": "Question", name: "What if only one partner wants counselling?", acceptedAnswer: { "@type": "Answer", text: "Individual relationship therapy is one of the most common reasons Ugandans book sessions. You can do meaningful relationship work alone — sometimes that work later draws the other partner in." } },
    { "@type": "Question", name: "How much does relationship counselling cost in Uganda?", acceptedAnswer: { "@type": "Answer", text: "Sessions are UGX 75,000 (~$22), the same as individual therapy, payable via MTN or Airtel Mobile Money." } }
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="relationship counselling Uganda, couples therapy Uganda, marriage counselling Kampala, therapist for couples Uganda, online relationship counselling Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Relationships</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />8 min read</span></div>
            <img src={hero} alt="Couple on a private online counselling session in Uganda" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">Relationship stress is one of the most common reasons Ugandans privately search for therapy. But the traditional model — a couple driving together to a clinic, sitting awkwardly in a waiting room, then talking openly in front of a stranger about money, sex, and family — is, for many Ugandan couples, simply not realistic. Online relationship counselling has changed what is possible.</p>
            <h2>Yes, online relationship counselling works</h2>
            <p>Multiple studies show that online couples therapy is as effective as in-person work for most issues couples bring — communication breakdowns, recurring conflict, intimacy difficulties, parenting stress, infidelity recovery, and major life-transition stress. What matters is the quality of the therapist and the willingness of both partners, not whether you are in the same room.</p>
            <h2>Three formats Ugandan couples use</h2>
            <ol>
              <li><strong>Both partners on one device.</strong> A 60-minute WhatsApp video session from the living room couch after the children are asleep. Most common format for married couples in Kampala.</li>
              <li><strong>Both partners from different locations.</strong> Useful when one partner works upcountry, lives abroad, or travels frequently for work. The therapist joins via a shared video link.</li>
              <li><strong>Individual relationship work.</strong> One partner books their own sessions to work on the relationship. Often the most powerful path — and sometimes it eventually opens space for the other partner to join.</li>
            </ol>
            <h2>What couples in Uganda are actually working on</h2>
            <ul>
              <li><strong>Communication that has gone quiet.</strong> Long-married couples who barely talk beyond logistics.</li>
              <li><strong>Money stress and unequal earning.</strong> Especially common when wives out-earn husbands or when extended-family financial demands are unspoken.</li>
              <li><strong>Parenting disagreements.</strong> Different philosophies on discipline, schooling, religion, screen time.</li>
              <li><strong>Sex and intimacy.</strong> One of the most under-discussed and most fixable areas.</li>
              <li><strong>Infidelity — recent or historical.</strong> Recovery is possible. It requires structure and skilled support.</li>
              <li><strong>Family-of-origin pressure.</strong> In-laws, clan expectations, religious obligations.</li>
              <li><strong>Pre-marital counselling.</strong> Before the wedding, not after the crisis.</li>
            </ul>
            <h2>Privacy is the unlock</h2>
            <p>For many Ugandan couples — especially when one partner is in a high-visibility role — being seen at a counselling clinic is itself a risk. Online sessions remove that risk entirely. Your session is between you, your partner, and your therapist. Nothing is shared with anyone else. Payment is via personal Mobile Money. No insurance forms.</p>
            <h2>How to start when only one of you is sure</h2>
            <p>It is normal for one partner to be more open to therapy than the other. The most useful first move is usually for the willing partner to book an individual session, get clarity on what is actually happening in the relationship, and bring back a more specific invitation: "I'm seeing a therapist on X day. Would you be willing to join me for one session, just to see what it's like?" That is a much easier yes than "we need to go to counselling."</p>
            <h2>How to book</h2>
            <p>Browse <Link to="/specialists" className="text-primary hover:underline">licensed therapists in Uganda</Link> and filter by relationship/couples specialty. Book your first session in two minutes. Pay UGX 75,000 via MTN or Airtel Mobile Money. Sessions happen via WhatsApp video, voice, or chat — whichever you and your partner prefer.</p>
            <h2>Frequently asked questions</h2>
            <h3>Can couples do therapy online in Uganda?</h3>
            <p>Yes — from one device together, or from two different locations.</p>
            <h3>What if only one of us wants to come?</h3>
            <p>Individual relationship therapy is meaningful and common. It often opens the door for the other partner later.</p>
            <h3>How much does it cost?</h3>
            <p>UGX 75,000 per session, the same as individual therapy.</p>
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get the conversation back on track</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">Online relationship counselling with licensed Ugandan therapists. Private. Practical. From UGX 75,000.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8"><Link to="/specialists">Book a Relationship Therapist</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/wellbeing-check">Free 3-min check</Link></Button>
            </div>
          </div>
          <SocialShareButtons title={title} url={url} />
          <RelatedArticles currentSlug="relationship-counselling-uganda-online" />
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};
export default RelationshipCounsellingUgandaPost;