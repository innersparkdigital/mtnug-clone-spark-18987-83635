import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Download, Upload, QrCode, Save, BarChart3 } from 'lucide-react';

interface Props {
  company: any;
  onUpdated: () => void;
}

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'lg', label: 'Luganda' },
  { code: 'sw', label: 'Kiswahili' },
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const CampaignSettingsCard = ({ company, onUpdated }: Props) => {
  const [form, setForm] = useState({
    slug: company.slug || slugify(company.name || ''),
    logo_url: company.logo_url || '',
    campaign_headline: company.campaign_headline || '',
    campaign_subtext: company.campaign_subtext || '',
    campaign_close_date: company.campaign_close_date ? company.campaign_close_date.slice(0, 16) : '',
    mode: company.mode || 'corporate',
    languages_enabled: (company.languages_enabled as string[]) || ['en'],
    incentive_amount_ugx: company.incentive_amount_ugx || 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [faqStats, setFaqStats] = useState<{ opens: number; items: Record<number, number>; sessions: number }>({ opens: 0, items: {}, sessions: 0 });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const campaignUrl = useMemo(() => `${baseUrl}/check/${form.slug}`, [baseUrl, form.slug]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('campaign_faq_events')
        .select('event_type,item_index,session_id')
        .eq('company_id', company.id);
      if (!data) return;
      const opens = data.filter((e: any) => e.event_type === 'faq_opened').length;
      const sessions = new Set(data.map((e: any) => e.session_id)).size;
      const items: Record<number, number> = {};
      data.filter((e: any) => e.event_type === 'faq_item_opened' && typeof e.item_index === 'number').forEach((e: any) => {
        items[e.item_index] = (items[e.item_index] || 0) + 1;
      });
      setFaqStats({ opens, items, sessions });
    })();
  }, [company.id]);

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${company.id}/logo-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('company-logos').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('company-logos').getPublicUrl(path);
      setForm(p => ({ ...p, logo_url: data.publicUrl }));
      toast.success('Logo uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    const payload: any = {
      slug: slugify(form.slug),
      logo_url: form.logo_url || null,
      campaign_headline: form.campaign_headline.trim() || null,
      campaign_subtext: form.campaign_subtext.trim() || null,
      campaign_close_date: form.campaign_close_date ? new Date(form.campaign_close_date).toISOString() : null,
      mode: form.mode,
      languages_enabled: form.languages_enabled.length ? form.languages_enabled : ['en'],
      incentive_amount_ugx: Number(form.incentive_amount_ugx) || 0,
    };
    const { error } = await supabase.from('corporate_companies').update(payload).eq('id', company.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Campaign settings saved');
    onUpdated();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(campaignUrl);
    toast.success('Link copied');
  };

  const downloadQr = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(campaignUrl, { width: 600, margin: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${form.slug}-qr.png`;
      a.click();
    } catch (e: any) {
      toast.error('QR generation failed');
    }
  };

  const toggleLang = (code: string) => {
    setForm(p => ({
      ...p,
      languages_enabled: p.languages_enabled.includes(code)
        ? p.languages_enabled.filter(c => c !== code)
        : [...p.languages_enabled, code],
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Landing Page</CardTitle>
          <CardDescription>Branded URL employees visit to take the screening. Share via QR or link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-muted/40 rounded-md p-3">
            <div className="text-sm font-mono break-all">{campaignUrl}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyLink}><Copy className="w-4 h-4 mr-1" />Copy link</Button>
              <Button size="sm" variant="outline" onClick={downloadQr}><QrCode className="w-4 h-4 mr-1" />Download QR</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="acme-co" />
              <p className="text-[11px] text-muted-foreground mt-1">Lowercase letters, numbers, dashes only.</p>
            </div>
            <div>
              <Label>Mode</Label>
              <Select value={form.mode} onValueChange={v => setForm(p => ({ ...p, mode: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                {form.logo_url && <img src={form.logo_url} alt="logo" className="h-12 w-12 rounded object-contain bg-white border" />}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm border rounded-md px-3 py-2 hover:bg-muted">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading…' : (form.logo_url ? 'Replace logo' : 'Upload logo')}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                </label>
                {form.logo_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, logo_url: '' }))}>Remove</Button>}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Headline (optional — auto-generated if blank)</Label>
              <Input value={form.campaign_headline} onChange={e => setForm(p => ({ ...p, campaign_headline: e.target.value }))} placeholder={`How are you really doing, ${company.name}?`} />
            </div>
            <div className="md:col-span-2">
              <Label>Subtext</Label>
              <Textarea rows={2} value={form.campaign_subtext} onChange={e => setForm(p => ({ ...p, campaign_subtext: e.target.value }))} placeholder="A 5-minute private check-in. Your answers stay confidential." />
            </div>
            <div>
              <Label>Campaign close date</Label>
              <Input type="datetime-local" value={form.campaign_close_date} onChange={e => setForm(p => ({ ...p, campaign_close_date: e.target.value }))} />
              <p className="text-[11px] text-muted-foreground mt-1">Countdown hidden when blank.</p>
            </div>
            <div>
              <Label>Incentive amount (UGX)</Label>
              <Input type="number" min={0} value={form.incentive_amount_ugx} onChange={e => setForm(p => ({ ...p, incentive_amount_ugx: parseInt(e.target.value) || 0 }))} />
              <p className="text-[11px] text-muted-foreground mt-1">Set 0 to hide incentive on landing page.</p>
            </div>
            <div className="md:col-span-2">
              <Label>Languages enabled</Label>
              <div className="flex gap-4 mt-1">
                {LANGS.map(l => (
                  <label key={l.code} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form.languages_enabled.includes(l.code)} onCheckedChange={() => toggleLang(l.code)} />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}><Save className="w-4 h-4 mr-1" />{saving ? 'Saving…' : 'Save campaign settings'}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-4 h-4" /> FAQ Engagement</CardTitle>
          <CardDescription>How employees interact with the Screening Anxiety FAQ on this landing page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-muted/40 rounded-md p-3 text-center">
              <div className="text-2xl font-bold">{faqStats.sessions}</div>
              <p className="text-xs text-muted-foreground">Unique visitors</p>
            </div>
            <div className="bg-muted/40 rounded-md p-3 text-center">
              <div className="text-2xl font-bold">{faqStats.opens}</div>
              <p className="text-xs text-muted-foreground">FAQ opened</p>
            </div>
            <div className="bg-muted/40 rounded-md p-3 text-center">
              <div className="text-2xl font-bold">{Object.values(faqStats.items).reduce((a, b) => a + b, 0)}</div>
              <p className="text-xs text-muted-foreground">Item expansions</p>
            </div>
          </div>
          {Object.keys(faqStats.items).length === 0 ? (
            <p className="text-sm text-muted-foreground">No FAQ engagement events yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(faqStats.items).sort((a, b) => b[1] - a[1]).map(([idx, count]) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-1">
                  <span>FAQ item #{Number(idx) + 1}</span>
                  <span className="font-mono">{count} opens</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSettingsCard;