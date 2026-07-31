import { useState } from "react";
import { Loader2, Check, X, Calendar, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

export type FormKind = "freecall" | "chat" | "group";

const WHATSAPP = "256792085773";

const CONFIG: Record<FormKind, { title: string; blurb: string; Icon: typeof Calendar; intent: string; needsSlot: boolean }> = {
  freecall: {
    title: "Book your free 20-minute call",
    blurb: "With Janet, our intake therapist. No payment, no commitment.",
    Icon: Calendar,
    intent: "free_call",
    needsSlot: true,
  },
  chat: {
    title: "Book a chat consultation",
    blurb: "Text-based session with a licensed therapist — 30,000 UGX.",
    Icon: MessageSquare,
    intent: "chat_consultation",
    needsSlot: true,
  },
  group: {
    title: "Join a support group",
    blurb: "Small peer group led by a therapist — 25,000 UGX.",
    Icon: Users,
    intent: "support_group",
    needsSlot: false,
  },
};

const CONCERNS = ["Anxiety / stress", "Low mood", "Relationships", "Work / burnout", "Grief or loss", "Something else"];

interface Props {
  kind: FormKind;
  sessionId: string | null;
  anonymousId: string;
  onClose: () => void;
  onSubmitted: (kind: FormKind) => void;
}

const AmaniInlineForm = ({ kind, sessionId, anonymousId, onClose, onSubmitted }: Props) => {
  const cfg = CONFIG[kind];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [concern, setConcern] = useState(CONCERNS[0]);
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

    setBusy(true);
    const lines = [
      `*${cfg.title}* (via Amani)`,
      `Name: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Main concern: ${concern}`,
      cfg.needsSlot ? `Preferred: ${date} at ${time}` : null,
      kind === "freecall" ? "Therapist: Janet (intake)" : null,
    ].filter(Boolean).join("\n");

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
      supabase.functions.invoke("notify-chat-event", {
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
      }).catch((e) => console.warn("notify-chat-event failed", e));
    } catch (e) {
      console.warn("lead save failed", e);
    }

    trackEvent("amani_form_submitted", { kind });
    setBusy(false);
    setDone(true);
    onSubmitted(kind);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
  };

  if (done) {
    return (
      <div className="px-3 py-2 border-t border-border bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
        <Check className="w-4 h-4 flex-shrink-0" /> Sent to our team on WhatsApp — they'll confirm shortly. 💙
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-t border-border bg-primary/5 space-y-2 max-h-[45vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <cfg.Icon className="w-3.5 h-3.5 text-primary" /> {cfg.title}
        </div>
        <button onClick={onClose} aria-label="Close form" className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">{cfg.blurb}</p>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={120}
        className="w-full px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp e.g. 0792 085 773" maxLength={30}
        className="w-full px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" maxLength={120}
        className="w-full px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      <select value={concern} onChange={(e) => setConcern(e.target.value)}
        className="w-full px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        {CONCERNS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {cfg.needsSlot && (
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
            className="px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="px-2.5 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
