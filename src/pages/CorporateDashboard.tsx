import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, ShieldCheck, Users, Activity, TrendingUp, AlertTriangle,
  CalendarDays, BookOpen, Send, Lock,
} from "lucide-react";
import { toast } from "sonner";

const CONSENT_VERSION = "corporate-dashboard-v1";
const MIN_GROUP = 5;
const CONSENT_RENEW_DAYS = 365;

const WHO5_LABELS = [
  "Cheerful and in good spirits",
  "Calm and relaxed",
  "Active and vigorous",
  "Fresh and rested",
  "Daily life filled with things that interest me",
] as const;

type AdminRow = {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  must_change_password: boolean;
  consent_accepted_at: string | null;
  consent_version: string | null;
};

type Driver = { dimension: string; avg_score: number | null };
type Phase = {
  id: string; name: string; phase_label: string; starts_at: string;
  status: string; is_off_cycle: boolean; completed: number; avg_percentage: number | null;
};
type Training = {
  id: string; title: string; module_code: string | null; scheduled_at: string | null;
  completed_at: string | null; status: string; attendees_count: number | null; notes: string | null;
};
type RoundMeta = {
  id: string; name: string; phase_label: string; starts_at: string;
  ends_at: string | null; status: string; is_off_cycle: boolean;
};

type DashStats = {
  company_name: string | null;
  enrolled: number;
  context_notes: string | null;
  min_group: number;
  latest_round: { id: string; name: string; phase_label: string; starts_at: string; status: string } | null;
  completed: number;
  participation_rate: number | null;
  can_show_breakdown: boolean;
  avg_percentage: number | null;
  avg_who5?: number | null;
  risk: { low: number; moderate: number; high: number } | null;
  drivers: Driver[];
  phases: Phase[];
  trainings?: Training[];
  rounds?: RoundMeta[];
};

type ServiceRec = {
  code: string;
  title: string;
  why: string;
  requestType: "screening" | "training" | "eap" | "other";
};

function needsConsentRenewal(admin: AdminRow): boolean {
  if (!admin.consent_accepted_at || admin.consent_version !== CONSENT_VERSION) return true;
  const accepted = new Date(admin.consent_accepted_at).getTime();
  const ageDays = (Date.now() - accepted) / (1000 * 60 * 60 * 24);
  return ageDays >= CONSENT_RENEW_DAYS;
}

function buildRecommendations(stats: DashStats): ServiceRec[] {
  const recs: ServiceRec[] = [];
  if (!stats.can_show_breakdown || !stats.risk) {
    recs.push({
      code: "WHO5_ROUND",
      title: "Schedule a WHO-5 screening round",
      why: "Once enough people complete a private screening, you will see organisation-wide patterns here.",
      requestType: "screening",
    });
    return recs;
  }

  const total = stats.risk.low + stats.risk.moderate + stats.risk.high || 1;
  const highShare = stats.risk.high / total;
  const modShare = stats.risk.moderate / total;

  if (highShare >= 0.25) {
    recs.push({
      code: "SPARK_STRESS",
      title: "S.P.A.R.K stress & workload module",
      why: "A larger share of the organisation sits in the higher-concern band this phase. A facilitated team session can help managers respond without targeting individuals.",
      requestType: "training",
    });
    recs.push({
      code: "EAP_ACCESS",
      title: "Confidential EAP / therapy pathway reminder",
      why: "Remind staff that individual support stays private and separate from this dashboard.",
      requestType: "eap",
    });
  } else if (modShare + highShare >= 0.4) {
    recs.push({
      code: "SPARK_RESILIENCE",
      title: "S.P.A.R.K resilience & recovery module",
      why: "Moderate concern is elevated organisation-wide. A short skills session often fits better than waiting for the next quarterly screen alone.",
      requestType: "training",
    });
  }

  const lowest = [...(stats.drivers || [])].filter((d) => d.avg_score != null).slice(0, 2);
  lowest.forEach((d) => {
    if (d.dimension.toLowerCase().includes("calm")) {
      recs.push({
        code: "SPARK_CALM",
        title: "S.P.A.R.K calm under pressure module",
        why: `"${d.dimension}" is among the lowest-scoring WHO-5 areas organisation-wide this phase.`,
        requestType: "training",
      });
    } else if (d.dimension.toLowerCase().includes("rested") || d.dimension.toLowerCase().includes("active")) {
      recs.push({
        code: "SPARK_ENERGY",
        title: "S.P.A.R.K energy & recovery module",
        why: `"${d.dimension}" is trending lower across completed screens — a common pattern under sustained workload.`,
        requestType: "training",
      });
    } else if (d.dimension.toLowerCase().includes("interest") || d.dimension.toLowerCase().includes("cheerful")) {
      recs.push({
        code: "SPARK_ENGAGE",
        title: "S.P.A.R.K engagement & meaning module",
        why: `"${d.dimension}" scored lower organisation-wide. Training can open a safe conversation without individual attribution.`,
        requestType: "training",
      });
    }
  });

  recs.push({
    code: "WHO5_NEXT",
    title: "Next quarterly WHO-5 screening",
    why: "Default cadence is about every 3 months. You can also request an off-cycle round if something major changed at work.",
    requestType: "screening",
  });

  // de-dupe by code
  const seen = new Set<string>();
  return recs.filter((r) => (seen.has(r.code) ? false : (seen.add(r.code), true))).slice(0, 4);
}

