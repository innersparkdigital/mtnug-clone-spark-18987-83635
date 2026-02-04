import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, Clock, Shield, Smartphone, Globe, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ChatTherapy = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Chat Therapy - Text-Based Online Therapy",
    "description": "Get therapy through secure text messaging. Chat with a licensed therapist anytime. Private, convenient, and effective mental health support.",
    "url": "https://www.innersparkafrica.com/chat-therapy"
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Chat Therapy Services",
    "description": "Text-based therapy with licensed mental health professionals. Secure messaging for convenient, private mental health support.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Chat Therapy",
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
        "name": "What is chat therapy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chat therapy is text-based therapy where you communicate with a licensed therapist through secure messaging. You can type your thoughts and receive written responses from your therapist."
        }
      },
      {
        "@type": "Question",
        "name": "Is chat therapy effective?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, research shows chat therapy is effective for many mental health concerns. The writing process itself can be therapeutic and helps you organize your thoughts."
        }
      },
      {
        "@type": "Question",
        "name": "Who is chat therapy best for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chat therapy is ideal for those who prefer writing over talking, have busy schedules, want more privacy, or feel more comfortable expressing themselves through text."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Chat Therapy - Text-Based Online Therapy | Chat with a Therapist | Innerspark</title>
        <meta name="description" content="Get therapy through secure text messaging. Chat with a licensed therapist anytime. Private, convenient, and effective mental health support. Start chatting with a therapist today!" />
        <meta name="keywords" content="chat therapy, text therapy, chat with therapist, text-based therapy, messaging therapy, chat counseling, text counseling, online chat therapist, therapy through text, message a therapist" />
        <link rel="canonical" href="https://www.innersparkafrica.com/chat-therapy" />
        
        <meta property="og:title" content="Chat Therapy - Text with a Therapist | Innerspark" />
        <meta property="og:description" content="Get therapy through secure text messaging. Chat with a licensed therapist anytime. Private and convenient." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/chat-therapy" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chat Therapy - Text with a Therapist" />
        <meta name="twitter:description" content="Get therapy through secure text messaging. Chat with a licensed therapist anytime." />
        
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
              <MessageSquare className="w-4 h-4" />
              Text-Based Therapy
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Chat <span className="text-primary">Therapy</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get professional therapy through secure text messaging. Chat with a licensed therapist at your own pace — private, convenient, and always accessible.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <a href="https://wa.me/256792085773?text=Hi,%20I%20want%20to%20start%20chat%20therapy.%20How%20does%20it%20work?" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <MessageSquare className="w-5 h-5" />
                  Start Chat Therapy
                </Button>
              </a>
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
                End-to-End Encrypted
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Respond on Your Schedule
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Available Globally
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Chat Therapy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              Why Choose Chat Therapy?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Text-based therapy offers unique benefits for your mental health journey
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Your Own Pace",
                  desc: "Take time to think and compose your thoughts. No pressure to respond immediately"
                },
                {
                  icon: Smartphone,
                  title: "Always Accessible",
                  desc: "Send messages anytime from your phone. Your therapist responds during scheduled times"
                },
                {
                  icon: Shield,
                  title: "Maximum Privacy",
                  desc: "No video, no voice — just private text. Perfect for those who value discretion"
                },
                {
                  icon: Heart,
                  title: "Express Freely",
                  desc: "Some find it easier to express difficult emotions through writing than speaking"
                },
                {
                  icon: Zap,
                  title: "Therapeutic Writing",
                  desc: "The act of writing itself is therapeutic and helps organize your thoughts"
                },
                {
                  icon: Globe,
                  title: "No Appointments Needed",
                  desc: "No scheduling conflicts. Send messages when it's convenient for you"
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

      {/* Who Is It For */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Chat Therapy Is Perfect For You If...
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "You prefer writing over talking",
                "You have a busy schedule with limited time",
                "You want maximum privacy and discretion",
                "You feel more comfortable expressing yourself in text",
                "You want to process at your own pace",
                "You need therapy but can't do video/voice calls",
                "You want a record of your therapeutic conversations",
                "You're in a situation where you can't speak openly"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
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
              How Chat Therapy Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Get Matched", desc: "We match you with a licensed therapist suited to your needs" },
                { step: "2", title: "Start Chatting", desc: "Send messages to your therapist whenever you want" },
                { step: "3", title: "Get Responses", desc: "Your therapist responds with thoughtful, personalized guidance" }
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

      {/* Conditions We Treat */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              What Chat Therapy Can Help With
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Our therapists provide chat-based support for:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Depression", "Anxiety", "Stress", "Self-Esteem",
                "Relationships", "Grief", "Life Transitions", "Work Stress",
                "Loneliness", "Family Issues", "Personal Growth", "Burnout"
              ].map((condition, index) => (
                <div key={index} className="bg-background rounded-lg p-4 text-center border border-border hover:border-primary/50 transition-colors">
                  <span className="text-foreground font-medium">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Chat Therapy?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Begin your therapy journey through the comfort of text. Get matched with a therapist and start chatting today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/256792085773?text=Hi,%20I'm%20interested%20in%20chat%20therapy.%20Please%20help%20me%20get%20started." target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Chat Therapy
              </Button>
            </a>
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
              Chat Therapy FAQs
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is chat therapy?",
                  a: "Chat therapy is text-based therapy where you communicate with a licensed therapist through secure messaging. You can type your thoughts and receive written responses from your therapist."
                },
                {
                  q: "Is chat therapy effective?",
                  a: "Yes, research shows chat therapy is effective for many mental health concerns. The writing process itself can be therapeutic and helps you organize your thoughts."
                },
                {
                  q: "Who is chat therapy best for?",
                  a: "Chat therapy is ideal for those who prefer writing over talking, have busy schedules, want more privacy, or feel more comfortable expressing themselves through text."
                },
                {
                  q: "How quickly will my therapist respond?",
                  a: "Therapists typically respond within 24 hours during their scheduled working hours. You can send messages anytime, and they'll respond during their next available session."
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

export default ChatTherapy;
