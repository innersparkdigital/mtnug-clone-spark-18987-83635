import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const THERAPY_OPTIONS: { id: TherapyType; title: string; subtitle: string; price: string; icon: any; color: string }[] = [
  { id: "individual", title: "Individual", subtitle: "For myself", price: "UGX 75,000 / session", icon: User, color: "from-emerald-500 to-emerald-600" },
  { id: "couples", title: "Couples", subtitle: "For me and my partner", price: "UGX 75,000 / session", icon: Heart, color: "from-sky-500 to-sky-600" },
  { id: "teen", title: "Teen", subtitle: "For my child", price: "UGX 75,000 / session", icon: Users, color: "from-amber-500 to-amber-600" },
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

const COMMUNICATION_OPTIONS = [
  "Mostly via messaging",
  "Mostly via phone or video sessions",
  "Not sure yet (decide later)",
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
  communication: string;
  name: string;
  email: string;
  phone: string;
}

const initialIntake: IntakeData = {
  therapyType: "",
  gender: "",
  age: "",
  reasons: [],
  communication: "",
  name: "",
  email: "",
  phone: "",
};

const BookingFormModal = ({ isOpen, onClose, formType }: BookingFormModalProps) => {
  const navigate = useNavigate();
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

  const priceLabel = useMemo(() => {
    if (isGroup) return "UGX 25,000 / week";
    if (isConsultation) return "FREE Consultation";
    return "UGX 75,000 / session";
  }, [isGroup, isConsultation]);

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
      case 4: return !!data.communication;
      case 5: return !!(data.name.trim() && data.phone.trim() && data.email.trim());
      default: return false;
    }
  }, [step, data, isGroup, groupName]);

  const toggleReason = (r: string) => {
    setData((d) => ({
      ...d,
      reasons: d.reasons.includes(r) ? d.reasons.filter((x) => x !== r) : [...d.reasons, r],
    }));
  };

  const buildSummary = () => {
    if (isGroup) {
      return (
        `*New Support Group Request – InnerSpark Africa*\n\n` +
        `*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Email:* ${data.email}\n\n` +
        `*Group:* ${groupName}\n*Weekly Fee:* UGX 25,000`
      );
    }
    const typeLabel = THERAPY_OPTIONS.find((t) => t.id === data.therapyType)?.title ?? "—";
    const header = isConsultation
      ? `*🟢 FREE CONSULTATION Request – InnerSpark Africa*`
      : `*New Therapy Booking – InnerSpark Africa*`;
    return (
      `${header}\n\n` +
      `*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Email:* ${data.email}\n\n` +
      `*Therapy type:* ${typeLabel}\n` +
      `*Gender:* ${data.gender}\n` +
      `*Age:* ${data.age}\n` +
      `*Reasons:* ${data.reasons.join("; ")}\n` +
      `*Communication preference:* ${data.communication}\n\n` +
      `*Pricing:* ${priceLabel}`
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
            <span className="text-foreground">UGX 25,000</span>
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
                      {opt.price}
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
            <h3 className="text-lg font-semibold text-foreground">How do you prefer to communicate with your therapist?</h3>
            <div className="space-y-2">
              {COMMUNICATION_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, communication: c }))}
                  className={`w-full rounded-full py-3 px-5 text-left transition-all ${
                    data.communication === c
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-primary/10 text-foreground hover:bg-primary/20"
                  }`}
                >
                  {c}
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
      <Label>Full name</Label>
      <div className="relative mt-1.5">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Your name"
          value={data.name}
          onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
        />
      </div>
    </div>
    <div>
      <Label>Phone number</Label>
      <div className="relative mt-1.5">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="+256 7XX XXX XXX"
          value={data.phone}
          onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
        />
      </div>
    </div>
    <div>
      <Label>Email address</Label>
      <div className="relative mt-1.5">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
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
