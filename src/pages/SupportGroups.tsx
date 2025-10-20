import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Check } from "lucide-react";

const SupportGroups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Support Groups
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Safe peer spaces to share and heal together under professional moderation. Connect with others who understand your journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Join a Group</Button>
              <Button size="lg" variant="outline">Browse Groups</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Benefits of Support Groups
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Professionally moderated safe spaces",
                "Connect with people facing similar challenges",
                "Share experiences and coping strategies",
                "Weekly scheduled group sessions",
                "Anonymous participation options available",
                "Groups for anxiety, depression, grief, and more"
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
              How to Join
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Find Your Group", desc: "Explore groups based on your specific needs and challenges" },
                { step: "2", title: "Register", desc: "Sign up for the group that resonates with you" },
                { step: "3", title: "Participate", desc: "Join sessions and connect with your community" }
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
            You Don't Have to Face It Alone
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join a supportive community today
          </p>
          <Button size="lg" variant="secondary">
            Explore Support Groups
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupportGroups;
