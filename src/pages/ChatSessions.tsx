import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check } from "lucide-react";

const ChatSessions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Chat Sessions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Private, text-based emotional support for quick check-ins and follow-ups. Get help when you need it, on your schedule.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Start Chatting</Button>
              <Button size="lg" variant="outline">How It Works</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Why Choose Chat Therapy?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Respond at your own pace and convenience",
                "Perfect for quick check-ins between sessions",
                "Fully encrypted and confidential",
                "More affordable than video sessions",
                "Ideal for those who prefer writing",
                "Available 24/7 - message anytime"
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
              Getting Started
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose a Therapist", desc: "Select from our network of qualified professionals" },
                { step: "2", title: "Send a Message", desc: "Start the conversation whenever you're ready" },
                { step: "3", title: "Get Support", desc: "Receive thoughtful responses within 24 hours" }
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
            Start Your Chat Therapy Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Flexible, affordable support on your terms
          </p>
          <Button size="lg" variant="secondary">
            Begin Chat Session
          </Button>
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default ChatSessions;
