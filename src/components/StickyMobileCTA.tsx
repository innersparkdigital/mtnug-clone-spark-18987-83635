import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import PreAssessmentModal from "./PreAssessmentModal";
import BookingFormModal from "./BookingFormModal";

const StickyMobileCTA = () => {
  const {
    startBooking,
    closeFlow,
    resetFlow,
    isAssessmentModalOpen,
    isBookingFormOpen,
    actionType
  } = useBookingFlow();

  return (
    <>
      {/* Sticky bar - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 safe-area-bottom">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full py-5 text-sm shadow-lg"
            onClick={startBooking}
          >
            Book a Therapist
          </Button>
          <Button
            variant="outline"
            className="flex-shrink-0 rounded-full py-5 text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <a
              href="https://wa.me/256792085773?text=Hi,%20I%20need%20to%20talk%20to%20a%20therapist"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <PreAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={closeFlow}
        actionType={actionType}
      />
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={resetFlow}
        formType={actionType}
      />
    </>
  );
};

export default StickyMobileCTA;
