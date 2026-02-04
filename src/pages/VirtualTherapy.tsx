import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Video, Check, Shield, Clock, Globe, DollarSign, Heart, MessageSquare } from "lucide-react";
import { T } from "@/components/Translate";

const VirtualTherapy = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Virtual Therapy & Online Counseling - Book Today",
    "description": "Connect with licensed therapists for virtual therapy sessions. Get professional mental health support from home through secure video, voice, or chat sessions.",
    "url": "https://www.innersparkafrica.com/virtual-therapy",
    "mainEntity": {
      "@type": "MedicalTherapy",
      "name": "Virtual Therapy",
      "alternateName": ["Online Therapy", "Teletherapy", "Online Counseling", "E-Therapy", "Internet Therapy"],
      "description": "Professional mental health therapy delivered online through video calls, voice calls, or messaging with licensed therapists.",
      "medicineSystem": "WesternConventional",
      "relevantSpecialty": ["Psychiatry", "Psychology"]
    },
    "specialty": "Psychiatry",
    "about": {
      "@type": "MedicalCondition",
      "name": "Mental Health Conditions",
      "associatedAnatomy": {
        "@type": "AnatomicalStructure",
        "name": "Brain"
      }
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Virtual Therapy Services",
    "alternateName": ["Online Therapy", "Teletherapy", "Online Counseling"],
    "description": "Professional virtual therapy and online counseling services with licensed therapists. Connect via video, voice, or chat for depression, anxiety, stress, and more.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Mental Health Counseling",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceType": "Online",
      "availableLanguage": ["English", "Luganda", "Swahili"]
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "20",
      "priceValidUntil": "2026-12-31"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is virtual therapy and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Virtual therapy is professional mental health counseling delivered through video calls, phone calls, or messaging. You connect with a licensed therapist from anywhere using your phone or computer. Sessions are secure, confidential, and just as effective as in-person therapy."
        }
      },
      {
        "@type": "Question",
        "name": "Is virtual therapy effective for depression and anxiety?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, research shows virtual therapy is highly effective for treating depression, anxiety, and other mental health conditions. Studies indicate it can be as effective as face-to-face therapy, with the added benefits of convenience and accessibility."
        }
      },
      {
        "@type": "Question",
        "name": "How much does virtual therapy cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At Innerspark Africa, virtual therapy sessions start from $20 USD. We offer flexible payment options to make mental health care accessible and affordable globally."
        }
      },
      {
        "@type": "Question",
        "name": "Can I do therapy from my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can have therapy sessions using your smartphone, tablet, or computer. Our platform supports video calls, voice calls, and secure messaging, so you can choose what works best for you."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.innersparkafrica.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Virtual Therapy",
        "item": "https://www.innersparkafrica.com/virtual-therapy"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virtual Therapy - Talk to a Therapist Today | Book Online | Innerspark</title>
        <meta name="description" content="Get virtual therapy from licensed therapists. Book a session today. Video, voice & chat therapy for depression, anxiety, stress & more. Affordable rates from $20. Start now!" />
        <meta name="keywords" content="virtual therapy, online therapy, teletherapy, talk to therapist today, book therapist online, virtual counseling, e-therapy, internet therapy, online therapist, video therapy, phone therapy, chat therapy, depression therapy online, anxiety counseling online, mental health online, therapy from home, remote therapy, digital therapy" />
        <link rel="canonical" href="https://www.innersparkafrica.com/virtual-therapy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Virtual Therapy - Talk to a Therapist Today | Innerspark" />
        <meta property="og:description" content="Connect with licensed therapists for virtual therapy. Get professional mental health support from home. Video, voice, or chat sessions available. Book today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/virtual-therapy" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Therapy - Talk to a Therapist Today" />
        <meta name="twitter:description" content="Get affordable virtual therapy from licensed therapists. Video, voice & chat sessions for depression, anxiety, stress & more." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <T>Online Therapy & Virtual Counseling</T>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 hero-description">
              <T>Connect one-on-one with licensed therapists from anywhere in Africa. Get professional mental health support for depression, anxiety, stress, and more through secure video, voice, or chat sessions.</T>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20book%20an%20online%20therapy%20session" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <T>Book Online Session</T>
                </Button>
              </a>
              <a href="/specialists">
                <Button size="lg" variant="outline"><T>Find a Therapist</T></Button>
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                100% Confidential
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Licensed Therapists
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Available 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              <T>Why Choose Online Therapy?</T>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Online therapy offers the same quality care as in-person sessions with added convenience and accessibility.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Check, text: "Connect with licensed, vetted therapists" },
                { icon: Clock, text: "Flexible scheduling that fits your life" },
                { icon: Shield, text: "Secure, confidential video and chat sessions" },
                { icon: DollarSign, text: "More affordable than traditional therapy" },
                { icon: Heart, text: "Therapy from your safe space at home" },
                { icon: Globe, text: "Access to diverse specialists across Africa" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground text-lg">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              Conditions We Treat Online
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Our licensed therapists provide online treatment for a wide range of mental health conditions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Depression", "Anxiety", "Stress", "Trauma & PTSD",
                "Relationship Issues", "Grief & Loss", "Addiction", "Anger Management",
                "Self-Esteem", "Panic Attacks", "OCD", "Sleep Problems"
              ].map((condition, index) => (
                <div key={index} className="bg-background rounded-lg p-4 text-center border border-border hover:border-primary/50 transition-colors">
                  <span className="text-foreground font-medium">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              How Online Therapy Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose Your Therapist", desc: "Browse profiles and select a licensed therapist that matches your needs and preferences" },
                { step: "2", title: "Schedule Session", desc: "Pick a time that works for you - flexible scheduling with sessions available 7 days a week" },
                { step: "3", title: "Start Healing", desc: "Join your secure video, voice, or chat session from anywhere and begin your mental health journey" }
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Online Therapy Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards better mental health from the comfort of your home
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/256792085773?text=Hi,%20I'm%20ready%20to%20start%20online%20therapy" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </a>
            <a href="/specialists">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Browse Therapists
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default VirtualTherapy;