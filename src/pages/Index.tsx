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
        <title>Online Therapy - Book a Therapist Online Today | Innerspark Africa</title>
        <meta name="description" content="Book online therapy with licensed therapists. Get professional mental health support for depression, anxiety, stress & more. Talk to a therapist today. Video, voice & chat therapy available globally." />
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
