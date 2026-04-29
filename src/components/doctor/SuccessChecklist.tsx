import { Check, Circle } from "lucide-react";

type Step = { key: string; label: string; done: boolean };

type Props = {
  status: string;            // doctor_referrals.status
  payment_status: string;    // doctor_referrals.payment_status
  size?: "sm" | "md";
  layout?: "horizontal" | "vertical";
};

/**
 * Visual checklist: Referred → Booked → Attended → Paid.
 * "Attended" maps to status === 'completed'. "Paid" maps to payment_status === 'paid'.
 * Only when all four are checked does a referral count as a "Successful Referral"
 * eligible for commission.
 */
const SuccessChecklist = ({ status, payment_status, size = "sm", layout = "horizontal" }: Props) => {
  const steps: Step[] = [
    { key: "referred", label: "Referred", done: true },
    { key: "booked", label: "Booked", done: ["booked", "completed"].includes(status) },
    { key: "attended", label: "Attended", done: status === "completed" },
    { key: "paid", label: "Paid", done: payment_status === "paid" },
  ];
  const allDone = steps.every((s) => s.done);
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div
      className={
        layout === "horizontal"
          ? "flex flex-wrap items-center gap-1.5"
          : "flex flex-col gap-1"
      }
      title={allDone ? "Successful referral — eligible for commission" : "Not yet successful"}
    >
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          {s.done ? (
            <span className={`inline-flex items-center justify-center rounded-full bg-green-500/15 text-green-700 dark:text-green-300 ${iconSize}`}>
              <Check className="w-2.5 h-2.5" />
            </span>
          ) : (
            <Circle className={`${iconSize} text-muted-foreground/40`} />
          )}
          <span className={`${textSize} ${s.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
          {layout === "horizontal" && i < steps.length - 1 && (
            <span className="text-muted-foreground/40">›</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SuccessChecklist;