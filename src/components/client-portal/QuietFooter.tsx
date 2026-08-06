import { Phone } from "lucide-react";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/supportContact";

const QuietFooter = () => (
  <div className="mt-8 pt-4 border-t text-[12px] text-muted-foreground text-center leading-relaxed">
    <p>
      <span className="font-medium text-foreground/70">Need support now?</span>{" "}
      <a href={SUPPORT_PHONE_TEL} className="inline-flex items-center gap-1 text-primary hover:underline">
        <Phone className="h-3 w-3" /> {SUPPORT_PHONE_DISPLAY}
      </a>{" "}
      (call or WhatsApp) &nbsp;·&nbsp; or open <a href="/amani-ai" className="text-primary hover:underline">Amani</a>.
    </p>
  </div>
);

export default QuietFooter;