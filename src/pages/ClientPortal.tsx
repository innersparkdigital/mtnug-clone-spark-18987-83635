import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Quote, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CLIENT_IDLE_MS, clearClientSession, getClientSession, isSessionError, logoutClient, onCrossTabLogout } from "@/lib/clientSession";
import QuietFooter from "@/components/client-portal/QuietFooter";
import SessionReflectionTool from "@/components/client-portal/SessionReflectionTool";
import SafetyCheckInTool from "@/components/client-portal/SafetyCheckInTool";
import ThoughtRecordTool from "@/components/client-portal/ThoughtRecordTool";
import HomeworkTool from "@/components/client-portal/HomeworkTool";
import EmotionDiaryTool from "@/components/client-portal/EmotionDiaryTool";
import ScaleTool from "@/components/client-portal/ScaleTool";
import GratitudeTool from "@/components/client-portal/GratitudeTool";
import SelfCareTool from "@/components/client-portal/SelfCareTool";
import ActivityScheduleTool from "@/components/client-portal/ActivityScheduleTool";
import ToolStub from "@/components/client-portal/ToolStub";
import CognitiveReframingTool from "@/components/client-portal/CognitiveReframingTool";
import LifeSkillsTool from "@/components/client-portal/LifeSkillsTool";
import SupportNetworkTool from "@/components/client-portal/SupportNetworkTool";
import CustomQuestionsTool from "@/components/client-portal/CustomQuestionsTool";
const ProgressAnalytics = lazy(() => import("@/components/client-portal/ProgressAnalytics"));
const MilestoneTimeline = lazy(() => import("@/components/client-portal/MilestoneTimeline"));
import { getTool } from "@/lib/wellbeingToolsCatalog";
import { getScale } from "@/lib/screeningScales";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/supportContact";
import { CalmThemeRoot } from "@/contexts/CalmThemeContext";
import CalmThemeToggle from "@/components/CalmThemeToggle";
import GreetingBlock from "@/components/client-portal/GreetingBlock";
import WeekStrip, { toIso, useWeekWindow } from "@/components/client-portal/WeekStrip";
import ClientToolCard from "@/components/client-portal/ClientToolCard";
import { summarizeSchedule } from "@/components/therapist/ScheduleFields";
import ManualResetRequestForm from "@/components/auth/ManualResetRequestForm";

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
  const navigate = useNavigate();
  const [session] = useState<string | null>(() => getClientSession());
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedIso, setSelectedIso] = useState<string>("");
  const [view, setView] = useState<"today" | "all">("today");
  const lastServerCheck = useRef(0);

  const endSession = useCallback(async (message?: string) => {
    setSnapshot(null);
    setActiveToolId(null);
    await logoutClient();
    if (message) toast.info(message);
    navigate("/client-login", { replace: true });
  }, [navigate]);

  const load = useCallback(async () => {
    if (!session) return;
    lastServerCheck.current = Date.now();
    const { data, error } = await supabase.rpc("client_session_snapshot", { _session: session });
    if (error || !data) {
      if (!error || isSessionError(error)) return endSession("Please sign in again.");
      setLoadFailed(true);
      setLoading(false);
      return;
    }
    const snap = data as unknown as Snapshot;
    setSnapshot(snap);
    setLoadFailed(false);
    setSelectedIso((cur) => cur || snap.today);
    setLoading(false);
  }, [session, endSession]);

  useEffect(() => {
    if (!session) { navigate("/client-login", { replace: true }); return; }
    load();
  }, [session, load, navigate]);

  // Cross-tab logout, visibility recheck, 30-minute inactivity.
  useEffect(() => {
    if (!session) return;
    let last = Date.now();
    const bump = () => {
      last = Date.now();
      // keep the server-side idle timer in step with real activity
      if (Date.now() - lastServerCheck.current > 10 * 60 * 1000) load();
    };
    const timer = window.setInterval(() => {
      if (Date.now() - last > CLIENT_IDLE_MS) endSession("Signed out after 30 minutes of quiet.");
    }, 30000);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - last > CLIENT_IDLE_MS) endSession("Signed out after 30 minutes of quiet.");
      else load();
    };
    const offTabs = onCrossTabLogout(() => { clearClientSession(); setSnapshot(null); navigate("/client-login", { replace: true }); });
    const evts = ["click", "keydown", "touchstart", "scroll"] as const;
    evts.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      evts.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener("visibilitychange", onVisible);
      offTabs();
    };
  }, [session, load, endSession, navigate]);

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

  if (loading || (!snapshot && !loadFailed)) {
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
            <CardTitle>We couldn't load your space</CardTitle>
            <CardDescription>
              Please check your connection and try again, or contact info@innersparkafrica.com.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 flex gap-2">
            <Button onClick={() => { setLoading(true); load(); }}>Try again</Button>
            <Button variant="outline" onClick={() => endSession()}>Log out</Button>
          </div>
        </Card>
      </div>
    );
  }

  const firstName = snapshot.client.full_name.split(" ")[0];

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
    const common = { session: session!, assignmentToolId: activeTool.id, onDone: done, onBack: back };
    const scale = getScale(activeTool.tool_key);
    if (scale) return <ScaleTool scale={scale} {...common} />;
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

      case "gratitude":
        return <GratitudeTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "self-care":
        return <SelfCareTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "activity-schedule":
        return <ActivityScheduleTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "cognitive-reframing":
        return <CognitiveReframingTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "life-skills":
        return <LifeSkillsTool {...common} config={activeTool.config || {}} initial={activeTool.latest_submission?.payload} />;
      case "support-network":
        return <SupportNetworkTool {...common} initial={activeTool.latest_submission?.payload} />;
      case "custom-questions":
        return <CustomQuestionsTool {...common} config={activeTool.config || {}} initial={activeTool.latest_submission?.payload} />;
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
    completed_dates: t.completed_dates,
    scheduleLabel: summarizeSchedule(t.schedule
      ? { ...t.schedule, frequency: t.schedule.frequency === "one_time" ? "once" : t.schedule.frequency, time_of_day: t.schedule.time_of_day || "", start_date: t.schedule.start_date, end_date: t.schedule.end_date || "" }
      : null),
  });

  return (
    <div className="fixed inset-0 overflow-y-auto bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="flex justify-end items-center gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={() => endSession()}><LogOut className="h-4 w-4 mr-1" /> Log out</Button>
          <CalmThemeToggle />
        </div>

        <GreetingBlock fullName={snapshot.client.full_name} therapistName={snapshot.therapist.full_name} />

        {!activeTool && (
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/book-therapist"
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Book next session
            </a>
            <a
              href="https://wa.me/256792085773"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              Message support
            </a>
          </div>
        )}

        {snapshot.has_red_alert && !activeTool && (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm leading-relaxed">
            Your therapist has been alerted and is reaching out to you. If you need someone right now, please call{" "}
            <a href={SUPPORT_PHONE_TEL} className="text-destructive font-semibold underline">{SUPPORT_PHONE_DISPLAY}</a> — call or WhatsApp.
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
                {/* Gratitude / celebration banner when things have been completed */}
                {view === "today" && completedToday.length > 0 && (
                  <div className="card-calm p-4 border-emerald-500/30 bg-emerald-500/5 fade-in-calm">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">
                          {completedToday.length === scheduledToday
                            ? `You've completed everything for today, ${firstName}. That matters.`
                            : `${completedToday.length} done today — proud of you, ${firstName}.`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {completedToday.length === scheduledToday
                            ? "Rest is part of the work. Your therapist can see this progress and will be with you."
                            : "Every small step counts. Come back when you're ready — no pressure."}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {completedToday.slice(0, 4).map((t) => (
                            <span
                              key={t.id}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 line-through decoration-1"
                            >
                              {t.title || getTool(t.tool_key)?.name || t.tool_key}
                            </span>
                          ))}
                          {completedToday.length > 4 && (
                            <span className="text-[11px] text-muted-foreground">
                              +{completedToday.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dayTools.length === 0 ? (
                  completedToday.length === 0 && (
                    <div className="card-calm p-6 text-center text-sm text-muted-foreground">
                      Nothing scheduled for this day. Take the day easy — or tap "All tools" to explore.
                    </div>
                  )
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

            <Suspense fallback={<div className="mt-10 h-40 rounded-2xl bg-muted/30 animate-pulse" />}>
              <ProgressAnalytics tools={tools as any} clientFirstName={snapshot.client.full_name.split(" ")[0]} />
              <MilestoneTimeline
                tools={tools as any}
                assignmentCreatedAt={(snapshot.assignment as any)?.created_at}
                clientFirstName={snapshot.client.full_name.split(" ")[0]}
              />
            </Suspense>
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