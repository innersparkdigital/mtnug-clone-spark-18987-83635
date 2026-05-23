import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

type Item = { icon?: string; value: string; label: string };
type SectionData = { eyebrow?: string; title?: string; items: Item[] };
type Section = { id: string; section_key: string; is_visible: boolean; data: SectionData };

const SECTIONS: { key: string; title: string; description: string; hasHeader: boolean; hasIcons: boolean }[] = [
  {
    key: "trust_stats_bar",
    title: "Trust Stats Bar",
    description: "Blue strip on the homepage showing countries, languages, availability, confidentiality.",
    hasHeader: false,
    hasIcons: true,
  },
  {
    key: "impact_counter",
    title: "Impact Counter",
    description: "Our impact section with sessions delivered, people supported, organizations enrolled.",
    hasHeader: true,
    hasIcons: false,
  },
];

const ICON_OPTIONS = ["Globe", "Languages", "Clock", "Shield", "Users", "Heart", "Star", "Award", "TrendingUp", "CheckCircle"];

const VISIBILITY_ONLY: { key: string; title: string; description: string }[] = [
  { key: "hero_section", title: "Hero Section", description: "Main banner at the top of the homepage." },
  { key: "how_it_works_simple", title: "How It Works (Simple)", description: "3-step quick explainer near the top of the homepage." },
  { key: "concerns_section", title: "Clinical Concerns", description: "Grid of conditions we support." },
  { key: "why_innerspark", title: "Why InnerSpark", description: "Value props and differentiators." },
  { key: "built_for_africa", title: "Built for Africa", description: "WhatsApp & low-bandwidth highlight." },
  { key: "who5_banner", title: "WHO-5 Wellbeing Banner", description: "Green strip linking to wellbeing check." },
  { key: "therapist_showcase", title: "Therapist Showcase", description: "Featured therapists carousel." },
  { key: "testimonials", title: "Testimonials", description: "Client testimonials section." },
  { key: "how_it_works_detailed", title: "How It Works (Detailed)", description: "Long-form explainer with mockups." },
  { key: "whisper_teaser", title: "Whisper Teaser", description: "Anonymous voice message feature promo." },
  { key: "sdg_alignment", title: "SDG Alignment", description: "UN Sustainable Development Goals strip." },
  { key: "partners", title: "Partners", description: "Partner logos section." },
  { key: "events_section", title: "Events & Trainings", description: "Upcoming events and trainings." },
];

const SiteSectionsTab = () => {
  const [sections, setSections] = useState<Record<string, Section>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("site_sections").select("*");
    if (error) {
      toast.error("Failed to load sections: " + error.message);
    } else {
      const map: Record<string, Section> = {};
      (data || []).forEach((s: Section) => { map[s.section_key] = s; });
      setSections(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateSection = (key: string, patch: Partial<Section>) => {
    setSections(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const updateData = (key: string, patch: Partial<SectionData>) => {
    setSections(prev => ({ ...prev, [key]: { ...prev[key], data: { ...prev[key].data, ...patch } } }));
  };

  const updateItem = (key: string, idx: number, patch: Partial<Item>) => {
    const items = [...(sections[key].data.items || [])];
    items[idx] = { ...items[idx], ...patch };
    updateData(key, { items });
  };

  const addItem = (key: string, hasIcons: boolean) => {
    const items = [...(sections[key].data.items || [])];
    items.push(hasIcons ? { icon: "Star", value: "", label: "" } : { value: "", label: "" });
    updateData(key, { items });
  };

  const removeItem = (key: string, idx: number) => {
    const items = (sections[key].data.items || []).filter((_, i) => i !== idx);
    updateData(key, { items });
  };

  const save = async (key: string) => {
    setSaving(key);
    const s = sections[key];
    const { error } = await (supabase as any)
      .from("site_sections")
      .update({ is_visible: s.is_visible, data: s.data })
      .eq("id", s.id);
    setSaving(null);
    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Saved. Changes are live on the homepage.");
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Homepage Section Visibility</CardTitle>
          <CardDescription>Toggle to show or hide entire sections on the homepage. Changes are live immediately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {VISIBILITY_ONLY.map(meta => {
            const s = sections[meta.key];
            if (!s) return null;
            return (
              <div key={meta.key} className="flex items-center justify-between gap-4 border border-border rounded-lg p-3">
                <div className="min-w-0">
                  <div className="font-medium text-sm">{meta.title}</div>
                  <div className="text-xs text-muted-foreground">{meta.description}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={s.is_visible}
                    onCheckedChange={async (v) => {
                      updateSection(meta.key, { is_visible: v });
                      const { error } = await (supabase as any)
                        .from("site_sections")
                        .update({ is_visible: v })
                        .eq("id", s.id);
                      if (error) toast.error("Save failed: " + error.message);
                      else toast.success(`${meta.title} ${v ? "shown" : "hidden"}`);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {SECTIONS.map(meta => {
        const s = sections[meta.key];
        if (!s) return null;
        return (
          <Card key={meta.key}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{meta.title}</CardTitle>
                  <CardDescription>{meta.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`vis-${meta.key}`} className="text-sm">Show on site</Label>
                  <Switch
                    id={`vis-${meta.key}`}
                    checked={s.is_visible}
                    onCheckedChange={(v) => updateSection(meta.key, { is_visible: v })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {meta.hasHeader && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Eyebrow text</Label>
                    <Input value={s.data.eyebrow || ""} onChange={e => updateData(meta.key, { eyebrow: e.target.value })} />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input value={s.data.title || ""} onChange={e => updateData(meta.key, { title: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Items</Label>
                {(s.data.items || []).map((it, idx) => (
                  <div key={idx} className="grid gap-2 md:grid-cols-12 items-end border border-border rounded-lg p-3">
                    {meta.hasIcons && (
                      <div className="md:col-span-3">
                        <Label className="text-xs">Icon</Label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={it.icon || "Star"}
                          onChange={e => updateItem(meta.key, idx, { icon: e.target.value })}
                        >
                          {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    )}
                    <div className={meta.hasIcons ? "md:col-span-3" : "md:col-span-4"}>
                      <Label className="text-xs">Value</Label>
                      <Input value={it.value} onChange={e => updateItem(meta.key, idx, { value: e.target.value })} placeholder="e.g. 5,200+" />
                    </div>
                    <div className={meta.hasIcons ? "md:col-span-5" : "md:col-span-7"}>
                      <Label className="text-xs">Label</Label>
                      <Input value={it.label} onChange={e => updateItem(meta.key, idx, { label: e.target.value })} placeholder="e.g. Sessions delivered" />
                    </div>
                    <div className="md:col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(meta.key, idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addItem(meta.key, meta.hasIcons)} className="gap-2">
                  <Plus className="h-4 w-4" /> Add item
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => save(meta.key)} disabled={saving === meta.key} className="gap-2">
                  {saving === meta.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SiteSectionsTab;
