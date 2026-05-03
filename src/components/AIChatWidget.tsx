import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Phone, Calendar, Heart, AlertTriangle, LifeBuoy, PhoneCall, UserPlus, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import amaniAvatar from "@/assets/amani-avatar.jpg";

const ASSISTANT_NAME = "Amani";
const ASSISTANT_ROLE = "Care Assistant";

type Msg = { role: "user" | "assistant"; content: string; flagged?: boolean; tools?: string[] };
type Chip = { label: string; target: string };

const CHIPS_REGEX = /\[chips:\s*([^\]]+)\]\s*$/i;

function parseChips(content: string): { text: string; chips: Chip[] } {
  const match = content.match(CHIPS_REGEX);
  if (!match) return { text: content, chips: [] };
  const raw = match[1];
  const chips: Chip[] = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((piece) => {
      const [label, target] = piece.split("|").map((p) => p?.trim());
      if (!label || !target) return null;
      return { label, target };
    })
    .filter((c): c is Chip => !!c)
    .slice(0, 4);
  const text = content.replace(CHIPS_REGEX, "").trim();
  return { text, chips };
}

const QUICK_REPLIES = [
  { label: "📅 Book a session", text: "I'd like to book a therapy session" },
  { label: "🧪 Check my wellbeing", text: "I want to check my mental wellbeing" },
  { label: "💬 Learn about services", text: "Tell me about your services and pricing" },
  { label: "🌿 I need calming tips", text: "Can you share a quick calming exercise?" },
];

const ANON_KEY = "is_chat_anon_id";

