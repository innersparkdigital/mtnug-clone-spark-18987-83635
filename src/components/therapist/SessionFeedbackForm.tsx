import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  clientId: string;
}

const PROGRESS: { value: string; label: string }[] = [
  { value: "improving", label: "Improving" },
  { value: "stable", label: "Stable" },
  { value: "worsening", label: "Worsening" },
  { value: "in_crisis", label: "In crisis" },
];

const SessionFeedbackForm = ({ clientId }: Props) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("50 min");
  const [service, setService] = useState("Individual therapy");
  const [isNew, setIsNew] = useState(false);
  const [progress, setProgress] = useState("stable");
  const [notes, setNotes] = useState("");
  const [homeworkGiven, setHomeworkGiven] = useState(false);
  const [homeworkText, setHomeworkText] = useState("");
  const [nextBooked, setNextBooked] = useState("no");
  const [nextDate, setNextDate] = useState("");
  const [nextService, setNextService] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("therapist_session_feedback")
      .select("*")
      .eq("client_id", clientId)
      .order("session_date", { ascending: false })
      .limit(20);
    setHistory((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [clientId]);

  const submit = async () => {
    if (!notes.trim()) return toast.error("Please write short session notes.");
    setSaving(true);
    const { error } = await supabase.rpc("log_session_feedback", {
      _client_id: clientId,
      _session_date: sessionDate,
      _duration: duration,
      _service_delivered: service,
      _is_new_client: isNew,
      _progress_status: progress as any,
      _notes: notes,
      _homework_given: homeworkGiven,
      _homework_text: homeworkText,
      _next_appt_booked: nextBooked,
      _next_appt_date: nextDate || null as any,
      _next_appt_service: nextService,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Session logged.");
    setNotes("");
    setHomeworkText("");
    load();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log this session</CardTitle>
          <CardDescription>Structured notes sync to admin for oversight.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Session date</Label>
              <Input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Duration</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 50 min" />
            </div>
            <div>
              <Label className="text-xs">Service delivered</Label>
              <Input value={service} onChange={(e) => setService(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="isNew" checked={isNew} onCheckedChange={(v) => setIsNew(!!v)} />
            <Label htmlFor="isNew" className="text-xs">New client (first session)</Label>
          </div>
          <div>
            <Label className="text-xs">Progress</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {PROGRESS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProgress(p.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    progress === p.value ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Session notes</Label>
            <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="hw" checked={homeworkGiven} onCheckedChange={(v) => setHomeworkGiven(!!v)} />
            <Label htmlFor="hw" className="text-xs">Homework given</Label>
          </div>
          {homeworkGiven && (
            <Textarea rows={2} value={homeworkText} onChange={(e) => setHomeworkText(e.target.value)} placeholder="Describe the homework..." />
          )}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Next appointment</Label>
              <select
                className="w-full rounded-md border bg-card px-2 py-2 text-sm"
                value={nextBooked}
                onChange={(e) => setNextBooked(e.target.value)}
              >
                <option value="no">Not booked</option>
                <option value="yes">Booked</option>
                <option value="client_deciding">Client deciding</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Next date</Label>
              <Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Next service</Label>
              <Input value={nextService} onChange={(e) => setNextService(e.target.value)} />
            </div>
          </div>
          <Button onClick={submit} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Log session
          </Button>
        </CardContent>
      </Card>

      <div>
        <div className="text-sm font-medium mb-2">Recent sessions</div>
        {loading ? (
          <div className="text-xs text-muted-foreground">Loading…</div>
        ) : history.length === 0 ? (
          <div className="text-xs text-muted-foreground">No sessions logged yet.</div>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="card-calm text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{h.session_date} · {h.service_delivered}</div>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {h.progress_status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground whitespace-pre-wrap mt-1">{h.notes}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionFeedbackForm;