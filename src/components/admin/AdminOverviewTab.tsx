import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Calendar, DollarSign, AlertOctagon, Stethoscope, CheckCircle, Inbox, Moon, TrendingUp, Activity } from "lucide-react";

interface Stats {
  active_clients: number;
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

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("admin_overview_stats" as any);
      if (!error && data) setStats(data as Stats);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!stats) return <p className="text-muted-foreground py-8 text-center">Unable to load overview.</p>;

  const firstName = (user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin").split(" ")[0];

  const cards = [
    { label: "Active Clients", value: stats.active_clients, icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { label: "Sessions This Week", value: stats.sessions_this_week, sub: `${trend(stats.sessions_this_week, stats.sessions_last_week)} vs last week`, icon: Calendar, color: "text-indigo-600 bg-indigo-500/10" },
    { label: "Revenue This Week", value: fmtUGX(stats.revenue_this_week_ugx), sub: `${trend(stats.revenue_this_week_ugx, stats.revenue_last_week_ugx)} vs last week`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Open Safety Flags", value: stats.open_safety_flags, icon: AlertOctagon, color: "text-red-600 bg-red-500/10", urgent: stats.open_safety_flags > 0 },
    { label: "Therapists Active", value: stats.therapists_active, icon: Stethoscope, color: "text-purple-600 bg-purple-500/10" },
    { label: "Homework Completion", value: `${stats.homework_completion_rate}%`, icon: CheckCircle, color: "text-teal-600 bg-teal-500/10" },
    { label: "New Enquiries Today", value: stats.new_enquiries_today, icon: Inbox, color: "text-amber-600 bg-amber-500/10" },
    { label: "Inactive 7+ Days", value: stats.inactive_clients_7d, icon: Moon, color: "text-slate-600 bg-slate-500/10" },
  ];

  const sections = [
    { key: "all-clients", title: "Client Oversight", desc: "Read-only view of every client, their therapist, homework and safety flags.", icon: Users, color: "from-blue-500/10 to-blue-600/5 border-blue-500/20" },
    { key: "session-logs", title: "Session Logs", desc: "Every session logged by every therapist. Filter, follow up, spot crises.", icon: Activity, color: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20" },
    { key: "enquiries", title: "Enquiries & Leads", desc: "Amani chat, contact form, and WhatsApp callback requests in one feed.", icon: Inbox, color: "from-amber-500/10 to-amber-600/5 border-amber-500/20" },
    { key: "revenue", title: "Revenue & Performance", desc: "Weekly revenue trend and therapist performance metrics.", icon: TrendingUp, color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back, {firstName}</h2>
        <p className="text-sm text-muted-foreground">
          {stats.sessions_today} session{stats.sessions_today === 1 ? "" : "s"} logged today
          {stats.clients_needing_followup > 0 && ` · ${stats.clients_needing_followup} client${stats.clients_needing_followup === 1 ? "" : "s"} need follow-up`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className={c.urgent ? "border-red-500/40" : ""}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 truncate">{c.label}</p>
                    <p className="text-xl md:text-2xl font-bold truncate">{c.value}</p>
                    {c.sub && <p className="text-[10px] text-muted-foreground mt-1">{c.sub}</p>}
                  </div>
                  <div className={`p-2 rounded-lg ${c.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => onNavigate?.(s.key)}
              className={`text-left rounded-xl border bg-gradient-to-br ${s.color} p-5 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-background/60">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverviewTab;