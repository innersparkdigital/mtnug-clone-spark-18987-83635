import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const MOODS = ["😃 Great", "🙂 Okay", "😐 Meh", "😔 Low", "😢 Heavy"];

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const SelfCareTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [sleep, setSleep] = useState<string>(initial?.sleep_hours ?? "");
  const [water, setWater] = useState<string>(initial?.water_glasses ?? "");
  const [movement, setMovement] = useState<string>(initial?.movement ?? "");
  const [meals, setMeals] = useState<string>(initial?.meals ?? "");
  const [mood, setMood] = useState<string>(initial?.mood || "");
  const [notes, setNotes] = useState<string>(initial?.notes || "");
  const moodScore = mood ? 5 - MOODS.indexOf(mood) : null;
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!mood) return toast.error("Please pick a mood for today.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { sleep_hours: sleep, water_glasses: water, movement, meals, mood, notes },
      _final: true,
      _mood_score: moodScore,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved. Small basics matter. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Self-care tracker</CardTitle>
        <CardDescription>The daily basics that affect mental health more than most people realise.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sleep (hours)</Label>
            <Input type="number" min="0" max="24" value={sleep} onChange={(e) => setSleep(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Water (glasses)</Label>
            <Input type="number" min="0" value={water} onChange={(e) => setWater(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label>Movement / exercise</Label>
          <Input placeholder="e.g. 20-min walk" value={movement} onChange={(e) => setMovement(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>Meals</Label>
          <Input placeholder="e.g. 3 balanced meals" value={meals} onChange={(e) => setMeals(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>How's your mood today?</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {MOODS.map((m) => (
              <button key={m} type="button" onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  mood === m ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Anything else?</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save today
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfCareTool;