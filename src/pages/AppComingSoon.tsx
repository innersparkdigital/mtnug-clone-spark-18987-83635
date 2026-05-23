import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Smartphone, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Calendar,
  Users,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.innersparkafrica.app";
const APP_STORE_URL = "https://apps.apple.com/app/innerspark";

const AppComingSoon = () => {
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
        <title>Download InnerSpark App | Mental Health & Therapy App for Africa</title>
        <meta
          name="description"
          content="The InnerSpark mental health app is now live on Google Play and the Apple App Store. Book therapy, track mood, join support groups. Built for Uganda & Africa."
        />
        <meta name="keywords" content="innerspark app download, mental health app Uganda, therapy app Africa, mood tracker app, online counseling app, google play, app store" />
        <link rel="canonical" href="https://www.innersparkafrica.com/app-coming-soon" />
        <meta property="og:title" content="Download InnerSpark App — Now Live on Google Play & App Store" />
        <meta property="og:description" content="Mental health support in your pocket. Book therapy, track mood, join groups. Available on iOS & Android." />
        <meta property="og:url" content="https://www.innersparkafrica.com/app-coming-soon" />
        <meta property="og:type" content="website" />
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
                  <span className="font-medium">Now Available</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif">
                  The InnerSpark App Is Live
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Mental health support in your pocket. Book therapy, track your mood, join
                  support groups, and chat with a counsellor — all from your phone.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Get InnerSpark on Google Play"
                      className="h-14 hover:scale-105 transition-transform"
                    />
                  </a>
                  <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download InnerSpark on the App Store"
                      className="h-14 hover:scale-105 transition-transform"
                    />
                  </a>
                </div>

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
                    <span>Live Now</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Download CTA */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-xl border-primary/10">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Download Now</h2>
                    <p className="text-muted-foreground mb-6">
                      Get InnerSpark on your device and start your mental wellness journey today.
                    </p>
                    <div className="flex flex-col gap-3">
                      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2" size="lg">
                          Get on Google Play
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full gap-2" size="lg">
                          Download on the App Store
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Alternative CTA */}
                <Card className="mt-6 bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Prefer the Web?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You can book and attend therapy directly from your browser — no
                      download needed.
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
                  What You Can Do in the App
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

                {/* App Store Badges */}
                <div className="bg-muted/50 rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">Available now on</p>
                  <div className="flex justify-center gap-4">
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt="Get it on Google Play"
                        className="h-10 hover:scale-105 transition-transform"
                      />
                    </a>
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="Download on the App Store"
                        className="h-10 hover:scale-105 transition-transform"
                      />
                    </a>
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
