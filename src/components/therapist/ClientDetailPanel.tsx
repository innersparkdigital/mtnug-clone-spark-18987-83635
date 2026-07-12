import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { getTool } from "@/lib/wellbeingToolsCatalog";
import AssignmentBuilder from "./AssignmentBuilder";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  presenting_concern: string | null;
  access_token: string;
  created_at: string;
  last_seen_at?: string | null;
  open_alerts?: number;
  overdue_tools?: number;
  active_tools?: number;
}

interface Submission {
  id: string;
  assignment_tool_id: string;
  payload: any;
  screening_score: number | null;
  screening_severity: string | null;
  mood_score: number | null;
  safety_flag: boolean;
  submission_type: "final" | "draft";
  submitted_at: string;
  updated_at: string;
  tool_key?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client | null;
  therapistName: string;
  onAssignmentSaved?: () => void;
}

const initials = (name: string) =>
  name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const heatColor = (score: number) => {
  // 0..3 PHQ per-question — green -> amber -> red
  if (score <= 0) return "hsl(var(--muted))";
  if (score === 1) return "hsl(var(--success) / 0.5)";
  if (score === 2) return "hsl(var(--warn) / 0.65)";
  return "hsl(var(--danger) / 0.75)";
};

const ClientDetailPanel = ({ open, onOpenChange, client, therapistName, onAssignmentSaved }: Props) => {
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [tab, setTab] = useState("overview");
  const [moodRange, setMoodRange] = useState<30 | 60 | 90>(30);

  useEffect(() => {
    if (!open || !client) return;
    setLoading(true);
    (async () => {
      const { data: subsData } = await supabase
        .from("tool_submissions")
        .select("id, assignment_tool_id, payload, screening_score, screening_severity, mood_score, safety_flag, submission_type, submitted_at, updated_at")
        .eq("client_id", client.id)
        .eq("submission_type", "final")
        .order("submitted_at", { ascending: false })
        .limit(500);
      const { data: toolRows } = await supabase
        .from("assignment_tools")
        .select("id, tool_key, assignment_id, client_assignments!inner(client_id)")
        .eq("client_assignments.client_id", client.id);
      const byId = new Map<string, string>();
      (toolRows || []).forEach((r: any) => byId.set(r.id, r.tool_key));
      setSubs(((subsData || []) as Submission[]).map((s) => ({ ...s, tool_key: byId.get(s.assignment_tool_id) })));
      setLoading(false);
    })();
  }, [open, client]);

  const grouped = useMemo(() => {
    const g: Record<string, Submission[]> = {};
    subs.forEach((s) => {
      const k = s.tool_key || "unknown";
      (g[k] ||= []).push(s);
    });
    return g;
  }, [subs]);

  const phqSubs = grouped["screening-phq9"] || [];
  const gadSubs = grouped["screening-gad7"] || [];
  const latestPhq = phqSubs[0];
  const prevPhq = phqSubs[1];
  const phqTrend = latestPhq && prevPhq && latestPhq.screening_score != null && prevPhq.screening_score != null
    ? latestPhq.screening_score - prevPhq.screening_score
    : 0;

  const hasSafety = subs.some((s) => s.safety_flag);
  const riskLevel: "red" | "amber" | "green" =
    hasSafety || (client?.open_alerts || 0) > 0 || (latestPhq?.screening_severity === "severe")
      ? "red"
      : (client?.overdue_tools || 0) > 0 || latestPhq?.screening_severity === "moderately_severe"
      ? "amber"
      : "green";

  const riskReason =
    riskLevel === "red"
      ? hasSafety ? "Safety flag on a recent submission" : "Severe screening score or open alert"
      : riskLevel === "amber"
      ? "Some overdue tasks or elevated screening"
      : "Engaged and within healthy range";

  // Mood timeline from all submissions with mood_score
  const moodRows = useMemo(() => {
    const cutoff = Date.now() - moodRange * 86400000;
    return subs
      .filter((s) => s.mood_score != null && new Date(s.submitted_at).getTime() >= cutoff)
      .slice()
      .reverse();
  }, [subs, moodRange]);

  const moodChart = useMemo(() => {
    const labels = moodRows.map((s) => fmtDate(s.submitted_at));
    const values = moodRows.map((s) => s.mood_score as number);
    // 7-day moving average
    const avg = values.map((_, i) => {
      const win = values.slice(Math.max(0, i - 6), i + 1);
      return win.reduce((a, b) => a + b, 0) / win.length;
    });
    return {
      labels,
      datasets: [
        {
          label: "Mood",
          data: values,
          borderColor: "hsl(232 65% 53%)",
          backgroundColor: "hsl(232 65% 53% / 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
        },
        {
          label: "7-day average",
          data: avg,
          borderColor: "hsl(232 65% 53% / 0.5)",
          borderDash: [4, 4],
          fill: false,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    };
  }, [moodRows]);

  const buildScreeningChart = (list: Submission[], color: string) => {
    const rows = list.slice().reverse();
    return {
      labels: rows.map((s) => fmtDate(s.submitted_at)),
      datasets: [
        {
          label: "Score",
          data: rows.map((s) => s.screening_score),
          borderColor: color,
          backgroundColor: color.replace("hsl", "hsla").replace(")", " / 0.15)"),
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };
  };

  const summaryParagraph = useMemo(() => {
    if (!client) return "";
    const bits: string[] = [];
    bits.push(`${client.full_name.split(" ")[0]} has ${subs.length} submission${subs.length === 1 ? "" : "s"} on file.`);
    if (latestPhq) {
      bits.push(
        `Latest PHQ-9 is ${latestPhq.screening_score} (${(latestPhq.screening_severity || "").replace(/_/g, " ")})` +
          (phqTrend < 0 ? `, down ${Math.abs(phqTrend)} from prior — moving in the right direction.` :
           phqTrend > 0 ? `, up ${phqTrend} from prior — worth checking in on.` : "."),
      );
    }
    if ((client.overdue_tools || 0) > 0) bits.push(`${client.overdue_tools} task${client.overdue_tools! > 1 ? "s" : ""} currently overdue.`);
    if (hasSafety) bits.push("A recent safety flag needs review.");
    return bits.join(" ");
  }, [client, subs, latestPhq, phqTrend, hasSafety]);

  if (!client) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl p-0 overflow-hidden bg-background">
        <div className="calm-theme h-full flex flex-col">
          <SheetHeader className="p-5 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
                {initials(client.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-left text-lg">{client.full_name}</SheetTitle>
                <div className="text-xs text-muted-foreground truncate">
                  {client.presenting_concern || "No concern recorded"}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`risk-dot risk-${riskLevel}`} />
                  <span className="text-xs capitalize">{riskLevel} risk · {riskReason}</span>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mx-5 mt-4 justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="responses">Tool responses</TabsTrigger>
              <TabsTrigger value="mood">Mood trend</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
              <TabsTrigger value="assign">Assign</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <>
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Stat label="Total sessions" value={subs.length} />
                      <Stat label="Completion" value={`${client.active_tools ?? 0} active`} />
                      <Stat label="Days since check-in" value={daysSince(client.last_seen_at)} />
                      <Stat
                        label="PHQ-9 trend"
                        value={
                          <span className="inline-flex items-center gap-1">
                            {phqTrend < 0 ? <TrendingDown className="h-4 w-4 text-emerald-500" /> :
                             phqTrend > 0 ? <TrendingUp className="h-4 w-4 text-destructive" /> :
                             <Minus className="h-4 w-4 text-muted-foreground" />}
                            {latestPhq?.screening_score ?? "—"}
                          </span>
                        }
                      />
                    </div>
                    <div className="card-calm">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Pre-session summary</div>
                      <p className="text-sm leading-relaxed">{summaryParagraph}</p>
                    </div>
                    {hasSafety && (
                      <div className="card-calm border-destructive/40 bg-destructive/5">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <div className="text-sm">A safety flag was raised on a recent submission. Review under Tool responses.</div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="responses" className="mt-0 space-y-6">
                    {Object.keys(grouped).length === 0 && (
                      <div className="card-calm text-sm text-muted-foreground">No submissions yet.</div>
                    )}
                    {Object.entries(grouped).map(([key, list]) => (
                      <div key={key} className="card-calm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium">{getTool(key)?.name || key}</div>
                          <div className="text-xs text-muted-foreground">{list.length} entr{list.length === 1 ? "y" : "ies"}</div>
                        </div>
                        {key === "screening-phq9" || key === "screening-gad7" ? (
                          <PhqHeatmap list={list} questionCount={key === "screening-phq9" ? 9 : 7} />
                        ) : key === "thought-record" ? (
                          <ThoughtRecordTable list={list} />
                        ) : key === "homework" ? (
                          <HomeworkList list={list} />
                        ) : key === "emotion-diary" ? (
                          <EmotionTimeline list={list} />
                        ) : (
                          <GenericList list={list} />
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="mood" className="mt-0 space-y-4">
                    <div className="flex gap-2">
                      {[30, 60, 90].map((n) => (
                        <button
                          key={n}
                          onClick={() => setMoodRange(n as 30 | 60 | 90)}
                          className={`text-xs px-3 py-1.5 rounded-full border ${
                            moodRange === n ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"
                          }`}
                        >
                          {n} days
                        </button>
                      ))}
                    </div>
                    <div className="card-calm h-72">
                      {moodRows.length > 1 ? (
                        <Line data={moodChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom" as const } }, scales: { y: { beginAtZero: true } } }} />
                      ) : (
                        <div className="h-full grid place-items-center text-sm text-muted-foreground">Not enough mood entries yet.</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="screening" className="mt-0 space-y-4">
                    <ScreeningCard title="PHQ-9 (depression)" list={phqSubs} color="hsl(6 66% 46%)" zones={[[0,4,"minimal"],[5,9,"mild"],[10,14,"moderate"],[15,19,"mod. severe"],[20,27,"severe"]]} />
                    <ScreeningCard title="GAD-7 (anxiety)"    list={gadSubs} color="hsl(30 90% 44%)"  zones={[[0,4,"minimal"],[5,9,"mild"],[10,14,"moderate"],[15,21,"severe"]]} />
                  </TabsContent>

                  <TabsContent value="assign" className="mt-0">
                    <AssignmentBuilder
                      client={{ id: client.id, full_name: client.full_name, email: client.email, access_token: client.access_token }}
                      therapistName={therapistName}
                      onDone={() => { onOpenChange(false); onAssignmentSaved?.(); }}
                    />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="stat-card">
    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold mt-1">{value}</div>
  </div>
);

const daysSince = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d === 0 ? "Today" : `${d}d`;
};

const PhqHeatmap = ({ list, questionCount }: { list: Submission[]; questionCount: number }) => {
  const rows = list.slice().reverse();
  return (
    <div className="overflow-x-auto">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `72px repeat(${rows.length}, minmax(28px, 1fr))` }}>
        <div />
        {rows.map((s) => (
          <div key={s.id} className="text-[10px] text-muted-foreground text-center py-1 truncate">{fmtDate(s.submitted_at)}</div>
        ))}
        {Array.from({ length: questionCount }).map((_, qi) => (
          <>
            <div key={`q-${qi}`} className="text-[11px] text-muted-foreground py-1 pr-1">Q{qi + 1}</div>
            {rows.map((s) => {
              const ans = Array.isArray(s.payload?.answers) ? Number(s.payload.answers[qi] ?? 0) : 0;
              return (
                <div
                  key={`${s.id}-${qi}`}
                  className="h-6 rounded-sm text-[10px] grid place-items-center text-white/90"
                  style={{ background: heatColor(ans) }}
                  title={`Q${qi + 1} · ${fmtDate(s.submitted_at)} · ${ans}`}
                >
                  {ans}
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: heatColor(0) }} /> 0</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: heatColor(1) }} /> 1</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: heatColor(2) }} /> 2</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded" style={{ background: heatColor(3) }} /> 3</span>
      </div>
    </div>
  );
};

const ThoughtRecordTable = ({ list }: { list: Submission[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th className="py-1.5 pr-3">Date</th>
          <th className="py-1.5 pr-3">Situation</th>
          <th className="py-1.5 pr-3">Automatic thought</th>
          <th className="py-1.5 pr-3">Emotion</th>
          <th className="py-1.5 pr-3">Balanced thought</th>
        </tr>
      </thead>
      <tbody>
        {list.map((s) => {
          const p = s.payload || {};
          return (
            <tr key={s.id} className="border-t border-border">
              <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{fmtDate(s.submitted_at)}</td>
              <td className="py-2 pr-3">{p.situation || "—"}</td>
              <td className="py-2 pr-3">{p.automatic_thought || p.thought || "—"}</td>
              <td className="py-2 pr-3">
                {p.emotion ? (
                  <span className="inline-flex items-center gap-1">
                    <span>{p.emotion}</span>
                    {typeof p.intensity === "number" && (
                      <span
                        className="text-[10px] px-1.5 rounded-full text-white/95"
                        style={{ background: heatColor(Math.min(3, Math.floor(p.intensity / 34))) }}
                      >
                        {p.intensity}
                      </span>
                    )}
                  </span>
                ) : "—"}
              </td>
              <td className="py-2 pr-3">{p.balanced_thought || p.reframe || "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const HomeworkList = ({ list }: { list: Submission[] }) => (
  <div className="space-y-2">
    {list.map((s) => {
      const items = Array.isArray(s.payload?.items) ? s.payload.items : Array.isArray(s.payload?.tasks) ? s.payload.tasks : [];
      return (
        <details key={s.id} className="rounded-lg border border-border bg-card p-2">
          <summary className="cursor-pointer text-xs text-muted-foreground">{fmtDate(s.submitted_at)} — {items.length} task{items.length === 1 ? "" : "s"}</summary>
          <ul className="mt-2 space-y-1 text-sm">
            {items.map((it: any, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-1 h-3 w-3 rounded-sm border ${it.done || it.completed ? "bg-primary border-primary" : "border-border"}`} />
                <div>
                  <div>{typeof it === "string" ? it : it.text || it.title || ""}</div>
                  {it.reflection && <div className="text-xs text-muted-foreground italic">{it.reflection}</div>}
                </div>
              </li>
            ))}
          </ul>
        </details>
      );
    })}
  </div>
);

const EmotionTimeline = ({ list }: { list: Submission[] }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {list.slice().reverse().map((s) => (
      <div key={s.id} className="min-w-[140px] rounded-xl border border-border bg-card p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{fmtDate(s.submitted_at)}</div>
        <div className="font-medium text-sm mt-1">{s.payload?.emotion || "Emotion"}</div>
        <div className="text-xs text-muted-foreground">Intensity: {s.payload?.intensity ?? "—"}</div>
        {s.payload?.trigger && <div className="text-xs mt-1 line-clamp-3">{s.payload.trigger}</div>}
      </div>
    ))}
  </div>
);

const GenericList = ({ list }: { list: Submission[] }) => (
  <div className="space-y-2">
    {list.map((s) => (
      <details key={s.id} className="rounded-lg border border-border bg-card p-2">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          {fmtDate(s.submitted_at)}
          {s.screening_score != null && ` · Score ${s.screening_score}`}
          {s.mood_score != null && ` · Mood ${s.mood_score}`}
        </summary>
        <pre className="text-xs whitespace-pre-wrap mt-2">{JSON.stringify(s.payload, null, 2)}</pre>
      </details>
    ))}
  </div>
);

const ScreeningCard = ({ title, list, color, zones }: {
  title: string;
  list: Submission[];
  color: string;
  zones: [number, number, string][];
}) => {
  const rows = list.slice().reverse();
  const max = zones[zones.length - 1][1];
  const data = {
    labels: rows.map((s) => fmtDate(s.submitted_at)),
    datasets: [
      {
        label: title,
        data: rows.map((s) => s.screening_score),
        borderColor: color,
        backgroundColor: color + " 15%",
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };
  return (
    <div className="card-calm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {list.length} entr{list.length === 1 ? "y" : "ies"}
        </div>
      </div>
      {list.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6 text-center">No submissions yet.</div>
      ) : (
        <>
          <div className="h-52">
            <Line
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max } },
              }}
            />
          </div>
          <div className="mt-2 flex gap-2 flex-wrap text-[10px] text-muted-foreground">
            {zones.map(([a, b, label]) => (
              <span key={label} className="px-2 py-0.5 rounded-full bg-muted">
                {a}–{b} {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientDetailPanel;