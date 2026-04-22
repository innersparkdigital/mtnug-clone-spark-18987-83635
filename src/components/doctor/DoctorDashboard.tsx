import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Wallet, TrendingUp, CheckCircle2, Clock, Users, Eye } from "lucide-react";

type Doctor = { id: string; full_name: string; phone: string };
type Referral = {
  id: string;
  patient_name: string;
  patient_phone: string;
  preferred_mode: string;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  commission_amount: number | null;
  commission_status: string;
  concern: string | null;
  location: string | null;
  created_at: string;
};
type Claim = {
  id: string;
  amount: number;
  status: string;
  payout_method: string | null;
  created_at: string;
  paid_at: string | null;
};

const statusColor = (s: string) => {
  switch (s) {
    case "new": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "contacted": return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "booked": return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    case "completed": return "bg-green-500/10 text-green-700 dark:text-green-300";
    default: return "bg-muted text-muted-foreground";
  }
};

const fmtUGX = (n: number) => `UGX ${Math.round(n || 0).toLocaleString()}`;

interface Props {
  doctor: Doctor;
  onNewReferral: () => void;
}

const DoctorDashboard = ({ doctor, onNewReferral }: Props) => {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Referral | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState("Mobile Money");
  const [payoutDetails, setPayoutDetails] = useState("");

  const fetchData = async () => {
    const [refRes, claimRes] = await Promise.all([
      supabase.from("doctor_referrals").select("*").eq("doctor_id", doctor.id).order("created_at", { ascending: false }),
      supabase.from("commission_claims").select("*").eq("doctor_id", doctor.id).order("created_at", { ascending: false }),
    ]);
    setReferrals((refRes.data || []) as any);
    setClaims((claimRes.data || []) as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel(`doctor-${doctor.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "doctor_referrals", filter: `doctor_id=eq.${doctor.id}` }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "commission_claims", filter: `doctor_id=eq.${doctor.id}` }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [doctor.id]);

  const stats = useMemo(() => {
    const s = { total: 0, contacted: 0, booked: 0, completed: 0, paid: 0 };
    referrals.forEach((r) => {
      s.total += 1;
      if (r.status === "contacted") s.contacted += 1;
      if (r.status === "booked") s.booked += 1;
      if (r.status === "completed") s.completed += 1;
      if (r.payment_status === "paid") s.paid += 1;
    });
    return s;
  }, [referrals]);

  const commission = useMemo(() => {
    let earned = 0, claimed = 0, paid = 0;
    referrals.forEach((r) => {
      const amt = Number(r.commission_amount || 0);
      if (r.commission_status === "earned") earned += amt;
      else if (r.commission_status === "claimed") claimed += amt;
      else if (r.commission_status === "paid") paid += amt;
    });
    return { earned, claimed, paid, total: earned + claimed + paid };
  }, [referrals]);

  const earnedReferrals = useMemo(() => referrals.filter((r) => r.commission_status === "earned"), [referrals]);

  const handleClaimSubmit = async () => {
    if (earnedReferrals.length === 0 || commission.earned <= 0) {
      toast({ title: "Nothing to claim", description: "You don't have unclaimed earned commission yet.", variant: "destructive" });
      return;
    }
    if (!payoutDetails.trim()) {
      toast({ title: "Payout details required", variant: "destructive" });
      return;
    }
    setSubmittingClaim(true);
    try {
      const { data: claim, error } = await supabase
        .from("commission_claims")
        .insert({
          doctor_id: doctor.id,
          doctor_name: doctor.full_name,
          doctor_phone: doctor.phone,
          amount: commission.earned,
          payout_method: payoutMethod,
          payout_details: payoutDetails.trim(),
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;

      const items = earnedReferrals.map((r) => ({
        claim_id: claim.id,
        referral_id: r.id,
        amount: Number(r.commission_amount || 0),
      }));
      const { error: itemsErr } = await supabase.from("commission_claim_items").insert(items);
      if (itemsErr) throw itemsErr;

      toast({ title: "Claim submitted", description: "Admin will review your claim shortly." });
      setClaimOpen(false);
      setPayoutDetails("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Claim failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Welcome, Dr. {doctor.full_name}</h2>
          <p className="text-sm text-muted-foreground">{doctor.phone}</p>
        </div>
        <Button onClick={onNewReferral} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> New Referral
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="w-3 h-3" /> Total</div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Contacted</p>
            <p className="text-2xl font-bold">{stats.contacted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Booked</p>
            <p className="text-2xl font-bold">{stats.booked}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Wallet className="w-4 h-4 text-primary" /> My Commission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Total Earned</p>
              <p className="text-lg font-bold">{fmtUGX(commission.total)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="w-3 h-3" /> Available</p>
              <p className="text-lg font-bold text-green-600">{fmtUGX(commission.earned)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Claimed</p>
              <p className="text-lg font-bold text-amber-600">{fmtUGX(commission.claimed)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Paid Out</p>
              <p className="text-lg font-bold">{fmtUGX(commission.paid)}</p>
            </div>
          </div>
          <Button
            onClick={() => setClaimOpen(true)}
            disabled={commission.earned <= 0}
            className="mt-4 w-full sm:w-auto"
          >
            <Wallet className="w-4 h-4 mr-2" /> Claim Commission ({fmtUGX(commission.earned)})
          </Button>
        </CardContent>
      </Card>

      {/* Referrals table */}
      <Card>
        <CardHeader><CardTitle className="text-base">My Referrals</CardTitle></CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No referrals yet. Click "New Referral" to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.patient_name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{r.patient_phone}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{r.preferred_mode}</Badge></TableCell>
                      <TableCell><Badge className={`capitalize ${statusColor(r.status)}`}>{r.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell>
                        {r.payment_status === "paid" ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">Paid</Badge>
                        ) : (
                          <Badge variant="outline">Not paid</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {Number(r.commission_amount || 0) > 0 ? fmtUGX(Number(r.commission_amount)) : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setSelected(r)}><Eye className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim history */}
      {claims.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Commission Claims</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">{fmtUGX(Number(c.amount))}</TableCell>
                      <TableCell className="text-sm">{c.payout_method || "—"}</TableCell>
                      <TableCell>
                        <Badge className={
                          c.status === "paid" ? "bg-green-500/10 text-green-700" :
                          c.status === "approved" ? "bg-blue-500/10 text-blue-700" :
                          c.status === "rejected" ? "bg-red-500/10 text-red-700" :
                          "bg-amber-500/10 text-amber-700"
                        }>{c.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{c.paid_at ? new Date(c.paid_at).toLocaleDateString() : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referral detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Referral Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient_name}</span></div>
              <div><span className="text-muted-foreground">Phone:</span> {selected.patient_phone}</div>
              <div><span className="text-muted-foreground">Location:</span> {selected.location || "—"}</div>
              <div><span className="text-muted-foreground">Concern:</span> {selected.concern || "—"}</div>
              <div><span className="text-muted-foreground">Mode:</span> {selected.preferred_mode}</div>
              <div><span className="text-muted-foreground">Date:</span> {new Date(selected.created_at).toLocaleString()}</div>
              <div className="border-t pt-2 mt-2">
                <div><span className="text-muted-foreground">Status:</span> <Badge className={`capitalize ${statusColor(selected.status)}`}>{selected.status.replace("_", " ")}</Badge></div>
                <div className="mt-1"><span className="text-muted-foreground">Payment:</span> {selected.payment_status === "paid" ? `Paid (${fmtUGX(Number(selected.payment_amount || 0))})` : "Not paid"}</div>
                <div className="mt-1"><span className="text-muted-foreground">Commission:</span> {fmtUGX(Number(selected.commission_amount || 0))} ({selected.commission_status})</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Claim dialog */}
      <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Claim Commission</DialogTitle>
            <DialogDescription>Submit a payout request to InnerSpark Africa admin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">Dr. {doctor.full_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{doctor.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Earned referrals</span><span className="font-medium">{earnedReferrals.length}</span></div>
              <div className="flex justify-between border-t pt-1 mt-1"><span className="text-muted-foreground">Amount to claim</span><span className="font-bold text-primary">{fmtUGX(commission.earned)}</span></div>
            </div>
            <div>
              <Label htmlFor="payout-method">Payout Method</Label>
              <select
                id="payout-method"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option>Mobile Money</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="payout-details">Payout Details</Label>
              <Textarea
                id="payout-details"
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder="e.g. MTN +256 700 000 000, Account name: John Doe"
                rows={3}
              />
            </div>
            <Button onClick={handleClaimSubmit} className="w-full" disabled={submittingClaim}>
              {submittingClaim ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Claim"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
