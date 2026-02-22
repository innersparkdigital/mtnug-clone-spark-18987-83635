import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Phone, Video, MessageCircle, Star, Users, Shield } from "lucide-react";
import { T } from "@/components/Translate";
import ugandaBadge from "@/assets/uganda-badge.png";

const TherapyInUganda = () => {
  return (
    <>
      <Helmet>
        <title>Therapy in Uganda – Licensed Therapists & Counsellors | Innerspark Africa</title>
        <meta name="description" content="Find licensed therapists in Uganda. Affordable online therapy for depression, anxiety, trauma & stress. Video, voice & chat sessions with verified Ugandan counsellors. Book today." />
        <meta name="keywords" content="therapy in Uganda, therapist Uganda, counsellor Uganda, mental health Uganda, online therapy Uganda, psychologist Uganda, counselling Kampala, affordable therapy Uganda" />
        <link rel="canonical" href="https://www.innersparkafrica.com/therapy-in-uganda" />
        <meta property="og:title" content="Therapy in Uganda – Licensed Therapists | Innerspark Africa" />
        <meta property="og:description" content="Find licensed therapists in Uganda. Affordable online therapy for depression, anxiety, trauma & stress. Book today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/therapy-in-uganda" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Innerspark Africa – Therapy in Uganda",
            "description": "Licensed therapists providing affordable online therapy in Uganda.",
            "url": "https://www.innersparkafrica.com/therapy-in-uganda",
            "areaServed": { "@type": "Country", "name": "Uganda" },
            "serviceType": "Online Therapy",
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceType": "Online",
              "availableLanguage": ["English", "Luganda", "Runyankole", "Swahili"]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={ugandaBadge} alt="Uganda" className="w-8 h-8" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uganda's #1 Online Therapy Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <T>Therapy in Uganda</T>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                <T>Talk to a licensed Ugandan therapist from the comfort of your home. Affordable, private, and professional mental health support — starting from UGX 50,000 per session.</T>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/specialists">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
                    <T>Find a Therapist in Uganda</T>
                  </Button>
                </Link>
                <a href="https://wa.me/256792085773?text=Hi,%20I%20need%20therapy%20in%20Uganda" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    <T>WhatsApp Us</T>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Therapy in Uganda */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>Why Choose Online Therapy in Uganda?</T>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Shield, title: "Licensed & Verified", desc: "All our therapists are verified professionals registered with the Uganda Counselling Association." },
                { icon: MapPin, title: "No Travel Needed", desc: "Get therapy from anywhere in Uganda — Kampala, Jinja, Mbarara, Gulu, or any location with internet." },
                { icon: Star, title: "Affordable Rates", desc: "Sessions start from UGX 50,000 — making professional mental health care accessible to more Ugandans." },
              ].map((item, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-sm border border-border text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2"><T>{item.title}</T></h3>
                  <p className="text-muted-foreground text-sm"><T>{item.desc}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Session Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>How You Can Connect with a Therapist</T>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Video, title: "Video Sessions", desc: "Face-to-face therapy via secure video calls. The closest experience to in-person therapy." },
                { icon: Phone, title: "Voice Calls", desc: "Talk to your therapist over a private voice call. Perfect for those who prefer audio-only sessions." },
                { icon: MessageCircle, title: "Chat Therapy", desc: "Message your therapist at your own pace. Great for those who express themselves better through writing." },
              ].map((item, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2"><T>{item.title}</T></h3>
                  <p className="text-muted-foreground text-sm"><T>{item.desc}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Issues We Help With */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>Issues Our Ugandan Therapists Help With</T>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                "Depression", "Anxiety", "Trauma & PTSD", "Relationship Issues",
                "Grief & Loss", "Work Stress", "Addiction", "Self-Esteem",
                "Anger Management", "Family Conflicts", "Student Stress", "Postpartum Depression"
              ].map((issue) => (
                <div key={issue} className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground"><T>{issue}</T></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { num: "20+", label: "Licensed Therapists" },
                { num: "500+", label: "Sessions Delivered" },
                { num: "4.8/5", label: "Client Satisfaction" },
                { num: "UGX 50K", label: "Starting Price" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.num}</p>
                  <p className="text-sm text-muted-foreground mt-1"><T>{stat.label}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <T>Ready to Start Therapy in Uganda?</T>
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              <T>Take the first step towards better mental health. Our licensed Ugandan therapists are ready to help you.</T>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/specialists">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full">
                  <T>Browse Therapists</T>
                </Button>
              </Link>
              <Link to="/mind-check">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <T>Take a Free Mental Health Test</T>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Schema */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>Frequently Asked Questions</T>
            </h2>
            <div className="space-y-6">
              {[
                { q: "How much does therapy cost in Uganda?", a: "Sessions start from UGX 50,000 (approximately $14). Pricing depends on the therapist's experience and session type (video, voice, or chat)." },
                { q: "Are your therapists licensed in Uganda?", a: "Yes. All our therapists are verified professionals, many registered with the Uganda Counselling Association (UCA) or hold recognized qualifications from Ugandan universities." },
                { q: "Can I get therapy from outside Kampala?", a: "Absolutely. Our platform is fully online, so you can access therapy from Jinja, Mbarara, Gulu, Fort Portal, or anywhere with an internet connection." },
                { q: "What languages do your therapists speak?", a: "Our Ugandan therapists speak English, Luganda, Runyankole, and Swahili among other local languages." },
              ].map((faq, i) => (
                <div key={i} className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TherapyInUganda;
