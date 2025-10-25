import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Calendar, Check } from "lucide-react";

const EventsTraining = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Mental Health Events & Training
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join workshops and community programs to build resilience. Learn valuable mental health skills and connect with others.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Browse Events</Button>
              <Button size="lg" variant="outline">View Calendar</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Expert-led mental health workshops",
                "Stress management and coping skills training",
                "Community wellness events and activities",
                "Professional development sessions",
                "Family and relationship workshops",
                "Free and paid training options available"
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
              Join an Event
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Explore Events", desc: "Browse upcoming workshops and training sessions" },
                { step: "2", title: "Register", desc: "Sign up for events that interest you" },
                { step: "3", title: "Participate", desc: "Attend online or in-person and grow" }
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
            Invest in Your Mental Wellness
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our next workshop or community event
          </p>
          <Button size="lg" variant="secondary">
            See Upcoming Events
          </Button>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default EventsTraining;
