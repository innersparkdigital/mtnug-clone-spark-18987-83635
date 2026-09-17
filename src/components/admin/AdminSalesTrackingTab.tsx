import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface SalesLead {
  id: string;
  lead_reference: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  booking_type: string | null;
  session_format: string | null;
  expected_value_ugx: number;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  status: "new" | "paid" | "lost";
  paid_amount_ugx: number | null;
  paid_at: string | null;
}

const formatKampalaTime = (iso: string) => {
  const date = new Date(iso);
  const shifted = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  return `${shifted.toISOString().slice(0, 10)} ${shifted.toISOString().slice(11, 19)}+03:00`;
};

const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const AdminSalesTrackingTab = () => {
  const [rows, setRows] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: SalesLead["status"]; amount: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_ad_sales_leads" as any);
    if (error) toast.error(error.message);
    const next = ((data as SalesLead[]) || []);
    setRows(next);
    setDrafts(Object.fromEntries(next.map((r) => [r.id, {
      status: r.status,
      amount: r.paid_amount_ugx ? String(r.paid_amount_ugx) : String(r.expected_value_ugx || ""),
    }])));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const paid = useMemo(() => rows.filter((r) => r.status === "paid"), [rows]);
  const matchedPaid = useMemo(
    () => paid.filter((r) => r.gclid || r.gbraid || r.wbraid),
    [paid],
  );

  const save = async (row: SalesLead) => {
    const draft = drafts[row.id];
    const amount = Number(draft?.amount || 0);
    if (draft.status === "paid" && amount <= 0) {
      toast.error("Enter the amount paid before marking this booking as paid.");
      return;
    }
    setSaving(row.id);
    const { error } = await supabase.rpc("admin_update_ad_sales_lead" as any, {
      _id: row.id,
      _status: draft.status,
      _paid_amount_ugx: draft.status === "paid" ? amount : null,
      _paid_at: draft.status === "paid" ? row.paid_at || new Date().toISOString() : null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`${row.lead_reference} updated`);
      await load();
    }
    setSaving(null);
  };

  const exportGoogleAds = () => {
    if (!matchedPaid.length) {
      toast.error("No paid bookings have a Google ad reference yet.");
      return;
    }
    const headers = [
      "Google Click ID", "GBRAID", "WBRAID", "Conversion Name",
      "Conversion Time", "Conversion Value", "Conversion Currency", "Order ID",
    ];
    const lines = matchedPaid.map((r) => [
      r.gclid, r.gbraid, r.wbraid, "Paid therapy booking",
      formatKampalaTime(r.paid_at || r.created_at), r.paid_amount_ugx || 0, "UGX", r.lead_reference,
    ]);
    const csv = [headers, ...lines].map((line) => line.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `google-ads-paid-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="WhatsApp leads" value={rows.length} />
        <Metric label="Paid bookings" value={paid.length} />
        <Metric label="Matched to Google Ads" value={matchedPaid.length} />
        <Metric label="Awaiting outcome" value={rows.filter((r) => r.status === "new").length} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-lg">WhatsApp sales tracking</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Mark a lead Paid only after payment is confirmed.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={load}>Refresh</Button>
              <Button onClick={exportGoogleAds}><Download className="h-4 w-4 mr-2" />Google Ads file</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Reference</TableHead><TableHead>Customer</TableHead>
                <TableHead>Ad match</TableHead><TableHead>Outcome</TableHead><TableHead>Amount paid</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const draft = drafts[row.id] || { status: row.status, amount: "" };
                  return <TableRow key={row.id}>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{row.lead_reference}</TableCell>
                    <TableCell><div className="text-sm font-medium">{row.name || "—"}</div><div className="text-xs text-muted-foreground">{row.phone || ""}</div></TableCell>
                    <TableCell><Badge variant={row.gclid || row.gbraid || row.wbraid ? "default" : "secondary"}>{row.gclid || row.gbraid || row.wbraid ? "Google Ads" : row.utm_source || "Other"}</Badge></TableCell>
                    <TableCell>
                      <Select value={draft.status} onValueChange={(status: SalesLead["status"]) => setDrafts((d) => ({ ...d, [row.id]: { ...draft, status } }))}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="lost">Lost</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input className="w-32" type="number" min="0" step="1000" value={draft.amount} onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...draft, amount: e.target.value } }))} disabled={draft.status !== "paid"} placeholder="UGX" /></TableCell>
                    <TableCell><Button size="sm" variant="outline" onClick={() => save(row)} disabled={saving === row.id}>{saving === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button></TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
            {!rows.length && <p className="text-center text-sm text-muted-foreground py-10">New WhatsApp booking requests will appear here.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></CardContent></Card>
);

export default AdminSalesTrackingTab;
