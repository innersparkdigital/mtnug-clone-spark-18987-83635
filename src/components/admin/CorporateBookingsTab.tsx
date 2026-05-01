import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Building2, Search, ChevronLeft, ChevronRight, Download, Eye, Users, Calendar, Phone, Mail } from "lucide-react";

type Booking = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  employee_count: number | null;
  preferred_date: string | null;
  preferred_format: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "contacted", "scheduled", "completed", "cancelled"] as const;

const statusColor = (s: string) => {
  switch (s) {
    case "new": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "contacted": return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "scheduled": return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    case "completed": return "bg-green-500/10 text-green-700 dark:text-green-300";
    case "cancelled": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const CorporateBookingsTab = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_screening_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading bookings", description: error.message, variant: "destructive" });
    } else {
      setBookings((data || []) as Booking[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
    const channel = supabase
      .channel("corporate-bookings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "corporate_screening_bookings" }, fetchBookings)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("corporate_screening_bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.company_name.toLowerCase().includes(q) ||
          b.contact_name.toLowerCase().includes(q) ||
          b.contact_email.toLowerCase().includes(q) ||
          (b.contact_phone || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, statusFilter, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const exportCSV = () => {
    const headers = ["#", "Company", "Contact", "Email", "Phone", "Employees", "Preferred Date", "Format", "Status", "Submitted"];
    const rows = filtered.map((b, i) => [
      i + 1, b.company_name, b.contact_name, b.contact_email, b.contact_phone || "",
      b.employee_count || "", b.preferred_date || "", b.preferred_format || "", b.status,
      new Date(b.created_at).toLocaleDateString("en-GB")
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corporate-screening-bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    new: bookings.filter(b => b.status === "new").length,
    contacted: bookings.filter(b => b.status === "contacted").length,
    scheduled: bookings.filter(b => b.status === "scheduled").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">New</p><p className="text-2xl font-bold text-blue-600">{stats.new}</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Contacted</p><p className="text-2xl font-bold text-amber-600">{stats.contacted}</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Scheduled</p><p className="text-2xl font-bold text-purple-600">{stats.scheduled}</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{stats.completed}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Corporate Screening Bookings</CardTitle>
              <CardDescription>Companies that requested mental health screenings for their teams</CardDescription>
            </div>
            <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search company, contact..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No corporate screening bookings found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Preferred Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((b, i) => (
                      <TableRow key={b.id}>
                        <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                        <TableCell className="font-medium">{b.company_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{b.contact_name}</div>
                          <div className="text-xs text-muted-foreground">{b.contact_email}</div>
                        </TableCell>
                        <TableCell>{b.employee_count || "—"}</TableCell>
                        <TableCell>{b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-GB") : "—"}</TableCell>
                        <TableCell>
                          <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                            <SelectTrigger className="h-7 w-[120px]">
                              <Badge className={statusColor(b.status)}>{b.status.replace("_", " ")}</Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(b.created_at).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => setSelected(b)}><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Company</Label>
                  <p className="font-medium">{selected.company_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Employees</Label>
                  <p className="font-medium">{selected.employee_count || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Contact Person</Label>
                  <p className="font-medium">{selected.contact_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="font-medium text-sm">{selected.contact_email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p className="font-medium">{selected.contact_phone || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Preferred Date</Label>
                  <p className="font-medium">{selected.preferred_date ? new Date(selected.preferred_date).toLocaleDateString("en-GB") : "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Format</Label>
                  <p className="font-medium">{selected.preferred_format || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Select value={selected.status} onValueChange={v => updateStatus(selected.id, v)}>
                    <SelectTrigger className="h-8 mt-1">
                      <Badge className={statusColor(selected.status)}>{selected.status.replace("_", " ")}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selected.notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{selected.notes}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Submitted: {new Date(selected.created_at).toLocaleString("en-GB")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CorporateBookingsTab;