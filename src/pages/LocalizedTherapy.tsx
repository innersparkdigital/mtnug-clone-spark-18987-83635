import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, Smartphone, HeartHandshake, Check, ArrowRight, MessageCircle, Clock3 } from "lucide-react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import BookingFormModal from "@/components/BookingFormModal";

type Market = {
  country: string;
  countryLabel: string;
  code: string;
  flag: string;
  currency: string;
  video: string;
  chat: string;
  cities: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  painHeading: string;
  pain: string;
  context: string;
  payment: string;
  paymentNote: string;
  concerns: string[];
  localTrust: string[];
  related: { to: string; label: string }[];
  faqs: { q: string; a: string }[];
};

const MARKETS: Record<string, Market> = {
  nigeria: {
    country: "Nigeria", countryLabel: "Nigeria", code: "NG", flag: "🇳🇬", currency: "NGN", video: "about NGN 27,500", chat: "about NGN 11,000",
    cities: "Lagos, Abuja, Port Harcourt and across Nigeria", title: "Book Online Therapy Nigeria | Licensed from ~NGN 27,500", description: "For Nigerian professionals ready to pay for confidential care. Book a licensed African therapist — video about NGN 27,500 · chat about NGN 11,000. Visa accepted.",
    h1: "Book licensed therapy without Lagos traffic", intro: "For professionals ready to invest in confidential care. Talk with a licensed African therapist who understands the pressure to keep performing, providing and appearing fine.",
    painHeading: "Support that fits the pace of Nigerian life", pain: "Traffic, long workdays, rising living costs and concern about being seen at a clinic can make support hard to begin. Online sessions let you speak from a private place without adding another journey to your day.",
    context: "career pressure, burnout, relationships, relocation, family expectations, grief and the emotional weight of always needing to be strong", payment: "international Visa card", paymentNote: "Your bank confirms the final naira conversion before payment.",
    concerns: ["Work stress and burnout", "Relationship and marriage strain", "Anxiety and overthinking", "Relocation and diaspora decisions", "Grief and family pressure", "Low mood and loss of motivation"],
    localTrust: ["No Lagos commute", "African cultural context", "Private WhatsApp confirmation"],
    related: [{ to: "/blog/cost-of-therapy-in-nigeria", label: "Cost of therapy in Nigeria" }, { to: "/blog/find-a-therapist-in-lagos", label: "How to find a therapist in Lagos" }],
    faqs: [{ q: "How much is online therapy in Nigeria?", a: "A video session is about NGN 27,500 and chat therapy is about NGN 11,000. The final naira amount depends on your card provider's conversion at payment." }, { q: "Can I attend from outside Lagos?", a: "Yes. Sessions are online, so you can join privately from Abuja, Port Harcourt or anywhere in Nigeria with a suitable internet connection." }, { q: "Will my therapist understand Nigerian family and work pressure?", a: "InnerSpark therapists are African professionals who work with career demands, family expectations, relationships, grief and relocation without requiring you to explain every cultural detail." }],
  },
  tanzania: {
    country: "Tanzania", countryLabel: "Tanzania", code: "TZ", flag: "🇹🇿", currency: "TZS", video: "about TZS 52,000", chat: "about TZS 21,000",
    cities: "Dar es Salaam, Arusha, Mwanza and across Tanzania", title: "Book Online Therapy Tanzania | Licensed from ~TZS 52,000", description: "For Tanzanian professionals ready to pay for private care. Book a licensed African therapist — video about TZS 52,000 · chat about TZS 21,000. Visa accepted.",
    h1: "Book licensed therapy that travels less than you do", intro: "For professionals ready to invest in confidential care. Speak with a licensed African therapist from Dar es Salaam, Arusha, Mwanza or wherever you feel safe.",
    painHeading: "Care without a long journey or public waiting room", pain: "Distance, limited therapist choice outside major cities and concern about being recognised can delay support. Online therapy gives you more choice while keeping sessions private and practical.",
    context: "work pressure, family responsibilities, relationship strain, grief, student stress and changes that feel difficult to discuss openly", payment: "international Visa card", paymentNote: "Your card provider confirms the final shilling conversion before payment.",
    concerns: ["Work and business pressure", "Family responsibilities", "Relationship concerns", "Student and exam stress", "Grief and life changes", "Anxiety and low mood"],
    localTrust: ["Available beyond major cities", "Low-travel support", "English or Swahili matching where available"],
    related: [{ to: "/online-therapy-africa", label: "Online therapy across Africa" }, { to: "/specialists", label: "Browse African therapists" }],
    faqs: [{ q: "How much does online therapy cost in Tanzania?", a: "A video session is about TZS 52,000 and chat therapy is about TZS 21,000. Your card provider shows the final converted amount." }, { q: "Can I book from Arusha or Mwanza?", a: "Yes. Sessions are online and available across Tanzania where you have a private space and reliable connection." }, { q: "Can I ask for a therapist who speaks Swahili?", a: "You can share your language preference during booking. We will match it where a suitable Swahili-speaking therapist is available." }],
  },
  gambia: {
    country: "The Gambia", countryLabel: "The Gambia", code: "GM", flag: "🇬🇲", currency: "GMD", video: "about GMD 1,500", chat: "about GMD 600",
    cities: "Banjul, Kanifing, Brikama and across The Gambia", title: "Book Online Therapy Gambia | Licensed from ~GMD 1,500", description: "For professionals in The Gambia ready to pay for private care. Book a licensed African therapist — video about GMD 1,500 · chat about GMD 600. Visa accepted.",
    h1: "Book licensed therapy with more choice and full privacy", intro: "For people ready to invest in confidential care. Connect with a licensed African therapist from Banjul, Kanifing, Brikama or anywhere you can speak safely.",
    painHeading: "A wider care network for a close-knit country", pain: "In a smaller community, privacy concerns and a limited local provider network can make asking for help feel exposed. Online therapy widens your options without requiring a clinic visit.",
    context: "family expectations, migration, work pressure, grief, relationships and the loneliness that can sit behind a strong public face", payment: "international Visa card", paymentNote: "Prices are estimates; your bank confirms the final dalasi conversion.",
    concerns: ["Family and relationship pressure", "Migration and separation", "Grief and loss", "Work and money stress", "Anxiety and loneliness", "Confidential personal support"],
    localTrust: ["A wider African therapist network", "No public waiting room", "Private WhatsApp confirmation"],
    related: [{ to: "/online-therapy-africa", label: "Online therapy across Africa" }, { to: "/specialists", label: "Meet our therapists" }],
    faqs: [{ q: "How much is online therapy in The Gambia?", a: "A video session is about GMD 1,500 and chat therapy is about GMD 600. These are estimates based on the current service price; your bank confirms the conversion." }, { q: "Is the session confidential?", a: "Sessions are one-to-one and private. You can attend from a place you choose without travelling to a public clinic or waiting room." }, { q: "Can I choose my therapist?", a: "Yes. You can review therapist profiles and share preferences about gender, language, concern and communication style during booking." }],
  },
  ghana: {
    country: "Ghana", countryLabel: "Ghana", code: "GH", flag: "🇬🇭", currency: "GHS", video: "about GHS 235", chat: "about GHS 95",
    cities: "Accra, Kumasi, Takoradi and across Ghana", title: "Book Online Therapy Ghana | Licensed from ~GHS 235", description: "For Ghanaian professionals ready to pay for confidential care. Book a licensed African therapist — video about GHS 235 · chat about GHS 95. Visa accepted.",
    h1: "Book licensed therapy that respects faith, family and privacy", intro: "For professionals ready to invest in confidential care. Talk with a licensed African therapist from Accra, Kumasi, Takoradi or wherever you feel comfortable.",
    painHeading: "Culturally relevant support beyond Accra", pain: "Finding private support outside major cities can take time, while fear of judgement may stop people from trying. Online sessions offer a discreet route to care without losing African context.",
    context: "work, study, relationships, grief, faith, family expectations and the pressure to appear resilient", payment: "international Visa card", paymentNote: "Your card provider confirms the final cedi conversion before payment.",
    concerns: ["Work stress and burnout", "University and exam pressure", "Faith and emotional wellbeing", "Relationship concerns", "Grief and family change", "Anxiety and low mood"],
    localTrust: ["Private from home", "African cultural understanding", "Available beyond Accra"],
    related: [{ to: "/blog/cost-of-therapy-in-ghana", label: "Cost of therapy in Ghana" }, { to: "/blog/find-a-therapist-in-accra", label: "How to find a therapist in Accra" }],
    faqs: [{ q: "How much does therapy cost in Ghana?", a: "A video session is about GHS 235 and chat therapy is about GHS 95. Your card provider confirms the final cedi amount at payment." }, { q: "Can I join from Kumasi or Takoradi?", a: "Yes. Therapy is online, so you can join from anywhere in Ghana with a private place and stable connection." }, { q: "Can therapy respect my faith?", a: "Yes. You can tell us that faith is important to you and request a therapist whose approach respects your beliefs while maintaining professional care." }],
  },
  usa: {
    country: "the United States", countryLabel: "United States", code: "US", flag: "🇺🇸", currency: "USD", video: "about USD 22", chat: "about USD 9",
    cities: "African immigrants, international students and diaspora communities across the United States", title: "Book Online Therapy for Africans in the USA | from ~USD 22", description: "For African professionals in the USA ready to pay for culturally grounded care. Licensed African therapists — video about USD 22 · chat about USD 9. Visa accepted.",
    h1: "Book therapy without translating your whole life first", intro: "For professionals ready to invest in confidential care. Speak with an African therapist who understands migration, family obligations and living between cultures.",
    painHeading: "Support for the parts of diaspora life others can miss", pain: "Homesickness, immigration stress, racial pressure and family expectations back home can overlap. A therapist who understands African context can help you talk without starting every session with a cultural explanation.",
    context: "diaspora identity, adjustment, relationships, grief across distance, international student life, family expectations and workplace stress", payment: "Visa card", paymentNote: "InnerSpark provides cross-border wellbeing support, not US emergency care; suitability may depend on your location and needs.",
    concerns: ["Diaspora identity and belonging", "Homesickness and adjustment", "Family obligations back home", "International student stress", "Relationships across cultures", "Workplace and racial stress"],
    localTrust: ["African cultural context", "Convenient across US time zones", "Lower-cost chat option"],
    related: [{ to: "/online-therapy-diaspora", label: "Therapy for Africans abroad" }, { to: "/specialists", label: "Meet African therapists" }],
    faqs: [{ q: "How much does InnerSpark cost in the USA?", a: "Video therapy is about USD 22 and chat therapy about USD 9. The final amount is confirmed during payment." }, { q: "Is this a replacement for emergency care in the United States?", a: "No. InnerSpark is not an emergency service. If you may harm yourself or are in immediate danger, call or text 988 in the United States or contact local emergency services." }, { q: "Will my therapist understand African family expectations?", a: "Our African therapists regularly support clients navigating migration, identity, family obligations, relationships and life between cultures." }],
  },
};

