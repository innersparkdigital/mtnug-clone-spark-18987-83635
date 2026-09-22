import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Lock, Smartphone, Clock, Heart, Users, Building2,
  User as UserIcon, MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KenyaHeroVideo from "@/components/KenyaHeroVideo";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialistImage } from "@/lib/specialistImages";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import BookingFormModal from "@/components/BookingFormModal";
import type { MarketLanding } from "@/data/marketLandings";

const SPARK_BLUE = "#3B4FD4";
const WARMTH = "#F2994A";
const DEEP_NIGHT = "#1A1A2E";
const HEALING_GREEN = "#2E7D5E";

type Therapist = {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  available_options: string[];
  image_url: string | null;
};

export default function MarketLandingPage({ market: m }: { market: MarketLanding }) {
  const { startBooking, closeFlow, isBookingFormOpen, actionType } = useBookingFlow();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const bookPath = `/book-therapist?market=${m.slug}`;
  const checkPath = "/wellbeing-check";
  const specialistsPath = `/specialists?market=${m.slug}`;
  const url = `https://www.innersparkafrica.com/${m.slug}`;
  const waHref = `https://wa.me/256792085773?text=${encodeURIComponent(m.whatsappPrefill)}`;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("specialists")
        .select("id,name,specialties,languages,available_options,image_url")
        .eq("is_active", true)
        .limit(3);
      setTherapists((data || []) as Therapist[]);
    })();
  }, [m.slug]);

  const trustPills = [
    { icon: ShieldCheck, label: "Licensed therapists", color: HEALING_GREEN },
    { icon: Lock, label: "Completely private", color: SPARK_BLUE },
    { icon: Smartphone, label: m.trustPayment, color: WARMTH },
    { icon: Clock, label: "Book in 2 minutes", color: SPARK_BLUE },
  ];

  const stepColors = [SPARK_BLUE, HEALING_GREEN, WARMTH];

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Helmet>
        <title>{m.title}</title>
        <meta name="description" content={m.description} />
        <link rel="canonical" href={`${url}/`} />
        <meta property="og:title" content={m.title} />
        <meta property="og:description" content={m.description} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: `InnerSpark Africa — ${m.countryLabel}`,
          url,
          priceRange: `${m.chatPrice} - ${m.monthlyPrice}`,
          telephone: "+256792085773",
          medicalSpecialty: ["Psychotherapy", "Counseling", "MentalHealth"],
          areaServed: [
            { "@type": "Country", name: m.countryLabel },
            ...m.schemaCities.map((name) => ({ "@type": "City", name })),
          ],
          paymentAccepted: m.paymentAccepted,
          currenciesAccepted: m.currency,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: m.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </Helmet>

      <Header />

      {/* 1. ATTENTION — hero + video (Kenya layout) */}
      <section style={{ background: SPARK_BLUE }} className="text-white">
        <div className="container mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span
              className="inline-block mb-4 px-2.5 py-0.5 rounded-xl text-[11px] font-medium"
              style={{ background: "#EEF0FD", color: "#0C447C", border: "0.5px solid #C5CAF5" }}
            >
              {m.countryLabel}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              {m.h1}
              <br />
              {m.h1Line2}
            </h1>
            <p className="mt-5 text-base" style={{ color: "#C5CAF5" }}>
              {m.introLine1}
              <br />
              {m.introLine2}
            </p>
            <p className="mt-3 text-sm" style={{ color: "#A8B0E8" }}>
              Serving {m.citiesLine}.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={startBooking}
                className="inline-flex items-center justify-center font-medium text-white rounded-lg px-6 py-3 text-[15px]"
                style={{ background: WARMTH }}
              >
                Book a session
              </button>
              <Link
                to={checkPath}
                className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-[15px] text-white border-[1.5px]"
                style={{ borderColor: "rgba(255,255,255,0.5)" }}
              >
                Try free wellbeing check
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]" style={{ background: "#2A3AAF" }}>
              <KenyaHeroVideo />
            </div>
          </div>
        </div>
      </section>

      <div style={{ background: WARMTH, height: 4 }} />

      <section className="bg-white" style={{ borderBottom: "0.5px solid #DDDDEE" }}>
        <div className="container mx-auto px-4 py-3.5 flex flex-wrap justify-center gap-y-2">
          {trustPills.map(({ icon: Icon, label, color }) => (
            <div key={label} className="inline-flex items-center gap-1.5 px-5 text-[13px]" style={{ color: "#555555" }}>
              <Icon className="w-4 h-4" style={{ color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INTEREST */}
      <section style={{ background: "#F5F6FF" }} className="py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-[26px] font-semibold leading-snug" style={{ color: DEEP_NIGHT }}>
            {m.problemHeadline}
          </h2>
          <p className="text-xs italic mt-2" style={{ color: "#888" }}>
            {m.problemSource}
          </p>
          <div className="text-[15px] mt-6 leading-[1.8] text-left sm:text-center" style={{ color: "#555" }}>
            <p>{m.problemBody[0]}</p>
            <p className="mt-4">{m.problemBody[1]}</p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>
            {m.howHeadline}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {m.howSteps.map((title, i) => (
              <div key={title} className="text-center px-2">
                <div
                  className="w-16 h-16 rounded-full mx-auto text-white text-2xl font-bold flex items-center justify-center"
                  style={{ background: stepColors[i] }}
                >
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold mt-4" style={{ color: DEEP_NIGHT }}>
                  {title}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#555" }}>
                  {m.howBodies[i]}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to={bookPath}
              className="inline-flex font-medium text-white rounded-lg px-7 py-3 text-[15px]"
              style={{ background: SPARK_BLUE }}
            >
              Start now — it takes 2 minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>
            Everything you need for your mental wellbeing — in one place.
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: UserIcon,
                color: SPARK_BLUE,
                title: "Individual therapy",
                body: `1-on-1 sessions with a licensed therapist via video. From ${m.videoPrice} per session.`,
                cta: "Book a session →",
                to: bookPath,
              },
              {
                icon: Heart,
                color: HEALING_GREEN,
                title: "Free wellbeing check",
                body: "Take the short WHO-5 screening. Free, private, instant. Then book paid care if you are ready.",
                cta: "Take the free check →",
                to: checkPath,
                badge: "FREE",
              },
              {
                icon: Users,
                color: SPARK_BLUE,
                title: "Support groups",
                body: "Facilitated peer groups online. Useful alongside individual therapy.",
                cta: "See all groups →",
                to: "/support-groups",
              },
              {
                icon: Building2,
                color: DEEP_NIGHT,
                title: "Corporate wellness",
                body: "Employee screening and EAP-style support for organisations.",
                cta: "Request a pilot →",
                to: "mailto:info@innersparkafrica.com",
                external: true,
              },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
                <div className="flex items-start justify-between">
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                  {"badge" in s && s.badge ? (
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#EAF3DE", color: HEALING_GREEN }}
                    >
                      {s.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display font-semibold text-lg mt-3" style={{ color: DEEP_NIGHT }}>
                  {s.title}
                </h3>
                <p className="text-sm mt-2 mb-4 leading-relaxed" style={{ color: "#555" }}>
                  {s.body}
                </p>
                {"external" in s && s.external ? (
                  <a href={s.to} className="text-sm font-medium" style={{ color: SPARK_BLUE }}>
                    {s.cta}
                  </a>
                ) : (
                  <Link to={s.to} className="text-sm font-medium" style={{ color: SPARK_BLUE }}>
                    {s.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center" style={{ color: DEEP_NIGHT }}>
            Licensed therapists. African context. Your language.
          </h2>
          <p className="text-[15px] text-center max-w-2xl mx-auto mt-3" style={{ color: "#555" }}>
            Every InnerSpark therapist is licensed and experienced with African realities — work pressure, family
            expectations, faith, migration and grief.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mt-10 max-w-5xl mx-auto">
            {therapists.map((t) => {
              const img = getSpecialistImage(t.name, t.image_url);
              return (
                <div
                  key={t.id}
                  className="bg-white border rounded-2xl p-5 text-center"
                  style={{ borderColor: "#E6E8FA" }}
                >
                  <div className="w-[88px] h-[88px] mx-auto rounded-full overflow-hidden bg-gray-100">
                    {img ? (
                      <img src={img} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-lg font-semibold"
                        style={{ color: SPARK_BLUE, background: "#EEF0FD" }}
                      >
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-semibold mt-3" style={{ color: DEEP_NIGHT }}>
                    {t.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {(t.specialties || []).slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: "#EEF0FD", color: SPARK_BLUE }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: "#777" }}>
                    {(t.languages || []).join(" · ")}
                  </p>
                  <Link
                    to={`${bookPath}&therapist=${t.id}`}
                    className="block mt-4 text-sm font-medium"
                    style={{ color: SPARK_BLUE }}
                  >
                    Book with {t.name.split(" ")[0]} →
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to={specialistsPath} className="text-sm font-medium" style={{ color: SPARK_BLUE }}>
              See all therapists →
            </Link>
            <p className="text-xs mt-2" style={{ color: "#888" }}>
              All therapists are registered with recognised professional licensing bodies.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CLEAR OFFER */}
      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-2" style={{ color: DEEP_NIGHT }}>
            Clear professional pricing. No hidden fees.
          </h2>
          <p className="text-sm text-center mb-10" style={{ color: "#555" }}>
            All prices in {m.currency} · Pay by {m.paymentLabel} · Built for people ready to invest in care
          </p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border-[1.5px]" style={{ borderColor: SPARK_BLUE }}>
              <p className="text-sm text-gray-500">Single video session</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>
                {m.videoPrice}
              </p>
              <p className="text-xs text-gray-500">{m.ugxNote}</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: SPARK_BLUE }}>
                Per session
              </p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ Video call via WhatsApp</li>
                <li>✓ Licensed African therapist</li>
                <li>✓ About 50-minute session</li>
                <li>✓ Pay as you go — no subscription required</li>
              </ul>
              <button
                type="button"
                onClick={startBooking}
                className="block w-full text-center mt-5 font-medium text-white rounded-lg py-2.5"
                style={{ background: SPARK_BLUE }}
              >
                Book now →
              </button>
              <p className="text-[11px] text-center mt-2 text-gray-500">Pay by {m.paymentLabel}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
              <span
                className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                style={{ background: WARMTH, color: "white" }}
              >
                Best for real progress
              </span>
              <p className="text-sm text-gray-500">Monthly support</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>
                {m.monthlyPrice}
              </p>
              <p className="text-xs text-gray-500">{m.monthlyNote}</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: SPARK_BLUE }}>
                4 sessions / month
              </p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ 4 video sessions per month</li>
                <li>✓ Same therapist when available</li>
                <li>✓ Weekly rhythm for lasting change</li>
                <li>✓ For professionals ready to commit</li>
              </ul>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-5 font-medium text-white rounded-lg py-2.5"
                style={{ background: SPARK_BLUE }}
              >
                Get started on WhatsApp →
              </a>
              <p className="text-[11px] text-center mt-2 text-gray-500">We confirm package pricing with you</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
              <span
                className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                style={{ background: "#EAF3DE", color: HEALING_GREEN }}
              >
                Paid chat option
              </span>
              <p className="text-sm text-gray-500">Chat therapy</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>
                {m.chatPrice}
              </p>
              <p className="text-xs text-gray-500">Lower-cost paid entry · still licensed care</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: HEALING_GREEN }}>
                Written support
              </p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ Private written sessions</li>
                <li>✓ Licensed African therapist</li>
                <li>✓ Good first paid step</li>
                <li>✓ Upgrade to video anytime</li>
              </ul>
              <button
                type="button"
                onClick={startBooking}
                className="block w-full text-center mt-5 font-medium rounded-lg py-2.5 border"
                style={{ borderColor: HEALING_GREEN, color: HEALING_GREEN }}
              >
                Book chat therapy →
              </button>
              <p className="text-[11px] text-center mt-2 text-gray-500">Not a free chatbot</p>
            </div>
          </div>

          <div
            className="max-w-3xl mx-auto mt-8 p-5 rounded-lg"
            style={{ background: "#EEF0FD", borderLeft: `4px solid ${SPARK_BLUE}` }}
          >
            <h3 className="font-display font-semibold text-lg mb-3" style={{ color: DEEP_NIGHT }}>
              {m.paymentHowTitle}
            </h3>
            <ol className="space-y-1.5 text-sm" style={{ color: "#333" }}>
              {m.paymentHowSteps.map((step, i) => (
                <li key={step}>
                  {i + 1}. {step}
                </li>
              ))}
            </ol>
            <p className="text-sm mt-4 italic" style={{ color: "#555" }}>
              {m.paymentTip}
            </p>
          </div>
          <p className="text-sm italic text-center mt-6 max-w-2xl mx-auto" style={{ color: "#555" }}>
            {m.offerCompare}
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-[26px] font-semibold text-center" style={{ color: DEEP_NIGHT }}>
            Useful starting points — not vague wellness talk
          </h2>
          <p className="text-sm text-center mt-3 mb-8" style={{ color: "#555" }}>
            You do not need a perfect diagnosis. You need a licensed therapist and a clear booking path.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {m.concerns.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
                style={{ borderColor: "#E6E8FA", color: DEEP_NIGHT }}
              >
                <span style={{ color: HEALING_GREEN }}>✓</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>
            What people say after they actually book.
          </h2>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {m.testimonials.map((t) => (
              <div key={t.who} className="rounded-2xl p-6 border bg-white" style={{ borderColor: "#E6E8FA" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "#444" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs mt-4 font-medium" style={{ color: DEEP_NIGHT }}>
                  — {t.who}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: WARMTH, height: 4 }} />
      <section id="cities" className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-[26px] font-semibold text-center" style={{ color: DEEP_NIGHT }}>
            Online therapy across {m.countryLabel}
          </h2>
          <p className="text-[15px] text-center max-w-2xl mx-auto mt-3" style={{ color: "#555" }}>
            Wherever you are, your next paid session is one booking away.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {m.cities.map((c) => (
              <div key={c.id} className="bg-white border rounded-2xl p-5" style={{ borderColor: "#E6E8FA" }}>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SPARK_BLUE }}>
                  {c.kw}
                </p>
                <h3 className="font-display font-semibold text-lg mt-1" style={{ color: DEEP_NIGHT }}>
                  Therapy in {c.city}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#555" }}>
                  {c.body}
                </p>
                <Link
                  to={`${bookPath}&city=${c.id}`}
                  className="inline-block text-sm font-medium mt-3"
                  style={{ color: SPARK_BLUE }}
                >
                  Book a session in {c.city} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOLLOW-UP + 5. EXPERIENCE */}
      <div style={{ background: WARMTH, height: 4 }} />
      <section style={{ background: DEEP_NIGHT }} className="py-20 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
            You already know free tips are not enough.
            <br />
            Book the session.
          </h2>
          <p className="text-[15px] mt-5" style={{ color: "#C5CAF5" }}>
            Getting started takes less than 2 minutes. Choose a therapist, pick a time, pay by {m.paymentLabel}. If you
            stall after paying, WhatsApp us — we follow up so good intent does not go cold.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={bookPath}
              className="inline-flex items-center justify-center font-medium text-white rounded-lg px-7 py-3.5"
              style={{ background: WARMTH }}
            >
              {m.finalCta}
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-medium rounded-lg px-7 py-3.5 text-white border-[1.5px] gap-2"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            >
              <MessageCircle className="w-4 h-4" /> Follow up on WhatsApp
            </a>
          </div>
          <p className="text-xs mt-5" style={{ color: "#888" }}>
            Your privacy is protected. Your employer will never know. You can ask questions before you pay.
          </p>
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-6" style={{ color: DEEP_NIGHT }}>
            Stay engaged: useful reads before you book
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {m.related.map((r) => (
              <Link key={r.to} to={r.to} className="block rounded-xl border p-5 hover:shadow-md transition-shadow">
                <span className="text-xs font-medium" style={{ color: SPARK_BLUE }}>
                  {r.tag}
                </span>
                <h3 className="font-semibold mt-1 mb-1" style={{ color: DEEP_NIGHT }}>
                  {r.label}
                </h3>
                <p className="text-sm text-muted-foreground">{r.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-[26px] font-semibold text-center mb-8" style={{ color: DEEP_NIGHT }}>
            Questions from {m.countryLabel}
          </h2>
          <div className="space-y-4">
            {m.faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E6E8FA" }}>
                <h3 className="font-semibold" style={{ color: DEEP_NIGHT }}>
                  {f.q}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#555" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: WARMTH, height: 4 }} />

      <section className="bg-secondary py-8 text-sm" style={{ color: "#555" }}>
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>
              Serving Africa & diaspora
            </h4>
            <Link to="/" className="hover:underline mr-3">Uganda</Link>
            <Link to="/kenya" className="hover:underline mr-3">Kenya</Link>
            <Link to="/nigeria" className="hover:underline mr-3">Nigeria</Link>
            <Link to="/tanzania" className="hover:underline mr-3">Tanzania</Link>
            <Link to="/ghana" className="hover:underline mr-3">Ghana</Link>
            <Link to="/gambia" className="hover:underline mr-3">Gambia</Link>
            <Link to="/usa" className="hover:underline">USA</Link>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>
              {m.countryLabel} clients
            </h4>
            <p>
              WhatsApp{" "}
              <a className="font-medium" style={{ color: SPARK_BLUE }} href={waHref}>
                +256 792 085 773
              </a>
            </p>
            <p>
              <a className="font-medium" style={{ color: SPARK_BLUE }} href="mailto:info@innersparkafrica.com">
                info@innersparkafrica.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>
              {m.countryLabel} payment
            </h4>
            <p className="text-xs">
              Video {m.videoPrice} · Chat {m.chatPrice} · {m.paymentLabel}. We follow up on WhatsApp after every serious
              booking request.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startBooking}
            className="flex-1 font-medium text-white rounded-lg py-3 text-sm"
            style={{ background: WARMTH }}
          >
            Book — {m.videoPrice}
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border px-4"
            style={{ borderColor: SPARK_BLUE, color: SPARK_BLUE }}
            aria-label="WhatsApp follow-up"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>

      <BookingFormModal isOpen={isBookingFormOpen} onClose={closeFlow} formType={actionType} />
    </div>
  );
}
