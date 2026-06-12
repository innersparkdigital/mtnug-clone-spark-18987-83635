import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldCheck, Lock, Smartphone, Clock, Heart, Users, Building2, User as UserIcon, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KenyaHeroVideo from "@/components/KenyaHeroVideo";
import { supabase } from "@/integrations/supabase/client";
import { getReferralCookie } from "@/lib/referralCookie";
import { getSpecialistImage } from "@/lib/specialistImages";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import BookingFormModal from "@/components/BookingFormModal";

const SPARK_BLUE = "#3B4FD4";
const WARMTH = "#F2994A";
const DEEP_NIGHT = "#1A1A2E";
const HEALING_GREEN = "#2E7D5E";
const BASE_KES = 2600;

type ReferralBannerData = {
  referrer_name: string;
  custom_message: string | null;
  discount_amount_kes: number;
};

type Therapist = {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  available_options: string[];
  image_url: string | null;
};

type Testimonial = {
  id: string;
  client_display_name: string | null;
  star_rating: number;
  open_comment: string | null;
};

export default function Kenya() {
  const [referral, setReferral] = useState<ReferralBannerData | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams] = useSearchParams();
  const visitTracked = useRef(false);
  const { startBooking, closeFlow, isBookingFormOpen, actionType } = useBookingFlow();

  // Track this Kenya page visit (admin analytics)
  useEffect(() => {
    if (visitTracked.current) return;
    visitTracked.current = true;

    const ua = navigator.userAgent;
    const device = /Mobi|Android/i.test(ua) ? "mobile" : /Tablet|iPad/i.test(ua) ? "tablet" : "desktop";
    const ref = document.referrer || "";
    const sourceParam = searchParams.get("source") || searchParams.get("utm_source");
    let source = "direct";
    if (sourceParam) source = sourceParam;
    else if (!ref) source = "direct";
    else if (/facebook|twitter|instagram|linkedin|tiktok/i.test(ref)) source = "social";
    else if (/innersparkafrica\.com/i.test(ref)) source = "internal";
    else if (/google\.|bing\.|yahoo\./i.test(ref)) source = "search";
    else if (/wa\.me|whatsapp/i.test(ref)) source = "whatsapp";
    else source = "referral";

    supabase.from("kenya_page_visits").insert({
      session_id: `kv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      source,
      device_type: device,
      user_agent: ua,
      referrer: ref || null,
      path: typeof window !== "undefined" ? window.location.pathname : "/kenya",
    } as any).then(() => {});
  }, [searchParams]);

  // Load referral banner from cookie
  useEffect(() => {
    const slug = getReferralCookie();
    if (!slug) return;
    (async () => {
      const { data } = await supabase.rpc("get_referral_link_by_slug", { _slug: slug });
      if (data && (data as any).is_active) setReferral(data as ReferralBannerData);
    })();
  }, []);

  // Load therapists (Kenya-tagged first, fallback to top 3)
  useEffect(() => {
    (async () => {
      let { data } = await supabase
        .from("specialists")
        .select("id,name,specialties,languages,available_options,image_url")
        .eq("is_active", true)
        .eq("kenya", true)
        .limit(3);
      if (!data || data.length === 0) {
        const fallback = await supabase
          .from("specialists")
          .select("id,name,specialties,languages,available_options,image_url")
          .eq("is_active", true)
          .limit(3);
        data = fallback.data || [];
      }
      setTherapists((data || []) as Therapist[]);
    })();
  }, []);

  // Load testimonials
  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("get_public_testimonials", { _market: "ke", _limit: 3 });
      setTestimonials((data || []) as Testimonial[]);
    })();
  }, []);

  const discount = referral?.discount_amount_kes || 0;
  const referredPrice = Math.max(BASE_KES - discount, 0);

  const trustPills = [
    { icon: ShieldCheck, label: "Licensed therapists", color: HEALING_GREEN },
    { icon: Lock, label: "Completely private", color: SPARK_BLUE },
    { icon: Smartphone, label: "M-Pesa accepted", color: WARMTH },
    { icon: Clock, label: "Book in 2 minutes", color: SPARK_BLUE },
  ];

  const placeholderTestimonials = [
    { quote: "I felt completely safe and heard. My therapist understood exactly what I was going through without me having to over-explain. The WhatsApp call was simple and the whole booking process took less than a week.", who: "Professional, Nairobi" },
    { quote: "I had been putting off getting help for two years. My first session changed how I think about therapy completely.", who: "Business owner, Mombasa" },
    { quote: "The M-Pesa payment was seamless. No accounts to create, no apps to download — just opened WhatsApp and my therapist was there.", who: "Teacher, Kisumu" },
  ];

  const renderTestimonials = testimonials.length >= 3
    ? testimonials.map((t) => ({ quote: t.open_comment || "", who: t.client_display_name || "InnerSpark client" }))
    : placeholderTestimonials;

  const seoKeywords = [
    "online therapy Kenya",
    "therapist Kenya",
    "mental health Kenya",
    "counselling Nairobi",
    "online counsellor Nairobi",
    "depression therapist Kenya",
    "anxiety counsellor Nairobi",
    "online psychologist Mombasa",
    "therapy Kisumu",
    "M-Pesa therapy",
    "Kiswahili therapy",
    "EAP Kenya",
    "stress counselling Kenya",
    "trauma therapist Nairobi",
    "African therapists online",
    "InnerSpark Africa Kenya",
  ].join(", ");

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Online Therapy in Kenya | African Therapists | InnerSpark Africa</title>
        <meta name="description" content="Online therapy in Kenya with licensed African therapists. WhatsApp video, voice or chat sessions from KES 2,600. Pay via M-Pesa. Book in 2 minutes — completely private." />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href="https://www.innersparkafrica.com/kenya" />
        <meta property="og:title" content="Online Therapy in Kenya | InnerSpark Africa" />
        <meta property="og:description" content="Licensed African therapists. WhatsApp & video sessions from KES 2,600. Pay via M-Pesa. Built for Nairobi, Mombasa, Kisumu and beyond." />
        <meta property="og:url" content="https://www.innersparkafrica.com/kenya" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "InnerSpark Africa — Kenya",
          url: "https://www.innersparkafrica.com/kenya",
          priceRange: "KES 2,600 - KES 9,600",
          telephone: "+256792085773",
          medicalSpecialty: ["Psychotherapy", "Counseling", "MentalHealth"],
          image: "https://www.innersparkafrica.com/og-image.jpg",
          areaServed: [
            { "@type": "Country", name: "Kenya" },
            { "@type": "City", name: "Nairobi" },
            { "@type": "City", name: "Mombasa" },
            { "@type": "City", name: "Kisumu" },
            { "@type": "City", name: "Nakuru" },
            { "@type": "City", name: "Eldoret" },
          ],
          address: { "@type": "PostalAddress", addressCountry: "KE" },
          availableLanguage: ["English", "Swahili"],
          paymentAccepted: ["M-Pesa", "Mobile Money"],
          currenciesAccepted: "KES",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Online Therapy Services in Kenya",
            itemListElement: [
              { "@type": "Offer", name: "Single online therapy session", price: "2600", priceCurrency: "KES", availability: "https://schema.org/InStock", url: "https://www.innersparkafrica.com/kenya" },
              { "@type": "Offer", name: "Monthly therapy package (4 sessions)", price: "9600", priceCurrency: "KES", availability: "https://schema.org/InStock", url: "https://www.innersparkafrica.com/kenya" },
              { "@type": "Offer", name: "Free WHO-5 wellbeing check", price: "0", priceCurrency: "KES", availability: "https://schema.org/InStock", url: "https://www.innersparkafrica.com/check/kenya" },
            ],
          },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.innersparkafrica.com/" },
            { "@type": "ListItem", position: 2, name: "Kenya", item: "https://www.innersparkafrica.com/kenya" },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "How much does therapy cost in Kenya?", acceptedAnswer: { "@type": "Answer", text: "On InnerSpark, individual online therapy sessions in Kenya start from KES 2,600. A monthly package of 4 sessions is KES 9,600 — less than most Nairobi in-clinic consultations. Pay via M-Pesa." } },
            { "@type": "Question", name: "Can I pay for therapy with M-Pesa?", acceptedAnswer: { "@type": "Answer", text: "Yes. Dial *840# → Send Money Abroad → Uganda → 0740 616 404 → Innerspark Recovery Ltd → enter the KES amount. M-Pesa converts automatically and your session is confirmed by WhatsApp." } },
            { "@type": "Question", name: "How do I find a therapist in Kenya?", acceptedAnswer: { "@type": "Answer", text: "Take our free WHO-5 wellbeing check, then we recommend a licensed African therapist matched to what you're working through. You can also browse our therapist directory and book directly. The whole booking takes about 2 minutes." } },
            { "@type": "Question", name: "Is online therapy effective in Kenya?", acceptedAnswer: { "@type": "Answer", text: "Yes. WHO and APA research shows online therapy is as effective as in-person sessions for anxiety, depression, burnout and relationship issues. InnerSpark sessions happen via WhatsApp video, voice or chat — whichever feels safest for you." } },
            { "@type": "Question", name: "Is therapy private in Kenya — will my employer find out?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely private. Sessions are one-to-one with your therapist, never shared with employers, family or insurers. You can pay with personal M-Pesa and use the InnerSpark app without anyone in your circle knowing." } },
            { "@type": "Question", name: "Do you offer therapy via WhatsApp in Kenya?", acceptedAnswer: { "@type": "Answer", text: "Yes. Most of our Kenyan clients use WhatsApp video, voice or chat for sessions — the same app you use every day, with no new downloads. Bandwidth-friendly for Nairobi, Mombasa, Kisumu, Nakuru and rural Kenya." } },
            { "@type": "Question", name: "Do you have African therapists who understand Kenyan culture?", acceptedAnswer: { "@type": "Answer", text: "Yes. Our therapists are East African, licensed, and trained to work with the realities of Nairobi professional life, family expectations, religious context and stigma around mental health in Kenya." } },
            { "@type": "Question", name: "Do you offer corporate mental health programmes for Kenyan companies?", acceptedAnswer: { "@type": "Answer", text: "Yes. InnerSpark offers Employee Assistance Programmes (EAP), free WHO-5 team screenings and aggregated wellbeing reports for Kenyan organisations. HR managers can request a proposal from the contact page." } },
          ],
        })}</script>
      </Helmet>

      <Header />

      {/* HERO */}
      <section style={{ background: SPARK_BLUE }} className="text-white">
        <div className="container mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block mb-4 px-2.5 py-0.5 rounded-xl text-[11px] font-medium" style={{ background: "#EEF0FD", color: "#0C447C", border: "0.5px solid #C5CAF5" }}>Kenya</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              Therapy that understands your world.<br />
              From wherever you are in Kenya.
            </h1>
            <p className="mt-5 text-base" style={{ color: "#C5CAF5" }}>
              Licensed African therapists. Video sessions.<br />
              From KES 2,600 · Pay via M-Pesa · Book in 2 minutes.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={startBooking} className="inline-flex items-center justify-center font-medium text-white rounded-lg px-6 py-3 text-[15px]" style={{ background: WARMTH }}>
                Book a session
              </button>
              <Link to="/check/kenya" className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-[15px] text-white border-[1.5px]" style={{ borderColor: "rgba(255,255,255,0.5)" }}>
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

      {/* WARMTH STRIPE */}
      <div style={{ background: WARMTH, height: 4 }} />

      {/* TRUST STRIP */}
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

      {/* REFERRAL BANNER */}
      {referral && !bannerDismissed && (
        <div className="px-5 py-2.5 flex items-center justify-between gap-3" style={{ background: "#E1F5EE", borderLeft: `4px solid ${HEALING_GREEN}` }}>
          <p className="text-[13px]" style={{ color: "#085041" }}>
            {referral.custom_message
              ? referral.custom_message
              : <>
                  Welcome! <strong>{referral.referrer_name}</strong> shared InnerSpark with you. 💙
                  {discount > 0 ? <> Your first session is <strong>KES {referredPrice.toLocaleString()}</strong> (KES {discount.toLocaleString()} off).</> : null}
                </>
            }
          </p>
          <button onClick={() => setBannerDismissed(true)} aria-label="Dismiss" className="text-[#085041]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PROBLEM */}
      <section style={{ background: "#F5F6FF" }} className="py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-[26px] font-semibold leading-snug" style={{ color: DEEP_NIGHT }}>
            1 in 4 Kenyans experience a mental health condition in their lifetime. Most never get help.
          </h2>
          <p className="text-xs italic mt-2" style={{ color: "#888" }}>Kenya Mental Health Policy (2015–2030)</p>
          <div className="text-[15px] mt-6 leading-[1.8]" style={{ color: "#555" }}>
            <p>
              The reasons are familiar. Therapy feels too expensive. Finding a therapist takes too long. You don't want anyone at work to find out. You're not even sure if what you're feeling is serious enough to get help.
            </p>
            <p className="mt-4">
              InnerSpark was built to remove every one of those barriers.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>
            From Nairobi to Mombasa — therapy from your phone in 3 steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: 1, color: SPARK_BLUE, title: "Choose your therapist", body: "Browse licensed African therapists. Filter by specialisation, gender, and language. Read their background and choose who feels right for you." },
              { n: 2, color: HEALING_GREEN, title: "Book and pay via M-Pesa", body: "Pick your preferred day and time. Pay via M-Pesa (*840# → Send Money Abroad → Uganda → 0740 616 404). Done in under 2 minutes — no bank card needed." },
              { n: 3, color: WARMTH, title: "Connect on WhatsApp", body: "Your therapist sends you a WhatsApp video or voice link. No app to download. No complicated software. Just open WhatsApp and join — from wherever you are in Kenya." },
            ].map((s) => (
              <div key={s.n} className="text-center px-2">
                <div className="w-16 h-16 rounded-full mx-auto text-white text-2xl font-bold flex items-center justify-center" style={{ background: s.color }}>{s.n}</div>
                <h3 className="font-display text-lg font-semibold mt-4" style={{ color: DEEP_NIGHT }}>{s.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#555" }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/book-therapist?market=kenya" className="inline-flex font-medium text-white rounded-lg px-7 py-3 text-[15px]" style={{ background: SPARK_BLUE }}>
              Start now — it takes 2 minutes →
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES 2x2 */}
      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>
            Everything you need for your mental wellbeing — in one place.
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              { icon: UserIcon, color: SPARK_BLUE, title: "Individual therapy", body: "1-on-1 sessions with a licensed therapist via video. From KES 2,600 per session.", cta: "Book a session →", to: "/book-therapist?market=kenya" },
              { icon: Heart, color: HEALING_GREEN, title: "Free wellbeing check", body: "Take the 3-minute WHO-5 mental health screening. Free, private, instant results. No account needed.", cta: "Take the free check →", to: "/check/kenya", badge: "FREE" },
              { icon: Users, color: SPARK_BLUE, title: "Support groups", body: "Facilitated peer groups for anxiety, burnout, grief, relationships and more. Virtual. Join from anywhere in Kenya.", cta: "See all groups →", to: "/support-groups" },
              { icon: Building2, color: DEEP_NIGHT, title: "Corporate wellness", body: "Employee wellbeing screening and EAP programmes for Kenyan organisations. Free pilot available.", cta: "Request a pilot →", to: "mailto:info@innersparkafrica.com", external: true },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
                <div className="flex items-start justify-between">
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                  {s.badge && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EAF3DE", color: HEALING_GREEN }}>{s.badge}</span>}
                </div>
                <h3 className="font-display font-semibold text-lg mt-3" style={{ color: DEEP_NIGHT }}>{s.title}</h3>
                <p className="text-sm mt-2 mb-4 leading-relaxed" style={{ color: "#555" }}>{s.body}</p>
                {s.external ? (
                  <a href={s.to} className="text-sm font-medium" style={{ color: SPARK_BLUE }}>{s.cta}</a>
                ) : (
                  <Link to={s.to} className="text-sm font-medium" style={{ color: SPARK_BLUE }}>{s.cta}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THERAPIST PREVIEW */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center" style={{ color: DEEP_NIGHT }}>
            Licensed therapists. African context. Your language.
          </h2>
          <p className="text-[15px] text-center max-w-2xl mx-auto mt-3" style={{ color: "#555" }}>
            Every InnerSpark therapist is licensed, verified, and experienced in East African realities — the pressures of professional life in Nairobi, family expectations, career stress, and grief. You won't have to over-explain your context. They already understand it.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mt-10 max-w-5xl mx-auto">
            {therapists.map((t) => (
              <div key={t.id} className="bg-white border rounded-2xl p-5 text-center" style={{ borderColor: "#E6E8FA" }}>
                <div className="w-[88px] h-[88px] mx-auto rounded-full overflow-hidden bg-gray-100">
                  {(() => {
                    const img = getSpecialistImage(t.name, t.image_url);
                    return img ? (
                      <img src={img} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-semibold" style={{ color: SPARK_BLUE, background: "#EEF0FD" }}>
                        {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    );
                  })()}
                </div>
                <h3 className="font-display font-semibold mt-3" style={{ color: DEEP_NIGHT }}>{t.name}</h3>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {(t.specialties || []).slice(0, 3).map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#EEF0FD", color: SPARK_BLUE }}>{s}</span>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: "#777" }}>{(t.languages || []).join(" · ")}</p>
                <p className="text-xs mt-1" style={{ color: "#999" }}>{(t.available_options || []).join(" · ")}</p>
                <Link to={`/book-therapist?therapist=${t.id}&market=kenya`} className="block mt-4 text-sm font-medium" style={{ color: SPARK_BLUE }}>
                  Book with {t.name.split(" ")[0]} →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/specialists?market=kenya" className="text-sm font-medium" style={{ color: SPARK_BLUE }}>See all therapists →</Link>
            <p className="text-xs mt-2" style={{ color: "#888" }}>All therapists are registered with recognised professional licensing bodies.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-14" style={{ background: "#F5F6FF" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-2" style={{ color: DEEP_NIGHT }}>Affordable therapy. No hidden fees.</h2>
          <p className="text-sm text-center mb-10" style={{ color: "#555" }}>
            All prices in Kenyan Shillings · Pay via M-Pesa · No bank card needed
          </p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Single session - featured */}
            <div className="bg-white rounded-2xl p-6 border-[1.5px]" style={{ borderColor: SPARK_BLUE }}>
              <p className="text-sm text-gray-500">Single session</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>KES 2,600</p>
              <p className="text-xs text-gray-500">~UGX 75,000 · ~$22</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: SPARK_BLUE }}>Per session</p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ Video call via WhatsApp</li>
                <li>✓ Licensed African therapist</li>
                <li>✓ 50-minute session</li>
                <li>✓ Pay as you go — no subscription</li>
              </ul>
              <button type="button" onClick={startBooking} className="block w-full text-center mt-5 font-medium text-white rounded-lg py-2.5" style={{ background: SPARK_BLUE }}>Book now →</button>
              <p className="text-[11px] text-center mt-2 text-gray-500">Pay via M-Pesa · *840#</p>
            </div>
            {/* Monthly */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2" style={{ background: WARMTH, color: "white" }}>Most popular · save KES 800</span>
              <p className="text-sm text-gray-500">Monthly support</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>KES 9,600</p>
              <p className="text-xs text-gray-500"><span className="line-through">KES 10,400</span> You save KES 800</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: SPARK_BLUE }}>4 sessions / month · KES 2,400 each</p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ 4 video sessions per month</li>
                <li>✓ Same therapist every week</li>
                <li>✓ Weekly sessions for real progress</li>
                <li>✓ Best for ongoing support</li>
              </ul>
              <a href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20book%20a%20video%20call%20session%20with%20a%20therapist" target="_blank" rel="noopener noreferrer" className="block text-center mt-5 font-medium text-white rounded-lg py-2.5" style={{ background: SPARK_BLUE }}>Get started →</a>
              <p className="text-[11px] text-center mt-2 text-gray-500">Pay via M-Pesa · *840#</p>
            </div>
            {/* Free check */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA" }}>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2" style={{ background: "#EAF3DE", color: HEALING_GREEN }}>Always free</span>
              <p className="text-sm text-gray-500">Wellbeing check</p>
              <p className="text-3xl font-bold mt-1" style={{ color: DEEP_NIGHT }}>KES 0</p>
              <p className="text-xs text-gray-500">No payment required</p>
              <p className="text-xs font-medium mt-2 uppercase tracking-wide" style={{ color: HEALING_GREEN }}>Free WHO-5 screening</p>
              <ul className="text-sm mt-4 space-y-1.5" style={{ color: "#555" }}>
                <li>✓ 3-minute digital assessment</li>
                <li>✓ Instant private results</li>
                <li>✓ No account needed</li>
                <li>✓ WHO-validated wellbeing score</li>
              </ul>
              <Link to="/check/kenya" className="block text-center mt-5 font-medium rounded-lg py-2.5 border" style={{ borderColor: HEALING_GREEN, color: HEALING_GREEN }}>Take the check →</Link>
              <p className="text-[11px] text-center mt-2 text-gray-500">No M-Pesa needed · Instant</p>
            </div>
          </div>

          {/* M-Pesa instructions box */}
          <div className="max-w-3xl mx-auto mt-8 p-5 rounded-lg" style={{ background: "#EEF0FD", borderLeft: `4px solid ${SPARK_BLUE}` }}>
            <h3 className="font-display font-semibold text-lg mb-3" style={{ color: DEEP_NIGHT }}>How to pay via M-Pesa</h3>
            <ol className="space-y-1.5 text-sm" style={{ color: "#333" }}>
              <li>1. Dial <strong>*840#</strong> on your phone</li>
              <li>2. Select <strong>Send Money Abroad</strong></li>
              <li>3. Select country — <strong>Uganda</strong></li>
              <li>4. Enter number — <strong>0740 616 404</strong></li>
              <li>5. Account name — <strong>Innerspark Recovery Ltd</strong></li>
              <li>6. Amount — enter the KES equivalent (M-Pesa converts automatically)</li>
            </ol>
            <p className="text-sm mt-4 italic" style={{ color: "#555" }}>
              💡 Screenshot your M-Pesa confirmation and send it to us on WhatsApp to confirm your booking.
            </p>
          </div>
          <p className="text-sm italic text-center mt-6 max-w-2xl mx-auto" style={{ color: "#555" }}>
            A single session costs less than a consultation at a Nairobi private clinic — and you can do it from your phone, in your own time, from anywhere in Kenya.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[26px] font-semibold text-center mb-10" style={{ color: DEEP_NIGHT }}>What people say after their first session.</h2>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {renderTestimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ borderColor: "#E6E8FA", background: "#FAFBFF" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "#444" }}>"{t.quote}"</p>
                <p className="text-xs mt-4 font-medium" style={{ color: DEEP_NIGHT }}>— {t.who} · ⭐⭐⭐⭐⭐</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div style={{ background: WARMTH, height: 4 }} />

      {/* CITY COVERAGE — SEO long-tail */}
      <section id="cities" className="py-14 bg-white" style={{ borderTop: "0.5px solid #DDDDEE" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-[26px] font-semibold text-center" style={{ color: DEEP_NIGHT }}>
            Online therapy across every Kenyan city
          </h2>
          <p className="text-[15px] text-center max-w-2xl mx-auto mt-3" style={{ color: "#555" }}>
            Wherever you are in Kenya, your next session is one WhatsApp call away. Bandwidth-friendly video, voice or chat — no clinic visit required.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { id: "nairobi", city: "Nairobi", body: "Skip Nairobi traffic and clinic waiting rooms. Connect with a licensed therapist from Kilimani, Westlands, Karen, Lavington or anywhere in the city — evenings and weekends included.", kw: "Therapist in Nairobi" },
              { id: "mombasa", city: "Mombasa", body: "Coastal-based clients book online sessions in English or Kiswahili from Nyali, Bamburi or Mombasa Island. Pay via M-Pesa, meet on WhatsApp video.", kw: "Counsellor in Mombasa" },
              { id: "kisumu", city: "Kisumu", body: "Lakeside therapy for professionals, students and families in Kisumu, Milimani and surrounding areas — without leaving home. Kiswahili and Dholuo-friendly therapists.", kw: "Therapy in Kisumu" },
              { id: "nakuru", city: "Nakuru", body: "Whether you're in Nakuru CBD, Section 58 or Naivasha, book a licensed African therapist online. Sessions run on low-bandwidth video, voice or chat.", kw: "Therapist in Nakuru" },
              { id: "eldoret", city: "Eldoret", body: "Eldoret-based clients access mental health support discreetly — pay with M-Pesa, talk on WhatsApp, in English or Kiswahili.", kw: "Counselling in Eldoret" },
              { id: "rural-kenya", city: "Rural Kenya", body: "From Garissa to Kakamega, Meru to Kitale — if you have a phone and mobile data, you can see a therapist this week. Designed for low-bandwidth connections.", kw: "Online therapy Kenya" },
            ].map((c) => (
              <div key={c.id} id={c.id} className="bg-white border rounded-2xl p-5" style={{ borderColor: "#E6E8FA", scrollMarginTop: 80 }}>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SPARK_BLUE }}>{c.kw}</p>
                <h3 className="font-display font-semibold text-lg mt-1" style={{ color: DEEP_NIGHT }}>Therapy in {c.city}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#555" }}>{c.body}</p>
                <Link to={`/book-therapist?market=kenya&city=${c.id}`} className="inline-block text-sm font-medium mt-3" style={{ color: SPARK_BLUE }}>
                  Book a session in {c.city} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{ background: WARMTH, height: 4 }} />

      <section style={{ background: DEEP_NIGHT }} className="py-20 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
            You've been meaning to do this for a while.<br />Today is the day.
          </h2>
          <p className="text-[15px] mt-5" style={{ color: "#C5CAF5" }}>
            Getting started takes less than 2 minutes. Choose a therapist, pick a time, pay via M-Pesa. Your first session could be this weekend.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/book-therapist?market=kenya" className="inline-flex items-center justify-center font-medium text-white rounded-lg px-7 py-3.5" style={{ background: WARMTH }}>
              Book my first session — from KES {referredPrice.toLocaleString()}
            </Link>
            <Link to="/check/kenya" className="inline-flex items-center justify-center font-medium rounded-lg px-7 py-3.5 text-white border-[1.5px]" style={{ borderColor: "rgba(255,255,255,0.4)" }}>
              Try the free wellbeing check first
            </Link>
          </div>
          <p className="text-xs mt-5" style={{ color: "#888" }}>
            Your privacy is protected. Your employer will never know. You can cancel or reschedule anytime.
          </p>
        </div>
      </section>
      <div style={{ background: WARMTH, height: 4 }} />

      {/* Kenya-specific footer additions */}
      <section className="bg-secondary py-8 text-sm" style={{ color: "#555" }}>
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>Serving East Africa</h4>
            <Link to="/" className="hover:underline mr-3">Uganda</Link>
            <Link to="/kenya" className="hover:underline">Kenya</Link>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>Kenya clients</h4>
            <p>WhatsApp <a className="font-medium" style={{ color: SPARK_BLUE }} href="https://wa.me/256792085773">+256 792 085 773</a></p>
            <p><a className="font-medium" style={{ color: SPARK_BLUE }} href="mailto:info@innersparkafrica.com">info@innersparkafrica.com</a></p>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: DEEP_NIGHT }}>Kenya payment</h4>
            <p className="text-xs">Dial *840# → Send Money Abroad → Uganda → 0740 616 404 → Innerspark Recovery Ltd</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}