import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, CalendarClock, MessageCircle, Mail, Download, RefreshCw,
  CheckCircle2, XCircle, PhoneOff, UserCheck, Ban,
} from "lucide-react";
import { toast } from "sonner";

type Attendance = "scheduled" | "confirmed" | "no_response" | "attended" | "missed" | "cancelled";

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
  session_attendance_status?: Attendance | null;
  session_outreach_count?: number | null;
  session_last_outreach_at?: string | null;
  session_attendance_note?: string | null;
}

const TZ = "Africa/Nairobi";

const todayIso = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const daysUntil = (iso: string) => {
  const a = new Date(`${todayIso()}T00:00:00Z`).getTime();
  const b = new Date(`${iso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
};

const prettyDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const bucketLabel = (days: number) => {
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return "This week";
  return "Later";
};

const effectiveStatus = (r: UpcomingRow): Attendance => {
  const raw = (r.session_attendance_status || "scheduled") as Attendance;
  if (!r.next_session_date) return raw;
  const days = daysUntil(r.next_session_date);
  if (days < 0 && (raw === "scheduled" || raw === "confirmed" || raw === "no_response")) {
    return "missed";
  }
  return raw;
};

const statusMeta: Record<
  Attendance,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className?: string }
> = {
  scheduled: { label: "Scheduled", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default", className: "bg-emerald-600" },
  no_response: { label: "No response", variant: "secondary", className: "bg-amber-500 text-white" },
  attended: { label: "Attended", variant: "default", className: "bg-emerald-700" },
  missed: { label: "Missed", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const UpcomingSessionsTab = () => {
  const [rows, setRows] = useState<UpcomingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [therapistFilter, setTherapistFilter] = useState("all");
  const [windowFilter, setWindowFilter] = useState("all");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = async () => {
    await supabase.rpc("admin_auto_flag_missed_sessions" as never).then(() => {}, () => {});

    const { data, error } = await supabase.rpc("admin_list_all_clients" as never);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const list = ((data as UpcomingRow[]) || []).filter((r) => !!r.next_session_date);

    const ids = list.map((r) => r.id);
    if (ids.length) {
      const { data: att } = await supabase
        .from("therapist_clients" as never)
        .select(
          "id,session_attendance_status,session_outreach_count,session_last_outreach_at,session_attendance_note",
        )
        .in("id", ids);
      const map = new Map(
        ((att as Array<Record<string, unknown>>) || []).map((a) => [String(a.id), a]),
      );
      for (const r of list) {
        const extra = map.get(r.id);
        if (extra) {
          r.session_attendance_status = (extra.session_attendance_status as Attendance) || null;
          r.session_outreach_count = (extra.session_outreach_count as number) ?? 0;
          r.session_last_outreach_at = (extra.session_last_outreach_at as string) || null;
          r.session_attendance_note = (extra.session_attendance_note as string) || null;
        }
      }
    }

    setRows(list);
    setUpdatedAt(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-upcoming-sessions")
      .on("postgres_changes", { event: "*", schema: "public", table: "therapist_clients" }, () => load())
      .subscribe();
    const timer = window.setInterval(load, 120000);
    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(timer);
    };
  }, []);

  const setStatus = async (
    clientId: string,
    status: Attendance,
    opts?: { note?: string; bumpOutreach?: boolean },
  ) => {
    setBusyId(clientId);
    const { data, error } = await supabase.rpc("admin_set_session_attendance" as never, {
      _client_id: clientId,
      _status: status,
      _note: opts?.note ?? null,
      _bump_outreach: !!opts?.bumpOutreach,
    } as never);
    setBusyId(null);
    if (error) {
      const patch: Record<string, unknown> = {
        session_attendance_status: status,
        session_attendance_updated_at: new Date().toISOString(),
      };
      if (opts?.note !== undefined) patch.session_attendance_note = opts.note;
      if (opts?.bumpOutreach) {
        patch.session_last_outreach_at = new Date().toISOString();
      }
      const { error: e2 } = await supabase
        .from("therapist_clients" as never)
        .update(patch as never)
        .eq("id", clientId);
      if (e2) return toast.error(error.message || e2.message);
    } else if (data === false) {
      return toast.error("Could not update this client");
    }
    toast.success(
      status === "missed"
        ? "Marked as missed"
        : status === "no_response"
          ? "Marked no response"
          : status === "attended"
            ? "Marked attended"
            : status === "confirmed"
              ? "Marked confirmed"
              : "Updated",
    );
    await load();
  };

  const markMissedWithNote = async (r: UpcomingRow) => {
    const note =
      window.prompt(
        `Why was ${r.full_name}'s session missed? (optional)`,
        r.session_attendance_note || "Client did not attend / no show",
      ) ?? undefined;
    if (note === undefined) return;
    await setStatus(r.id, "missed", { note: note || "Client did not attend / no show" });
  };

  const reachOutWhatsApp = async (r: UpcomingRow) => {
    const phone = (r.phone || "").replace(/[^0-9]/g, "");
    if (!phone) return toast.error("No phone on file");
    const msg = encodeURIComponent(
      `Hi ${r.full_name.split(" ")[0]}, a gentle reminder about your InnerSpark session with ${r.therapist_name} on ${prettyDate(r.next_session_date!)}. Please confirm if you can still make it.`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank", "noopener,noreferrer");
    const cur = effectiveStatus(r);
    await setStatus(r.id, cur === "scheduled" || cur === "confirmed" ? "no_response" : cur, {
      bumpOutreach: true,
    });
  };

  const withDate = useMemo(
    () => [...rows].sort((a, b) => (a.next_session_date || "").localeCompare(b.next_session_date || "")),
    [rows],
  );

  const upcoming = useMemo(
    () =>
      withDate.filter((r) => {
        const st = effectiveStatus(r);
        return daysUntil(r.next_session_date!) >= 0 && st !== "missed" && st !== "attended" && st !== "cancelled";
      }),
    [withDate],
  );

  const missed = useMemo(() => withDate.filter((r) => effectiveStatus(r) === "missed"), [withDate]);

  const noResponse = useMemo(
    () =>
      withDate.filter(
        (r) => effectiveStatus(r) === "no_response" && daysUntil(r.next_session_date!) >= 0,
      ),
    [withDate],
  );

  const therapists = useMemo(
    () => Array.from(new Map(withDate.map((r) => [r.therapist_id, r.therapist_name])).entries()),
    [withDate],
  );

  const baseList = useMemo(() => {
    if (windowFilter === "missed") return missed;
    if (windowFilter === "no_response") return noResponse;
    return upcoming;
  }, [windowFilter, missed, noResponse, upcoming]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return baseList.filter((r) => {
      const days = daysUntil(r.next_session_date!);
      if (therapistFilter !== "all" && r.therapist_id !== therapistFilter) return false;
      if (windowFilter === "today" && days !== 0) return false;
      if (windowFilter === "tomorrow" && days !== 1) return false;
      if (windowFilter === "week" && (days < 0 || days > 7)) return false;
      if (!s) return true;
      return (
        r.full_name.toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        (r.email || "").toLowerCase().includes(s) ||
        r.therapist_name.toLowerCase().includes(s) ||
        (r.client_code || "").toLowerCase().includes(s)
      );
    });
  }, [baseList, search, therapistFilter, windowFilter]);

  const counts = useMemo(() => {
    const d = upcoming.map((r) => daysUntil(r.next_session_date!));
    return {
      today: d.filter((n) => n === 0).length,
      tomorrow: d.filter((n) => n === 1).length,
      week: d.filter((n) => n >= 0 && n <= 7).length,
      total: upcoming.length,
      missed: missed.length,
      no_response: noResponse.length,
    };
  }, [upcoming, missed, noResponse]);

  const exportCsv = () => {
    const header = [
      "#", "Next session", "Days away", "Attendance", "Outreach count", "Note",
      "Client", "Client code", "Type", "Phone", "Email", "Therapist", "Session type", "Payment",
    ];
    const lines = filtered.map((r, i) => [
      i + 1,
      r.next_session_date || "",
      daysUntil(r.next_session_date!),
      effectiveStatus(r),
      r.session_outreach_count ?? 0,
      r.session_attendance_note || "",
      r.full_name,
      r.client_code || "",
      r.client_type || "new",
      r.phone || "",
      r.email || "",
      r.therapist_name,
      r.session_type || "",
      r.paid_status || "",
    ]);
    const csv = [header, ...lines]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sessions-${windowFilter}-${todayIso()}.csv`;
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
              <CalendarClock className="h-5 w-5 text-primary" /> Upcoming & missed sessions
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Follow-up list · mark confirmed / no response / missed · updates automatically
              {updatedAt
                ? ` · last checked ${updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                : ""}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge className="text-[11px] cursor-pointer" variant={windowFilter === "today" ? "default" : "secondary"} onClick={() => setWindowFilter("today")}>
                Today: {counts.today}
              </Badge>
              <Badge className="text-[11px] cursor-pointer" variant={windowFilter === "tomorrow" ? "default" : "secondary"} onClick={() => setWindowFilter("tomorrow")}>
                Tomorrow: {counts.tomorrow}
              </Badge>
              <Badge className="text-[11px] cursor-pointer" variant={windowFilter === "week" ? "default" : "secondary"} onClick={() => setWindowFilter("week")}>
                Next 7 days: {counts.week}
              </Badge>
              <Badge className="text-[11px] cursor-pointer" variant={windowFilter === "all" ? "default" : "outline"} onClick={() => setWindowFilter("all")}>
                All upcoming: {counts.total}
              </Badge>
              <Badge className="text-[11px] cursor-pointer bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setWindowFilter("no_response")}>
                No response: {counts.no_response}
              </Badge>
              <Badge className="text-[11px] cursor-pointer" variant="destructive" onClick={() => setWindowFilter("missed")}>
                Missed: {counts.missed}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search client, phone, email, therapist…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Select value={windowFilter} onValueChange={setWindowFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All upcoming</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
              <SelectItem value="no_response">No response</SelectItem>
              <SelectItem value="missed">Missed sessions</SelectItem>
            </SelectContent>
          </Select>
          <Select value={therapistFilter} onValueChange={setTherapistFilter}>
            <SelectTrigger className="w-56"><SelectValue placeholder="All therapists" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All therapists</SelectItem>
              {therapists.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {windowFilter === "missed" && (
          <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
            Missed = session date passed or staff marked no-show. Use these rows to rebook or close the follow-up.
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No sessions match this view yet.</p>
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
                  <TableHead className="text-[11px]">Attendance</TableHead>
                  <TableHead className="text-[11px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => {
                  const days = daysUntil(r.next_session_date!);
                  const label = bucketLabel(days);
                  const st = effectiveStatus(r);
                  const meta = statusMeta[st];
                  const phone = (r.phone || "").replace(/[^0-9]/g, "");
                  const busy = busyId === r.id;
                  return (
                    <TableRow
                      key={r.id}
                      className={`text-xs ${
                        st === "missed" ? "bg-destructive/5" : st === "no_response" ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={days < 0 || days <= 1 ? "default" : "secondary"}
                            className={`w-fit text-[10px] ${days < 0 ? "bg-destructive" : ""}`}
                          >
                            {label}
                          </Badge>
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
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={meta.variant} className={`w-fit text-[10px] ${meta.className || ""}`}>
                            {meta.label}
                          </Badge>
                          {(r.session_outreach_count || 0) > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              Outreach ×{r.session_outreach_count}
                              {r.session_last_outreach_at
                                ? ` · ${new Date(r.session_last_outreach_at).toLocaleDateString("en-GB")}`
                                : ""}
                            </span>
                          )}
                          {r.session_attendance_note && (
                            <span className="text-[10px] text-muted-foreground max-w-[140px] truncate" title={r.session_attendance_note}>
                              {r.session_attendance_note}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 flex-wrap">
                          {phone && st !== "attended" && st !== "cancelled" && (
                            <Button size="sm" variant="outline" title="WhatsApp reminder (logs outreach)" disabled={busy} onClick={() => reachOutWhatsApp(r)}>
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {r.email && (
                            <Button size="sm" variant="ghost" asChild title="Email">
                              <a href={`mailto:${r.email}`}><Mail className="h-3.5 w-3.5" /></a>
                            </Button>
                          )}
                          {st !== "confirmed" && st !== "attended" && st !== "cancelled" && (
                            <Button size="sm" variant="outline" title="Client confirmed" disabled={busy} onClick={() => setStatus(r.id, "confirmed")}>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                          )}
                          {st !== "no_response" && st !== "attended" && st !== "missed" && st !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              title="No response to outreach"
                              disabled={busy}
                              onClick={() =>
                                setStatus(r.id, "no_response", {
                                  note: "Reached out — client did not respond",
                                  bumpOutreach: true,
                                })
                              }
                            >
                              <PhoneOff className="h-3.5 w-3.5 text-amber-600" />
                            </Button>
                          )}
                          {st !== "attended" && (
                            <Button size="sm" variant="outline" title="Attended" disabled={busy} onClick={() => setStatus(r.id, "attended")}>
                              <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
                            </Button>
                          )}
                          {st !== "missed" && (
                            <Button size="sm" variant="outline" title="Mark missed / no-show" disabled={busy} onClick={() => markMissedWithNote(r)}>
                              <XCircle className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          )}
                          {st !== "cancelled" && (
                            <Button size="sm" variant="ghost" title="Cancelled" disabled={busy} onClick={() => setStatus(r.id, "cancelled", { note: "Cancelled" })}>
                              <Ban className="h-3.5 w-3.5" />
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

        <p className="text-[11px] text-muted-foreground">
          WhatsApp logs outreach and can set <strong>No response</strong>. Use ✓ Confirmed · 📵 No response · 👤 Attended · ✕ Missed · 🚫 Cancelled.
          Overdue dates auto-flag as Missed on refresh.
        </p>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsTab;