function interpretiveNotes(stats: DashStats): string[] {
  const notes: string[] = [];
  if (!stats.can_show_breakdown) {
    notes.push(
      "There are not enough completed private screens yet to interpret patterns without risking individual identification. This is intentional privacy protection — not a lack of care."
    );
    return notes;
  }

  notes.push(
    "These notes describe organisation-level patterns only. They are not a diagnosis of any person, team or department."
  );

  if (stats.risk) {
    const total = stats.risk.low + stats.risk.moderate + stats.risk.high || 1;
    if (stats.risk.high / total >= 0.2) {
      notes.push(
        "A noticeable share of responses sit in the higher-concern band. That often shows up during peak delivery periods, restructuring, or when rest has been scarce — still without telling you who."
      );
    } else if (stats.risk.low / total >= 0.6) {
      notes.push(
        "Most completed screens sit in the lower-concern band. Keep the confidential support pathway visible so people who do need help can still reach it quietly."
      );
    } else {
      notes.push(
        "Results are mixed across concern bands, which is common in working populations. Look at trends across phases rather than any single round."
      );
    }
  }

  if (stats.drivers?.length) {
    const lowest = stats.drivers[0];
    if (lowest?.dimension) {
      notes.push(
        `The lowest average WHO-5 area this phase is “${lowest.dimension}”. Treat that as a workplace conversation starter (workload, recovery, psychological safety) — not as a clinical label.`
      );
    }
  }

  if (stats.context_notes?.trim()) {
    notes.push(`Context you shared with InnerSpark: ${stats.context_notes.trim()}`);
  } else {
    notes.push(
      "If your organisation recently had a restructure, deadline surge or leadership change, tell InnerSpark so future interpretive notes can reflect that general context."
    );
  }

  if (stats.participation_rate != null && stats.participation_rate < 40) {
    notes.push(
      "Participation is still relatively low. Aggregate scores can shift a lot as more people complete the private screen — avoid over-reading early rounds."
    );
  }

  return notes;
}

