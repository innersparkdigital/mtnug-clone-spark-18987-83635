import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning", "Afternoon", "Evening"] as const;

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const ActivityScheduleTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [grid, setGrid] = useState<Record<string, { activity: string; mood: string }>>(initial?.grid || {});
  const [saving, setSaving] = useState(false);

  const update = (key: string, field: "activity" | "mood", value: string) =>
    setGrid({ ...grid, [key]: { ...(grid[key] || { activity: "", mood: "" }), [field]: value } });

  const submit = async () => {
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { grid },
      _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Activity scheduling</CardTitle>
        <CardDescription>Plan your week and notice what lifted your mood. Rate mood 0–10 after each.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DAYS.map((day) => (
          <div key={day} className="border rounded-lg p-3">
            <div className="font-medium mb-2 text-sm">{day}</div>
            <div className="space-y-2">
              {SLOTS.map((slot) => {
                const key = `${day}-${slot}`;
                const cell = grid[key] || { activity: "", mood: "" };
                return (
                  <div key={slot} className="grid grid-cols-[70px_1fr_60px] gap-2 items-center">
                    <div className="text-xs text-muted-foreground">{slot}</div>
                    <Input placeholder="Activity" value={cell.activity}
                      onChange={(e) => update(key, "activity", e.target.value)} className="h-8 text-sm" />
                    <Input placeholder="0–10" value={cell.mood}
                      onChange={(e) => update(key, "mood", e.target.value)} className="h-8 text-sm" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save week
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityScheduleTool;