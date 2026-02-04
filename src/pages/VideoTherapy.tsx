import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Video, Check, Clock, MessageSquare, Shield, Monitor, Wifi, Camera, Globe, Star } from "lucide-react";
import { Link } from "react-router-dom";

const VideoTherapy = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Video Therapy Sessions - Face-to-Face Online Therapy",
    "description": "Get face-to-face video therapy with licensed therapists online. Secure, private video sessions for depression, anxiety, and more. Book your video therapy session today.",
    "url": "https://www.innersparkafrica.com/video-therapy"
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Video Therapy Sessions",
    "description": "Professional video therapy sessions with licensed therapists. Face-to-face online therapy from anywhere in the world.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Video Therapy",
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
        "name": "How does video therapy work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Video therapy is face-to-face therapy conducted through secure video calls. You'll see and talk to your therapist in real-time from anywhere using your phone, tablet, or computer."
        }
      },
      {
        "@type": "Question",
        "name": "Is video therapy as effective as in-person therapy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, research consistently shows that video therapy is equally effective as in-person therapy for most mental health conditions including depression, anxiety, and PTSD."
        }
      },
      {
        "@type": "Question",
        "name": "What do I need for a video therapy session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You need a device with a camera (smartphone, tablet, or computer), a stable internet connection, and a private, quiet space for your session."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Video Therapy Sessions - Face-to-Face Online Therapy | Innerspark</title>
        <meta name="description" content="Get face-to-face video therapy with licensed therapists. Secure, private video sessions for depression, anxiety, stress & more. Book your video therapy session today!" />
        <meta name="keywords" content="video therapy, video therapy sessions, online video counseling, face to face therapy online, video call therapist, virtual face to face therapy, video counseling, teletherapy video, online video therapy, video psychotherapy" />
        <link rel="canonical" href="https://www.innersparkafrica.com/video-therapy" />
        
        <meta property="og:title" content="Video Therapy Sessions - Face-to-Face Online | Innerspark" />
        <meta property="og:description" content="Face-to-face video therapy with licensed therapists. Secure, private sessions from anywhere. Book today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/video-therapy" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Video Therapy Sessions | Innerspark" />
        <meta name="twitter:description" content="Face-to-face video therapy with licensed therapists. Secure, private sessions." />
        
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
              <Video className="w-4 h-4" />
              Face-to-Face Online Therapy
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Video Therapy <span className="text-primary">Sessions</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the personal connection of face-to-face therapy from anywhere. Connect with licensed therapists through secure, private video sessions.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <a href="https://wa.me/256792085773?text=Hi,%20I%20want%20to%20book%20a%20video%20therapy%20session" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Video className="w-5 h-5" />
                  Book Video Session
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
                Encrypted & Secure
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                HD Video Quality
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Available Worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Video Therapy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              Why Choose Video Therapy?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Get the benefits of in-person therapy with the convenience of online access
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Face-to-Face Connection",
                  desc: "See your therapist's expressions and body language for deeper connection and understanding"
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  desc: "End-to-end encrypted video calls ensure your sessions remain completely confidential"
                },
                {
                  icon: Globe,
                  title: "From Anywhere",
                  desc: "Connect from home, office, or anywhere with internet — no commute needed"
                },
                {
                  icon: Monitor,
                  title: "Any Device",
                  desc: "Use your smartphone, tablet, laptop, or desktop — whatever's convenient"
                },
                {
                  icon: Clock,
                  title: "Flexible Scheduling",
                  desc: "Book sessions that fit your schedule with evening and weekend availability"
                },
                {
                  icon: Star,
                  title: "Same Effectiveness",
                  desc: "Research shows video therapy is as effective as in-person for most conditions"
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

      {/* What You Need */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              What You Need for Video Therapy
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Device with Camera",
                  desc: "Smartphone, tablet, or computer with a working camera and microphone"
                },
                {
                  icon: Wifi,
                  title: "Internet Connection",
                  desc: "Stable internet connection for smooth, uninterrupted video sessions"
                },
                {
                  icon: Shield,
                  title: "Private Space",
                  desc: "A quiet, private space where you can speak freely and comfortably"
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-background rounded-xl border border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
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
              Conditions We Treat via Video Therapy
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Our licensed therapists provide video therapy for:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Depression", "Anxiety", "PTSD", "Stress",
                "Trauma", "Grief", "Relationships", "Addiction",
                "Self-Esteem", "Anger", "OCD", "Panic Attacks"
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
              How Video Therapy Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Book Session", desc: "Choose a therapist and schedule your video session" },
                { step: "2", title: "Get Link", desc: "Receive your secure video session link" },
                { step: "3", title: "Join Call", desc: "Click the link at your session time to join" },
                { step: "4", title: "Start Therapy", desc: "Have your face-to-face session with your therapist" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
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
            Ready to Start Video Therapy?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Book your first video session today and experience the personal connection of face-to-face therapy from anywhere.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/256792085773?text=Hi,%20I'm%20ready%20to%20start%20video%20therapy.%20Please%20help%20me%20book%20a%20session." target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Book Video Session Now
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
              Video Therapy FAQs
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How does video therapy work?",
                  a: "Video therapy is face-to-face therapy conducted through secure video calls. You'll see and talk to your therapist in real-time from anywhere using your phone, tablet, or computer."
                },
                {
                  q: "Is video therapy as effective as in-person therapy?",
                  a: "Yes, research consistently shows that video therapy is equally effective as in-person therapy for most mental health conditions including depression, anxiety, and PTSD."
                },
                {
                  q: "What do I need for a video therapy session?",
                  a: "You need a device with a camera (smartphone, tablet, or computer), a stable internet connection, and a private, quiet space for your session."
                },
                {
                  q: "Are video sessions secure and private?",
                  a: "Yes, all video sessions use end-to-end encryption to ensure your conversations remain completely private and confidential."
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

export default VideoTherapy;
