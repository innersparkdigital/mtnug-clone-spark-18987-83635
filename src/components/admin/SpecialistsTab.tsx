import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Pencil, Trash2, Search, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TYPES = ["Therapist", "Psychologist", "Psychiatrist", "Counsellor", "Coach", "Social Worker"];
const SPECS = ["Anxiety","Depression","Burnout","Grief","Relationships","Addiction","Trauma","Workplace Stress","Adolescents","Family","Marriage","Couples","Children","Other"];
const LANGS = ["English","Luganda","Kiswahili","Runyankole","Luo","Ateso","French","Other"];
const OPTIONS = ["voice","video","chat","in-person"];

type Specialist = {
  id: string;
  name: string;
  type: string;
  experience_years: number;
  price_per_hour: number;
  specialties: string[];
  languages: string[];
  available_options: string[];
  bio: string | null;
  education: string | null;
  certifications: string[] | null;
  image_url: string | null;
  is_active: boolean;
  country: string;
  kenya: boolean;
  created_at: string;
};

const emptyForm: Partial<Specialist> = {
  name: "", type: "Therapist", experience_years: 1, price_per_hour: 75000,
  specialties: [], languages: ["English"], available_options: ["voice","video"],
  bio: "", education: "", certifications: [], image_url: "",
  is_active: true, country: "Uganda", kenya: false,
};

