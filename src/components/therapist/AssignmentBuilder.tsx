import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WELLBEING_TOOLS } from "@/lib/wellbeingToolsCatalog";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { toast } from "sonner";
import { Loader2, Copy, Mail } from "lucide-react";
import ScheduleFields, { defaultSchedule, ScheduleValue } from "./ScheduleFields";
import CustomQuestionsEditor from "./CustomQuestionsEditor";

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  access_token: string;
}

interface Props {
  client: Client;
  therapistName: string;
  onDone: () => void;
}

interface ToolConfig {
  therapist_note: string;
  due_date: string;
  tasks?: string;
  skill?: string;
  intro?: string;
  questions?: {
    id: string;
    label: string;
    type: "text" | "long_text" | "scale" | "yes_no" | "mcq";
    options?: string[];
    scale_min?: number;
    scale_max?: number;
    required?: boolean;
  }[];
  schedule: ScheduleValue;
}

const AssignmentBuilder = ({ client, therapistName, onDone }: Props) => {
  const [selected, setSelected] = useState<Record<string, ToolConfig>>({
    "session-reflection": { therapist_note: "", due_date: "", schedule: defaultSchedule() },
  });
  const [personalNote, setPersonalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

  const portalUrl = useMemo(
    () => `${window.location.origin}/my-progress/${client.access_token}`,
    [client.access_token],
  );

  const toggle = (key: string) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[key]) delete copy[key];
      else copy[key] = { therapist_note: "", due_date: "", schedule: defaultSchedule() };
      return copy;
    });
  };

  const submit = async () => {
    const keys = Object.keys(selected);
    if (keys.length === 0) return toast.error("Select at least one tool.");
    setSaving(true);
    const tools = keys.map((k) => ({
      tool_key: k,
      title: null,
      therapist_note: selected[k].therapist_note || null,
      due_date: selected[k].due_date || null,
      config:
        k === "homework" && selected[k].tasks
          ? { tasks: selected[k].tasks }
          : k === "life-skills"
            ? { skill: selected[k].skill || "" }
            : k === "custom-questions"
              ? { intro: selected[k].intro || "", questions: selected[k].questions || [] }
              : {},
    }));
    const { data, error } = await supabase.rpc("create_client_assignment", {
      _client_id: client.id,
      _personal_note: personalNote || null,
      _tools: tools as any,
    });
    if (error) { setSaving(false); return toast.error(error.message); }
    const assignmentId = data as unknown as string;

    // Re-fetch inserted tool ids so we can attach schedules to the right rows.
    const { data: toolRows, error: toolErr } = await supabase
      .from("assignment_tools")
      .select("id, tool_key")
      .eq("assignment_id", assignmentId);

    if (!toolErr && toolRows) {
      for (const key of keys) {
        const sched = selected[key].schedule;
        if (!sched || sched.frequency === "once") continue;
        const row = (toolRows as any[]).find((r) => r.tool_key === key);
        if (!row) continue;
        const freqMap: Record<string, string> = { daily: "daily", weekly: "weekly", custom: "custom" };
        await supabase.rpc("create_assignment_schedule" as any, {
          _assignment_tool_id: row.id,
          _frequency: freqMap[sched.frequency],
          _days_of_week: sched.frequency === "daily" ? [] : sched.days_of_week,
          _time_of_day: sched.time_of_day || null,
          _start_date: sched.start_date || new Date().toISOString().slice(0, 10),
          _end_date: sched.end_date || null,
        });
      }
    }

    setSaving(false);
    setSavedAssignmentId(assignmentId);
    toast.success("Assignment created.");
  };

  const sendInvite = async () => {
    if (!client.email) return toast.error("This client has no email on file.");
    const toolNames = Object.keys(selected).map((k) => WELLBEING_TOOLS.find((t) => t.key === k)?.name || k);
    const { data, error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "client-assignment-invite",
        recipientEmail: client.email,
        idempotencyKey: `client-invite-${savedAssignmentId}-${Date.now()}`,
        templateData: {
          client_name: client.full_name.split(" ")[0],
          therapist_name: therapistName,
          personal_note: personalNote,
          tool_names: toolNames,
          portal_url: portalUrl,
        },
      },
    });
    if (error) return toast.error(error.message);
    if ((data as any)?.error) return toast.error((data as any).error);
    toast.success("Invite sent to " + client.email);
    onDone();
  };

  const copyLink = async () => {
    const ok = await copyToClipboard(portalUrl);
    if (ok) toast.success("Link copied");
    else toast.error("Couldn't copy automatically — long-press the link to copy.");
  };

  if (savedAssignmentId) {
    return (
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>Assignment ready 💙</CardTitle>
          <CardDescription>
            Send the private link to {client.full_name} by email, or copy it to share another way.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            readOnly
            value={portalUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full p-2 rounded-lg border bg-muted/50 text-xs break-all font-mono select-all"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={sendInvite} disabled={!client.email}>
              <Mail className="h-4 w-4 mr-2" /> Email the invite
            </Button>
            <Button variant="outline" onClick={copyLink}>
              <Copy className="h-4 w-4 mr-2" /> Copy link
            </Button>
            <Button variant="ghost" onClick={onDone}>Done</Button>
          </div>
          {!client.email && (
            <p className="text-xs text-muted-foreground">No email on file — copy the link and share it via WhatsApp.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New assignment for {client.full_name}</CardTitle>
        <CardDescription>Pick the tools you want them to work on between sessions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Personal note (shown at the top of their space)</Label>
          <Textarea
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="e.g. I've picked these based on what we discussed. Take your time — no rush."
            rows={3}
            className="mt-1.5"
          />
        </div>

        <div className="space-y-2">
          <Label>Tools</Label>
          {WELLBEING_TOOLS.map((tool) => {
            const isOn = !!selected[tool.key];
            return (
              <div key={tool.key} className={`rounded-lg border p-3 ${isOn ? "border-primary/50 bg-primary/5" : ""}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={isOn} onCheckedChange={() => toggle(tool.key)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{tool.name}</span>
                      {tool.status === "coming-soon" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">Preview</span>
                      )}
                      {tool.category === "safety" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive uppercase">Safety</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tool.short}</div>
                  </div>
                </label>
                {isOn && (
                  <div className="mt-3 pl-8 space-y-2">
                    <div>
                      <Label className="text-xs">Note for this tool (optional)</Label>
                      <Textarea
                        rows={2}
                        value={selected[tool.key].therapist_note}
                        onChange={(e) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], therapist_note: e.target.value } }))}
                        className="mt-1"
                      />
                    </div>
                    {tool.key === "homework" && (
                      <div>
                        <Label className="text-xs">Task list (one per line)</Label>
                        <Textarea
                          rows={4}
                          placeholder={"Practice 4-7-8 breathing daily\nGo for one 20-min walk\nJournal before bed"}
                          value={selected[tool.key].tasks || ""}
                          onChange={(e) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], tasks: e.target.value } }))}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {tool.key === "life-skills" && (
                      <div>
                        <Label className="text-xs">The skill for this week</Label>
                        <Textarea
                          rows={2}
                          placeholder="e.g. Practice saying 'no' at least twice this week."
                          value={selected[tool.key].skill || ""}
                          onChange={(e) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], skill: e.target.value } }))}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {tool.key === "custom-questions" && (
                      <CustomQuestionsEditor
                        intro={selected[tool.key].intro || ""}
                        questions={selected[tool.key].questions || []}
                        onIntroChange={(v) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], intro: v } }))}
                        onChange={(qs) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], questions: qs } }))}
                      />
                    )}
                    {tool.bestFor && (
                      <div className="text-[11px] text-muted-foreground italic pt-1">Best for: {tool.bestFor}</div>
                    )}
                    <div>
                      <Label className="text-xs">Due date (optional)</Label>
                      <Input
                        type="date"
                        value={selected[tool.key].due_date}
                        onChange={(e) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], due_date: e.target.value } }))}
                        className="mt-1"
                      />
                    </div>
                    <ScheduleFields
                      value={selected[tool.key].schedule}
                      onChange={(v) => setSelected((p) => ({ ...p, [tool.key]: { ...p[tool.key], schedule: v } }))}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onDone}>Cancel</Button>
          <Button onClick={submit} disabled={saving} className="flex-1">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Create assignment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentBuilder;