import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import therapistChatImage from "@/assets/therapist-chat-cta.jpg";

interface TherapistCTAPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TherapistCTAPopup = ({ isOpen, onClose }: TherapistCTAPopupProps) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay popup appearance by 1 second after results are shown
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isOpen]);

  const handleStartNow = () => {
    onClose();
    navigate("/find-therapist");
  };

  return (
    <Dialog open={showPopup} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Chat with a Therapist</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 md:h-auto">
            <img
              src={therapistChatImage}
              alt="Person chatting with therapist on phone"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center items-center text-center bg-background">
            <p className="text-lg md:text-xl font-semibold text-muted-foreground mb-2">
              Mental Health Issues are treatable
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-8">
              Chat with a Therapist online
            </h2>
            
            <Button
              onClick={handleStartNow}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-12 py-6 rounded-md"
            >
              START NOW
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-6 max-w-sm">
              Innerspark connects you with licensed therapists. Start your journey to better mental health today.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistCTAPopup;
