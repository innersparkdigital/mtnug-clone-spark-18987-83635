import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertOctagon, Download, Eye, ChevronDown, ChevronRight, Check, Minus } from "lucide-react";
import { toast } from "sonner";
import { withTimeout } from "@/lib/rpcTimeout";

interface Log {
  id: string;
  session_date: string;
  is_new_client: boolean;
  service_delivered: string;
  duration: string;
  progress_status: string;
  homework_given: boolean;
  homework_text: string | null;
  next_appt_booked: string;
  next_appt_date: string | null;
  notes: string | null;
  created_at: string;
  therapist_id: string;
  therapist_name: string;
  client_id: string;
  client_name: string;
  client_phone: string | null;
  therapist_email: string | null;
  next_appt_service: string | null;
}

interface HomeworkTask {
  id: string;
  tool_key: string;
  title: string | null;
  therapist_note: string | null;
  due_date: string | null;
  status: string;
  assigned_at: string;
  submitted_at: string | null;
  submission_type: string | null;
  payload: Record<string, any> | null;
  screening_score: number | null;
  screening_severity: string | null;
  mood_score: number | null;
  safety_flag: boolean | null;
}

const CRISIS_STATUSES = new Set(["at_risk", "crisis_activated"]);

const prettyKey = (k: string) =>
  k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const prettyTool = (k: string) => prettyKey(k);

/** Flatten a submission payload into question / answer rows, marking blanks as not done. */
const answerRows = (payload: Record<string, any> | null | undefined) => {
  const rows: { question: string; answer: string; done: boolean }[] = [];
  const walk = (obj: any, prefix: string) => {
    if (obj === null || obj === undefined) return;
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, `${prefix} ${i + 1}`.trim()));
      return;
    }
    if (typeof obj === "object") {
      Object.entries(obj).forEach(([k, v]) => walk(v, prefix ? `${prefix} — ${prettyKey(k)}` : prettyKey(k)));
      return;
    }
    const answer = String(obj).trim();
    const done = answer !== "" && answer !== "0";
    rows.push({ question: prefix || "Response", answer, done });
  };
  walk(payload ?? {}, "");
  return rows;
};

