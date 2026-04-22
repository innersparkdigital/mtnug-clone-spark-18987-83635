import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, FileText, Users, Phone, MapPin, UserPlus, Stethoscope, Copy } from "lucide-react";

type Referral = {
  id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_phone: string;
  patient_name: string;
  patient_phone: string;
  location: string | null;
  concern: string | null;
  preferred_mode: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type DoctorRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  facility: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "booked", "completed", "no_response"] as const;

const statusColor = (s: string) => {
  switch (s) {
    case "new": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "contacted": return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "booked": return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    case "completed": return "bg-green-500/10 text-green-700 dark:text-green-300";
    case "no_response": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const ReferralsTab = () => {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Referral | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardSubmitting, setOnboardSubmitting] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ phone: string; password: string } | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", facility: "", password: "" });

  const fetchReferrals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("doctor_referrals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading referrals", description: error.message, variant: "destructive" });
    } else {
      setReferrals((data || []) as Referral[]);
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from("doctors")
      .select("id, full_name, phone, email, facility, created_at")
      .order("created_at", { ascending: false });
    setDoctors((data || []) as DoctorRow[]);
  };

  useEffect(() => {
    fetchReferrals();
    fetchDoctors();
    const channel = supabase
      .channel("referrals-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "doctor_referrals" }, fetchReferrals)
      .on("postgres_changes", { event: "*", schema: "public", table: "doctors" }, fetchDoctors)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setForm((f) => ({ ...f, password: p + "!" }));
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim() || !form.email.trim() || form.password.length < 8) {
      toast({ title: "Missing fields", description: "Name, phone, email and 8+ char password required", variant: "destructive" });
      return;
    }
    setOnboardSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-doctor", {
        body: {
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          facility: form.facility.trim() || null,
          password: form.password,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setCreatedCreds({ phone: form.phone.trim(), password: form.password });
      toast({ title: "Doctor onboarded", description: `Account created for Dr. ${form.full_name}` });
      setForm({ full_name: "", phone: "", email: "", facility: "", password: "" });
      fetchDoctors();
    } catch (err: any) {
      toast({ title: "Onboarding failed", description: err.message, variant: "destructive" });
    } finally {
      setOnboardSubmitting(false);
    }
  };

  const copyCreds = () => {
    if (!createdCreds) return;
    const text = `InnerSpark Doctor Portal\nLogin: https://www.innersparkafrica.com/for-professionals/refer\nPhone: ${createdCreds.phone}\nPassword: ${createdCreds.password}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Credentials copied" });
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("doctor_referrals").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    const { error } = await supabase.from("doctor_referrals").update({ admin_notes: noteDraft }).eq("id", selected.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note saved" });
      setSelected({ ...selected, admin_notes: noteDraft });
    }
  };

  const deleteReferral = async (id: string) => {
    if (!confirm("Delete this referral?")) return;
    const { error } = await supabase.from("doctor_referrals").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else toast({ title: "Referral deleted" });
  };

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.patient_name.toLowerCase().includes(q) ||
          r.patient_phone.toLowerCase().includes(q) ||
          r.doctor_name.toLowerCase().includes(q) ||
          r.doctor_phone.toLowerCase().includes(q) ||
          (r.location || "").toLowerCase().includes(q) ||
          (r.concern || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [referrals, statusFilter, search]);

  // Doctor tracking aggregation
  const doctorStats = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; total: number; converted: number }>();
    referrals.forEach((r) => {
      const cur = map.get(r.doctor_id) || { name: r.doctor_name, phone: r.doctor_phone, total: 0, converted: 0 };
      cur.total += 1;
      if (r.status === "booked" || r.status === "completed") cur.converted += 1;
      map.set(r.doctor_id, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [referrals]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { new: 0, contacted: 0, booked: 0, completed: 0, no_response: 0 };
    referrals.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [referrals]);

  return (
    <div className="space-y-6">
      {/* Header with Onboard button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" /> Doctor Referrals
          </h2>
          <p className="text-sm text-muted-foreground">Onboard doctors and manage incoming patient referrals.</p>
        </div>
        <Button onClick={() => { setCreatedCreds(null); setOnboardOpen(true); }}>
          <UserPlus className="w-4 h-4 mr-2" /> Onboard Doctor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map((s) => (
          <Card key={s}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground capitalize">{s.replace("_", " ")}</p>
              <p className="text-2xl font-bold">{counts[s] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctor tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4" /> Doctor Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doctorStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No referring doctors yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Total Referrals</TableHead>
                    <TableHead className="text-right">Converted</TableHead>
                    <TableHead className="text-right">Conversion %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorStats.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">Dr. {d.name}</TableCell>
                      <TableCell>{d.phone}</TableCell>
                      <TableCell className="text-right">{d.total}</TableCell>
                      <TableCell className="text-right">{d.converted}</TableCell>
                      <TableCell className="text-right">{d.total > 0 ? Math.round((d.converted / d.total) * 100) : 0}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onboarded doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-4 h-4" /> Onboarded Doctors ({doctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doctors onboarded yet. Click "Onboard Doctor" above to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone (login)</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Onboarded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((d, i) => (
                    <TableRow key={d.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">Dr. {d.full_name}</TableCell>
                      <TableCell><a href={`tel:${d.phone}`} className="text-primary hover:underline">{d.phone}</a></TableCell>
                      <TableCell className="text-sm">{d.email}</TableCell>
                      <TableCell className="text-sm">{d.facility || "—"}</TableCell>
                      <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Input placeholder="Search patient, doctor, location..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No referrals found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Concern</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Referred By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.patient_name}</TableCell>
                      <TableCell><a href={`tel:${r.patient_phone}`} className="text-primary hover:underline">{r.patient_phone}</a></TableCell>
                      <TableCell>{r.location || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{r.concern || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{r.preferred_mode}</Badge></TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Dr. {r.doctor_name}</div>
                          <div className="text-xs text-muted-foreground">{r.doctor_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                          <SelectTrigger className={`h-8 text-xs ${statusColor(r.status)}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelected(r); setNoteDraft(r.admin_notes || ""); }}>
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteReferral(r.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Referral Details & Notes</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient_name}</span></div>
                <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selected.patient_phone}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selected.location || "—"}</div>
                <div><span className="text-muted-foreground">Mode:</span> {selected.preferred_mode}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Concern:</span> {selected.concern || "—"}</div>
                <div className="col-span-2 border-t pt-2"><span className="text-muted-foreground">Referred by:</span> Dr. {selected.doctor_name} ({selected.doctor_phone})</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Internal Notes</label>
                {selected.admin_notes && (
                  <div className="mb-2 rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                    <div className="text-xs text-muted-foreground mb-1">Saved note</div>
                    {selected.admin_notes}
                  </div>
                )}
                <Textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={5} placeholder="Add internal notes about follow-up, booking status, etc." />
              </div>
              <Button onClick={saveNote} className="w-full">Save Note</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Onboard Doctor dialog */}
      <Dialog open={onboardOpen} onOpenChange={(o) => { setOnboardOpen(o); if (!o) setCreatedCreds(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Onboard a Doctor</DialogTitle>
          </DialogHeader>
          {createdCreds ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
                <p className="text-sm font-medium">Account created. Share these credentials with the doctor:</p>
                <div className="text-sm space-y-1">
                  <div><span className="text-muted-foreground">Login URL:</span> <span className="font-mono text-xs">/for-professionals/refer</span></div>
                  <div><span className="text-muted-foreground">Phone:</span> <span className="font-mono">{createdCreds.phone}</span></div>
                  <div><span className="text-muted-foreground">Password:</span> <span className="font-mono">{createdCreds.password}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyCreds} variant="outline" className="flex-1"><Copy className="w-4 h-4 mr-2" /> Copy</Button>
                <Button onClick={() => { setCreatedCreds(null); }} className="flex-1">Onboard another</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOnboard} className="space-y-3">
              <div>
                <Label htmlFor="d-name">Full Name *</Label>
                <Input id="d-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="d-phone">Phone Number * (used as login ID)</Label>
                <Input id="d-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+256 700 000 000" required />
              </div>
              <div>
                <Label htmlFor="d-email">Email *</Label>
                <Input id="d-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="d-fac">Facility (optional)</Label>
                <Input id="d-fac" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="d-pwd">Password * (min 8 chars)</Label>
                <div className="flex gap-2">
                  <Input id="d-pwd" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
                  <Button type="button" variant="outline" onClick={generatePassword}>Generate</Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={onboardSubmitting}>
                {onboardSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Doctor Account"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralsTab;