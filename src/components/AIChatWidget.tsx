import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Phone, Calendar, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

type Msg = { role: "user" | "assistant"; content: string; flagged?: boolean };
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
    "Hi 💙 I'm your InnerSpark Support Assistant. I can help you understand our services, book a therapist, or take a free wellbeing check.\n\n*This is a support assistant, not a licensed therapist. For professional help, please book a session.*",
};

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [highRisk, setHighRisk] = useState(false);
  const [distress, setDistress] = useState(false);
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
        throw new Error(errText || `HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let isHighRisk = false;
      let accumulated = "";

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
            } else if (evt.type === "delta" && evt.content) {
              accumulated += evt.content;
              setMessages(prev => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: accumulated, flagged: isHighRisk };
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

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open support chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline font-medium text-sm">Chat with us</span>
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] h-[80vh] sm:h-[600px] max-h-[calc(100vh-2rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">InnerSpark Assistant</div>
                  <div className="text-[10px] opacity-90">Support guide • Not a therapist</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:bg-white/10 rounded">
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

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="px-3 py-2 border-t border-border flex gap-2 bg-background"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={1000}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-full flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;