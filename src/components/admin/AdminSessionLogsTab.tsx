import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertOctagon, Download, Eye } from "lucide-react";
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

const CRISIS_STATUSES = new Set(["at_risk", "crisis_activated"]);

const AdminSessionLogsTab = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState("30");
  const [detail, setDetail] = useState<Log | null>(null);

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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Homework</TableHead>
                    <TableHead className="min-w-[150px]">Next session</TableHead>
                    <TableHead className="min-w-[260px]">Notes</TableHead>
                    <TableHead className="text-right">Full record</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className={CRISIS_STATUSES.has(l.progress_status) ? "bg-red-500/5" : ""}>
                      <TableCell className="text-xs">{l.session_date}</TableCell>
                      <TableCell className="text-sm">{l.therapist_name}</TableCell>
                      <TableCell className="text-sm">
                        {l.client_name}
                        {l.is_new_client && <Badge variant="outline" className="ml-1 text-[10px]">NEW</Badge>}
                      </TableCell>
                      <TableCell className="text-xs">{l.service_delivered}</TableCell>
                      <TableCell>
                        <Badge variant={CRISIS_STATUSES.has(l.progress_status) ? "destructive" : "outline"} className="text-xs">
                          {CRISIS_STATUSES.has(l.progress_status) && <AlertOctagon className="h-3 w-3 mr-1" />}
                          {l.progress_status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{l.duration || "—"}</TableCell>
                      <TableCell className="text-xs align-top">
                        {l.homework_given ? (
                          <span className="whitespace-pre-wrap break-words">
                            {l.homework_text?.trim() || "Given"}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        <span className="capitalize">{l.next_appt_booked || "—"}</span>
                        {l.next_appt_date && <div className="text-muted-foreground">{l.next_appt_date}</div>}
                        {l.next_appt_service && <div className="text-muted-foreground">{l.next_appt_service}</div>}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        <span className="whitespace-pre-wrap break-words">{l.notes?.trim() || "—"}</span>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setDetail(l)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No logs match these filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session record</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
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
              <LongField label="Homework details" value={detail.homework_text} />
              <LongField label="Session notes" value={detail.notes} />
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