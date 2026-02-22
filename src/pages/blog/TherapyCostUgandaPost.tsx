import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import mentalHealthHeroImage from "@/assets/blog/mental-health-hero.jpg";

const TherapyCostUgandaPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "How Much Does Therapy Cost in Uganda? A Complete 2026 Guide",
    description: "Find out what therapy costs in Uganda in 2026. Compare prices for online, in-person, group therapy, and discover affordable options starting at UGX 30,000.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["therapy cost Uganda", "how much does therapy cost", "affordable therapy Uganda", "online therapy price Uganda", "cheap therapy Kampala"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/therapy-cost-uganda" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does therapy cost in Uganda?",
        acceptedAnswer: { "@type": "Answer", text: "Therapy in Uganda ranges from UGX 30,000 to UGX 200,000 per session depending on the type. Online therapy starts at UGX 30,000, while in-person sessions at private clinics can cost UGX 100,000–200,000." }
      },
      {
        "@type": "Question",
        name: "Is there free therapy in Uganda?",
        acceptedAnswer: { "@type": "Answer", text: "Some NGOs and government health centers offer free counseling. Innerspark Africa also provides subsidized sessions through its Donate Therapy program and free initial consultations." }
      },
      {
        "@type": "Question",
        name: "Is online therapy cheaper than in-person therapy in Uganda?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Online therapy sessions in Uganda typically cost 50–70% less than in-person visits, starting from UGX 30,000 per session compared to UGX 100,000+ for clinic-based therapy." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How Much Does Therapy Cost in Uganda? 2026 Pricing Guide | Innerspark Africa</title>
        <meta name="description" content="Therapy in Uganda costs UGX 30,000–200,000 per session. Compare online vs in-person prices, discover affordable options, and book your first session today." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/therapy-cost-uganda" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </nav>

          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Therapy Costs</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">How Much Does Therapy Cost in Uganda? A Complete 2026 Guide</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 10 min read</span>
            </div>
            <img src={mentalHealthHeroImage} alt="Therapy session in Uganda" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Mental health care is becoming more accessible in Uganda, but one of the biggest questions people ask is: <strong>"How much will it cost?"</strong> This guide breaks down therapy prices across different formats so you can find the right option for your budget.
            </p>

            <h2>The Real Cost of Therapy in Uganda (2026)</h2>
            <p>
              Therapy costs in Uganda vary widely depending on whether you choose online or in-person sessions, the therapist's experience level, and the type of therapy. Here's a realistic breakdown:
            </p>

            <div className="bg-accent/50 rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Uganda Therapy Price Comparison (2026)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-medium">Online Therapy (Innerspark Africa)</span>
                  <span className="font-bold text-primary">UGX 30,000 – 80,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-medium">In-Person (Private Clinic)</span>
                  <span className="font-bold">UGX 100,000 – 200,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-medium">Psychiatrist Visit</span>
                  <span className="font-bold">UGX 150,000 – 300,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-medium">Group Therapy Session</span>
                  <span className="font-bold text-primary">UGX 15,000 – 30,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Government Health Center</span>
                  <span className="font-bold">Free – UGX 10,000</span>
                </div>
              </div>
            </div>

            <h2>Why Online Therapy Is the Most Affordable Option</h2>
            <p>
              Online therapy platforms like <Link to="/" className="text-primary hover:underline">Innerspark Africa</Link> have made professional mental health support accessible to more Ugandans by eliminating costs associated with physical clinics — rent, transport, and waiting times.
            </p>
            <ul>
              <li><strong>No transport costs:</strong> Access therapy from your home, office, or anywhere with internet</li>
              <li><strong>Lower session fees:</strong> Sessions start at just UGX 30,000 — up to 70% cheaper than in-person</li>
              <li><strong>Flexible scheduling:</strong> Book sessions around your schedule, including evenings and weekends</li>
              <li><strong>Multiple formats:</strong> Choose video, voice, or chat-based therapy based on your comfort</li>
            </ul>

            <h2>What Affects Therapy Pricing?</h2>
            <p>Several factors influence how much you'll pay for therapy in Uganda:</p>
            <ol>
              <li><strong>Therapist qualifications:</strong> Clinical psychologists and psychiatrists charge more than counselors</li>
              <li><strong>Session duration:</strong> Standard sessions are 45–60 minutes; longer sessions cost more</li>
              <li><strong>Specialization:</strong> Trauma therapy, couples counseling, and child therapy may have premium pricing</li>
              <li><strong>Location:</strong> Kampala-based clinics charge more than upcountry facilities</li>
              <li><strong>Platform:</strong> Online platforms offer competitive pricing due to lower overhead</li>
            </ol>

            <h2>How to Get Affordable Therapy in Uganda</h2>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Use online platforms:</strong> <Link to="/specialists" className="text-primary hover:underline">Innerspark Africa's licensed therapists</Link> offer sessions starting at UGX 30,000
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Try group therapy:</strong> <Link to="/support-groups" className="text-primary hover:underline">Support groups</Link> cost as little as UGX 15,000 per session and provide community support
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Free consultations:</strong> Many therapists, including Innerspark's, offer a free first consultation via WhatsApp
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Donated therapy:</strong> Through our <Link to="/donate-therapy" className="text-primary hover:underline">Donate Therapy</Link> program, you may qualify for sponsored sessions
                </div>
              </div>
            </div>

            <h2>Is Therapy Worth the Investment?</h2>
            <p>
              Research from the <a href="https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">World Health Organization</a> shows that every $1 invested in mental health treatment returns $4 in improved health and productivity. In Uganda, untreated depression costs the economy an estimated UGX 2.5 trillion annually through lost productivity.
            </p>
            <p>
              Therapy isn't just about feeling better — it improves your relationships, work performance, and physical health. At UGX 30,000 per session, professional mental health support is more affordable than most people think.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">How much does therapy cost in Uganda?</h3>
                <p className="text-muted-foreground">Online therapy starts at UGX 30,000 per session. In-person therapy at private clinics ranges from UGX 100,000 to UGX 200,000. Government health centers may offer free or low-cost counseling.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Is there free therapy in Uganda?</h3>
                <p className="text-muted-foreground">Yes. Some NGOs and government facilities offer free counseling. Innerspark Africa also provides free initial consultations and subsidized sessions through its Donate Therapy program.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Is online therapy cheaper than in-person?</h3>
                <p className="text-muted-foreground">Yes, online therapy is typically 50–70% cheaper because it eliminates clinic overhead costs. Plus, you save on transport.</p>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Therapy?</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              Sessions start at just UGX 30,000. Talk to a licensed therapist today — via video, voice, or chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Book a Therapist Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I%20want%20to%20know%20about%20therapy%20costs" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="How Much Does Therapy Cost in Uganda?" url="https://www.innersparkafrica.com/blog/therapy-cost-uganda" />
          <RelatedArticles currentSlug="therapy-cost-uganda" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default TherapyCostUgandaPost;
