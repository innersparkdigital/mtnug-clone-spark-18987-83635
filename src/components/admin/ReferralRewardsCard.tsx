import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Loader2, Check, X, BadgeCheck } from "lucide-react";

type Reward = {
  id: string;
  slug: string;
  referrer_name: string | null;
  referrer_phone: string | null;
  referrer_email: string | null;
  reward_kind: string;
  amount: number;
  currency: string;
  status: string;
  client_name: string | null;
  booking_reference: string | null;
  session_amount_kes: number | null;
  approved_at: string | null;
  redeemed_at: string | null;
  created_at: string;
};

const KIND_LABEL: Record<string, string> = {
  client_discount: "Discount on next session",
  public_partner: "Payout per paid client",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  approved: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  redeemed: "bg-green-500/10 text-green-700 dark:text-green-300",
  rejected: "bg-muted text-muted-foreground",
};

export default function ReferralRewardsCard() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [amountDraft, setAmountDraft] = useState<Record<string, string>>({});

  const fetchRewards = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_referral_rewards" as any);
    if (error) {
      toast({ title: "Could not load rewards", description: error.message, variant: "destructive" });
    } else {
      setRows((data as unknown as Reward[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter)),
    [rows, statusFilter],
  );

  const totals = useMemo(() => {
    const count = (s: string) => rows.filter((r) => r.status === s).length;
    const owed = rows
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    return { pending: count("pending"), approved: count("approved"), redeemed: count("redeemed"), owed };
  }, [rows]);

  const setStatus = async (r: Reward, status: string) => {
    setBusyId(r.id);
    const draft = amountDraft[r.id];
    const { error } = await supabase.rpc("admin_set_referral_reward_status" as any, {
      _reward_id: r.id,
      _status: status,
      _amount: draft !== undefined && draft !== "" ? Number(draft) : null,
      _notes: null,
    });
    setBusyId(null);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Reward ${status}` });
    fetchRewards();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" /> Referrer Rewards
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            A reward is created automatically the moment a referred client is marked <strong>paid</strong>. Nothing is
            granted until you approve it here — approved discounts apply to the referrer's next session.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Awaiting approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="redeemed">Redeemed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat label="Awaiting approval" value={totals.pending} />
          <MiniStat label="Approved" value={totals.approved} />
          <MiniStat label="Redeemed" value={totals.redeemed} />
          <MiniStat label="Approved value owed" value={Math.round(totals.owed).toLocaleString()} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred client</TableHead>
                <TableHead>Reward type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.referrer_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.referrer_phone || r.referrer_email || `/${r.slug}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{r.client_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.booking_reference || ""}</div>
                  </TableCell>
                  <TableCell className="text-xs">{KIND_LABEL[r.reward_kind] || r.reward_kind}</TableCell>
                  <TableCell>
                    {r.status === "pending" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{r.currency}</span>
                        <Input
                          className="h-8 w-24 text-xs"
                          type="number"
                          value={amountDraft[r.id] ?? String(r.amount ?? 0)}
                          onChange={(e) => setAmountDraft({ ...amountDraft, [r.id]: e.target.value })}
                        />
                      </div>
                    ) : (
                      <span className="font-medium">
                        {r.currency} {Number(r.amount || 0).toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLE[r.status] || ""} variant="secondary">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    {r.status === "pending" && (
                      <>
                        <Button size="sm" disabled={busyId === r.id} onClick={() => setStatus(r, "approved")}>
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => setStatus(r, "rejected")}>
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => setStatus(r, "redeemed")}>
                        <BadgeCheck className="h-3 w-3 mr-1" /> Mark used on next session
                      </Button>
                    )}
                    {(r.status === "redeemed" || r.status === "rejected") && (
                      <span className="text-xs text-muted-foreground">
                        {r.redeemed_at ? new Date(r.redeemed_at).toLocaleDateString() : "—"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6 text-sm">
                    No rewards here yet. Mark a referred client as <strong>paid</strong> and their referrer's reward
                    appears for approval.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}