import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-primary via-purple-deep to-primary py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Mental Health Support for Every African
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Breaking stigma, building resilience. Join thousands taking charge of their mental wellness journey.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full"
            >
              Get Started Today
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-24 h-24 text-white" fill="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
