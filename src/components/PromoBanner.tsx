import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-secondary via-grey-dark to-secondary py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Together we are unstoppable!
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Join millions of satisfied customers and experience the best network coverage
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg rounded-full shadow-yellow"
            >
              Learn More
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-48 h-48 bg-primary rounded-full flex items-center justify-center text-4xl font-bold text-primary-foreground">
                100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
