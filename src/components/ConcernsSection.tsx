import { Heart, Brain, Frown, AlertTriangle, CloudRain, Wind, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { Helmet } from "react-helmet";

const concerns = [
  {
    icon: Heart,
    title: "Marriage Issues",
    desc: "Dealing with tensions in your relationship? Feeling disconnected? Don't hesitate to seek help from experts who can help you strengthen your relationship and grow closer.",
    seoName: "Marriage Counselling",
    seoDesc: "Professional marriage counselling and relationship therapy for couples dealing with communication issues, trust problems, and emotional disconnection.",
  },
  {
    icon: CloudRain,
    title: "Feeling Lonely",
    desc: "Experiencing difficulty understanding your emotions? Finding yourself on the brink of tears? Reach out to experts who cultivate an atmosphere of unconditional support.",
    seoName: "Loneliness & Emotional Support",
    seoDesc: "Therapy and emotional support for individuals experiencing loneliness, social isolation, and difficulty connecting with others.",
  },
  {
    icon: AlertTriangle,
    title: "Trauma",
    desc: "Having trouble pinpointing the root causes of your triggers? Connect with seasoned professionals and begin your journey of self-discovery without delay.",
    seoName: "Trauma Therapy",
    seoDesc: "Evidence-based trauma therapy including PTSD treatment, trauma recovery, and trigger management with licensed professionals.",
  },
  {
    icon: Brain,
    title: "Overthinking",
    desc: "Struggling to manage your thoughts? Constantly feeling overwhelmed? Connect with professionals who provide a safe space to help you find peace and clarity.",
    seoName: "Overthinking & Rumination Therapy",
    seoDesc: "Professional help for overthinking, rumination, and intrusive thoughts using cognitive behavioural therapy techniques.",
  },
  {
    icon: Frown,
    title: "Sadness",
    desc: "Feeling out of touch with your joyful self? Share your thoughts and concerns with experts and experience an instant uplift in your mood.",
    seoName: "Depression & Sadness Counselling",
    seoDesc: "Counselling for persistent sadness, low mood, and depression symptoms with compassionate licensed therapists.",
  },
  {
    icon: Wind,
    title: "Anxiety",
    desc: "Are negative thoughts distancing you from reality? Engage in conversations with esteemed experts and witness tangible improvement.",
    seoName: "Anxiety Treatment",
    seoDesc: "Professional anxiety treatment including generalised anxiety disorder, social anxiety, and panic attacks with licensed therapists.",
  },
  {
    icon: Flame,
    title: "Stress",
    desc: "Is stress hindering you from fully enjoying life? Reconnect with top industry professionals and reclaim the joys of life today.",
    seoName: "Stress Management Therapy",
    seoDesc: "Stress management therapy and coping strategies for work stress, burnout, and chronic stress with qualified professionals.",
  },
  {
    icon: Users,
    title: "Relationship Problems",
    desc: "Facing issues in your relationship? Feeling stuck or frustrated? Reach out to experts who help you navigate and resolve conflicts.",
    seoName: "Relationship Therapy",
    seoDesc: "Relationship therapy and couples counselling for conflict resolution, communication improvement, and emotional reconnection.",
  },
];

const concernsJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Innerspark Africa",
  "url": "https://www.innersparkafrica.com",
  "medicalSpecialty": concerns.map(c => c.seoName),
  "availableService": concerns.map(c => ({
    "@type": "MedicalTherapy",
    "name": c.seoName,
    "description": c.seoDesc,
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com",
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceType": "Online Therapy",
      "serviceUrl": "https://www.innersparkafrica.com/book-therapist",
    },
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What mental health concerns can Innerspark Africa help with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Innerspark Africa provides professional therapy for marriage issues, loneliness, trauma, overthinking, sadness, anxiety, stress, and relationship problems. Our licensed therapists offer online sessions via video, voice, and chat.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I get help for anxiety or depression in Uganda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can book an affordable online therapy session with a licensed therapist at Innerspark Africa. We offer video, voice, and chat therapy for anxiety, depression, stress, and other mental health concerns across Uganda and Africa.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I get marriage counselling or relationship therapy online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Innerspark Africa offers professional online marriage counselling and relationship therapy. Our licensed therapists help couples with communication issues, trust problems, conflict resolution, and emotional reconnection.",
      },
    },
    {
      "@type": "Question",
      "name": "Is online therapy effective for trauma and PTSD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research shows online therapy is as effective as in-person therapy for trauma and PTSD. Innerspark Africa's licensed therapists use evidence-based approaches including CBT and trauma-focused therapy to help clients recover.",
      },
    },
  ],
};

const ConcernsSection = () => {
  const {
    startBooking,
    closeFlow,
    actionType,
    isAssessmentModalOpen,
    isBookingFormOpen,
  } = useBookingFlow();

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(concernsJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      <PreAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={closeFlow}
        onSkipToForm={goToForm}
        actionType={actionType}
      />
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={closeFlow}
        formType="book"
      />

      <section className="py-16 md:py-24 bg-muted" aria-label="Mental health concerns we treat">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              We've Got You Covered For Almost Every Concern
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Professional online therapy for anxiety, depression, trauma, stress, relationship issues, and more — from licensed therapists across Africa.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concerns.map((item) => (
              <StaggerItem key={item.title}>
                <article className="bg-card rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {item.desc}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Button size="lg" onClick={startBooking}>
                Get Help
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default ConcernsSection;
