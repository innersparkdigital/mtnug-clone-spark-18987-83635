import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import servicesHero from "@/assets/mental-health-support-new.png";
import virtualTherapy from "@/assets/virtual-therapy-service-new.png";
import supportGroups from "@/assets/support-groups-service-new.png";
import wellnessResources from "@/assets/wellness-resources-service-new.png";
import corporateWellness from "@/assets/corporate-wellness-service-new.jpg";
import chatConsultationImg from "@/assets/chat-consultation-service.jpg";
import totTrainingImg from "@/assets/tot-training-service.jpg";
import whisperImg from "@/assets/whisper-service.jpg";
import mtnMomoLogo from "@/assets/payments/mtn-momo.png";
import airtelMoneyLogo from "@/assets/payments/airtel-money.png";
import mpesaLogo from "@/assets/payments/mpesa.png";
import pesapalLogo from "@/assets/payments/pesapal.png";
import visaLogo from "@/assets/payments/visa.png";
import mastercardLogo from "@/assets/payments/mastercard.png";


const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Mental Health Services",
  "provider": {
    "@type": "MedicalOrganization",
    "name": "Innerspark Africa"
  },
  "serviceType": "Mental Health Care",
  "areaServed": "Africa",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Mental Health Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Virtual Therapy",
          "description": "One-on-one online therapy sessions with licensed therapists"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Support Groups",
          "description": "Professionally moderated peer support groups"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Corporate Wellness",
          "description": "Workplace mental health programs and EAP services"
        }
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.innersparkafrica.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.innersparkafrica.com/services" }
  ]
};

const defaultTexts = {
  heroTitle: "Mental Health Support That Fits Your Life",
  heroDesc: "Understand your mental health first, then get the right support. At Innerspark Africa, we make therapy, community support, and wellness resources accessible anytime, anywhere.",
  bookSession: "Book a Session",
  joinSupportGroup: "Join a Support Group",
  virtualTherapy: "Virtual Therapy",
  virtualSubtitle: "Private, Professional Therapy from Anywhere",
  virtualDesc: "Connect instantly with licensed therapists for one-on-one sessions through secure video or audio calls. Whether you're facing stress, anxiety, depression, or burnout, our therapists are available to listen, guide, and support your recovery journey — confidentially and conveniently.",
  virtualBullet1: "Flexible scheduling (weekday & weekend options)",
  virtualBullet2: "Secure, encrypted sessions",
  virtualBullet3: "Affordable rates with multiple payment plans",
  bookTherapist: "Book a Therapist Now",
  supportGroups: "Support Groups",
  supportSubtitle: "Heal Together, Grow Together",
  supportDesc: "Join therapist-led peer groups designed around specific challenges like depression, addiction recovery, grief, or workplace stress. Each group provides a safe space to share, learn coping tools, and connect with others who understand your journey.",
  supportBullet1: "Weekly or monthly sessions",
  supportBullet2: "Moderated by licensed therapists",
  supportBullet3: "Affordable subscription plans",
  exploreCircles: "Explore Support Circles",
  wellnessResources: "Mood Check-In System",
  wellnessSubtitle: "Track How You Feel, Every Day",
  wellnessDesc: "Stay connected to your emotional well-being with daily mood check-ins. Log how you feel, notice your patterns over time, and build a consistent habit of caring for your mental health, all in a few simple taps.",
  wellnessBullet1: "Quick daily mood check-ins",
  wellnessBullet2: "Track your emotional patterns over time",
  wellnessBullet3: "Gentle reminders to check in each day",
  startCheckIn: "Start Your Daily Check-In",
  corporateWellness: "Corporate Wellness Screening",
  corporateSubtitle: "Understand Your Team's Mental Health",
  corporateDesc: "InnerSpark partners with organizations, schools, and institutions to measure and understand workplace wellbeing through confidential digital screening. Using the WHO-5 Wellbeing Index and workplace stress assessments, we give you a clear picture of your team's mental health, along with practical, aggregated reports to guide action, all while keeping every employee's individual results private.",
  corporateBullet1: "Confidential WHO-5 wellbeing screening",
  corporateBullet2: "Risk segmentation: Healthy, At Risk, Critical",
  corporateBullet3: "Aggregated, easy-to-read organizational reports",
  corporateBullet4: "Plain-language recommendations for management",
  partnerWithUs: "Partner With Us",
  ctaTitle: "Ready to Begin Your Wellness Journey?",
  ctaDesc: "Whether for yourself, your team, or your community — Innerspark Africa is here to support you every step of the way.",
  joinGroup: "Join a Group",
  contactUs: "Contact Us",
};

