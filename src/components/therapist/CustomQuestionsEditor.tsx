import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export type EditorQuestion = {
  id: string;
  label: string;
  type: "text" | "long_text" | "scale" | "yes_no" | "mcq";
  options?: string[];
  scale_min?: number;
  scale_max?: number;
  required?: boolean;
};

interface Props {
  intro: string;
  questions: EditorQuestion[];
  onIntroChange: (v: string) => void;
  onChange: (qs: EditorQuestion[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const CustomQuestionsEditor = ({ intro, questions, onIntroChange, onChange }: Props) => {
  const add = () =>
    onChange([...questions, { id: uid(), label: "", type: "long_text", required: false }]);

  const update = (id: string, patch: Partial<EditorQuestion>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const remove = (id: string) => onChange(questions.filter((q) => q.id !== id));

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Intro shown to the client (optional)</Label>
        <Textarea
          rows={2}
          value={intro}
          onChange={(e) => onIntroChange(e.target.value)}
          className="mt-1"
          placeholder="e.g. Reflect on how the week has felt so I can prepare for our next session."
        />
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-lg border p-3 space-y-2 bg-background">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-muted-foreground">Question {idx + 1}</div>
            <button
              type="button"
              onClick={() => remove(q.id)}
              className="text-destructive hover:opacity-70"
              aria-label="Remove question"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Input
            value={q.label}
            onChange={(e) => update(q.id, { label: e.target.value })}
            placeholder="Question text"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="text-xs rounded-md border bg-card px-2 py-1"
              value={q.type}
              onChange={(e) => update(q.id, { type: e.target.value as EditorQuestion["type"] })}
            >
              <option value="text">Short text</option>
              <option value="long_text">Long text</option>
              <option value="scale">Scale</option>
              <option value="yes_no">Yes / No</option>
              <option value="mcq">Multiple choice</option>
            </select>
            <label className="text-xs flex items-center gap-1">
              <input
                type="checkbox"
                checked={!!q.required}
                onChange={(e) => update(q.id, { required: e.target.checked })}
              />
              Required
            </label>
          </div>
          {q.type === "scale" && (
            <div className="flex gap-2">
              <Input
                type="number"
                className="w-24"
                placeholder="min"
                value={q.scale_min ?? 1}
                onChange={(e) => update(q.id, { scale_min: Number(e.target.value) })}
              />
              <Input
                type="number"
                className="w-24"
                placeholder="max"
                value={q.scale_max ?? 10}
                onChange={(e) => update(q.id, { scale_max: Number(e.target.value) })}
              />
            </div>
          )}
          {q.type === "mcq" && (
            <Input
              value={(q.options || []).join(", ")}
              onChange={(e) =>
                update(q.id, {
                  options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="Option 1, Option 2, Option 3"
            />
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add question
      </Button>
    </div>
  );
};

export default CustomQuestionsEditor;