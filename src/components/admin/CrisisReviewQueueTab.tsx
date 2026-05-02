import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertOctagon, MessageSquare, Phone, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type ReviewStatus = "pending" | "contacted" | "resolved";

interface Session {
  id: string;
  anonymous_id: string;
  source_path: string | null;
  user_agent: string | null;
  message_count: number;
  escalated: boolean;
  high_risk_triggered: boolean;
  review_status: ReviewStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
}

interface Message {
  id: string;
  role: string;
  content: string;
  flagged: boolean;
  created_at: string;
}

const STATUS_META: Record<ReviewStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-red-100 text-red-800 border-red-300", icon: AlertOctagon },
  contacted: { label: "Contacted", color: "bg-amber-100 text-amber-800 border-amber-300", icon: Phone },
  resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2 },
};

const CrisisReviewQueueTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("pending");
  const [search, setSearch] = useState("");
  const [openSession, setOpenSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftNotes, setDraftNotes] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("high_risk_triggered", true)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast.error("Failed to load review queue");
    } else {
      setSessions((data || []) as Session[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const counts = useMemo(() => ({
    pending: sessions.filter(s => s.review_status === "pending").length,
    contacted: sessions.filter(s => s.review_status === "contacted").length,
    resolved: sessions.filter(s => s.review_status === "resolved").length,
    total: sessions.length,
  }), [sessions]);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (statusFilter !== "all" && s.review_status !== statusFilter) return false;
      if (search) {
        const hay = `${s.anonymous_id} ${s.source_path || ""}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [sessions, statusFilter, search]);

  const openTranscript = async (s: Session) => {
    setOpenSession(s);
    setDraftNotes(s.review_notes || "");
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", s.id)
      .order("created_at", { ascending: true });
    setMessages((data || []) as Message[]);
  };

  const updateStatus = async (sessionId: string, newStatus: ReviewStatus, notes?: string) => {
    setSavingId(sessionId);
    const { error } = await supabase
      .from("chat_sessions")
      .update({
        review_status: newStatus,
        review_notes: notes ?? undefined,
        reviewed_by: user?.id || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", sessionId);
    setSavingId(null);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    toast.success(`Marked as ${STATUS_META[newStatus].label}`);
    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, review_status: newStatus, review_notes: notes ?? s.review_notes, reviewed_at: new Date().toISOString() }
        : s
    ));
    if (openSession?.id === sessionId) {
      setOpenSession(prev => prev ? { ...prev, review_status: newStatus, review_notes: notes ?? prev.review_notes } : null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["pending", "contacted", "resolved"] as ReviewStatus[]).map(k => {
          const Meta = STATUS_META[k];
          const Icon = Meta.icon;
          return (
            <Card key={k} className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter(k)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{Meta.label}</div>
                  <div className="text-2xl font-bold">{counts[k]}</div>
                </div>
                <Icon className="w-8 h-8 text-muted-foreground/40" />
              </CardContent>
            </Card>
          );
        })}
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter("all")}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">All high-risk</div>
              <div className="text-2xl font-bold">{counts.total}</div>
            </div>
            <AlertOctagon className="w-8 h-8 text-muted-foreground/40" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            Crisis Review Queue
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReviewStatus | "all")}>
              <TabsList>
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="contacted">Contacted ({counts.contacted})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              placeholder="Search anon ID or path..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button variant="outline" size="sm" onClick={fetchSessions}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No high-risk sessions match this filter. 🌿
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">When</th>
                    <th className="text-left py-2 px-2">Anon ID</th>
                    <th className="text-left py-2 px-2">Source</th>
                    <th className="text-left py-2 px-2">Topics</th>
                    <th className="text-center py-2 px-2">Msgs</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => {
                    const Meta = STATUS_META[s.review_status];
                    const Icon = Meta.icon;
                    return (
                      <tr key={s.id} className="border-b hover:bg-muted/30">
                        <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {new Date(s.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 px-2 font-mono text-xs">{s.anonymous_id?.slice(0, 8)}…</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground truncate max-w-[200px]">
                          {s.source_path || "—"}
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {(s.tags || []).slice(0, 4).map(t => (
                              <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t.replace(/_/g, " ")}</Badge>
                            ))}
                            {(!s.tags || s.tags.length === 0) && <span className="text-xs text-muted-foreground">—</span>}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center">{s.message_count}</td>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className={`${Meta.color} gap-1`}>
                            <Icon className="w-3 h-3" /> {Meta.label}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <Button size="sm" variant="ghost" onClick={() => openTranscript(s)}>
                            <MessageSquare className="w-4 h-4 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!openSession} onOpenChange={(o) => !o && setOpenSession(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              High-risk session transcript
            </DialogTitle>
          </DialogHeader>
          {openSession && (
            <>
              <div className="text-xs text-muted-foreground space-y-1 border-b pb-3">
                <div>Started: {new Date(openSession.created_at).toLocaleString()}</div>
                <div>Anon ID: <span className="font-mono">{openSession.anonymous_id}</span></div>
                {openSession.source_path && (
                  <div className="flex items-center gap-1">
                    Source: {openSession.source_path}
                    <a href={openSession.source_path} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {openSession.reviewed_at && (
                  <div>Last reviewed: {new Date(openSession.reviewed_at).toLocaleString()}</div>
                )}
              </div>

              <ScrollArea className="flex-1 pr-3 my-2 max-h-[40vh]">
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : m.flagged
                              ? "bg-red-50 border border-red-200 text-red-900"
                              : "bg-muted"
                        }`}
                      >
                        <div className="text-[10px] opacity-70 mb-0.5">
                          {m.role} · {new Date(m.created_at).toLocaleTimeString()}
                          {m.flagged && " · ⚠️ flagged"}
                        </div>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">No messages.</div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t pt-3 space-y-2">
                <div className="text-xs font-medium">Follow-up notes</div>
                <Textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="e.g. Reached on WhatsApp at 14:05, booked session for Mon 10am."
                  rows={2}
                />
                <div className="flex gap-2 flex-wrap">
                  {(["pending", "contacted", "resolved"] as ReviewStatus[]).map(st => {
                    const Meta = STATUS_META[st];
                    const Icon = Meta.icon;
                    return (
                      <Button
                        key={st}
                        size="sm"
                        variant={openSession.review_status === st ? "default" : "outline"}
                        disabled={savingId === openSession.id}
                        onClick={() => updateStatus(openSession.id, st, draftNotes)}
                      >
                        <Icon className="w-4 h-4 mr-1" /> Mark {Meta.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrisisReviewQueueTab;
