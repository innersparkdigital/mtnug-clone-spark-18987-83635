import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Video,
  MessageCircle,
  Phone,
  Shield,
  Clock,
  Globe,
} from "lucide-react";

const BASE = "https://www.innersparkafrica.com";
const DEFAULT_OG = `${BASE}/og-image.jpg`;

export interface GlobalLandingFAQ {
  q: string;
  a: string;
}

export interface GlobalLandingProps {
  /** Route path without leading slash, e.g. "online-therapy-africa" */
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  intro: string;
  /** Countries / regions this page serves — used for schema areaServed. */
  areaServed: string[];
  /** Short trust line shown in the hero pill. */
  heroBadge: string;
  /** Price line shown on the primary CTA. */
  ctaPrice: string;
  serviceName: string;
  bodySections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: GlobalLandingFAQ[];
  /** Internal links to related pages, rendered as a crawlable cluster. */
  relatedLinks?: { to: string; label: string }[];
  ogImage?: string;
}

/**
 * Template for country / segment landing pages aimed at clients outside
 * Uganda. Prices are shown in USD, payment options are international, and the
 * schema declares a multi-country areaServed so Google can surface the page in
 * every market we serve.
 */
export default function GlobalLandingPage(props: GlobalLandingProps) {
  const url = `${BASE}/${props.slug}`;
  const ogImage = props.ogImage || DEFAULT_OG;

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
    "@type": "Service",
    name: props.serviceName,
    description: props.metaDescription,
    url,
    serviceType: "Online Therapy & Counselling",
    provider: {
      "@type": "MedicalOrganization",
      name: "InnerSpark Africa",
      url: BASE,
      logo: `${BASE}/innerspark-logo.png`,
    },
    areaServed: props.areaServed.map((name) => ({ "@type": "Country", name })),
    availableChannel: [
      { "@type": "ServiceChannel", serviceType: "Video Therapy" },
      { "@type": "ServiceChannel", serviceType: "Voice Call Therapy" },
      { "@type": "ServiceChannel", serviceType: "Chat Therapy" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "22",
      availability: "https://schema.org/InStock",
      url: `${BASE}/book-therapist`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: props.h1, item: url },
    ],
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
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      <main className="bg-background">
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> {props.heroBadge}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {props.h1}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {props.intro}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/book-therapist">
                <Button size="lg" className="rounded-full px-8">
                  Book a Session — {props.ctaPrice}
                </Button>
              </Link>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Meet Our Therapists
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Video</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> Voice</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Chat</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Any time zone</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {props.areaServed.slice(0, 3).join(" · ")}</span>
            </div>
          </div>
        </section>

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

        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Frequently Asked Questions
            </h2>
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

        {props.relatedLinks && props.relatedLinks.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">Explore more</h2>
              <ul className="flex flex-wrap gap-3">
                {props.relatedLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-block rounded-full border px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="pb-20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Talk to a licensed African therapist today
            </h2>
            <p className="text-muted-foreground mb-6">
              Book in under 2 minutes. Pay by card, mobile money or bank transfer —
              wherever in the world you are.
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