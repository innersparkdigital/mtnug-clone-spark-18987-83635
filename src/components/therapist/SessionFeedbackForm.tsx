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
  onBalanceChange?: () => void;
}

const PROGRESS: { value: string; label: string }[] = [
  { value: "progressing_well", label: "Progressing well" },
  { value: "steady", label: "Steady" },
  { value: "needs_more_support", label: "Needs more support" },
  { value: "at_risk", label: "At risk" },
  { value: "crisis_activated", label: "Crisis activated" },
];

type Balance = { sessions_purchased: number; sessions_used: number; sessions_remaining: number };

const SessionFeedbackForm = ({ clientId, onBalanceChange }: Props) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState<Balance | null>(null);

  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("50 min");
  const [service, setService] = useState("Individual therapy");
  const [isNew, setIsNew] = useState(false);
  const [progress, setProgress] = useState("steady");
  const [notes, setNotes] = useState("");
  const [homeworkGiven, setHomeworkGiven] = useState(false);
  const [homeworkText, setHomeworkText] = useState("");
  const [nextBooked, setNextBooked] = useState("no");
  const [nextDate, setNextDate] = useState("");
  const [nextService, setNextService] = useState("");
  const [sessionsLeft, setSessionsLeft] = useState<string>("");

  const loadBalance = async () => {
    const { data, error } = await supabase.rpc("therapist_get_session_balance" as any, { _client_id: clientId });
    if (error) {
      console.warn(error.message);
      setBalance(null);
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (row) {
      const b = {
        sessions_purchased: Number(row.sessions_purchased || 0),
        sessions_used: Number(row.sessions_used || 0),
        sessions_remaining: Number(row.sessions_remaining || 0),
      };
      setBalance(b);
      setSessionsLeft(String(b.sessions_remaining));
    } else {
      setBalance({ sessions_purchased: 0, sessions_used: 0, sessions_remaining: 0 });
      setSessionsLeft("");
    }
  };

  const load = async () => {
    setLoading(true);
    const [{ data }] = await Promise.all([
      supabase
        .from("therapist_session_feedback")
        .select("*")
        .eq("client_id", clientId)
        .order("session_date", { ascending: false })
        .limit(20),
      loadBalance(),
    ]);
    setHistory((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [clientId]);

  const submit = async () => {
    if (!notes.trim()) return toast.error("Please write short session notes.");
    const remainingRaw = sessionsLeft.trim();
    let remaining: number | null = null;
    if (remainingRaw !== "") {
      remaining = Number(remainingRaw);
      if (!Number.isInteger(remaining) || remaining < 0 || remaining > 500) {
        return toast.error("Sessions left must be a whole number from 0 to 500.");
      }
    }

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
      _next_appt_date: nextDate || "",
      _next_appt_service: nextService,
    });
    if (error) {
      setSaving(false);
      return toast.error(error.message);
    }

    if (remaining !== null) {
      const { data: balData, error: balErr } = await supabase.rpc("therapist_set_sessions_remaining" as any, {
        _client_id: clientId,
        _remaining: remaining,
      });
      if (balErr) {
        setSaving(false);
        toast.error(`Session logged, but sessions left could not be saved: ${balErr.message}`);
        load();
        return;
      }
      const row = Array.isArray(balData) ? balData[0] : balData;
      if (row) {
        setBalance({
          sessions_purchased: Number(row.sessions_purchased || 0),
          sessions_used: Number(row.sessions_used || 0),
          sessions_remaining: Number(row.sessions_remaining || 0),
        });
        setSessionsLeft(String(row.sessions_remaining ?? remaining));
      }
      onBalanceChange?.();
    }

    setSaving(false);
    toast.success(remaining !== null ? "Session logged. Sessions left updated for admin trackers." : "Session logged.");
    setNotes("");
    setHomeworkText("");
    load();
  };

  const leftTone =
    balance == null ? "text-muted-foreground"
    : balance.sessions_remaining <= 0 ? "text-destructive"
    : balance.sessions_remaining <= 2 ? "text-amber-700 dark:text-amber-300"
    : "text-emerald-700 dark:text-emerald-400";

  return (
    <div className="space-y-4">
      <Card className="border-primary/15 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Log this session</CardTitle>
              <CardDescription className="mt-1">Notes sync to InnerSpark admin. Set sessions left so trackers stay accurate.</CardDescription>
            </div>
            <div className={`rounded-xl border bg-muted/40 px-3 py-2 text-right shrink-0 ${leftTone}`}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions left</div>
              <div className="text-xl font-semibold tabular-nums">{balance ? balance.sessions_remaining : "—"}</div>
              {balance && (
                <div className="text-[11px] text-muted-foreground">
                  {balance.sessions_used}/{balance.sessions_purchased} used
                </div>
              )}
            </div>
          </div>
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

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
            <Label htmlFor="sessions-left" className="text-xs font-medium">Sessions left after this session</Label>
            <Input
              id="sessions-left"
              type="number"
              min={0}
              max={500}
              step={1}
              inputMode="numeric"
              placeholder="e.g. 3"
              value={sessionsLeft}
              onChange={(e) => setSessionsLeft(e.target.value)}
              className="max-w-[140px] bg-background"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Enter how many paid sessions this client still has. This updates the therapist roster badge and InnerSpark admin Session Logs / client tables. Leave blank only if you are not changing the count.
            </p>
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
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
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
          <Button onClick={submit} disabled={saving} className="w-full h-11 rounded-xl">
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
              <div key={h.id} className="rounded-xl border bg-card p-3 text-sm shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{h.session_date} · {h.service_delivered}</div>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                    {String(h.progress_status || "").replace(/_/g, " ")}
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
