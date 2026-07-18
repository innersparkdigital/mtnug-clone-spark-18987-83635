import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token: string;
  assignmentToolId: string;
  config?: any;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const LifeSkillsTool = ({ token, assignmentToolId, config, initial, onDone, onBack }: Props) => {
  const skill = config?.skill || "The skill your therapist set for this week.";
  const [tried, setTried] = useState<string>(initial?.tried || "");
  const [what_happened, setWhatHappened] = useState(initial?.what_happened || "");
  const [what_made_hard, setWhatMadeHard] = useState(initial?.what_made_hard || "");
  const [next_time, setNextTime] = useState(initial?.next_time || "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!tried) return toast.error("Please choose an option for 'Did you try it?'");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { skill, tried, what_happened, what_made_hard, next_time },
      _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Every attempt counts. Well done for showing up. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Life Skills Practice</CardTitle>
        <CardDescription>Practice a real-life skill your therapist wants you to work on this week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
          <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1">This week's skill</div>
          <div className="text-sm">{skill}</div>
        </div>
        <div>
          <Label>Did you try it this week?</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["yes", "partly", "not yet"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTried(opt)}
                className={`px-4 py-2 rounded-lg text-sm border ${
                  tried === opt ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>What happened when you tried it?</Label>
          <Textarea value={what_happened} onChange={(e) => setWhatHappened(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <div>
          <Label>What made it hard?</Label>
          <Textarea value={what_made_hard} onChange={(e) => setWhatMadeHard(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>What would you do differently next time?</Label>
          <Textarea value={next_time} onChange={(e) => setNextTime(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeSkillsTool;