import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import ConcernsSection from "@/components/ConcernsSection";
import CounselingComparison from "@/components/CounselingComparison";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Online Therapy Uganda – Book a Licensed Therapist | Depression, Anxiety, Stress Help | Innerspark Africa</title>
        <meta name="description" content="Uganda's #1 online therapy platform. Book affordable sessions with licensed therapists for depression, anxiety, trauma, stress, relationship problems, loneliness & overthinking. Video, voice & chat therapy. Start healing today." />
        <meta name="keywords" content="online therapy Uganda, therapist Uganda, depression help Uganda, anxiety therapy Africa, marriage counseling online, relationship therapy, trauma therapy Uganda, stress management, book therapist online, affordable therapy Uganda, mental health support Africa, loneliness help, overthinking therapy, sadness counseling, licensed therapist Kampala" />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <TrustStatsBar />
        <ConcernsSection />
        <TherapistShowcase />
        <TestimonialsSection />
        {/* <AppFeaturesShowcase /> */}
        <HowItWorks />
        <CounselingComparison />
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
