import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Flag, Copy, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  id: string;
  session_code: string;
  therapist_name: string;
  client_name: string | null;
  star_rating: number;
  therapist_fit: string;
  session_addressed: string;
  would_rebook: string;
  would_recommend: string;
  open_comment: string | null;
  flagged_for_review: boolean;
  reviewed_at: string | null;
  submitted_at: string;
}

const SITE = "https://www.innersparkafrica.com";

const buildFeedbackUrl = (sessionCode: string, therapist: string, client: string) => {
  const p = new URLSearchParams();
  if (sessionCode) p.set("session", sessionCode);
  if (therapist) p.set("therapist", therapist);
  if (client) p.set("client", client);
  return `${SITE}/feedback?${p.toString()}`;
};

const FILTERS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

const FeedbackTab = () => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [selected, setSelected] = useState<Feedback | null>(null);

  // Link generator
  const [genSession, setGenSession] = useState("");
  const [genTherapist, setGenTherapist] = useState("");
  const [genClient, setGenClient] = useState("");
  const [genClientPhone, setGenClientPhone] = useState("");

  // Merge
  const [mergeFrom, setMergeFrom] = useState("");
  const [mergeTo, setMergeTo] = useState("");

  const load = async () => {
    setLoading(true);
    let q = supabase.from("session_feedback").select("*").order("submitted_at", { ascending: false });
    if (period !== "all") {
      const since = new Date(Date.now() - parseInt(period) * 86400000).toISOString();
      q = q.gte("submitted_at", since);
    }
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setItems((data as Feedback[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const metrics = useMemo(() => {
    if (!items.length) return { avg: 0, total: 0, rebook: 0, recommend: 0 };
    const avg = items.reduce((s, i) => s + i.star_rating, 0) / items.length;
    const rebook = items.filter((i) => i.would_rebook === "Yes — please book me in").length;
    const recommend = items.filter((i) =>
      ["Definitely yes", "Probably yes"].includes(i.would_recommend),
    ).length;
    return {
      avg: Math.round(avg * 10) / 10,
      total: items.length,
      rebook: Math.round((rebook / items.length) * 100),
      recommend: Math.round((recommend / items.length) * 100),
    };
  }, [items]);

  const alerts = useMemo(() => {
    const notFit = items.filter(
      (i) => i.therapist_fit === "Not the right fit for me" && !i.reviewed_at,
    );
    const lowStar = items.filter((i) => i.star_rating <= 2 && !i.reviewed_at);
    const wantRebook = items.filter((i) => i.would_rebook === "Yes — please book me in");
    return { notFit, lowStar, wantRebook };
  }, [items]);

  const therapistPerf = useMemo(() => {
    const map = new Map<string, Feedback[]>();
    items.forEach((i) => {
      const k = i.therapist_name.trim();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(i);
    });
    return Array.from(map.entries())
      .map(([name, list]) => {
        const avg = list.reduce((s, i) => s + i.star_rating, 0) / list.length;
        const comfort = list.filter((i) => i.therapist_fit.startsWith("Very comfortable") || i.therapist_fit.startsWith("Comfortable")).length;
        const rebook = list.filter((i) => i.would_rebook === "Yes — please book me in").length;
        return {
          name,
          count: list.length,
          avg: Math.round(avg * 10) / 10,
          comfort: Math.round((comfort / list.length) * 100),
          rebook: Math.round((rebook / list.length) * 100),
        };
      })
      .sort((a, b) => b.avg - a.avg);
  }, [items]);

  const copyText = async (text: string, label = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Unable to copy");
    }
  };

  const feedbackUrl = buildFeedbackUrl(genSession, genTherapist, genClient);
  const waMessage = `Hi ${genClient || "[client first name]"}! 💙\n\nWe hope your session with ${genTherapist || "[therapist full name]"} was meaningful. We'd love to hear how it went — your feedback takes just 2 minutes and helps us make every session better.\n\n👉 ${feedbackUrl}\n\nThank you for trusting InnerSpark Africa. 🌿`;

  const markReviewed = async (id: string) => {
    const { error } = await supabase
      .from("session_feedback")
      .update({ reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marked as reviewed");
    setSelected(null);
    load();
  };

  const runMerge = async () => {
    if (!mergeFrom.trim() || !mergeTo.trim()) return toast.error("Enter both names");
    const { data, error } = await supabase.rpc("merge_feedback_therapist_names" as any, {
      _from: mergeFrom.trim(),
      _to: mergeTo.trim(),
    });
    if (error) return toast.error(error.message);
    toast.success(`Merged ${data} record(s)`);
    setMergeFrom("");
    setMergeTo("");
    load();
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Average rating" value={`${metrics.avg} ★`} />
        <MetricCard label="Total submissions" value={metrics.total} />
        <MetricCard label="Would rebook" value={`${metrics.rebook}%`} />
        <MetricCard label="Would recommend" value={`${metrics.recommend}%`} />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-2">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FILTERS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      {/* Alerts */}
      {(alerts.notFit.length > 0 || alerts.lowStar.length > 0) && (
        <div className="rounded-lg p-4 border-l-4" style={{ background: "#FCEBEB", borderColor: "#E24B4A" }}>
          {alerts.notFit.length > 0 && (
            <p className="text-sm text-red-900 mb-1">
              <strong>{alerts.notFit.length}</strong> client(s) selected "Not the right fit" — review and offer a rematch.
              <span className="block text-xs mt-1 text-red-800/80">
                {alerts.notFit.map((i) => `${i.client_name || "Client"} → ${i.therapist_name}`).join(" · ")}
              </span>
            </p>
          )}
          {alerts.lowStar.length > 0 && (
            <p className="text-sm text-red-900">
              <strong>{alerts.lowStar.length}</strong> client(s) gave 2 stars or below — follow up with care.
              <span className="block text-xs mt-1 text-red-800/80">
                {alerts.lowStar.map((i) => `${i.client_name || "Client"} → ${i.therapist_name}`).join(" · ")}
              </span>
            </p>
          )}
        </div>
      )}
      {alerts.wantRebook.length > 0 && (
        <div className="rounded-lg p-4 border-l-4" style={{ background: "#EEF0FD", borderColor: "#3B4FD4" }}>
          <p className="text-sm">
            <strong>{alerts.wantRebook.length}</strong> client(s) want to rebook — follow up to schedule their next session.
            <span className="block text-xs mt-1 text-slate-700">
              {alerts.wantRebook.map((i) => `${i.client_name || "Client"} → ${i.therapist_name}`).join(" · ")}
            </span>
          </p>
        </div>
      )}

      {/* Link generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate feedback link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Session code</label>
              <Input value={genSession} onChange={(e) => setGenSession(e.target.value)} placeholder="e.g. AB20250518" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Therapist full name</label>
              <Input value={genTherapist} onChange={(e) => setGenTherapist(e.target.value)} placeholder="e.g. Janet Kekiconco" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Client first name</label>
              <Input value={genClient} onChange={(e) => setGenClient(e.target.value)} placeholder="e.g. Abigail" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Feedback URL</label>
            <div className="flex gap-2">
              <Input value={feedbackUrl} readOnly className="font-mono text-xs" />
              <Button onClick={() => copyText(feedbackUrl, "Link copied!")} variant="outline">
                <Copy className="h-4 w-4 mr-1" /> Copy link
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">WhatsApp message</label>
            <Textarea value={waMessage} readOnly className="min-h-[140px] text-xs font-mono" />
            <Button onClick={() => copyText(waMessage, "WhatsApp message copied!")} className="mt-2" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" /> Copy WhatsApp message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No feedback submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Stars</TableHead>
                    <TableHead>Fit</TableHead>
                    <TableHead>Rebook</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="text-xs">{new Date(i.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>{i.client_name || "—"}</TableCell>
                      <TableCell className="font-medium">{i.therapist_name}</TableCell>
                      <TableCell><Stars n={i.star_rating} /></TableCell>
                      <TableCell className="text-xs max-w-[180px] truncate">{i.therapist_fit}</TableCell>
                      <TableCell className="text-xs max-w-[160px] truncate">{i.would_rebook}</TableCell>
                      <TableCell>
                        {i.flagged_for_review && !i.reviewed_at && <Flag className="h-4 w-4 text-red-500 fill-red-500" />}
                        {i.reviewed_at && <Badge variant="outline" className="text-xs">Reviewed</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setSelected(i)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Therapist performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Therapist performance</CardTitle>
        </CardHeader>
        <CardContent>
          {therapistPerf.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">No data yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Avg rating</TableHead>
                  <TableHead>Comfort rate</TableHead>
                  <TableHead>Rebook rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {therapistPerf.map((t) => (
                  <TableRow key={t.name}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.count}</TableCell>
                    <TableCell>{t.avg} ★</TableCell>
                    <TableCell>{t.comfort}%</TableCell>
                    <TableCell>{t.rebook}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium mb-2">Merge therapist name variants</p>
            <p className="text-xs text-muted-foreground mb-3">
              Client-typed names may vary (e.g. "Janet" vs "Janet Kekiconco"). Merge variants into a single record.
            </p>
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs text-muted-foreground">From (exact name)</label>
                <Input value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)} placeholder="Janet" />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs text-muted-foreground">To (canonical name)</label>
                <Input value={mergeTo} onChange={(e) => setMergeTo(e.target.value)} placeholder="Janet Kekiconco" />
              </div>
              <Button onClick={runMerge}>Merge</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <Row k="Client" v={selected.client_name || "—"} />
              <Row k="Therapist" v={selected.therapist_name} />
              <Row k="Session" v={selected.session_code} />
              <Row k="Submitted" v={new Date(selected.submitted_at).toLocaleString()} />
              <Row k="Rating" v={<Stars n={selected.star_rating} />} />
              <Row k="Therapist fit" v={selected.therapist_fit} />
              <Row k="Session addressed" v={selected.session_addressed} />
              <Row k="Would rebook" v={selected.would_rebook} />
              <Row k="Would recommend" v={selected.would_recommend} />
              {selected.open_comment && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Open comment</p>
                  <p className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">{selected.open_comment}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selected && !selected.reviewed_at && (
              <Button variant="outline" onClick={() => markReviewed(selected.id)}>Mark as reviewed</Button>
            )}
            {selected && (
              <Button
                onClick={() => {
                  const msg = `Hi ${selected.client_name || ""}, this is InnerSpark Africa following up on your recent session feedback. We appreciate you sharing — would you be open to a quick chat?`;
                  copyText(msg, "Message copied!");
                }}
              >
                <MessageCircle className="h-4 w-4 mr-1" /> Copy WhatsApp follow-up
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const Stars = ({ n }: { n: number }) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className="h-3.5 w-3.5" style={{ fill: i <= n ? "#F2994A" : "transparent", color: i <= n ? "#F2994A" : "#D1D5DB" }} />
    ))}
  </span>
);

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-medium text-right">{v}</span>
  </div>
);

export default FeedbackTab;