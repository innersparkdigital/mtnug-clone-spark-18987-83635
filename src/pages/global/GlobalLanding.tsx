import { useParams } from "react-router-dom";
import MarketLandingPage from "@/components/MarketLandingPage";
import NotFound from "@/pages/NotFound";
import { GLOBAL_LANDING_PAGES } from "@/lib/globalLandingData";
import { MARKET_LANDINGS, type MarketLanding } from "@/data/marketLandings";
import type { GlobalLandingProps } from "@/components/seo/GlobalLandingPage";

interface Props {
  /** Slug when rendered from a static route. */
  slug?: string;
}

const SEGMENT: Record<string, { base: string; label: string; code: string }> = {
  "online-therapy-nigeria": { base: "nigeria", label: "Nigeria", code: "NG" },
  "online-therapy-ghana": { base: "ghana", label: "Ghana", code: "GH" },
  "online-therapy-tanzania": { base: "tanzania", label: "Tanzania", code: "TZ" },
  "online-therapy-south-africa": { base: "usa", label: "South Africa", code: "ZA" },
  "online-therapy-africa": { base: "usa", label: "Africa", code: "UG" },
  "online-therapy-diaspora": { base: "usa", label: "the world", code: "UG" },
  "therapy-for-executives": { base: "usa", label: "executives & leaders", code: "UG" },
  "therapy-for-students-africa": { base: "usa", label: "students", code: "UG" },
};

// Testimonials already published on the InnerSpark homepage.
const SHARED_TESTIMONIALS = [
  { quote: "Innerspark changed my life. I was struggling with anxiety for years, and my therapist helped me find peace again. The sessions are affordable and so convenient.", who: "Sarah M., Kampala" },
  { quote: "I was skeptical about online therapy, but the professionalism and care I received was beyond my expectations. Highly recommend to anyone seeking support.", who: "David K., Nairobi" },
  { quote: "Being able to talk to someone confidentially from home made all the difference. The booking process was simple and my therapist truly understood me.", who: "Grace N., Entebbe" },
];

function toMarket(g: GlobalLandingProps): MarketLanding {
  const seg = SEGMENT[g.slug] || { base: "usa", label: "the world", code: "UG" };
  const base = MARKET_LANDINGS[seg.base];
  const usaBase = seg.base === "usa";
  const [first, ...rest] = g.bodySections;
  const bullets = g.bodySections.flatMap((s) => s.bullets || []);
  return {
    ...base,
    slug: g.slug,
    countryLabel: seg.label,
    code: seg.code,
    title: g.title,
    description: g.metaDescription,
    keywords: g.keywords,
    canonicalUrl: `https://www.innersparkafrica.com/${g.slug}`,
    h1: g.h1,
    h1Line2: g.heroBadge,
    introLine1: g.intro,
    introLine2: `${g.ctaPrice} · Book in about 2 minutes · Everyone welcome.`,
    citiesLine: usaBase ? g.areaServed.slice(0, 6).join(", ") : base.citiesLine,
    problemHeadline: first?.heading || base.problemHeadline,
    problemSource: "Professional care open to every background",
    problemBody: [first?.paragraphs[0] || base.problemBody[0], first?.paragraphs[1] || base.problemBody[1]],
    howHeadline: "Confidential online therapy in 3 steps.",
    paymentHowTitle: usaBase ? "How payment works" : base.paymentHowTitle,
    paymentTip: usaBase ? "Cross-border wellbeing support with licensed African therapists — not an emergency or insurance service." : base.paymentTip,
    concerns: bullets.length >= 4 ? bullets.slice(0, 8) : base.concerns,
    cities: usaBase ? [] : base.cities,
    testimonials: usaBase ? SHARED_TESTIMONIALS : base.testimonials,
    faqs: g.faqs,
    related: (g.relatedLinks || []).slice(0, 6).map((l) => ({ to: l.to, label: l.label, tag: "Related", blurb: "Explore this page." })),
    whatsappPrefill: `Hi InnerSpark, I found your page on ${g.h1}. I'd like to book a licensed online therapist.`,
    schemaCities: usaBase ? [] : base.schemaCities,
    extraSections: rest,
  };
}

export default function GlobalLanding({ slug }: Props) {
  const params = useParams();
  const key = slug || params.slug || "";
  const data = GLOBAL_LANDING_PAGES[key];
  if (!data) return <NotFound />;
  return <MarketLandingPage market={toMarket(data)} />;
}
