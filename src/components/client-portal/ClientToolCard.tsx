import { CheckCircle2, ChevronRight, Quote } from "lucide-react";
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
        "card-calm hover-lift stagger-item w-full text-left p-4 flex items-start gap-4",
        done ? "opacity-70" : "",
      ].join(" ")}
    >
      <div
        className={[
          "h-11 w-11 rounded-xl grid place-items-center shrink-0 transition-colors",
          done ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground",
        ].join(" ")}
      >
        {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`font-medium leading-snug ${done ? "line-through decoration-1" : ""}`}>
            {tool.title || meta?.name || tool.tool_key}
          </div>
          {done && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Done today
            </span>
          )}
          {tool.scheduleLabel && !done && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tool.scheduleLabel}
            </span>
          )}
          {tool.due_date && !done && (
            <span
              className={[
                "text-[11px] px-1.5 py-0.5 rounded-full",
                overdue ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              Due {new Date(tool.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {meta?.short || ""}
        </div>
        {tool.therapist_note && (
          <div className="mt-2 flex gap-1.5 text-xs text-muted-foreground italic">
            <Quote className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
            <span className="leading-relaxed">{tool.therapist_note}</span>
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-3" />
    </button>
  );
};

export default ClientToolCard;