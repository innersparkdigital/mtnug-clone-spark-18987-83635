import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Variant = "phq9" | "gad7";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling/staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you're a failure",
  "Trouble concentrating on things",
  "Moving/speaking slowly, or being fidgety/restless",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const severityPHQ9 = (s: number) =>
  s <= 4 ? "minimal" : s <= 9 ? "mild" : s <= 14 ? "moderate" : s <= 19 ? "moderately severe" : "severe";
const severityGAD7 = (s: number) =>
  s <= 4 ? "minimal" : s <= 9 ? "mild" : s <= 14 ? "moderate" : "severe";

interface Props {
  variant: Variant;
  token: string;
  assignmentToolId: string;
  onDone: () => void;
  onBack: () => void;
}

const ScreeningTool = ({ variant, token, assignmentToolId, onDone, onBack }: Props) => {
  const questions = variant === "phq9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const total = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const complete = Object.keys(answers).length === questions.length;
  const severity = variant === "phq9" ? severityPHQ9(total) : severityGAD7(total);
  const safetyFlag = variant === "phq9" && (answers[8] ?? 0) >= 1;

  const submit = async () => {
    if (!complete) return toast.error("Please answer every question.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { variant, answers, notes, total, severity, safety_flag: safetyFlag },
      _final: true,
      _screening_score: total,
      _screening_severity: severity,
      _safety_flag: safetyFlag,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    if (safetyFlag) {
      toast.success("Sent to your therapist. They've been alerted and will reach out. 💙");
    } else {
      toast.success("Sent to your therapist. Thank you. 💙");
    }
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>{variant === "phq9" ? "Wellbeing check (PHQ-9)" : "Wellbeing check (GAD-7)"}</CardTitle>
        <CardDescription>
          Over the last two weeks, how often have you been bothered by any of the following?
          Not a diagnosis — this helps your therapist support you better.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((q, i) => (
          <div key={i} className="pb-3 border-b last:border-0">
            <div className="text-sm font-medium mb-2">{i + 1}. {q}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [i]: o.value })}
                  className={`text-xs px-2 py-2 rounded-md border transition-colors ${
                    answers[i] === o.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <Label>Anything you'd like your therapist to know? (optional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5" />
        </div>

        {complete && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            Your score: <span className="font-semibold">{total}</span> — {severity}.
            Your therapist will review this with you.
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={submit} disabled={saving || !complete} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Send to my therapist →
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          This is a screening tool, not a diagnosis. If you are in crisis, call 0800 212 121 (free, 24/7).
        </p>
      </CardContent>
    </Card>
  );
};

export default ScreeningTool;