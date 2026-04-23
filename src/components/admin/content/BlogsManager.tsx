import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { uploadContentMedia, slugify } from "./uploadMedia";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  hero_image_url: string | null;
  author: string | null;
  read_time: string | null;
  status: string;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
}

const empty: Partial<BlogPost> = {
  slug: "", title: "", excerpt: "", content: "", category: "Mental Health",
  hero_image_url: "", author: "InnerSpark Team", read_time: "5 min read",
  status: "draft", scheduled_for: null,
};

const BlogsManager = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<BlogPost>>(empty);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data as BlogPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (p: BlogPost) => { setForm(p); setOpen(true); };

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadContentMedia(file, "blogs");
      setForm((f) => ({ ...f, hero_image_url: url }));
      toast.success("Image uploaded");
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const save = async (publishNow = false) => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const status = publishNow ? "published" : (form.status || "draft");
    const payload: any = {
      slug, title: form.title, excerpt: form.excerpt || null,
      content: form.content || "", category: form.category || null,
      hero_image_url: form.hero_image_url || null, author: form.author || "InnerSpark Team",
      read_time: form.read_time || null, status,
      scheduled_for: form.scheduled_for || null,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: user?.id,
    };
    const { error } = form.id
      ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(publishNow ? "Post published" : "Post saved");
    setOpen(false); fetchPosts();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetchPosts(); }
  };

  const togglePublish = async (p: BlogPost) => {
    const newStatus = p.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("blog_posts").update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    }).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(newStatus === "published" ? "Published" : "Unpublished"); fetchPosts(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Blog Posts</h3>
          <p className="text-sm text-muted-foreground">{posts.length} total · {posts.filter(p => p.status === "published").length} published</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
      </div>

      {loading ? <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              {p.hero_image_url && <img src={p.hero_image_url} alt="" className="w-full h-32 object-cover" loading="lazy" />}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold line-clamp-2">{p.title}</h4>
                  <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
                </div>
                {p.category && <Badge variant="outline" className="text-xs">{p.category}</Badge>}
                <p className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => togglePublish(p)}>
                    <Eye className="h-3 w-3 mr-1" />{p.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-full">No blog posts yet</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit" : "New"} Blog Post</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Slug</Label><Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            </div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div>
              <Label>Hero Image</Label>
              <div className="flex gap-2 items-center">
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} disabled={uploading} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {form.hero_image_url && <img src={form.hero_image_url} alt="" className="mt-2 h-24 rounded object-cover" />}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Author</Label><Input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
              <div><Label>Read time</Label><Input value={form.read_time || ""} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="5 min read" /></div>
            </div>
            <div><Label>Content (HTML supported)</Label><Textarea rows={12} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className="font-mono text-xs" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={form.status || "draft"} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.status === "scheduled" && (
                <div><Label>Schedule for</Label><Input type="datetime-local" value={form.scheduled_for?.slice(0, 16) || ""} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
              )}
            </div>
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

export default BlogsManager;