const AdminSessionLogsTab = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState("all");
  const [detail, setDetail] = useState<Log | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [homework, setHomework] = useState<HomeworkTask[]>([]);
  const [hwLoading, setHwLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrMsg(null);
    const { data, error } = await withTimeout<any>(
      supabase.rpc("admin_list_session_logs" as any),
      20000,
      "Loading session logs",
    );
    if (error) {
      setErrMsg(error.message);
      toast.error(error.message);
    } else {
      setLogs((data as Log[]) || []);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openDetail = async (l: Log) => {
    setDetail(l);
    setHomework([]);
    setHwLoading(true);
    const { data, error } = await withTimeout<any>(
      supabase.rpc("admin_client_homework" as any, { _client_id: l.client_id }),
      20000,
      "Loading homework",
    );
    if (error) toast.error(error.message);
    else setHomework((data as HomeworkTask[]) || []);
    setHwLoading(false);
  };

  const therapists = useMemo(
    () => Array.from(new Map(logs.map((r) => [r.therapist_id, r.therapist_name])).entries()),
    [logs],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const since = period === "all" ? 0 : Date.now() - parseInt(period) * 86400000;
    return logs.filter((l) => {
      if (since && new Date(l.created_at).getTime() < since) return false;
      if (therapistFilter !== "all" && l.therapist_id !== therapistFilter) return false;
      if (statusFilter !== "all" && l.progress_status !== statusFilter) return false;
      if (!s) return true;
      return (
        l.client_name.toLowerCase().includes(s) ||
        l.therapist_name.toLowerCase().includes(s) ||
        (l.notes || "").toLowerCase().includes(s) ||
        (l.homework_text || "").toLowerCase().includes(s)
      );
    });
  }, [logs, search, therapistFilter, statusFilter, period]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const withHomework = filtered.filter((l) => l.homework_given).length;
    const nextBooked = filtered.filter((l) => l.next_appt_booked === "yes").length;
    const crisis = filtered.filter((l) => CRISIS_STATUSES.has(l.progress_status)).length;
    return { total, withHomework, nextBooked, crisis };
  }, [filtered]);

  const exportCsv = () => {
    const header = [
      "Date", "Therapist", "Therapist email", "Client", "New client", "Phone",
      "Service", "Duration", "Progress", "Homework given", "Homework details",
      "Next appt booked", "Next appt date", "Next appt service", "Notes", "Logged at",
    ];
    const lines = filtered.map((l) => [
      l.session_date, l.therapist_name, l.therapist_email || "", l.client_name,
      l.is_new_client ? "New" : "Returning", l.client_phone || "",
      l.service_delivered, l.duration, l.progress_status,
      l.homework_given ? "Yes" : "No", l.homework_text || "",
      l.next_appt_booked, l.next_appt_date || "", l.next_appt_service || "",
      l.notes || "", l.created_at,
    ]);
    const csv = [header, ...lines].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `session-logs-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Sessions" v={summary.total} />
        <Metric label="With homework" v={summary.withHomework} />
        <Metric label="Next appt booked" v={summary.nextBooked} />
        <Metric label="Crisis / at-risk" v={summary.crisis} urgent={summary.crisis > 0} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <CardTitle className="text-lg">Session Logs</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
              <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search client, therapist, notes…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Select value={therapistFilter} onValueChange={setTherapistFilter}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All therapists</SelectItem>
                {therapists.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any progress</SelectItem>
                <SelectItem value="progressing_well">Progressing well</SelectItem>
                <SelectItem value="steady">Steady</SelectItem>
                <SelectItem value="needs_more_support">Needs more support</SelectItem>
                <SelectItem value="at_risk">At risk</SelectItem>
                <SelectItem value="crisis_activated">Crisis activated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : errMsg ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-destructive">{errMsg}</p>
              <Button variant="outline" size="sm" onClick={load}>Retry</Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-8" />
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="min-w-[150px]">Client</TableHead>
                    <TableHead className="min-w-[140px]">Therapist</TableHead>
                    <TableHead className="min-w-[150px]">Session</TableHead>
                    <TableHead className="min-w-[130px]">Progress</TableHead>
                    <TableHead className="w-[110px]">Homework</TableHead>
                    <TableHead className="min-w-[120px]">Next session</TableHead>
                    <TableHead className="text-right w-[90px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => {
                    const crisis = CRISIS_STATUSES.has(l.progress_status);
                    const isOpen = expanded === l.id;
                    return (
                      <>
                        <TableRow key={l.id} className={crisis ? "bg-red-500/5 align-top" : "align-top"}>
                          <TableCell className="pr-0">
                            <button
                              aria-label={isOpen ? "Hide notes" : "Show notes"}
                              onClick={() => setExpanded(isOpen ? null : l.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{l.session_date}</TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{l.client_name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {l.is_new_client ? "New client" : "Returning"}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{l.therapist_name}</TableCell>
                          <TableCell className="text-xs">
                            <div>{l.service_delivered}</div>
                            <div className="text-muted-foreground">{l.duration || "—"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={crisis ? "destructive" : "outline"} className="text-[11px] whitespace-nowrap">
                              {crisis && <AlertOctagon className="h-3 w-3 mr-1" />}
                              {l.progress_status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {l.homework_given
                              ? <Badge variant="secondary" className="text-[11px]">Given</Badge>
                              : <span className="text-muted-foreground">None</span>}
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="capitalize">{l.next_appt_booked || "—"}</span>
                            {l.next_appt_date && <div className="text-muted-foreground">{l.next_appt_date}</div>}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => openDetail(l)}>
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isOpen && (
                          <TableRow key={`${l.id}-x`} className="bg-muted/20 hover:bg-muted/20">
                            <TableCell />
                            <TableCell colSpan={8} className="py-4">
                              <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
                                <LongField label="Session notes" value={l.notes} />
                                <LongField label="Homework given" value={l.homework_given ? (l.homework_text || "Given") : "None"} />
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-2">
                                Next session: {l.next_appt_booked || "—"}
                                {l.next_appt_date ? ` · ${l.next_appt_date}` : ""}
                                {l.next_appt_service ? ` · ${l.next_appt_service}` : ""}
                              </p>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No logs match these filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session record</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-5 text-sm">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Session date" value={detail.session_date} />
                <Field label="Logged at" value={new Date(detail.created_at).toLocaleString()} />
                <Field label="Therapist" value={detail.therapist_name} />
                <Field label="Therapist email" value={detail.therapist_email} />
                <Field label="Client" value={detail.client_name} />
                <Field label="Client phone" value={detail.client_phone} />
                <Field label="Client status" value={detail.is_new_client ? "New client" : "Returning client"} />
                <Field label="Service delivered" value={detail.service_delivered} />
                <Field label="Duration" value={detail.duration} />
                <Field label="Progress" value={detail.progress_status?.replace(/_/g, " ")} />
                <Field label="Homework given" value={detail.homework_given ? "Yes" : "No"} />
                <Field label="Next appointment booked" value={detail.next_appt_booked} />
                <Field label="Next appointment date" value={detail.next_appt_date} />
                <Field label="Next appointment service" value={detail.next_appt_service} />
              </div>
              <LongField label="Homework details (from this session)" value={detail.homework_text} />
              <LongField label="Session notes" value={detail.notes} />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Assigned homework tasks for {detail.client_name} — question by question
                </p>
                {hwLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : homework.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No homework tasks assigned to this client yet.</p>
                ) : (
                  <div className="space-y-3">
                    {homework.map((t) => {
                      const rows = answerRows(t.payload);
                      const done = rows.filter((r) => r.done).length;
                      const completed = !!t.submitted_at && t.submission_type === "final";
                      return (
                        <div key={t.id} className="rounded-md border">
                          <div className="flex items-start justify-between gap-3 p-3 bg-muted/30">
                            <div>
                              <p className="font-medium">{t.title?.trim() || prettyTool(t.tool_key)}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Assigned {new Date(t.assigned_at).toLocaleDateString()}
                                {t.due_date ? ` · due ${t.due_date}` : ""}
                                {t.submitted_at ? ` · submitted ${new Date(t.submitted_at).toLocaleDateString()}` : ""}
                              </p>
                              {t.therapist_note && <p className="text-[11px] text-muted-foreground mt-1">Note: {t.therapist_note}</p>}
                            </div>
                            <div className="text-right shrink-0 space-y-1">
                              <Badge variant={completed ? "secondary" : t.submitted_at ? "outline" : "destructive"} className="text-[11px]">
                                {completed ? "Completed" : t.submitted_at ? "In progress" : "Not started"}
                              </Badge>
                              {rows.length > 0 && (
                                <p className="text-[11px] text-muted-foreground">{done}/{rows.length} answered</p>
                              )}
                            </div>
                          </div>
                          {rows.length > 0 && (
                            <ul className="divide-y">
                              {rows.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 px-3 py-2 text-xs">
                                  {r.done
                                    ? <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                    : <Minus className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                                  <span className="w-44 shrink-0 text-muted-foreground">{r.question}</span>
                                  <span className="flex-1 whitespace-pre-wrap break-words">
                                    {r.done ? r.answer : <span className="text-muted-foreground italic">not done</span>}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {(t.screening_score !== null || t.mood_score !== null || t.safety_flag) && (
                            <div className="px-3 py-2 border-t text-[11px] text-muted-foreground flex flex-wrap gap-3">
                              {t.screening_score !== null && <span>Score: {t.screening_score}{t.screening_severity ? ` (${t.screening_severity})` : ""}</span>}
                              {t.mood_score !== null && <span>Mood: {t.mood_score}</span>}
                              {t.safety_flag && <span className="text-destructive font-medium">Safety flag raised</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-0.5 break-words">{value?.toString().trim() || "—"}</p>
  </div>
);

const LongField = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap break-words leading-relaxed">
      {value?.trim() || "—"}
    </div>
  </div>
);

const Metric = ({ label, v, urgent }: { label: string; v: number; urgent?: boolean }) => (
  <Card className={urgent ? "border-red-500/40" : ""}>
    <CardContent className="pt-5 pb-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{v}</p>
    </CardContent>
  </Card>
);

export default AdminSessionLogsTab;
