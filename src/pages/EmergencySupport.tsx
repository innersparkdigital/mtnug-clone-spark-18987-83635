import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Phone } from "lucide-react";

const EmergencySupport = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-destructive/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-destructive-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Emergency Support
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              One-tap access to counselors, crisis lines, and emergency contacts. Immediate help when you need it most.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://wa.me/256780570987?text=URGENT:%20I%20need%20immediate%20mental%20health%20support" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="destructive" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Get Immediate Help on WhatsApp
                </Button>
              </a>
              <Button size="lg" variant="outline">Emergency Resources</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-destructive/10 border-l-4 border-destructive p-6 mb-12 rounded">
              <h3 className="font-bold text-lg mb-2 text-foreground">If you're in immediate danger:</h3>
              <p className="text-foreground">Call emergency services (911 or your local emergency number) immediately.</p>
            </div>
            
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              24/7 Crisis Support Available
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Instant access to trained crisis counselors",
                "Anonymous and confidential support",
                "No appointment needed - help is immediate",
                "Multilingual support available",
                "Connect to local emergency services",
                "Follow-up resources and referrals"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-destructive-foreground" />
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
              How to Access Emergency Support
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Open the App", desc: "Launch Innerspark from anywhere on your phone" },
                { step: "2", title: "Tap Emergency", desc: "The panic button is prominently displayed" },
                { step: "3", title: "Get Help Immediately", desc: "Connect with crisis counselor or emergency services" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-destructive-foreground">
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

      <section className="py-16 bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Help is Always Available
          </h2>
          <p className="text-xl mb-8 opacity-90">
            You're not alone - reach out anytime
          </p>
          <Button size="lg" variant="secondary">
            View All Crisis Resources
          </Button>
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default EmergencySupport;
