import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Check } from "lucide-react";

const MyGoals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              My Goals
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Set, track, and complete your personal wellness and mental-health goals. Turn aspirations into achievable milestones.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Create a Goal</Button>
              <Button size="lg" variant="outline">View My Goals</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Achieve Your Wellness Goals
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Set personalized mental health goals",
                "Break down big goals into manageable steps",
                "Track progress with visual milestones",
                "Get reminders and encouragement",
                "Celebrate achievements with rewards",
                "Share progress with your therapist"
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
              Your Path to Success
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Define Your Goal", desc: "Choose what you want to achieve for your mental health" },
                { step: "2", title: "Create Action Steps", desc: "Break your goal into smaller, achievable tasks" },
                { step: "3", title: "Track & Celebrate", desc: "Monitor progress and celebrate each milestone" }
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
            Start Setting Your Goals Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every journey begins with a single step
          </p>
          <Button size="lg" variant="secondary">
            Set Your First Goal
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyGoals;
