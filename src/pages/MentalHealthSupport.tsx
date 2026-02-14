import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Check, Clock, MessageSquare, Shield, Users, Video, Phone, Globe, Sparkles, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const MentalHealthSupport = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Mental Health Support - Get Help Now",
    "description": "Get professional mental health support online. 24/7 access to licensed therapists, support groups, and crisis intervention. Available globally.",
    "url": "https://www.innersparkafrica.com/mental-health-support"
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "HealthCareService",
    "name": "Mental Health Support Services",
    "description": "Comprehensive mental health support including therapy, counseling, support groups, and crisis intervention.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Mental Health Support",
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
        "name": "What mental health support services do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer online therapy, support groups, crisis intervention, chat consultations, and self-help resources for all mental health concerns."
        }
      },
      {
        "@type": "Question",
        "name": "Is mental health support available 24/7?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide 24/7 crisis support and our therapists are available across different time zones for scheduled sessions."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get started with mental health support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply contact us via WhatsApp or browse our therapist directory. We'll help match you with the right support for your needs."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Mental Health Support - Get Help Now | Online Therapy & Support | Innerspark</title>
        <meta name="description" content="Get professional mental health support online. 24/7 access to licensed therapists, support groups, and crisis help. You don't have to struggle alone. Get help today!" />
        <meta name="keywords" content="mental health support, mental health help, online mental health support, get mental health help, mental health services, emotional support, therapy support, mental wellness, psychological support, mental health care, crisis support, mental health resources" />
        <link rel="canonical" href="https://www.innersparkafrica.com/mental-health-support" />
        
        <meta property="og:title" content="Mental Health Support - Get Help Now | Innerspark" />
        <meta property="og:description" content="Get professional mental health support online. 24/7 access to licensed therapists and crisis support. You're not alone." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/mental-health-support" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mental Health Support - Get Help Now" />
        <meta name="twitter:description" content="Professional mental health support online. 24/7 access to therapists and crisis help." />
        
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              Support When You Need It Most
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Mental Health <span className="text-primary">Support</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You don't have to struggle alone. Get professional mental health support from licensed therapists, support groups, and caring community — available globally.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <a href="https://wa.me/256792085773?text=Hi,%20I%20need%20mental%20health%20support.%20Can%20you%20help?" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <MessageSquare className="w-5 h-5" />
                  Get Support Now
                </Button>
              </a>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Talk to a Therapist
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
                <Clock className="w-4 h-4 text-primary" />
                24/7 Crisis Support
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Available Worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              How We Support Your Mental Health
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Comprehensive mental health support designed to meet you where you are
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "Online Therapy",
                  desc: "One-on-one sessions with licensed therapists via video, voice, or chat",
                  link: "/online-therapy",
                  cta: "Start Therapy"
                },
                {
                  icon: Users,
                  title: "Support Groups",
                  desc: "Join peer support groups led by professionals for shared healing",
                  link: "/support-groups",
                  cta: "Join a Group"
                },
                {
                  icon: Phone,
                  title: "Crisis Support",
                  desc: "24/7 emergency support for urgent mental health needs",
                  link: "/emergency-support",
                  cta: "Get Help Now"
                }
              ].map((service, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.desc}</p>
                  <Link to={service.link}>
                    <Button variant="outline" className="w-full">{service.cta}</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              We're Here to Help With
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Whatever you're going through, we have support for you:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Depression", "Anxiety", "Stress", "Trauma",
                "Grief", "Relationship Issues", "Self-Esteem", "Addiction",
                "Work Burnout", "Family Conflict", "Life Transitions", "Loneliness",
                "Anger", "Panic Attacks", "PTSD", "OCD"
              ].map((condition, index) => (
                <div key={index} className="bg-background rounded-lg p-4 text-center border border-border hover:border-primary/50 transition-colors">
                  <span className="text-foreground font-medium">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Why Choose Our Mental Health Support
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Check, text: "Licensed, verified mental health professionals" },
                { icon: Globe, text: "Available globally — no geographic restrictions" },
                { icon: Clock, text: "Flexible scheduling with same-day appointments" },
                { icon: Shield, text: "Private, secure, and 100% confidential" },
                { icon: Heart, text: "Affordable rates starting from $22 USD" },
                { icon: Sparkles, text: "Personalized care tailored to your needs" },
                { icon: Users, text: "Community support through peer groups" },
                { icon: Brain, text: "Evidence-based treatment approaches" }
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

      {/* Urgent CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            You Deserve Support
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Take the first step towards better mental health. Our team is ready to support you today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/256792085773?text=Hi,%20I%20need%20mental%20health%20support.%20Please%20connect%20me%20with%20a%20therapist." target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Support Today
              </Button>
            </a>
            <Link to="/specialists">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Find a Therapist
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
                  q: "What mental health support services do you offer?",
                  a: "We offer online therapy, support groups, crisis intervention, chat consultations, and self-help resources for all mental health concerns."
                },
                {
                  q: "Is mental health support available 24/7?",
                  a: "Yes, we provide 24/7 crisis support and our therapists are available across different time zones for scheduled sessions."
                },
                {
                  q: "How do I get started with mental health support?",
                  a: "Simply contact us via WhatsApp or browse our therapist directory. We'll help match you with the right support for your needs."
                },
                {
                  q: "Is my information kept confidential?",
                  a: "Absolutely. All conversations and personal information are 100% confidential and protected with enterprise-grade encryption."
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

export default MentalHealthSupport;
