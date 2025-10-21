import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesGrid from "@/components/ServicesGrid";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroCarousel />
      <ServicesGrid />
      <PromoBanner />
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
