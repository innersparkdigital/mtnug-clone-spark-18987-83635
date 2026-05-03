import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Loader2, ShieldCheck, Heart, Clock, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const MAX_SECONDS = 180; // 3 minutes

const emailSchema = z.string().trim().email().max(255);

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
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
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
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setSeconds(0);
      setAudioBlob(null);
      setAudioUrl(null);
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
  };

  const reset = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
  };

  const submit = async () => {
    if (!audioBlob) {
      toast({ title: "Please record your whisper first", variant: "destructive" });
      return;
    }
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Please enter a valid email", description: "We need it to send your reply.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("audio", audioBlob, "whisper.webm");
      fd.append("email", parsed.data);
      fd.append("duration", String(seconds));
      fd.append("topic_hint", topic.slice(0, 200));

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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <Card className="border-primary/20 shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Your Whisper is safely with us</h1>
              <p className="text-muted-foreground mb-6">
                A licensed therapist will listen and reply with a personal voice note within 24 hours.
                We've also emailed you a private link.
              </p>
              <Link to={`/whisper/${submittedToken}`}>
                <Button size="lg" className="rounded-full">View my Whisper page</Button>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">New · Anonymous</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Whisper</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Record a 3-minute voice note. A licensed therapist will reply — anonymously,
            with their own voice — within 24 hours. No account. No judgment.
          </p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              Speak freely
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 rounded-2xl p-8 text-center">
              {!recording && !audioBlob && (
                <Button onClick={start} size="lg" className="rounded-full h-20 w-20 p-0">
                  <Mic className="w-8 h-8" />
                </Button>
              )}
              {recording && (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-2xl">
                      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 03:00</span>
                  </div>
                  <Button onClick={stop} size="lg" variant="destructive" className="rounded-full">
                    <Square className="w-5 h-5 mr-2" /> Stop
                  </Button>
                </>
              )}
              {!recording && audioBlob && audioUrl && (
                <div className="space-y-3">
                  <audio controls src={audioUrl} className="w-full" />
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={reset}>Record again</Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Max 3 minutes. We never publish your recording.
              </p>
            </div>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Your email (private — only used to send your reply)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
              <Input
                placeholder="Optional: a few words about what you'd like to talk about"
                value={topic}
                maxLength={200}
                onChange={(e) => setTopic(e.target.value)}
                disabled={submitting}
              />
            </div>

            <Button
              onClick={submit}
              disabled={submitting || !audioBlob}
              size="lg"
              className="w-full rounded-full"
            >
              {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending…</> : "Send my Whisper"}
            </Button>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-muted-foreground">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-primary" /> Anonymous
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-4 h-4 text-primary" /> Reply within 24h
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart className="w-4 h-4 text-primary" /> Real therapist
              </div>
            </div>
          </CardContent>
        </Card>
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
                    We'll email you the moment it's ready. Usually within 24 hours.
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