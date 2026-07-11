import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface ScheduleValue {
  frequency: "once" | "daily" | "weekly" | "custom";
  days_of_week: number[]; // 0=Sun..6=Sat
  time_of_day: string;    // "HH:MM"
  start_date: string;     // YYYY-MM-DD
  end_date: string;
}

export const defaultSchedule = (): ScheduleValue => ({
  frequency: "once",
  days_of_week: [],
  time_of_day: "",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: "",
});

const DOW = [
  { v: 1, l: "Mon" },
  { v: 2, l: "Tue" },
  { v: 3, l: "Wed" },
  { v: 4, l: "Thu" },
  { v: 5, l: "Fri" },
  { v: 6, l: "Sat" },
  { v: 0, l: "Sun" },
];

interface Props {
  value: ScheduleValue;
  onChange: (v: ScheduleValue) => void;
}

const ScheduleFields = ({ value, onChange }: Props) => {
  const set = (patch: Partial<ScheduleValue>) => onChange({ ...value, ...patch });
  const toggleDay = (d: number) => {
    const has = value.days_of_week.includes(d);
    set({ days_of_week: has ? value.days_of_week.filter((x) => x !== d) : [...value.days_of_week, d].sort() });
  };

  return (
    <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs">Schedule</Label>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {(["once", "daily", "weekly", "custom"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => set({ frequency: f })}
              className={`text-xs py-1.5 rounded-md border transition-colors capitalize ${
                value.frequency === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {f === "once" ? "Just once" : f}
            </button>
          ))}
        </div>
      </div>

      {(value.frequency === "weekly" || value.frequency === "custom") && (
        <div>
          <Label className="text-xs">Days</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {DOW.map((d) => {
              const on = value.days_of_week.includes(d.v);
              return (
                <button
                  key={d.v}
                  type="button"
                  onClick={() => toggleDay(d.v)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    on
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {d.l}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {value.frequency !== "once" && (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Time (optional)</Label>
            <Input
              type="time"
              value={value.time_of_day}
              onChange={(e) => set({ time_of_day: e.target.value })}
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Start</Label>
            <Input
              type="date"
              value={value.start_date}
              onChange={(e) => set({ start_date: e.target.value })}
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">End (blank = ongoing)</Label>
            <Input
              type="date"
              value={value.end_date}
              onChange={(e) => set({ end_date: e.target.value })}
              className="h-8 text-xs mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleFields;

export const summarizeSchedule = (s: ScheduleValue | null | undefined): string | null => {
  if (!s || s.frequency === "once") return null;
  const time = s.time_of_day ? ` · ${s.time_of_day}` : "";
  if (s.frequency === "daily") return `Daily${time}`;
  if (s.frequency === "weekly" || s.frequency === "custom") {
    if (s.days_of_week.length === 0) return `Weekly${time}`;
    const short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = s.days_of_week.map((d) => short[d]).join(", ");
    return `${days}${time}`;
  }
  return null;
};