function getAnonId(): string {
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hey there 👋 I'm **Amani**, your wellness buddy from InnerSpark ✨\n\nWhat's on your mind today? I can help you book a therapist, take a free wellbeing check, or just chat through how you're feeling 💙",
};

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [highRisk, setHighRisk] = useState(false);
  const [crisisDismissed, setCrisisDismissed] = useState(false);
  const [distress, setDistress] = useState(false);
  const [leadPromptShown, setLeadPromptShown] = useState(false);
  const [leadPromptDismissed, setLeadPromptDismissed] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadIntent, setLeadIntent] = useState<string>("general");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const logEvent = async (event_type: string, metadata?: Record<string, unknown>) => {
    try {
      await supabase.from("chat_events").insert([{ session_id: sessionId, event_type, metadata: (metadata || null) as never }]);
    } catch (e) { console.warn("event log failed", e); }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Add placeholder assistant message we'll stream into
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => !(m.role === "assistant" && m === WELCOME))
            .map(m => ({ role: m.role, content: m.content })),
          session_id: sessionId,
          anonymous_id: getAnonId(),
          source_path: window.location.pathname,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errText = await resp.text().catch(() => "");
        if (resp.status === 429) {
          let friendly = "You're sending messages a bit too fast. Please wait a moment.";
          try { const j = JSON.parse(errText); if (j?.error) friendly = j.error; } catch { /* ignore */ }
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: `⏱️ ${friendly}` };
            return copy;
          });
          setLoading(false);
          return;
        }
        throw new Error(errText || `HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let isHighRisk = false;
      let accumulated = "";
      let toolsUsed: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith("data:")) continue;
          const payload = trimmedLine.slice(5).trim();
          if (!payload) continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "meta") {
              if (evt.session_id && !sessionId) setSessionId(evt.session_id);
              if (evt.high_risk) { isHighRisk = true; setHighRisk(true); }
              if (evt.distress) setDistress(true);
              if (Array.isArray(evt.tools_used) && evt.tools_used.length > 0) {
                toolsUsed = evt.tools_used as string[];
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, tools: toolsUsed };
                  }
                  return copy;
                });
              }
            } else if (evt.type === "delta" && evt.content) {
              accumulated += evt.content;
              setMessages(prev => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: accumulated, flagged: isHighRisk, tools: toolsUsed };
                }
                return copy;
              });
            }
          } catch (_e) { /* ignore */ }
        }
      }

      if (!accumulated) {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: "Sorry, please try again." };
          return copy;
        });
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        const fallback = "I'm having trouble right now. Please try WhatsApp +256 792 085 773 or [book a session](/book-therapist).";
        if (last && last.role === "assistant" && !last.content) {
          copy[copy.length - 1] = { role: "assistant", content: fallback };
        } else {
          copy.push({ role: "assistant", content: fallback });
        }
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    trackEvent("ai_chat_opened");
    logEvent("chat_opened");
  };

  const handleCTA = (cta: string, path?: string) => {
    trackEvent("ai_chat_cta_click", { cta });
    logEvent("cta_click", { cta, path });
  };

  // Detect lead intent from the latest user message and (once per session) prompt for contact details.
  const LEAD_PATTERNS: Record<string, RegExp[]> = {
    booking: [/\bbook\b/i, /\bappointment\b/i, /\bschedule\b/i, /\bsession\b/i, /\bavailab/i, /\btherapist\b/i],
    pricing: [/\bprice\b/i, /\bcost\b/i, /\bhow much\b/i, /\bfee\b/i, /\bafford/i],
    callback: [/\bcall me\b/i, /\bcontact me\b/i, /\bcall back\b/i, /\bring me\b/i],
  };
  const detectIntent = (text: string): string | null => {
    for (const [intent, pats] of Object.entries(LEAD_PATTERNS)) {
      if (pats.some(p => p.test(text))) return intent;
    }
    return null;
  };

  useEffect(() => {
    if (leadPromptShown || leadPromptDismissed || leadSubmitted || highRisk) return;
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    const intent = detectIntent(lastUser.content);
    if (intent || (distress && messages.filter(m => m.role === "user").length >= 2)) {
      setLeadIntent(intent || "support");
      setLeadPromptShown(true);
      logEvent("lead_prompt_shown", { intent: intent || "support" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, distress, highRisk]);

  const submitLead = async () => {
    setLeadError(null);
    if (!leadPhone.trim() && !leadEmail.trim()) {
      setLeadError("Please share a phone number or email so we can reach you.");
      return;
    }
    if (leadEmail.trim() && !/^\S+@\S+\.\S+$/.test(leadEmail.trim())) {
      setLeadError("That email doesn't look right.");
      return;
    }
    setLeadSubmitting(true);
    try {
      const { error } = await supabase.from("chat_leads").insert({
        session_id: sessionId,
        anonymous_id: getAnonId(),
        name: leadName.trim() || null,
        phone: leadPhone.trim() || null,
        email: leadEmail.trim() || null,
        intent: leadIntent,
        message: leadMsg.trim() || null,
        source_path: window.location.pathname,
      });
      if (error) throw error;
      setLeadSubmitted(true);
      setShowLeadForm(false);
      trackEvent("ai_chat_lead_captured", { intent: leadIntent });
      logEvent("lead_captured", { intent: leadIntent });
      // Notify admin via email (fire-and-forget; don't block UX on email).
      supabase.functions.invoke("notify-chat-event", {
        body: {
          kind: "new_lead",
          session_id: sessionId,
          anonymous_id: getAnonId(),
          source_path: window.location.pathname,
          name: leadName.trim() || undefined,
          phone: leadPhone.trim() || undefined,
          email: leadEmail.trim() || undefined,
          intent: leadIntent,
          message: leadMsg.trim() || undefined,
        },
      }).catch((e) => console.warn("notify-chat-event failed:", e));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Thanks! 💙 We've got your details and someone from InnerSpark will reach out soon. In the meantime, feel free to keep chatting or [book a session](/book-therapist).",
      }]);
    } catch (e) {
      setLeadError(e instanceof Error ? e.message : "Couldn't send. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        >
          {/* Teaser bubble */}
          <motion.button
            onClick={handleOpen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="hidden sm:flex items-center gap-2 bg-background border border-border rounded-2xl rounded-br-sm pl-3 pr-4 py-2 shadow-lg hover:shadow-xl text-left max-w-[240px]"
            aria-label="Open chat with Amani"
          >
            <span className="text-xs leading-snug">
              <span className="font-semibold text-foreground">Hi, I'm Amani 👋</span>
              <span className="block text-muted-foreground">Need a hand? Let's chat!</span>
            </span>
          </motion.button>

          {/* Avatar button */}
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
            aria-label="Open support chat"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
            <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-xl ring-4 ring-background overflow-hidden">
              <img
                src={amaniAvatar}
                alt="Amani, your InnerSpark care assistant"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </span>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-background" />
            {/* Sparkle badge */}
            <span className="absolute -top-1 -left-1 flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-900 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto z-[60] sm:w-[380px] w-auto h-[min(80dvh,600px)] sm:h-[min(620px,calc(100dvh-6rem))] max-h-[calc(100dvh-5rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* CRISIS OVERLAY — full takeover when high-risk detected */}
            {highRisk && !crisisDismissed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col bg-gradient-to-b from-red-50 to-background"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-red-600 text-white">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5" />
                    <div className="font-bold text-sm">You're not alone</div>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 hover:bg-white/10 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                      <Heart className="w-7 h-7 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-900">We hear you. Please reach out now.</h3>
                    <p className="text-sm text-red-900/80 mt-1">
                      What you're feeling is real, and help is just one tap away. Talk to a real person — right now.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/256792085773?text=Hi%2C%20I%20need%20to%20talk%20to%20someone%20at%20InnerSpark%20urgently"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCTA("crisis_whatsapp")}
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fb558] text-white font-bold py-4 rounded-xl shadow-lg text-base"
                  >
                    <Phone className="w-5 h-5" /> WhatsApp InnerSpark Now
                  </a>

                  <a
                    href="tel:0800212121"
                    onClick={() => handleCTA("crisis_helpline")}
                    className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg text-base"
                  >
                    <PhoneCall className="w-5 h-5" /> Call Butabika Helpline
                    <span className="text-xs font-normal opacity-90">(0800-21-21-21)</span>
                  </a>

                  <Link
                    to="/book-therapist"
                    onClick={() => { handleCTA("crisis_book"); setOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg text-base"
                  >
                    <Calendar className="w-5 h-5" /> Book a Therapist Today
                  </Link>

                  <div className="bg-white/70 border border-red-200 rounded-xl p-3 text-xs text-red-900 leading-relaxed">
                    <div className="font-semibold mb-1">While you wait — try this 60-second breath:</div>
                    Breathe in slowly through your nose for 4 seconds. Hold for 4. Breathe out through your mouth for 6. Repeat 4 times. You are safe in this moment. 💙
                  </div>

                  <p className="text-[11px] text-center text-red-900/70">
                    If you are in immediate danger, please call your local emergency services right away.
                  </p>

                  <button
                    onClick={() => setCrisisDismissed(true)}
                    className="block mx-auto text-xs text-muted-foreground underline hover:text-foreground pt-2"
                  >
                    Continue chatting instead
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40 bg-white/10">
                    <img
                      src={amaniAvatar}
                      alt={`${ASSISTANT_NAME} avatar`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm leading-tight flex items-center gap-1.5 truncate">
                    {ASSISTANT_NAME}
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  </div>
                  <div className="text-[11px] opacity-90 flex items-center gap-1 truncate">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    InnerSpark • {ASSISTANT_ROLE}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="px-3 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>This is a support assistant, not a licensed therapist. For professional help, please book a session.</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-muted/30">
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const { text, chips } = m.role === "assistant"
                  ? parseChips(m.content)
                  : { text: m.content, chips: [] as Chip[] };
                const showChips = m.role === "assistant" && isLast && !loading && chips.length > 0;
                return (
                  <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : m.flagged
                            ? "bg-red-50 border border-red-200 text-red-900 rounded-bl-sm"
                            : "bg-background border border-border rounded-bl-sm"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-a:text-primary">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    {m.role === "assistant" && m.tools && m.tools.length > 0 && (
                      <div className="mt-1 text-[10px] text-muted-foreground italic">
                        🔧 Used live data: {m.tools.join(", ")}
                      </div>
                    )}
                    </div>
                    {showChips && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                        {chips.map((c, idx) => {
                          const isUrl = c.target.startsWith("http");
                          const isPath = c.target.startsWith("/");
                          if (isUrl) {
                            return (
                              <a
                                key={idx}
                                href={c.target}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleCTA("inline_chip_url", c.target)}
                                className="text-xs px-2.5 py-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 rounded-full transition-colors"
                              >
                                {c.label}
                              </a>
                            );
                          }
                          if (isPath) {
                            return (
                              <Link
                                key={idx}
                                to={c.target}
                                onClick={() => { handleCTA("inline_chip_path", c.target); setOpen(false); }}
                                className="text-xs px-2.5 py-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 rounded-full transition-colors"
                              >
                                {c.label}
                              </Link>
                            );
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => { handleCTA("inline_chip_followup", c.label); sendMessage(c.target); }}
                              className="text-xs px-2.5 py-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 rounded-full transition-colors"
                            >
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Distress / High risk CTAs */}
            {(highRisk || distress) && (
              <div className="px-3 py-2 bg-red-50 border-t border-red-200 flex flex-col gap-2">
                <div className="text-xs font-semibold text-red-900">
                  {highRisk ? "We're here for you — please reach out now:" : "Need to talk to someone?"}
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/256792085773?text=Hi%2C%20I%20need%20to%20talk%20to%20someone%20at%20InnerSpark"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCTA("whatsapp_emergency")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-bold py-2 rounded-lg"
                  >
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Now
                  </a>
                  <Link
                    to="/book-therapist"
                    onClick={() => { handleCTA("book_emergency"); setOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Therapist
                  </Link>
                </div>
              </div>
            )}

            {/* Quick replies (only at start) */}
            {messages.length <= 1 && !loading && (
              <div className="px-3 py-2 border-t border-border flex flex-wrap gap-1.5 bg-background">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.text)}
                    className="text-xs px-2.5 py-1.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors border border-border"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Persistent CTA row */}
            <div className="px-3 py-2 border-t border-border flex gap-2 bg-background">
              <Link
                to="/book-therapist"
                onClick={() => handleCTA("book_persistent")}
                className="flex-1 text-center text-xs font-medium py-1.5 px-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                Book a session
              </Link>
              <Link
                to="/wellbeing-check"
                onClick={() => handleCTA("wellbeing_persistent")}
                className="flex-1 text-center text-xs font-medium py-1.5 px-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                Free check
              </Link>
            </div>

            {/* Lead capture prompt / form */}
            {leadPromptShown && !leadPromptDismissed && !leadSubmitted && !showLeadForm && (
              <div className="px-3 py-2 border-t border-border bg-primary/5 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-xs flex-1 leading-snug">
                  Want a real person from InnerSpark to follow up with you?
                </div>
                <button
                  onClick={() => { setShowLeadForm(true); logEvent("lead_form_opened"); }}
                  className="text-xs font-bold px-2.5 py-1 bg-primary text-primary-foreground rounded-full hover:opacity-90"
                >
                  Yes
                </button>
                <button
                  onClick={() => { setLeadPromptDismissed(true); logEvent("lead_prompt_dismissed"); }}
                  className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}

            {showLeadForm && !leadSubmitted && (
              <div className="px-3 py-3 border-t border-border bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-primary" /> Leave your details
                  </div>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close form"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  maxLength={120}
                  className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Phone (e.g. 0792 085 773)"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    maxLength={30}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    maxLength={120}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <textarea
                  placeholder="What's on your mind? (optional)"
                  value={leadMsg}
                  onChange={(e) => setLeadMsg(e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {leadError && (
                  <div className="text-[11px] text-red-600">{leadError}</div>
                )}
                <Button
                  onClick={submitLead}
                  disabled={leadSubmitting}
                  size="sm"
                  className="w-full text-xs h-8"
                >
                  {leadSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                  Send my details
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Private. Used only by InnerSpark to follow up with you.
                </p>
              </div>
            )}

            {leadSubmitted && (
              <div className="px-3 py-2 border-t border-border bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4" /> Got it — we'll be in touch soon. 💙
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="px-3 py-2 border-t border-border flex gap-2 bg-background"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={1000}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-full flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;