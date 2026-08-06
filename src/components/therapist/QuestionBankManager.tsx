import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, ListChecks, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import CustomQuestionsEditor, { EditorQuestion } from "./CustomQuestionsEditor";
import { hasScoredQuestions, maxScoreForSet } from "@/lib/questionScoring";

export interface QuestionSet {
  id: string;
  title: string;
  description: string | null;
  intro: string | null;
  questions: EditorQuestion[];
  scoring_enabled: boolean;
  max_score: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  times_assigned: number;
  responses: number;
  avg_score: number | null;
  last_response_at: string | null;
}

export const useQuestionSets = () => {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("therapist_question_set_stats" as any);
    if (error) toast.error(error.message);
    else setSets(((data as unknown as QuestionSet[]) || []).map((s) => ({ ...s, questions: s.questions || [] })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  return { sets, loading, reload: load };
};

const blank = () => ({
  id: "",
  title: "",
  description: "",
  intro: "",
  questions: [] as EditorQuestion[],
  is_active: true,
});

interface Props {
  therapistId: string;
  sets: QuestionSet[];
  loading: boolean;
  reload: () => void;
}

const QuestionBankManager = ({ therapistId, sets, loading, reload }: Props) => {
  const [editing, setEditing] = useState<ReturnType<typeof blank> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => setEditing(blank());
  const openEdit = (s: QuestionSet) =>
    setEditing({
      id: s.id,
      title: s.title,
      description: s.description || "",
      intro: s.intro || "",
      questions: s.questions || [],
      is_active: s.is_active,
    });

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) return toast.error("Give this question set a title.");
    if (editing.questions.length === 0) return toast.error("Add at least one question.");
    if (editing.questions.some((q) => !q.label.trim())) return toast.error("Every question needs text.");

    setSaving(true);
    const scoring_enabled = hasScoredQuestions(editing.questions);
    const payload = {
      therapist_id: therapistId,
      title: editing.title.trim(),
      description: editing.description.trim() || null,
      intro: editing.intro.trim() || null,
      questions: editing.questions as any,
      scoring_enabled,
      max_score: scoring_enabled ? maxScoreForSet(editing.questions) : null,
      is_active: editing.is_active,
    };
    const { error } = editing.id
      ? await supabase.from("therapist_question_sets" as any).update(payload).eq("id", editing.id)
      : await supabase.from("therapist_question_sets" as any).insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Question set updated." : "Question set saved — you can now assign it.");
    setEditing(null);
    reload();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("therapist_question_sets" as any).delete().eq("id", deleteId);
    setDeleteId(null);
    if (error) return toast.error(error.message);
    toast.success("Question set deleted.");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Question bank
          </h3>
          <p className="text-sm text-muted-foreground">
            Write your own question sets once, score them, then assign them to any client.
          </p>
        </div>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> New set</Button>
      </div>

      {loading ? (
        <div className="p-8 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : sets.length === 0 ? (
        <div className="card-calm text-center text-sm text-muted-foreground">
          No question sets yet. Create one and it will appear in the assignment builder.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sets.map((s) => (
            <div key={s.id} className="card-calm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{s.title}</div>
                  {s.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" aria-label="Edit question set" onClick={() => openEdit(s)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete question set" onClick={() => setDeleteId(s.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-muted">{(s.questions || []).length} questions</span>
                {s.scoring_enabled && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Scored · max {s.max_score ?? maxScoreForSet(s.questions || [])}
                  </span>
                )}
                {!s.is_active && <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t text-center">
                <div>
                  <div className="text-base font-semibold">{s.times_assigned}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Assigned</div>
                </div>
                <div>
                  <div className="text-base font-semibold">{s.responses}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Responses</div>
                </div>
                <div>
                  <div className="text-base font-semibold flex items-center justify-center gap-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    {s.avg_score ?? "—"}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit question set" : "New question set"}</DialogTitle>
            <DialogDescription>
              Add questions, choose which answers are scored, then assign this set to clients.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Weekly anxiety check-in"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Internal description (only you see this)</Label>
                <Textarea
                  rows={2}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-1"
                />
              </div>

              <CustomQuestionsEditor
                intro={editing.intro}
                questions={editing.questions}
                onIntroChange={(v) => setEditing({ ...editing, intro: v })}
                onChange={(qs) => setEditing({ ...editing, questions: qs })}
              />

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">Available for assignment</div>
                  <div className="text-xs text-muted-foreground">Turn off to hide it from the assignment builder.</div>
                </div>
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question set?</AlertDialogTitle>
            <AlertDialogDescription>
              Assignments already sent to clients keep their questions. This only removes the saved set.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionBankManager;
