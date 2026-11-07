import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Check, Copy, Loader2, Plus } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { AMANI_EVENTS, amaniDb, cleanOrgKey, type AmaniEvent } from "@/lib/amaniApi";

const SITE = "https://www.innersparkafrica.com";

type Row = { org_key: string; event_type: AmaniEvent; day: string; count: number };
type Partner = { org_key: string; name: string; active: boolean; created_at: string };

const LABELS: Record<AmaniEvent, string> = {
  chat_started: "Chats started",
  message_sent: "Messages sent",
  chip_used: "Quick replies used",
  crisis_card_shown: "Safety cards shown",
  urgent_help_opened: "Urgent help opened",
  counsellor_prompt_shown: "Counsellor prompts shown",
  counsellor_prompt_dismissed: "Counsellor prompts dismissed",
  next_step_clicked: "Next steps clicked",
  privacy_notice_opened: "Privacy notice opened",
};

const KPIS: AmaniEvent[] = ["chat_started", "message_sent", "crisis_card_shown", "urgent_help_opened", "counsellor_prompt_shown", "next_step_clicked"];
const RANGES = [7, 30, 90] as const;

const snippet = (key: string) =>
  `<script src="${SITE}/amani-embed.js" data-org="${key}" async></script>`;

async function loadCounts(sinceDay: string): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await amaniDb
      .from("amani_event_counts")
      .select("org_key,event_type,day,count")
      .gte("day", sinceDay)
      .order("day", { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as Row[];
    out.push(...page.map((r) => ({ ...r, count: Number(r.count) })));
    if (page.length < 1000) break;
  }
  return out;
}

export default function AdminAmani() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [org, setOrg] = useState<string>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/admin/amani");
  }, [user, authLoading, navigate]);
  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isAdmin) navigate("/");
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const since = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
      const [counts, p] = await Promise.all([
        loadCounts(since),
        amaniDb.from("amani_partners").select("org_key,name,active,created_at").order("created_at", { ascending: true }),
      ]);
      if (p.error) throw new Error(p.error.message);
      setRows(counts);
      setPartners((p.data ?? []) as Partner[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load Amani counts.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    if (isAdmin) void refresh();
  }, [isAdmin, refresh]);

  const visible = useMemo(() => (org === "all" ? rows : rows.filter((r) => r.org_key === org)), [rows, org]);

  const totals = useMemo(() => {
    const t = Object.fromEntries(AMANI_EVENTS.map((e) => [e, 0])) as Record<AmaniEvent, number>;
    visible.forEach((r) => {
      if (r.event_type in t) t[r.event_type] += r.count;
    });
    return t;
  }, [visible]);

  const daily = useMemo(() => {
    const map = new Map<string, { day: string; chats: number; messages: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      map.set(d, { day: d, chats: 0, messages: 0 });
    }
    visible.forEach((r) => {
      const e = map.get(r.day);
      if (!e) return;
      if (r.event_type === "chat_started") e.chats += r.count;
      if (r.event_type === "message_sent") e.messages += r.count;
    });
    return [...map.values()];
  }, [visible, days]);

  const perOrg = useMemo(() => {
    const by = new Map<string, Record<string, number>>();
    rows.forEach((r) => {
      const e = by.get(r.org_key) ?? {};
      e[r.event_type] = (e[r.event_type] ?? 0) + r.count;
      by.set(r.org_key, e);
    });
    return by;
  }, [rows]);

  const nextStepRate = totals.chat_started > 0 ? Math.round((totals.next_step_clicked / totals.chat_started) * 100) : 0;

  const addPartner = async () => {
    const key = cleanOrgKey(newKey);
    if (!newName.trim() || !key) {
      toast({ title: "Check the details", description: "Add a name and a key of 2-40 lowercase letters, numbers or dashes.", variant: "destructive" });
      return;
    }
    const { error: err } = await amaniDb.from("amani_partners").insert({ org_key: key, name: newName.trim() });
    if (err) {
      toast({ title: "Could not add organisation", description: err.message, variant: "destructive" });
      return;
    }
    setNewName("");
    setNewKey("");
    toast({ title: "Organisation added", description: "Copy its embed snippet below." });
    void refresh();
  };

  const toggle = async (p: Partner) => {
    const { error: err } = await amaniDb.from("amani_partners").update({ active: !p.active }).eq("org_key", p.org_key);
    if (err) toast({ title: "Could not update", description: err.message, variant: "destructive" });
    else void refresh();
  };

  const copy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(snippet(key));
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: "Copy failed", description: "Select the snippet and copy it by hand.", variant: "destructive" });
    }
  };

  if (authLoading || roleLoading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Amani dashboard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge className="mb-2">Admin</Badge>
            <h1 className="text-3xl font-bold">Amani widget dashboard</h1>
            <p className="text-muted-foreground">Anonymous counts only. No conversation text is stored.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <Button key={r} size="sm" variant={days === r ? "default" : "outline"} onClick={() => setDays(r)}>
                {r} days
              </Button>
            ))}
            <select
              aria-label="Organisation"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <option value="all">All organisations</option>
              {partners.map((p) => (
                <option key={p.org_key} value={p.org_key}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            {error} If this is the first time you open this page, the Amani database migration may not have been applied yet.
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((k) => (
            <Card key={k}>
              <CardContent className="px-3 pb-3 pt-4">
                <p className="truncate text-[11px] text-muted-foreground">{LABELS[k]}</p>
                <p className="text-2xl font-bold">{loading ? "…" : totals[k].toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily activity</CardTitle>
              <CardDescription>Chats started and messages sent, last {days} days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" tickFormatter={(d: string) => d.slice(5)} fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="chats" name="Chats started" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="messages" name="Messages sent" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Safety and next steps</CardTitle>
              <CardDescription>Same period and organisation filter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(["crisis_card_shown", "urgent_help_opened", "counsellor_prompt_shown", "counsellor_prompt_dismissed", "next_step_clicked", "privacy_notice_opened"] as AmaniEvent[]).map((e) => (
                <div key={e} className="flex justify-between">
                  <span className="text-muted-foreground">{LABELS[e]}</span>
                  <span className="font-medium">{totals[e].toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Next steps per chat started</span>
                <span className="font-medium">{nextStepRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Organisations</CardTitle>
            <CardDescription>Share the snippet with a partner. Each organisation gets its own counts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead className="text-right">Chats</TableHead>
                    <TableHead className="text-right">Next steps</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Embed snippet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((p) => {
                    const t = perOrg.get(p.org_key) ?? {};
                    return (
                      <TableRow key={p.org_key}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell><code className="text-xs">{p.org_key}</code></TableCell>
                        <TableCell className="text-right">{(t.chat_started ?? 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{(t.next_step_clicked ?? 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant={p.active ? "secondary" : "outline"} onClick={() => void toggle(p)}>
                            {p.active ? "Active" : "Paused"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => void copy(p.org_key)}>
                            {copied === p.org_key ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                            {copied === p.org_key ? "Copied" : "Copy snippet"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {partners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">No organisations yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input placeholder="Organisation name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input placeholder="key, e.g. purpleminds" value={newKey} onChange={(e) => setNewKey(e.target.value.toLowerCase())} />
              <Button onClick={() => void addPartner()} className="shrink-0">
                <Plus className="mr-1 h-4 w-4" /> Add organisation
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              A paused organisation can no longer chat with Amani, so you can switch off a partner at any time. The snippet adds the
              Talk to Amani button to any page. Without the script, an iframe pointing to {SITE}/amani-embed?org=KEY works too.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
