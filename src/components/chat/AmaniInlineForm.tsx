import { useState } from "react";
import { Loader2, Check, X, Calendar, MessageSquare, Users, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

export type FormKind = "chat" | "video" | "group";

const WHATSAPP = "256792085773";
export const IOTEC_PAY_URL = "https://pay.iotec.io/p/innerspark";
const AIRTEL_NUMBER = "0740 616 404";
const UGX_PER_USD = 3400;

const usd = (ugx: number) => `$${Math.round(ugx / UGX_PER_USD)}`;
const money = (ugx: number) => (ugx === 0 ? "Free" : `UGX ${ugx.toLocaleString()} (~${usd(ugx)})`);

type Cfg = {
  title: string;
  blurb: string;
  Icon: typeof Calendar;
  intent: string;
  needsSlot: boolean;
  priceUgx: number;
  duration: string;
  tag: string;
};

const CONFIG: Record<FormKind, Cfg> = {
  video: {
    title: "Book an individual video session",
    blurb: "60 minutes, one-on-one video with a licensed therapist.",
    Icon: Video,
    intent: "video_session",
    needsSlot: true,
    priceUgx: 75000,
    duration: "60 minutes",
    tag: "video-session",
  },
  chat: {
    title: "Book chat-based therapy",
    blurb: "1 hour of text-based therapy. Our team matches you with the right therapist.",
    Icon: MessageSquare,
    intent: "chat_therapy",
    needsSlot: true,
    priceUgx: 30000,
    duration: "1 hour",
    tag: "chat-therapy",
  },
  group: {
    title: "Join a support group",
    blurb: "Small peer group led by a therapist. Our team places you in the right group.",
    Icon: Users,
    intent: "support_group",
    needsSlot: false,
    priceUgx: 25000,
    duration: "Weekly, 90 minutes",
    tag: "support-group",
  },
};

const CONCERNS = [
  "Anxiety / stress",
  "Depression / low mood",
  "Relationships or marriage",
  "Work, burnout or career",
  "Grief or loss",
  "Trauma or abuse",
  "Addiction or substance use",
  "Teen / child support",
  "Self-esteem & personal growth",
  "Something else",
];

const GROUPS = [
  "Depression Support Group",
  "Anxiety Management Group",
  "Grief & Loss Support",
  "Addiction Recovery Group",
  "Stress Management Circle",
  "Healthy Relationships Group",
  "Trauma Survivors Support",
  "New Parents Support",
];

const GENDER_PREFS = ["No preference", "Female therapist", "Male therapist"];
const SUPPORT_STYLES = [
  { value: "Warm and gentle — someone who listens", label: "💚 Warm and gentle" },
  { value: "Structured — practical tools and exercises", label: "📋 Structured" },
  { value: "A mix of both", label: "↔️ A mix of both" },
];

const inputCls =
  "w-full px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

interface Props {
  kind: FormKind;
  sessionId: string | null;
  anonymousId: string;
  therapistName?: string | null;
  onClose: () => void;
  onSubmitted: (kind: FormKind) => void;
}

const AmaniInlineForm = ({ kind, sessionId, anonymousId, therapistName, onClose, onSubmitted }: Props) => {
  const cfg = CONFIG[kind];
  // Chat therapy and support groups are matched by our admin team, not in-chat.
  const therapist = kind === "video" ? therapistName || "" : "";
  const isPaid = cfg.priceUgx > 0;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [concern, setConcern] = useState(CONCERNS[0]);
  const [concernOther, setConcernOther] = useState("");
  const [genderPref, setGenderPref] = useState(GENDER_PREFS[0]);
  const [supportStyle, setSupportStyle] = useState(SUPPORT_STYLES[2].value);
  const [therapyHistory, setTherapyHistory] = useState("");
  const [distress, setDistress] = useState("5");
  const [group, setGroup] = useState(GROUPS[0]);
  const [payMethod, setPayMethod] = useState<"online" | "manual">("online");
  const [txnId, setTxnId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const submit = async () => {
    setError(null);
    if (name.trim().length < 2) return setError("Please add your name.");
    if (!/^[+\d][\d\s()-]{6,}$/.test(phone.trim())) return setError("Please enter a valid WhatsApp number.");
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) return setError("That email doesn't look right.");
    if (cfg.needsSlot && (!date || !time)) return setError("Please pick a date and time that suits you.");
    if (kind !== "group" && concern === "Something else" && concernOther.trim().length < 3)
      return setError("Please tell us briefly what's going on.");

    setBusy(true);
    const concernText = concern === "Something else" ? `Something else — ${concernOther.trim()}` : concern;
    const lines = [
      `*${cfg.title}* [${cfg.tag}] (via Amani)`,
      `Name: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      kind === "group" ? `Group: ${group}` : `Main concern: ${concernText}`,
      `Distress right now: ${distress}/10`,
      `Therapist preference: ${genderPref}`,
      `Preferred support style: ${supportStyle}`,
      therapyHistory.trim() ? `Therapy before: ${therapyHistory.trim()}` : `Therapy before: not stated`,
      `Session: ${cfg.duration} — ${money(cfg.priceUgx)}`,
      cfg.needsSlot ? `Preferred: ${date} at ${time}` : null,
      therapist ? `Therapist: ${therapist}` : null,
      isPaid ? `Payment: ${payMethod === "online" ? `Online (${IOTEC_PAY_URL})` : `Manual — Airtel Money ${AIRTEL_NUMBER}`}` : null,
      isPaid && txnId.trim() ? `Transaction ID: ${txnId.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await supabase.from("chat_leads").insert({
        session_id: sessionId,
        anonymous_id: anonymousId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        intent: cfg.intent,
        source_path: window.location.pathname,
        message: lines,
      });
      supabase.functions
        .invoke("notify-chat-event", {
          body: {
            kind: "new_lead",
            session_id: sessionId,
            anonymous_id: anonymousId,
            source_path: window.location.pathname,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            intent: cfg.intent,
            message: lines,
          },
        })
        .catch((e) => console.warn("notify-chat-event failed", e));

      if (email.trim()) {
        supabase.functions
          .invoke("send-transactional-email", {
            body: {
              templateName: "contact-confirmation",
              recipientEmail: email.trim(),
              idempotencyKey: `amani-${cfg.tag}-${Date.now()}-${email.trim()}`,
              templateData: {
                name: name.trim(),
                subject: cfg.title,
                message: lines.replace(/\*/g, ""),
              },
            },
          })
          .catch((e) => console.warn("confirmation email failed", e));
      }
    } catch (e) {
      console.warn("lead save failed", e);
    }

    trackEvent("amani_form_submitted", { kind, pay: isPaid ? payMethod : "free" });
    setBusy(false);
    setDone(true);
    onSubmitted(kind);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
  };

  if (done) {
    return (
      <div className="px-3 py-2 border-t border-border bg-emerald-50 text-xs text-emerald-900 flex items-start gap-2">
        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Sent to our team on WhatsApp{email.trim() ? " and emailed to you" : ""} — they'll confirm your time shortly. 💙
        </span>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-t border-border bg-primary/5 space-y-2 max-h-[52vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <cfg.Icon className="w-3.5 h-3.5 text-primary" /> {cfg.title}
        </div>
        <button onClick={onClose} aria-label="Close form" className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">{cfg.blurb}</p>
      <div className="text-[11px] font-semibold text-primary bg-primary/10 rounded-lg px-2 py-1.5">
        {cfg.duration} · {money(cfg.priceUgx)}
        {therapist ? ` · with ${therapist}` : ""}
      </div>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={120} className={inputCls} />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp e.g. 0792 085 773" maxLength={30} className={inputCls} />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (for your confirmation)" maxLength={120} className={inputCls} />

      {kind === "group" ? (
        <select value={group} onChange={(e) => setGroup(e.target.value)} className={inputCls}>
          {GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      ) : (
        <>
          <select value={concern} onChange={(e) => setConcern(e.target.value)} className={inputCls}>
            {CONCERNS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {concern === "Something else" && (
            <textarea
              value={concernOther}
              onChange={(e) => setConcernOther(e.target.value)}
              placeholder="Tell us in your own words what's going on"
              rows={2}
              maxLength={400}
              className={inputCls}
            />
          )}
        </>
      )}

      <label className="block text-[11px] text-muted-foreground">
        How heavy does it feel right now? <span className="font-semibold text-foreground">{distress}/10</span>
        <input type="range" min={1} max={10} value={distress} onChange={(e) => setDistress(e.target.value)} className="w-full accent-primary mt-1" />
      </label>

      {cfg.needsSlot && (
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
        </div>
      )}

      <div className="space-y-2 rounded-lg border border-border bg-background p-2">
        <div className="text-[11px] font-semibold text-foreground">About your therapist preference</div>
        <label className="block text-[11px] text-muted-foreground">
          Do you prefer a male or female therapist?
          <select value={genderPref} onChange={(e) => setGenderPref(e.target.value)} className={`${inputCls} mt-1`}>
            {GENDER_PREFS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <div className="text-[11px] text-muted-foreground">What kind of support feels right for you?</div>
        <div className="grid grid-cols-3 gap-1.5">
          {SUPPORT_STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSupportStyle(s.value)}
              className={`text-[10px] py-1.5 px-1 rounded-lg border transition-colors ${
                supportStyle === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <textarea
          value={therapyHistory}
          onChange={(e) => setTherapyHistory(e.target.value)}
          placeholder="Have you done therapy before? What worked or didn't work?"
          rows={2}
          maxLength={400}
          className={inputCls}
        />
      </div>

      {isPaid && (
        <div className="space-y-2 rounded-lg border border-border bg-background p-2">
          <div className="text-[11px] font-semibold text-foreground">Would you like to pay online or manually?</div>
          <div className="grid grid-cols-2 gap-2">
            {(["online", "manual"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPayMethod(m)}
                className={`text-[11px] py-1.5 rounded-lg border transition-colors ${
                  payMethod === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border text-foreground"
                }`}
              >
                {m === "online" ? "Pay online" : "Pay manually"}
              </button>
            ))}
          </div>
          {payMethod === "online" ? (
            <a
              href={IOTEC_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary underline"
            >
              Open secure payment page <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <p className="text-[11px] text-muted-foreground leading-snug">
              Airtel Money: <span className="font-semibold text-foreground">{AIRTEL_NUMBER}</span> (InnerSpark Recovery Ltd). Outside Uganda? Use M-Pesa "Send Money Abroad" to the same number.
            </p>
          )}
          <input
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Transaction ID (if you've already paid)"
            maxLength={60}
            className={inputCls}
          />
        </div>
      )}

      {error && <div className="text-[11px] text-red-600">{error}</div>}
      <Button onClick={submit} disabled={busy} size="sm" className="w-full text-xs h-8">
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
        Send to InnerSpark on WhatsApp
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">Private. Only used to confirm your session.</p>
    </div>
  );
};

export default AmaniInlineForm;
