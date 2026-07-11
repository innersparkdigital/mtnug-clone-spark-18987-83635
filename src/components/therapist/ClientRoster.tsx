import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserPlus, Sparkles, Copy, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import AssignmentBuilder from "./AssignmentBuilder";
import { copyToClipboard } from "@/lib/copyToClipboard";

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

const ClientRoster = ({ therapistId, therapistName }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", presenting_concern: "" });
  const [assignFor, setAssignFor] = useState<Client | null>(null);

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

  if (assignFor) {
    return (
      <AssignmentBuilder
        client={assignFor}
        therapistName={therapistName}
        onDone={() => { setAssignFor(null); load(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <div className="card-calm p-4 border-amber-400/40 bg-amber-500/5 fade-in-calm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-medium">Needs attention</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((c) => (
              <button
                key={"na-" + c.id}
                onClick={() => setAssignFor(c)}
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
          <p className="text-sm text-muted-foreground">Add a client, then create their private wellbeing space.</p>
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
      ) : clients.length === 0 ? (
        <div className="card-calm p-8 text-center text-sm text-muted-foreground">
          No clients yet. Click "Add client" to get started.
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map((c) => {
            const active = c.active_tools || 0;
            const overdue = c.overdue_tools || 0;
            const alerts = c.open_alerts || 0;
            return (
              <div key={c.id} className="card-calm hover-lift stagger-item p-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-base">{c.full_name}</span>
                      {alerts > 0 && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                          Safety alert
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {c.email || "No email"}{c.phone ? ` · ${c.phone}` : ""}
                      {c.presenting_concern ? ` · ${c.presenting_concern}` : ""}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-primary" /> {active} active
                      </span>
                      {overdue > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
                          <Clock className="h-3 w-3" /> {overdue} overdue
                        </span>
                      )}
                      <span className="text-muted-foreground/80">·</span>
                      <span>{timeAgo(c.last_seen_at)}</span>
                    </div>

                    {c.week_activity && (
                      <div className="flex items-center gap-1 mt-3" title="Last 7 days of activity">
                        {c.week_activity.map((d) => (
                          <span
                            key={d.date}
                            className={[
                              "h-1.5 w-6 rounded-full",
                              d.completed > 0 ? "bg-primary" : "bg-muted",
                            ].join(" ")}
                            aria-label={`${d.date}: ${d.completed} completed`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => copyLink(c)}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy link
                    </Button>
                    <Button size="sm" onClick={() => setAssignFor(c)}>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" /> New assignment
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientRoster;