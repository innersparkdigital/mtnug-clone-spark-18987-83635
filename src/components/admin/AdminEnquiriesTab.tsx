import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Enquiry {
  id: string;
  source: "amani" | "website" | "whatsapp_callback";
  name: string | null;
  phone: string | null;
  email: string | null;
  concern: string | null;
  status: string | null;
  handled: boolean;
  source_path: string | null;
  created_at: string;
}

const SOURCE_LABEL: Record<string, string> = {
  amani: "Amani AI",
  website: "Contact form",
  whatsapp_callback: "WhatsApp callback",
};

const cleanPhone = (p: string | null) => (p || "").replace(/[^\d+]/g, "");

const AdminEnquiriesTab = () => {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [period, setPeriod] = useState("30");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_enquiries" as any);
    if (error) toast.error(error.message);
    setRows((data as Enquiry[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const since = period === "all" ? 0 : Date.now() - parseInt(period) * 86400000;
    return rows.filter((r) => {
      if (since && new Date(r.created_at).getTime() < since) return false;
      if (source !== "all" && r.source !== source) return false;
      if (!s) return true;
      return (
        (r.name || "").toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        (r.email || "").toLowerCase().includes(s) ||
        (r.concern || "").toLowerCase().includes(s)
      );
    });
  }, [rows, search, source, period]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const handled = filtered.filter((r) => r.handled).length;
    const pending = total - handled;
    return { total, handled, pending };
  }, [filtered]);

  const exportCsv = () => {
    const header = ["Date", "Source", "Name", "Phone", "Email", "Concern", "Status"];
    const lines = filtered.map((r) => [
      new Date(r.created_at).toISOString(), SOURCE_LABEL[r.source] || r.source,
      r.name || "", r.phone || "", r.email || "", r.concern || "",
      r.handled ? "Handled" : "Pending",
    ]);
    const csv = [header, ...lines].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `enquiries-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const waLink = (phone: string, name: string | null) => {
    const num = cleanPhone(phone).replace(/^\+/, "");
    const msg = encodeURIComponent(`Hi ${name || "there"}, this is InnerSpark Africa 💙 Thanks for reaching out — how can we help?`);
    return `https://wa.me/${num}?text=${msg}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Total" v={summary.total} />
        <Metric label="Handled" v={summary.handled} />
        <Metric label="Pending" v={summary.pending} urgent={summary.pending > 0} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <CardTitle className="text-lg">Enquiries & Leads</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
              <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search name, phone, email, concern…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="amani">Amani AI</SelectItem>
                <SelectItem value="website">Contact form</SelectItem>
                <SelectItem value="whatsapp_callback">WhatsApp callback</SelectItem>
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
                    <TableHead>Source</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Concern</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id + r.source}>
                      <TableCell className="text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{SOURCE_LABEL[r.source] || r.source}</Badge></TableCell>
                      <TableCell className="text-sm">{r.name || "—"}</TableCell>
                      <TableCell className="text-xs">{r.phone || r.email || "—"}</TableCell>
                      <TableCell className="text-xs max-w-[280px] truncate">{r.concern || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.handled ? "secondary" : "default"} className="text-xs">
                          {r.handled ? "Handled" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.phone && (
                          <Button asChild size="sm" variant="ghost">
                            <a href={waLink(r.phone, r.name)} target="_blank" rel="noreferrer">
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No enquiries match these filters.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Metric = ({ label, v, urgent }: { label: string; v: number; urgent?: boolean }) => (
  <Card className={urgent ? "border-amber-500/40" : ""}>
    <CardContent className="pt-5 pb-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{v}</p>
    </CardContent>
  </Card>
);

export default AdminEnquiriesTab;