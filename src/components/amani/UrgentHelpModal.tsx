import { Link } from "react-router-dom";
import { LifeBuoy, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SITE = "https://www.innersparkafrica.com";
const WHATSAPP = "https://wa.me/256792085773";
const PHONE = "tel:+256792085773";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** True inside a partner's iframe: links open the main site in a new tab. */
  embedded?: boolean;
}

export default function UrgentHelpModal({ open, onOpenChange, embedded = false }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-red-600" aria-hidden="true" /> Urgent help
          </DialogTitle>
          <DialogDescription>
            If you or someone else is in immediate danger, call your local emergency number now. You can also reach a real
            person at InnerSpark.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-3">
          <Button asChild size="lg" className="justify-start">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" /> WhatsApp InnerSpark: +256 792 085 773
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="justify-start">
            <a href={PHONE}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" /> Call +256 792 085 773
            </a>
          </Button>
          <Button asChild size="lg" variant="ghost" className="justify-start">
            {embedded ? (
              <a href={`${SITE}/emergency-support`} target="_blank" rel="noopener noreferrer">
                See all emergency contacts
              </a>
            ) : (
              <Link to="/emergency-support" onClick={() => onOpenChange(false)}>
                See all emergency contacts
              </Link>
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Amani is an AI assistant and is not an emergency service.
        </p>
      </DialogContent>
    </Dialog>
  );
}
