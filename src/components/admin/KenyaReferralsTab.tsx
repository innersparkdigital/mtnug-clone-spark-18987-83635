import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Plus, Link2, MousePointerClick, CheckCircle2, Gift, Loader2, Eye, Globe } from "lucide-react";

type RefLink = {
  id: string;
  slug: string;
  referrer_name: string;
  referrer_phone: string | null;
  referrer_email: string | null;
  market: string;
  link_type: string;
  is_active: boolean;
  discount_amount_kes: number;
  discount_amount: number;
  country: string;
  currency: string;
  reward_percent: number;
  reward_type: string | null;
  reward_value: number | null;
  custom_message: string | null;
  notes: string | null;
  created_at: string;
};

type Conv = {
  id: string;
  referral_link_id: string;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  session_amount_kes: number | null;
  discount_applied: number | null;
  reward_issued: boolean;
  stage: string | null;
  reward_amount: number | null;
  reward_currency: string | null;
  stages_notified: string[] | null;
  converted_at: string;
};

type Click = { id: string; referral_link_id: string; clicked_at: string; converted: boolean };

type KenyaVisit = {
  id: string;
  session_id: string | null;
  source: string | null;
  device_type: string | null;
  referrer: string | null;
  created_at: string;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const normalizeLinkType = (value: string) =>
  ["client", "corporate", "therapist"].includes(value) ? value : "client";

const normalizeMarket = (value: string) => {
  const key = value.toLowerCase().trim();
  if (["ke", "kenya", "nairobi"].includes(key)) return "ke";
  if (["ug", "uganda", "kampala"].includes(key)) return "ug";
  return "ug";
};

export const COUNTRY_OPTIONS = [
  { country: "Uganda", market: "ug", currency: "UGX", discount: 10000, sessionPrice: 75000 },
  { country: "Kenya", market: "ke", currency: "KES", discount: 200, sessionPrice: 2600 },
  { country: "Tanzania", market: "ug", currency: "TZS", discount: 5000, sessionPrice: 50000 },
  { country: "Rwanda", market: "ug", currency: "RWF", discount: 2000, sessionPrice: 25000 },
  { country: "Nigeria", market: "ug", currency: "NGN", discount: 2000, sessionPrice: 25000 },
  { country: "Other / International", market: "ug", currency: "USD", discount: 5, sessionPrice: 22 },
];

const countryCfg = (name: string) =>
  COUNTRY_OPTIONS.find((c) => c.country === name) || COUNTRY_OPTIONS[0];

const STAGES = [
  { key: "contacted", label: "Contacted us" },
  { key: "booked", label: "Booked a session" },
  { key: "paid", label: "Paid" },
  { key: "reward_ready", label: "Reward ready to claim" },
  { key: "reward_claimed", label: "Reward claimed" },
];

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "https://www.innersparkafrica.com";

const linkUrl = (l: { slug: string; market?: string }) =>
  `${ORIGIN}${l.market === "ke" ? "/kenya" : ""}/ref/${l.slug}`;

export default function KenyaReferralsTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<RefLink[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [visits, setVisits] = useState<KenyaVisit[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<RefLink | null>(null);

  const [form, setForm] = useState({
    referrer_name: "",
    referrer_phone: "",
    referrer_email: "",
    slug: "",
    slug_touched: false,
    country: "Uganda",
    discount_amount: 10000,
    reward_percent: 5,
    reward_type: "cash",
    reward_value: 0,
    link_type: "client",
    custom_message: "",
    message_touched: false,
    notes: "",
  });
  const cfg = countryCfg(form.country);

  // Auto-generate slug + custom message from referrer name / discount unless user edited them
  useEffect(() => {
    setForm((f) => {
      const c = countryCfg(f.country);
      const next = { ...f };
      if (!f.slug_touched && f.referrer_name.trim()) {
        next.slug = slugify(f.referrer_name);
      }
      if (!f.message_touched && f.referrer_name.trim()) {
        const first = f.referrer_name.trim().split(/\s+/)[0];
        next.custom_message = `${first} sent you — enjoy ${c.currency} ${(f.discount_amount || 0).toLocaleString()} off your first InnerSpark therapy session. Book in 2 minutes.`;
      }
      return next;
    });
  }, [form.referrer_name, form.discount_amount, form.country, form.slug_touched, form.message_touched]);

  const fetchAll = async () => {
    setLoading(true);
    const [l, c, v, pv] = await Promise.all([
      supabase.from("referral_links").select("*").order("created_at", { ascending: false }),
      supabase.from("referral_clicks").select("id, referral_link_id, clicked_at, converted"),
      supabase.from("referral_conversions").select("*"),
      supabase.from("kenya_page_visits" as any).select("id, session_id, source, device_type, referrer, created_at").order("created_at", { ascending: false }).limit(2000),
    ]);
    if (l.data) setLinks(l.data as RefLink[]);
    if (c.data) setClicks(c.data as Click[]);
    if (v.data) setConvs(v.data as Conv[]);
    if (pv.data) setVisits(pv.data as unknown as KenyaVisit[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const stats = useMemo(() => {
    const active = links.filter((l) => l.is_active).length;
    const totalClicks = clicks.length;
    const totalConv = convs.length;
    const rate = totalClicks > 0 ? Math.round((totalConv / totalClicks) * 100) : 0;
    const pendingRewards = convs.filter((c) => !c.reward_issued).length;
    return { active, totalClicks, totalConv, rate, pendingRewards };
  }, [links, clicks, convs]);

  const visitStats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let today = 0, week = 0, month = 0;
    const sourceCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const dailySeries: Record<string, number> = {};
    visits.forEach((v) => {
      const t = new Date(v.created_at).getTime();
      const ageDays = (now - t) / dayMs;
      if (ageDays < 1) today++;
      if (ageDays < 7) week++;
      if (ageDays < 30) month++;
      const s = (v.source || "unknown").toLowerCase();
      sourceCounts[s] = (sourceCounts[s] || 0) + 1;
      const d = (v.device_type || "unknown").toLowerCase();
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
      const dayKey = new Date(v.created_at).toISOString().slice(0, 10);
      dailySeries[dayKey] = (dailySeries[dayKey] || 0) + 1;
    });
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now - (13 - i) * dayMs);
      const key = d.toISOString().slice(0, 10);
      return { day: key.slice(5), count: dailySeries[key] || 0 };
    });
    const maxDay = Math.max(1, ...last14.map((d) => d.count));
    return {
      total: visits.length,
      today,
      week,
      month,
      sources: Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]),
      devices: Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]),
      last14,
      maxDay,
    };
  }, [visits]);

  const perLink = useMemo(() => {
    const m: Record<string, { clicks: number; conv: number; pending: number }> = {};
    links.forEach((l) => (m[l.id] = { clicks: 0, conv: 0, pending: 0 }));
    clicks.forEach((c) => { if (m[c.referral_link_id]) m[c.referral_link_id].clicks++; });
    convs.forEach((c) => {
      if (!m[c.referral_link_id]) return;
      m[c.referral_link_id].conv++;
      if (!c.reward_issued) m[c.referral_link_id].pending++;
    });
    return m;
  }, [links, clicks, convs]);

  const createLink = async () => {
    if (!form.referrer_name.trim()) {
      toast({ title: "Referrer name required", variant: "destructive" });
      return;
    }
    const slug = (form.slug || slugify(form.referrer_name)) + "-" + Math.random().toString(36).slice(2, 6);
    setSaving(true);
    const { error } = await supabase.from("referral_links").insert({
      slug,
      referrer_name: form.referrer_name,
      referrer_phone: form.referrer_phone || null,
      referrer_email: form.referrer_email || null,
      market: normalizeMarket(cfg.market),
      country: form.country,
      currency: cfg.currency,
      discount_amount: form.discount_amount,
      reward_percent: form.reward_percent,
      link_type: normalizeLinkType(form.link_type),
      is_active: true,
      discount_amount_kes: form.discount_amount,
      reward_type: form.reward_type,
      reward_value: form.reward_value,
      custom_message: form.custom_message || null,
      notes: form.notes || null,
    } as any);
    setSaving(false);
    if (error) { toast({ title: "Failed to create", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Referral link created", description: `/${slug}` });
    setOpen(false);
    setForm({ ...form, referrer_name: "", referrer_phone: "", referrer_email: "", slug: "", slug_touched: false, custom_message: "", message_touched: false, notes: "" });
    fetchAll();
  };

  const togglePause = async (l: RefLink) => {
    const { error } = await supabase.from("referral_links").update({ is_active: !l.is_active }).eq("id", l.id);
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    fetchAll();
  };

  const issueReward = async (c: Conv) => {
    const { error } = await supabase
      .from("referral_conversions")
      .update({ reward_issued: true, reward_issued_at: new Date().toISOString() })
      .eq("id", c.id);
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    toast({ title: "Reward marked as issued" });
    fetchAll();
  };

  const setStage = async (c: Conv, stage: string, notify = true) => {
    const { error } = await supabase.rpc("admin_set_referral_stage" as any, {
      _conversion_id: c.id,
      _stage: stage,
    });
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    if (notify) {
      const { error: mailErr } = await supabase.functions.invoke("send-referral-update", {
        body: { conversion_id: c.id, stage },
      });
      toast(
        mailErr
          ? { title: "Stage updated — email not sent", description: mailErr.message, variant: "destructive" }
          : { title: "Stage updated · referrer emailed" },
      );
    } else {
      toast({ title: "Stage updated" });
    }
    fetchAll();
  };

  const copyText = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast({ title: label });
  };

  const shareTemplates = (l: RefLink) => {
    const url = linkUrl(l);
    const cur = l.currency || "KES";
    const discount = l.discount_amount ?? l.discount_amount_kes ?? 0;
    const base = countryCfg(l.country || "Uganda").sessionPrice;
    const price = Math.max(0, base - discount);
    const pct = l.reward_percent ?? 5;
    return [
      {
        label: "WhatsApp DM",
        text: `Hi! I've been using InnerSpark for therapy and wanted to share. Use my link to get ${cur} ${discount.toLocaleString()} off your first session (${cur} ${price.toLocaleString()}): ${url}`,
      },
      {
        label: "WhatsApp Group",
        text: `*Mental health support you can afford*\nOnline therapy, private and confidential.\nGet ${cur} ${discount.toLocaleString()} off your first session using this link:\n${url}`,
      },
      {
        label: "WhatsApp Status",
        text: `Therapy that actually fits your life. From ${cur} ${price.toLocaleString()}. ${url}`,
      },
      {
        label: "LinkedIn",
        text: `If you're navigating stress, burnout, or anxiety — InnerSpark offers affordable online therapy. First session ${cur} ${price.toLocaleString()} with this link: ${url}`,
      },
      {
        label: "Refer-a-friend (after a paid session)",
        text: `Thanks for your session today 💙 If you know 2 people going through something similar, share your personal link: ${url}\nWhen they book and pay, you get ${pct}% off your next session — every single time.`,
      },
    ];
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Kenya page visit analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Referral Landing Page Visits</CardTitle>
          <Badge variant="secondary">{visitStats.total.toLocaleString()} total</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={<Eye className="h-4 w-4" />} label="Today" value={visitStats.today} />
            <Stat icon={<Eye className="h-4 w-4" />} label="Last 7 days" value={visitStats.week} />
            <Stat icon={<Eye className="h-4 w-4" />} label="Last 30 days" value={visitStats.month} />
            <Stat icon={<Eye className="h-4 w-4" />} label="All time" value={visitStats.total} />
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Visits — last 14 days</div>
            <div className="flex items-end gap-1 h-24">
              {visitStats.last14.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/70"
                    style={{ height: `${(d.count / visitStats.maxDay) * 100}%`, minHeight: d.count > 0 ? 4 : 1 }}
                    title={`${d.day}: ${d.count}`}
                  />
                  <span className="text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Top sources</div>
              <div className="space-y-1">
                {visitStats.sources.slice(0, 6).map(([s, n]) => (
                  <div key={s} className="flex justify-between text-sm">
                    <span className="capitalize">{s}</span>
                    <span className="font-medium">{n}</span>
                  </div>
                ))}
                {visitStats.sources.length === 0 && <div className="text-sm text-muted-foreground">No visits yet.</div>}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Devices</div>
              <div className="space-y-1">
                {visitStats.devices.map(([d, n]) => (
                  <div key={d} className="flex justify-between text-sm">
                    <span className="capitalize">{d}</span>
                    <span className="font-medium">{n}</span>
                  </div>
                ))}
                {visitStats.devices.length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={<Link2 className="h-4 w-4" />} label="Active Links" value={stats.active} />
        <Stat icon={<MousePointerClick className="h-4 w-4" />} label="Clicks" value={stats.totalClicks} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Conversions" value={stats.totalConv} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Conv. Rate" value={`${stats.rate}%`} />
        <Stat icon={<Gift className="h-4 w-4" />} label="Pending Rewards" value={stats.pendingRewards} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Referral Links</CardTitle>
          <Button onClick={() => setOpen(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> New Link</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conv.</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.length === 0 && (
                  <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No links yet. Create one to start tracking.</TableCell></TableRow>
                )}
                {links.map((l, i) => {
                  const p = perLink[l.id] || { clicks: 0, conv: 0, pending: 0 };
                  const url = linkUrl(l);
                  return (
                    <TableRow key={l.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{l.referrer_name}</div>
                        <div className="text-xs text-muted-foreground">{l.referrer_phone || l.referrer_email || "—"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs">{l.slug}</code>
                          <Button size="icon" variant="ghost" onClick={() => copyText(url, "Link copied")}><Copy className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{l.country || (l.market === "ke" ? "Kenya" : "Uganda")}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.currency || "KES"} {(l.discount_amount ?? l.discount_amount_kes ?? 0).toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.reward_value ? `${l.currency || "KES"} ${l.reward_value.toLocaleString()}` : `${l.reward_percent ?? 5}%`}</TableCell>
                      <TableCell>{p.clicks}</TableCell>
                      <TableCell>{p.conv}</TableCell>
                      <TableCell>{p.pending > 0 ? <Badge variant="secondary">{p.pending}</Badge> : "—"}</TableCell>
                      <TableCell><Switch checked={l.is_active} onCheckedChange={() => togglePause(l)} /></TableCell>
                      <TableCell><Button size="sm" variant="outline" onClick={() => setDetail(l)}>View</Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Create referral link</DialogTitle>
            <DialogDescription>
              Generate a country-aware booking referral link with automatic slug, discount and reward text.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto px-6 py-4 flex-1">
            <p className="text-xs text-muted-foreground">
              This link leads visitors to book a therapy session on the Kenya page. When the client pays, you'll see the conversion below and can mark the referrer's reward as issued.
            </p>
            <div><Label>Referrer name *</Label><Input value={form.referrer_name} onChange={(e) => setForm({ ...form, referrer_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={form.referrer_phone} onChange={(e) => setForm({ ...form, referrer_phone: e.target.value })} placeholder="+254…" /></div>
              <div><Label>Email</Label><Input value={form.referrer_email} onChange={(e) => setForm({ ...form, referrer_email: e.target.value })} /></div>
            </div>
            <div>
              <Label>Custom slug (auto)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value), slug_touched: true })} placeholder="auto-generated from name" />
              <p className="text-xs text-muted-foreground mt-1">Final link: {ORIGIN}{cfg.market === "ke" ? "/kenya" : ""}/ref/{form.slug || "…"}-xxxx</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(v) => {
                    const c = countryCfg(v);
                    setForm({ ...form, country: v, discount_amount: c.discount, reward_value: 0 });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((c) => <SelectItem key={c.country} value={c.country}>{c.country} ({c.currency})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reward % of next session</Label>
                <Input type="number" value={form.reward_percent} onChange={(e) => setForm({ ...form, reward_percent: Number(e.target.value) })} />
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {cfg.currency} {Math.round((cfg.sessionPrice * (form.reward_percent || 0)) / 100).toLocaleString()} per paying referral
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Discount ({cfg.currency})</Label><Input type="number" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: Number(e.target.value) })} /></div>
              <div>
                <Label>Link type</Label>
                <Select value={normalizeLinkType(form.link_type)} onValueChange={(v) => setForm({ ...form, link_type: normalizeLinkType(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client referral</SelectItem>
                    <SelectItem value="therapist">Therapist / Influencer</SelectItem>
                    <SelectItem value="corporate">Corporate / Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Reward type</Label>
                <Select value={form.reward_type} onValueChange={(v) => setForm({ ...form, reward_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash (M-Pesa)</SelectItem>
                    <SelectItem value="airtime">Airtime</SelectItem>
                    <SelectItem value="session_credit">Session credit</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fixed reward value ({cfg.currency}) — optional</Label><Input type="number" value={form.reward_value} onChange={(e) => setForm({ ...form, reward_value: Number(e.target.value) })} placeholder="0 = use % of session" /></div>
            </div>
            <div>
              <Label>Custom message (auto, shown on Kenya page)</Label>
              <Textarea rows={3} value={form.custom_message} onChange={(e) => setForm({ ...form, custom_message: e.target.value, message_touched: true })} placeholder="Auto-generated from referrer name" />
            </div>
            <div><Label>Internal notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-background">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createLink} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Create link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader><DialogTitle>{detail.referrer_name} — /{detail.slug}</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="rounded-md border p-3 bg-muted/30 space-y-1">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                    <div><span className="text-muted-foreground">Phone:</span> {detail.referrer_phone || "—"}</div>
                    <div><span className="text-muted-foreground">Email:</span> {detail.referrer_email || "—"}</div>
                    <div><span className="text-muted-foreground">Country:</span> {detail.country || "—"}</div>
                    <div><span className="text-muted-foreground">Discount:</span> {detail.currency || "KES"} {(detail.discount_amount ?? detail.discount_amount_kes ?? 0).toLocaleString()}</div>
                    <div><span className="text-muted-foreground">Reward:</span> {detail.reward_value ? `${detail.currency} ${detail.reward_value}` : `${detail.reward_percent ?? 5}% of next session`}</div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <code className="text-xs break-all">{linkUrl(detail)}</code>
                    <Button size="icon" variant="ghost" onClick={() => copyText(linkUrl(detail), "Link copied")}><Copy className="h-3 w-3" /></Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Clicks" value={perLink[detail.id]?.clicks ?? 0} />
                  <Stat label="Conversions" value={perLink[detail.id]?.conv ?? 0} />
                  <Stat label="Pending rewards" value={perLink[detail.id]?.pending ?? 0} />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Share templates</h4>
                  <div className="space-y-2">
                    {shareTemplates(detail).map((t) => (
                      <div key={t.label} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs uppercase text-muted-foreground">{t.label}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyText(t.text, `${t.label} copied`)}><Copy className="h-3 w-3 mr-1" /> Copy</Button>
                        </div>
                        <p className="whitespace-pre-wrap text-xs">{t.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Conversions</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Move each referred client through the journey. Every stage change emails {detail.referrer_name} an update —
                    contacted → booked → paid → reward ready → claimed.
                  </p>
                  <Table>
                    <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>When</TableHead><TableHead>Amount</TableHead><TableHead>Stage</TableHead><TableHead>Reward</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {convs.filter((c) => c.referral_link_id === detail.id).map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.client_name || "—"}<div className="text-xs text-muted-foreground">{c.client_phone || ""}</div></TableCell>
                          <TableCell className="text-xs">{new Date(c.converted_at).toLocaleString()}</TableCell>
                          <TableCell>{detail.currency || "KES"} {(c.session_amount_kes ?? 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Select value={c.stage || "contacted"} onValueChange={(v) => setStage(c, v)}>
                              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {STAGES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{c.reward_issued ? <Badge>Issued</Badge> : <Badge variant="secondary">Pending</Badge>}</TableCell>
                          <TableCell>{!c.reward_issued && <Button size="sm" variant="outline" onClick={() => issueReward(c)}>Mark issued</Button>}</TableCell>
                        </TableRow>
                      ))}
                      {convs.filter((c) => c.referral_link_id === detail.id).length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                          No conversions yet. A conversion appears here when someone books a session after clicking this referral link.
                        </TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recent clicks</h4>
                  <Table>
                    <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Converted?</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {clicks.filter((c) => c.referral_link_id === detail.id).slice(0, 20).map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-xs">{new Date(c.clicked_at).toLocaleString()}</TableCell>
                          <TableCell>{c.converted ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                        </TableRow>
                      ))}
                      {clicks.filter((c) => c.referral_link_id === detail.id).length === 0 && (
                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">No clicks yet. Share this link to start tracking.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}