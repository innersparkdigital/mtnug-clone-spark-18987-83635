import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, Heart } from "lucide-react";

const DonateTherapy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Donate Therapy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help someone in need access mental health care through our community therapy fund. Your donation makes healing possible for those who can't afford it.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Donate Now</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Your Impact
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Fund therapy sessions for those in financial need",
                "100% of donations go directly to therapy access",
                "One-time or recurring donation options",
                "Tax-deductible contributions",
                "Transparent reporting on fund usage",
                "Help break down barriers to mental healthcare"
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
              Donation Tiers
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { amount: "$25", title: "Support Session", desc: "Helps cover one chat therapy session" },
                { amount: "$75", title: "Full Session", desc: "Funds one complete video therapy session" },
                { amount: "$300", title: "Monthly Care", desc: "Provides a full month of therapy support" }
              ].map((item) => (
                <div key={item.amount} className="text-center p-6 bg-background rounded-lg border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {item.amount}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.desc}</p>
                  <Button variant="outline" className="w-full">Select</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Be Part of the Solution
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every contribution brings healing to someone in need
          </p>
          <Button size="lg" variant="secondary">
            Make a Donation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonateTherapy;
