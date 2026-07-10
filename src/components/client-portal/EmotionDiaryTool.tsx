import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const EMOTION_OPTIONS = [
  "Anxious", "Sad", "Angry", "Ashamed", "Guilty", "Lonely",
  "Overwhelmed", "Frustrated", "Hurt", "Hopeful", "Calm", "Grateful",
];

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const EmotionDiaryTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [situation, setSituation] = useState(initial?.situation || "");
  const [emotions, setEmotions] = useState<string[]>(initial?.emotions || []);
  const [intensity, setIntensity] = useState<number>(initial?.intensity ?? 50);
  const [thoughts, setThoughts] = useState(initial?.thoughts || "");
  const [response, setResponse] = useState(initial?.response || "");
  const [outcome, setOutcome] = useState(initial?.outcome || "");
  const [saving, setSaving] = useState(false);

  const payload = useMemo(() => ({
    situation, emotions, intensity, thoughts, response, outcome,
  }), [situation, emotions, intensity, thoughts, response, outcome]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!situation && emotions.length === 0) return;
      supabase.rpc("save_tool_submission", {
        _token: token, _assignment_tool_id: assignmentToolId, _payload: payload as any, _final: false,
      });
    }, 20000);
    return () => window.clearTimeout(t);
  }, [token, assignmentToolId, payload, situation, emotions]);

  const toggleEmotion = (e: string) => {
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const submit = async () => {
    if (!situation.trim() || emotions.length === 0) return toast.error("Add the situation and pick at least one feeling.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token, _assignment_tool_id: assignmentToolId, _payload: payload as any, _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Entry saved. Noticing patterns is powerful. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Emotion &amp; trigger diary</CardTitle>
        <CardDescription>A quick log of what happened, how you felt, and what you did. Patterns will show up over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>The situation or trigger</Label>
          <Textarea rows={2} value={situation} onChange={(e) => setSituation(e.target.value)} className="mt-1.5" />
        </div>

        <div>
          <Label>What did you feel? (tap all that fit)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {EMOTION_OPTIONS.map((emo) => {
              const on = emotions.includes(emo);
              return (
                <button
                  key={emo}
                  type="button"
                  onClick={() => toggleEmotion(emo)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    on ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                  }`}
                >
                  {emo}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>How intense was it? — {intensity}/100</Label>
          <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} min={0} max={100} step={5} className="mt-3" />
        </div>

        <div>
          <Label>What thoughts went through your mind?</Label>
          <Textarea rows={2} value={thoughts} onChange={(e) => setThoughts(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>What did you do?</Label>
          <Textarea rows={2} value={response} onChange={(e) => setResponse(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>How did it turn out?</Label>
          <Textarea rows={2} value={outcome} onChange={(e) => setOutcome(e.target.value)} className="mt-1.5" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save entry →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDiaryTool;