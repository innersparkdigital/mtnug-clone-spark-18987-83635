import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertOctagon, Download, Eye, Receipt, Save, MessageCircle, Plus, Trash2, Mail, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import AdminClientDetailDialog from "./AdminClientDetailDialog";
import AddClientDialog from "./AddClientDialog";
import { buildReceiptPdf, makeReceiptNumber } from "@/lib/receiptPdf";
import * as XLSX from "xlsx";

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
  client_code: string | null;
  country: string | null;
  session_type: string | null;
  duration_mins: number | null;
  session_rating: number | null;
  would_rebook: boolean | null;
  amount_ugx: number | null;
  therapist_share_ugx: number | null;
  innerspark_share_ugx: number | null;
  paid_status: string | null;
  receipt_number: string | null;
  receipt_url: string | null;
  last_session_date: string | null;
  therapist_paid: boolean | null;
  therapist_paid_at: string | null;
  receipt_sent_at: string | null;
}

const fmtUGX = (n: number | null) => (n ? `UGX ${Math.round(Number(n)).toLocaleString()}` : "—");
const SESSION_TYPES = ["individual", "couples", "teen", "group", "corporate"];

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
  const [edits, setEdits] = useState<Record<string, Partial<Row>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

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

  useEffect(() => { setPage(1); }, [search, therapistFilter, riskFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const val = <K extends keyof Row>(r: Row, k: K): Row[K] =>
    (edits[r.id] && k in edits[r.id]! ? (edits[r.id] as Row)[k] : r[k]);

  const setVal = (id: string, k: keyof Row, v: any) =>
    setEdits((e) => ({ ...e, [id]: { ...e[id], [k]: v } }));

  const saveRow = async (r: Row) => {
    setSavingId(r.id);
    const e = edits[r.id] || {};
    const amount = Number(val(r, "amount_ugx") || 0);
    const therapistShare = e.therapist_share_ugx ?? r.therapist_share_ugx ?? (amount ? Math.round(amount * 0.6) : null);
    const { error } = await supabase.rpc("admin_update_client_tracker" as any, {
      _client_id: r.id,
      _session_type: val(r, "session_type") ?? null,
      _duration_mins: val(r, "duration_mins") ? Number(val(r, "duration_mins")) : null,
      _session_rating: val(r, "session_rating") ? Number(val(r, "session_rating")) : null,
      _next_session_date: val(r, "next_session_date") || null,
      _would_rebook: val(r, "would_rebook") ?? null,
      _amount_ugx: amount || null,
      _therapist_share_ugx: therapistShare,
      _innerspark_share_ugx: amount ? amount - Number(therapistShare || 0) : null,
      _paid_status: val(r, "paid_status") ?? null,
      _last_session_date: val(r, "last_session_date") || null,
      _country: val(r, "country") ?? null,
      _receipt_number: r.receipt_number,
      _receipt_url: r.receipt_url,
    });
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Session saved · finance updated");
    const nowPaid = (val(r, "paid_status") as string) === "paid";
    const wasPaid = r.paid_status === "paid";
    setEdits((prev) => { const n = { ...prev }; delete n[r.id]; return n; });
    if (nowPaid && !wasPaid && r.email) {
      await emailReceipt({ ...r, ...e, paid_status: "paid" } as Row, { silent: false, whatsapp: false, download: false });
    }
    load();
  };

  const buildAndSend = async (
    r: Row,
    opts: { whatsapp: boolean; download: boolean; silent?: boolean },
  ) => {
    const amount = Number(val(r, "amount_ugx") || 0);
    if (!amount) return toast.error("Add the session amount first.");
    setReceiptId(r.id);
    const receiptNumber = r.receipt_number || makeReceiptNumber();
    const { doc, base64 } = await buildReceiptPdf({
      receiptNumber,
      clientName: r.full_name,
      clientCode: r.client_code,
      clientPhone: r.phone,
      clientEmail: r.email,
      therapistName: r.therapist_name,
      sessionDate: (val(r, "last_session_date") as string) || new Date().toISOString().slice(0, 10),
      sessionType: val(r, "session_type") as string,
      durationMins: val(r, "duration_mins") as number,
      amountUgx: amount,
      paidStatus: (val(r, "paid_status") as string) || "paid",
    });
    if (opts.download) doc.save(`${receiptNumber}.pdf`);

    const { data, error } = await supabase.functions.invoke("send-receipt-email", {
      body: {
        recipient_email: r.email,
        recipient_name: r.full_name,
        pdf_base64: base64,
        receipt_number: receiptNumber,
        amount_ugx: amount,
        session_type: val(r, "session_type"),
        session_date: val(r, "last_session_date"),
        client_id: r.id,
        send_email: !!r.email,
      },
    });
    setReceiptId(null);
    if (error) return toast.error(error.message);

    const url = ((data as any)?.signed_url || (data as any)?.receipt_url) as string | undefined;
    if (opts.whatsapp && url && r.phone) {
      const msg = encodeURIComponent(
        `Hi ${r.full_name.split(" ")[0]}, here is your InnerSpark receipt ${receiptNumber} for ${fmtUGX(amount)}: ${url}`,
      );
      window.open(`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
    } else if (opts.whatsapp && url) {
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Receipt link copied");
    }
    if (!opts.silent) toast.success(r.email ? "Receipt generated and emailed" : "Receipt generated");
    load();
  };

  const generateReceipt = (r: Row) => buildAndSend(r, { whatsapp: true, download: true });
  const emailReceipt = (r: Row, o?: { silent?: boolean; whatsapp?: boolean; download?: boolean }) => {
    if (!r.email) return toast.error("This client has no email address.");
    return buildAndSend(r, { whatsapp: o?.whatsapp ?? false, download: o?.download ?? false, silent: o?.silent });
  };

  const toggleTherapistPaid = async (r: Row, paid: boolean) => {
    setPayingId(r.id);
    const { error } = await supabase.rpc("admin_set_therapist_paid" as any, { _client_id: r.id, _paid: paid });
    setPayingId(null);
    if (error) return toast.error(error.message);
    toast.success(paid ? "Therapist payout recorded in Finance (cash out)" : "Payout reversed — expense removed");
    load();
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    const { error } = await supabase.rpc("admin_delete_client" as any, { _client_id: deleteRow.id });
    setDeleting(false);
    setDeleteRow(null);
    if (error) return toast.error(error.message);
    toast.success("Client deleted");
    load();
  };

  const sheetRows = () =>
    filtered.map((r, i) => ({
      "#": i + 1,
      "Session Date": r.last_session_date || "",
      "Client Name": r.full_name,
      "Client Code": r.client_code || "",
      "Client Number": r.phone || "",
      Email: r.email || "",
      Country: r.country || "",
      "Therapist Name": r.therapist_name,
      "Presenting Concern": r.presenting_concern || "",
      "Session Type": r.session_type || "",
      "Duration (mins)": r.duration_mins ?? "",
      "Session Rating": r.session_rating ?? "",
      "Next Session": r.next_session_date || "",
      "Would Rebook": r.would_rebook === null ? "" : r.would_rebook ? "Yes" : "No",
      "Amount UGX": r.amount_ugx ?? "",
      "Therapist UGX": r.therapist_share_ugx ?? "",
      "InnerSpark UGX": r.innerspark_share_ugx ?? "",
      "Client Paid": r.paid_status || "",
      "Therapist Paid": r.therapist_paid ? "Yes" : "No",
      "Receipt No.": r.receipt_number || "",
    }));

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sheetRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sessions");
    XLSX.writeFile(wb, `therapy-session-tracker-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCsv = () => {
    const header = ["#", "Session Date", "Client Name", "Client Code", "Client Number", "Email", "Country", "Therapist Name", "Presenting Concern", "Session Type", "Duration (mins)", "Session Rating", "Next Session", "Would Rebook", "Amount UGX", "Therapist UGX", "InnerSpark UGX", "Paid", "Receipt No."];
    const lines = filtered.map((r, i) => [
      i + 1, r.last_session_date || "", r.full_name, r.client_code || "", r.phone || "", r.email || "",
      r.country || "", r.therapist_name, r.presenting_concern || "", r.session_type || "",
      r.duration_mins ?? "", r.session_rating ?? "", r.next_session_date || "",
      r.would_rebook === null ? "" : r.would_rebook ? "Yes" : "No",
      r.amount_ugx ?? "", r.therapist_share_ugx ?? "", r.innerspark_share_ugx ?? "",
      r.paid_status || "", r.receipt_number || "",
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
              <CardTitle className="text-lg">Therapy Session Tracker</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Every client across every therapist · edit inline, save to post income to Finance ({filtered.length} of {rows.length})</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add client</Button>
              <Button variant="outline" size="sm" onClick={exportExcel}><FileSpreadsheet className="h-4 w-4 mr-1" /> Excel</Button>
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
              <Table className="min-w-[1800px] text-xs">
                <TableHeader>
                  <TableRow>
                    {["#", "Session Date", "Client Name", "Client Code", "Client Number", "Email", "Country", "Therapist Name", "Presenting Concern", "Session Type", "Duration", "Rating", "Next Session", "Would Rebook", "Amount UGX", "Therapist UGX", "InnerSpark UGX", "Client Paid", "Therapist Paid", "Risk", "Actions"].map((h) => (
                      <TableHead key={h} className="whitespace-nowrap text-[11px]">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((r, idx) => {
                    const i = (page - 1) * pageSize + idx;
                    const risk = riskLevel(r);
                    const dirty = !!edits[r.id];
                    const amount = Number(val(r, "amount_ugx") || 0);
                    const tShare = Number(val(r, "therapist_share_ugx") ?? (amount ? Math.round(amount * 0.6) : 0));
                    return (
                      <TableRow key={r.id} className={dirty ? "bg-primary/5" : ""}>
                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                        <TableCell>
                          <Input type="date" className="h-8 w-[130px] text-xs" value={(val(r, "last_session_date") as string) || ""} onChange={(e) => setVal(r.id, "last_session_date", e.target.value)} />
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{r.full_name}</TableCell>
                        <TableCell className="font-mono">{r.client_code || "—"}</TableCell>
                        <TableCell className="whitespace-nowrap">{r.phone || "—"}</TableCell>
                        <TableCell className="max-w-[160px] truncate">{r.email || "—"}</TableCell>
                        <TableCell>
                          <Input className="h-8 w-[90px] text-xs" placeholder="Uganda" value={(val(r, "country") as string) || ""} onChange={(e) => setVal(r.id, "country", e.target.value)} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{r.therapist_name}</TableCell>
                        <TableCell className="max-w-[160px] truncate">{r.presenting_concern || "—"}</TableCell>
                        <TableCell>
                          <Select value={(val(r, "session_type") as string) || ""} onValueChange={(v) => setVal(r.id, "session_type", v)}>
                            <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>{SESSION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" className="h-8 w-[70px] text-xs" value={(val(r, "duration_mins") as number) ?? ""} onChange={(e) => setVal(r.id, "duration_mins", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={1} max={5} className="h-8 w-[60px] text-xs" value={(val(r, "session_rating") as number) ?? ""} onChange={(e) => setVal(r.id, "session_rating", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="date" className="h-8 w-[130px] text-xs" value={(val(r, "next_session_date") as string) || ""} onChange={(e) => setVal(r.id, "next_session_date", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Select value={val(r, "would_rebook") === null || val(r, "would_rebook") === undefined ? "" : val(r, "would_rebook") ? "yes" : "no"} onValueChange={(v) => setVal(r.id, "would_rebook", v === "yes")}>
                            <SelectTrigger className="h-8 w-[80px] text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" className="h-8 w-[100px] text-xs" value={(val(r, "amount_ugx") as number) ?? ""} onChange={(e) => setVal(r.id, "amount_ugx", e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" className="h-8 w-[100px] text-xs" value={(val(r, "therapist_share_ugx") as number) ?? (amount ? Math.round(amount * 0.6) : "")} onChange={(e) => setVal(r.id, "therapist_share_ugx", e.target.value)} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{amount ? fmtUGX(amount - tShare) : "—"}</TableCell>
                        <TableCell>
                          <Select value={(val(r, "paid_status") as string) || ""} onValueChange={(v) => setVal(r.id, "paid_status", v)}>
                            <SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="waived">Waived</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!!r.therapist_paid}
                              disabled={payingId === r.id}
                              onCheckedChange={(v) => toggleTherapistPaid(r, v)}
                            />
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {r.therapist_paid ? "Paid out" : "Unpaid"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={risk === "high" ? "destructive" : risk === "medium" ? "outline" : "secondary"} className="text-[10px]">
                            {r.open_alerts > 0 && <AlertOctagon className="h-3 w-3 mr-1" />}
                            {risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant={dirty ? "default" : "ghost"} disabled={!dirty || savingId === r.id} onClick={() => saveRow(r)} title="Save session">
                              {savingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" disabled={receiptId === r.id} onClick={() => generateReceipt(r)} title="Generate receipt (email + WhatsApp)">
                              {receiptId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Receipt className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" disabled={receiptId === r.id || !r.email} onClick={() => emailReceipt(r)} title="Email receipt to client">
                              <Mail className="h-4 w-4" />
                            </Button>
                            {r.receipt_url && (
                              <Button size="sm" variant="ghost" title="Share receipt on WhatsApp" onClick={() => window.open(`https://wa.me/${(r.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Your InnerSpark receipt: ${r.receipt_url}`)}`, "_blank")}>
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => setSelectedId(r.id)} title="View client">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteRow(r)} title="Delete client">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No clients match these filters.</p>}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
                </span>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs">Page {page} of {totalPages}</span>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} onCreated={load} />

      <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteRow?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the client, their assignments and submissions. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={(e) => { e.preventDefault(); confirmDelete(); }}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminClientDetailDialog clientId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
};

export default AdminClientsTab;