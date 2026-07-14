import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Quote, Sparkles } from "lucide-react";
import { toast } from "sonner";
import QuietFooter from "@/components/client-portal/QuietFooter";
import SessionReflectionTool from "@/components/client-portal/SessionReflectionTool";
import SafetyCheckInTool from "@/components/client-portal/SafetyCheckInTool";
import ThoughtRecordTool from "@/components/client-portal/ThoughtRecordTool";
import HomeworkTool from "@/components/client-portal/HomeworkTool";
import EmotionDiaryTool from "@/components/client-portal/EmotionDiaryTool";
import ScreeningTool from "@/components/client-portal/ScreeningTool";
import GratitudeTool from "@/components/client-portal/GratitudeTool";
import SelfCareTool from "@/components/client-portal/SelfCareTool";
import ActivityScheduleTool from "@/components/client-portal/ActivityScheduleTool";
import ToolStub from "@/components/client-portal/ToolStub";
const ProgressAnalytics = lazy(() => import("@/components/client-portal/ProgressAnalytics"));
const MilestoneTimeline = lazy(() => import("@/components/client-portal/MilestoneTimeline"));
import { getTool } from "@/lib/wellbeingToolsCatalog";
import { CalmThemeRoot } from "@/contexts/CalmThemeContext";
import CalmThemeToggle from "@/components/CalmThemeToggle";
import GreetingBlock from "@/components/client-portal/GreetingBlock";
import WeekStrip, { toIso, useWeekWindow } from "@/components/client-portal/WeekStrip";
import ClientToolCard from "@/components/client-portal/ClientToolCard";
import { summarizeSchedule } from "@/components/therapist/ScheduleFields";

interface Schedule {
  id: string;
  frequency: "one_time" | "daily" | "weekly" | "custom";
  days_of_week: number[];
  time_of_day: string | null;
  start_date: string;
  end_date: string | null;
}

interface AssignedTool {
  id: string;
  tool_key: string;
  title: string | null;
  therapist_note: string | null;
  due_date: string | null;
  config: any;
  status: string;
  latest_submission?: any;
  schedule?: Schedule | null;
  completed_dates?: string[]; // ISO date strings
}

interface Snapshot {
  client: { id: string; full_name: string; has_passcode: boolean };
  therapist: { full_name: string };
  today: string;
  assignment: null | {
    id: string;
    personal_note: string | null;
    tools: AssignedTool[];
  };
  has_red_alert?: boolean;
}

const IDLE_MS = 30 * 60 * 1000;

const scheduleMatchesDate = (s: Schedule | null | undefined, iso: string): boolean => {
  if (!s) return false;
  if (s.start_date > iso) return false;
  if (s.end_date && s.end_date < iso) return false;
  const dow = new Date(iso + "T12:00:00").getDay();
  if (s.frequency === "daily") return true;
  if (s.frequency === "one_time") return s.start_date === iso;
  if (s.frequency === "weekly" || s.frequency === "custom") {
    return s.days_of_week?.includes(dow) ?? false;
  }
  return false;
};

