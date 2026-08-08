import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessment, BookingActionType } from "@/contexts/AssessmentContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Users,
  Heart,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackBookingFormOpened, trackBookingSubmitted, trackWhatsAppClick } from "@/lib/analytics";
import { trackGadsBookingConversion, trackGadsWhatsAppClick, trackGadsThankYouConversion } from "@/lib/gadsTracking";
import { supabase } from "@/integrations/supabase/client";
import { getReferralCookie } from "@/lib/referralCookie";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: BookingActionType;
}

type TherapyType = "individual" | "couples" | "teen";

const THERAPY_OPTIONS: { id: TherapyType; title: string; subtitle: string; icon: any; color: string; ugx: number; fromUgx: number }[] = [
  { id: "individual", title: "Individual", subtitle: "For myself", icon: User, color: "from-emerald-500 to-emerald-600", ugx: 75000, fromUgx: 30000 },
  { id: "couples", title: "Couples", subtitle: "For me and my partner", icon: Heart, color: "from-sky-500 to-sky-600", ugx: 120000, fromUgx: 120000 },
  { id: "teen", title: "Teen", subtitle: "For my child", icon: Users, color: "from-amber-500 to-amber-600", ugx: 75000, fromUgx: 30000 },
];

const GENDER_OPTIONS = ["Woman", "Man", "Non-binary", "Prefer not to say"];

const AGE_OPTIONS = [
  "Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+",
];

const REASON_OPTIONS = [
  "I've been feeling depressed",
  "I feel anxious or overwhelmed",
  "My mood is interfering with my job/school",
  "I struggle with relationships",
  "I can't find purpose or meaning",
  "I am grieving",
  "I have experienced trauma",
  "I need to talk through a specific challenge",
  "I want to gain self-confidence",
  "I want to improve myself but don't know where to start",
];

const UGX_PER_USD = 3400;
const usd = (ugx: number) => `$${Math.round(ugx / UGX_PER_USD)}`;

const IOTEC_PAY_URL = "https://pay.iotec.io/p/innerspark";
const AIRTEL_NUMBER = "0740 616 404";

type SessionFormat = "video" | "chat";

const SESSION_FORMATS: { id: SessionFormat; title: string; detail: string; ugx: number; badge?: string }[] = [
  { id: "chat", title: "Chat-based therapy", detail: "1 hour, text only with a licensed therapist", ugx: 30000, badge: "Most affordable" },
  { id: "video", title: "Individual video session", detail: "60 minutes, face-to-face on video", ugx: 75000 },
];

const SUPPORT_GROUPS = [
  "Depression Support Group",
  "Anxiety Management Group",
  "Grief & Loss Support",
  "Addiction Recovery Group",
  "Stress Management Circle",
  "Healthy Relationships Group",
  "Trauma Survivors Support",
  "New Parents Support",
];

interface IntakeData {
  therapyType: TherapyType | "";
  gender: string;
  age: string;
  reasons: string[];
  sessionFormat: SessionFormat | "";
  payMethod: "online" | "manual" | "";
  txnId: string;
  name: string;
  email: string;
  phone: string;
}

const initialIntake: IntakeData = {
  therapyType: "",
  gender: "",
  age: "",
  reasons: [],
  sessionFormat: "",
  payMethod: "",
  txnId: "",
  name: "",
  email: "",
  phone: "",
};