export default function SpecialistsTab() {
  const [list, setList] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Specialist>>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Specialist | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const photoFilePreview = photoFile ? URL.createObjectURL(photoFile) : null;
  const currentPhoto = photoFilePreview || editing.image_url || null;

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("specialists")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setList((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.specialties.some(sp => sp.toLowerCase().includes(search.toLowerCase()))
  );

  const removeImageFromStorage = async (url: string) => {
    try {
      const marker = "/specialist-photos/";
      const idx = url.indexOf(marker);
      if (idx === -1) return;
      const path = url.slice(idx + marker.length);
      await supabase.storage.from("specialist-photos").remove([path]);
    } catch { /* best-effort */ }
  };

  const openNew = () => { setEditing(emptyForm); setPhotoFile(null); setOriginalImageUrl(null); setOpen(true); };
  const openEdit = (s: Specialist) => { setEditing(s); setPhotoFile(null); setOriginalImageUrl(s.image_url || null); setOpen(true); };

  const toggleArray = (key: keyof Specialist, value: string) => {
    const current = ((editing as any)[key] as string[]) || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setEditing({ ...editing, [key]: next });
  };

  const clearPhoto = () => { setPhotoFile(null); setEditing({ ...editing, image_url: "" }); };

  const save = async () => {
    if (!editing.name || !editing.type) {
      toast({ title: "Missing fields", description: "Name and type are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    let image_url = editing.image_url || null;
    if (photoFile) {
      if (photoFile.size > 2 * 1024 * 1024) {
        toast({ title: "Photo too large", description: "Max 2MB.", variant: "destructive" });
        setSaving(false); return;
      }
      const ext = photoFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("specialist-photos").upload(path, photoFile);
      if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setSaving(false); return; }
      image_url = supabase.storage.from("specialist-photos").getPublicUrl(path).data.publicUrl;
    }
    if (originalImageUrl && originalImageUrl !== image_url) {
      await removeImageFromStorage(originalImageUrl);
    }
    const payload: any = { ...editing, image_url };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    const { error } = editing.id
      ? await supabase.from("specialists").update(payload).eq("id", editing.id)
      : await supabase.from("specialists").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing.id ? "Specialist updated" : "Specialist added" });
    setOpen(false); load();
  };

  const toggleActive = async (s: Specialist) => {
    const { error } = await supabase.from("specialists").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.image_url) await removeImageFromStorage(confirmDelete.image_url);
    const { error } = await supabase.from("specialists").delete().eq("id", confirmDelete.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Specialist deleted" }); load(); }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Specialists</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} specialist{filtered.length !== 1 && "s"} (public roster)</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, type, specialty..." className="pl-8 w-72" />
          </div>
          <Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />Add Specialist</Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Specialist</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Price / hr</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin inline" /></TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No specialists found.</TableCell></TableRow>}
            {!loading && filtered.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => s.image_url && setPreviewPhoto(s.image_url)}
                      className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Preview photo of ${s.name}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={s.image_url || undefined} />
                        <AvatarFallback>{s.name.split(" ").map(n => n[0]).join("").slice(0,2)}</AvatarFallback>
                      </Avatar>
                    </button>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.experience_years} yrs exp</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {s.specialties.slice(0,3).map(sp => <Badge key={sp} variant="secondary" className="text-xs">{sp}</Badge>)}
                    {s.specialties.length > 3 && <Badge variant="secondary" className="text-xs">+{s.specialties.length - 3}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{s.country}{s.kenya ? " · KE" : ""}</TableCell>
                <TableCell className="text-right">{s.price_per_hour.toLocaleString()}</TableCell>
                <TableCell><Switch checked={s.is_active} onCheckedChange={() => toggleActive(s)} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(s)}><Trash2 className="w-3 h-3 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing.id ? "Edit Specialist" : "Add Specialist"}</SheetTitle>
            <SheetDescription>{editing.id ? "Update specialist profile shown on the public site." : "Add a new specialist to the public roster."}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Profile photo (max 2MB)</Label>
              <div className="mt-2 flex items-start gap-4">
                <div className="relative">
                  {currentPhoto ? (
                    <button type="button" onClick={() => setPreviewPhoto(currentPhoto)} className="block">
                      <img src={currentPhoto} alt="Specialist photo preview" className="w-40 h-40 rounded-lg object-cover border shadow-sm hover:opacity-90 transition" />
                    </button>
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border">No photo</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent cursor-pointer text-sm">
                    <Upload className="w-4 h-4" />
                    {currentPhoto ? "Change photo" : "Upload photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                  </label>
                  {currentPhoto && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearPhoto} className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4 mr-1" /> Remove photo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">PNG or JPG. Click the photo to enlarge. New uploads preview instantly before saving.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name *</Label><Input value={editing.name || ""} onChange={e => setEditing({...editing, name: e.target.value})} /></div>
              <div><Label>Type *</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><Label>Years of experience</Label><Input type="number" min={0} value={editing.experience_years ?? 0} onChange={e => setEditing({...editing, experience_years: Number(e.target.value)})} /></div>
              <div><Label>Price per hour (UGX)</Label><Input type="number" min={0} value={editing.price_per_hour ?? 0} onChange={e => setEditing({...editing, price_per_hour: Number(e.target.value)})} /></div>
              <div><Label>Country</Label><Input value={editing.country || ""} onChange={e => setEditing({...editing, country: e.target.value})} /></div>
              <div className="flex items-center gap-3 mt-6">
                <Switch checked={!!editing.kenya} onCheckedChange={v => setEditing({...editing, kenya: v})} />
                <Label className="m-0">Available in Kenya</Label>
              </div>
            </div>

            <div><Label>Bio</Label><Textarea rows={4} value={editing.bio || ""} onChange={e => setEditing({...editing, bio: e.target.value})} /></div>
            <div><Label>Education</Label><Input value={editing.education || ""} onChange={e => setEditing({...editing, education: e.target.value})} /></div>

            {[
              { key: "specialties", label: "Specialties", opts: SPECS },
              { key: "languages", label: "Languages", opts: LANGS },
              { key: "available_options", label: "Session options", opts: OPTIONS },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {opts.map(o => {
                    const selected = (((editing as any)[key]) as string[] || []).includes(o);
                    return (
                      <button key={o} type="button" onClick={() => toggleArray(key as keyof Specialist, o)}
                        className={`px-3 py-1 rounded-full text-xs border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <Switch checked={!!editing.is_active} onCheckedChange={v => setEditing({...editing, is_active: v})} />
              <Label className="m-0">Active (visible on site)</Label>
            </div>

            <Button onClick={save} disabled={saving} className="w-full">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing.id ? "Save Changes" : "Add Specialist")}</Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the specialist, their photo, availability, certificates, and reviews. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setPreviewPhoto(null)}
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={previewPhoto} alt="Specialist photo" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}