const Services = () => {
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState(defaultTexts);
  const { 
    startBooking, 
    startGroup, 
    closeFlow,
    goToForm,
    actionType,
    isAssessmentModalOpen,
    isBookingFormOpen,
    isGroupFormOpen
  } = useBookingFlow();

  useEffect(() => {
    if (language === "en") {
      setT(defaultTexts);
      return;
    }

    const values = Object.values(defaultTexts);
    translateBatch(values).then((results) => {
      const keys = Object.keys(defaultTexts) as (keyof typeof defaultTexts)[];
      const newT = {} as typeof defaultTexts;
      keys.forEach((key, i) => {
        newT[key] = results[i];
      });
      setT(newT);
    });
  }, [language, translateBatch]);

  return (
    <>
      <Helmet>
        <title>Our Services — Online Therapy, Support Groups & Corporate Wellness | InnerSpark Africa</title>
        <meta name="description" content="Explore InnerSpark Africa's full range of mental health services — virtual therapy from UGX 30,000, support groups, WHO-5 screening, and corporate EAP solutions." />
        <meta name="keywords" content="mental health services Africa, therapy services Uganda, online counseling services, support groups mental health, corporate wellness programs, employee assistance program, virtual therapy services, affordable mental health care, teletherapy services, wellness resources, mental health support, professional counseling" />
        <link rel="canonical" href="https://www.innersparkafrica.com/services" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mental Health Services | Therapy, Counseling, Support Groups" />
        <meta property="og:description" content="Explore Innerspark Africa's mental health services: online therapy, support groups, wellness resources, and corporate wellness programs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/services" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mental Health Services | Innerspark Africa" />
        <meta name="twitter:description" content="Online therapy, support groups, and corporate wellness programs across Africa." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(servicesSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What therapy services does Innerspark Africa offer?","acceptedAnswer":{"@type":"Answer","text":"We offer one-on-one video, voice, and chat therapy; group support sessions; couples and marriage counselling; corporate EAPs; and workplace mental health training."}},{"@type":"Question","name":"Do you treat anxiety and depression?","acceptedAnswer":{"@type":"Answer","text":"Yes. Anxiety and depression are our most common areas of treatment. We use evidence-based approaches including CBT, ACT, and trauma-focused therapy."}},{"@type":"Question","name":"Can I get couples or marriage counselling online?","acceptedAnswer":{"@type":"Answer","text":"Yes. Couples can join the same session from one or different locations. Both video and chat options are available."}}]})}
        </script>
      </Helmet>

      {/* Pre-Assessment Modal */}
      <PreAssessmentModal 
        isOpen={isAssessmentModalOpen} 
        onClose={closeFlow}
        onSkipToForm={goToForm}
        actionType={actionType}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={closeFlow}
        formType="book"
      />

      {/* Group Form Modal */}
      <BookingFormModal
        isOpen={isGroupFormOpen}
        onClose={closeFlow}
        formType="group"
      />

    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-deep/10 to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                  {t.heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  {t.heroDesc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={startBooking}>{t.bookSession}</Button>
                  <Button size="lg" variant="outline" onClick={startGroup}>{t.joinSupportGroup}</Button>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <img src={servicesHero} alt="Mental health services" className="rounded-2xl shadow-2xl" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Virtual Therapy */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img src={virtualTherapy} alt="Virtual therapy session" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.virtualTherapy}</h2>
                <p className="text-xl text-primary mb-4">{t.virtualSubtitle}</p>
                <div className="inline-block bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1 mb-4">From UGX 75,000 / ~$22 per session</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.virtualDesc}</p>
                <StaggerContainer className="space-y-3 mb-8">
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.virtualBullet1}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.virtualBullet2}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.virtualBullet3}</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
                <Button size="lg" onClick={startBooking}>{t.bookTherapist}</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.supportGroups}</h2>
                <p className="text-xl text-primary mb-4">{t.supportSubtitle}</p>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1">From UGX 25,000 / ~$7 per session per week</span>
                  <span className="bg-green-wellness/10 text-green-wellness text-[11px] font-bold tracking-[0.06em] uppercase rounded-full px-2.5 py-1">Most Popular</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.supportDesc}</p>
                <StaggerContainer className="space-y-3 mb-8">
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.supportBullet1}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.supportBullet2}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.supportBullet3}</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
                <Button size="lg" variant="secondary" onClick={startGroup}>{t.exploreCircles}</Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1} className="order-1 md:order-2">
              <div className="relative">
                <img src={supportGroups} alt="Support group session" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Wellness Resources */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img src={wellnessResources} alt="Wellness resources and tools" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.wellnessResources}</h2>
                <p className="text-xl text-primary mb-4">{t.wellnessSubtitle}</p>
                <div className="inline-block bg-green-wellness/10 text-green-wellness text-sm font-semibold rounded-full px-3 py-1 mb-4">Free — included with all plans</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.wellnessDesc}</p>
                <StaggerContainer className="space-y-3 mb-8">
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.wellnessBullet1}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.wellnessBullet2}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.wellnessBullet3}</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
                <Link to="/mind-check">
                  <Button size="lg">{t.startCheckIn}</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Corporate Wellness */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.corporateWellness}</h2>
                <p className="text-xl text-primary mb-4">{t.corporateSubtitle}</p>
                <div className="inline-block bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1 mb-4">From UGX 7,500 / KES 270 / ~$2.20 for each employee wellness screening</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.corporateDesc}</p>
                <StaggerContainer className="space-y-3 mb-8">
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.corporateBullet1}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.corporateBullet2}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.corporateBullet3}</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <p className="text-foreground">{t.corporateBullet4}</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
                <Link to="/for-business">
                  <Button size="lg" variant="secondary">{t.partnerWithUs}</Button>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1} className="order-1 md:order-2">
              <div className="relative">
                <img src={corporateWellness} alt="Corporate wellness program" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Payment methods */}
      {/* Chat Consultation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img src={chatConsultationImg} alt="Chat consultation with a licensed therapist" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Chat Consultation</h2>
                <p className="text-xl text-primary mb-4">Professional Support, One Message Away</p>
                <div className="inline-block bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1 mb-4">UGX 30,000 per session</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Connect with a licensed therapist through private, text-based conversations. Chat consultation lets you share what's on your mind and receive professional guidance at your own pace, without needing to meet face to face. It's a comfortable, discreet way to get support whenever you need it.
                </p>
                <StaggerContainer className="space-y-3 mb-8">
                  {[
                    "Private one-on-one chat with a licensed therapist",
                    "Share and get guidance at your own pace",
                    "Comfortable, discreet, and judgment-free",
                    "Support from wherever you are",
                  ].map((b) => (
                    <StaggerItem key={b}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <p className="text-foreground">{b}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <Button size="lg" onClick={startBooking}>Start a Chat Session</Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Training of Trainers (ToT) */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Training of Trainers (ToT)</h2>
                <p className="text-xl text-primary mb-4">Equipping Champions to Support Their Communities</p>
                <div className="inline-block bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1 mb-4">Custom pricing based on your needs</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  InnerSpark equips organizations, schools, churches, and communities with the skills to support mental health from within. Our Training of Trainers programs prepare your staff, leaders, and volunteers to recognize mental health needs, offer first-line support, and pass that knowledge on to others, multiplying impact long after the training ends.
                </p>
                <StaggerContainer className="space-y-3 mb-8">
                  {[
                    "Practical, facilitator-led training",
                    "Covers mental health literacy, psychological first aid, and safe referral",
                    "Equips participants to train and support others",
                    "Certificate of participation for each trainee",
                  ].map((b) => (
                    <StaggerItem key={b}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <p className="text-foreground">{b}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <Link to="/contact">
                  <Button size="lg" variant="secondary">Request a Training</Button>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1} className="order-1 md:order-2">
              <div className="relative">
                <img src={totTrainingImg} alt="Training of Trainers session" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Whisper */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img src={whisperImg} alt="Whisper anonymous voice note" className="rounded-2xl shadow-lg" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Whisper</h2>
                <p className="text-xl text-primary mb-4">Speak Your Heart, Anonymously</p>
                <div className="inline-block bg-green-wellness/10 text-green-wellness text-sm font-semibold rounded-full px-3 py-1 mb-4">Free</div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Sometimes you just need to let it out. Whisper lets you share what's weighing on you through a private, anonymous voice note, and receive a caring, professional response. No names, no judgment, just a safe space to be heard whenever you need it.
                </p>
                <StaggerContainer className="space-y-3 mb-8">
                  {[
                    "Send an anonymous voice note",
                    "Receive a caring, professional response",
                    "Completely private, no names required",
                    "A safe first step toward feeling better",
                  ].map((b) => (
                    <StaggerItem key={b}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <p className="text-foreground">{b}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <Link to="/whisper">
                  <Button size="lg">Send a Whisper</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-muted-foreground mb-6">Payment methods accepted</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              { src: mtnMomoLogo, alt: "MTN Mobile Money" },
              { src: airtelMoneyLogo, alt: "Airtel Money" },
              { src: mpesaLogo, alt: "M-Pesa" },
              { src: pesapalLogo, alt: "PesaPal" },
              { src: visaLogo, alt: "Visa" },
              { src: mastercardLogo, alt: "Mastercard" },
            ].map((p) => (
              <div key={p.alt} className="bg-background border border-border rounded-xl px-4 py-3 flex items-center justify-center h-16 w-28 md:h-20 md:w-32">
                <img src={p.src} alt={p.alt} loading="lazy" className="max-h-10 md:max-h-12 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10">Frequently asked questions</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {[
              { q: "Is online therapy as effective as in-person?", a: "Research shows online therapy is just as effective as in-person sessions for most concerns including anxiety, depression and stress — with the added benefits of comfort, privacy and accessibility." },
              { q: "Are sessions confidential?", a: "Absolutely. All sessions are encrypted, private and bound by professional confidentiality. Your therapist will never share what you discuss without your explicit consent." },
              { q: "How do I pay?", a: "We accept MTN Mobile Money, Airtel Money, Visa/Mastercard and bank transfer. Pay session-by-session or via a monthly plan." },
              { q: "Can I switch therapists?", a: "Yes — at any time, no questions asked. Finding the right fit matters and we make switching simple." },
              { q: "What if I need urgent help?", a: "If you're in crisis, please WhatsApp us on +256 792 085 773 right away or call a local emergency number. We can connect you to immediate support." },
              { q: "Do you offer free trials?", a: "Yes — start with a free WHO-5 wellbeing check and a free 15-minute consultation to see if InnerSpark is right for you." },
              { q: "How quickly can I get a session?", a: "Most clients are matched and booked within 24 hours. Same-day sessions are often available." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-background p-5 open:bg-muted/40">
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-foreground list-none">
                  {f.q}
                  <span className="text-primary text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-r from-primary via-purple-deep to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{t.ctaDesc}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={startBooking}
              >
                {t.bookSession}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={startGroup}
              >
                {t.joinGroup}
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">{t.contactUs}</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default Services;