const BookingFormModal = ({ isOpen, onClose, formType }: BookingFormModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAssessment } = useAssessment();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialIntake);
  const [groupName, setGroupName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isGroup = formType === "group";
  const isConsultation = formType === "consultation";

  // 6 steps for book/consultation, 1 step for group
  const totalSteps = isGroup ? 1 : 6;

  useEffect(() => {
    if (isOpen) {
      trackBookingFormOpened(false);
      setStep(0);
      setData(initialIntake);
      setGroupName("");
    }
  }, [isOpen]);

  const isKenya = useMemo(
    () => /^\/(kenya|check\/kenya)/i.test(location.pathname),
    [location.pathname]
  );

  const therapyPriceLabel = isKenya
    ? "from KES 1,000 / session"
    : `from UGX 30,000 (~${usd(30000)}) / session`;
  const groupPriceLabel = isKenya ? "KES 1,000 (~$8) / week" : `UGX 25,000 (~${usd(25000)}) / week`;

  const selectedFormat = SESSION_FORMATS.find((f) => f.id === data.sessionFormat);

  const priceLabel = useMemo(() => {
    if (isGroup) return groupPriceLabel;
    if (isConsultation) return "FREE Consultation";
    if (selectedFormat) return `UGX ${selectedFormat.ugx.toLocaleString()} (~${usd(selectedFormat.ugx)}) · ${selectedFormat.detail}`;
    return therapyPriceLabel;
  }, [isGroup, isConsultation, therapyPriceLabel, groupPriceLabel, selectedFormat]);

  const needsPayment = !isGroup && !isConsultation;

  const headerTitle = isGroup
    ? "Join a Support Group"
    : isConsultation
    ? "Book a Free Consultation"
    : "Find your therapist";

  const canProceed = useMemo(() => {
    if (isGroup) {
      return !!(groupName && data.name.trim() && data.phone.trim() && data.email.trim());
    }
    switch (step) {
      case 0: return !!data.therapyType;
      case 1: return !!data.gender;
      case 2: return !!data.age;
      case 3: return data.reasons.length > 0;
      case 4: return !!data.sessionFormat;
      case 5: return !!(data.name.trim() && data.phone.trim() && data.email.trim() && (!needsPayment || data.payMethod));
      default: return false;
    }
  }, [step, data, isGroup, groupName, needsPayment]);

  const toggleReason = (r: string) => {
    setData((d) => ({
      ...d,
      reasons: d.reasons.includes(r) ? d.reasons.filter((x) => x !== r) : [...d.reasons, r],
    }));
  };

  const buildSummary = () => {
    const refSlug = getReferralCookie();
    const refLine = refSlug ? `\n*Referred by:* ${refSlug}\n` : "";
    if (isGroup) {
      return (
        `*New Support Group Request – InnerSpark Africa*\n\n` +
        `*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Email:* ${data.email}\n` + refLine + `\n` +
        `*Group:* ${groupName}\n*Weekly Fee:* ${groupPriceLabel}`
      );
    }
    const typeLabel = THERAPY_OPTIONS.find((t) => t.id === data.therapyType)?.title ?? "—";
    const header = isConsultation
      ? `*🟢 FREE CONSULTATION Request – InnerSpark Africa*`
      : `*New Therapy Booking – InnerSpark Africa*`;
    return (
      `${header}\n\n` +
      `*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Email:* ${data.email}\n` + refLine + `\n` +
      `*Therapy type:* ${typeLabel}\n` +
      `*Gender:* ${data.gender}\n` +
      `*Age:* ${data.age}\n` +
      `*Reasons:* ${data.reasons.join("; ")}\n` +
      `*Session format:* ${selectedFormat ? `${selectedFormat.title} — ${selectedFormat.detail}` : "—"}\n\n` +
      `*Pricing:* ${priceLabel}` +
      (needsPayment
        ? `\n*Payment:* ${data.payMethod === "online" ? `Online (${IOTEC_PAY_URL})` : `Manual — Airtel Money ${AIRTEL_NUMBER}`}` +
          (data.txnId.trim() ? `\n*Transaction ID:* ${data.txnId.trim()}` : "")
        : "")
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const summaryText = buildSummary();

      // Referral conversion tracking (Kenya / Synder-style links)
      const refSlug = getReferralCookie();
      if (refSlug) {
        try {
          await supabase.rpc("record_referral_conversion", {
            _slug: refSlug,
            _booking_reference: `booking-${Date.now()}`,
            _client_name: data.name || null,
            _client_phone: data.phone || null,
            _session_amount_kes: isGroup ? 1000 : 2600,
          });
        } catch (err) {
          console.warn("Referral conversion logging failed (non-blocking):", err);
        }
      }

      // Send confirmation email to client + BCC admin via existing transactional template
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "contact-confirmation",
            recipientEmail: data.email,
            idempotencyKey: `booking-${Date.now()}-${data.email}`,
            templateData: {
              name: data.name,
              subject: isGroup
                ? `Support Group Request: ${groupName}`
                : isConsultation
                ? `Free Consultation Request (${THERAPY_OPTIONS.find(t => t.id === data.therapyType)?.title ?? ""})`
                : `Therapy Booking Request (${THERAPY_OPTIONS.find(t => t.id === data.therapyType)?.title ?? ""})`,
              message: summaryText.replace(/\*/g, ""),
            },
          },
        });
      } catch (err) {
        console.warn("Email send failed (non-blocking):", err);
      }

      // Tracking
      trackBookingSubmitted(formType);
      trackGadsBookingConversion(formType);
      trackGadsThankYouConversion("booking", { form_type: formType });
      trackWhatsAppClick(isGroup ? "group_form" : "booking_form");
      trackGadsWhatsAppClick(isGroup ? "group_form" : "booking_form");

      // Open WhatsApp with full summary
      const whatsappUrl = `https://wa.me/256792085773?text=${encodeURIComponent(summaryText)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Request sent!",
        description: "We'll be in touch shortly. A confirmation email is on its way.",
      });

      clearAssessment();
      onClose();
      navigate("/thank-you-booking");
    } catch (e) {
      console.error(e);
      toast({
        title: "Something went wrong",
        description: "Please try again or WhatsApp us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    if (isGroup) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm">
            <span className="font-semibold text-primary">Weekly fee:</span>{" "}
            <span className="text-foreground">{groupPriceLabel}</span>
          </div>
          <div>
            <Label>Select a group</Label>
            <Select value={groupName} onValueChange={setGroupName}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Choose a support group" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ContactFields data={data} setData={setData} />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">What type of therapy are you looking for?</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {THERAPY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = data.therapyType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, therapyType: opt.id }))}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all bg-gradient-to-br ${opt.color} text-white ${
                      selected ? "border-foreground ring-2 ring-foreground/30 scale-[0.98]" : "border-transparent hover:scale-[1.02]"
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2 opacity-90" />
                    <div className="text-lg font-bold">{opt.title}</div>
                    <div className="text-xs opacity-90 mb-2">{opt.subtitle}</div>
                    <div className="text-xs font-semibold bg-white/20 rounded px-2 py-1 inline-block">
                      {isKenya
                        ? therapyPriceLabel
                        : `from UGX ${opt.fromUgx.toLocaleString()} (~${usd(opt.fromUgx)}) / session`}
                    </div>
                    {selected && (
                      <CheckCircle className="absolute top-2 right-2 h-5 w-5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">What is your gender identity?</h3>
            <div className="space-y-2">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, gender: g }))}
                  className={`w-full rounded-full py-3 px-5 text-left transition-all ${
                    data.gender === g
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-primary/10 text-foreground hover:bg-primary/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">How old are you?</h3>
            <Select value={data.age} onValueChange={(v) => setData((d) => ({ ...d, age: v }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your age" />
              </SelectTrigger>
              <SelectContent>
                {AGE_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">What led you to consider therapy today?</h3>
            <p className="text-xs text-muted-foreground">Select all that apply</p>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {REASON_OPTIONS.map((r) => {
                const checked = data.reasons.includes(r);
                return (
                  <label
                    key={r}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleReason(r)} />
                    <span className="text-sm text-foreground">{r}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">How would you like your sessions to happen?</h3>
            <div className="space-y-2">
              {SESSION_FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, sessionFormat: f.id }))}
                  className={`w-full rounded-xl border py-3 px-4 text-left transition-all ${
                    data.sessionFormat === f.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{f.title}</span>
                    {f.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/15 text-primary rounded-full px-2 py-0.5">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{f.detail}</div>
                  <div className="text-xs font-semibold text-primary mt-1">
                    UGX {f.ugx.toLocaleString()} (~{usd(f.ugx)})
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Almost there — how can we reach you?</h3>
            <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm">
              <span className="font-semibold text-primary">{isConsultation ? "Cost: " : "Session price: "}</span>
              <span className="text-foreground">{priceLabel}</span>
            </div>
            <ContactFields data={data} setData={setData} />
            {needsPayment && (
              <div className="space-y-2 rounded-xl border border-border p-3">
                <Label>Would you like to pay online or manually?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["online", "manual"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, payMethod: m }))}
                      className={`rounded-lg border py-2 text-sm transition-colors ${
                        data.payMethod === m
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {m === "online" ? "Pay online" : "Pay manually"}
                    </button>
                  ))}
                </div>
                {data.payMethod === "online" && (
                  <a
                    href={IOTEC_PAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-semibold text-primary underline"
                  >
                    Open the secure payment page
                  </a>
                )}
                {data.payMethod === "manual" && (
                  <p className="text-xs text-muted-foreground">
                    Airtel Money: <span className="font-semibold text-foreground">{AIRTEL_NUMBER}</span> (InnerSpark Africa).
                    Outside Uganda? Use M-Pesa "Send Money Abroad" to the same number.
                  </p>
                )}
                {data.payMethod && (
                  <Input
                    id="booking-txn-id"
                    aria-label="Transaction ID"
                    placeholder="Transaction ID (if you've already paid)"
                    value={data.txnId}
                    onChange={(e) => setData((d) => ({ ...d, txnId: e.target.value }))}
                  />
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{headerTitle}</DialogTitle>
          <DialogDescription>
            {isGroup
              ? "Fill in your details to join a supportive community."
              : "A few quick questions so we can match you with the right therapist."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar (only multi-step) */}
        {!isGroup && (
          <div className="flex gap-1.5 mt-1 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        <div className="py-2">{renderStep()}</div>

        <div className="flex justify-between gap-3 pt-2">
          {!isGroup && step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={submitting}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : (
            <span />
          )}

          {isGroup || step === totalSteps - 1 ? (
            <Button
              type="button"
              disabled={!canProceed || submitting}
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>Submit request <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
              className="bg-primary hover:bg-primary/90"
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ContactFields = ({
  data,
  setData,
}: {
  data: IntakeData;
  setData: React.Dispatch<React.SetStateAction<IntakeData>>;
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="booking-name">Full name</Label>
      <div className="relative mt-1.5">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="booking-name"
          className="pl-10"
          placeholder="Your name"
          value={data.name}
          onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
        />
      </div>
    </div>
    <div>
      <Label htmlFor="booking-phone">Phone number</Label>
      <div className="relative mt-1.5">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="booking-phone"
          className="pl-10"
          placeholder="+256 7XX XXX XXX"
          value={data.phone}
          onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
        />
      </div>
    </div>
    <div>
      <Label htmlFor="booking-email">Email address</Label>
      <div className="relative mt-1.5">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="booking-email"
          type="email"
          className="pl-10"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
        />
      </div>
    </div>
    <p className="text-xs text-muted-foreground">
      We'll send your request to WhatsApp and email a confirmation to you.
    </p>
  </div>
);

export default BookingFormModal;
