import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { uploadContentMedia, slugify } from "./uploadMedia";

interface EventItem {
  id: string; slug: string; title: string; summary: string | null; body: string;
  event_date: string | null; hero_image_url: string | null; status: string;
}

const empty: Partial<EventItem> = { slug: "", title: "", summary: "", body: "", event_date: "", hero_image_url: "", status: "draft" };

const EventsManager = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<EventItem>>(empty);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message); else setEvents(data as EventItem[]);
    setLoading(false);
  };
  useEffect(() => { fetchEvents(); }, []);

  const handleImage = async (file: File) => {
    setUploading(true);
    try { const url = await uploadContentMedia(file, "events"); setForm(f => ({ ...f, hero_image_url: url })); toast.success("Uploaded"); }
    catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const save = async (publishNow = false) => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    const status = publishNow ? "published" : (form.status || "draft");
    const payload: any = {
      slug: form.slug || slugify(form.title), title: form.title, summary: form.summary || null,
      body: form.body || "", event_date: form.event_date || null,
      hero_image_url: form.hero_image_url || null, status,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: user?.id,
    };
    const { error } = form.id
      ? await supabase.from("events").update(payload).eq("id", form.id)
      : await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(publishNow ? "Event published" : "Event saved");
    setOpen(false); fetchEvents();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetchEvents(); }
  };

  const togglePublish = async (e: EventItem) => {
    const newStatus = e.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("events").update({ status: newStatus, published_at: newStatus === "published" ? new Date().toISOString() : null }).eq("id", e.id);
    if (error) toast.error(error.message); else { toast.success(newStatus === "published" ? "Published" : "Unpublished"); fetchEvents(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Events & Activities</h3>
          <p className="text-sm text-muted-foreground">{events.length} total · {events.filter(e => e.status === "published").length} published</p>
        </div>
        <Button onClick={() => { setForm(empty); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> New Event</Button>
      </div>

      {loading ? <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              {e.hero_image_url && <img src={e.hero_image_url} alt="" className="w-full h-32 object-cover" loading="lazy" />}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold line-clamp-2">{e.title}</h4>
                  <Badge variant={e.status === "published" ? "default" : "secondary"}>{e.status}</Badge>
                </div>
                {e.event_date && <p className="text-xs text-muted-foreground">{new Date(e.event_date).toLocaleDateString()}</p>}
                <p className="text-xs text-muted-foreground line-clamp-2">{e.summary}</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => { setForm(e); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => togglePublish(e)}><Eye className="h-3 w-3 mr-1" />{e.status === "published" ? "Unpublish" : "Publish"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(e.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No events yet</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit" : "New"} Event</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={form.title || ""} onChange={(ev) => setForm({ ...form, title: ev.target.value, slug: form.id ? form.slug : slugify(ev.target.value) })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Slug</Label><Input value={form.slug || ""} onChange={(ev) => setForm({ ...form, slug: ev.target.value })} /></div>
              <div><Label>Event Date</Label><Input type="date" value={form.event_date || ""} onChange={(ev) => setForm({ ...form, event_date: ev.target.value })} /></div>
            </div>
            <div><Label>Summary</Label><Textarea rows={2} value={form.summary || ""} onChange={(ev) => setForm({ ...form, summary: ev.target.value })} /></div>
            <div>
              <Label>Hero Image</Label>
              <div className="flex gap-2 items-center">
                <Input type="file" accept="image/*" onChange={(ev) => ev.target.files?.[0] && handleImage(ev.target.files[0])} disabled={uploading} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {form.hero_image_url && <img src={form.hero_image_url} alt="" className="mt-2 h-24 rounded object-cover" />}
            </div>
            <div><Label>Body (HTML supported)</Label><Textarea rows={8} value={form.body || ""} onChange={(ev) => setForm({ ...form, body: ev.target.value })} className="font-mono text-xs" /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={() => save(false)} disabled={saving}>Save Draft</Button>
            <Button onClick={() => save(true)} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;