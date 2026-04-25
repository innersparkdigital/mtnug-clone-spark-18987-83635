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
import { Loader2, Trash2, FileText, Users, Phone, MapPin, UserPlus, Stethoscope, Copy, Mail, Ban, CheckCircle2, Calendar, Pencil, AlertTriangle, Send, ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildMonthlyBreakdown,
  tierForCount,
  monthKey,
  fmtUGX,
  TIERS,
  isSuccessful,
} from "@/lib/commissionTiers";
import SuccessChecklist from "@/components/doctor/SuccessChecklist";

type Claim = {
  id: string;
  doctor_name: string;
  doctor_phone: string;
  amount: number;
  status: string;
  payout_method: string | null;
  payout_details: string | null;
  created_at: string;
};

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
  payment_status: string;
  payment_amount: number | null;
  commission_amount: number | null;
  commission_status: string;
};

type DoctorRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  facility: string | null;
  location?: string | null;
  created_at: string;
  is_active?: boolean;
  deactivated_at?: string | null;
  deactivated_reason?: string | null;
  credentials_email_status?: string | null;
  credentials_email_sent_at?: string | null;
  credentials_email_error?: string | null;
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
  const [claims, setClaims] = useState<Claim[]>([]);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardSubmitting, setOnboardSubmitting] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ phone: string; password: string } | null>(null);
  const [createdEmailSent, setCreatedEmailSent] = useState<boolean>(false);
  const [deactivateTarget, setDeactivateTarget] = useState<DoctorRow | null>(null);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const [editTarget, setEditTarget] = useState<DoctorRow | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", email: "", facility: "", location: "", is_active: true });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", facility: "", location: "", password: "" });

  // Resend credentials dialog
  const [resendTarget, setResendTarget] = useState<DoctorRow | null>(null);
  const [resendPassword, setResendPassword] = useState("");
  const [resending, setResending] = useState(false);

  // Doctor table filters & pagination
  const [docSearch, setDocSearch] = useState("");
  const [docStatusFilter, setDocStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [docLocationFilter, setDocLocationFilter] = useState<string>("all");
  const [docPage, setDocPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(10);

  // Referrals filters & pagination
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [refPage, setRefPage] = useState(1);
  const [refPageSize, setRefPageSize] = useState(10);

  // Real-time clock — re-renders every minute so month/payout labels update naturally
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

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
      .select("id, full_name, phone, email, facility, location, created_at, is_active, deactivated_at, deactivated_reason, credentials_email_status, credentials_email_sent_at, credentials_email_error")
      .order("created_at", { ascending: false });
    setDoctors((data || []) as DoctorRow[]);
  };

  const fetchClaims = async () => {
    const { data } = await supabase
      .from("commission_claims")
      .select("id, doctor_name, doctor_phone, amount, status, payout_method, payout_details, created_at")
      .order("created_at", { ascending: false });
    setClaims((data || []) as Claim[]);
  };

  const updateClaimStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("commission_claims").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: `Claim ${status}` });
  };

  useEffect(() => {
    fetchReferrals();
    fetchDoctors();
    fetchClaims();
    const channel = supabase
      .channel("referrals-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "doctor_referrals" }, fetchReferrals)
      .on("postgres_changes", { event: "*", schema: "public", table: "doctors" }, fetchDoctors)
      .on("postgres_changes", { event: "*", schema: "public", table: "commission_claims" }, fetchClaims)
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
    if (!form.location.trim()) {
      toast({ title: "Location required", description: "Please enter the doctor's location.", variant: "destructive" });
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
          location: form.location.trim(),
          password: form.password,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setCreatedCreds({ phone: form.phone.trim(), password: form.password });
      setCreatedEmailSent(Boolean((data as any)?.email_sent));
      toast({
        title: "Doctor onboarded",
        description: (data as any)?.email_sent
          ? `Credentials emailed to ${form.email}`
          : `Account created — please share credentials manually with Dr. ${form.full_name}`,
        variant: (data as any)?.email_sent ? "default" : "destructive",
      });
      setForm({ full_name: "", phone: "", email: "", facility: "", location: "", password: "" });
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

  const openResend = (d: DoctorRow) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setResendPassword(p + "!");
    setResendTarget(d);
  };

  const handleResendCreds = async () => {
    if (!resendTarget) return;
    if (!resendPassword || resendPassword.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setResending(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-doctor", {
        body: { action: "resend_credentials", doctor_id: resendTarget.id, password: resendPassword },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const sent = Boolean((data as any)?.email_sent);
      toast({
        title: sent ? "Credentials email sent" : "Email failed to send",
        description: sent ? `New password emailed to ${resendTarget.email}.` : ((data as any)?.email_error || "Please retry."),
        variant: sent ? "default" : "destructive",
      });
      if (sent) setResendTarget(null);
      fetchDoctors();
    } catch (err: any) {
      toast({ title: "Email failed to send. Please retry.", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    const willDeactivate = deactivateTarget.is_active !== false;
    if (willDeactivate && !deactivateReason.trim()) {
      toast({ title: "Reason required", description: "Please enter a reason for deactivation.", variant: "destructive" });
      return;
    }
    setDeactivating(true);
    try {
      const action = willDeactivate ? "deactivate" : "reactivate";
      const { data, error } = await supabase.functions.invoke("admin-create-doctor", {
        body: { action, doctor_id: deactivateTarget.id, reason: deactivateReason },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({
        title: action === "deactivate" ? "Doctor deactivated" : "Doctor reactivated",
        description: action === "deactivate" ? "Account access has been restricted." : "Doctor can now log in again.",
      });
      setDeactivateTarget(null);
      setDeactivateReason("");
      fetchDoctors();
    } catch (err: any) {
      toast({ title: "Action failed", description: err.message, variant: "destructive" });
    } finally {
      setDeactivating(false);
    }
  };

  const openEdit = (d: DoctorRow) => {
    setEditTarget(d);
    setEditForm({
      full_name: d.full_name || "",
      phone: d.phone || "",
      email: d.email || "",
      facility: d.facility || "",
      location: d.location || "",
      is_active: d.is_active !== false,
    });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    if (!editForm.full_name.trim() || !editForm.phone.trim() || !editForm.email.trim()) {
      toast({ title: "Missing fields", description: "Name, phone and email are required", variant: "destructive" });
      return;
    }
    setEditSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-doctor", {
        body: {
          action: "update_doctor",
          doctor_id: editTarget.id,
          full_name: editForm.full_name.trim(),
          phone: editForm.phone.trim(),
          email: editForm.email.trim().toLowerCase(),
          facility: editForm.facility.trim() || null,
          location: editForm.location.trim() || null,
          is_active: editForm.is_active,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Doctor profile updated" });
      setEditTarget(null);
      fetchDoctors();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setEditSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("doctor_referrals").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
    }
  };

  const updatePayment = async (id: string, payment_status: string, payment_amount?: number) => {
    const patch: any = { payment_status };
    if (payment_amount !== undefined) patch.payment_amount = payment_amount;
    const { error } = await supabase.from("doctor_referrals").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: "Payment updated" });
  };

  const saveNote = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("doctor_referrals")
      .update({ admin_notes: noteDraft })
      .eq("id", selected.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Note saved" });
    setSelected({ ...selected, admin_notes: noteDraft });
    fetchReferrals();
  };

  const deleteReferral = async (id: string) => {
    if (!confirm("Delete this referral?")) return;
    const { error } = await supabase.from("doctor_referrals").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else toast({ title: "Referral deleted" });
  };

  const filtered = useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo).getTime() + 86400000 : null;
    return referrals.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (paymentFilter !== "all" && r.payment_status !== paymentFilter) return false;
      if (doctorFilter !== "all" && r.doctor_id !== doctorFilter) return false;
      if (fromTs || toTs) {
        const ts = new Date(r.created_at).getTime();
        if (fromTs && ts < fromTs) return false;
        if (toTs && ts >= toTs) return false;
      }
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
  }, [referrals, statusFilter, search, paymentFilter, doctorFilter, dateFrom, dateTo]);

  const pagedReferrals = useMemo(() => {
    const start = (refPage - 1) * refPageSize;
    return filtered.slice(start, start + refPageSize);
  }, [filtered, refPage, refPageSize]);

  // Reset page when filters change
  useEffect(() => { setRefPage(1); }, [statusFilter, search, paymentFilter, doctorFilter, dateFrom, dateTo, refPageSize]);

  // Doctors filtering & pagination
  const docLocations = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => { if (d.location) set.add(d.location); });
    return Array.from(set).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const isActive = d.is_active !== false;
      if (docStatusFilter === "active" && !isActive) return false;
      if (docStatusFilter === "inactive" && isActive) return false;
      if (docLocationFilter !== "all" && (d.location || "") !== docLocationFilter) return false;
      if (docSearch) {
        const q = docSearch.toLowerCase();
        return (
          d.full_name.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          (d.facility || "").toLowerCase().includes(q) ||
          (d.location || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [doctors, docStatusFilter, docLocationFilter, docSearch]);

  const pagedDoctors = useMemo(() => {
    const start = (docPage - 1) * docPageSize;
    return filteredDoctors.slice(start, start + docPageSize);
  }, [filteredDoctors, docPage, docPageSize]);

  useEffect(() => { setDocPage(1); }, [docStatusFilter, docLocationFilter, docSearch, docPageSize]);

  // Doctor tracking aggregation
  const doctorStats = useMemo(() => {
    const currentMonth = monthKey(new Date());
    const map = new Map<string, { name: string; phone: string; total: number; converted: number; successThisMonth: number; earnedThisMonth: number; lifetimeEarned: number }>();
    referrals.forEach((r) => {
      const cur = map.get(r.doctor_id) || { name: r.doctor_name, phone: r.doctor_phone, total: 0, converted: 0, successThisMonth: 0, earnedThisMonth: 0, lifetimeEarned: 0 };
      cur.total += 1;
      if (r.status === "booked" || r.status === "completed") cur.converted += 1;
      if (monthKey(r.created_at) === currentMonth && isSuccessful(r)) cur.successThisMonth += 1;
      cur.lifetimeEarned += Number(r.commission_amount || 0);
      map.set(r.doctor_id, cur);
    });
    // Apply tier rate to current-month successes
    map.forEach((v) => {
      const t = tierForCount(v.successThisMonth);
      v.earnedThisMonth = v.successThisMonth * (v.successThisMonth > 0 ? t.perPatient : 0);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [referrals]);

  // Platform-wide payout window summary (current month)
  const platformMonth = useMemo(() => {
    const cm = monthKey(now);
    let totalSuccess = 0;
    let totalEarned = 0;
    doctorStats.forEach((d) => {
      totalSuccess += d.successThisMonth;
      totalEarned += d.earnedThisMonth;
    });
    const label = now.toLocaleString(undefined, { month: "long", year: "numeric" });
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // 5th business day of next month
    const firstNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const d = new Date(firstNext.getFullYear(), firstNext.getMonth(), 0);
    let added = 0;
    while (added < 5) {
      d.setDate(d.getDate() + 1);
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) added += 1;
    }
    const msToClose = endOfMonth.getTime() + 86400000 - now.getTime();
    const daysToClose = Math.max(0, Math.ceil(msToClose / 86400000));
    return { cm, label, totalSuccess, totalEarned, endOfMonth, fifthBiz: d, daysToClose };
  }, [doctorStats, now]);

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
                    <TableHead className="text-right">Successes (this month)</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Earned (this month)</TableHead>
                    <TableHead className="text-right">Lifetime Commission</TableHead>
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
                      <TableCell className="text-right">{d.successThisMonth}</TableCell>
                      <TableCell><Badge variant="outline">{tierForCount(d.successThisMonth).label}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{fmtUGX(d.earnedThisMonth)}</TableCell>
                      <TableCell className="text-right">{fmtUGX(d.lifetimeEarned)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {TIERS.map((t) => (
              <div key={t.level} className="rounded-md border bg-muted/30 p-2">
                <div className="font-semibold">{t.label} <span className="text-muted-foreground font-normal">({t.range})</span></div>
                <div className="text-muted-foreground">{fmtUGX(t.perPatient)}/patient · {t.marginPct}% of margin</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Payout Window */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Commission Payout Cycle — {platformMonth.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Successful referrals (all doctors)</p>
              <p className="text-xl font-bold">{platformMonth.totalSuccess}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total commission accruing</p>
              <p className="text-xl font-bold text-green-600">{fmtUGX(platformMonth.totalEarned)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">State</p>
              <Badge className={platformMonth.totalSuccess > 0 ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}>
                {platformMonth.totalSuccess > 0 ? "Calculating — pending end of month" : "No earnings this cycle yet"}
              </Badge>
            </div>
          </div>
          <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
            <p><strong>Cycle closes:</strong> {platformMonth.endOfMonth.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
            <p><strong>Payout sent by:</strong> {platformMonth.fifthBiz.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} (within first 5 working days of next month)</p>
            <p className="text-muted-foreground">Tiers are recalculated for the entire month each time a new success is recorded.</p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarded doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-4 h-4" /> Onboarded Doctors ({filteredDoctors.length} of {doctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Input placeholder="Search name, phone, email, location…" value={docSearch} onChange={(e) => setDocSearch(e.target.value)} className="flex-1" />
            <Select value={docStatusFilter} onValueChange={(v) => setDocStatusFilter(v as any)}>
              <SelectTrigger className="w-full md:w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select value={docLocationFilter} onValueChange={setDocLocationFilter}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {docLocations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {doctors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doctors onboarded yet. Click "Onboard Doctor" above to add one.</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doctors match the current filters.</p>
          ) : (
            <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {pagedDoctors.map((d) => {
                const emailStatus = d.credentials_email_status || "pending";
                const emailBadge = emailStatus === "sent" ? "bg-green-500/10 text-green-700" : emailStatus === "failed" ? "bg-red-500/10 text-red-700" : "bg-amber-500/10 text-amber-700";
                return (
                  <div key={d.id} className="rounded-lg border p-3 bg-card space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">Dr. {d.full_name}</p>
                        <p className="text-xs text-muted-foreground">{d.facility || "—"} · {d.location || "—"}</p>
                      </div>
                      {d.is_active === false ? (
                        <Badge className="bg-red-500/10 text-red-700">Inactive</Badge>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                      )}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div><Phone className="w-3 h-3 inline mr-1" /><a href={`tel:${d.phone}`} className="text-primary">{d.phone}</a></div>
                      <div><Mail className="w-3 h-3 inline mr-1" />{d.email}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={emailBadge}>Email: {emailStatus}</Badge>
                      {d.credentials_email_sent_at && <span className="text-muted-foreground">{new Date(d.credentials_email_sent_at).toLocaleString()}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(d)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => openResend(d)}><Send className="w-3.5 h-3.5 mr-1" />Resend</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setDeactivateTarget(d); setDeactivateReason(""); }}>
                        {d.is_active === false ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />Reactivate</> : <><Ban className="w-3.5 h-3.5 mr-1 text-destructive" />Deactivate</>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="overflow-x-auto hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone (login)</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Onboarded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credentials Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedDoctors.map((d, i) => {
                    const emailStatus = d.credentials_email_status || "pending";
                    const emailBadge = emailStatus === "sent" ? "bg-green-500/10 text-green-700 dark:text-green-300" : emailStatus === "failed" ? "bg-red-500/10 text-red-700 dark:text-red-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300";
                    return (
                    <TableRow key={d.id}>
                      <TableCell className="text-muted-foreground">{(docPage - 1) * docPageSize + i + 1}</TableCell>
                      <TableCell className="font-medium">Dr. {d.full_name}</TableCell>
                      <TableCell><a href={`tel:${d.phone}`} className="text-primary hover:underline">{d.phone}</a></TableCell>
                      <TableCell className="text-sm">{d.email}</TableCell>
                      <TableCell className="text-sm">{d.facility || "—"}</TableCell>
                      <TableCell className="text-sm">{d.location || "—"}</TableCell>
                      <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {d.is_active === false ? (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-300">Deactivated</Badge>
                        ) : (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <Badge className={`${emailBadge} capitalize w-fit`}>{emailStatus}</Badge>
                          {d.credentials_email_sent_at && <span className="text-[10px] text-muted-foreground">{new Date(d.credentials_email_sent_at).toLocaleString()}</span>}
                          {emailStatus === "failed" && d.credentials_email_error && <span className="text-[10px] text-destructive truncate max-w-[160px]" title={d.credentials_email_error}>{d.credentials_email_error}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => openEdit(d)} title="Edit doctor profile">
                            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openResend(d)} title="Resend credentials email">
                            <Send className="w-3.5 h-3.5 mr-1" /> Resend
                          </Button>
                          <Button
                            size="sm"
                            variant={d.is_active === false ? "outline" : "ghost"}
                            onClick={() => { setDeactivateTarget(d); setDeactivateReason(""); }}
                            title={d.is_active === false ? "Reactivate doctor" : "Deactivate doctor"}
                          >
                            {d.is_active === false ? (
                              <><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> Reactivate</>
                            ) : (
                              <><Ban className="w-3.5 h-3.5 mr-1 text-destructive" /> Deactivate</>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Doctors pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-sm">
              <div className="text-muted-foreground">
                Showing {pagedDoctors.length} of {filteredDoctors.length}
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(docPageSize)} onValueChange={(v) => setDocPageSize(Number(v))}>
                  <SelectTrigger className="h-8 w-[80px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setDocPage((p) => Math.max(1, p - 1))} disabled={docPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-xs">Page {docPage} of {Math.max(1, Math.ceil(filteredDoctors.length / docPageSize))}</span>
                <Button size="sm" variant="outline" onClick={() => setDocPage((p) => p + 1)} disabled={docPage >= Math.ceil(filteredDoctors.length / docPageSize)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
            <Input placeholder="Search patient, doctor, location…" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger><SelectValue placeholder="Doctor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All doctors</SelectItem>
                {doctors.map((d) => <SelectItem key={d.id} value={d.id}>Dr. {d.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="not_paid">Not paid</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-xs" title="From" />
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-xs" title="To" />
            </div>
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
                    <TableHead>Payment</TableHead>
                    <TableHead>Success Checklist</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedReferrals.map((r) => (
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
                        <Select value={r.payment_status} onValueChange={(v) => updatePayment(r.id, v)}>
                          <SelectTrigger className="h-8 text-xs w-[110px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_paid">Not paid</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <SuccessChecklist status={r.status} payment_status={r.payment_status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          defaultValue={r.payment_amount || ""}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (val !== Number(r.payment_amount || 0)) updatePayment(r.id, r.payment_status, val);
                          }}
                          className="h-8 w-24 text-xs ml-auto"
                          placeholder="0"
                        />
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

          {/* Referrals pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-sm">
              <div className="text-muted-foreground">Showing {pagedReferrals.length} of {filtered.length} (total {referrals.length})</div>
              <div className="flex items-center gap-2">
                <Select value={String(refPageSize)} onValueChange={(v) => setRefPageSize(Number(v))}>
                  <SelectTrigger className="h-8 w-[80px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setRefPage((p) => Math.max(1, p - 1))} disabled={refPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-xs">Page {refPage} of {Math.max(1, Math.ceil(filtered.length / refPageSize))}</span>
                <Button size="sm" variant="outline" onClick={() => setRefPage((p) => p + 1)} disabled={refPage >= Math.ceil(filtered.length / refPageSize)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
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

      {/* Commission Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission Claims ({claims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commission claims yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">Dr. {c.doctor_name}</div>
                        <div className="text-xs text-muted-foreground">{c.doctor_phone}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">UGX {Math.round(Number(c.amount)).toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{c.payout_method || "—"}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{c.payout_details || "—"}</TableCell>
                      <TableCell>
                        <Select value={c.status} onValueChange={(v) => updateClaimStatus(c.id, v)}>
                          <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
                <Badge className={createdEmailSent ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}>
                  <Mail className="w-3 h-3 mr-1" />
                  {createdEmailSent ? "Credentials emailed to doctor" : "Email not sent — share manually"}
                </Badge>
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
                <Label htmlFor="d-loc">Location *</Label>
                <Input id="d-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kampala" required />
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

      {/* Edit Doctor dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-3">
            <div>
              <Label htmlFor="e-name">Full Name *</Label>
              <Input id="e-name" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="e-phone">Phone *</Label>
                <Input id="e-phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="e-email">Email *</Label>
                <Input id="e-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="e-fac">Facility</Label>
                <Input id="e-fac" value={editForm.facility} onChange={(e) => setEditForm({ ...editForm, facility: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="e-loc">Location</Label>
                <Input id="e-loc" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="e.g. Kampala" />
              </div>
            </div>
            <div>
              <Label htmlFor="e-status">Status</Label>
              <Select value={editForm.is_active ? "active" : "inactive"} onValueChange={(v) => setEditForm({ ...editForm, is_active: v === "active" })}>
                <SelectTrigger id="e-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditTarget(null)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={editSubmitting}>
                {editSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deactivate / Reactivate confirmation dialog */}
      <Dialog open={!!deactivateTarget} onOpenChange={(o) => { if (!o) { setDeactivateTarget(null); setDeactivateReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {deactivateTarget?.is_active === false ? (
                <><CheckCircle2 className="w-5 h-5 text-green-600" /> Reactivate Doctor Account</>
              ) : (
                <><AlertTriangle className="w-5 h-5 text-destructive" /> Deactivate Doctor Account</>
              )}
            </DialogTitle>
          </DialogHeader>
          {deactivateTarget?.is_active === false ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Restore login access for <strong>Dr. {deactivateTarget?.full_name}</strong>? They will be able to sign in to the referral portal again.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
                <Button className="flex-1" onClick={handleDeactivate} disabled={deactivating}>
                  {deactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reactivation"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive">
                Are you sure you want to deactivate <strong>Dr. {deactivateTarget?.full_name}</strong>? This action will restrict access to the platform.
              </div>
              <div>
                <Label htmlFor="deact-reason">Reason for deactivation <span className="text-destructive">*</span></Label>
                <Textarea
                  id="deact-reason"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Enter reason for deactivation…"
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">This reason will be saved for accountability and audit logs.</p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeactivate}
                  disabled={deactivating || !deactivateReason.trim()}
                >
                  {deactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Deactivation"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resend Credentials dialog */}
      <Dialog open={!!resendTarget} onOpenChange={(o) => { if (!o) setResendTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> Resend Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>This will reset <strong>Dr. {resendTarget?.full_name}</strong>'s password and email the new credentials to <strong>{resendTarget?.email}</strong>.</p>
            <div>
              <Label htmlFor="r-pwd">New temporary password *</Label>
              <div className="flex gap-2">
                <Input id="r-pwd" value={resendPassword} onChange={(e) => setResendPassword(e.target.value)} minLength={8} />
                <Button type="button" variant="outline" onClick={() => {
                  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
                  let p = ""; for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
                  setResendPassword(p + "!");
                }}>Generate</Button>
              </div>
            </div>
            {resendTarget?.credentials_email_status === "failed" && resendTarget?.credentials_email_error && (
              <div className="rounded-md bg-destructive/5 border border-destructive/20 p-2 text-xs text-destructive">
                Last error: {resendTarget.credentials_email_error}
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setResendTarget(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleResendCreds} disabled={resending || resendPassword.length < 8}>
                {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password & Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralsTab;