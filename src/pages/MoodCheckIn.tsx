import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Heart, Check } from "lucide-react";

const MoodCheckIn = () => {
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
              Mood Check-In & Journaling
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Reflect on how you feel each day and build emotional awareness. Track patterns and understand your mental wellness journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Check In Now</Button>
              <Button size="lg" variant="outline">View My History</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Track Your Emotional Journey
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Daily mood tracking with simple interface",
                "Private journal for deeper reflection",
                "Visual mood trends and patterns",
                "Identify triggers and positive moments",
                "Share insights with your therapist",
                "Build self-awareness and emotional intelligence"
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
              Make It a Daily Habit
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Daily Check-In", desc: "Log your mood with a simple tap - takes just seconds" },
                { step: "2", title: "Add Context", desc: "Optionally journal about what's affecting your mood" },
                { step: "3", title: "Track Progress", desc: "Review patterns and celebrate improvements" }
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
            Start Tracking Your Wellness Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Understanding your emotions is the first step to healing
          </p>
          <Button size="lg" variant="secondary">
            Begin Mood Tracking
          </Button>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default MoodCheckIn;