export default function LocalizedTherapy({ marketOverride }: { marketOverride?: string }) {
  const { market: routeMarket = "" } = useParams();
  const market = marketOverride || routeMarket;
  const m = MARKETS[market];
  const { startBooking, resetFlow, isBookingFormOpen, actionType } = useBookingFlow();
  if (!m) return <Navigate to="/" replace />;
  const url = `https://www.innersparkafrica.com/${market}`;
  const schema = { "@context": "https://schema.org", "@type": "Service", name: `Online therapy in ${m.country}`, url, areaServed: { "@type": "Country", name: m.countryLabel }, provider: { "@type": "MedicalOrganization", "@id": "https://www.innersparkafrica.com/#organization", name: "InnerSpark Africa" }, serviceType: ["Online therapy", "Video therapy", "Chat therapy"], offers: [{ "@type": "Offer", priceCurrency: m.currency, description: `Video therapy ${m.video}` }, { "@type": "Offer", priceCurrency: m.currency, description: `Chat therapy ${m.chat}` }] };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: m.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) };
  return <div className="min-h-screen bg-background pb-20 md:pb-0">
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={`${url}/`} />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
    <Header />
    <main>
      <section className="border-b border-border bg-secondary py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <Badge variant="outline" className="mb-5 border-primary/30 bg-background text-primary"><span className="mr-2" aria-hidden>{m.flag}</span>{m.countryLabel}</Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-6xl">{m.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{m.intro}</p>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Available in {m.cities}.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={startBooking}>Book a therapist <ArrowRight /></Button>
              <Button asChild size="lg" variant="outline"><Link to="/wellbeing-check">Take the free wellbeing check</Link></Button>
            </div>
          </div>
          <Card className="border-primary/20 shadow-card">
            <CardContent className="p-6 md:p-8">
              <p className="text-sm font-semibold text-primary">Clear local price estimate</p>
              <div className="mt-5 space-y-5">
                <div className="flex items-end justify-between gap-4 border-b border-border pb-4"><div><p className="font-semibold">Video therapy</p><p className="text-sm text-muted-foreground">Live one-to-one session</p></div><p className="text-xl font-bold text-foreground">{m.video}</p></div>
                <div className="flex items-end justify-between gap-4"><div><p className="font-semibold">Chat therapy</p><p className="text-sm text-muted-foreground">Private written support</p></div><p className="text-xl font-bold text-foreground">{m.chat}</p></div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Pay by {m.payment}. {m.paymentNote}</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-14 md:py-20"><div className="container mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2"><div><p className="text-sm font-semibold text-primary">WHY ONLINE CARE</p><h2 className="mt-2 text-3xl font-semibold text-foreground">{m.painHeading}</h2><p className="mt-5 leading-relaxed text-muted-foreground">{m.pain}</p><p className="mt-4 leading-relaxed text-muted-foreground">InnerSpark connects you with licensed African therapists familiar with {m.context}. You can speak from a private place without travelling to a waiting room.</p><div className="mt-6 flex flex-wrap gap-2">{m.localTrust.map((item) => <Badge key={item} variant="secondary" className="gap-1.5 py-1"><Check className="h-3.5 w-3.5" />{item}</Badge>)}</div></div><div className="grid gap-3 sm:grid-cols-2">{[[ShieldCheck,"Licensed professionals","Review specialties and availability before booking."],[Smartphone,"Video or chat","Choose face-to-face video or lower-cost written support."],[CreditCard,"Clear payment",`Pay securely by ${m.payment}.`],[HeartHandshake,"Confidential care","Speak without shame, judgement or pressure." ]].map(([Icon,title,text]: any)=><Card key={title} className="shadow-none"><CardContent className="p-5"><Icon className="mb-4 h-6 w-6 text-primary"/><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></CardContent></Card>)}</div></div></section>
      <section className="border-y border-border bg-muted py-14 md:py-20"><div className="container mx-auto max-w-6xl px-4"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold text-primary">COMMON REASONS</p><h2 className="mt-2 text-3xl font-semibold">You can start with what feels heaviest</h2><p className="mt-4 text-muted-foreground">You do not need a diagnosis or perfect words before booking.</p></div><div className="grid gap-3 sm:grid-cols-2">{m.concerns.map((concern) => <div key={concern} className="flex items-center gap-3 border-b border-border py-3 text-sm font-medium"><Check className="h-4 w-4 text-primary" />{concern}</div>)}</div></div></div></section>
      <section className="py-14 md:py-20"><div className="container mx-auto max-w-6xl px-4"><h2 className="text-3xl font-semibold">Start in three practical steps</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{[["01","Tell us what you need","Share your concern, preferences and a safe contact number."],["02","Choose your format",`Video is ${m.video}; chat is ${m.chat}.`],["03","Confirm on WhatsApp","Receive payment guidance and your agreed session time privately."]].map(([n,t,b])=><div key={n} className="border-t-2 border-primary pt-5"><span className="text-sm font-bold text-primary">{n}</span><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p></div>)}</div><Button onClick={startBooking} className="mt-8">Choose a therapist</Button></div></section>
      <section className="border-y border-border bg-secondary py-14"><div className="container mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2"><div><h2 className="text-3xl font-semibold">Questions from {m.countryLabel}</h2><p className="mt-3 text-muted-foreground">Straight answers before you decide.</p></div><Accordion type="single" collapsible>{m.faqs.map((faq, index) => <AccordionItem key={faq.q} value={`faq-${index}`}><AccordionTrigger className="text-left">{faq.q}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
      <section className="py-14"><div className="container mx-auto max-w-6xl px-4"><h2 className="text-2xl font-semibold">Helpful next reads</h2><div className="mt-5 flex flex-wrap gap-3">{m.related.map((link) => <Button key={link.to} asChild variant="outline"><Link to={link.to}>{link.label}<ArrowRight /></Link></Button>)}</div></div></section>
    </main>
    <Footer />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden"><div className="flex gap-2"><Button className="flex-1" onClick={startBooking}>Book a therapist</Button><Button asChild variant="outline" size="icon"><a href="https://wa.me/256792085773?text=Hi%20InnerSpark%2C%20I%20want%20to%20ask%20about%20therapy" aria-label="Ask on WhatsApp"><MessageCircle /></a></Button></div></div>
    <BookingFormModal isOpen={isBookingFormOpen} onClose={resetFlow} formType={actionType} />
  </div>;
}
