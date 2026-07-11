import { useMemo } from "react";

export interface DayInfo {
  date: Date;
  isoDate: string; // YYYY-MM-DD in local TZ
  scheduledCount: number;
  completedCount: number;
  isToday: boolean;
}

interface Props {
  days: DayInfo[];
  selectedIso: string;
  onSelect: (iso: string) => void;
}

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const WeekStrip = ({ days, selectedIso, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 fade-in-calm">
      {days.map((d) => {
        const dow = d.date.getDay();
        const selected = d.isoDate === selectedIso;
        const allDone = d.scheduledCount > 0 && d.completedCount >= d.scheduledCount;
        return (
          <button
            key={d.isoDate}
            onClick={() => onSelect(d.isoDate)}
            className={[
              "flex flex-col items-center gap-1.5 rounded-2xl py-2.5 px-1 border transition-colors",
              selected
                ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)]"
                : d.isToday
                ? "border-primary/40 bg-card"
                : "border-border bg-card hover:bg-accent",
            ].join(" ")}
          >
            <span className={`text-[10px] uppercase tracking-wider ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {DOW[dow]}
            </span>
            <span className={`text-sm font-semibold ${selected ? "" : d.isToday ? "text-primary" : ""}`}>
              {d.date.getDate()}
            </span>
            <span className="h-1.5 flex items-center gap-0.5">
              {d.scheduledCount === 0 ? (
                <span className={`h-1 w-1 rounded-full ${selected ? "bg-primary-foreground/30" : "bg-transparent"}`} />
              ) : (
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    selected ? "bg-primary-foreground" : allDone ? "bg-primary" : "bg-primary/40",
                  ].join(" ")}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default WeekStrip;

/** Build a 7-day (Sun–Sat) window ending today's local week. */
export const useWeekWindow = (today: Date) => {
  return useMemo(() => {
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    // Start on Sunday
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [today.getFullYear(), today.getMonth(), today.getDate()]);
};

export const toIso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};