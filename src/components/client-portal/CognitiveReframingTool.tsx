import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const CognitiveReframingTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [thought, setThought] = useState(initial?.thought || "");
  const [why_true, setWhyTrue] = useState(initial?.why_true || "");
  const [evidence_against, setEvidenceAgainst] = useState(initial?.evidence_against || "");
  const [balanced, setBalanced] = useState(initial?.balanced || "");
  const [feel_now, setFeelNow] = useState<number[]>([initial?.feel_now ?? 5]);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!thought.trim() || !balanced.trim()) return toast.error("Please fill in the thought and a balanced view.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { thought, why_true, evidence_against, balanced, feel_now: feel_now[0] },
      _final: true,
      _mood_score: feel_now[0],
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("That takes real work. Well done. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Cognitive Reframing</CardTitle>
        <CardDescription>Challenge an unhelpful thought and find a more balanced way of seeing it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Unhelpful thought</Label>
          <Textarea value={thought} onChange={(e) => setThought(e.target.value)} rows={2} className="mt-1.5" placeholder="e.g. Nobody ever really listens to me" />
        </div>
        <div>
          <Label>Why this thought feels true</Label>
          <Textarea value={why_true} onChange={(e) => setWhyTrue(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>What evidence goes against it</Label>
          <Textarea value={evidence_against} onChange={(e) => setEvidenceAgainst(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>A more balanced way to see it</Label>
          <Textarea value={balanced} onChange={(e) => setBalanced(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>How do you feel now compared to before ({feel_now[0]}/10)</Label>
          <Slider value={feel_now} onValueChange={setFeelNow} min={1} max={10} step={1} className="mt-3" />
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

export default CognitiveReframingTool;