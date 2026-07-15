import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Phone, Video, MessageCircle, Star, Users, Shield } from "lucide-react";
import { T } from "@/components/Translate";
import ugandaBadge from "@/assets/uganda-badge.png";

const UGANDA_CITIES = [
  {
    slug: "kampala",
    name: "Kampala",
    headline: "Therapy in Kampala",
    intro: "Kampala life moves fast — traffic on Jinja Road, deadlines at the office, family expectations after work. Our licensed therapists understand the pressure of professional life in the capital and offer private online sessions from anywhere in Nakawa, Kololo, Ntinda, Bukoto, Naguru or Makindye.",
    highlights: ["Sessions from UGX 75,000 / $22", "Evening slots for working professionals", "Sessions in English & Luganda"],
  },
  {
    slug: "entebbe",
    name: "Entebbe",
    headline: "Therapy in Entebbe",
    intro: "Whether you live near the airport, work at one of the international agencies, or are based on the lake shore, you can talk to a Ugandan therapist over a private WhatsApp video or voice call — no need to drive into Kampala.",
    highlights: ["100% online — no travel", "Discreet sessions from home", "Same-week appointments"],
  },
  {
    slug: "jinja",
    name: "Therapy in Jinja",
    headline: "Therapy in Jinja",
    intro: "Access licensed counselling in Jinja town and the wider Busoga region without leaving your home. Our therapists work with students at Busoga University, NGO staff, hospitality workers and parents — in English or Luganda.",
    highlights: ["Works on low bandwidth", "Voice & chat options available", "Confidential — never shared with employers"],
  },
  {
    slug: "mbarara",
    name: "Therapy in Mbarara",
    headline: "Therapy in Mbarara",
    intro: "Mental health support for the western region — Mbarara, Bushenyi, Kabale and surrounding areas. Sessions available in English and Runyankole with therapists who understand the cultural context of the south-west.",
    highlights: ["Runyankole-speaking therapists", "Students & MUST community welcome", "Pay via Mobile Money"],
  },
  {
    slug: "gulu",
    name: "Therapy in Gulu",
    headline: "Therapy in Gulu",
    intro: "Trauma-informed therapy for northern Uganda — Gulu, Lira, Kitgum and surrounding districts. Our therapists are trained in working with post-conflict trauma, grief, and family healing in the Acholi sub-region.",
    highlights: ["Trauma-informed care", "Sessions in English & Luo", "Discreet WhatsApp delivery"],
  },
];

