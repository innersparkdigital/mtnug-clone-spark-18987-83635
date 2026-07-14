import { CheckCircle2, ChevronRight, Quote, Sparkles } from "lucide-react";
import { iconForTool } from "@/lib/toolIcons";
import { getTool } from "@/lib/wellbeingToolsCatalog";

export interface ClientToolCardData {
  id: string;
  tool_key: string;
  title: string | null;
  therapist_note: string | null;
  due_date: string | null;
  status: string;
  completedToday?: boolean;
  scheduleLabel?: string | null;
}

interface Props {
  tool: ClientToolCardData;
  onOpen: () => void;
}

const ClientToolCard = ({ tool, onOpen }: Props) => {
  const meta = getTool(tool.tool_key);
  const Icon = iconForTool(tool.tool_key);
  const done = tool.completedToday || tool.status === "completed";

  const overdue = tool.due_date && !done
    ? new Date(tool.due_date).getTime() < Date.now() - 24 * 3600 * 1000
    : false;

  return (
    <button
      onClick={onOpen}
      className={[
        "card-calm hover-lift stagger-item w-full text-left p-4 sm:p-5",
        "group relative transition-all",
        done ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {/* Avatar-style icon, matching therapist client card */}
        <div
          className={[
            "h-12 w-12 rounded-full grid place-items-center shrink-0 font-semibold transition-colors",
            done
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20"
              : "bg-primary/10 text-primary ring-2 ring-primary/10",
          ].join(" ")}
        >
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate leading-snug">
              {tool.title || meta?.name || tool.tool_key}
            </span>
            {/* status dot */}
            <span
              className={[
                "h-2 w-2 rounded-full",
                done ? "bg-emerald-500" : overdue ? "bg-amber-500" : "bg-primary/60",
              ].join(" ")}
              aria-hidden
            />
            {done && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                Done
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {meta?.short || meta?.description || tool.tool_key}
          </div>

          {tool.therapist_note && (
            <div className="mt-2 flex gap-1.5 text-xs text-muted-foreground italic">
              <Quote className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
              <span className="leading-relaxed line-clamp-2">{tool.therapist_note}</span>
            </div>
          )}
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* Footer row — mirrors therapist card layout */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {tool.scheduleLabel && (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-border bg-card text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary/60" />
            {tool.scheduleLabel}
          </span>
        )}
        {tool.due_date && !done && (
          <span
            className={[
              "text-[11px] px-2 py-0.5 rounded-full",
              overdue
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            Due {new Date(tool.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
        <span className="ml-auto text-xs text-primary">
          {done ? "Review →" : "Open →"}
        </span>
      </div>
    </button>
  );
};

export default ClientToolCard;