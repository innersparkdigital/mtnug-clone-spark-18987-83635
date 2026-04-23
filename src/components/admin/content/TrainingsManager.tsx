import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadContentMedia } from "./uploadMedia";

interface Training {
  id: string; title: string; description: string;
  facilitator_name: string; facilitator_title: string;
  training_date: string; end_time: string | null;
  flier_image_url: string | null; meeting_link: string | null;
  meeting_password: string | null; target_audience: string;
  session_focus: string[] | null; is_active: boolean;
}

const empty: Partial<Training> = {
  title: "", description: "", facilitator_name: "", facilitator_title: "",
  training_date: "", end_time: "", flier_image_url: "", meeting_link: "",
  meeting_password: "", target_audience: "All", session_focus: [], is_active: true,
};

const TrainingsManager = () => {
  const [items, setItems] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<Training>>(empty);
  const [focusInput, setFocusInput] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("trainings").select("*").order("training_date", { ascending: false });
    if (error) toast.error(error.message); else setItems(data as Training[]);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setForm(empty); setFocusInput(""); setOpen(true); };
  const openEdit = (t: Training) => {
    setForm({ ...t, training_date: t.training_date?.slice(0, 16), end_time: t.end_time?.slice(0, 16) || "" });
    setFocusInput((t.session_focus || []).join(", "));
    setOpen(true);
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    try { const url = await uploadContentMedia(file, "trainings"); setForm(f => ({ ...f, flier_image_url: url })); toast.success("Uploaded"); }
    catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.title || !form.training_date) { toast.error("Title and date required"); return; }
    setSaving(true);
    const focus = focusInput.split(",").map(s => s.trim()).filter(Boolean);
    const payload: any = {
      title: form.title, description: form.description || "",
      facilitator_name: form.facilitator_name || "InnerSpark Team",
      facilitator_title: form.facilitator_title || "Facilitator",
      training_date: new Date(form.training_date as string).toISOString(),
      end_time: form.end_time ? new Date(form.end_time as string).toISOString() : null,
      flier_image_url: form.flier_image_url || null,
      meeting_link: form.meeting_link || null, meeting_password: form.meeting_password || null,
      target_audience: form.target_audience || "All", session_focus: focus,
      is_active: form.is_active ?? true,
    };
    const { error } = form.id
      ? await supabase.from("trainings").update(payload).eq("id", form.id)
      : await supabase.from("trainings").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setOpen(false); fetchAll();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this training?")) return;
    const { error } = await supabase.from("trainings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetchAll(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trainings</h3>
          <p className="text-sm text-muted-foreground">{items.length} total · {items.filter(i => i.is_active).length} active</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> New Training</Button>
      </div>

      {loading ? <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              {t.flier_image_url && <img src={t.flier_image_url} alt="" className="w-full h-32 object-cover" loading="lazy" />}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold line-clamp-2">{t.title}</h4>
                  <Badge variant={t.is_active ? "default" : "secondary"}>{t.is_active ? "Active" : "Inactive"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(t.training_date).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No trainings yet</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit" : "New"} Training</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Facilitator Name</Label><Input value={form.facilitator_name || ""} onChange={(e) => setForm({ ...form, facilitator_name: e.target.value })} /></div>
              <div><Label>Facilitator Title</Label><Input value={form.facilitator_title || ""} onChange={(e) => setForm({ ...form, facilitator_title: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start *</Label><Input type="datetime-local" value={form.training_date as string || ""} onChange={(e) => setForm({ ...form, training_date: e.target.value })} /></div>
              <div><Label>End</Label><Input type="datetime-local" value={form.end_time as string || ""} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
            </div>
            <div><Label>Target Audience</Label><Input value={form.target_audience || ""} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} /></div>
            <div><Label>Session Focus (comma-separated)</Label><Input value={focusInput} onChange={(e) => setFocusInput(e.target.value)} placeholder="Stress, Burnout, Coping" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Meeting Link</Label><Input value={form.meeting_link || ""} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} /></div>
              <div><Label>Meeting Password</Label><Input value={form.meeting_password || ""} onChange={(e) => setForm({ ...form, meeting_password: e.target.value })} /></div>
            </div>
            <div>
              <Label>Flier Image</Label>
              <div className="flex gap-2 items-center">
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} disabled={uploading} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {form.flier_image_url && <img src={form.flier_image_url} alt="" className="mt-2 h-24 rounded object-cover" />}
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active (visible on website)</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingsManager;