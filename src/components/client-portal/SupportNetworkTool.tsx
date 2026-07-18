import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const SupportNetworkTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [p1, setP1] = useState(initial?.people?.[0] || "");
  const [p2, setP2] = useState(initial?.people?.[1] || "");
  const [p3, setP3] = useState(initial?.people?.[2] || "");
  const [support_desc, setSupportDesc] = useState(initial?.support_desc || "");
  const [pulling_away, setPullingAway] = useState(initial?.pulling_away || "");
  const [reconnect_step, setReconnectStep] = useState(initial?.reconnect_step || "");
  const [step_result, setStepResult] = useState(initial?.step_result || "");
  const [saving, setSaving] = useState(false);

  const hasPrevStep = !!initial?.reconnect_step;

  const submit = async () => {
    if (!p1.trim() && !p2.trim() && !p3.trim()) return toast.error("Name at least one person you trust.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: {
        people: [p1, p2, p3].filter(Boolean),
        support_desc, pulling_away, reconnect_step, step_result,
      },
      _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Connection matters. Thank you for reflecting on this. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>My Support Network</CardTitle>
        <CardDescription>Map the people in your life who support you and think about how to strengthen those connections.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Name three people you trust</Label>
          <div className="space-y-2 mt-1.5">
            <Input value={p1} onChange={(e) => setP1(e.target.value)} placeholder="1." />
            <Input value={p2} onChange={(e) => setP2(e.target.value)} placeholder="2." />
            <Input value={p3} onChange={(e) => setP3(e.target.value)} placeholder="3." />
          </div>
        </div>
        <div>
          <Label>How does each person support you?</Label>
          <Textarea value={support_desc} onChange={(e) => setSupportDesc(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <div>
          <Label>Is there anyone you have been pulling away from lately?</Label>
          <Textarea value={pulling_away} onChange={(e) => setPullingAway(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>One small step to reconnect with someone this week</Label>
          <Textarea value={reconnect_step} onChange={(e) => setReconnectStep(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        {hasPrevStep && (
          <div>
            <Label>How did that step go? (from last week)</Label>
            <Textarea value={step_result} onChange={(e) => setStepResult(e.target.value)} rows={2} className="mt-1.5" />
          </div>
        )}
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

export default SupportNetworkTool;