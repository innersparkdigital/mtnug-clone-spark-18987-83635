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
import RichTextEditor from "./RichTextEditor";
import { BLOG_BODY_TEMPLATE } from "./blogTemplate";

interface FaqItem { question: string; answer: string }

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
  meta_description: string | null;
  meta_keywords: string | null;
  meta_title: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  faqs: FaqItem[] | null;
  related_service_url: string | null;
  schema_type: string | null;
  last_updated_at: string | null;
  redirect_from_slug: string | null;
}

const SERVICE_PAGES = [
  "/book-therapist",
  "/online-therapy",
  "/chat-therapy",
  "/specialists",
  "/mind-check",
  "/wellbeing-check",
  "/support-groups",
  "/psychiatrist-kampala",
  "/counselling-services-uganda",
  "/marriage-counselling-kampala",
  "/therapist-near-me-kampala",
];

const empty: Partial<BlogPost> = {
  slug: "", title: "", excerpt: "", content: "", category: "Mental Health",
  hero_image_url: "", author: "InnerSpark Team", read_time: "5 min read",
  status: "draft", scheduled_for: null, meta_description: "", meta_keywords: "",
  meta_title: "", canonical_url: "", og_title: "", og_description: "", og_image_url: "",
  faqs: [], related_service_url: "/book-therapist", schema_type: "Article",
  last_updated_at: null, redirect_from_slug: "",
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
    else setPosts(data as unknown as BlogPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (p: BlogPost) => {
    setForm({ ...p, faqs: Array.isArray(p.faqs) ? p.faqs : [] });
    setOpen(true);
  };

  const faqList: FaqItem[] = Array.isArray(form.faqs) ? form.faqs : [];
  const setFaq = (i: number, patch: Partial<FaqItem>) => {
    const next = faqList.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    setForm({ ...form, faqs: next });
  };
  const addFaq = () => setForm({ ...form, faqs: [...faqList, { question: "", answer: "" }] });
  const removeFaq = (i: number) => setForm({ ...form, faqs: faqList.filter((_, idx) => idx !== i) });

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
      meta_description: form.meta_description?.trim() || null,
      meta_keywords: form.meta_keywords?.trim() || null,
      meta_title: form.meta_title?.trim() || null,
      canonical_url: form.canonical_url?.trim() || `https://www.innersparkafrica.com/blog/${slug}`,
      og_title: form.og_title?.trim() || null,
      og_description: form.og_description?.trim() || null,
      og_image_url: form.og_image_url?.trim() || null,
      faqs: faqList.filter((f) => f.question.trim() && f.answer.trim()),
      related_service_url: form.related_service_url?.trim() || null,
      schema_type: form.schema_type || "Article",
      last_updated_at: form.last_updated_at || new Date().toISOString(),
      redirect_from_slug: form.redirect_from_slug?.trim() || null,
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
              <Label>Title * <span className="text-xs font-normal text-muted-foreground">(on-page headline / H1)</span></Label>
              <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Slug</Label><Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            </div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO — Meta title</Label>
                <Input
                  maxLength={70}
                  placeholder="What Google shows as the clickable headline (under 60 chars)"
                  value={form.meta_title || ""}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">{(form.meta_title || "").length}/60 recommended. Leave blank to use the Title.</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO — Meta description</Label>
                <Textarea
                  rows={2}
                  maxLength={160}
                  placeholder="What Google shows under the title in search results (max 160 chars)"
                  value={form.meta_description || ""}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">{(form.meta_description || "").length}/160 characters</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO — Target keywords</Label>
                <Input
                  placeholder="anxiety therapy uganda, online counselling kampala, mental health support"
                  value={form.meta_keywords || ""}
                  onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Comma-separated. Helps Google understand what searches this post should rank for.</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Canonical URL</Label>
                <Input
                  placeholder={`https://www.innersparkafrica.com/blog/${form.slug || "your-slug"}`}
                  value={form.canonical_url || ""}
                  onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Auto-filled from the slug when left blank.</p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open Graph / social preview</p>
              <div><Label>OG title</Label><Input placeholder="Defaults to the SEO title" value={form.og_title || ""} onChange={(e) => setForm({ ...form, og_title: e.target.value })} /></div>
              <div><Label>OG description</Label><Textarea rows={2} placeholder="Defaults to the meta description" value={form.og_description || ""} onChange={(e) => setForm({ ...form, og_description: e.target.value })} /></div>
              <div><Label>OG image URL (1200×630)</Label><Input placeholder="Defaults to the hero image" value={form.og_image_url || ""} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} /></div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">FAQ block (Google rich snippets)</p>
                <Button size="sm" variant="outline" onClick={addFaq} className="gap-1"><Plus className="h-3 w-3" /> Add question</Button>
              </div>
              {faqList.length === 0 && <p className="text-[11px] text-muted-foreground">No questions yet. Three to five well-written FAQs often win a rich result.</p>}
              {faqList.map((f, i) => (
                <div key={i} className="rounded-md border bg-background p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Question" value={f.question} onChange={(e) => setFaq(i, { question: e.target.value })} />
                    <Button size="sm" variant="ghost" onClick={() => removeFaq(i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                  <Textarea rows={2} placeholder="Answer" value={f.answer} onChange={(e) => setFaq(i, { answer: e.target.value })} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Related service page</Label>
                <Select value={form.related_service_url || ""} onValueChange={(v) => setForm({ ...form, related_service_url: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose a page" /></SelectTrigger>
                  <SelectContent>
                    {SERVICE_PAGES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Schema type</Label>
                <Select value={form.schema_type || "Article"} onValueChange={(v) => setForm({ ...form, schema_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="FAQ">FAQ</SelectItem>
                    <SelectItem value="HowTo">HowTo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Last updated date</Label>
                <Input
                  type="datetime-local"
                  value={form.last_updated_at?.slice(0, 16) || ""}
                  onChange={(e) => setForm({ ...form, last_updated_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Separate from the publish date. Set when you meaningfully revise the post.</p>
              </div>
              <div>
                <Label>Redirect from old slug</Label>
                <Input placeholder="old-slug-that-changed" value={form.redirect_from_slug || ""} onChange={(e) => setForm({ ...form, redirect_from_slug: e.target.value })} />
                <p className="text-[11px] text-muted-foreground mt-1">Visitors hitting the old URL land on this post instead of a 404.</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Label>Content</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const hasBody = (form.content || "").replace(/<[^>]*>/g, "").trim().length > 0;
                    if (hasBody && !confirm("Append the standard InnerSpark blog structure to the current content?")) return;
                    setForm((f) => ({ ...f, content: hasBody ? `${f.content}\n${BLOG_BODY_TEMPLATE}` : BLOG_BODY_TEMPLATE }));
                  }}
                >
                  Insert standard structure
                </Button>
              </div>
              <RichTextEditor
                value={form.content || ""}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="Write your blog post — use the toolbar for headings, paragraphs, lists, images and links."
              />
            </div>
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