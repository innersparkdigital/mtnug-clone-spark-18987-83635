import { getTool } from "@/lib/wellbeingToolsCatalog";
import MiniSparkline from "@/components/therapist/MiniSparkline";

export interface ClientToolCardData {
  id: string;
  tool_key: string;
  title: string | null;
  therapist_note: string | null;
  due_date: string | null;
  status: string;
  completedToday?: boolean;
  scheduleLabel?: string | null;
  completed_dates?: string[];
}

interface Props {
  tool: ClientToolCardData;
  onOpen: () => void;
}

const initials = (s: string) =>
  s.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

const toIso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Classify a tool for the badge — screening/safety = SAFETY, everything else = WELLNESS. */
const categoryFor = (key: string): { label: string; className: string } => {
  if (key === "safety-checkin") return { label: "SAFETY", className: "bg-destructive/15 text-destructive border-destructive/30" };
  if (key.startsWith("screening-")) return { label: "SCREENING", className: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
  return { label: "WELLNESS", className: "bg-primary/15 text-primary border-primary/30" };
};

const ClientToolCard = ({ tool, onOpen }: Props) => {
  const meta = getTool(tool.tool_key);
  const title = tool.title || meta?.name || tool.tool_key;
  const done = !!tool.completedToday || tool.status === "completed";
  const cat = categoryFor(tool.tool_key);

  // Build a 7-day completion sparkline (1 = completed that day, 0 = not).
  const done7 = (() => {
    const set = new Set(tool.completed_dates || []);
    const out: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(set.has(toIso(d)) ? 1 : 0);
    }
    return out;
  })();
  const doneThisWeek = done7.reduce((a, b) => a + b, 0);

  const overdue = tool.due_date && !done
    ? new Date(tool.due_date).getTime() < Date.now() - 24 * 3600 * 1000
    : false;
  const risk = done ? "green" : overdue ? "red" : "amber";

  const lastLabel = tool.completedToday
    ? "Last check-in: Active today"
    : tool.completed_dates && tool.completed_dates.length
      ? `Last check-in: ${new Date(tool.completed_dates[tool.completed_dates.length - 1]).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      : "Last check-in: —";

  return (
    <button
      onClick={onOpen}
      className="card-calm hover-lift stagger-item w-full text-left group"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold shrink-0 uppercase">
          {initials(title)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate uppercase tracking-wide text-sm">{title}</span>
            <span className={`risk-dot risk-${risk}`} aria-hidden />
          </div>
          <div className="mt-1">
            <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full border ${cat.className}`}>
              {cat.label}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {tool.therapist_note || meta?.short || meta?.description || "\u00A0"}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">{lastLabel}</div>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <MiniSparkline values={done7.length ? done7 : [0, 0, 0, 0, 0, 0, 0]} />
        <div className="text-right">
          <div className={[
            "text-xs font-medium",
            doneThisWeek >= 4 ? "text-emerald-400" :
            doneThisWeek > 0 ? "text-amber-300" :
            "text-destructive",
          ].join(" ")}>
            {doneThisWeek}/7 done
          </div>
          {overdue && (
            <div className="text-[10px] text-amber-300 mt-0.5">Overdue</div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {tool.scheduleLabel && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
            {tool.scheduleLabel}
          </span>
        )}
        <span className="text-xs text-primary ml-auto">
          {done ? "Review full response →" : "Open exercise →"}
        </span>
      </div>
    </button>
  );
};

export default ClientToolCard;