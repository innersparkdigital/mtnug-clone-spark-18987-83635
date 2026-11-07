import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LifeBuoy, Send, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import amaniAvatar from "@/assets/amani-avatar.jpg";
import { DEFAULT_ORG, cleanOrgKey, recordAmaniEvent, type AmaniEvent } from "@/lib/amaniApi";
import { GREETING, QUICK_REPLIES, isCrisisMessage } from "@/lib/amaniDemo";
import UrgentHelpModal from "./UrgentHelpModal";

const SITE = "https://www.innersparkafrica.com";
const COUNSELLOR_PATH = "/teletherapy";

/** Optional override: send visitors to another Amani service instead of the built-in one. Only https (or localhost). */
function getEmbedUrl(): string | null {
  const raw = (import.meta.env.VITE_AMANI_EMBED_URL as string | undefined)?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost")) return url.toString();
  } catch {
    /* fall through to the built-in Amani service */
  }
  return null;
}

type Msg = { id: number; role: "user" | "amani" | "crisis" | "notice"; text: string };
type Turn = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/amani-chat`;

/** Asks the Amani service for a reply. Message text is sent only to write the reply; it is never stored. */
async function askAmani(org: string | null, turns: Turn[]): Promise<{ reply?: string; crisis?: boolean; suggestCounsellor?: boolean; error?: string }> {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  try {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 30000);
    const r = await fetch(CHAT_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", ...(key ? { apikey: key, Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({ org: org ?? DEFAULT_ORG, messages: turns }),
    });
    window.clearTimeout(timer);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { error: (j as { error?: string }).error || "unavailable" };
    return j as { reply?: string; crisis?: boolean; suggestCounsellor?: boolean };
  } catch {
    return { error: "unavailable" };
  }
}

export interface AmaniChatProps {
  /** floating = round button + panel (full screen on mobile). inline = fills its container. */
  variant?: "floating" | "inline";
  /** Organisation key used for anonymous counts. Use null to count nothing. */
  orgKey?: string | null;
  /** True when shown inside a partner website's iframe. */
  embedded?: boolean;
  /** Adds a close button to the header (the floating variant always has one). */
  onClose?: () => void;
  className?: string;
}

const startedFallback = new Set<string>();
function markStarted(org: string | null): boolean {
  const key = `amani_started_${org ?? "none"}`;
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
    return true;
  } catch {
    if (startedFallback.has(key)) return false;
    startedFallback.add(key);
    return true;
  }
}

function AmaniPanel({
  orgKey,
  embedded,
  onClose,
  fill,
}: {
  orgKey: string | null;
  embedded: boolean;
  onClose?: () => void;
  fill: boolean;
}) {
  const navigate = useNavigate();
  const embedUrl = getEmbedUrl();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [wantsCounsellor, setWantsCounsellor] = useState(false);
  const [thinking, setThinking] = useState(false);
  const history = useRef<Turn[]>([]);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [urgentOpen, setUrgentOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const idRef = useRef(1);
  const timers = useRef<number[]>([]);
  const promptCounted = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const count = useCallback((event: AmaniEvent) => recordAmaniEvent(orgKey, event), [orgKey]);

  useEffect(() => {
    if (markStarted(orgKey)) count("chat_started");
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, [orgKey, count]);

  const lastRole = messages[messages.length - 1]?.role;
  const showPrompt =
    !embedUrl && !promptDismissed && lastRole !== "crisis" && (userCount >= 3 || wantsCounsellor);

  useEffect(() => {
    if (showPrompt && !promptCounted.current) {
      promptCounted.current = true;
      count("counsellor_prompt_shown");
    }
  }, [showPrompt, count]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, showPrompt]);

  const go = (path: string) => {
    if (embedded) window.open(`${SITE}${path}`, "_blank", "noopener,noreferrer");
    else navigate(path);
  };

  const nextStep = () => {
    count("next_step_clicked");
    go(COUNSELLOR_PATH);
  };

  const openUrgent = () => {
    count("urgent_help_opened");
    setUrgentOpen(true);
  };

  const send = async (raw: string, viaChip = false) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setInput("");
    setUserCount((n) => n + 1);
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text }]);
    count("message_sent");
    if (viaChip) count("chip_used");

    // Safety first: a crisis message gets the safety card only and is never sent to the AI.
    if (isCrisisMessage(text)) {
      count("crisis_card_shown");
      setMessages((m) => [...m, { id: idRef.current++, role: "crisis", text: "" }]);
      return;
    }

    history.current = [...history.current, { role: "user" as const, content: text }].slice(-14);
    setThinking(true);
    const res = await askAmani(orgKey, history.current);
    setThinking(false);

    if (res.crisis) {
      history.current = history.current.slice(0, -1);
      count("crisis_card_shown");
      setMessages((m) => [...m, { id: idRef.current++, role: "crisis", text: "" }]);
      return;
    }
    if (res.reply) {
      history.current = [...history.current, { role: "assistant" as const, content: res.reply }].slice(-14);
      if (res.suggestCounsellor) setWantsCounsellor(true);
      setMessages((m) => [...m, { id: idRef.current++, role: "amani", text: res.reply as string }]);
      return;
    }
    history.current = history.current.slice(0, -1);
    const text2 =
      res.error === "paused" || res.error === "unknown"
        ? "Amani is not available on this site right now. If you need support, please use Urgent help or talk to a counsellor."
        : res.error === "limit" || res.error === "slow_down"
          ? "Amani is very busy right now. Please try again in a few minutes. If you need help now, tap Urgent help."
          : "I could not reach Amani just now. Please try again in a moment. If you need help now, tap Urgent help.";
    setMessages((m) => [...m, { id: idRef.current++, role: "notice", text: text2 }]);
  };

  return (
    <div className={cn("flex min-h-0 flex-col bg-background", fill ? "h-full" : "")}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <img src={amaniAvatar} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
            <span className="truncate">Amani, your wellness companion</span>
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">AI</Badge>
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={openUrgent}
          className="shrink-0 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <LifeBuoy className="mr-1 h-4 w-4" aria-hidden="true" /> Urgent help
        </Button>
        {onClose && (
          <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Close chat" className="shrink-0">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Always visible */}
      <p role="note" className="border-b bg-amber-50 px-4 py-2 text-xs leading-snug text-amber-900">
        Amani is an AI assistant, not a therapist. It cannot diagnose or treat. If you are in danger, tap Urgent help.
      </p>

      {/* Body */}
      {embedUrl ? (
        <iframe
          title="Amani chat"
          src={embedUrl}
          className="min-h-0 w-full flex-1 border-0"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />
      ) : (
        <>
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="amani" text={GREETING} />

            {userCount === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => send(c.label, true)}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-left text-sm text-foreground transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) =>
              m.role === "crisis" ? (
                <section
                  key={m.id}
                  role="alert"
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-950"
                >
                  <p className="text-base font-semibold">You are not alone. Please talk to someone now.</p>
                  <p className="mt-1 text-sm">
                    If you are in danger or thinking about ending your life, please reach out right now. Real people can help.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button type="button" onClick={openUrgent} className="flex-1 bg-red-600 text-white hover:bg-red-700">
                      <LifeBuoy className="mr-2 h-4 w-4" aria-hidden="true" /> Urgent help
                    </Button>
                    <Button type="button" variant="outline" onClick={nextStep} className="flex-1 bg-white">
                      Talk to a counsellor
                    </Button>
                  </div>
                </section>
              ) : m.role === "notice" ? (
                <p key={m.id} role="status" className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">{m.text}</p>
              ) : (
                <Bubble key={m.id} role={m.role} text={m.text} />
              ),
            )}

            {thinking && (
              <div className="flex justify-start" aria-label="Amani is typing">
                <span className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">Amani is thinking…</span>
              </div>
            )}

            {showPrompt && (
              <div className="rounded-2xl border bg-muted/50 p-3">
                <p className="text-sm font-medium">Would you like to talk to a licensed counsellor?</p>
                <div className="mt-2 flex gap-2">
                  <Button type="button" size="sm" onClick={nextStep}>Book a counsellor</Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      count("counsellor_prompt_dismissed");
                      setPromptDismissed(true);
                    }}
                  >
                    Not now
                  </Button>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t px-3 py-3"
          >
            <label htmlFor="amani-input" className="sr-only">Type a message to Amani</label>
            <input
              id="amani-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={thinking}
              maxLength={500}
              autoComplete="off"
              placeholder="Type here…"
              className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={!input.trim() || thinking} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-2 text-[11px] text-muted-foreground">
        <button
          type="button"
          onClick={() => {
            count("privacy_notice_opened");
            setPrivacyOpen(true);
          }}
          className="underline underline-offset-2 hover:text-foreground"
        >
          How your information is used
        </button>
        <span>Provided by InnerSpark Africa</span>
      </div>

      <UrgentHelpModal open={urgentOpen} onOpenChange={setUrgentOpen} embedded={embedded} />

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /> How your information is used
            </DialogTitle>
            <DialogDescription>In plain words:</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>You do not need an account to talk to Amani.</li>
            <li>Your conversations are not sold. They are not shared with sponsors, partners or PurpleMinds.</li>
            <li>
              To write a reply, what you type is sent securely to an AI service. InnerSpark does not save your messages
              in any database.
            </li>
            <li>No identifiable data is shared with sponsors or PurpleMinds.</li>
            <li>
              We only count anonymous actions, such as "a chat was started" or "a next step was clicked". These are
              numbers, never your words.
            </li>
            <li>Amani is provided by InnerSpark Africa.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "amani"; text: string }) {
  const mine = role === "user";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {text}
      </p>
    </div>
  );
}

export default function AmaniChat({
  variant = "floating",
  orgKey = DEFAULT_ORG,
  embedded = false,
  onClose,
  className,
}: AmaniChatProps) {
  const org = cleanOrgKey(orgKey);
  const [open, setOpen] = useState(false);

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex w-full flex-col overflow-hidden bg-background",
          embedded ? "h-screen" : "h-[620px] rounded-2xl border shadow-sm",
          className,
        )}
      >
        <AmaniPanel orgKey={org} embedded={embedded} onClose={onClose} fill />
      </div>
    );
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Amani chat"
          className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-background sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[640px] sm:max-h-[calc(100vh-7rem)] sm:w-[400px] sm:rounded-2xl sm:border sm:shadow-2xl"
        >
          <AmaniPanel orgKey={org} embedded={embedded} onClose={() => setOpen(false)} fill />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Talk to Amani"
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-primary p-1.5 pr-5 text-primary-foreground shadow-lg transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          open && "max-sm:hidden",
          className,
        )}
      >
        <img src={amaniAvatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full border-2 border-white/60 object-cover" />
        <span className="text-sm font-semibold">Talk to Amani</span>
      </button>
    </>
  );
}
