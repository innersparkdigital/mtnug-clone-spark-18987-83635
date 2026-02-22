import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Video, MessageCircle, Shield, Clock, Star } from "lucide-react";
import { T } from "@/components/Translate";
import ugandaBadge from "@/assets/uganda-badge.png";

const TherapyInKampala = () => {
  return (
    <>
      <Helmet>
        <title>Therapy in Kampala – Find a Therapist Near You | Innerspark Africa</title>
        <meta name="description" content="Find a therapist in Kampala. Online & in-person therapy for depression, anxiety, trauma & stress. Licensed Kampala-based counsellors. Sessions from UGX 50,000. Book now." />
        <meta name="keywords" content="therapy in Kampala, therapist Kampala, counsellor Kampala, psychologist Kampala, mental health Kampala, counselling near me Kampala, therapy near me Uganda" />
        <link rel="canonical" href="https://www.innersparkafrica.com/therapy-in-kampala" />
        <meta property="og:title" content="Therapy in Kampala – Find a Therapist Near You | Innerspark" />
        <meta property="og:description" content="Find a therapist in Kampala. Online therapy for depression, anxiety, trauma & stress. Book now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/therapy-in-kampala" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Innerspark Africa – Therapy in Kampala",
            "description": "Licensed therapists providing online therapy in Kampala, Uganda.",
            "url": "https://www.innersparkafrica.com/therapy-in-kampala",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kampala",
              "addressCountry": "UG"
            },
            "areaServed": { "@type": "City", "name": "Kampala" },
            "serviceType": "Online Therapy"
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
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Kampala, Uganda</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <T>Therapy in Kampala</T>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                <T>Connect with licensed therapists based in Kampala. No traffic, no waiting rooms — get professional mental health support from your phone or laptop. Sessions from UGX 50,000.</T>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/specialists">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
                    <T>Find a Therapist in Kampala</T>
                  </Button>
                </Link>
                <a href="https://wa.me/256792085773?text=Hi,%20I%20need%20therapy%20in%20Kampala" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    <T>WhatsApp Us</T>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Kampala Residents Choose Online Therapy */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>Why Kampala Residents Choose Online Therapy</T>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Clock, title: "Skip the Kampala Traffic", desc: "No need to navigate Kampala traffic or find parking. Get therapy from your home, office, or anywhere convenient." },
                { icon: Shield, title: "Complete Privacy", desc: "No one needs to know you're in therapy. Sessions are fully private and confidential — no waiting rooms." },
                { icon: Star, title: "Top Kampala Therapists", desc: "Access the best therapists in Kampala without geographical limitations. Book sessions that fit your schedule." },
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

        {/* Common Issues */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>What Kampala Clients Seek Help For</T>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                "Depression", "Anxiety & Panic", "Work Stress & Burnout", "Relationship Issues",
                "Trauma & PTSD", "Grief & Loss", "Addiction", "Low Self-Esteem",
                "Anger Management", "Family Conflicts", "Student Anxiety", "Postpartum Depression"
              ].map((issue) => (
                <div key={issue} className="flex items-center gap-2 bg-card rounded-lg p-3 border border-border">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground"><T>{issue}</T></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>How to Get Started</T>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose a Therapist", desc: "Browse our verified Kampala-based therapists. Filter by specialty, language, and availability." },
                { step: "2", title: "Book a Session", desc: "Pick a time that works for you. Same-day appointments are often available." },
                { step: "3", title: "Start Therapy", desc: "Connect via video, voice, or chat from anywhere in Kampala. It's that simple." },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2"><T>{item.title}</T></h3>
                  <p className="text-muted-foreground text-sm"><T>{item.desc}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <T>Start Your Therapy Journey in Kampala Today</T>
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              <T>You deserve professional mental health support. Our Kampala-based therapists are ready to help — no judgement, just care.</T>
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

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              <T>Frequently Asked Questions</T>
            </h2>
            <div className="space-y-6">
              {[
                { q: "Where is Innerspark located in Kampala?", a: "Our office is at the National ICT Innovation Hub, Nakawa, Kampala. However, all therapy sessions are conducted online so you don't need to visit us." },
                { q: "How much does therapy cost in Kampala?", a: "Sessions start from UGX 50,000 (approximately $14). This is significantly more affordable than traditional in-person therapy clinics in Kampala." },
                { q: "Can I see a therapist the same day?", a: "Yes! Many of our therapists offer same-day or next-day availability. Check the specialists page for current schedules." },
                { q: "Is online therapy as effective as in-person?", a: "Research shows that online therapy is just as effective as in-person therapy for most conditions including depression, anxiety, and stress-related disorders." },
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

export default TherapyInKampala;
