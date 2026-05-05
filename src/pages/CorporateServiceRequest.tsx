import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Details {
  service: { id: string; name: string; description?: string; physical_price?: number | null; virtual_price?: number | null; per_employee_price?: number | null; unit_label?: string };
  company: { name: string; contact_person?: string; contact_email?: string; contact_phone?: string };
  report: { id: string; period_label?: string; reason?: string | null };
}

const fmt = (n?: number | null) => (n ? `UGX ${Number(n).toLocaleString('en-UG')}` : '');

export default function CorporateServiceRequest() {
  const [params] = useSearchParams();
  const reportId = params.get('report_id') || '';
  const serviceId = params.get('service_id') || '';

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<Details | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ contact_name: '', contact_email: '', contact_phone: '', message: '', preferred_mode: '' });

  useEffect(() => {
    (async () => {
      if (!reportId || !serviceId) { setLoading(false); return; }
      const { data, error } = await supabase.rpc('get_service_recommendation_details', { _report_id: reportId, _service_id: serviceId });
      if (error) console.error(error);
      const d = (data as any) as Details | null;
      setDetails(d);
      if (d?.company) {
        setForm(f => ({
          ...f,
          contact_name: d.company.contact_person || '',
          contact_email: d.company.contact_email || '',
          contact_phone: d.company.contact_phone || '',
        }));
      }
      setLoading(false);
    })();
  }, [reportId, serviceId]);

  const modes = useMemo(() => {
    const list: string[] = [];
    if (details?.service.physical_price) list.push('Physical');
    if (details?.service.virtual_price) list.push('Virtual');
    if (details?.service.per_employee_price) list.push(`Per ${details.service.unit_label || 'unit'}`);
    return list;
  }, [details]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_email) { toast.error('Please add your email'); return; }
    setSubmitting(true);
    try {
      const projectRef = (import.meta as any).env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectRef}.supabase.co/functions/v1/track-service-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: reportId, service_id: serviceId, ...form }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubmitted(true);
      toast.success('Request sent — our team will reach out shortly.');
    } catch (err: any) {
      toast.error('Could not submit: ' + (err?.message || 'unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Request Service · InnerSpark Africa</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="container max-w-2xl py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : !details ? (
          <Card><CardHeader><CardTitle>Link not valid</CardTitle><CardDescription>This service request link is invalid or expired. Please contact info@innersparkafrica.com.</CardDescription></CardHeader></Card>
        ) : submitted ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary"><CheckCircle2 className="w-6 h-6" /><CardTitle>Request received</CardTitle></div>
              <CardDescription>Thank you. Our wellness team has been notified and will contact you about <strong>{details.service.name}</strong> shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link to="/">Return home</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="text-xs uppercase tracking-wider text-primary font-semibold">Service request</div>
              <CardTitle className="text-2xl">{details.service.name}</CardTitle>
              <CardDescription>For <strong>{details.company.name}</strong>{details.report.period_label ? ` · ${details.report.period_label}` : ''}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {details.service.description && <p className="text-sm text-muted-foreground">{details.service.description}</p>}
              {details.report.reason && (
                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm">
                  <div className="font-semibold mb-1">Why we recommended this for your team</div>
                  <div className="text-muted-foreground whitespace-pre-wrap">{details.report.reason}</div>
                </div>
              )}
              <div className="rounded-md bg-primary/5 border border-primary/20 p-3 text-sm space-y-1">
                {details.service.physical_price ? <div>Physical: <strong>{fmt(details.service.physical_price)}</strong></div> : null}
                {details.service.virtual_price ? <div>Virtual: <strong>{fmt(details.service.virtual_price)}</strong></div> : null}
                {details.service.per_employee_price ? <div><strong>{fmt(details.service.per_employee_price)}</strong> / {details.service.unit_label || 'unit'}</div> : null}
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Your name</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} /></div>
                  <div><Label>Email *</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
                  {modes.length > 0 && (
                    <div>
                      <Label>Preferred mode</Label>
                      <Select value={form.preferred_mode} onValueChange={(v) => setForm({ ...form, preferred_mode: v })}>
                        <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                        <SelectContent>{modes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Anything else we should know? (optional)</Label>
                  <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Timing, group size, specific topics, accessibility needs…" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : 'Send request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}