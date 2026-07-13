import { Helmet } from "react-helmet";

/**
 * Additive SEO expansion — layered on top of existing per-page Helmet blocks.
 * Adds:
 *  - Extra FAQPage JSON-LD (real client questions from Uganda + Kenya)
 *  - Extra keyword-rich meta (as og:see_also-style hints via meta tags)
 *  - Extra service area / offer schema for Uganda + Kenya + South Sudan
 *
 * Does NOT replace existing tags. Multiple JSON-LD blocks are valid and merged
 * by Google. Existing <meta name="keywords"> per page stays untouched.
 */

const UGANDA_CLIENT_FAQS = [
  { q: "How do I book a therapy session at InnerSpark Africa?", a: "Tap any Book a Session button on innersparkafrica.com, choose video, voice or chat, and confirm via WhatsApp. The whole booking takes about 2 minutes and you'll get a licensed African therapist matched to your concern." },
  { q: "Can I book therapy on WhatsApp in Uganda?", a: "Yes. You can message +256 792 085 773 on WhatsApp to book, pay via MTN Mobile Money or Airtel Money, and complete your session via WhatsApp video, voice call or chat." },
  { q: "How quickly can I get a therapy session in Uganda?", a: "Most clients get a same-day or next-day session. Evening, weekend and Sunday slots are available with licensed Ugandan therapists — no clinic visits required." },
  { q: "Can I get a same day therapy session in Uganda?", a: "Yes. InnerSpark offers same-day therapy in Uganda for urgent concerns including anxiety, burnout, relationship crises and suicidal thoughts. Message us on WhatsApp and we will match you with a therapist available today." },
  { q: "How do I pay for therapy using Airtel Money or MTN in Uganda?", a: "Pay UGX 75,000 (individual, couples or teen) via MTN Mobile Money or Airtel Money to the merchant number shared on WhatsApp after booking. Chat therapy starts from UGX 30,000." },
  { q: "Is there chat therapy in Uganda for UGX 30,000?", a: "Yes. InnerSpark offers affordable chat therapy in Uganda from UGX 30,000 per session — one-to-one with a licensed therapist, ideal for students and young professionals." },
  { q: "Do you have student discounts for therapy in Uganda?", a: "Yes. We offer discounted rates and chat therapy from UGX 30,000 for university and secondary school students in Uganda, plus dedicated teen therapy sessions." },
  { q: "Will anyone know I am getting therapy in Uganda?", a: "No. Sessions are fully private and confidential. We do not share your data with employers, family, insurers or the government. Many Ugandan men use anonymous chat or voice-only sessions." },
  { q: "Will my employer find out I went to therapy?", a: "No. InnerSpark is a private consumer platform — we never notify employers. Even for corporate wellbeing programmes, individual results are never shared with HR." },
  { q: "Can my teenager get therapy in Uganda?", a: "Yes. We offer therapy for teenagers in Uganda aged 13+. With parental consent, licensed therapists support teens on depression, anxiety, exam stress, bullying and trauma via video or chat." },
  { q: "Can couples do therapy online in Uganda?", a: "Yes. Couples therapy in Uganda runs at UGX 75,000 per session over WhatsApp video. Both partners join from separate phones or the same room — whatever feels safest." },
  { q: "Do you offer therapy in South Sudan?", a: "Yes. InnerSpark supports clients across South Sudan and East Africa with online therapy over WhatsApp video, voice and chat. Licensed African therapists, mobile money payments." },
  { q: "What is the difference between chat therapy and video therapy?", a: "Chat therapy is text-based over WhatsApp — private, low-bandwidth, from UGX 30,000. Video therapy is a live WhatsApp video call with your therapist at UGX 75,000. Both are with the same licensed clinicians." },
  { q: "Can I get emergency counselling or crisis support today in Uganda?", a: "Yes. If you are in crisis or having suicidal thoughts, message +256 792 085 773 on WhatsApp for same-day crisis counselling. If your life is in immediate danger, call the Uganda Mental Health helpline or nearest hospital." },
];

const KENYA_CLIENT_FAQS = [
  { q: "How much does therapy cost in Kenya?", a: "Individual online therapy on InnerSpark starts at KES 2,600 per session. A monthly package of 4 sessions is KES 9,600 — significantly less than most in-clinic Nairobi consultations." },
  { q: "Can I pay for therapy with M-Pesa?", a: "Yes. Kenyan clients pay via M-Pesa Send Money Abroad to Uganda number 0740 616 404 (Innerspark Recovery Ltd). Session is confirmed on WhatsApp within minutes." },
  { q: "Is there online therapy in Kenya via WhatsApp?", a: "Yes. Most Kenyan clients complete sessions on WhatsApp video, voice or chat — the same app you use daily, no downloads, bandwidth-friendly across Nairobi, Mombasa, Kisumu and Nakuru." },
  { q: "Will my employer in Kenya find out I am in therapy?", a: "No. Sessions are private and confidential. Even corporate EAP programmes we run for Safaricom, KCB, Equity, USAID and UN-linked teams only share aggregated data — never individual results." },
  { q: "Is there therapy for men in Kenya that is anonymous?", a: "Yes. Kenyan men can book voice-only or chat therapy without appearing on video, with a male or female licensed African therapist. No family or colleague ever sees you attend." },
];

