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
import { Loader2, Plus, Star, Pencil, Pause, Trash2, Search, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SPECS = ["Anxiety","Depression","Burnout","Grief","Relationships","Addiction","Trauma","Workplace Stress","Adolescents","Family","Other"];
const LANGS = ["English","Luganda","Kiswahili","French","Other"];
const SESSION_TYPES = ["Video","Chat","In-person"];
const AVAILABILITY = ["Weekdays","Weekends","Evenings"];

type Therapist = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  specialisations: string[];
  qualification: string | null;
  license_number: string | null;
  licensing_body: string | null;
  years_experience: number | null;
  bio: string | null;
  languages: string[];
  session_types: string[];
  availability: string[];
  license_status: "verified" | "pending" | "suspended";
  platform_status: "active" | "inactive" | "suspended" | "removed";
  session_count: number;
  rating: number;
  suspension_reason: string | null;
  suspension_review_date: string | null;
  created_at: string;
};

const emptyForm: Partial<Therapist> = {
  full_name: "", email: "", phone: "", photo_url: "",
  specialisations: [], qualification: "", license_number: "", licensing_body: "",
  years_experience: 0, bio: "", languages: ["English"], session_types: ["Video"],
  availability: ["Weekdays"], license_status: "pending", platform_status: "active",
};

