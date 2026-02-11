import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Smartphone, 
  Bell, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Calendar,
  Users,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AppComingSoon = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Subscribe to newsletter for app launch notification
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: formData.email.toLowerCase().trim()
        });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already on the list! We'll notify you when the app launches.");
        } else {
          throw error;
        }
      } else {
        toast.success("You're on the list! We'll notify you when the app launches.");
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Book Therapy Sessions",
      description: "Schedule sessions with licensed therapists in just a few taps"
    },
    {
      icon: MessageCircle,
      title: "Chat Consultations",
      description: "Message your therapist anytime, get support when you need it"
    },
    {
      icon: Users,
      title: "Support Groups",
      description: "Join communities of people who understand what you're going through"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your emotional journey and see your progress over time"
    }
  ];

  return (
    <>
      <Helmet>
        <title>App Coming Soon - Innerspark Africa</title>
        <meta 
          name="description" 
          content="The Innerspark mobile app is launching soon. Join the waitlist to be notified when it's available on iOS and Android." 
        />
        <link rel="canonical" href="https://www.innersparkafrica.com/app-coming-soon" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">Mobile App</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif">
                  Our Apologies — The Innerspark App Is Not Yet Live
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  We're putting the finishing touches on something special. The Innerspark mobile app 
                  will bring mental health support right to your pocket — and it's launching very soon.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Free to Download</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Coming Soon</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Waitlist Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-xl border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
                        <CardDescription>Be the first to know when we launch</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          You're on the list!
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          We'll send you an email as soon as the app is ready.
                        </p>
                        <Link to="/specialists">
                          <Button className="gap-2">
                            Book a Therapist Now
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name (optional)</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number (optional)</Label>
                          <Input
                            id="phone"
                            placeholder="+256 700 000 000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full gap-2" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Joining..."
                          ) : (
                            <>
                              <Bell className="w-4 h-4" />
                              Notify Me When It's Live
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          We'll only use your email to notify you about the app launch. 
                          No spam, ever.
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>

                {/* Alternative CTA */}
                <Card className="mt-6 bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Need Support Right Now?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have to wait for the app. Book a therapy session 
                      through our website today.
                    </p>
                    <Link to="/specialists">
                      <Button variant="outline" className="w-full gap-2">
                        Book a Therapist via Website
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  What's Coming in the App
                </h2>

                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* App Store Badges Preview */}
                <div className="bg-muted/50 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming soon to
                  </p>
                  <div className="flex justify-center gap-4 opacity-50">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="App Store" 
                      className="h-10 grayscale"
                    />
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Google Play" 
                      className="h-10 grayscale"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AppComingSoon;
