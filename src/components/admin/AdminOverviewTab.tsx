import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Users, Calendar, DollarSign, AlertOctagon, Stethoscope, CheckCircle, Inbox, Moon, TrendingUp, Activity, UserPlus, Repeat, Building2 } from "lucide-react";
import { withTimeout } from "@/lib/rpcTimeout";

interface Stats {
  active_clients: number;
  new_clients: number;
  returning_clients: number;
  sessions_this_week: number;
  sessions_last_week: number;
  revenue_this_week_ugx: number;
  revenue_last_week_ugx: number;
  open_safety_flags: number;
  therapists_active: number;
  homework_completion_rate: number;
  new_enquiries_today: number;
  inactive_clients_7d: number;
  clients_needing_followup: number;
  sessions_today: number;
  crisis_sessions_this_month: number;
}

const fmtUGX = (n: number) => `UGX ${Math.round(n).toLocaleString()}`;
const trend = (curr: number, prev: number) => {
  if (!prev) return curr > 0 ? "+100%" : "—";
  const pct = Math.round(((curr - prev) / prev) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
};

const AdminOverviewTab = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrMsg(null);
    const { data, error } = await withTimeout<any>(
      supabase.rpc("admin_overview_stats" as any),
      20000,
      "Loading overview",
    );
    if (error) setErrMsg(error.message);
    else if (data) setStats(data as Stats);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!stats)
    return (
      <div className="py-10 text-center space-y-2">
        <p className="text-muted-foreground">Unable to load overview.</p>
        {errMsg && <p className="text-xs text-destructive">{errMsg}</p>}
        <Button variant="outline" size="sm" onClick={load}>Retry</Button>
      </div>
    );

  const firstName = (user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin").split(" ")[0];

  const cards = [
    { label: "Active Clients", value: stats.active_clients, icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { label: "New Clients", value: stats.new_clients ?? 0, icon: UserPlus, color: "text-sky-600 bg-sky-500/10" },
    { label: "Returning Clients", value: stats.returning_clients ?? 0, icon: Repeat, color: "text-fuchsia-600 bg-fuchsia-500/10" },
    { label: "Sessions This Week", value: stats.sessions_this_week, sub: `${trend(stats.sessions_this_week, stats.sessions_last_week)} vs last week`, icon: Calendar, color: "text-indigo-600 bg-indigo-500/10" },
    { label: "Revenue This Week", value: fmtUGX(stats.revenue_this_week_ugx), sub: `${trend(stats.revenue_this_week_ugx, stats.revenue_last_week_ugx)} vs last week`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Open Safety Flags", value: stats.open_safety_flags, icon: AlertOctagon, color: "text-red-600 bg-red-500/10", urgent: stats.open_safety_flags > 0 },
    { label: "Therapists Active", value: stats.therapists_active, icon: Stethoscope, color: "text-purple-600 bg-purple-500/10" },
    { label: "Homework Completion", value: `${stats.homework_completion_rate}%`, icon: CheckCircle, color: "text-teal-600 bg-teal-500/10" },
    { label: "New Enquiries Today", value: stats.new_enquiries_today, icon: Inbox, color: "text-amber-600 bg-amber-500/10" },
    { label: "Inactive 7+ Days", value: stats.inactive_clients_7d, icon: Moon, color: "text-slate-600 bg-slate-500/10" },
  ];

  const sections = [
    { key: "upcoming-sessions", title: "Upcoming sessions", desc: "Today and this week’s booked sessions — start here for the clinical day.", icon: Calendar, color: "from-violet-500/10 to-violet-600/5 border-violet-500/20" },
    { key: "sales-tracking", title: "WhatsApp sales", desc: "Paid booking pipeline from WhatsApp — money in motion.", icon: DollarSign, color: "from-green-500/10 to-green-600/5 border-green-500/20" },
    { key: "crisis-queue", title: "Crisis queue", desc: "Safety reviews that cannot wait. Open flags first.", icon: AlertOctagon, color: "from-red-500/10 to-red-600/5 border-red-500/20" },
    { key: "all-clients", title: "Client oversight", desc: "Every client, therapist, homework and safety flag in one place.", icon: Users, color: "from-blue-500/10 to-blue-600/5 border-blue-500/20" },
    { key: "session-logs", title: "Session logs", desc: "Every session logged by every therapist. Filter and follow up.", icon: Activity, color: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20" },
    { key: "enquiries", title: "Enquiries & leads", desc: "Amani chat, contact form, and WhatsApp callbacks in one feed.", icon: Inbox, color: "from-amber-500/10 to-amber-600/5 border-amber-500/20" },
    { key: "revenue", title: "Revenue & performance", desc: "Weekly revenue trend and therapist performance metrics.", icon: TrendingUp, color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20" },
  ];

  const externalTools = [
    {
      to: "/corporate-admin",
      title: "Corporate Wellbeing Admin",
      desc: "Manage companies, employees, and screening analytics (InnerSpark staff).",
      Icon: Building2,
      color: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    },
  ];

  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)" }}
      >
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">Today</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{hello}, {firstName}</h2>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              {stats.sessions_today} session{stats.sessions_today === 1 ? "" : "s"} logged today
              {stats.clients_needing_followup > 0 && ` · ${stats.clients_needing_followup} need follow-up`}
              {stats.open_safety_flags > 0 && ` · ${stats.open_safety_flags} safety flag${stats.open_safety_flags === 1 ? "" : "s"} open`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className={`rounded-full h-9 ${stats.open_safety_flags > 0 ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/15 hover:bg-white/25 text-white border-0"}`}
              onClick={() => onNavigate?.("crisis-queue")}
            >
              Crisis queue
            </Button>
            <Button size="sm" className="rounded-full h-9 bg-white/15 hover:bg-white/25 text-white border-0" onClick={() => onNavigate?.("upcoming-sessions")}>
              Upcoming
            </Button>
            <Button size="sm" className="rounded-full h-9 bg-white text-indigo-950 hover:bg-white/90" onClick={() => onNavigate?.("sales-tracking")}>
              Sales
            </Button>
          </div>
        </div>

        <div className="relative mt-7 grid sm:grid-cols-3 gap-3">
          {[
            { label: "Revenue this week", value: fmtUGX(stats.revenue_this_week_ugx), sub: `${trend(stats.revenue_this_week_ugx, stats.revenue_last_week_ugx)} vs last week`, go: "revenue", Icon: DollarSign },
            { label: "Sessions this week", value: String(stats.sessions_this_week), sub: `${stats.sessions_today} today · ${trend(stats.sessions_this_week, stats.sessions_last_week)} vs last week`, go: "upcoming-sessions", Icon: Calendar },
            { label: "Open safety flags", value: String(stats.open_safety_flags), sub: stats.open_safety_flags > 0 ? "Needs attention" : "All clear", go: "crisis-queue", Icon: AlertOctagon, urgent: stats.open_safety_flags > 0 },
          ].map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={() => onNavigate?.(k.go)}
              className={`text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition-colors ${k.urgent ? "ring-1 ring-red-400/60" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-white/55">{k.label}</span>
                <k.Icon className="h-4 w-4 text-white/80" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight truncate">{k.value}</p>
              <p className="text-[11px] text-white/50 mt-1">{k.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Snapshot</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className={`rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow ${c.urgent ? "border-red-500/40" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground mb-1.5 truncate font-medium">{c.label}</p>
                    <p className="text-xl md:text-2xl font-bold tracking-tight truncate">{c.value}</p>
                    {c.sub && <p className="text-[10px] text-muted-foreground mt-1">{c.sub}</p>}
                  </div>
                  <div className={`p-2 rounded-xl shrink-0 ${c.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Jump to</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onNavigate?.(s.key)}
                className={`group text-left rounded-2xl border bg-gradient-to-br ${s.color} p-5 hover:shadow-md transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-background/70 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{s.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
          {externalTools.map((t) => {
            const Icon = t.Icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`group text-left rounded-2xl border bg-gradient-to-br ${t.color} p-5 hover:shadow-md transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-background/70 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{t.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{t.desc}</p>
                    <p className="text-xs text-primary mt-2 font-medium">{t.to}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;