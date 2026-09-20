import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, CreditCard, Smartphone, HeartHandshake } from "lucide-react";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import BookingFormModal from "@/components/BookingFormModal";

type Market = { country: string; code: string; currency: string; video: string; chat: string; cities: string; pain: string; context: string; payment: string };
const MARKETS: Record<string, Market> = {
  tanzania: { country: "Tanzania", code: "TZ", currency: "TZS", video: "about TZS 52,000", chat: "about TZS 21,000", cities: "Dar es Salaam, Arusha, Mwanza and across Tanzania", pain: "Long journeys, limited local choice and concern about being recognised at a clinic can make support difficult to begin.", context: "work pressure, family expectations, relationships, grief and student stress in East African life", payment: "Visa card" },
  nigeria: { country: "Nigeria", code: "NG", currency: "NGN", video: "about NGN 27,500", chat: "about NGN 11,000", cities: "Lagos, Abuja, Port Harcourt and across Nigeria", pain: "Traffic, high private-clinic fees and uncertainty about who is properly qualified can delay getting help.", context: "career pressure, relationships, family expectations, relocation and burnout", payment: "Visa card" },
  ghana: { country: "Ghana", code: "GH", currency: "GHS", video: "about GHS 235", chat: "about GHS 95", cities: "Accra, Kumasi, Takoradi and across Ghana", pain: "Finding private, culturally relevant support outside major cities can take time and feel exposed.", context: "work, study, relationships, grief, faith and family life", payment: "Visa card" },
  gambia: { country: "The Gambia", code: "GM", currency: "GMD", video: "charged as UGX 75,000", chat: "charged as UGX 30,000", cities: "Banjul, Kanifing, Brikama and across The Gambia", pain: "A small local provider network can make privacy and therapist choice especially difficult.", context: "family, work, migration, grief and relationship pressures", payment: "Visa card, converted by your bank into dalasi" },
  usa: { country: "the United States", code: "US", currency: "USD", video: "about USD 21", chat: "about USD 8", cities: "all US states where cross-border online support is appropriate", pain: "African immigrants and students may want someone who understands culture, family obligations and life between two worlds.", context: "diaspora identity, adjustment, relationships, grief, family expectations and work stress", payment: "Visa card" },
};

export default function LocalizedTherapy() {
  const { market = "" } = useParams();
  const m = MARKETS[market];
  const { startBooking, closeFlow, isBookingFormOpen, actionType } = useBookingFlow();
  if (!m) return <Navigate to="/" replace />;
  const url = `https://www.innersparkafrica.com/${market}`;
  return <div className="min-h-screen bg-[#F7F3EA]">
    <Helmet>
      <title>Online Therapy in {m.country} | InnerSpark Africa</title>
      <meta name="description" content={`Confidential online therapy in ${m.country} with licensed African therapists. Video ${m.video}; chat ${m.chat}. Pay by ${m.payment}.`} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={`Online Therapy in ${m.country} | InnerSpark Africa`} />
      <meta property="og:description" content={`Licensed African therapists who understand local and diaspora context. Video and chat sessions available.`} />
      <meta property="og:url" content={url} />
      <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org", "@type":"Service", name:`Online therapy in ${m.country}`, url, areaServed:{"@type":"Country",name:m.country}, provider:{"@type":"MedicalOrganization","@id":"https://www.innersparkafrica.com/#organization",name:"InnerSpark Africa"}, serviceType:["Online therapy","Video therapy","Chat therapy"] })}</script>
    </Helmet>
    <Header />
    <main>
      <section className="bg-[#0F172A] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-[#F59E0B] font-semibold mb-3">{m.country}</p>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl">Talk to an African therapist who understands your world.</h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl">Private online therapy from {m.cities}. Video therapy is {m.video}; chat therapy is {m.chat}.</p>
          <div className="flex flex-wrap gap-3 mt-8"><Button onClick={startBooking} className="bg-[#F59E0B] text-[#111827] hover:bg-[#F59E0B]/90">Book a therapist</Button><Button asChild variant="outline" className="border-white text-white bg-transparent"><Link to="/wellbeing-check">Take the free wellbeing check</Link></Button></div>
          <p className="text-xs text-white/60 mt-4">Local prices are estimates based on UGX 75,000 video and UGX 30,000 chat. Your card provider confirms the final conversion.</p>
        </div>
      </section>
      <section className="py-14"><div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8 items-start"><div><h2 className="text-3xl font-semibold text-[#111827]">Why online support can feel easier</h2><p className="mt-4 text-[#4B5563] leading-relaxed">{m.pain}</p><p className="mt-4 text-[#4B5563] leading-relaxed">InnerSpark connects you with licensed African therapists familiar with {m.context}. You can speak from a private place without travelling to a waiting room.</p></div><div className="grid gap-3">{[[ShieldCheck,"Licensed therapists","Review specialties, language and availability before booking."],[Smartphone,"Video or chat","Choose face-to-face video or lower-cost written chat."],[CreditCard,"Clear payment","Pay by " + m.payment + "."],[HeartHandshake,"Confidential support","Begin without shame, pressure or a promise of a cure."]].map(([Icon,title,text]: any)=><Card key={title}><CardContent className="p-5 flex gap-3"><Icon className="h-5 w-5 text-[#4A90A4] mt-0.5"/><div><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground mt-1">{text}</p></div></CardContent></Card>)}</div></div></section>
      <section className="py-14 bg-white"><div className="container mx-auto px-4 max-w-5xl"><h2 className="text-3xl font-semibold">Start in three practical steps</h2><div className="grid md:grid-cols-3 gap-5 mt-8">{[["1","Choose a therapist","Compare real profiles by concern, language and style."],["2","Choose video or chat",`Video: ${m.video}. Chat: ${m.chat}.`],["3","Confirm on WhatsApp","InnerSpark confirms payment and your session time directly."]].map(([n,t,b])=><div key={n} className="rounded-2xl border p-6"><span className="text-[#F59E0B] font-bold">{n}</span><h3 className="font-semibold text-lg mt-2">{t}</h3><p className="text-sm text-muted-foreground mt-2">{b}</p></div>)}</div><Button onClick={startBooking} className="mt-8">Choose a therapist</Button></div></section>
    </main>
    <Footer />
    <BookingFormModal open={isBookingFormOpen} onClose={closeFlow} actionType={actionType} />
  </div>;
}
