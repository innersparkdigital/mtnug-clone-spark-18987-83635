import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Video, Check, Shield, Clock, Globe, Heart, MessageSquare, Star, Users, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";

const OnlineTherapy = () => {
  const { 
    startBooking, 
    closeFlow, 
    actionType,
    isAssessmentModalOpen,
    isBookingFormOpen,
  } = useBookingFlow();
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Online Therapy - Book a Licensed Therapist Today",
    "description": "Get professional online therapy from licensed therapists. Talk to a therapist today via video, voice, or chat. Available globally with affordable rates.",
    "url": "https://www.innersparkafrica.com/online-therapy",
    "mainEntity": {
      "@type": "MedicalTherapy",
      "name": "Online Therapy",
      "alternateName": ["Virtual Therapy", "Teletherapy", "Internet Therapy", "E-Therapy"],
      "description": "Professional mental health therapy delivered online through video calls, voice calls, or messaging with licensed therapists.",
      "medicineSystem": "WesternConventional",
      "relevantSpecialty": ["Psychiatry", "Psychology", "Counseling"]
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Online Therapy Services",
    "description": "Book a licensed therapist online today. Get professional mental health support for depression, anxiety, stress, and more. Available globally.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Mental Health Counseling",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I book an online therapy session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply browse our therapist directory, select a licensed therapist that matches your needs, and book a session. You can start therapy within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "Is online therapy as effective as in-person therapy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, research shows online therapy is equally effective as in-person therapy for most mental health conditions including depression and anxiety."
        }
      },
      {
        "@type": "Question",
        "name": "How much does online therapy cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Online therapy sessions start from $20 USD, making professional mental health care accessible and affordable globally."
        }
      },
      {
        "@type": "Question",
        "name": "Can I talk to a therapist today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Many of our therapists have same-day availability. Contact us now to be matched with a therapist who can see you today."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Online Therapy - Talk to a Therapist Today | Book Now | Innerspark</title>
        <meta name="description" content="Book online therapy with a licensed therapist today. Get professional mental health support for depression, anxiety, stress & more. Video, voice & chat sessions available globally. Start now!" />
        <meta name="keywords" content="online therapy, book therapist online, talk to a therapist now, virtual therapy, online counseling, mental health therapy online, affordable online therapy, video therapy, chat with therapist, depression therapy, anxiety therapy, book therapy appointment" />
        <link rel="canonical" href="https://www.innersparkafrica.com/online-therapy" />
        
        <meta property="og:title" content="Online Therapy - Talk to a Therapist Today | Innerspark" />
        <meta property="og:description" content="Book a licensed therapist online. Get professional mental health support today via video, voice, or chat. Start your healing journey now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/online-therapy" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Online Therapy - Talk to a Therapist Today" />
        <meta name="twitter:description" content="Book online therapy with a licensed therapist. Get help for depression, anxiety, stress & more. Start now!" />
        
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Pre-Assessment Modal */}
      <PreAssessmentModal 
        isOpen={isAssessmentModalOpen} 
        onClose={closeFlow}
        actionType={actionType}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={closeFlow}
        formType="book"
      />

      <Header />
      
      {/* Hero Section - Urgent Booking Focus */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Therapists Available Now
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Online Therapy That <span className="text-primary">Works</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Talk to a licensed therapist today. Get professional support for depression, anxiety, stress, and more — from anywhere in the world.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <Button size="lg" className="gap-2 text-lg px-8 py-6" onClick={startBooking}>
                <MessageSquare className="w-5 h-5" />
                Book a Session Now
              </Button>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Find a Therapist
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                100% Confidential
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Licensed Therapists
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Available Globally
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Sessions Within 24hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Online Therapy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">
              Why Choose Online Therapy?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Get the same quality care as in-person therapy, with added convenience and accessibility.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "Video, Voice & Chat",
                  desc: "Choose how you want to connect — video calls, phone sessions, or secure messaging"
                },
                {
                  icon: Clock,
                  title: "Get Help Today",
                  desc: "Same-day appointments available. Don't wait weeks to start feeling better"
                },
                {
                  icon: Globe,
                  title: "Accessible Anywhere",
                  desc: "Connect with your therapist from home, work, or anywhere in the world"
                },
                {
                  icon: Shield,
                  title: "Private & Secure",
                  desc: "All sessions are encrypted and 100% confidential. Your privacy matters"
                },
                {
                  icon: Heart,
                  title: "Affordable Care",
                  desc: "Quality therapy at accessible prices. Sessions from $20 USD"
                },
                {
                  icon: Star,
                  title: "Licensed Experts",
                  desc: "All therapists are verified, licensed professionals with years of experience"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Treat */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              What We Treat
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Our licensed therapists provide evidence-based treatment for:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Depression", "Anxiety", "Stress", "Trauma & PTSD",
                "Relationship Issues", "Grief & Loss", "Addiction", "Anger",
                "Self-Esteem", "Panic Attacks", "OCD", "Work Stress",
                "Family Conflict", "Life Transitions", "Burnout", "Phobias"
              ].map((condition, index) => (
                <div key={index} className="bg-background rounded-lg p-4 text-center border border-border hover:border-primary/50 transition-colors">
                  <span className="text-foreground font-medium">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              How to Get Started
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Book Online", desc: "Choose a therapist and schedule your first session in minutes" },
                { step: "2", title: "Connect Securely", desc: "Join your private video, voice, or chat session from anywhere" },
                { step: "3", title: "Start Healing", desc: "Work with your therapist to achieve your mental health goals" }
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

      {/* Urgent CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            You Don't Have to Struggle Alone
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get help today. Our therapists are ready to support you on your journey to better mental health.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={startBooking}>
              Get Support Today
            </Button>
            <Link to="/specialists">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Browse Therapists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I book an online therapy session?",
                  a: "Simply browse our therapist directory, select a licensed therapist that matches your needs, and book a session. You can start therapy within 24 hours."
                },
                {
                  q: "Is online therapy as effective as in-person therapy?",
                  a: "Yes, research shows online therapy is equally effective as in-person therapy for most mental health conditions including depression and anxiety."
                },
                {
                  q: "How much does online therapy cost?",
                  a: "Online therapy sessions start from $20 USD, making professional mental health care accessible and affordable globally."
                },
                {
                  q: "Can I talk to a therapist today?",
                  a: "Yes! Many of our therapists have same-day availability. Contact us now to be matched with a therapist who can see you today."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OnlineTherapy;
