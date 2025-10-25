import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Settings, Check } from "lucide-react";

const ProfileSettings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Profile & Settings
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Manage your personal information and therapy preferences securely. Complete control over your privacy and experience.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Edit Profile</Button>
              <Button size="lg" variant="outline">Privacy Settings</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              What You Can Manage
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Personal information and contact details",
                "Payment methods and billing preferences",
                "Notification and reminder settings",
                "Privacy and data sharing controls",
                "Therapy preferences and goals",
                "Emergency contacts and safety settings"
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
              Your Privacy Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Secure by Default", desc: "All data is encrypted and HIPAA compliant" },
                { step: "2", title: "Your Control", desc: "Choose what you share and with whom" },
                { step: "3", title: "Easy Updates", desc: "Change your settings anytime, instantly" }
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
            Customize Your Experience
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Your account, your way
          </p>
          <Button size="lg" variant="secondary">
            Go to Settings
          </Button>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default ProfileSettings;
