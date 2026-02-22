import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustStatsBar from "@/components/TrustStatsBar";
import AppFeaturesShowcase from "@/components/AppFeaturesShowcase";
import HowItWorks from "@/components/HowItWorks";
import TherapistShowcase from "@/components/TherapistShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import Partners from "@/components/Partners";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Therapy in Uganda – Book a Licensed Therapist Online | Innerspark Africa</title>
        <meta name="description" content="Uganda's leading online therapy platform. Book affordable sessions with licensed therapists for depression, anxiety, trauma & stress. Video, voice & chat therapy. Start today." />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <TrustStatsBar />
        <TherapistShowcase />
        <TestimonialsSection />
        {/* <AppFeaturesShowcase /> */}
        <HowItWorks />
        <Partners />
        <EventsSection />
        <Footer />
        <CookieConsent />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Index;