function RiskBars({ risk }: { risk: { low: number; moderate: number; high: number } }) {
  const total = Math.max(1, risk.low + risk.moderate + risk.high);
  const rows = [
    { key: "Low concern", n: risk.low, color: "#2E7D5E" },
    { key: "Moderate concern", n: risk.moderate, color: "#F59E0B" },
    { key: "Higher concern", n: risk.high, color: "#DC2626" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const pct = Math.round((r.n / total) * 100);
        return (
          <div key={r.key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{r.key}</span>
              <span className="text-muted-foreground">{r.n} · {pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: r.color }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground pt-1">Counts are organisation-wide only. No names, teams or individuals.</p>
    </div>
  );
}

function PhaseTrend({ phases, minGroup }: { phases: Phase[]; minGroup: number }) {
  if (!phases?.length) {
    return <p className="text-sm text-muted-foreground">No screening phases yet. Request a first WHO-5 round below.</p>;
  }
  const max = Math.max(100, ...phases.map((p) => p.avg_percentage || 0));
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 h-40">
        {phases.map((p) => {
          const show = p.completed >= minGroup && p.avg_percentage != null;
          const h = show ? Math.max(8, (Number(p.avg_percentage) / max) * 100) : 8;
          return (
            <div key={p.id} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {show ? `${p.avg_percentage}%` : "—"}
              </span>
              <div
                className="w-full rounded-t-md"
                style={{ height: `${h}%`, background: show ? "linear-gradient(180deg,#3B4FD4,#6366F1)" : "#E5E7EB", boxShadow: show ? "0 8px 16px rgba(59,79,212,0.25)" : undefined }}
                title={show ? `${p.phase_label}: ${p.avg_percentage}%` : `Privacy hold (<${minGroup} responses)`}
              />
              <span className="text-[10px] text-center text-muted-foreground leading-tight">{p.phase_label}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Average WHO-5 percentage by phase. Phases with fewer than {minGroup} completed private screens stay hidden.
      </p>
    </div>
  );
}

export default function CorporateDashboard() {
  const { user, signIn, signOut, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState<AdminRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [stats, setStats] = useState<DashStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [requestType, setRequestType] = useState<"screening" | "training" | "eap" | "other">("screening");
  const [requestNote, setRequestNote] = useState("");
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadAdmin = async () => {
    if (!user) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_hr_admins" as any)
      .select("id,company_id,full_name,email,must_change_password,consent_accepted_at,consent_version")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (error) toast.error(error.message);
    setAdmin((data as any) || null);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmin();
  }, [user?.id]);

  const loadStats = async () => {
    if (!admin?.company_id || needsConsentRenewal(admin)) return;
    setStatsLoading(true);
    const { data, error } = await supabase.rpc("get_company_hr_dashboard_stats" as any, {
      _company_id: admin.company_id,
      _min_group: MIN_GROUP,
    });
    if (error) {
      // Tables/RPC may not be applied yet on this environment
      setStats({
        company_name: null,
        enrolled: 0,
        context_notes: null,
        min_group: MIN_GROUP,
        latest_round: null,
        completed: 0,
        participation_rate: null,
        can_show_breakdown: false,
        avg_percentage: null,
        risk: null,
        drivers: [],
        phases: [],
        trainings: [],
        rounds: [],
      });
      if (!/does not exist|schema cache|not authorized/i.test(error.message)) {
        toast.error(error.message);
      }
    } else {
      const d = data as any;
      setStats({
        ...d,
        avg_percentage: d.avg_percentage ?? d.avg_who5 ?? null,
        phases: (d.phases || []).map((p: any) => ({
          id: p.id || p.period,
          name: p.name || p.period,
          phase_label: p.phase_label || p.period,
          starts_at: p.starts_at || p.period,
          status: p.status || "completed",
          is_off_cycle: !!p.is_off_cycle,
          completed: p.completed || 0,
          avg_percentage: p.avg_percentage ?? p.avg_who5 ?? null,
        })),
        trainings: d.trainings || [],
        rounds: d.rounds || [],
      } as DashStats);
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, [admin?.company_id, admin?.consent_accepted_at, admin?.consent_version]);

  const recommendations = useMemo(() => (stats ? buildRecommendations(stats) : []), [stats]);
  const notes = useMemo(() => (stats ? interpretiveNotes(stats) : []), [stats]);

  const acceptConsent = async () => {
    if (!admin || !consentChecked) return;
    const { error } = await supabase
      .from("corporate_hr_admins" as any)
      .update({
        consent_accepted_at: new Date().toISOString(),
        consent_version: CONSENT_VERSION,
      })
      .eq("id", admin.id);
    if (error) return toast.error(error.message);
    toast.success("Consent recorded");
    loadAdmin();
  };

  const changePassword = async () => {
    if (newPassword.length < 8) return toast.error("Use at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return toast.error(error.message);
    await supabase
      .from("corporate_hr_admins" as any)
      .update({ must_change_password: false })
      .eq("id", admin!.id);
    setNewPassword("");
    toast.success("Password updated");
    loadAdmin();
  };

  const submitRequest = async (preset?: ServiceRec) => {
    if (!admin) return;
    const type = preset?.requestType || requestType;
    const code = preset?.code || requestCode;
    const message =
      (preset ? `${preset.title}\n\n${preset.why}\n\n` : "") +
      (requestNote.trim() || (preset ? "Please contact us to arrange this." : ""));
    if (!message.trim()) return toast.error("Add a short note about what you need");

    setSending(true);
    const { error } = await supabase.from("corporate_hr_service_requests" as any).insert({
      company_id: admin.company_id,
      admin_id: admin.id,
      request_type: type,
      service_code: code,
      message: message.trim(),
    });

    await supabase.functions
      .invoke("notify-chat-event", {
        body: {
          kind: "corporate_service_request",
          source_path: "/corporate-dashboard",
          name: admin.full_name,
          email: admin.email,
          message: `[${type}${code ? ` / ${code}` : ""}] ${message.trim()}`,
        },
      })
      .catch(() => null);

    setSending(false);
    if (error && !/does not exist|schema cache/i.test(error.message)) {
      return toast.error(error.message);
    }
    toast.success("Request sent to the InnerSpark team");
    setRequestNote("");
    setRequestCode(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: "linear-gradient(180deg,#F5F6FF,#FFF8F0)" }}>
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#3B4FD4" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-6" style={{ background: "linear-gradient(165deg,#EEF2FF 0%,#F8FAFC 45%,#FFF7ED 100%)" }}>
        <Helmet>
          <title>Corporate Wellbeing Dashboard | InnerSpark</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-3xl">
          <div className="px-8 pt-8 pb-5 text-white" style={{ background: "linear-gradient(135deg,#1e1b4b,#3B4FD4 55%,#1e3a5f)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mb-2">Company HR</p>
            <h1 className="text-2xl font-bold tracking-tight">Wellbeing dashboard</h1>
            <p className="text-sm text-white/75 mt-2 leading-relaxed">
              Aggregate patterns only — never individual employee answers. Separate from client and therapist logins.
            </p>
          </div>
          <CardContent className="space-y-4 p-8">
            <div className="space-y-1.5">
              <Label>Work email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11 rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && document.getElementById("corp-hr-login")?.click()}
              />
            </div>
            <Button
              id="corp-hr-login"
              className="w-full h-11 text-white rounded-xl"
              style={{ background: "#F2994A" }}
              onClick={async () => {
                const { error } = await signIn(email.trim().toLowerCase(), password);
                if (error) toast.error(error.message);
              }}
            >
              Sign in
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">Demo: hr@demo.innerspark.local</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="py-10 text-center space-y-3">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="font-semibold">No company dashboard is linked to this login.</p>
            <p className="text-sm text-muted-foreground">
              Ask InnerSpark to create a corporate admin account for your organisation. Individual client and therapist
              accounts cannot open this view.
            </p>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (admin.must_change_password) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Set your permanent password</CardTitle>
            <CardDescription>Required before you can open organisation results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="password"
              placeholder="New password (8+ characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button className="w-full" onClick={changePassword}>
              Save password
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsConsentRenewal(admin)) {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-muted/20">
        <Helmet>
          <title>Data-use consent | Corporate Dashboard</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Card className="max-w-2xl w-full shadow-xl border-0 overflow-hidden">
          <div className="h-1.5 w-full" style={{ background: "#2E7D5E" }} />
          <CardHeader className="bg-[#F8F9FF]">
            <CardTitle className="flex items-center gap-2" style={{ color: "#1A1A2E" }}>
              <ShieldCheck className="h-5 w-5" style={{ color: "#2E7D5E" }} /> Company data-use consent
            </CardTitle>
            <CardDescription>
              You must accept this before viewing any aggregate wellbeing results. Consent is re-confirmed at least yearly
              or when the dashboard agreement version changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6">
            <p className="font-medium">As a company admin for this organisation, you agree that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You will not attempt to identify individual employees from aggregate data</li>
              <li>You will not use the data punitively against any employee</li>
              <li>Individual employee responses are never shown in this dashboard</li>
              <li>
                Breakdowns (risk distribution, stress drivers, segmented views) only appear when at least {MIN_GROUP}{" "}
                people have completed a private screen — below that, privacy holds
              </li>
              <li>
                Interpretive notes are organisational context only and are not clinical or diagnostic conclusions about
                any person or group
              </li>
            </ul>
            <div className="flex items-start gap-3 rounded-md border p-4 bg-background">
              <Checkbox
                checked={consentChecked}
                onCheckedChange={(v) => setConsentChecked(v === true)}
                id="corp-consent"
              />
              <Label htmlFor="corp-consent" className="font-normal leading-relaxed">
                I have read and accept these terms. I understand I cannot access the dashboard without this agreement.
              </Label>
            </div>
            <div className="flex gap-2">
              <Button disabled={!consentChecked} onClick={acceptConsent} className="text-white" style={{ background: consentChecked ? "#3B4FD4" : undefined }}>
                Continue to dashboard
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canShow = !!stats?.can_show_breakdown;
  const minG = stats?.min_group ?? MIN_GROUP;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#EEF2FF 0%,#FFFFFF 35%,#FFF8F0 100%)" }}>
      <Helmet>
        <title>
          {(stats?.company_name ? `${stats.company_name} · ` : "") + "Corporate Wellbeing Dashboard | InnerSpark"}
        </title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-md" style={{ borderColor: "#E6E8FA" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl grid place-items-center text-white text-xs font-bold shrink-0" style={{ background: "#3B4FD4" }}>IS</div>
            <span className="font-semibold text-sm truncate" style={{ color: "#1A1A2E" }}>
              InnerSpark <span className="font-normal text-muted-foreground">· Company HR</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#EEF0FD", color: "#3B4FD4" }}>
              <Lock className="h-3 w-3" /> Aggregate only
            </span>
            <Button variant="outline" size="sm" className="rounded-xl h-8" onClick={() => signOut()}>Sign out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e3a5f 100%)", borderColor: "transparent" }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">Company admin · aggregate only</p>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                {stats?.company_name || "Corporate wellbeing"}
              </h1>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                Welcome, {admin.full_name}. Individual employee answers are never shown here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/corporate-assessments"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-indigo-950 bg-white hover:bg-white/90 transition"
              >
                Psychometric assessments
              </a>
            </div>
          </div>
          <div className="relative mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Enrolled", value: stats?.enrolled ?? "—", Icon: Users },
              { label: "Completed screens", value: stats?.completed ?? 0, Icon: Activity },
              { label: "Participation", value: stats?.participation_rate != null ? `${stats.participation_rate}%` : "—", Icon: TrendingUp },
              { label: "Avg WHO-5 %", value: canShow && stats?.avg_percentage != null ? `${stats.avg_percentage}%` : "—", Icon: ShieldCheck, hint: !canShow ? `Hidden until ${minG}+` : undefined },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-white/55">{k.label}</span>
                  <k.Icon className="h-3.5 w-3.5 text-white/70" />
                </div>
                <p className="text-2xl font-bold tracking-tight">{k.value}</p>
                {k.hint && <p className="text-[10px] text-white/45 mt-1">{k.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* legacy header removed — hero above */}
        <div className="hidden">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-1" style={{ color: "#3B4FD4" }}>Company admin · aggregate only</p>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: "#1A1A2E" }}>
              {stats?.company_name || "Corporate wellbeing"}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/corporate-assessments"
                className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "#F2994A" }}
              >
                Psychometric assessments
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {admin.full_name}. Individual employee answers are never shown here.
            </p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>

        {statsLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading organisation aggregates…
          </div>
        )}

        {/* Org basics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Enrolled
              </div>
              <p className="text-3xl font-bold mt-1">{stats?.enrolled ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> Completed (latest phase)
              </div>
              <p className="text-3xl font-bold mt-1">{stats?.completed ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Participation
              </div>
              <p className="text-3xl font-bold mt-1">
                {stats?.participation_rate != null ? `${stats.participation_rate}%` : "—"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> Avg WHO-5 %
              </div>
              <p className="text-3xl font-bold mt-1">
                {canShow && stats?.avg_percentage != null ? `${stats.avg_percentage}%` : "—"}
              </p>
              {!canShow && (
                <p className="text-[11px] text-muted-foreground mt-1">Hidden until {minG}+ responses</p>
              )}
            </CardContent>
          </Card>
        </div>

        {stats?.latest_round && (
          <p className="text-xs text-muted-foreground">
            Latest phase: <strong>{stats.latest_round.phase_label}</strong> ({stats.latest_round.name}) ·{" "}
            {stats.latest_round.status}
          </p>
        )}

        {/* Risk distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Risk distribution
            </CardTitle>
            <CardDescription>
              Organisation-wide concern bands from completed WHO-5 screens. Never individual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canShow && stats?.risk ? (
              <RiskBars risk={stats.risk} />
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground bg-background">
                Not enough responses yet to show this breakdown while protecting individual privacy (minimum {minG} completed private screens).
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phase trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Average wellbeing by screening phase
            </CardTitle>
            <CardDescription>
              Default cadence is about every 3 months. Off-cycle rounds can be requested below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhaseTrend phases={stats?.phases || []} minGroup={minG} />
          </CardContent>
        </Card>

        {/* Stress drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Key stress drivers — what the data shows</CardTitle>
            <CardDescription>
              Lowest average WHO-5 dimensions organisation-wide this phase (patterns only).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canShow && stats?.drivers?.length ? (
              <ul className="space-y-3">
                {stats.drivers.map((d, i) => (
                  <li key={d.dimension} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 text-muted-foreground">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{d.dimension}</span>
                        <span className="text-muted-foreground">
                          avg {d.avg_score != null ? Number(d.avg_score).toFixed(2) : "—"} / 5
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80"
                          style={{ width: `${Math.min(100, ((Number(d.avg_score) || 0) / 5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                Not enough responses yet to show this breakdown while protecting individual privacy.
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              WHO-5 areas: {WHO5_LABELS.join(" · ")}.
            </p>
          </CardContent>
        </Card>

        {/* Why these results make sense */}
        <Card>
          <CardHeader>
            <CardTitle>Why these results make sense</CardTitle>
            <CardDescription>Plain-language organisational context — not a clinical conclusion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.map((n) => (
              <p key={n.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
                {n}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Recommended services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Recommended InnerSpark services
            </CardTitle>
            <CardDescription>Based on aggregate risk and stress drivers. Request routes to our team — not auto-booked.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {recommendations.map((r) => (
              <div key={r.code} className="rounded-xl border p-4 bg-background space-y-3">
                <p className="font-semibold text-sm">{r.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.why}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={sending}
                  onClick={() => {
                    setRequestType(r.requestType);
                    setRequestCode(r.code);
                    setRequestNote(`Request: ${r.title}`);
                    submitRequest(r);
                  }}
                >
                  Request this
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4" /> Screening activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(stats?.rounds || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No screening rounds scheduled yet.</p>
              )}
              {(stats?.rounds || []).map((r) => (
                <div key={r.id} className="flex justify-between gap-2 text-sm border-b last:border-0 py-2">
                  <div>
                    <p className="font-medium">{r.phase_label}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.name}
                      {r.is_off_cycle ? " · off-cycle" : ""}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="capitalize">{r.status}</p>
                    <p>{r.starts_at}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" /> S.P.A.R.K / training activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(stats?.trainings || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No training sessions logged yet.</p>
              )}
              {(stats?.trainings || []).map((t) => (
                <div key={t.id} className="flex justify-between gap-2 text-sm border-b last:border-0 py-2">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.module_code || "Training"}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="capitalize">{t.status}</p>
                    <p>{t.scheduled_at ? new Date(t.scheduled_at).toLocaleDateString() : "TBC"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Request form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" /> Request a screening or training session
            </CardTitle>
            <CardDescription>
              Submits to the InnerSpark team. Not a fully automated booking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["screening", "New / off-cycle screening"],
                  ["training", "S.P.A.R.K training"],
                  ["eap", "EAP / therapy pathway"],
                  ["other", "Other"],
                ] as const
              ).map(([val, label]) => (
                <Button
                  key={val}
                  type="button"
                  size="sm"
                  variant={requestType === val ? "default" : "outline"}
                  onClick={() => setRequestType(val)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Textarea
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Tell us what you need — timing, audience size, preferred module, off-cycle reason…"
              rows={4}
            />
            <Button disabled={sending} onClick={() => submitRequest()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send request to InnerSpark
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Privacy: individual responses stay locked. Consent version {CONSENT_VERSION}.
        </p>
      </div>
    </div>
  );
}