export default function TherapistsTab() {
  const [list, setList] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Therapist>>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<Therapist | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<Therapist | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDate, setSuspendDate] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const photoFilePreview = photoFile ? URL.createObjectURL(photoFile) : null;
  const currentPhoto = photoFilePreview || editing.photo_url || null;

  const removePhotoFromStorage = async (url: string) => {
    try {
      const marker = "/therapist-photos/";
      const idx = url.indexOf(marker);
      if (idx === -1) return;
      const path = url.slice(idx + marker.length);
      await supabase.storage.from("therapist-photos").remove([path]);
    } catch { /* best-effort */ }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setEditing({ ...editing, photo_url: "" });
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("therapists" as any)
      .select("*").neq("platform_status", "removed").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setList(((data as any) || []) as Therapist[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter(t =>
    !search || t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.specialisations.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const openNew = () => { setEditing(emptyForm); setPhotoFile(null); setOriginalPhotoUrl(null); setOpen(true); };
  const openEdit = (t: Therapist) => { setEditing(t); setPhotoFile(null); setOriginalPhotoUrl(t.photo_url || null); setOpen(true); };

  const toggleArray = (key: keyof Therapist, value: string) => {
    const current = ((editing as any)[key] as string[]) || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setEditing({ ...editing, [key]: next });
  };

  const save = async () => {
    if (!editing.full_name || !editing.email || !editing.phone) {
      toast({ title: "Missing fields", description: "Name, email and phone are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    let photo_url = editing.photo_url || null;
    if (photoFile) {
      if (photoFile.size > 2 * 1024 * 1024) {
        toast({ title: "Photo too large", description: "Max 2MB.", variant: "destructive" });
        setSaving(false); return;
      }
      const ext = photoFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("therapist-photos").upload(path, photoFile);
      if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setSaving(false); return; }
      photo_url = supabase.storage.from("therapist-photos").getPublicUrl(path).data.publicUrl;
    }
    // If the photo was changed or cleared, delete the prior file from storage (best effort).
    if (originalPhotoUrl && originalPhotoUrl !== photo_url) {
      await removePhotoFromStorage(originalPhotoUrl);
    }
    const payload = { ...editing, photo_url };
    delete (payload as any).id; delete (payload as any).created_at;
    const { error } = editing.id
      ? await supabase.from("therapists" as any).update(payload).eq("id", editing.id)
      : await supabase.from("therapists" as any).insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: editing.id ? "Therapist updated" : "Therapist added" });
    setOpen(false); load();
  };

  const togglePlatform = async (t: Therapist) => {
    const next = t.platform_status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("therapists" as any).update({ platform_status: next }).eq("id", t.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const doRemove = async () => {
    if (!confirmRemove) return;
    const { error } = await supabase.from("therapists" as any)
      .update({ platform_status: "removed", removed_at: new Date().toISOString() })
      .eq("id", confirmRemove.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Therapist removed" }); load(); }
    setConfirmRemove(null);
  };

  const doSuspend = async () => {
    if (!confirmSuspend || !suspendReason) return;
    const { error } = await supabase.from("therapists" as any).update({
      platform_status: "suspended",
      license_status: "suspended",
      suspension_reason: suspendReason,
      suspension_review_date: suspendDate || null,
    }).eq("id", confirmSuspend.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Therapist suspended" }); load(); }
    setConfirmSuspend(null); setSuspendReason(""); setSuspendDate("");
  };

  const licenseBadge = (s: string) => {
    const map: Record<string, string> = {
      verified: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
    };
    return <Badge className={map[s]}>{s.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Therapists</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} therapist{filtered.length !== 1 && "s"}</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 w-64" />
          </div>
          <Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />Add Therapist</Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Therapist</TableHead>
              <TableHead>Specialisations</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sessions</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin inline" /></TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No therapists yet. Click "Add Therapist" to onboard one.</TableCell></TableRow>}
            {!loading && filtered.map(t => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => t.photo_url && setPreviewPhoto(t.photo_url)}
                      className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Preview photo for ${t.full_name}`}
                    >
                      <Avatar className="w-10 h-10"><AvatarImage src={t.photo_url || undefined} /><AvatarFallback>{t.full_name.split(" ").map(n => n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                    </button>
                    <div>
                      <p className="font-medium">{t.full_name}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><div className="flex flex-wrap gap-1">{t.specialisations.slice(0,3).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}{t.specialisations.length > 3 && <Badge variant="outline" className="text-xs">+{t.specialisations.length - 3}</Badge>}</div></TableCell>
                <TableCell>{licenseBadge(t.license_status)}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Switch checked={t.platform_status === "active"} onCheckedChange={() => togglePlatform(t)} /><span className="text-xs">{t.platform_status}</span></div></TableCell>
                <TableCell className="text-right">{t.session_count}</TableCell>
                <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{Number(t.rating).toFixed(1)}</div></TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmSuspend(t)}><Pause className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmRemove(t)}><Trash2 className="w-3 h-3 text-red-600" /></Button>
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
            <SheetTitle>{editing.id ? "Edit Therapist" : "Add Therapist"}</SheetTitle>
            <SheetDescription>{editing.id ? "Update therapist profile." : "Onboard a new therapist to the platform."}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full name *</Label><Input value={editing.full_name || ""} onChange={e => setEditing({...editing, full_name: e.target.value})} /></div>
              <div><Label>Email *</Label><Input type="email" value={editing.email || ""} onChange={e => setEditing({...editing, email: e.target.value})} /></div>
              <div><Label>Phone *</Label><Input value={editing.phone || ""} onChange={e => setEditing({...editing, phone: e.target.value})} /></div>
              <div><Label>Years of experience</Label><Input type="number" value={editing.years_experience ?? 0} onChange={e => setEditing({...editing, years_experience: Number(e.target.value)})} /></div>
              <div><Label>Highest qualification</Label><Input value={editing.qualification || ""} onChange={e => setEditing({...editing, qualification: e.target.value})} /></div>
              <div><Label>License / registration number</Label><Input value={editing.license_number || ""} onChange={e => setEditing({...editing, license_number: e.target.value})} /></div>
              <div className="col-span-2"><Label>Licensing body</Label><Input value={editing.licensing_body || ""} onChange={e => setEditing({...editing, licensing_body: e.target.value})} placeholder="e.g. Uganda Allied Health Professional Councils" /></div>
            </div>
            <div>
              <Label>Profile photo (max 2MB)</Label>
              <div className="mt-2 flex items-start gap-4">
                <div className="relative">
                  {currentPhoto ? (
                    <button type="button" onClick={() => setPreviewPhoto(currentPhoto)} className="block">
                      <img src={currentPhoto} alt="Therapist photo preview" className="w-24 h-24 rounded-full object-cover border" />
                    </button>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border">No photo</div>
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
                  <p className="text-xs text-muted-foreground">PNG or JPG. Max 2MB. Click preview to enlarge.</p>
                </div>
              </div>
            </div>
            <div><Label>Bio (max 300 chars)</Label><Textarea maxLength={300} value={editing.bio || ""} onChange={e => setEditing({...editing, bio: e.target.value})} /></div>
            {[
              { key: "specialisations", label: "Specialisations", opts: SPECS },
              { key: "languages", label: "Languages", opts: LANGS },
              { key: "session_types", label: "Session types", opts: SESSION_TYPES },
              { key: "availability", label: "Availability", opts: AVAILABILITY },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {opts.map(o => {
                    const selected = (((editing as any)[key]) as string[] || []).includes(o);
                    return (
                      <button key={o} type="button" onClick={() => toggleArray(key as keyof Therapist, o)}
                        className={`px-3 py-1 rounded-full text-xs border ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>License status</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={editing.license_status} onChange={e => setEditing({...editing, license_status: e.target.value as any})}>
                  <option value="pending">Pending</option><option value="verified">Verified</option><option value="suspended">Suspended</option>
                </select>
              </div>
              <div><Label>Platform status</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={editing.platform_status} onChange={e => setEditing({...editing, platform_status: e.target.value as any})}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="w-full">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing.id ? "Save Changes" : "Save & Send Welcome Email")}</Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {confirmRemove?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Their historical session records will be retained but they will no longer appear to clients or accept new bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doRemove} className="bg-red-600 hover:bg-red-700">Confirm Removal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmSuspend} onOpenChange={() => setConfirmSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {confirmSuspend?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Suspended therapists cannot accept new bookings. Existing sessions are preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div><Label>Reason for suspension *</Label><Textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} /></div>
            <div><Label>Review date</Label><Input type="date" value={suspendDate} onChange={e => setSuspendDate(e.target.value)} /></div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doSuspend} disabled={!suspendReason}>Suspend</AlertDialogAction>
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
          <img src={previewPhoto} alt="Therapist photo" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}