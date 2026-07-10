import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, UserPlus, Sparkles, Copy } from "lucide-react";
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
}

interface Props {
  therapistId: string;
  therapistName: string;
}

const ClientRoster = ({ therapistId, therapistName }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", presenting_concern: "" });
  const [assignFor, setAssignFor] = useState<Client | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("therapist_clients")
      .select("id, full_name, email, phone, presenting_concern, access_token, created_at")
      .eq("therapist_id", therapistId)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setClients((data as Client[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [therapistId]);

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Your clients</CardTitle>
          <CardDescription>Add a client, then create their private wellbeing space.</CardDescription>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" /> Add client</Button>
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-8 grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : clients.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            No clients yet. Click "Add client" to get started.
          </div>
        ) : (
          <div className="divide-y">
            {clients.map((c) => (
              <div key={c.id} className="py-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.email || "No email"}{c.phone ? ` · ${c.phone}` : ""}
                    {c.presenting_concern ? ` · ${c.presenting_concern}` : ""}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyLink(c)}>
                  <Copy className="h-3 w-3 mr-1.5" /> Copy link
                </Button>
                <Button size="sm" onClick={() => setAssignFor(c)}>
                  <Sparkles className="h-3 w-3 mr-1.5" /> New assignment
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRoster;