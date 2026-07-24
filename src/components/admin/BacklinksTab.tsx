import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, ExternalLink, Trash2, Link2, TrendingUp, CheckCircle2, Clock, Search } from "lucide-react";

type Backlink = {
  id: string;
  source_url: string;
  source_domain: string;
  target_url: string;
  anchor_text: string | null;
  link_type: string;
  status: string;
  domain_authority: number | null;
  category: string | null;
  contact_name: string | null;
  contact_email: string | null;
  outreach_date: string | null;
  acquired_date: string | null;
  is_live: boolean;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["prospect", "outreach", "acquired", "lost", "rejected"] as const;
const CATEGORIES = ["Media / Press", "Directory", "Guest Post", "Partner", "NGO / Government", "Blog", "Other"];

const statusColor: Record<string, string> = {
  prospect: "bg-slate-100 text-slate-700",
  outreach: "bg-amber-100 text-amber-800",
  acquired: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
  rejected: "bg-zinc-200 text-zinc-700",
};

const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const emptyForm = {
  source_url: "",
  target_url: "https://www.innersparkafrica.com/",
  anchor_text: "",
  link_type: "dofollow",
  status: "prospect",
  domain_authority: "",
  category: "",
  contact_name: "",
  contact_email: "",
  outreach_date: "",
  acquired_date: "",
  is_live: false,
  notes: "",
};

const BacklinksTab = () => {
  const [rows, setRows] = useState<Backlink[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("backlinks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load backlinks", description: error.message, variant: "destructive" });
    }
    setRows((data as Backlink[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const acquired = rows.filter((r) => r.status === "acquired").length;
    const live = rows.filter((r) => r.is_live).length;
    const outreach = rows.filter((r) => r.status === "outreach").length;
    const avgDa =
      rows.filter((r) => typeof r.domain_authority === "number").reduce((s, r) => s + (r.domain_authority || 0), 0) /
      Math.max(1, rows.filter((r) => typeof r.domain_authority === "number").length);
    return { total: rows.length, acquired, live, outreach, avgDa: Math.round(avgDa || 0) };
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.source_domain.toLowerCase().includes(q) ||
      r.source_url.toLowerCase().includes(q) ||
      (r.anchor_text || "").toLowerCase().includes(q) ||
      (r.category || "").toLowerCase().includes(q)
    );
  });

  const save = async () => {
    if (!form.source_url.trim()) {
      toast({ title: "Source URL is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      source_url: form.source_url.trim(),
      source_domain: extractDomain(form.source_url.trim()),
      target_url: form.target_url.trim() || "https://www.innersparkafrica.com/",
      anchor_text: form.anchor_text.trim() || null,
      link_type: form.link_type,
      status: form.status,
      domain_authority: form.domain_authority ? Number(form.domain_authority) : null,
      category: form.category || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      outreach_date: form.outreach_date || null,
      acquired_date: form.acquired_date || null,
      is_live: form.is_live,
      notes: form.notes || null,
    };
    const { error } = await (supabase as any).from("backlinks").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Backlink saved" });
    setForm(emptyForm);
    setOpen(false);
    load();
  };

  const updateRow = async (id: string, patch: Partial<Backlink>) => {
    const { error } = await (supabase as any).from("backlinks").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } as Backlink : r)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this backlink record?")) return;
    const { error } = await (supabase as any).from("backlinks").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<Link2 className="w-4 h-4" />} label="Total tracked" value={stats.total} />
        <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} label="Acquired" value={stats.acquired} />
        <StatCard icon={<TrendingUp className="w-4 h-4 text-blue-600" />} label="Live now" value={stats.live} />
        <StatCard icon={<Clock className="w-4 h-4 text-amber-600" />} label="In outreach" value={stats.outreach} />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Avg DA" value={stats.avgDa || "—"} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Backlink tracker</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Log prospects, outreach and acquired links pointing to InnerSpark Africa.
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search domain, anchor…"
                className="pl-8 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add backlink</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add backlink</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Source URL *</Label>
                    <Input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} placeholder="https://example.com/article" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Target URL (on our site)</Label>
                    <Input value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} />
                  </div>
                  <div>
                    <Label>Anchor text</Label>
                    <Input value={form.anchor_text} onChange={(e) => setForm({ ...form, anchor_text: e.target.value })} />
                  </div>
                  <div>
                    <Label>Link type</Label>
                    <Select value={form.link_type} onValueChange={(v) => setForm({ ...form, link_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dofollow">dofollow</SelectItem>
                        <SelectItem value="nofollow">nofollow</SelectItem>
                        <SelectItem value="ugc">ugc</SelectItem>
                        <SelectItem value="sponsored">sponsored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Domain Authority (0-100)</Label>
                    <Input type="number" value={form.domain_authority} onChange={(e) => setForm({ ...form, domain_authority: e.target.value })} />
                  </div>
                  <div>
                    <Label>Contact name</Label>
                    <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Contact email</Label>
                    <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Outreach date</Label>
                    <Input type="date" value={form.outreach_date} onChange={(e) => setForm({ ...form, outreach_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Acquired date</Label>
                    <Input type="date" value={form.acquired_date} onChange={(e) => setForm({ ...form, acquired_date: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save backlink"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No backlinks yet. Click "Add backlink" to start tracking.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Anchor / Target</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>DA</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Live</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                          {r.source_domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm truncate">{r.anchor_text || <span className="text-muted-foreground italic">—</span>}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.target_url}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{r.link_type}</Badge></TableCell>
                      <TableCell>{r.domain_authority ?? "—"}</TableCell>
                      <TableCell className="text-sm">{r.category || "—"}</TableCell>
                      <TableCell>
                        <Select value={r.status} onValueChange={(v) => updateRow(r.id, { status: v })}>
                          <SelectTrigger className={`h-8 w-32 ${statusColor[r.status] || ""}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={r.is_live}
                          onChange={(e) => updateRow(r.id, { is_live: e.target.checked, last_checked_at: new Date().toISOString() } as any)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">{icon}<span>{label}</span></div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </CardContent>
  </Card>
);

export default BacklinksTab;