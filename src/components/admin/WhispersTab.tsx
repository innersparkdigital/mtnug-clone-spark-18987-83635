import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Square, Headphones, Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Whisper = {
  id: string;
  email: string;
  audio_path: string;
  duration_seconds: number | null;
  topic_hint: string | null;
  status: string;
  reply_text: string | null;
  reply_audio_path: string | null;
  reply_sent_at: string | null;
  created_at: string;
  public_token: string;
};

const STATUSES = ["new", "in_review", "replied", "archived"];

export default function WhispersTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<Whisper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("new");
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [active, setActive] = useState<Whisper | null>(null);

  const load = async () => {
    setLoading(true);
    const q = supabase
      .from("whispers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    const { data, error } = filter === "all" ? await q : await q.eq("status", filter);
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setItems((data as Whisper[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const sign = async (path: string) => {
    if (signedUrls[path]) return signedUrls[path];
    const { data, error } = await supabase.storage.from("whispers").createSignedUrl(path, 3600);
    if (error || !data) {
      toast({ title: "Could not load audio", description: error?.message, variant: "destructive" });
      return null;
    }
    setSignedUrls((p) => ({ ...p, [path]: data.signedUrl }));
    return data.signedUrl;
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("whispers").update({ status }).eq("id", id);
    if (error) return toast({ title: "Update failed", variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
          {STATUSES.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No whispers in this view.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {items.map((w, i) => (
            <WhisperCard
              key={w.id}
              n={i + 1}
              w={w}
              onSign={sign}
              onStatus={setStatus}
              onReply={() => setActive(w)}
            />
          ))}
        </div>
      )}

      {active && (
        <ReplyDialog whisper={active} onClose={() => setActive(null)} onDone={() => { setActive(null); load(); }} onSign={sign} />
      )}
    </div>
  );
}

function WhisperCard({ n, w, onSign, onStatus, onReply }: {
  n: number; w: Whisper;
  onSign: (p: string) => Promise<string | null>;
  onStatus: (id: string, s: string) => void;
  onReply: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <Card>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs text-muted-foreground">#{n} · {format(new Date(w.created_at), "MMM d, h:mm a")}</div>
            <div className="font-semibold">{w.email}</div>
            {w.topic_hint && <div className="text-sm text-muted-foreground">"{w.topic_hint}"</div>}
          </div>
          <Badge variant={w.status === "replied" ? "default" : "secondary"}>{w.status}</Badge>
        </div>

        {!url ? (
          <Button size="sm" variant="outline" onClick={async () => setUrl(await onSign(w.audio_path))}>
            <Headphones className="w-4 h-4 mr-2" /> Listen ({w.duration_seconds || "?"}s)
          </Button>
        ) : (
          <audio controls src={url} className="w-full" />
        )}

        <div className="flex gap-2 flex-wrap">
          {w.status !== "in_review" && w.status !== "replied" && (
            <Button size="sm" variant="secondary" onClick={() => onStatus(w.id, "in_review")}>Mark in review</Button>
          )}
          {w.status !== "replied" && (
            <Button size="sm" onClick={onReply}><Send className="w-4 h-4 mr-2" />Reply</Button>
          )}
          {w.status !== "archived" && (
            <Button size="sm" variant="ghost" onClick={() => onStatus(w.id, "archived")}>Archive</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ReplyDialog({ whisper, onClose, onDone, onSign }: {
  whisper: Whisper;
  onClose: () => void;
  onDone: () => void;
  onSign: (p: string) => Promise<string | null>;
}) {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mr = { current: null as MediaRecorder | null };
  const chunksRef = { current: [] as Blob[] };
  const timer = { current: null as number | null };

  useEffect(() => { onSign(whisper.audio_path).then(setOrigUrl); }, []);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const r = new MediaRecorder(stream);
    chunksRef.current = [];
    r.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
    r.onstop = () => {
      const b = new Blob(chunksRef.current, { type: r.mimeType || "audio/webm" });
      setBlob(b); setBlobUrl(URL.createObjectURL(b));
      stream.getTracks().forEach((t) => t.stop());
    };
    r.start();
    mr.current = r;
    setRecording(true); setSeconds(0);
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stop = () => {
    mr.current?.stop();
    setRecording(false);
    if (timer.current) window.clearInterval(timer.current);
  };

  const submit = async () => {
    if (!blob && !text.trim()) {
      toast({ title: "Add a voice note or text reply", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const fd = new FormData();
      fd.append("whisper_id", whisper.id);
      if (blob) fd.append("audio", blob, "reply.webm");
      if (text.trim()) fd.append("reply_text", text.trim());
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reply-whisper`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${sess.session?.access_token || ""}`,
        },
        body: fd,
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      toast({ title: "Reply sent ✓", description: "The user has been notified." });
      onDone();
    } catch (e: any) {
      toast({ title: "Could not send reply", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-lg w-full my-8">
        <CardHeader>
          <CardTitle>Reply to {whisper.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {origUrl && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original whisper</p>
              <audio controls src={origUrl} className="w-full" />
            </div>
          )}
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            {!recording && !blob && (
              <Button onClick={start}><Mic className="w-4 h-4 mr-2" />Record voice reply</Button>
            )}
            {recording && (
              <div className="space-y-2">
                <div className="font-mono text-xl">{Math.floor(seconds/60).toString().padStart(2,"0")}:{(seconds%60).toString().padStart(2,"0")}</div>
                <Button variant="destructive" onClick={stop}><Square className="w-4 h-4 mr-2" />Stop</Button>
              </div>
            )}
            {!recording && blobUrl && (
              <div className="space-y-2">
                <audio controls src={blobUrl} className="w-full" />
                <Button variant="ghost" size="sm" onClick={() => { setBlob(null); setBlobUrl(null); }}>Re-record</Button>
              </div>
            )}
          </div>
          <Textarea
            placeholder="Optional written note to accompany your voice reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={4000}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}