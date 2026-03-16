import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";

const features = [
  { name: "Credentialed therapist", innerspark: true, inOffice: true, highlight: true },
  { name: "Messaging any time", innerspark: true, inOffice: false, highlight: false },
  { name: "Chat sessions", innerspark: true, inOffice: false, highlight: true },
  { name: "Phone sessions", innerspark: true, inOffice: false, highlight: false },
  { name: "Video sessions", innerspark: true, inOffice: false, highlight: true },
  { name: "Easy scheduling", innerspark: true, inOffice: false, highlight: false },
  { name: "Growth Paths", innerspark: true, inOffice: false, highlight: true },
  { name: "Group sessions", innerspark: true, inOffice: false, highlight: false },
];

const CounselingComparison = () => {
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

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <ScrollReveal direction="left">
              <div className="max-w-lg">
                <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Affordable and Accessible
                </p>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Counseling that works
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Online therapy is proven to be highly effective. With the added benefits of being easier to access and more affordable than in-office fees.
                </p>
                <Button size="lg" onClick={startBooking}>
                  Get started
                </Button>
              </div>
            </ScrollReveal>

            {/* Right side - Comparison Table */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="w-full overflow-hidden rounded-2xl">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_120px_120px] items-center gap-0">
                  <div />
                  <div className="text-center py-4 font-bold text-primary text-sm md:text-base">
                    🟢 Innerspark
                  </div>
                  <div className="text-center py-4 font-bold text-foreground text-sm md:text-base">
                    In-office
                  </div>
                </div>

                {/* Table Rows */}
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_120px_120px] items-center gap-0 ${
                      feature.highlight
                        ? "bg-primary text-primary-foreground rounded-xl"
                        : ""
                    }`}
                  >
                    <div
                      className={`py-3 px-4 text-sm md:text-base font-medium ${
                        feature.highlight ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {feature.name}
                    </div>
                    <div className="flex justify-center py-3">
                      <Check
                        className={`w-5 h-5 ${
                          feature.highlight
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                    </div>
                    <div className="flex justify-center py-3">
                      {feature.inOffice ? (
                        <Check
                          className={`w-5 h-5 ${
                            feature.highlight
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        />
                      ) : (
                        <X
                          className={`w-5 h-5 ${
                            feature.highlight
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground/50"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default CounselingComparison;
