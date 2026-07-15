import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Video, MessageCircle, Phone, Shield, Clock, MapPin } from "lucide-react";

export interface ConditionFAQ {
  q: string;
  a: string;
}

export interface ConditionLandingProps {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  intro: string;
  bodySections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: ConditionFAQ[];
  serviceName: string;
}

const BASE = "https://www.innersparkafrica.com";

export default function ConditionLandingPage(props: ConditionLandingProps) {
  const url = `${BASE}/${props.slug}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: props.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: props.serviceName,
    description: props.metaDescription,
    url,
    areaServed: [
      { "@type": "Country", name: "Uganda" },
      { "@type": "AdministrativeArea", name: "Kampala" },
    ],
    provider: {
      "@type": "Organization",
      name: "InnerSpark Africa",
      url: BASE,
      logo: `${BASE}/innerspark-logo.png`,
    },
  };

  return (
    <>
      <Helmet>
        <title>{props.title}</title>
        <meta name="description" content={props.metaDescription} />
        <meta name="keywords" content={props.keywords} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <Header />
      <main className="bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Licensed therapists · Confidential · Uganda-wide
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{props.h1}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{props.intro}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/book-therapist">
                <Button size="lg" className="rounded-full px-8">Book a Session — from UGX 30,000</Button>
              </Link>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="rounded-full px-8">Browse Therapists</Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Video</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> Voice</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Chat</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Evenings & weekends</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Anywhere in Uganda</span>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="prose prose-lg max-w-none text-foreground">
              {props.bodySections.map((s) => (
                <div key={s.heading} className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{s.heading}</h2>
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
                  ))}
                  {s.bullets && (
                    <ul className="space-y-2 mt-4">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {props.faqs.map((f) => (
                <div key={f.q} className="bg-background rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to talk to someone?</h2>
            <p className="text-muted-foreground mb-6">
              Book a private session with a licensed Ugandan therapist in under 2 minutes. Pay via MTN Mobile Money or Airtel Money.
            </p>
            <Link to="/book-therapist">
              <Button size="lg" className="rounded-full px-8">Book Your Session Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}