import { Heart, Brain, Frown, AlertTriangle, CloudRain, Wind, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";

const concerns = [
  {
    icon: Heart,
    title: "Marriage Issues",
    desc: "Dealing with tensions in your relationship? Feeling disconnected? Don't hesitate to seek help from experts who can help you strengthen your relationship and grow closer.",
  },
  {
    icon: CloudRain,
    title: "Feeling Lonely",
    desc: "Experiencing difficulty understanding your emotions? Finding yourself on the brink of tears? Reach out to experts who cultivate an atmosphere of unconditional support.",
  },
  {
    icon: AlertTriangle,
    title: "Trauma",
    desc: "Having trouble pinpointing the root causes of your triggers? Connect with seasoned professionals and begin your journey of self-discovery without delay.",
  },
  {
    icon: Brain,
    title: "Overthinking",
    desc: "Struggling to manage your thoughts? Constantly feeling overwhelmed? Connect with professionals who provide a safe space to help you find peace and clarity.",
  },
  {
    icon: Frown,
    title: "Sadness",
    desc: "Feeling out of touch with your joyful self? Share your thoughts and concerns with experts and experience an instant uplift in your mood.",
  },
  {
    icon: Wind,
    title: "Anxiety",
    desc: "Are negative thoughts distancing you from reality? Engage in conversations with esteemed experts and witness tangible improvement.",
  },
  {
    icon: Flame,
    title: "Stress",
    desc: "Is stress hindering you from fully enjoying life? Reconnect with top industry professionals and reclaim the joys of life today.",
  },
  {
    icon: Users,
    title: "Relationship Problems",
    desc: "Facing issues in your relationship? Feeling stuck or frustrated? Reach out to experts who help you navigate and resolve conflicts.",
  },
];

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
      <PreAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={closeFlow}
        actionType={actionType}
      />
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={closeFlow}
        formType="book"
      />

      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              We've Got You Covered For Almost Every Concern
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concerns.map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-card rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {item.desc}
                  </p>
                </div>
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
