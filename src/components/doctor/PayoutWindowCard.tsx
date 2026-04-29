import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { fmtUGX, type Tier } from "@/lib/commissionTiers";

type Props = {
  tier: Tier;
  successCount: number;
  earnedThisMonth: number;
  monthLabel: string;
};

/**
 * Helpers to compute the payout window: end of current month OR
 * within the first 5 working days of the following month.
 */
const addBusinessDays = (start: Date, days: number) => {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
};

const fmtDate = (d: Date) =>
  d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const PayoutWindowCard = ({ tier, successCount, earnedThisMonth, monthLabel }: Props) => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const firstOfNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const fifthBusinessDay = addBusinessDays(new Date(firstOfNext.getFullYear(), firstOfNext.getMonth(), 0), 5);

  const cycleState =
    successCount === 0
      ? { label: "No earnings yet this month", tone: "bg-muted text-muted-foreground" }
      : { label: "Calculating — payout pending end of month", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300" };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Commission Payout Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Cycle</p>
            <p className="font-medium">{monthLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current tier</p>
            <p className="font-medium">{tier.label} • {fmtUGX(tier.perPatient)}/patient</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Earned so far</p>
            <p className="font-bold text-green-600">{fmtUGX(earnedThisMonth)}</p>
          </div>
        </div>

        <div>
          <Badge className={cycleState.tone}>{cycleState.label}</Badge>
        </div>

        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Expected payout window</p>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-amber-600" />
            <div>
              <p className="text-sm">Cycle closes <strong>{fmtDate(endOfMonth)}</strong></p>
              <p className="text-xs text-muted-foreground">All successful referrals up to this date are tallied at the final tier rate.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
            <div>
              <p className="text-sm">Payout sent by <strong>{fmtDate(fifthBusinessDay)}</strong></p>
              <p className="text-xs text-muted-foreground">End of month or within the first 5 working days of the next month.</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          A referral counts as <strong>successful</strong> only after all four steps: referred → booked → attended → paid.
          Tier is recalculated for the entire month every time a referral becomes successful.
        </p>
      </CardContent>
    </Card>
  );
};

export default PayoutWindowCard;