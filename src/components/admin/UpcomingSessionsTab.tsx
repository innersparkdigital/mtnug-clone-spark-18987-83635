import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarClock, MessageCircle, Mail, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface UpcomingRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  client_code: string | null;
  therapist_id: string;
  therapist_name: string;
  session_type: string | null;
  client_type: string | null;
  next_session_date: string | null;
  presenting_concern: string | null;
  paid_status: string | null;
  amount_ugx: number | null;
}

const TZ = "Africa/Nairobi";

const todayIso = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const daysUntil = (iso: string) => {
  const a = new Date(`${todayIso()}T00:00:00Z`).getTime();
  const b = new Date(`${iso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
};

const prettyDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const bucketLabel = (days: number) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return "This week";
  return "Later";
};

const UpcomingSessionsTab = () => {
  const [rows, setRows] = useState<UpcomingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [windowFilter, setWindowFilter] = useState("all");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = async () => {
    const { data, error } = await supabase.rpc("admin_list_all_clients" as any);
    if (error) toast.error(error.message);
    setRows(((data as UpcomingRow[]) || []).filter((r) => !!r.next_session_date));
    setUpdatedAt(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-upcoming-sessions")
      .on("postgres_changes", { event: "*", schema: "public", table: "therapist_clients" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "therapist_session_feedback" }, () => load())
      .subscribe();
    const timer = window.setInterval(load, 120000);
    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(timer);
    };
  }, []);

  const upcoming = useMemo(
    () =>
      rows
        .filter((r) => daysUntil(r.next_session_date!) >= 0)
        .sort((a, b) => a.next_session_date!.localeCompare(b.next_session_date!)),
    [rows],
  );

  const therapists = useMemo(
    () => Array.from(new Map(upcoming.map((r) => [r.therapist_id, r.therapist_name])).entries()),
    [upcoming],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return upcoming.filter((r) => {
      const days = daysUntil(r.next_session_date!);
      if (therapistFilter !== "all" && r.therapist_id !== therapistFilter) return false;
      if (windowFilter === "today" && days !== 0) return false;
      if (windowFilter === "tomorrow" && days !== 1) return false;
      if (windowFilter === "week" && days > 7) return false;
      if (!s) return true;
      return (
        r.full_name.toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        (r.email || "").toLowerCase().includes(s) ||
        r.therapist_name.toLowerCase().includes(s)
      );
    });
  }, [upcoming, search, therapistFilter, windowFilter]);

  const counts = useMemo(() => {
    const d = upcoming.map((r) => daysUntil(r.next_session_date!));
    return {
      today: d.filter((n) => n === 0).length,
      tomorrow: d.filter((n) => n === 1).length,
      week: d.filter((n) => n <= 7).length,
      total: d.length,
    };
  }, [upcoming]);

  const exportCsv = () => {
    const header = ["#", "Next session", "Days away", "Client", "Client code", "Type", "Phone", "Email", "Therapist", "Session type", "Payment"];
    const lines = filtered.map((r, i) => [
      i + 1, r.next_session_date || "", daysUntil(r.next_session_date!), r.full_name, r.client_code || "",
      r.client_type || "new", r.phone || "", r.email || "", r.therapist_name, r.session_type || "", r.paid_status || "",
    ]);
    const csv = [header, ...lines].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `upcoming-sessions-${todayIso()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" /> Upcoming Sessions
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Live follow-up list for every client with a scheduled next session · updates automatically
              {updatedAt ? ` · last checked ${updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge className="text-[11px]">Today: {counts.today}</Badge>
              <Badge variant="secondary" className="text-[11px]">Tomorrow: {counts.tomorrow}</Badge>
              <Badge variant="secondary" className="text-[11px]">Next 7 days: {counts.week}</Badge>
              <Badge variant="outline" className="text-[11px]">All upcoming: {counts.total}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search client, phone, email, therapist…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Select value={windowFilter} onValueChange={setWindowFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All upcoming</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={therapistFilter} onValueChange={setTherapistFilter}>
            <SelectTrigger className="w-56"><SelectValue placeholder="All therapists" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All therapists</SelectItem>
              {therapists.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No upcoming sessions match this view yet.</p>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10 text-[11px]">#</TableHead>
                  <TableHead className="text-[11px]">When</TableHead>
                  <TableHead className="text-[11px]">Client</TableHead>
                  <TableHead className="text-[11px]">Therapist</TableHead>
                  <TableHead className="text-[11px]">Session</TableHead>
                  <TableHead className="text-[11px]">Payment</TableHead>
                  <TableHead className="text-[11px] text-right">Reach out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => {
                  const days = daysUntil(r.next_session_date!);
                  const label = bucketLabel(days);
                  const phone = (r.phone || "").replace(/[^0-9]/g, "");
                  return (
                    <TableRow key={r.id} className="text-xs">
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <Badge variant={days <= 1 ? "default" : "secondary"} className="w-fit text-[10px]">{label}</Badge>
                          <span className="text-muted-foreground">{prettyDate(r.next_session_date!)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{r.full_name}</div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-mono">{r.client_code || "—"}</span>
                          <span>{(r.client_type || "new") === "returning" ? "Returning" : "New"}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{r.phone || "no phone"}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{r.therapist_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.session_type || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.paid_status === "paid" ? "default" : "outline"} className="text-[10px]">
                          {r.paid_status || "not set"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${phone}?text=${encodeURIComponent(
                                    `Hi ${r.full_name.split(" ")[0]}, a gentle reminder about your InnerSpark session with ${r.therapist_name} on ${prettyDate(r.next_session_date!)}.`,
                                  )}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {r.email && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={`mailto:${r.email}`}><Mail className="h-3.5 w-3.5" /></a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsTab;
