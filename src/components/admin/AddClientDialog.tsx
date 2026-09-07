import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { SESSION_TYPES, DEFAULT_SESSION_TYPE, normalizeSessionType } from "@/lib/sessionTypes";

const COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Rwanda", "Nigeria", "Ghana", "South Africa", "Other"];

type ExistingClient = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  presenting_concern: string | null;
  session_type: string | null;
  duration_mins: number | null;
  therapist_id: string;
  last_session_date: string | null;
};

const empty = {
  therapist_id: "",
  full_name: "",
  email: "",
  phone: "",
  presenting_concern: "",
  country: "Uganda",
  session_type: DEFAULT_SESSION_TYPE as string,
  duration_mins: "60",
  last_session_date: "",
  next_session_date: "",
  amount_ugx: "",
  therapist_share_ugx: "",
  paid_status: "pending",
  session_rating: "",
  would_rebook: "",
};

const AddClientDialog = ({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}) => {
  const [therapists, setTherapists] = useState<{ id: string; full_name: string }[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"new" | "returning">("new");
  const [existing, setExisting] = useState<ExistingClient[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    supabase
      .from("therapist_accounts")
      .select("id, full_name")
      .eq("is_active", true)
      .order("full_name")
      .then(({ data }) => setTherapists((data as any[]) || []));
  }, [open]);

  // Existing clients power the returning-client autocomplete.
  useEffect(() => {
    if (!open || mode !== "returning" || existing.length) return;
    supabase.rpc("admin_list_all_clients" as any).then(({ data, error }) => {
      if (error) return toast.error(error.message);
      const rows = ((data as any[]) || []).filter((r) => r.full_name);
      const latest = new Map<string, ExistingClient>();
      for (const r of rows) {
        const key = (r.full_name as string).trim().toLowerCase();
        const prev = latest.get(key);
        const date = r.last_session_date || "";
        if (!prev || date > (prev.last_session_date || "")) latest.set(key, r as ExistingClient);
      }
      setExisting(Array.from(latest.values()).sort((a, b) => a.full_name.localeCompare(b.full_name)));
    });
  }, [open, mode, existing.length]);

  const chooseExisting = (c: ExistingClient) => {
    setSelectedId(c.id);
    setPickerOpen(false);
    setForm((f) => ({
      ...f,
      full_name: c.full_name || "",
      email: c.email || "",
      phone: c.phone || "",
      country: c.country || "Uganda",
      presenting_concern: c.presenting_concern || "",
      session_type: normalizeSessionType(c.session_type) || DEFAULT_SESSION_TYPE,
      therapist_id: c.therapist_id || f.therapist_id,
      duration_mins: c.duration_mins ? String(c.duration_mins) : f.duration_mins,
    }));
  };

  const switchMode = (m: "new" | "returning") => {
    setMode(m);
    setSelectedId("");
    setForm({ ...empty });
  };

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const amount = Number(form.amount_ugx || 0);
  // InnerSpark keeps 15%, the therapist earns 85% unless an override is typed in.
  const tShare = form.therapist_share_ugx ? Number(form.therapist_share_ugx) : amount ? Math.round(amount * 0.85) : 0;
  const innerspark = amount ? amount - tShare : 0;

  const submit = async () => {
    if (!form.full_name.trim()) return toast.error("Client name is required");
    if (!form.therapist_id) return toast.error("Select a therapist");
    setSaving(true);
    const { error } = await supabase.rpc("admin_create_client" as any, {
      _therapist_id: form.therapist_id,
      _full_name: form.full_name.trim(),
      _email: form.email.trim() || null,
      _phone: form.phone.trim() || null,
      _presenting_concern: form.presenting_concern.trim() || null,
      _country: form.country,
      _session_type: form.session_type || null,
      _duration_mins: form.duration_mins ? Number(form.duration_mins) : null,
      _last_session_date: form.last_session_date || null,
      _next_session_date: form.next_session_date || null,
      _amount_ugx: amount || null,
      _therapist_share_ugx: amount ? tShare : null,
      _paid_status: form.paid_status || null,
      _session_rating: form.session_rating ? Number(form.session_rating) : null,
      _would_rebook: form.would_rebook === "" ? null : form.would_rebook === "yes",
      _client_type: mode,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Client added");
    setForm({ ...empty });
    setMode("new");
    setSelectedId("");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add a new client session</DialogTitle>
          <DialogDescription>
            Pick a returning client to pre-fill their details, or enter a new client manually. Saving posts the session amount to Finance as income.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-2 space-y-3">
          <div className="inline-flex rounded-lg border p-1 bg-muted/40">
            {(["new", "returning"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`px-4 py-1.5 text-sm rounded-md transition ${mode === m ? "bg-background shadow font-medium" : "text-muted-foreground"}`}
              >
                {m === "new" ? "New client" : "Returning client"}
              </button>
            ))}
          </div>
          {mode === "returning" && (
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                  {selectedId
                    ? existing.find((c) => c.id === selectedId)?.full_name || "Select client"
                    : "Search existing clients…"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Type a name, phone or email…" />
                  <CommandList>
                    <CommandEmpty>No client found.</CommandEmpty>
                    <CommandGroup>
                      {existing.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.full_name} ${c.phone || ""} ${c.email || ""}`}
                          onSelect={() => chooseExisting(c)}
                        >
                          <Check className={`mr-2 h-4 w-4 ${selectedId === c.id ? "opacity-100" : "opacity-0"}`} />
                          <span className="truncate">
                            {c.full_name}
                            <span className="text-muted-foreground"> · {c.phone || c.email || "no contact"}</span>
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-3 overflow-y-auto px-6 py-4 flex-1">
          <div>
            <Label>Client name *</Label>
            <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
          </div>
          <div>
            <Label>Therapist *</Label>
            <Select value={form.therapist_id} onValueChange={(v) => set("therapist_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select therapist" /></SelectTrigger>
              <SelectContent>
                {therapists.map((t) => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+256…" /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div>
            <Label>Country</Label>
            <Select value={form.country} onValueChange={(v) => set("country", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Session type</Label>
            <Select value={form.session_type} onValueChange={(v) => set("session_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SESSION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Presenting concern</Label>
            <Textarea rows={2} value={form.presenting_concern} onChange={(e) => set("presenting_concern", e.target.value)} />
          </div>
          <div><Label>Session date</Label><Input type="date" value={form.last_session_date} onChange={(e) => set("last_session_date", e.target.value)} /></div>
          <div><Label>Next session</Label><Input type="date" value={form.next_session_date} onChange={(e) => set("next_session_date", e.target.value)} /></div>
          <div><Label>Duration (mins)</Label><Input type="number" value={form.duration_mins} onChange={(e) => set("duration_mins", e.target.value)} /></div>
          <div><Label>Session rating (1–5)</Label><Input type="number" min={1} max={5} value={form.session_rating} onChange={(e) => set("session_rating", e.target.value)} /></div>
          <div><Label>Amount (UGX)</Label><Input type="number" value={form.amount_ugx} onChange={(e) => set("amount_ugx", e.target.value)} placeholder="75000" /></div>
          <div>
            <Label>Therapist share (UGX)</Label>
            <Input type="number" value={form.therapist_share_ugx} onChange={(e) => set("therapist_share_ugx", e.target.value)} placeholder={amount ? String(Math.round(amount * 0.85)) : "auto 85%"} />
            {amount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Therapist 85%: UGX {tShare.toLocaleString()} · InnerSpark 15%: UGX {innerspark.toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <Label>Payment status</Label>
            <Select value={form.paid_status} onValueChange={(v) => set("paid_status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="waived">Waived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Would rebook</Label>
            <Select value={form.would_rebook} onValueChange={(v) => set("would_rebook", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </div>
          {amount > 0 && (
            <p className="md:col-span-2 text-xs text-muted-foreground">
              InnerSpark share: UGX {(amount - tShare).toLocaleString()} · Therapist: UGX {tShare.toLocaleString()}
            </p>
          )}
        </div>
        <DialogFooter className="px-6 py-4 border-t bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Add client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;