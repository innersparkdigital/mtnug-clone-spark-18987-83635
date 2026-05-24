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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Plus, Link2, MousePointerClick, CheckCircle2, Gift, Loader2 } from "lucide-react";

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
  session_amount_kes: number | null;
  discount_applied: number | null;
  reward_issued: boolean;
  converted_at: string;
};

type Click = { id: string; referral_link_id: string; clicked_at: string; converted: boolean };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "https://www.innersparkafrica.com";

export default function KenyaReferralsTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<RefLink[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<RefLink | null>(null);

  const [form, setForm] = useState({
    referrer_name: "",
    referrer_phone: "",
    referrer_email: "",
    slug: "",
    discount_amount_kes: 200,
    reward_type: "cash",
    reward_value: 500,
    link_type: "individual",
    custom_message: "",
    notes: "",
  });

  const fetchAll = async () => {
    setLoading(true);
    const [l, c, v] = await Promise.all([
      supabase.from("referral_links").select("*").order("created_at", { ascending: false }),
      supabase.from("referral_clicks").select("id, referral_link_id, clicked_at, converted"),
      supabase.from("referral_conversions").select("*"),
    ]);
    if (l.data) setLinks(l.data as RefLink[]);
    if (c.data) setClicks(c.data as Click[]);
    if (v.data) setConvs(v.data as Conv[]);
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
      market: "kenya",
      link_type: form.link_type,
      is_active: true,
      discount_amount_kes: form.discount_amount_kes,
      reward_type: form.reward_type,
      reward_value: form.reward_value,
      custom_message: form.custom_message || null,
      notes: form.notes || null,
    });
    setSaving(false);
    if (error) { toast({ title: "Failed to create", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Referral link created", description: `/${slug}` });
    setOpen(false);
    setForm({ ...form, referrer_name: "", referrer_phone: "", referrer_email: "", slug: "", custom_message: "", notes: "" });
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

  const copyText = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast({ title: label });
  };

  const shareTemplates = (l: RefLink) => {
    const url = `${ORIGIN}/kenya/ref/${l.slug}`;
    const discount = l.discount_amount_kes || 0;
    const price = 2600 - discount;
    return [
      {
        label: "WhatsApp DM",
        text: `Hi! I've been using InnerSpark for therapy and wanted to share. Use my link to get KES ${discount} off your first session (KES ${price}): ${url}`,
      },
      {
        label: "WhatsApp Group",
        text: `*Mental health support, made for Kenya* 🇰🇪\nAffordable online therapy, M-Pesa payment, private and confidential.\nGet KES ${discount} off your first session using this link:\n${url}`,
      },
      {
        label: "WhatsApp Status",
        text: `Therapy that works for Kenyans. From KES ${price} — pay via M-Pesa. ${url}`,
      },
      {
        label: "LinkedIn",
        text: `If you're navigating stress, burnout, or anxiety — InnerSpark offers affordable online therapy across Kenya. First session KES ${price} with this link: ${url}`,
      },
    ];
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={<Link2 className="h-4 w-4" />} label="Active Links" value={stats.active} />
        <Stat icon={<MousePointerClick className="h-4 w-4" />} label="Clicks" value={stats.totalClicks} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Conversions" value={stats.totalConv} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Conv. Rate" value={`${stats.rate}%`} />
        <Stat icon={<Gift className="h-4 w-4" />} label="Pending Rewards" value={stats.pendingRewards} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kenya Referral Links</CardTitle>
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
                  <TableHead>Discount</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conv.</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No links yet. Create one to start tracking.</TableCell></TableRow>
                )}
                {links.map((l, i) => {
                  const p = perLink[l.id] || { clicks: 0, conv: 0, pending: 0 };
                  const url = `${ORIGIN}/kenya/ref/${l.slug}`;
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
                      <TableCell>KES {l.discount_amount_kes}</TableCell>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Kenya referral link</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Referrer name *</Label><Input value={form.referrer_name} onChange={(e) => setForm({ ...form, referrer_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={form.referrer_phone} onChange={(e) => setForm({ ...form, referrer_phone: e.target.value })} placeholder="+254…" /></div>
              <div><Label>Email</Label><Input value={form.referrer_email} onChange={(e) => setForm({ ...form, referrer_email: e.target.value })} /></div>
            </div>
            <div><Label>Custom slug (optional)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="auto-generated" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Discount (KES)</Label><Input type="number" value={form.discount_amount_kes} onChange={(e) => setForm({ ...form, discount_amount_kes: Number(e.target.value) })} /></div>
              <div>
                <Label>Link type</Label>
                <Select value={form.link_type} onValueChange={(v) => setForm({ ...form, link_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
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
              <div><Label>Reward value (KES)</Label><Input type="number" value={form.reward_value} onChange={(e) => setForm({ ...form, reward_value: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Custom message (shown on Kenya page)</Label><Textarea rows={2} value={form.custom_message} onChange={(e) => setForm({ ...form, custom_message: e.target.value })} placeholder="e.g. Jane sent you — enjoy KES 200 off your first session." /></div>
            <div><Label>Internal notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
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
                  <Table>
                    <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Amount</TableHead><TableHead>Reward</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {convs.filter((c) => c.referral_link_id === detail.id).map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.client_name || "—"}<div className="text-xs text-muted-foreground">{c.client_phone || ""}</div></TableCell>
                          <TableCell>KES {c.session_amount_kes ?? 0}</TableCell>
                          <TableCell>{c.reward_issued ? <Badge>Issued</Badge> : <Badge variant="secondary">Pending</Badge>}</TableCell>
                          <TableCell>{!c.reward_issued && <Button size="sm" variant="outline" onClick={() => issueReward(c)}>Mark issued</Button>}</TableCell>
                        </TableRow>
                      ))}
                      {convs.filter((c) => c.referral_link_id === detail.id).length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No conversions yet.</TableCell></TableRow>
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