import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import ShareMilestoneCard from "./ShareMilestoneCard";

interface Tool {
  id: string;
  tool_key: string;
  completed_dates?: string[];
  latest_submission?: any;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  detail: string;
}

interface Props {
  tools: Tool[];
  assignmentCreatedAt?: string | null;
  clientFirstName: string;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

const MilestoneTimeline = ({ tools, assignmentCreatedAt, clientFirstName }: Props) => {
  const [active, setActive] = useState<Milestone | null>(null);

  const milestones = useMemo<Milestone[]>(() => {
    const out: Milestone[] = [];
    if (assignmentCreatedAt) {
      out.push({
        id: "start",
        date: assignmentCreatedAt,
        title: "You started your journey",
        detail: "The first step of your healing journey with InnerSpark.",
      });
    }
    const allDates: string[] = [];
    tools.forEach((t) => (t.completed_dates || []).forEach((d) => allDates.push(d)));
    allDates.sort();
    if (allDates[0]) {
      out.push({
        id: "first-checkin",
        date: allDates[0],
        title: "You showed up for your first check-in",
        detail: "Choosing to notice how you feel is already a brave act.",
      });
    }
    [5, 10, 25, 50].forEach((n) => {
      if (allDates.length >= n) {
        out.push({
          id: `count-${n}`,
          date: allDates[n - 1],
          title: `${n} check-ins completed`,
          detail: `You've shown up ${n} times. Every one of them matters.`,
        });
      }
    });
    const phq = tools.find((t) => t.tool_key === "screening-phq9")?.latest_submission;
    if (phq?.screening_severity && ["minimal", "mild"].includes(phq.screening_severity) && phq.submitted_at) {
      out.push({
        id: "phq-improve",
        date: phq.submitted_at,
        title: "Your wellbeing score reached a lighter zone",
        detail: "This is meaningful. Whatever you're doing, keep going.",
      });
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }, [tools, assignmentCreatedAt]);

  if (milestones.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">My journey</h2>
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
        <div className="space-y-3">
          {milestones.map((m) => (
            <div key={m.id} className="relative">
              <span className="absolute -left-4 top-4 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
              <button
                onClick={() => setActive(m)}
                className="card-calm hover-lift w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{fmt(m.date)}</div>
                    <div className="font-medium mt-0.5">{m.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{m.detail}</div>
                  </div>
                  <Share2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      {active && (
        <ShareMilestoneCard milestone={active} clientFirstName={clientFirstName} onClose={() => setActive(null)} />
      )}
    </section>
  );
};

export default MilestoneTimeline;