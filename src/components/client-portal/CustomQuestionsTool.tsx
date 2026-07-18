import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export type CustomQuestion = {
  id: string;
  label: string;
  type: "text" | "long_text" | "scale" | "yes_no" | "mcq";
  options?: string[]; // for mcq
  scale_min?: number;
  scale_max?: number;
  required?: boolean;
};

interface Props {
  token: string;
  assignmentToolId: string;
  config?: { questions?: CustomQuestion[]; intro?: string };
  initial?: any;
  onDone: () => void;
  onBack: () => void;
}

const CustomQuestionsTool = ({ token, assignmentToolId, config, initial, onDone, onBack }: Props) => {
  const questions: CustomQuestion[] = config?.questions || [];
  const [answers, setAnswers] = useState<Record<string, any>>(initial?.answers || {});
  const [saving, setSaving] = useState(false);

  const setA = (id: string, v: any) => setAnswers((p) => ({ ...p, [id]: v }));

  const submit = async () => {
    for (const q of questions) {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === "" || answers[q.id] === null)) {
        return toast.error(`Please answer: ${q.label}`);
      }
    }
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: { answers, questions },
      _final: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you for your honest answers. 💙");
    onDone();
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom questions</CardTitle>
          <CardDescription>Your therapist has not added any questions yet. Please check back later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onBack}>Back</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Questions from your therapist</CardTitle>
        <CardDescription>
          {config?.intro || "Your therapist has some specific questions for you. Answer honestly — there are no wrong answers."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            <Label>{idx + 1}. {q.label}{q.required && <span className="text-destructive"> *</span>}</Label>
            {q.type === "text" && (
              <Input value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} />
            )}
            {q.type === "long_text" && (
              <Textarea rows={3} value={answers[q.id] || ""} onChange={(e) => setA(q.id, e.target.value)} />
            )}
            {q.type === "scale" && (
              <div>
                <Slider
                  value={[answers[q.id] ?? (q.scale_min ?? 1)]}
                  onValueChange={(v) => setA(q.id, v[0])}
                  min={q.scale_min ?? 1}
                  max={q.scale_max ?? 10}
                  step={1}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Value: {answers[q.id] ?? (q.scale_min ?? 1)} / {q.scale_max ?? 10}
                </div>
              </div>
            )}
            {q.type === "yes_no" && (
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setA(q.id, opt)}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      answers[q.id] === opt ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "mcq" && (
              <div className="flex flex-wrap gap-2">
                {(q.options || []).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setA(q.id, opt)}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      answers[q.id] === opt ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
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

export default CustomQuestionsTool;