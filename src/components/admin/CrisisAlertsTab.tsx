import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertOctagon, Search, Copy, Loader2, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface CrisisAlert {
  id: string;
  alert_code: string | null;
  company_id: string;
  employee_id: string;
  screening_id: string | null;
  level: number;
  triggers: string[];
  status: string;
  notes: string | null;
  assigned_to: string | null;
  sla_deadline: string | null;
  outreach_attempts: any[];
  created_at: string;
  resolved_at: string | null;
}

const LEVEL_LABEL: Record<number, { label: string; cls: string }> = {
  1: { label: "SEVERE", cls: "bg-red-600 text-white" },
  2: { label: "URGENT", cls: "bg-amber-500 text-white" },
  3: { label: "MONITOR", cls: "bg-blue-500 text-white" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", cls: "bg-red-50 text-red-700" },
  { value: "in_progress", label: "In Progress", cls: "bg-amber-50 text-amber-700" },
  { value: "resolved", label: "Resolved", cls: "bg-green-50 text-green-700" },
  { value: "referred", label: "Referred", cls: "bg-blue-50 text-blue-700" },
  { value: "no_contact", label: "No Contact", cls: "bg-gray-100 text-gray-700" },
];

const ASSIGNEES = ["Mutebi Reagan", "Caroline", "Unassigned"];

const triggerLabel = (t: string): string => {
  const map: Record<string, string> = {
    Q5_ZERO_ANHEDONIA: "Q5 scored 0% — Loss of daily interest (severe depression indicator)",
    OVERALL_BELOW_20: "Overall score below 20% — Below critical threshold",
    FLAG_MORALE_LOW: "Low mood (Q1)",
    FLAG_ANXIETY_HIGH: "High anxiety (Q2)",
    FLAG_BURNOUT_RISK: "Energy depletion / burnout risk (Q3)",
    FLAG_SLEEP_DISRUPTION: "Sleep disruption (Q4)",
    FLAG_DISENGAGEMENT_HIGH: "Disengagement (Q5)",
    FLAG_WORKLOAD_HIGH: "Unmanageable workload (Q6)",
    FLAG_SUPPORT_LOW: "Low felt support (Q7)",
    FLAG_OVERWHELM_CRITICAL: "Frequent overwhelm (Q8)",
  };
  return map[t] || t;
};

const empCode = (id: string) => `EMP-${id.slice(-6).toUpperCase()}`;

const slaCountdown = (deadline: string | null, status: string): { text: string; breach: boolean } => {
  if (!deadline) return { text: "—", breach: false };
  if (status === "resolved" || status === "referred") return { text: "Closed", breach: false };
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return { text: "SLA BREACHED", breach: true };
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return { text: h >= 1 ? `${h}h ${m}m left` : `${m}m left`, breach: false };
};

const OUTREACH_TEMPLATE = (assigneeName: string) =>
  `Hello, this is ${assigneeName} from InnerSpark Africa. You recently completed a wellbeing check and we wanted to personally reach out. We noticed your responses suggest you may be going through a difficult time. We are here and we would love to support you. Everything you share with us is completely confidential. Would you be open to a brief conversation? You can reply to this message or call us directly.`;

export default function CrisisAlertsTab() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [employees, setEmployees] = useState<Record<string, { phone: string | null }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [actionAlert, setActionAlert] = useState<CrisisAlert | null>(null);
  const [outreachResponse, setOutreachResponse] = useState("");

  const load = async () => {
    setLoading(true);
    const [alertsRes, companiesRes, employeesRes] = await Promise.all([
      supabase.from("corporate_crisis_alerts").select("*").order("level", { ascending: true }).order("created_at", { ascending: false }),
      supabase.from("corporate_companies").select("id, name"),
      supabase.from("corporate_employees").select("id, phone"),
    ]);
    setAlerts((alertsRes.data as any[]) || []);
    const cmap: Record<string, string> = {};
    (companiesRes.data || []).forEach((c: any) => { cmap[c.id] = c.name; });
    setCompanies(cmap);
    const emap: Record<string, { phone: string | null }> = {};
    (employeesRes.data || []).forEach((e: any) => { emap[e.id] = { phone: e.phone }; });
    setEmployees(emap);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Tick countdown every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const updateAlert = async (id: string, patch: Partial<CrisisAlert>) => {
    const { error } = await supabase.from("corporate_crisis_alerts").update(patch as any).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    setAlerts((arr) => arr.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    toast.success("Updated");
  };

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filterLevel !== "all" && String(a.level) !== filterLevel) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (filterCompany !== "all" && a.company_id !== filterCompany) return false;
      if (search) {
        const s = search.toLowerCase();
        const blob = `${a.alert_code || ""} ${companies[a.company_id] || ""} ${empCode(a.employee_id)}`.toLowerCase();
        if (!blob.includes(s)) return false;
      }
      return true;
    });
  }, [alerts, filterLevel, filterStatus, filterCompany, search, companies]);

  const stats = useMemo(() => {
    const open = alerts.filter((a) => a.status === "pending" || a.status === "in_progress");
    const severe = alerts.filter((a) => a.level === 1 && (a.status === "pending" || a.status === "in_progress"));
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const resolvedWeek = alerts.filter((a) => a.resolved_at && new Date(a.resolved_at) >= weekStart);
    return { open: open.length, severe: severe.length, resolvedWeek: resolvedWeek.length };
  }, [alerts]);

  const copyOutreach = (a: CrisisAlert) => {
    navigator.clipboard.writeText(OUTREACH_TEMPLATE(a.assigned_to || "InnerSpark"));
    toast.success("WhatsApp message copied");
  };

  const logOutreach = async () => {
    if (!actionAlert) return;
    const next = [...(actionAlert.outreach_attempts || []), { attemptedAt: new Date().toISOString(), response: outreachResponse }];
    await updateAlert(actionAlert.id, { outreach_attempts: next, status: actionAlert.status === "pending" ? "in_progress" : actionAlert.status });
    setOutreachResponse("");
    setActionAlert(null);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-red-600">{stats.severe}</div><p className="text-xs text-muted-foreground">Severe alerts (open)</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{stats.open}</div><p className="text-xs text-muted-foreground">Total open alerts</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-green-600">{stats.resolvedWeek}</div><p className="text-xs text-muted-foreground">Resolved this week</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertOctagon className="w-5 h-5 text-red-600" /> Crisis Alerts Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-xs w-[200px]" placeholder="Search alert / employee / company" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="1">Severe</SelectItem>
                <SelectItem value="2">Urgent</SelectItem>
                <SelectItem value="3">Monitor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue placeholder="Company" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {Object.entries(companies).map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No crisis alerts match the current filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Alert ID</th>
                    <th className="text-left p-2">Company</th>
                    <th className="text-left p-2">Employee Code</th>
                    <th className="text-left p-2">Trigger</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">SLA</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Assigned</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const sla = slaCountdown(a.sla_deadline, a.status);
                    return (
                      <tr key={a.id} className={`border-b align-top ${sla.breach ? "bg-red-50/60" : ""}`}>
                        <td className="p-2"><Badge className={LEVEL_LABEL[a.level]?.cls}>{LEVEL_LABEL[a.level]?.label}</Badge></td>
                        <td className="p-2 font-mono text-[10px]">{a.alert_code || a.id.slice(0, 8)}</td>
                        <td className="p-2">{companies[a.company_id] || "—"}</td>
                        <td className="p-2 font-mono">{empCode(a.employee_id)}</td>
                        <td className="p-2 max-w-[220px] text-foreground/80">
                          {(a.triggers || []).slice(0, 2).map((t) => (
                            <div key={t} className="leading-snug">• {triggerLabel(t)}</div>
                          ))}
                          {(a.triggers || []).length > 2 && <div className="text-muted-foreground">+{a.triggers.length - 2} more</div>}
                        </td>
                        <td className="p-2 text-muted-foreground">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 ${sla.breach ? "text-red-700 font-semibold" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" /> {sla.text}
                          </span>
                        </td>
                        <td className="p-2">
                          <Select value={a.status} onValueChange={(v) => updateAlert(a.id, { status: v, ...(v === "resolved" || v === "referred" ? { resolved_at: new Date().toISOString() } : {}) })}>
                            <SelectTrigger className="h-7 w-[120px] text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUS_OPTIONS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <Select value={a.assigned_to || "Unassigned"} onValueChange={(v) => updateAlert(a.id, { assigned_to: v })}>
                            <SelectTrigger className="h-7 w-[130px] text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{ASSIGNEES.map((n) => (<SelectItem key={n} value={n}>{n}</SelectItem>))}</SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setActionAlert(a)}>Action</Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyOutreach(a)} title="Copy WhatsApp message">
                              <Copy className="w-3 h-3" />
                            </Button>
                            {employees[a.employee_id]?.phone && (
                              <a
                                href={`https://wa.me/${employees[a.employee_id].phone?.replace(/\D/g, "")}?text=${encodeURIComponent(OUTREACH_TEMPLATE(a.assigned_to || "InnerSpark"))}`}
                                target="_blank" rel="noreferrer"
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-green-600 hover:bg-green-50"
                                title="Open WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!actionAlert} onOpenChange={(o) => { if (!o) setActionAlert(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Action crisis alert {actionAlert?.alert_code}</DialogTitle></DialogHeader>
          {actionAlert && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Company:</span> {companies[actionAlert.company_id]}</div>
                <div><span className="text-muted-foreground">Employee:</span> {empCode(actionAlert.employee_id)}</div>
                <div><span className="text-muted-foreground">Priority:</span> <Badge className={LEVEL_LABEL[actionAlert.level]?.cls}>{LEVEL_LABEL[actionAlert.level]?.label}</Badge></div>
                <div><span className="text-muted-foreground">Phone on file:</span> {employees[actionAlert.employee_id]?.phone || "—"}</div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Triggers</p>
                <ul className="text-xs list-disc pl-5 space-y-0.5 text-foreground/80">
                  {(actionAlert.triggers || []).map((t) => (<li key={t}>{triggerLabel(t)}</li>))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Suggested WhatsApp message</p>
                <Textarea readOnly rows={5} value={OUTREACH_TEMPLATE(actionAlert.assigned_to || "InnerSpark")} className="text-xs" />
                <Button size="sm" variant="outline" className="mt-2" onClick={() => copyOutreach(actionAlert)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy message
                </Button>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Log this outreach attempt</p>
                <Textarea rows={3} placeholder="What did the employee say? Any next steps?" value={outreachResponse} onChange={(e) => setOutreachResponse(e.target.value)} className="text-xs" />
              </div>
              {actionAlert.outreach_attempts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-1">Previous attempts</p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    {actionAlert.outreach_attempts.map((a: any, i) => (
                      <div key={i} className="border-l-2 border-muted pl-2">
                        <span className="font-medium">{new Date(a.attemptedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span> — {a.response || "(no note)"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActionAlert(null)}>Cancel</Button>
                <Button onClick={logOutreach}>Log attempt</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}