import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertOctagon, Download } from "lucide-react";
import { toast } from "sonner";

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
}

const CRISIS_STATUSES = new Set(["at_risk", "crisis_protocol_activated"]);

const AdminSessionLogsTab = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState("30");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_session_logs" as any);
    if (error) toast.error(error.message);
    setLogs((data as Log[]) || []);
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
        (l.notes || "").toLowerCase().includes(s)
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
    const header = ["Date", "Therapist", "Client", "Phone", "Service", "Duration", "Progress", "Homework", "Next booked", "Notes"];
    const lines = filtered.map((l) => [
      l.session_date, l.therapist_name, l.client_name, l.client_phone || "",
      l.service_delivered, l.duration, l.progress_status,
      l.homework_given ? "Yes" : "No", l.next_appt_booked, l.notes || "",
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
                <SelectItem value="significant_improvement">Significant improvement</SelectItem>
                <SelectItem value="some_improvement">Some improvement</SelectItem>
                <SelectItem value="no_change">No change</SelectItem>
                <SelectItem value="deterioration">Deterioration</SelectItem>
                <SelectItem value="at_risk">At risk</SelectItem>
                <SelectItem value="crisis_protocol_activated">Crisis</SelectItem>
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>HW</TableHead>
                    <TableHead>Next</TableHead>
                    <TableHead>Notes</TableHead>
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
                      <TableCell className="text-xs">{l.homework_given ? "✓" : "—"}</TableCell>
                      <TableCell className="text-xs">{l.next_appt_booked}</TableCell>
                      <TableCell className="text-xs max-w-[220px] truncate">{l.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No logs match these filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Metric = ({ label, v, urgent }: { label: string; v: number; urgent?: boolean }) => (
  <Card className={urgent ? "border-red-500/40" : ""}>
    <CardContent className="pt-5 pb-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{v}</p>
    </CardContent>
  </Card>
);

export default AdminSessionLogsTab;