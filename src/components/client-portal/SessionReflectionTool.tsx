import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const MOODS = ["😃 Peaceful", "🙂 Okay", "😐 Unsure", "😔 Low", "😢 Heavy"];

interface Props {
  token: string;
  assignmentToolId: string;
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const SessionReflectionTool = ({ token, assignmentToolId, initial, onDone, onBack }: Props) => {
  const [useful, setUseful] = useState<string>(initial?.useful || "");
  const [difficult, setDifficult] = useState<string>(initial?.difficult || "");
  const [carry, setCarry] = useState<string>(initial?.carry || "");
  const [nextFocus, setNextFocus] = useState<string>(initial?.next_focus || "");
  const [mood, setMood] = useState<string>(initial?.mood || "");
  const [moodNote, setMoodNote] = useState<string>(initial?.mood_note || "");
  const [saving, setSaving] = useState(false);
  const draftTimer = useRef<number | undefined>(undefined);

  const payload = useMemo(
    () => ({ useful, difficult, carry, next_focus: nextFocus, mood, mood_note: moodNote }),
    [useful, difficult, carry, nextFocus, mood, moodNote],
  );

  useEffect(() => {
    if (draftTimer.current) window.clearTimeout(draftTimer.current);
    const hasContent = useful || difficult || carry || nextFocus || mood || moodNote;
    if (!hasContent) return;
    draftTimer.current = window.setTimeout(async () => {
      await supabase.rpc("save_tool_submission", {
        _token: token,
        _assignment_tool_id: assignmentToolId,
        _payload: payload,
        _final: false,
      });
    }, 30000);
    return () => { if (draftTimer.current) window.clearTimeout(draftTimer.current); };
  }, [token, assignmentToolId, payload, useful, difficult, carry, nextFocus, mood, moodNote]);

  const submit = async () => {
    if (!useful.trim() && !difficult.trim() && !carry.trim()) {
      toast.error("Please fill in a few thoughts before sending.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token, _assignment_tool_id: assignmentToolId, _payload: payload, _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Sent to your therapist. Thank you for reflecting. 💙");
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>After your session</CardTitle>
        <CardDescription>
          Taking a few minutes after your session helps the insights stay with you. Your therapist will see your answers before your next appointment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>What was most useful or helpful from today's session?</Label>
          <Textarea value={useful} onChange={(e) => setUseful(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <div>
          <Label>What felt difficult or unclear?</Label>
          <Textarea value={difficult} onChange={(e) => setDifficult(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <div>
          <Label>One thing you want to remember or carry with you this week</Label>
          <Textarea value={carry} onChange={(e) => setCarry(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>What would you like to focus on in your next session?</Label>
          <Textarea value={nextFocus} onChange={(e) => setNextFocus(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label>How are you feeling right now, after the session?</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  mood === m ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Textarea placeholder="Anything else you'd like to add? (optional)" value={moodNote} onChange={(e) => setMoodNote(e.target.value)} rows={2} className="mt-3" />
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

export default SessionReflectionTool;