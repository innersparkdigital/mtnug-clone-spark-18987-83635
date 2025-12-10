import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import servicesHero from "@/assets/services-hero.jpg";
import virtualTherapy from "@/assets/virtual-therapy-service.jpg";
import supportGroups from "@/assets/support-groups-service.jpg";
import wellnessResources from "@/assets/wellness-resources-service.jpg";
import corporateWellness from "@/assets/corporate-wellness-service.jpg";
import testimonialBrian from "@/assets/testimonial-brian.jpg";

const defaultTexts = {
  heroTitle: "Mental Health Support That Fits Your Life",
  heroDesc: "At Innerspark Africa, we make therapy, community support, and wellness resources accessible anytime, anywhere. Whether you're an individual, student, or organization, we have the right tools to help you heal, grow, and thrive.",
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
  wellnessResources: "Wellness Resources",
  wellnessSubtitle: "Tools for Daily Self-Care and Growth",
  wellnessDesc: "Access practical tools like mood tracking, guided journaling, wellness challenges, and meditation audios — all designed to improve your emotional well-being and build consistent mental health habits.",
  wellnessBullet1: "Daily mood check-ins",
  wellnessBullet2: "Self-reflection and progress tracking",
  wellnessBullet3: "Calming meditations & affirmations",
  startCheckIn: "Start Your Daily Check-In",
  corporateWellness: "Corporate Wellness",
  corporateSubtitle: "Empower Your Team's Mental Health",
  corporateDesc: "Innerspark partners with organizations, schools, and institutions to create healthier workplaces through customized Employee Assistance Programs (EAPs), training workshops, and digital wellness tools.",
  corporateBullet1: "Employee Assistance Programs (EAPs)",
  corporateBullet2: "Stress & burnout management workshops",
  corporateBullet3: "Mental health awareness training",
  corporateBullet4: "Organizational wellness reports",
  partnerWithUs: "Partner With Us",
  testimonialTitle: "What Our Clients Say",
  testimonialQuote: "Innerspark's support group changed how I manage stress — it feels like family.",
  ctaTitle: "Ready to Begin Your Wellness Journey?",
  ctaDesc: "Whether for yourself, your team, or your community — Innerspark Africa is here to support you every step of the way.",
  joinGroup: "Join a Group",
  contactUs: "Contact Us",
};

const Services = () => {
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState(defaultTexts);

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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-deep/10 to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {t.heroDesc}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20book%20a%20therapy%20session" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">{t.bookSession}</Button>
                </a>
                <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20join%20a%20support%20group" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">{t.joinSupportGroup}</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <img src={servicesHero} alt="Mental health services" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Therapy */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={virtualTherapy} alt="Virtual therapy session" className="rounded-2xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.virtualTherapy}</h2>
              <p className="text-xl text-primary mb-4">{t.virtualSubtitle}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.virtualDesc}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.virtualBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.virtualBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.virtualBullet3}</p>
                </div>
              </div>
              <Link to="/virtual-therapy">
                <Button size="lg">{t.bookTherapist}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.supportGroups}</h2>
              <p className="text-xl text-primary mb-4">{t.supportSubtitle}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.supportDesc}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.supportBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.supportBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.supportBullet3}</p>
                </div>
              </div>
              <Link to="/support-groups">
                <Button size="lg" variant="secondary">{t.exploreCircles}</Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <img src={supportGroups} alt="Support group session" className="rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Resources */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={wellnessResources} alt="Wellness resources and tools" className="rounded-2xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.wellnessResources}</h2>
              <p className="text-xl text-primary mb-4">{t.wellnessSubtitle}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.wellnessDesc}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.wellnessBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.wellnessBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.wellnessBullet3}</p>
                </div>
              </div>
              <Link to="/mood-check-in">
                <Button size="lg">{t.startCheckIn}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Wellness */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.corporateWellness}</h2>
              <p className="text-xl text-primary mb-4">{t.corporateSubtitle}</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.corporateDesc}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.corporateBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.corporateBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.corporateBullet3}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">{t.corporateBullet4}</p>
                </div>
              </div>
              <Link to="/contact">
                <Button size="lg" variant="secondary">{t.partnerWithUs}</Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <img src={corporateWellness} alt="Corporate wellness program" className="rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {t.testimonialTitle}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 flex-shrink-0">
                  <img src={testimonialBrian} alt="Brian from Kampala" className="w-full h-full rounded-full object-cover border-4 border-primary/20" />
                </div>
                <div>
                  <p className="text-lg md:text-xl text-foreground mb-4 italic leading-relaxed">
                    "{t.testimonialQuote}"
                  </p>
                  <p className="text-muted-foreground font-semibold">— Brian, Kampala</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-r from-primary via-purple-deep to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{t.ctaDesc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20book%20a%20therapy%20session" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">{t.bookSession}</Button>
            </a>
            <a href="https://wa.me/256780570987?text=Hi,%20I%20would%20like%20to%20join%20a%20support%20group" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">{t.joinGroup}</Button>
            </a>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">{t.contactUs}</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
