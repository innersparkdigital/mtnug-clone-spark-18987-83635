import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesGrid from "@/components/ServicesGrid";
import PromoBanner from "@/components/PromoBanner";
import AppDownload from "@/components/AppDownload";
import AppTrailer from "@/components/AppTrailer";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <>
      {/* SEO meta tags for homepage */}
      <head>
        <link rel="canonical" href="https://innerspark.africa/" />
      </head>
      <div className="min-h-screen bg-background">
        <Header />
        {/* <HeroCarousel /> */}
        <AppTrailer />
        <ServicesGrid />
        <PromoBanner />
        <AppDownload />
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
