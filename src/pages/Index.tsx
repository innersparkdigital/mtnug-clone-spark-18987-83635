import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustStatsBar from "@/components/TrustStatsBar";
import HowItWorks from "@/components/HowItWorks";
import TherapistShowcase from "@/components/TherapistShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import Partners from "@/components/Partners";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ConcernsSection from "@/components/ConcernsSection";
import WhyInnerSpark from "@/components/home/WhyInnerSpark";
import HowItWorksSimple from "@/components/home/HowItWorksSimple";
import BuiltForAfrica from "@/components/home/BuiltForAfrica";
import ImpactCounter from "@/components/home/ImpactCounter";
import SDGAlignment from "@/components/home/SDGAlignment";
import WhisperTeaser from "@/components/home/WhisperTeaser";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import GeoCountryBanner from "@/components/GeoCountryBanner";

const Index = () => {
  const v = {
    hero: useSectionVisibility("hero_section"),
    how1: useSectionVisibility("how_it_works_simple"),
    concerns: useSectionVisibility("concerns_section"),
    why: useSectionVisibility("why_innerspark"),
    africa: useSectionVisibility("built_for_africa"),
    who5: useSectionVisibility("who5_banner"),
    therapists: useSectionVisibility("therapist_showcase"),
    testimonials: useSectionVisibility("testimonials"),
    how2: useSectionVisibility("how_it_works_detailed"),
    whisper: useSectionVisibility("whisper_teaser"),
    sdg: useSectionVisibility("sdg_alignment"),
    partners: useSectionVisibility("partners"),
    events: useSectionVisibility("events_section"),
  };
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": "https://www.innersparkafrica.com/#organization",
        name: "InnerSpark Africa",
        url: "https://www.innersparkafrica.com/",
        logo: "https://www.innersparkafrica.com/innerspark-logo.webp",
        description: "Online therapy with licensed African therapists by video, voice or chat.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kampala",
          addressCountry: "UG",
        },
        areaServed: [
          { "@type": "Country", name: "Uganda" },
          { "@type": "Country", name: "Kenya" },
          { "@type": "Country", name: "Tanzania" },
        ],
        currenciesAccepted: "UGX, KES, TZS, USD",
        paymentAccepted: "Mobile Money, Card",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+256792085773",
          contactType: "customer support",
          areaServed: ["UG", "KE", "TZ"],
          availableLanguage: ["English", "Luganda", "Swahili"],
        },
        sameAs: [
          "https://www.facebook.com/innersparkafrica",
          "https://www.instagram.com/innersparkafrica",
          "https://www.linkedin.com/company/innerspark-africa",
          "https://x.com/innersparkafrica",
          "https://www.youtube.com/@innersparkafrica",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.innersparkafrica.com/#website",
        url: "https://www.innersparkafrica.com/",
        name: "InnerSpark Africa",
        publisher: { "@id": "https://www.innersparkafrica.com/#organization" },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.innersparkafrica.com/#webpage",
        url: "https://www.innersparkafrica.com/",
        name: "Book Licensed Online Therapy Uganda | Video UGX 75,000 | InnerSpark",
        isPartOf: { "@id": "https://www.innersparkafrica.com/#website" },
        about: { "@id": "https://www.innersparkafrica.com/#organization" },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Book Licensed Online Therapy Uganda | Video UGX 75,000 | InnerSpark</title>
        <meta name="description" content="For professionals ready to invest in confidential care. Book a licensed African therapist — video UGX 75,000 or chat UGX 30,000. Mobile Money or card. Uganda, Kenya, Tanzania and beyond." />
        <meta property="og:title" content="Book Licensed Online Therapy Uganda | Video UGX 75,000 | InnerSpark" />
        <meta property="og:description" content="Licensed African therapists for people ready to pay for real care. Video UGX 75,000 · Chat UGX 30,000. Book in about two minutes." />
        <meta name="keywords" content="book therapist Uganda, online therapy Uganda, licensed therapist Kampala, therapy cost Uganda, video therapy UGX 75000, chat therapy UGX 30000, online counselling Uganda, therapy for professionals Uganda, burnout therapy Uganda, couples counselling Uganda, teenage counselling Uganda, book online therapy Kenya, online therapist Nairobi, therapy M-Pesa Kenya, online therapy Tanzania, confidential therapy Africa" />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
        <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <GeoCountryBanner />
        <Header />
        {v.hero && <HeroSection />}
        <TrustStatsBar />
        {v.how1 && <HowItWorksSimple />}
        {v.concerns && <ConcernsSection />}
        {v.why && <WhyInnerSpark />}
        {v.africa && <BuiltForAfrica />}
        {v.who5 && (
        <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <Heart className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground mb-1">How's Your Wellbeing? Take the WHO-5 Check</h2>
                <p className="text-sm text-muted-foreground">A quick 5-question wellbeing check based on the WHO Well-Being Index. Takes under 1 minute.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Source:{" "}
                  <a href="https://www.psykiatri-regionh.dk/who-5/Pages/default.aspx" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-foreground">
                    WHO-5 Well-Being Index, WHO Regional Office for Europe
                  </a>
                </p>
              </div>
              <Link to="/wellbeing-check">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                  Check Now — Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
        )}
        <ImpactCounter />
        {v.therapists && <TherapistShowcase />}
        {v.testimonials && <TestimonialsSection />}
        {v.how2 && <HowItWorks />}
        {v.whisper && <WhisperTeaser />}
        {v.sdg && <SDGAlignment />}
        {v.partners && <Partners />}
        {v.events && <EventsSection />}
        <Footer />
        <CookieConsent />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Index;