const ClientPortalInner = () => {
  const { token } = useParams<{ token: string }>();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedIso, setSelectedIso] = useState<string>("");
  const [view, setView] = useState<"today" | "all">("today");

  const load = useCallback(async () => {
    if (!token) return;
    const { data, error } = await supabase.rpc("client_snapshot", { _token: token });
    if (error) console.error(error);
    const snap = (data as unknown as Snapshot) ?? null;
    setSnapshot(snap);
    if (snap?.today && !selectedIso) setSelectedIso(snap.today);
    setLoading(false);
  }, [token, selectedIso]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!unlocked) return;
    let last = Date.now();
    const bump = () => { last = Date.now(); };
    const timer = window.setInterval(() => {
      if (Date.now() - last > IDLE_MS) {
        setUnlocked(false);
        setPasscode("");
        toast.info("Locked after 30 minutes of quiet.");
      }
    }, 60000);
    window.addEventListener("click", bump);
    window.addEventListener("keydown", bump);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("click", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [unlocked]);

  const today = useMemo(() => new Date(), []);
  const weekDates = useWeekWindow(today);
  const tools = snapshot?.assignment?.tools ?? [];
  const todayIso = snapshot?.today ?? toIso(today);

  const isCompletedOn = (t: AssignedTool, iso: string) =>
    (t.completed_dates || []).includes(iso);

  const weekDays = useMemo(() => {
    return weekDates.map((d) => {
      const iso = toIso(d);
      const scheduled = tools.filter((t) => scheduleMatchesDate(t.schedule, iso));
      const completed = scheduled.filter((t) => isCompletedOn(t, iso));
      return {
        date: d,
        isoDate: iso,
        scheduledCount: scheduled.length,
        completedCount: completed.length,
        isToday: iso === todayIso,
      };
    });
  }, [weekDates, tools, todayIso]);

  const hasAnySchedule = tools.some((t) => t.schedule && t.schedule.frequency !== "one_time");

  const dayTools = useMemo(() => {
    if (view === "all") return tools;
    const iso = selectedIso || todayIso;
    // Today view: scheduled for this day, OR (no schedule at all) if viewing today.
    // Also hide anything already completed on the selected day — the celebration
    // banner acknowledges completed work instead.
    return tools.filter((t) => {
      if (isCompletedOn(t, iso)) return false;
      if (t.schedule) return scheduleMatchesDate(t.schedule, iso);
      return iso === todayIso;
    });
  }, [tools, view, selectedIso, todayIso]);

  // What did we complete on the currently viewed day?
  const completedToday = useMemo(() => {
    if (view === "all") return [] as AssignedTool[];
    const iso = selectedIso || todayIso;
    return tools.filter((t) => {
      const eligible = t.schedule ? scheduleMatchesDate(t.schedule, iso) : iso === todayIso;
      return eligible && isCompletedOn(t, iso);
    });
  }, [tools, view, selectedIso, todayIso]);

  const scheduledToday = useMemo(() => {
    if (view === "all") return 0;
    const iso = selectedIso || todayIso;
    return tools.filter((t) => (t.schedule ? scheduleMatchesDate(t.schedule, iso) : iso === todayIso)).length;
  }, [tools, view, selectedIso, todayIso]);

  const catchupTools = useMemo(() => {
    // Tools scheduled in the last 3 days (excluding today) that weren't completed on that day
    if (view !== "today" || selectedIso !== todayIso) return [] as AssignedTool[];
    const result: AssignedTool[] = [];
    const today = new Date(todayIso + "T12:00:00");
    for (let i = 1; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = toIso(d);
      tools.forEach((t) => {
        if (scheduleMatchesDate(t.schedule, iso) && !isCompletedOn(t, iso) && !result.find((r) => r.id === t.id)) {
          result.push(t);
        }
      });
    }
    return result;
  }, [tools, view, selectedIso, todayIso]);

  const activeTool = useMemo(
    () => tools.find((t) => t.id === activeToolId) || null,
    [tools, activeToolId],
  );

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-background p-6">
        <Card className="max-w-md w-full card-calm">
          <CardHeader>
            <CardTitle>This link isn't valid</CardTitle>
            <CardDescription>
              This private space couldn't be found. Please check the link your therapist sent you, or contact info@innersparkafrica.com.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const firstName = snapshot.client.full_name.split(" ")[0];

  const setPasscodeFn = async () => {
    if (passcode.length < 6) return toast.error("Passcode must be at least 6 characters.");
    if (passcode !== confirmPasscode) return toast.error("Passcodes don't match.");
    setBusy(true);
    const { data, error } = await supabase.rpc("set_client_passcode", { _token: token!, _passcode: passcode });
    setBusy(false);
    if (error || !data) return toast.error(error?.message || "Could not set passcode.");
    setUnlocked(true);
    await load();
  };

  const verifyPasscodeFn = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("verify_client_passcode", { _token: token!, _passcode: passcode });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data) return toast.error("That passcode doesn't match.");
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-background p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="absolute top-3 right-3"><CalmThemeToggle /></div>
        <div className="min-h-full flex items-center justify-center py-8">
          <div className="max-w-md w-full card-calm p-6 fade-in-calm">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 grid place-items-center mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">Hi {firstName}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {snapshot.client.has_passcode
                  ? "This is your private space. Please enter your passcode."
                  : "This is your private space. Set a passcode so only you can open it."}
              </p>
            </div>
            <div className="space-y-3 mt-6">
              <div>
                <Label>{snapshot.client.has_passcode ? "Passcode" : "Choose a passcode (min 6 characters)"}</Label>
                <Input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} autoFocus />
              </div>
              {!snapshot.client.has_passcode && (
                <div>
                  <Label>Confirm passcode</Label>
                  <Input type="password" value={confirmPasscode} onChange={(e) => setConfirmPasscode(e.target.value)} />
                </div>
              )}
              <Button
                onClick={snapshot.client.has_passcode ? verifyPasscodeFn : setPasscodeFn}
                disabled={busy}
                className="w-full"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {snapshot.client.has_passcode ? "Open my space" : "Set passcode & continue"}
              </Button>
              <QuietFooter />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveTool = () => {
    if (!activeTool) return null;
    const meta = getTool(activeTool.tool_key);
    const done = () => {
      const name = (activeTool.title || meta?.name || "that").toString();
      const messages = [
        `Thank you for showing up for yourself, ${firstName}. "${name}" is done for today.`,
        `${firstName}, that took courage. "${name}" is complete — your therapist will see this.`,
        `Beautifully done, ${firstName}. One small step, and it counts.`,
        `Saved. ${firstName}, be proud of the effort — not the outcome.`,
      ];
      toast.success(messages[Math.floor(Math.random() * messages.length)], { duration: 4500 });
      setActiveToolId(null);
      load();
    };
    const back = () => setActiveToolId(null);
    const common = { token: token!, assignmentToolId: activeTool.id, onDone: done, onBack: back };
    switch (activeTool.tool_key) {
      case "session-reflection":
        return <SessionReflectionTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "safety-checkin":
        return <SafetyCheckInTool {...common} />;
      case "thought-record":
        return <ThoughtRecordTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "homework":
        return <HomeworkTool {...common} config={activeTool.config || {}} initial={activeTool.latest_submission?.payload} />;
      case "emotion-diary":
        return <EmotionDiaryTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "screening-phq9":
      case "screening-gad7":
        return <ScreeningTool variant={activeTool.tool_key === "screening-phq9" ? "phq9" : "gad7"} {...common} />;
      case "gratitude":
        return <GratitudeTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "self-care":
        return <SelfCareTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "activity-schedule":
        return <ActivityScheduleTool {...common} initial={activeTool.latest_submission?.payload} />;
      default:
        return (
          <ToolStub
            toolName={activeTool.title || meta?.name || activeTool.tool_key}
            description={meta?.description || ""}
            onBack={back}
          />
        );
    }
  };

  const toolCardData = (t: AssignedTool) => ({
    id: t.id,
    tool_key: t.tool_key,
    title: t.title,
    therapist_note: t.therapist_note,
    due_date: t.due_date,
    status: t.status,
    completedToday: isCompletedOn(t, selectedIso || todayIso),
    scheduleLabel: summarizeSchedule(t.schedule
      ? { ...t.schedule, frequency: t.schedule.frequency === "one_time" ? "once" : t.schedule.frequency, time_of_day: t.schedule.time_of_day || "", start_date: t.schedule.start_date, end_date: t.schedule.end_date || "" }
      : null),
  });

  return (
    <div className="fixed inset-0 overflow-y-auto bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex justify-end mb-2">
          <CalmThemeToggle />
        </div>

        <GreetingBlock fullName={snapshot.client.full_name} therapistName={snapshot.therapist.full_name} />

        {snapshot.has_red_alert && !activeTool && (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm leading-relaxed">
            Your therapist has been alerted and is reaching out to you. If you need someone right now, please call{" "}
            <a href="tel:0800212121" className="text-destructive font-semibold underline">0800 212 121</a> — free, 24/7.
            You matter. 💙
          </div>
        )}

        {activeTool ? (
          <div className="mt-6">{renderActiveTool()}</div>
        ) : (
          <>
            {snapshot.assignment?.personal_note && (
              <div className="mt-8 card-calm p-4 bg-primary/5 border-primary/20">
                <div className="flex gap-3">
                  <Quote className="h-4 w-4 text-primary/70 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm italic leading-relaxed">{snapshot.assignment.personal_note}</p>
                    <p className="text-xs text-muted-foreground mt-2">— {snapshot.therapist.full_name}</p>
                  </div>
                </div>
              </div>
            )}

            {hasAnySchedule && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">This week</h2>
                  <div className="inline-flex rounded-full border border-border p-0.5 bg-card text-xs">
                    <button
                      onClick={() => { setView("today"); setSelectedIso(todayIso); }}
                      className={`px-3 py-1 rounded-full transition-colors ${view === "today" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setView("all")}
                      className={`px-3 py-1 rounded-full transition-colors ${view === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      All tools
                    </button>
                  </div>
                </div>
                {view === "today" && (
                  <WeekStrip
                    days={weekDays}
                    selectedIso={selectedIso || todayIso}
                    onSelect={setSelectedIso}
                  />
                )}
              </div>
            )}

            {!snapshot.assignment || tools.length === 0 ? (
              <div className="mt-8 card-calm p-6 text-center">
                <p className="font-medium">Nothing to do right now</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your therapist hasn't set any exercises yet. They'll appear here after your next session.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {dayTools.length === 0 ? (
                  <div className="card-calm p-6 text-center text-sm text-muted-foreground">
                    Nothing scheduled for this day. Take the day easy — or tap "All tools" to explore.
                  </div>
                ) : (
                  dayTools.map((t) => (
                    <ClientToolCard key={t.id} tool={toolCardData(t)} onOpen={() => setActiveToolId(t.id)} />
                  ))
                )}
              </div>
            )}

            {catchupTools.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Whenever you're ready
                </h2>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  A few things from the last couple of days — no rush, and no pressure to catch up.
                </p>
                <div className="space-y-3 opacity-90">
                  {catchupTools.map((t) => (
                    <ClientToolCard
                      key={"catch-" + t.id}
                      tool={{ ...toolCardData(t), completedToday: false, scheduleLabel: "Missed" }}
                      onOpen={() => setActiveToolId(t.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <ProgressAnalytics tools={tools as any} clientFirstName={snapshot.client.full_name.split(" ")[0]} />
            <MilestoneTimeline
              tools={tools as any}
              assignmentCreatedAt={(snapshot.assignment as any)?.created_at}
              clientFirstName={snapshot.client.full_name.split(" ")[0]}
            />
          </>
        )}

        <QuietFooter />
      </div>
    </div>
  );
};

const ClientPortal = () => (
  <CalmThemeRoot className="min-h-screen">
    <ClientPortalInner />
  </CalmThemeRoot>
);

export default ClientPortal;