const TherapyInUganda = () => {
  return (
    <>
      <Helmet>
        <title>Therapy in Uganda | Online Sessions in Kampala, Jinja, Mbarara | InnerSpark Africa</title>
        <meta name="description" content="Licensed therapists across Uganda available for online sessions. Book via video, voice or chat. Evenings and weekends available. Pay via MTN or Airtel. Completely confidential." />
        <meta name="keywords" content="therapy in Uganda, therapist in Kampala, counsellor in Kampala, online therapy Uganda, psychologist Kampala, counselling Jinja, therapist Mbarara, therapy Gulu, mental health Uganda, online counselling Uganda, Luganda therapist, affordable therapy Uganda, depression therapist Uganda, anxiety counsellor Kampala, trauma therapy Gulu" />
        <link rel="canonical" href="https://www.innersparkafrica.com/therapy-in-uganda" />
        <meta property="og:title" content="Therapy in Uganda | Online Counsellors in Kampala, Jinja, Mbarara | InnerSpark" />
        <meta property="og:description" content="Licensed Ugandan therapists. WhatsApp video, voice & chat from UGX 75,000. Serving Kampala, Entebbe, Jinja, Mbarara & Gulu." />
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
            "telephone": "+256792085773",
            "image": "https://www.innersparkafrica.com/innerspark-logo.png",
            "priceRange": "UGX 30,000 - UGX 75,000",
            "currenciesAccepted": "UGX",
            "paymentAccepted": ["Mobile Money", "MTN MoMo", "Airtel Money", "PesaPal"],
            "medicalSpecialty": ["Psychotherapy", "Counseling", "MentalHealth"],
            "address": { "@type": "PostalAddress", "addressCountry": "UG" },
            "areaServed": [
              { "@type": "Country", "name": "Uganda" },
              { "@type": "City", "name": "Kampala" },
              { "@type": "City", "name": "Entebbe" },
              { "@type": "City", "name": "Jinja" },
              { "@type": "City", "name": "Mbarara" },
              { "@type": "City", "name": "Gulu" },
              { "@type": "City", "name": "Mbale" },
              { "@type": "City", "name": "Fort Portal" },
              { "@type": "City", "name": "Lira" }
            ],
            "serviceType": "Online Therapy",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Online Therapy Services in Uganda",
              "itemListElement": [
                { "@type": "Offer", "name": "Individual therapy session", "price": "75000", "priceCurrency": "UGX", "availability": "https://schema.org/InStock" },
                { "@type": "Offer", "name": "Group therapy session", "price": "30000", "priceCurrency": "UGX", "availability": "https://schema.org/InStock" },
                { "@type": "Offer", "name": "Free WHO-5 wellbeing check", "price": "0", "priceCurrency": "UGX", "availability": "https://schema.org/InStock" }
              ]
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceType": "Online",
              "availableLanguage": ["English", "Luganda", "Runyankole", "Swahili"]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.innersparkafrica.com/" },
              { "@type": "ListItem", "position": 2, "name": "Therapy in Uganda", "item": "https://www.innersparkafrica.com/therapy-in-uganda" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does therapy cost in Uganda?","acceptedAnswer":{"@type":"Answer","text":"Online therapy at Innerspark Africa starts at UGX 30,000 for group sessions and UGX 75,000 (about $22) for a one-on-one session with a licensed Ugandan therapist. We also offer free wellbeing assessments and a free initial consultation."}},{"@type":"Question","name":"Are Innerspark Africa therapists licensed in Uganda?","acceptedAnswer":{"@type":"Answer","text":"Yes. All our therapists are licensed counsellors, clinical psychologists, or psychiatric professionals registered with relevant Ugandan professional bodies, including the Uganda Counselling Association where applicable."}},{"@type":"Question","name":"Can I have therapy in Luganda or other local languages?","acceptedAnswer":{"@type":"Answer","text":"Yes. We offer sessions in English, Luganda, Runyankole, Swahili and other Ugandan languages. You can filter therapists by language when booking."}},{"@type":"Question","name":"How quickly can I see a therapist in Uganda?","acceptedAnswer":{"@type":"Answer","text":"Most clients are matched and have their first session within 24–48 hours of booking. Urgent cases are prioritised through our emergency support line."}},{"@type":"Question","name":"Is online therapy in Uganda confidential and safe?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. All sessions are encrypted, your data is protected under our privacy policy, and our therapists follow strict professional confidentiality standards."}}]})}
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

        {/* Therapy by City */}
        <section className="py-16 bg-muted/30" id="therapy-by-city">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-3">
              <T>Therapy Across Uganda — by City</T>
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              <T>Online therapy means a licensed Ugandan counsellor is one WhatsApp call away — wherever you are in the country.</T>
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {UGANDA_CITIES.map((c) => (
                <a key={c.slug} href={`#${c.slug}`} className="px-4 py-1.5 rounded-full text-sm bg-card border border-border hover:border-primary/60 hover:text-primary transition-colors">
                  {c.name.replace("Therapy in ", "")}
                </a>
              ))}
            </div>

            <div className="space-y-8">
              {UGANDA_CITIES.map((c) => (
                <article key={c.slug} id={c.slug} className="bg-card rounded-xl p-6 md:p-8 border border-border scroll-mt-24">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                        <T>{c.headline}</T>
                      </h3>
                      <p className="text-muted-foreground mt-2 leading-relaxed text-sm md:text-base">
                        <T>{c.intro}</T>
                      </p>
                    </div>
                  </div>
                  <ul className="grid sm:grid-cols-3 gap-2 mt-4 ml-8">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <T>{h}</T>
                      </li>
                    ))}
                  </ul>
                  <div className="ml-8 mt-5 flex flex-wrap gap-3">
                    <Link to="/book-therapist">
                      <Button size="sm" className="rounded-full">
                        <T>Book a session</T>
                      </Button>
                    </Link>
                    <Link to="/mind-check">
                      <Button size="sm" variant="outline" className="rounded-full">
                        <T>Free wellbeing check</T>
                      </Button>
                    </Link>
                  </div>
                </article>
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

        {/* Helpful Reading */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              <T>Popular Mental Health Guides for Uganda</T>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { slug: "affordable-online-counselling-uganda", title: "Affordable Online Counselling in Uganda" },
                { slug: "best-therapist-for-anxiety-in-uganda", title: "Best Therapist for Anxiety in Uganda" },
                { slug: "online-vs-in-person-therapy-uganda", title: "Online vs In-Person Therapy in Uganda" },
                { slug: "cost-of-therapy-in-kampala-2026", title: "Cost of Therapy in Kampala (2026)" },
                { slug: "mental-health-support-students-uganda", title: "Mental Health Support for Students in Uganda" },
                { slug: "workplace-burnout-uganda", title: "Workplace Burnout in Uganda" },
                { slug: "talk-to-boss-mental-health-uganda", title: "How to Talk to Your Boss About Mental Health" },
                { slug: "how-to-find-psychologist-in-kampala", title: "How to Find a Psychologist in Kampala" },
              ].map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="block p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <span className="text-sm font-medium text-foreground hover:text-primary"><T>{p.title}</T></span>
                </Link>
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
