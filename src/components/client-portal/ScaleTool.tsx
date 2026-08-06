import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScreeningScale } from "@/lib/screeningScales";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/supportContact";

interface Props {
  scale: ScreeningScale;
  token: string;
  assignmentToolId: string;
  onDone: () => void;
  onBack: () => void;
}

const ScaleTool = ({ scale, token, assignmentToolId, onDone, onBack }: Props) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [followUp, setFollowUp] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const raw = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const total = scale.percentage ? raw * 4 : raw;
  const complete = Object.keys(answers).length === scale.items.length;
  const severity = scale.severity(total);
  const safetyFlag =
    scale.safetyItemIndex !== undefined && (answers[scale.safetyItemIndex] ?? 0) >= 1;

  const submit = async () => {
    if (!complete) return toast.error("Please answer every question.");
    setSaving(true);
    const { error } = await supabase.rpc("save_tool_submission", {
      _token: token,
      _assignment_tool_id: assignmentToolId,
      _payload: {
        variant: scale.key,
        scale: scale.shortName,
        answers,
        answer_labels: Object.fromEntries(
          Object.entries(answers).map(([i, v]) => {
            const opts = scale.items[Number(i)].options ?? scale.options;
            return [i, opts.find((o) => o.value === v)?.label ?? String(v)];
          }),
        ),
        follow_up: followUp,
        follow_up_label:
          scale.followUp && followUp !== null
            ? scale.followUp.options.find((o) => o.value === followUp)?.label
            : null,
        notes,
        raw_score: raw,
        total,
        severity,
        safety_flag: safetyFlag,
      },
      _final: true,
      _screening_score: total,
      _screening_severity: severity,
      _safety_flag: safetyFlag,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(
      safetyFlag
        ? "Sent to your therapist. They've been alerted and will reach out. 💙"
        : "Sent to your therapist. Thank you. 💙",
    );
    onDone();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>{scale.name}</CardTitle>
        <CardDescription>
          {scale.instructions} Not a diagnosis — this helps your therapist support you better.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {scale.items.map((item, i) => {
          const opts = item.options ?? scale.options;
          return (
            <div key={i} className="pb-3 border-b last:border-0">
              <div className="text-sm font-medium mb-2">{i + 1}. {item.text}</div>
              <div
                className={`grid gap-2 ${
                  opts.length <= 2
                    ? "grid-cols-2"
                    : opts.length <= 4
                      ? "grid-cols-2 sm:grid-cols-4"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                }`}
              >
                {opts.map((o) => (
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
          );
        })}

        {scale.followUp && (
          <div className="rounded-lg border p-3 bg-muted/40">
            <div className="text-sm font-medium mb-2">{scale.followUp.text}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scale.followUp.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setFollowUp(o.value)}
                  className={`text-xs px-2 py-2 rounded-md border transition-colors ${
                    followUp === o.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Anything you'd like your therapist to know? (optional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5" />
        </div>

        {complete && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            Your score: <span className="font-semibold">{total}{scale.percentage ? "%" : ` / ${scale.maxScore}`}</span> — {severity}.
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
          This is a screening tool, not a diagnosis. If you need urgent support, call or WhatsApp{" "}
          <a href={SUPPORT_PHONE_TEL} className="underline">{SUPPORT_PHONE_DISPLAY}</a>.
        </p>
      </CardContent>
    </Card>
  );
};

export default ScaleTool;
