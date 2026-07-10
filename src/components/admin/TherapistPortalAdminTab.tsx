import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Stethoscope, Copy, Trash2, Eye, AlertTriangle, ClipboardList, Users } from "lucide-react";
import { toast } from "sonner";

interface TherapistAccount {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  specialisation: string | null;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}

interface OversightClient {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  presenting_concern: string | null;
  created_at: string;
  last_seen_at: string | null;
  submissions: number;
  last_submission_at: string | null;
  open_safety_alerts: number;
}

interface OversightSubmission {
  id: string;
  client_id: string;
  submission_type: string | null;
  screening_score: number | null;
  screening_severity: string | null;
  mood_score: number | null;
  safety_flag: boolean | null;
  submitted_at: string;
}

interface OversightAlert {
  id: string;
  client_id: string;
  severity: string | null;
  resolved: boolean;
  created_at: string;
  payload: Record<string, unknown> | null;
}

const TherapistPortalAdminTab = () => {
  const [rows, setRows] = useState<TherapistAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", specialisation: "" });
  const [lastCreds, setLastCreds] = useState<{ email: string; password: string; login_url: string } | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewTherapist, setViewTherapist] = useState<TherapistAccount | null>(null);
  const [oversightClients, setOversightClients] = useState<OversightClient[]>([]);
  const [oversightSubs, setOversightSubs] = useState<OversightSubmission[]>([]);
  const [oversightAlerts, setOversightAlerts] = useState<OversightAlert[]>([]);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("therapist_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as TherapistAccount[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleCreate = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-create-therapist", {
      body: { action: "create", ...form, email: form.email.toLowerCase().trim() },
    });
    setSubmitting(false);
    const err = error?.message || (data as { error?: string })?.error;
    if (err) {
      toast.error(err);
      return;
    }
    const creds = (data as { credentials?: typeof lastCreds }).credentials;
    if (creds) setLastCreds(creds);
    toast.success((data as { email_sent?: boolean }).email_sent ? "Therapist created — welcome email sent" : "Therapist created — email failed, share credentials manually");
    setForm({ full_name: "", email: "", phone: "", specialisation: "" });
    setOpen(false);
    fetchRows();
  };

  const toggleActive = async (row: TherapistAccount) => {
    const { error } = await supabase.functions.invoke("admin-create-therapist", {
      body: { action: "set_active", therapist_id: row.id, is_active: !row.is_active },
    });
    if (error) toast.error(error.message);
    else fetchRows();
  };

  const handleDelete = async (row: TherapistAccount) => {
    if (!confirm(`Delete therapist ${row.full_name}? This removes their login and all data.`)) return;
    const { data, error } = await supabase.functions.invoke("admin-create-therapist", {
      body: { action: "delete", therapist_id: row.id },
    });
    const err = error?.message || (data as { error?: string })?.error;
    if (err) toast.error(err);
    else {
      toast.success("Removed");
      fetchRows();
    }
  };

  const copyCreds = () => {
    if (!lastCreds) return;
    navigator.clipboard.writeText(
      `Portal: ${lastCreds.login_url}\nEmail: ${lastCreds.email}\nTemporary password: ${lastCreds.password}`,
    );
    toast.success("Credentials copied");
  };

  const openOversight = async (row: TherapistAccount) => {
    setViewTherapist(row);
    setViewOpen(true);
    setViewLoading(true);
    const { data: clients } = await supabase
      .from("therapist_clients")
      .select("id, full_name, email, phone, presenting_concern, created_at, last_seen_at")
      .eq("therapist_id", row.id)
      .order("created_at", { ascending: false });
    const clientIds = (clients || []).map((c) => c.id);

    let subs: OversightSubmission[] = [];
    let alerts: OversightAlert[] = [];
    if (clientIds.length) {
      const { data: sData } = await supabase
        .from("tool_submissions")
        .select("id, client_id, submission_type, screening_score, screening_severity, mood_score, safety_flag, submitted_at")
        .in("client_id", clientIds)
        .order("submitted_at", { ascending: false })
        .limit(200);
      subs = (sData as OversightSubmission[]) || [];
      const { data: aData } = await supabase
        .from("safety_alerts")
        .select("id, client_id, severity, resolved, created_at, payload")
        .in("client_id", clientIds)
        .order("created_at", { ascending: false });
      alerts = (aData as OversightAlert[]) || [];
    }

    const enriched: OversightClient[] = (clients || []).map((c) => {
      const cSubs = subs.filter((s) => s.client_id === c.id);
      const openAlerts = alerts.filter((a) => a.client_id === c.id && !a.resolved).length;
      return {
        ...c,
        submissions: cSubs.length,
        last_submission_at: cSubs[0]?.submitted_at || null,
        open_safety_alerts: openAlerts,
      };
    });
    setOversightClients(enriched);
    setOversightSubs(subs);
    setOversightAlerts(alerts);
    setViewLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Therapist Portal Accounts
            </CardTitle>
            <CardDescription>Onboard therapists to the clinical portal. They can build client assignments and track progress.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Therapist</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Therapist</DialogTitle>
                <DialogDescription>
                  A temporary password is auto-generated and emailed. They will be forced to change it on first login.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Full name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+256 …" />
                  </div>
                  <div>
                    <Label>Specialisation</Label>
                    <Input value={form.specialisation} onChange={(e) => setForm({ ...form, specialisation: e.target.value })} placeholder="CBT, Trauma…" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {lastCreds && (
            <div className="mb-4 rounded-lg border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">Last created credentials</div>
                  <div className="text-xs text-muted-foreground">
                    {lastCreds.email} · Temp password: <span className="font-mono">{lastCreds.password}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={copyCreds}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No therapist portal accounts yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialisation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell className="text-sm">{r.email}</TableCell>
                    <TableCell className="text-sm">{r.phone || "—"}</TableCell>
                    <TableCell className="text-sm">{r.specialisation || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} />
                        <Badge variant={r.is_active ? "default" : "secondary"}>
                          {r.is_active ? "Active" : "Disabled"}
                        </Badge>
                        {r.must_change_password && <Badge variant="outline" className="text-xs">Awaiting first login</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openOversight(r)} title="View clients & activity">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(r)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {viewTherapist?.full_name || "Therapist"} — oversight
            </DialogTitle>
            <DialogDescription>
              Admin view of this therapist's clients, tool submissions, and safety alerts.
            </DialogDescription>
          </DialogHeader>
          {viewLoading ? (
            <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Clients</div>
                  <div className="text-2xl font-semibold">{oversightClients.length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><ClipboardList className="h-3 w-3" /> Submissions</div>
                  <div className="text-2xl font-semibold">{oversightSubs.length}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Open alerts</div>
                  <div className="text-2xl font-semibold text-destructive">
                    {oversightAlerts.filter((a) => !a.resolved).length}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-medium mb-2">Clients</div>
                {oversightClients.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                    This therapist has no clients yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Concern</TableHead>
                        <TableHead className="text-right">Submissions</TableHead>
                        <TableHead>Last activity</TableHead>
                        <TableHead className="text-right">Alerts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {oversightClients.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.full_name}</TableCell>
                          <TableCell className="text-xs">
                            {c.email || "—"}
                            {c.phone ? <div>{c.phone}</div> : null}
                          </TableCell>
                          <TableCell className="text-xs">{c.presenting_concern || "—"}</TableCell>
                          <TableCell className="text-right">{c.submissions}</TableCell>
                          <TableCell className="text-xs">
                            {c.last_submission_at
                              ? new Date(c.last_submission_at).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {c.open_safety_alerts > 0 ? (
                              <Badge variant="destructive">{c.open_safety_alerts}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">0</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {oversightAlerts.length > 0 && (
                <div>
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" /> Safety alerts
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Raised</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {oversightAlerts.slice(0, 20).map((a) => {
                        const client = oversightClients.find((c) => c.id === a.client_id);
                        return (
                          <TableRow key={a.id}>
                            <TableCell className="text-sm">{client?.full_name || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={a.severity === "high" ? "destructive" : "secondary"}>
                                {a.severity || "info"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={a.resolved ? "outline" : "destructive"}>
                                {a.resolved ? "Resolved" : "Open"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(a.created_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div>
                <div className="font-medium mb-2">Recent submissions</div>
                {oversightSubs.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                    No submissions yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Tool</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {oversightSubs.slice(0, 25).map((s) => {
                        const client = oversightClients.find((c) => c.id === s.client_id);
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="text-sm">{client?.full_name || "—"}</TableCell>
                            <TableCell className="text-xs">{s.submission_type || "—"}</TableCell>
                            <TableCell className="text-xs">
                              {s.screening_score ?? s.mood_score ?? "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {s.screening_severity || (s.safety_flag ? "safety flagged" : "—")}
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(s.submitted_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistPortalAdminTab;