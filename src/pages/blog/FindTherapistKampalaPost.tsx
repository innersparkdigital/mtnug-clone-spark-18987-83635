import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import mentalHealthHeroImage from "@/assets/blog/mental-health-hero.jpg";

const FindTherapistKampalaPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Where to Find a Therapist in Kampala: Top 7 Options in 2026",
    description: "Looking for a therapist in Kampala? Discover the best ways to find licensed, affordable mental health professionals in Uganda's capital city.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["find therapist Kampala", "therapist near me Uganda", "counselor Kampala", "mental health Kampala", "psychologist Kampala"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/find-therapist-kampala" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where can I find a therapist in Kampala?",
        acceptedAnswer: { "@type": "Answer", text: "You can find a therapist in Kampala through online platforms like Innerspark Africa, Butabika National Referral Hospital, private clinics in Kololo and Nakasero, university counseling centers, and NGO-run mental health services." }
      },
      {
        "@type": "Question",
        name: "How do I choose the right therapist in Kampala?",
        acceptedAnswer: { "@type": "Answer", text: "Look for licensed professionals with relevant specialization, check reviews and credentials, consider whether you prefer online or in-person sessions, and take advantage of free consultations to find the right fit." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Where to Find a Therapist in Kampala – Top 7 Options (2026) | Innerspark Africa</title>
        <meta name="description" content="Looking for a therapist in Kampala? Discover 7 proven ways to find affordable, licensed mental health professionals in Uganda's capital. Book online today." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/find-therapist-kampala" />
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
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Finding Help</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">Where to Find a Therapist in Kampala: Top 7 Options in 2026</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 9 min read</span>
            </div>
            <img src={mentalHealthHeroImage} alt="Finding a therapist in Kampala" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Finding the right therapist in Kampala can feel overwhelming. With growing awareness of mental health in Uganda, there are now more options than ever — from online platforms to private clinics. Here's your definitive guide.
            </p>

            <h2>1. Online Therapy Platforms (Most Convenient)</h2>
            <p>
              Online therapy has become the fastest-growing way Ugandans access mental health support. Platforms like <Link to="/" className="text-primary hover:underline">Innerspark Africa</Link> connect you with licensed therapists from anywhere in Kampala — or Uganda.
            </p>
            <div className="bg-accent/50 rounded-xl p-6 my-4">
              <h4 className="font-bold mb-2">Why Choose Online Therapy?</h4>
              <ul className="space-y-2 mb-0">
                <li>Sessions from UGX 30,000 — no transport costs</li>
                <li>Video, voice, or chat options</li>
                <li>Book appointments any time, including evenings</li>
                <li><Link to="/specialists" className="text-primary hover:underline">Browse 20+ licensed therapists</Link> with verified credentials</li>
              </ul>
            </div>

            <h2>2. Butabika National Referral Hospital</h2>
            <p>
              Uganda's largest psychiatric facility offers both inpatient and outpatient mental health services. While wait times can be long, services are affordable or free for those who qualify. Located in Butabika, about 10km from Kampala city center.
            </p>

            <h2>3. Private Clinics in Kololo & Nakasero</h2>
            <p>
              Several reputable private practices operate in Kampala's upscale neighborhoods. Expect to pay UGX 100,000–200,000 per session. Notable areas include:
            </p>
            <ul>
              <li><strong>Kololo:</strong> Home to several established psychotherapy practices</li>
              <li><strong>Nakasero:</strong> Multiple wellness centers offering counseling</li>
              <li><strong>Ntinda:</strong> Growing hub for family and child therapy</li>
            </ul>

            <h2>4. University Counseling Centers</h2>
            <p>
              If you're a student at Makerere University, Kyambogo University, or Uganda Christian University, you can access free or subsidized counseling through the campus wellness centers. These services are typically available to enrolled students.
            </p>

            <h2>5. NGO-Run Mental Health Services</h2>
            <p>
              Several NGOs provide free or low-cost mental health support in Kampala, including StrongMinds, TPO Uganda, and the Peter C. Alderman Program for Survivors of Conflict. These organizations specialize in community-based mental health care.
            </p>

            <h2>6. Religious & Community Counseling</h2>
            <p>
              Many churches, mosques, and community organizations in Kampala offer pastoral counseling. While not a substitute for licensed therapy, these services can provide valuable initial support and referrals.
            </p>

            <h2>7. Employee Assistance Programs (EAP)</h2>
            <p>
              If you work for a medium or large company in Kampala, check if your employer offers an EAP. Many organizations now provide free therapy sessions to employees. <Link to="/for-business" className="text-primary hover:underline">Innerspark Africa partners with businesses</Link> to provide workplace mental health programs.
            </p>

            <h2>How to Choose the Right Therapist</h2>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Check credentials:</strong> Look for UCA-licensed counselors or registered clinical psychologists</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Match specialization:</strong> Choose a therapist who specializes in your specific concern (anxiety, trauma, relationships)</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Consider language:</strong> Ensure the therapist speaks a language you're comfortable with (English, Luganda, Kiswahili)</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div><strong>Try a free consultation:</strong> Most good therapists offer a brief introductory call</div>
              </div>
            </div>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Where can I find a therapist in Kampala?</h3>
                <p className="text-muted-foreground">Through online platforms like Innerspark Africa, Butabika Hospital, private clinics in Kololo/Nakasero, university counseling centers, and NGO mental health services.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">How do I choose the right therapist?</h3>
                <p className="text-muted-foreground">Check their license and credentials, ensure they specialize in your area of concern, and take advantage of free initial consultations to find the right fit.</p>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Your Therapist in Kampala Today</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              Browse 20+ licensed therapists. Book a session in under 2 minutes — online or in-person.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Browse Therapists</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I'm%20looking%20for%20a%20therapist%20in%20Kampala" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="Where to Find a Therapist in Kampala" url="https://www.innersparkafrica.com/blog/find-therapist-kampala" />
          <RelatedArticles currentSlug="find-therapist-kampala" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default FindTherapistKampalaPost;
