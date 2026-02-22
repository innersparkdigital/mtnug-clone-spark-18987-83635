import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesGrid from "@/components/ServicesGrid";
import PromoBanner from "@/components/PromoBanner";
import AppDownload from "@/components/AppDownload";
import AppTrailer from "@/components/AppTrailer";
import HowItWorks from "@/components/HowItWorks";
import TherapistShowcase from "@/components/TherapistShowcase";
import Partners from "@/components/Partners";
import EventsSection from "@/components/EventsSection";
import AppFeaturesShowcase from "@/components/AppFeaturesShowcase";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

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
        {/* <HeroCarousel /> */}
        <AppFeaturesShowcase />
        <HowItWorks />
        <TherapistShowcase />
        {/* <ServicesGrid /> */}
        <Partners />
        {/* <AppTrailer /> */}
        {/* <PromoBanner /> */}
        <EventsSection />
        {/* <AppDownload /> */}
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
