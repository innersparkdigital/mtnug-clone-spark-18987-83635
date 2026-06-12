import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Loader2, ShieldCheck, Heart, Clock, Send, Trash2, MessageCircle, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const MAX_SECONDS = 180; // 3 minutes

const emailSchema = z.string().trim().email().max(255);
const whatsappSchema = z.string().trim().regex(/^\+?\d[\d\s-]{7,}$/, "Enter a valid WhatsApp number");

const Whisper = () => {
  const { token } = useParams();
  if (token) return <WhisperReplyView token={token} />;
  return <WhisperRecorder />;
};

function WhisperRecorder() {
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [textNote, setTextNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [levels, setLevels] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setSeconds(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setLevels([]);
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setLevels((prev) => [...prev.slice(-39), Math.min(100, Math.round((avg / 255) * 100))]);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {}
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stop();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      toast({
        title: "Microphone access needed",
        description: "Please allow microphone access to record a whisper.",
        variant: "destructive",
      });
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const reset = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    setLevels([]);
  };

  const submit = async () => {
    if (!audioBlob && !textNote.trim()) {
      toast({ title: "Add a voice note or a written message first", variant: "destructive" });
      return;
    }
    let waValue = "";
    let emailValue = "";
    if (channel === "whatsapp") {
      const p = whatsappSchema.safeParse(whatsapp);
      if (!p.success) {
        setShowDetails(true);
        toast({ title: "Enter your WhatsApp number", description: "We'll reply privately on WhatsApp.", variant: "destructive" });
        return;
      }
      waValue = p.data;
    } else {
      const p = emailSchema.safeParse(email);
      if (!p.success) {
        setShowDetails(true);
        toast({ title: "Please enter a valid email", description: "We need it to send your reply.", variant: "destructive" });
        return;
      }
      emailValue = p.data;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      if (audioBlob) {
        fd.append("audio", audioBlob, "whisper.webm");
      } else {
        // submit-whisper still requires an audio file; send a tiny placeholder
        fd.append("audio", new Blob([new Uint8Array(1)], { type: "audio/webm" }), "whisper.webm");
      }
      fd.append("reply_channel", channel);
      if (waValue) fd.append("whatsapp_number", waValue);
      if (emailValue) fd.append("email", emailValue);
      fd.append("duration", String(seconds));
      fd.append("topic_hint", (textNote.trim() || topic).slice(0, 200));

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-whisper`;
      const res = await fetch(url, {
        method: "POST",
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmittedToken(data.public_token);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      toast({ title: "Could not send your whisper", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedToken) {
    const isWa = channel === "whatsapp";
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-md mx-auto px-4 py-12">
          <Card className="border-primary/20 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                {isWa ? <MessageCircle className="w-10 h-10 text-primary" /> : <Heart className="w-10 h-10 text-primary" />}
              </div>
              <h1 className="text-2xl font-bold mb-3">Your Whisper is with us 🤍</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                A licensed therapist will listen and reply within 24 hours
                {isWa ? " on WhatsApp." : " by email."} Your message is private — no name, no profile.
              </p>
              <Link to={`/whisper/${submittedToken}`}>
                <Button size="lg" className="rounded-full w-full">View my Whisper page</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Whisper — Free Private Therapist Reply on WhatsApp | InnerSpark</title>
        <meta name="description" content="Whisper a voice note. A licensed Ugandan therapist replies privately on WhatsApp within 24 hours — free, no signup. Email reply also available." />
        <meta name="keywords" content="WhatsApp therapy Uganda, private therapist reply, voice therapy Africa, Whisper InnerSpark, free mental health support" />
        <link rel="canonical" href="https://www.innersparkafrica.com/whisper" />
        <meta property="og:title" content="Whisper — Private Therapist Reply on WhatsApp in 24h" />
        <meta property="og:description" content="Too heavy to type? Whisper it. A real licensed Ugandan therapist replies privately on WhatsApp within 24 hours — free." />
        <meta property="og:url" content="https://www.innersparkafrica.com/whisper" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Whisper — Private Voice Therapy Reply on WhatsApp",
          serviceType: "Private mental health support",
          provider: { "@type": "Organization", name: "InnerSpark Africa", url: "https://www.innersparkafrica.com" },
          areaServed: ["Uganda", "Africa"],
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          url: "https://www.innersparkafrica.com/whisper",
          description: "Record a 3-minute voice note and receive a private reply from a licensed Ugandan therapist on WhatsApp within 24 hours.",
        })}</script>
      </Helmet>
      <Header />
      <main className="max-w-md mx-auto px-3 py-6 sm:py-10">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-primary/10 bg-card">
          {/* Chat header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold leading-tight">InnerSpark Therapist</div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Listening · replies in 24h
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-primary-foreground/15 text-primary-foreground border-0">
              Private
            </Badge>
          </div>

          {/* Chat body */}
          <div className="bg-muted/20 px-4 py-5 space-y-3 min-h-[340px]">
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="max-w-[80%] bg-background rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                <p className="text-sm leading-relaxed">
                  Hi 🤍 You're safe here. Tap the mic and say whatever's on your heart — a real therapist will reply within 24 hours.
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">No name needed</p>
              </div>
            </div>

            {audioUrl && !recording && (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2 shadow-sm">
                  <audio controls src={audioUrl} className="w-full max-w-[220px]" />
                  <div className="flex items-center justify-between mt-1 text-[10px] opacity-80">
                    <span>{timeStr}</span>
                    <button onClick={reset} className="inline-flex items-center gap-1 hover:opacity-100 opacity-80">
                      <Trash2 className="w-3 h-3" /> Re-record
                    </button>
                  </div>
                </div>
              </div>
            )}

            {recording && (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse" />
                    <span className="font-mono text-sm">{timeStr}</span>
                    <span className="text-[10px] opacity-70">/ 03:00</span>
                  </div>
                  <div className="flex items-end gap-[2px] h-8">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const v = levels[i] ?? 0;
                      return (
                        <span
                          key={i}
                          className="w-1 rounded-full bg-primary-foreground/80"
                          style={{ height: `${Math.max(4, v)}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <div className="inline-flex rounded-full bg-background p-1 shadow-sm border">
                <button
                  onClick={() => setChannel("whatsapp")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${channel === "whatsapp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Reply on WhatsApp
                </button>
                <button
                  onClick={() => setChannel("email")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${channel === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Reply by email
                </button>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="bg-background border-t px-3 py-3 space-y-2">
            {showDetails && (
              <div className="space-y-2 pb-1">
                {channel === "whatsapp" ? (
                  <Input
                    inputMode="tel"
                    placeholder="Your WhatsApp number e.g. +256 7XX XXX XXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={submitting}
                    className="rounded-full"
                  />
                ) : (
                  <Input
                    type="email"
                    placeholder="Your email (private)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="rounded-full"
                  />
                )}
                <Input
                  placeholder="Optional: a few words about what's on your mind"
                  value={topic}
                  maxLength={200}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={submitting}
                  className="rounded-full"
                />
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                type="text"
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
                placeholder={recording ? "Recording…" : (audioBlob ? "Add a written note (optional)" : "Or type your message…")}
                disabled={recording || submitting}
                maxLength={500}
                className="flex-1 h-11 rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                onFocus={() => setShowDetails(true)}
              />
              {!recording ? (
                <button
                  onClick={() => { setShowDetails(true); start(); }}
                  disabled={submitting}
                  className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition active:scale-95"
                  aria-label="Record voice note"
                >
                  <Mic className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="h-11 w-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-pulse"
                  aria-label="Stop recording"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={submit}
                disabled={submitting || recording || (!audioBlob && !textNote.trim())}
                className="h-11 w-11 rounded-full bg-foreground text-background flex items-center justify-center shadow disabled:opacity-30 active:scale-95 transition"
                aria-label="Send whisper"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              {showDetails ? "Hide details" : `Set ${channel === "whatsapp" ? "WhatsApp number" : "email"} to receive your reply`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 text-center text-[11px] text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-primary" /> Private
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-4 h-4 text-primary" /> Reply in 24h
          </div>
          <div className="flex flex-col items-center gap-1">
            <CheckCheck className="w-4 h-4 text-primary" /> Real therapist
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-4 max-w-xs mx-auto">
          Whisper is free. Max 3 minutes per voice note. We never publish your recording or share your number with anyone outside our licensed team.
        </p>
      </main>
      <Footer />
    </div>
  );
}

function WhisperReplyView({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedRef = useRef(false);

  const track = (event_type: string) => {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-whisper-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ token, event_type }),
      keepalive: true,
    }).catch(() => {});
  };

  useEffect(() => {
    const load = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-whisper-reply?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Could not load");
        setData(j);
        if (j?.status === 'replied') track('reply_opened');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Your Whisper Reply | InnerSpark Africa</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Whisper</h1>
          <p className="text-muted-foreground">A private space for you and your reply.</p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">{error}</CardContent></Card>
        )}
        {data && (
          <Card className="shadow-lg border-primary/10">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <Badge variant={data.status === "replied" ? "default" : "secondary"}>
                  {data.status === "replied" ? "Reply ready" : data.status === "in_review" ? "A therapist is listening" : "Awaiting review"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Sent {new Date(data.created_at).toLocaleString()}
                </span>
              </div>

              {data.status !== "replied" && (
                <div className="bg-muted/30 rounded-xl p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="font-medium">Your therapist is preparing a thoughtful reply.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll reach you on WhatsApp (or email) the moment it's ready. Usually within 24 hours.
                  </p>
                </div>
              )}

              {data.status === "replied" && (
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-xl p-5">
                    <p className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" /> A reply for you
                    </p>
                    {data.reply_audio_url && (
                      <audio
                        ref={audioRef}
                        controls
                        src={data.reply_audio_url}
                        className="w-full mb-3"
                        onPlay={() => { if (!playedRef.current) { playedRef.current = true; track('audio_played'); } }}
                      />
                    )}
                    {data.reply_text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.reply_text}</p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      If this resonates, you can continue the conversation in a private session.
                    </p>
                    <Link to="/specialists" onClick={() => track('cta_book')}>
                      <Button className="w-full rounded-full" size="lg">
                        Book a private session
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Whisper;