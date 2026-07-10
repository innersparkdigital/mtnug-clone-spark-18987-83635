import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const ThoughtRecordTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [situation, setSituation] = useState(initial?.situation || "");
  const [thought, setThought] = useState(initial?.thought || "");
  const [emotion, setEmotion] = useState(initial?.emotion || "");
  const [intensityBefore, setIntensityBefore] = useState<number>(initial?.intensity_before ?? 50);
  const [evidenceFor, setEvidenceFor] = useState(initial?.evidence_for || "");
  const [evidenceAgainst, setEvidenceAgainst] = useState(initial?.evidence_against || "");
  const [balanced, setBalanced] = useState(initial?.balanced || "");
  const [intensityAfter, setIntensityAfter] = useState<number>(initial?.intensity_after ?? 40);
  const [saving, setSaving] = useState(false);
  const draftTimer = useRef<number | undefined>(undefined);

  const payload = useMemo(() => ({
    situation, thought, emotion,
    intensity_before: intensityBefore, intensity_after: intensityAfter,
    evidence_for: evidenceFor, evidence_against: evidenceAgainst, balanced,
  }), [situation, thought, emotion, intensityBefore, intensityAfter, evidenceFor, evidenceAgainst, balanced]);

  useEffect(() => {
    if (draftTimer.current) window.clearTimeout(draftTimer.current);
    if (!situation && !thought && !emotion) return;
    draftTimer.current = window.setTimeout(() => {
      supabase.rpc("save_tool_submission", {
        _token: token, _assignment_tool_id: assignmentToolId, _payload: payload, _final: false,
      });
    }, 30000);
    return () => { if (draftTimer.current) window.clearTimeout(draftTimer.current); };
  }, [token, assignmentToolId, payload, situation, thought, emotion]);

  const submit = async () => {
    if (!situation.trim() || !thought.trim()) return toast.error("Please describe the situation and thought first.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token, _assignment_tool_id: assignmentToolId, _payload: payload, _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Sent to your therapist. Well done for pausing. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Thought record</CardTitle>
        <CardDescription>
          A gentle way to slow a difficult thought down and look at it more kindly. Go one box at a time — no rush.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>The situation — what was happening?</Label>
          <Textarea rows={2} value={situation} onChange={(e) => setSituation(e.target.value)} className="mt-1.5" placeholder="Where were you, who was there, what was going on?" />
        </div>
        <div>
          <Label>The thought that went through your mind</Label>
          <Textarea rows={2} value={thought} onChange={(e) => setThought(e.target.value)} className="mt-1.5" placeholder="e.g. 'I'm going to fail this'" />
        </div>
        <div>
          <Label>What did you feel? (name the emotion)</Label>
          <Input value={emotion} onChange={(e) => setEmotion(e.target.value)} className="mt-1.5" placeholder="e.g. anxious, ashamed, sad" />
        </div>
        <div>
          <Label>How strong was the feeling? — {intensityBefore}/100</Label>
          <Slider value={[intensityBefore]} onValueChange={(v) => setIntensityBefore(v[0])} min={0} max={100} step={5} className="mt-3" />
        </div>
        <div>
          <Label>Evidence that the thought is true</Label>
          <Textarea rows={2} value={evidenceFor} onChange={(e) => setEvidenceFor(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>Evidence that the thought might not be fully true</Label>
          <Textarea rows={2} value={evidenceAgainst} onChange={(e) => setEvidenceAgainst(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>A more balanced, kinder way to see this</Label>
          <Textarea rows={2} value={balanced} onChange={(e) => setBalanced(e.target.value)} className="mt-1.5" placeholder="What might you say to a friend in the same spot?" />
        </div>
        <div>
          <Label>How strong is the feeling now? — {intensityAfter}/100</Label>
          <Slider value={[intensityAfter]} onValueChange={(v) => setIntensityAfter(v[0])} min={0} max={100} step={5} className="mt-3" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Send to my therapist →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThoughtRecordTool;