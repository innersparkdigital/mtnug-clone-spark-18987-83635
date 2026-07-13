import { Helmet } from "react-helmet";
import ExpandedSeoSchema from "@/components/seo/ExpandedSeoSchema";
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
import GeoKenyaBanner from "@/components/GeoKenyaBanner";

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
  return (
    <>
      <Helmet>
        <title>Online Therapy in Uganda | Licensed Therapists | InnerSpark Africa</title>
        <meta name="description" content="Private, confidential online therapy in Uganda with licensed African therapists. Video, voice or chat sessions from UGX 75,000. Pay via MTN Mobile Money or Airtel. Book in 2 minutes." />
        <meta name="keywords" content="online therapy Uganda, therapist Uganda, therapist Kampala, counsellor Kampala, online counselling Uganda, teletherapy Uganda, private therapy Kampala, confidential therapy Kampala, mental health Uganda, therapy for professionals Uganda, burnout therapy Uganda, anonymous therapy Uganda, corporate mental health Uganda, WHO-5 Uganda, therapist for depression Uganda, therapist for anxiety Uganda, therapist for trauma Uganda, therapist for couples Uganda, therapist for suicidal thoughts Uganda, chat therapy Uganda 30000, affordable chat therapy Uganda, therapy via WhatsApp chat Uganda, evening therapy sessions Uganda, Sunday therapy sessions Uganda, weekend therapist Uganda, same day therapist Uganda, urgent therapy Uganda, emergency counselling Uganda, teen therapist Uganda, therapy for teenagers Kampala, youth mental health Uganda, therapy for students Uganda, online therapy South Sudan, therapist South Sudan, mental health support South Sudan, online counselling East Africa" />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
      </Helmet>
      <ExpandedSeoSchema region="uganda" />
      <div className="min-h-screen bg-background">
        <GeoKenyaBanner />
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
