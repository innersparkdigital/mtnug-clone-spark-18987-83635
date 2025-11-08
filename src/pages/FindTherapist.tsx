import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { UserCheck, Check } from "lucide-react";

const FindTherapist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Find a Therapist
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Browse qualified mental health professionals by specialty and availability. Find the perfect match for your therapeutic journey.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20find%20a%20therapist" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Search Therapists</Button>
              </a>
              <Button size="lg" variant="outline">Filter by Specialty</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Find Your Perfect Match
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "All therapists are licensed and verified",
                "Search by specialty, language, and location",
                "View therapist profiles, credentials, and reviews",
                "See availability and book instantly",
                "Compare session rates transparently",
                "Video, phone, and chat options available"
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
              How to Find Your Therapist
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Search & Filter", desc: "Use our tools to find therapists matching your needs" },
                { step: "2", title: "Review Profiles", desc: "Read bios, specialties, and client reviews" },
                { step: "3", title: "Book & Connect", desc: "Schedule your first session with your chosen therapist" }
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
            Your Therapist is Waiting
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our network of qualified professionals
          </p>
          <a href="https://wa.me/256780570987?text=Hi,%20I'm%20looking%20for%20a%20therapist.%20Can%20you%20help%20me%20find%20the%20right%20match?" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary">
              Start Searching
            </Button>
          </a>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default FindTherapist;