const HIGH_INTENT_KEYWORDS_UG = [
  "therapist for depression Uganda","therapist for anxiety Uganda","therapist for relationship problems Uganda",
  "therapist for trauma Uganda","therapist for low self esteem Uganda","therapist for suicidal thoughts Uganda",
  "therapist for teen depression Uganda","therapist for couples Uganda","therapy for students Uganda",
  "therapy for mood problems Uganda","therapy for loss of purpose Uganda","therapy for fear and shyness Uganda",
  "therapy for concentration problems Uganda","therapy when you feel lost Uganda","therapy for emotional dependency Uganda",
  "therapy for abandonment issues Uganda","chat therapy Uganda 30000","affordable chat therapy Uganda",
  "therapy via WhatsApp chat Uganda","evening therapy sessions Uganda","Sunday therapy sessions Uganda",
  "therapy after school Uganda","weekend therapist Uganda","therapist available at night Uganda",
  "therapy from your phone Uganda","teen therapist Uganda","therapy for teenagers Kampala",
  "youth mental health Uganda","online therapy for teens Uganda","affordable therapy for students Uganda",
  "urgent therapy Uganda","mental health crisis support Uganda","suicidal thoughts help Uganda",
  "same day therapist Uganda","emergency counselling Uganda","therapist available today Uganda",
  "crisis counselling Kampala","online therapy South Sudan","therapist South Sudan",
  "mental health support South Sudan","online counselling East Africa","therapist for Africans online",
];

const HIGH_INTENT_KEYWORDS_KE = [
  "therapist for anxiety Kenya","therapist for depression Kenya","therapist for burnout Kenya",
  "therapist for work stress Kenya","therapist for relationship problems Kenya","therapist for trauma Kenya",
  "therapist for grief Kenya","therapist for low self esteem Kenya","therapist for panic attacks Kenya",
  "therapist for PTSD Kenya","therapist for childhood trauma Kenya","therapist for couples Kenya",
  "therapist for suicidal thoughts Kenya","therapy for imposter syndrome Kenya","therapy for career stress Kenya",
  "teen therapist Kenya","therapy for students Kenya","therapy that accepts M-Pesa Kenya",
  "therapy via WhatsApp Kenya","voice call therapist Kenya","chat therapy Kenya","affordable therapist Nairobi",
  "therapy for NGO workers in Kenya","therapist for bank staff in Nairobi","therapy for Safaricom employees",
  "therapy for KCB Bank employees Kenya","therapy for Equity Bank employees Kenya","therapy for civil servants in Kenya",
  "therapy without going to a clinic Nairobi","anonymous therapy Nairobi","therapy without anyone knowing Kenya",
  "mshauri wa afya ya akili Nairobi","tiba ya akili Kenya","afya ya akili Kenya",
];

const SOCIAL_HOOKS = [
  "Private therapy in Uganda you can do from your phone",
  "Therapy in Uganda that accepts Airtel Money and MTN",
  "Affordable therapy in Uganda from UGX 30,000",
  "Same day therapy sessions available in Uganda",
  "Therapy for teens and students in Uganda",
  "Mental health support in Uganda and South Sudan",
  "InnerSpark Africa — book a therapist in 2 minutes",
  "mental health Uganda 2026","therapy Uganda explained","online therapy Uganda review",
  "therapy on your phone Uganda","how to find a therapist in Uganda","is InnerSpark Africa good",
];

type Region = "uganda" | "kenya" | "africa";

interface Props {
  region?: Region;
  /** Optional additional page-scoped keywords to merge. */
  extraKeywords?: string[];
}

export default function ExpandedSeoSchema({ region = "africa", extraKeywords = [] }: Props) {
  const faqs =
    region === "kenya"
      ? KENYA_CLIENT_FAQS
      : region === "uganda"
        ? UGANDA_CLIENT_FAQS
        : [...UGANDA_CLIENT_FAQS.slice(0, 8), ...KENYA_CLIENT_FAQS];

  const keywordPool = [
    ...(region === "kenya" ? HIGH_INTENT_KEYWORDS_KE : HIGH_INTENT_KEYWORDS_UG),
    ...(region === "africa" ? HIGH_INTENT_KEYWORDS_KE : []),
    ...SOCIAL_HOOKS,
    ...extraKeywords,
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Online Therapy & Counselling",
    provider: {
      "@type": "MedicalOrganization",
      name: "InnerSpark Africa",
      url: "https://www.innersparkafrica.com",
    },
    areaServed: [
      { "@type": "Country", name: "Uganda" },
      { "@type": "Country", name: "Kenya" },
      { "@type": "Country", name: "South Sudan" },
      { "@type": "AdministrativeArea", name: "East Africa" },
    ],
    audience: [
      { "@type": "Audience", audienceType: "Adults seeking therapy" },
      { "@type": "PeopleAudience", suggestedMinAge: 13, name: "Teens and students" },
      { "@type": "BusinessAudience", name: "Corporate HR & EAP buyers" },
    ],
    availableChannel: [
      { "@type": "ServiceChannel", serviceType: "WhatsApp Video Therapy" },
      { "@type": "ServiceChannel", serviceType: "WhatsApp Voice Therapy" },
      { "@type": "ServiceChannel", serviceType: "WhatsApp Chat Therapy" },
    ],
    hoursAvailable: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "07:00", closes: "22:00" },
    ],
  };

  return (
    <Helmet>
      {/* Additive keyword tags — appended, existing keywords stay intact */}
      <meta name="news_keywords" content={keywordPool.slice(0, 60).join(", ")} />
      <meta property="article:tag" content={keywordPool.slice(0, 25).join(", ")} />
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
    </Helmet>
  );
}