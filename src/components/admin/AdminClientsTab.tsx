import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertOctagon, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import AdminClientDetailDialog from "./AdminClientDetailDialog";

interface Row {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  presenting_concern: string | null;
  created_at: string;
  last_seen_at: string | null;
  therapist_id: string;
  therapist_name: string;
  active_tools: number;
  completed_tools: number;
  total_tools: number;
  open_alerts: number;
  last_submission_at: string | null;
  next_session_date: string | null;
}

const riskLevel = (r: Row): "high" | "medium" | "low" => {
  if (r.open_alerts > 0) return "high";
  const daysSince = r.last_submission_at
    ? (Date.now() - new Date(r.last_submission_at).getTime()) / 86400000
    : 999;
  if (daysSince > 7) return "medium";
  return "low";
};

const AdminClientsTab = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_all_clients" as any);
    if (error) toast.error(error.message);
    setRows((data as Row[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const therapists = useMemo(
    () => Array.from(new Map(rows.map((r) => [r.therapist_id, r.therapist_name])).entries()),
    [rows],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (therapistFilter !== "all" && r.therapist_id !== therapistFilter) return false;
      if (riskFilter !== "all" && riskLevel(r) !== riskFilter) return false;
      if (!s) return true;
      return (
        r.full_name.toLowerCase().includes(s) ||
        (r.email || "").toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        r.therapist_name.toLowerCase().includes(s)
      );
    });
  }, [rows, search, therapistFilter, riskFilter]);

  const exportCsv = () => {
    const header = ["Client", "Therapist", "Email", "Phone", "Concern", "Risk", "Active tools", "Completed tools", "Open alerts", "Last activity", "Next session"];
    const lines = filtered.map((r) => [
      r.full_name, r.therapist_name, r.email || "", r.phone || "", r.presenting_concern || "",
      riskLevel(r), r.active_tools, r.completed_tools, r.open_alerts,
      r.last_submission_at ? new Date(r.last_submission_at).toISOString() : "",
      r.next_session_date || "",
    ]);
    const csv = [header, ...lines].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `all-clients-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">All Clients</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Read-only across every therapist ({filtered.length} of {rows.length})</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
              <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search name, email, phone, therapist…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Select value={therapistFilter} onValueChange={setTherapistFilter}>
              <SelectTrigger className="w-56"><SelectValue placeholder="All therapists" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All therapists</SelectItem>
                {therapists.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Risk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any risk</SelectItem>
                <SelectItem value="high">High risk</SelectItem>
                <SelectItem value="medium">Medium risk</SelectItem>
                <SelectItem value="low">Low risk</SelectItem>
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
                    <TableHead>#</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Concern</TableHead>
                    <TableHead>Homework</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Last activity</TableHead>
                    <TableHead>Next session</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => {
                    const risk = riskLevel(r);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell>
                          <p className="font-medium">{r.full_name}</p>
                          <p className="text-xs text-muted-foreground">{r.email || r.phone || "—"}</p>
                        </TableCell>
                        <TableCell className="text-sm">{r.therapist_name}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{r.presenting_concern || "—"}</TableCell>
                        <TableCell className="text-xs">{r.completed_tools}/{r.total_tools}</TableCell>
                        <TableCell>
                          <Badge variant={risk === "high" ? "destructive" : risk === "medium" ? "outline" : "secondary"} className="text-xs">
                            {r.open_alerts > 0 && <AlertOctagon className="h-3 w-3 mr-1" />}
                            {risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {r.last_submission_at ? new Date(r.last_submission_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-xs">{r.next_session_date || "—"}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedId(r.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No clients match these filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <AdminClientDetailDialog clientId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default AdminClientsTab;