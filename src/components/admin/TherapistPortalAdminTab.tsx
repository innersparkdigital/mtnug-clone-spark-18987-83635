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
import { Loader2, Plus, Stethoscope, Copy, Trash2 } from "lucide-react";
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

const TherapistPortalAdminTab = () => {
  const [rows, setRows] = useState<TherapistAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", specialisation: "" });
  const [lastCreds, setLastCreds] = useState<{ email: string; password: string; login_url: string } | null>(null);

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
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(r)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistPortalAdminTab;