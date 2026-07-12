import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserPlus, Copy, AlertCircle, Users, CalendarCheck, ShieldAlert, Activity } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import MiniSparkline from "./MiniSparkline";
import ClientDetailPanel from "./ClientDetailPanel";

interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  presenting_concern: string | null;
  access_token: string;
  created_at: string;
  last_seen_at?: string | null;
  active_tools?: number;
  overdue_tools?: number;
  open_alerts?: number;
  week_activity?: Array<{ date: string; completed: number }>;
}

interface Props {
  therapistId: string;
  therapistName: string;
}

const timeAgo = (iso?: string | null) => {
  if (!iso) return "No visits yet";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Active today";
  if (d === 1) return "1 day ago";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

const initials = (name: string) =>
  name.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

const riskFor = (c: Client): "red" | "amber" | "green" => {
  if ((c.open_alerts || 0) > 0) return "red";
  if ((c.overdue_tools || 0) > 0) return "amber";
  return "green";
};

const RING_R = 18;
const CIRC = 2 * Math.PI * RING_R;
const Ring = ({ pct, color = "hsl(var(--primary))" }: { pct: number; color?: string }) => {
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * CIRC;
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle cx={22} cy={22} r={RING_R} stroke="hsl(var(--muted))" strokeWidth={4} fill="none" />
      <circle
        cx={22} cy={22} r={RING_R} fill="none"
        stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${dash} ${CIRC}`}
        transform="rotate(-90 22 22)"
      />
      <text x={22} y={26} textAnchor="middle" fontSize={11} fill="hsl(var(--foreground))" fontWeight={600}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
};

const ClientRoster = ({ therapistId, therapistName }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", presenting_concern: "" });
  const [detailFor, setDetailFor] = useState<Client | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("therapist_client_overview" as any);
    if (error) toast.error(error.message);
    setClients(((data as unknown) as Client[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [therapistId]);

  const needsAttention = useMemo(
    () => clients.filter((c) => (c.overdue_tools || 0) > 0 || (c.open_alerts || 0) > 0),
    [clients],
  );

  const sorted = useMemo(() => {
    const order = { red: 0, amber: 1, green: 2 } as const;
    return [...clients].sort((a, b) => order[riskFor(a)] - order[riskFor(b)]);
  }, [clients]);

  const stats = useMemo(() => {
    const totalActive = clients.length;
    const alerts = clients.reduce((n, c) => n + (c.open_alerts || 0), 0);
    const totalActiveTools = clients.reduce((n, c) => n + (c.active_tools || 0), 0);
    const weekCompleted = clients.reduce(
      (n, c) => n + (c.week_activity || []).reduce((a, d) => a + (d.completed || 0), 0),
      0,
    );
    // completion rate: this week's completions / (7 * total active tools) as a light proxy
    const target = totalActiveTools * 7 || 1;
    const completionPct = Math.min(100, Math.round((weekCompleted / target) * 100));
    // "sessions today" proxy: clients with any activity today
    const today = clients.filter((c) => {
      const last = c.week_activity?.[c.week_activity.length - 1];
      return last && last.completed > 0;
    }).length;
    return { totalActive, alerts, completionPct, today };
  }, [clients]);

  const newSubmissions = clients.filter((c) => {
    if (!c.last_seen_at) return false;
    return Date.now() - new Date(c.last_seen_at).getTime() < 86400000;
  }).length;

  const hour = new Date().getHours();
  const timeGreeting = hour < 5 ? "Hello" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const addClient = async () => {
    if (!form.full_name.trim()) return toast.error("Client name required.");
    setBusy(true);
    const { error } = await supabase.from("therapist_clients").insert({
      therapist_id: therapistId,
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      presenting_concern: form.presenting_concern.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setForm({ full_name: "", email: "", phone: "", presenting_concern: "" });
    setAddOpen(false);
    toast.success("Client added.");
    load();
  };

  const copyLink = async (c: Client) => {
    const url = `${window.location.origin}/my-progress/${c.access_token}`;
    const ok = await copyToClipboard(url);
    if (ok) toast.success("Private link copied");
    else toast.error("Couldn't copy — please copy manually.");
  };

  const openDetail = (c: Client) => { setDetailFor(c); setDetailOpen(true); };

  return (
    <div className="space-y-6">
      {/* Welcome gradient header */}
      <div className="gradient-header fade-in-calm">
        <div className="text-sm opacity-80">{timeGreeting},</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-0.5">
          {therapistName.split(" ")[0]} <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm sm:text-base opacity-90 mt-2 leading-relaxed max-w-2xl">
          {clients.length === 0
            ? "Add your first client to start tracking their progress between sessions."
            : `You have ${clients.length} active client${clients.length === 1 ? "" : "s"}` +
              (newSubmissions ? ` and ${newSubmissions} with new submissions today.` : ".")}
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard accent="" icon={<Users className="h-4 w-4 text-primary" />} label="Active clients" value={stats.totalActive} />
        <StatCard accent="accent-teal" icon={<Activity className="h-4 w-4" style={{ color: "hsl(173 58% 39%)" }} />} label="Active this week" value={stats.today} />
        <StatCard
          accent="accent-green"
          icon={<CalendarCheck className="h-4 w-4 text-emerald-600" />}
          label="Homework completion"
          value={<div className="flex items-center gap-3"><Ring pct={stats.completionPct} color="hsl(var(--success))" /></div>}
        />
        <StatCard
          accent="accent-danger"
          icon={<ShieldAlert className="h-4 w-4" style={{ color: "hsl(var(--danger))" }} />}
          label="Safety flags"
          value={<span className={stats.alerts > 0 ? "text-destructive" : ""}>{stats.alerts}</span>}
        />
      </div>

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <div className="card-calm border-amber-400/40 bg-amber-500/5 fade-in-calm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-medium">Needs attention</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((c) => (
              <button
                key={"na-" + c.id}
                onClick={() => openDetail(c)}
                className="text-xs px-3 py-1.5 rounded-full bg-card border border-border hover:bg-accent transition-colors"
              >
                <span className="font-medium">{c.full_name.split(" ")[0]}</span>
                <span className="text-muted-foreground">
                  {" · "}
                  {(c.open_alerts || 0) > 0
                    ? `${c.open_alerts} alert${c.open_alerts! > 1 ? "s" : ""}`
                    : `${c.overdue_tools} overdue`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Roster header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Your clients</h2>
          <p className="text-sm text-muted-foreground">Sorted by risk. Tap a card for the full clinical view.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><UserPlus className="h-4 w-4 mr-2" /> Add client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a client</DialogTitle>
              <DialogDescription>Only you can see this client's information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Full name</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <Label>Email (optional)</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone / WhatsApp (optional)</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Presenting concern (optional)</Label>
                <Input value={form.presenting_concern} onChange={(e) => setForm({ ...form, presenting_concern: e.target.value })} />
              </div>
              <Button onClick={addClient} disabled={busy} className="w-full">
                {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="p-8 grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : sorted.length === 0 ? (
        <div className="card-calm text-center text-sm text-muted-foreground">
          No clients yet. Click "Add client" to get started.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((c) => {
            const active = c.active_tools || 0;
            const overdue = c.overdue_tools || 0;
            const alerts = c.open_alerts || 0;
            const risk = riskFor(c);
            const weekTotals = (c.week_activity || []).map((d) => d.completed || 0);
            const doneThisWeek = weekTotals.reduce((a, b) => a + b, 0);
            const targetThisWeek = active * 7 || Math.max(active, 1);
            const hwPct = Math.min(100, Math.round((doneThisWeek / targetThisWeek) * 100));
            return (
              <button
                key={c.id}
                onClick={() => openDetail(c)}
                className="card-calm hover-lift stagger-item text-left w-full"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold shrink-0">
                    {initials(c.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{c.full_name}</span>
                      <span className={`risk-dot risk-${risk}`} title={`${risk} risk`} />
                      {alerts > 0 && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                          Safety
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {c.presenting_concern || "No concern recorded"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Last check-in: {timeAgo(c.last_seen_at)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <MiniSparkline values={weekTotals.length ? weekTotals : [0, 0, 0, 0, 0, 0, 0]} />
                  <div className="text-right">
                    <div className={[
                      "text-xs font-medium",
                      hwPct >= 60 ? "text-emerald-600 dark:text-emerald-400" :
                      hwPct > 0 ? "text-amber-700 dark:text-amber-300" :
                      "text-destructive",
                    ].join(" ")}>
                      {doneThisWeek}/{targetThisWeek} done
                    </div>
                    {overdue > 0 && (
                      <div className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5">
                        {overdue} overdue
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    onClick={(e) => { e.stopPropagation(); copyLink(c); }}
                    role="button"
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border hover:bg-accent"
                  >
                    <Copy className="h-3 w-3" /> Copy link
                  </span>
                  <span className="text-xs text-primary ml-auto">View full analysis →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <ClientDetailPanel
        open={detailOpen}
        onOpenChange={setDetailOpen}
        client={detailFor}
        therapistName={therapistName}
        onAssignmentSaved={() => { setDetailOpen(false); load(); }}
      />
    </div>
  );
};

const StatCard = ({ accent, icon, label, value }: { accent: string; icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className={`stat-card ${accent}`}>
    <div className="flex items-center justify-between">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {icon}
    </div>
    <div className="text-2xl font-semibold mt-2">{value}</div>
  </div>
);

export default ClientRoster;