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
        <title>InnerSpark Africa — Online Therapy & Mental Wellness | Africa's #1 Digital Mental Health Platform</title>
        <meta name="description" content="Connect with licensed African therapists via video, chat or voice. Starting from UGX 30,000. Available 24/7 in Uganda, Kenya, Tanzania and beyond." />
        <meta name="keywords" content="online therapy, virtual counselling, talk to therapist online, talk to therapist now, therapy app, teletherapy, anxiety help online, depression support online, stress management therapy, relationship counseling online, mental health help now, emotional support online, therapist available now, instant therapy session, same day therapy, affordable therapy online, low cost counseling, cheap therapy online, chat therapy, video therapy session, phone therapy, messaging therapy, licensed therapist online, certified counselor online, best online therapy, therapist in Uganda online, counseling services Kenya online, therapy services Tanzania, African online therapy" />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <GeoKenyaBanner />
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
