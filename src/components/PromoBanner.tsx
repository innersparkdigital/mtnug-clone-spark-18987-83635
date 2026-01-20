import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { T } from "@/components/Translate";
import promoBannerBg from "@/assets/hero-slide-2.jpg";

const PromoBanner = () => {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
        <img
          src={promoBannerBg}
          alt="Mental Health Support"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <T>Mental Health Support for Every African</T>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              <T>Breaking stigma, building resilience. Join thousands taking charge of their mental wellness journey.</T>
            </p>
            <a href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20get%20started%20with%20Innerspark%20Africa's%20mental%20health%20services" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full"
              >
                <T>Get Started Today</T>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
