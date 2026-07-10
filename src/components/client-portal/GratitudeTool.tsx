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
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const GratitudeTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [g1, setG1] = useState(initial?.g1 || "");
  const [g2, setG2] = useState(initial?.g2 || "");
  const [g3, setG3] = useState(initial?.g3 || "");
  const [strength, setStrength] = useState(initial?.strength || "");
  const [proud, setProud] = useState(initial?.proud || "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!g1.trim() && !g2.trim() && !g3.trim()) return toast.error("Please write at least one thing.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { g1, g2, g3, strength, proud },
      _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved. Small notes like this build strength over time. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Strengths & gratitude journal</CardTitle>
        <CardDescription>Under two minutes. Notice what went well and what you did well today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Three things I'm grateful for today</Label>
          <Textarea placeholder="1." value={g1} onChange={(e) => setG1(e.target.value)} rows={2} className="mt-1.5" />
          <Textarea placeholder="2." value={g2} onChange={(e) => setG2(e.target.value)} rows={2} className="mt-1.5" />
          <Textarea placeholder="3." value={g3} onChange={(e) => setG3(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>A personal strength I used today</Label>
          <Textarea value={strength} onChange={(e) => setStrength(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>Something (small or big) I'm proud of</Label>
          <Textarea value={proud} onChange={(e) => setProud(e.target.value)} rows={2} className="mt-1.5" />
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

export default GratitudeTool;