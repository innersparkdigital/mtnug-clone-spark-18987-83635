import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Circle, CircleDashed } from "lucide-react";
import { toast } from "sonner";

type Status = "not_started" | "in_progress" | "done";

interface Task { id: string; text: string; status: Status; }

interface Props {
  token: string;
  assignmentToolId: string;
  config: any;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const seedTasks = (config: any, initial: any): Task[] => {
  if (initial?.tasks?.length) return initial.tasks;
  // config.tasks (from therapist) is a string with one task per line
  const raw: string = config?.tasks || "";
  const items = raw.split("\n").map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) return [{ id: "1", text: "", status: "not_started" }];
  return items.map((t, i) => ({ id: String(i + 1), text: t, status: "not_started" as Status }));
};

const HomeworkTool = ({ token, assignmentToolId, config, initial, onDone, onBack }: Props) => {
  const [tasks, setTasks] = useState<Task[]>(() => seedTasks(config, initial));
  const [helped, setHelped] = useState(initial?.what_helped || "");
  const [obstacles, setObstacles] = useState(initial?.obstacles || "");
  const [saving, setSaving] = useState(false);

  const payload = useMemo(() => ({
    tasks, what_helped: helped, obstacles,
    completed_count: tasks.filter((t) => t.status === "done").length,
  }), [tasks, helped, obstacles]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      supabase.rpc("save_tool_submission", {
        _token: token, _assignment_tool_id: assignmentToolId, _payload: payload, _final: false,
      });
    }, 15000);
    return () => window.clearTimeout(t);
  }, [token, assignmentToolId, payload]);

  const cycleStatus = (id: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const next: Status = t.status === "not_started" ? "in_progress" : t.status === "in_progress" ? "done" : "not_started";
      return { ...t, status: next };
    }));
  };

  const submit = async () => {
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token, _assignment_tool_id: assignmentToolId, _payload: payload, _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Sent to your therapist. Every step counts. 💙");
    onDone();
  };

  const iconFor = (s: Status) => s === "done" ? <CheckCircle2 className="h-5 w-5 text-primary" /> :
    s === "in_progress" ? <CircleDashed className="h-5 w-5 text-amber-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />;
  const labelFor = (s: Status) => s === "done" ? "Done" : s === "in_progress" ? "In progress" : "Not started";

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Homework tracker</CardTitle>
        <CardDescription>Tap each task to move it forward — not started → in progress → done.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => cycleStatus(t.id)}
              className="w-full text-left flex items-start gap-3 p-3 rounded-lg border hover:border-primary/40 transition-colors"
            >
              <div className="mt-0.5">{iconFor(t.status)}</div>
              <div className="flex-1 min-w-0">
                <div className={t.status === "done" ? "text-sm line-through text-muted-foreground" : "text-sm"}>
                  {t.text || <span className="italic text-muted-foreground">Untitled task</span>}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{labelFor(t.status)}</div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <Label>What helped you get things done?</Label>
          <Textarea rows={2} value={helped} onChange={(e) => setHelped(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>What got in the way?</Label>
          <Textarea rows={2} value={obstacles} onChange={(e) => setObstacles(e.target.value)} className="mt-1.5" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Send update to my therapist →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeworkTool;