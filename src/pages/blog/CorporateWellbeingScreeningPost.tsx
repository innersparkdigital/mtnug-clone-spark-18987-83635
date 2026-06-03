import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import hero from "@/assets/blog/corporate-wellbeing-uganda-hero.jpg";

const CorporateWellbeingScreeningPost = () => {
  const url = "https://www.innersparkafrica.com/blog/corporate-wellbeing-screening-uganda";
  const title = "Corporate Wellbeing Screening in Uganda — UGX 7,500/Employee with Clinical Safety Cover";
  const desc = "InnerSpark's corporate mental health screening for Ugandan employers: confidential WHO-5 + workplace screening at UGX 7,500 per employee, with clinical safety cover for at-risk staff.";
  const article = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description: desc, image: "https://www.innersparkafrica.com/innerspark-logo.png", author: { "@type": "Organization", name: "Innerspark Africa" }, publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } }, datePublished: "2026-06-03", dateModified: "2026-06-03", inLanguage: "en", keywords: ["corporate wellbeing Uganda","employee mental health screening","EAP Uganda","workplace wellness Kampala","WHO-5 corporate"], mainEntityOfPage: { "@type": "WebPage", "@id": url } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What does UGX 7,500 per employee include?", acceptedAnswer: { "@type": "Answer", text: "It covers the full confidential WHO-5 + workplace screening for each employee, an anonymous team-level analytics dashboard for HR, and clinical safety cover — meaning any employee who scores in the at-risk or critical range gets a free escalation call from a licensed InnerSpark therapist." } },
    { "@type": "Question", name: "What is 'clinical safety cover'?", acceptedAnswer: { "@type": "Answer", text: "Clinical safety cover means InnerSpark takes duty-of-care for anyone flagged by the screening. We reach out privately, offer an immediate triage call with a licensed therapist, and route emergencies to our 24/7 crisis line. Employers never see who was flagged — only the aggregated team picture." } },
    { "@type": "Question", name: "Will my employees' answers be shared with management?", acceptedAnswer: { "@type": "Answer", text: "Never. Individual results are confidential. HR only sees anonymous, aggregated data once at least 5 employees have completed the screening, so no individual can be identified." } },
    { "@type": "Question", name: "How long does the screening take per employee?", acceptedAnswer: { "@type": "Answer", text: "About 3 minutes on a phone or laptop. Employees access it via a private company link or access code — no app install required." } },
    { "@type": "Question", name: "What's the minimum company size?", acceptedAnswer: { "@type": "Answer", text: "We work with teams as small as 20 employees, all the way to multi-country organisations of 5,000+." } },
  ] };
  return (
    <>
      <Helmet>
        <title>{title} | Innerspark Africa</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="corporate wellbeing Uganda, employee mental health screening, EAP Uganda, workplace wellness Kampala, WHO-5 corporate, mental health screening Uganda" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
      </Helmet>
      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8"><Link to="/blog" className="inline-flex items-center text-primary"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Link></nav>
          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">For HR &amp; Employers</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6"><span className="flex items-center gap-1"><Calendar className="h-4 w-4" />June 3, 2026</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />8 min read</span></div>
            <img src={hero} alt="Corporate wellbeing screening for Ugandan employers — InnerSpark Africa" className="w-full rounded-xl aspect-video object-cover" />
          </header>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">If you run people operations at a Ugandan company, you already feel it: quiet quitting, rising absenteeism, the colleague who suddenly resigned with no warning. Mental health is no longer a "nice-to-have" — it's the single biggest invisible cost line in most Kampala workplaces. InnerSpark's Corporate Wellbeing Screening is the cheapest, fastest way to see what's actually going on inside your team — and to act on it without breaching anyone's privacy.</p>

            <h2>What you get for UGX 7,500 per employee</h2>
            <ul>
              <li><strong>Confidential 3-minute screening</strong> for every employee — WHO-5 wellbeing + workload, support and overwhelm questions.</li>
              <li><strong>Anonymous HR dashboard</strong> with team-level distribution: Healthy / At-risk / Critical.</li>
              <li><strong>Per-question demographic breakdowns</strong> so you can see (for example) whether overwhelm is concentrated in a specific department or age group.</li>
              <li><strong>Clinical safety cover</strong> — every at-risk or critical employee gets a free private outreach from a licensed Ugandan therapist within 48 hours.</li>
              <li><strong>Business impact summary</strong> in UGX — productivity at risk, days lost, ROI of intervention.</li>
              <li><strong>Branded campaign link</strong> for your company. No app install.</li>
            </ul>

            <h2>What "clinical safety cover" actually means</h2>
            <p>This is the part most screening tools quietly skip. A screening that flags 30% of your staff as at-risk and then does nothing is worse than not screening at all — it surfaces pain without offering relief. InnerSpark's clinical safety cover means:</p>
            <ol>
              <li>Any employee in the at-risk or critical band is contacted privately by a licensed InnerSpark therapist.</li>
              <li>They get one free triage call to talk it through and figure out the right next step.</li>
              <li>If they're in crisis, we route immediately to our 24/7 line (+256 792 085 773).</li>
              <li>The employer never sees who was contacted. Duty of care is on us, not on HR.</li>
            </ol>

            <h2>Privacy is non-negotiable</h2>
            <p>HR dashboards only unlock once at least 5 employees have submitted, and every chart shows aggregates — never an individual answer. This is the only way employees will be honest, and honest data is the only data worth paying for.</p>

            <h2>How a typical rollout works</h2>
            <ol>
              <li><strong>Day 0:</strong> You sign up and we issue your company a private screening link and access code.</li>
              <li><strong>Day 1–10:</strong> Employees complete the 3-minute screening on their phones.</li>
              <li><strong>Day 11:</strong> HR sees the live dashboard. Clinical safety cover begins for flagged employees.</li>
              <li><strong>Day 14:</strong> InnerSpark presents your tailored business-impact report and recommended interventions (EAP, manager training, support groups).</li>
            </ol>

            <div className="not-prose my-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Screen your team for UGX 7,500/employee</h3>
              <p className="text-muted-foreground mb-4">Includes clinical safety cover. No subscription, no minimum 12-month lock-in.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg"><Link to="/for-business">Talk to our team</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/corporate-wellbeing-check">See the screening tool</Link></Button>
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

export default CorporateWellbeingScreeningPost;