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
        <title>Online Therapy & Virtual Counselling | Talk to a Therapist Now – Uganda, Kenya, Tanzania | Innerspark Africa</title>
        <meta name="description" content="Affordable online therapy with licensed therapists. Get anxiety help, depression support, stress management & relationship counseling online. Same-day video, chat & phone therapy across Uganda, Kenya, Tanzania & Africa." />
        <meta name="keywords" content="online therapy, virtual counselling, talk to therapist online, talk to therapist now, therapy app, teletherapy, anxiety help online, depression support online, stress management therapy, relationship counseling online, mental health help now, emotional support online, therapist available now, instant therapy session, same day therapy, affordable therapy online, low cost counseling, cheap therapy online, chat therapy, video therapy session, phone therapy, messaging therapy, licensed therapist online, certified counselor online, best online therapy, therapist in Uganda online, counseling services Kenya online, therapy services Tanzania, African online therapy" />
        <link rel="canonical" href="https://www.innersparkafrica.com/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <TrustStatsBar />
        <ConcernsSection />
        {/* WHO-5 Wellbeing Check Banner */}
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
