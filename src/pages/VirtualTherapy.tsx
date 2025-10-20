import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Video, Check } from "lucide-react";

const VirtualTherapy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Virtual Therapy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect one-on-one with licensed therapists from anywhere, anytime. Get professional mental health support through secure video or chat sessions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Book a Session</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Why Choose Virtual Therapy?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Connect with licensed, vetted therapists",
                "Flexible scheduling that fits your life",
                "Secure, confidential video and chat sessions",
                "More affordable than traditional therapy",
                "No travel time - therapy from your safe space",
                "Access to diverse specialists across Africa"
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

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose Your Therapist", desc: "Browse profiles and select a therapist that matches your needs" },
                { step: "2", title: "Schedule Session", desc: "Pick a time that works for you - flexible scheduling available" },
                { step: "3", title: "Start Healing", desc: "Join your secure video or chat session and begin your journey" }
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Therapy Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards better mental health today
          </p>
          <Button size="lg" variant="secondary">
            Get Started Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VirtualTherapy;
