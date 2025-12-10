import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Headphones, Check } from "lucide-react";

const Meditations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Meditations & Calm Audio
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Listen to guided meditations and soothing sounds for relaxation. Find your calm in minutes with our expertly crafted audio library.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Start Listening</Button>
              <Button size="lg" variant="outline">Browse Library</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Your Audio Wellness Library
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Guided meditations for stress and anxiety",
                "Sleep stories and relaxation audio",
                "Nature sounds and ambient music",
                "Breathing exercises and techniques",
                "Sessions from 3 to 30 minutes",
                "Offline listening available"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Start Your Practice
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose Audio", desc: "Browse by mood, time, or need" },
                { step: "2", title: "Find Your Space", desc: "Get comfortable wherever you are" },
                { step: "3", title: "Listen & Relax", desc: "Let the audio guide you to calm" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Calm Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Thousands of meditations at your fingertips
          </p>
          <Button size="lg" variant="secondary">
            Explore Meditations
          </Button>
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default Meditations;
