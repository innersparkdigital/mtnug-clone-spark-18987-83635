import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, UserPlus, Phone, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type LeadStatus = "new" | "contacted" | "booked" | "closed";

interface Lead {
  id: string;
  session_id: string | null;
  anonymous_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  intent: string | null;
  message: string | null;
  source_path: string | null;
  status: LeadStatus;
  notes: string | null;
  handled_at: string | null;
  created_at: string;
}

const STATUS_META: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-300" },
  contacted: { label: "Contacted", color: "bg-amber-100 text-amber-800 border-amber-300" },
  booked: { label: "Booked", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-700 border-gray-300" },
};

const ChatLeadsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("new");
  const [search, setSearch] = useState("");
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [draftNotes, setDraftNotes] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("Failed to load leads");
    else setLeads((data || []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const counts = useMemo(() => ({
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    booked: leads.filter(l => l.status === "booked").length,
    closed: leads.filter(l => l.status === "closed").length,
    total: leads.length,
  }), [leads]);

  const filtered = useMemo(() => leads.filter(l => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search) {
      const hay = `${l.name || ""} ${l.phone || ""} ${l.email || ""} ${l.intent || ""} ${l.message || ""}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }), [leads, statusFilter, search]);

  const updateStatus = async (id: string, status: LeadStatus, notes?: string) => {
    setSavingId(id);
    const { error } = await supabase
      .from("chat_leads")
      .update({
        status,
        notes: notes ?? undefined,
        handled_by: user?.id || null,
        handled_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSavingId(null);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Marked as ${STATUS_META[status].label}`);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes: notes ?? l.notes, handled_at: new Date().toISOString() } : l));
    if (openLead?.id === id) setOpenLead(prev => prev ? { ...prev, status, notes: notes ?? prev.notes } : null);
  };

  const openDetail = (l: Lead) => {
    setOpenLead(l);
    setDraftNotes(l.notes || "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["new", "contacted", "booked", "closed"] as LeadStatus[]).map(k => (
          <Card key={k} className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter(k)}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{STATUS_META[k].label}</div>
              <div className="text-2xl font-bold">{counts[k]}</div>
            </CardContent>
          </Card>
        ))}
        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setStatusFilter("all")}>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">All</div>
            <div className="text-2xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Chat Leads
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}>
              <TabsList>
                <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
                <TabsTrigger value="contacted">Contacted ({counts.contacted})</TabsTrigger>
                <TabsTrigger value="booked">Booked ({counts.booked})</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Button variant="outline" size="sm" onClick={fetchLeads}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No leads match this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">When</th>
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-left py-2 px-2">Contact</th>
                    <th className="text-left py-2 px-2">Intent</th>
                    <th className="text-left py-2 px-2">Source</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l, idx) => {
                    const Meta = STATUS_META[l.status];
                    return (
                      <tr key={l.id} className="border-b hover:bg-muted/30">
                        <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                        <td className="py-2 px-2 whitespace-nowrap text-xs">{new Date(l.created_at).toLocaleString()}</td>
                        <td className="py-2 px-2">{l.name || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 px-2 text-xs">
                          {l.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a>
                            </div>
                          )}
                          {l.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          {l.intent && <Badge variant="secondary" className="text-[10px]">{l.intent}</Badge>}
                        </td>
                        <td className="py-2 px-2 text-xs text-muted-foreground truncate max-w-[150px]">{l.source_path || "—"}</td>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className={Meta.color}>{Meta.label}</Badge>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <Button size="sm" variant="ghost" onClick={() => openDetail(l)}>
                            <MessageSquare className="w-4 h-4 mr-1" /> View
                          </Button>
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

      <Dialog open={!!openLead} onOpenChange={(o) => !o && setOpenLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Lead detail
            </DialogTitle>
          </DialogHeader>
          {openLead && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground space-y-1 border-b pb-3">
                <div>Submitted: {new Date(openLead.created_at).toLocaleString()}</div>
                {openLead.intent && <div>Intent: <Badge variant="secondary" className="text-[10px]">{openLead.intent}</Badge></div>}
                {openLead.source_path && (
                  <div className="flex items-center gap-1">
                    Source: {openLead.source_path}
                    <a href={openLead.source_path} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3" /></a>
                  </div>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {openLead.name || "—"}</div>
                {openLead.phone && (
                  <div><strong>Phone:</strong> <a href={`tel:${openLead.phone}`} className="text-primary hover:underline">{openLead.phone}</a></div>
                )}
                {openLead.email && (
                  <div><strong>Email:</strong> <a href={`mailto:${openLead.email}`} className="text-primary hover:underline">{openLead.email}</a></div>
                )}
                {openLead.message && (
                  <div className="bg-muted/50 rounded p-2 text-xs whitespace-pre-wrap mt-2">
                    <strong>Message:</strong><br />{openLead.message}
                  </div>
                )}
              </div>
              {openLead.phone && (
                <a
                  href={`https://wa.me/${openLead.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-[#25D366] text-white text-sm font-bold py-2 rounded-lg"
                >
                  Open WhatsApp
                </a>
              )}
              <div className="border-t pt-3 space-y-2">
                <div className="text-xs font-medium">Follow-up notes</div>
                <Textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="e.g. Called at 14:05, booked a session for Mon."
                  rows={2}
                />
                <div className="flex gap-2 flex-wrap">
                  {(["new", "contacted", "booked", "closed"] as LeadStatus[]).map(st => (
                    <Button
                      key={st}
                      size="sm"
                      variant={openLead.status === st ? "default" : "outline"}
                      disabled={savingId === openLead.id}
                      onClick={() => updateStatus(openLead.id, st, draftNotes)}
                    >
                      Mark {STATUS_META[st].label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatLeadsTab;