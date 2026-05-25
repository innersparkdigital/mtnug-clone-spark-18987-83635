import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/talk-to-boss-mental-health-uganda.jpg";

const UgandaWorkplaceCrisisPost = () => {
  const url = "https://www.innersparkafrica.com/blog/uganda-workplace-mental-health-crisis";
  const title = "Uganda's Workplace Mental Health Crisis: What HR Leaders Need to Know in 2026";
  const desc = "Burnout, absenteeism and quiet quitting are draining Uganda's top employers. Here's what HR teams in Kampala can do — and how InnerSpark Africa's corporate programs help.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-05-25", dateModified: "2026-05-25", inLanguage: "en", keywords: ["workplace mental health Uganda","EAP Uganda","employee wellbeing Kampala","corporate mental health Uganda","HR mental health Uganda"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is an Employee Assistance Program (EAP)?", acceptedAnswer: { "@type": "Answer", text: "An EAP is a confidential workplace benefit that gives employees free access to short-term counselling, mental health screening and crisis support. In Uganda, InnerSpark Africa delivers EAPs entirely online — staff can book private sessions from their phone." } },
    { "@type": "Question", name: "How much does workplace mental health support cost in Uganda?", acceptedAnswer: { "@type": "Answer", text: "InnerSpark Africa's corporate screening starts from UGX 7,500 per employee, with full EAP packages priced per headcount. Most Ugandan employers recover the cost within months through reduced absenteeism and turnover." } },
    { "@type": "Question", name: "Will employees actually use a confidential service?", acceptedAnswer: { "@type": "Answer", text: "Yes — when it is genuinely private. InnerSpark only shares anonymised, aggregate dashboards with HR. No employee name, condition or session content is ever shared with the employer." } }
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="workplace mental health Uganda, EAP Uganda, employee wellbeing Kampala, corporate mental health Uganda, HR mental health Uganda, employee assistance program Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">For HR & Employers</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />May 25, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />11 min read</span></div>
            <img src={hero} alt="HR leader discussing employee wellbeing in a Kampala office" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">If you run HR or People Operations at a Ugandan bank, NGO, telecom or government agency, you are already feeling it. Sick days are climbing. High performers are quietly resigning. Engagement scores are softer than they were two years ago. The cause is rarely a salary problem — it is a mental health problem the organisation has not yet named.</p>
            <h2>The numbers behind Uganda's workplace mental health crisis</h2>
            <p>The World Health Organization estimates that depression and anxiety cost the global economy <strong>US$1 trillion in lost productivity every year</strong>. In Uganda, the Ministry of Health reports that roughly <strong>one in four adults</strong> will experience a diagnosable mental health condition in their lifetime — and most will go through it while employed, without ever telling their employer.</p>
            <p>For a 200-person Kampala employer, that is roughly 50 staff silently navigating depression, anxiety, grief, burnout or substance use in any given year. None of them appear on your incident reports. All of them show up in your turnover, absenteeism and quality numbers.</p>
            <h2>The hidden costs HR sees but doesn't always connect</h2>
            <ul>
              <li><strong>Absenteeism.</strong> Mental health is now a leading driver of unplanned leave in Ugandan corporate environments.</li>
              <li><strong>Presenteeism.</strong> Staff who show up but produce a fraction of their normal output. Far more expensive than absenteeism, and almost never measured.</li>
              <li><strong>Turnover.</strong> Replacing a mid-level professional in Kampala costs 6–9 months of their salary in recruitment, onboarding and lost institutional knowledge.</li>
              <li><strong>Safety incidents</strong> in field roles (drivers, technicians, security) tied to fatigue, stress and untreated mental health conditions.</li>
              <li><strong>Quiet quitting and disengagement</strong>, which depresses team performance long before anyone resigns.</li>
            </ul>
            <h2>Why traditional EAPs have not worked in Uganda</h2>
            <p>Most "wellness" offerings stop at a yoga session, a wellness day, or a hotline staffed in another country. Ugandan employees rarely use these because they don't trust them, can't access them on their phone, or don't see anyone who understands the local context. Utilisation in many Kampala organisations sits below 5%.</p>
            <h2>What a modern Ugandan EAP looks like</h2>
            <p>A workplace mental health programme that actually works in Uganda needs five things:</p>
            <ol>
              <li><strong>Confidential digital screening</strong> so every employee can privately check on their own wellbeing.</li>
              <li><strong>Local, licensed therapists</strong> who speak the cultural language — not just the spoken one.</li>
              <li><strong>Online sessions</strong> by video, voice or chat, payable through company cover so the employee pays nothing at the point of use.</li>
              <li><strong>Manager training</strong> on spotting distress and having safe, supportive conversations.</li>
              <li><strong>Anonymised dashboards</strong> for HR — never individual data — so leadership can see where the organisation is hurting.</li>
            </ol>
            <h2>How InnerSpark Africa supports HR teams</h2>
            <p>InnerSpark Africa runs corporate mental health programs for some of Uganda's largest employers. Our standard package includes:</p>
            <ul>
              <li>Confidential employee screening from <strong>UGX 7,500 per employee</strong>.</li>
              <li>A pool of vetted Ugandan therapists — sessions delivered by video, voice or chat.</li>
              <li>An HR dashboard showing aggregate wellbeing trends, top concerns and uptake — no employee-level data.</li>
              <li>Manager mental health training delivered online.</li>
              <li>24/7 crisis pathway integrated with our clinical team.</li>
            </ul>
            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Bring InnerSpark to your team</h3>
              <p className="text-muted-foreground mb-4">Confidential, online, built for Uganda. Book a 20-minute discovery call.</p>
              <Button asChild size="lg"><Link to="/for-business">Explore InnerSpark for Business</Link></Button>
            </div>
            <h2>Where to start this quarter</h2>
            <p>If you only do one thing this quarter, run a confidential organisation-wide mental health screening. You'll have a real, anonymised baseline of where your people are — and a defensible business case for what to do next.</p>
          </div>
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};

export default UgandaWorkplaceCrisisPost;