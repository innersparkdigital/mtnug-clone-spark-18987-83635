import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, CalendarCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { autoSubscribeNewsletter } from '@/lib/autoSubscribe';

const B2BScreeningBookingSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    employee_count: '',
    preferred_date: '',
    preferred_format: 'onsite',
    notes: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_name || !form.contact_email) {
      toast({ title: 'Missing details', description: 'Please fill in company, contact name and email.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('corporate_screening_bookings').insert({
        company_name: form.company_name,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || null,
        employee_count: form.employee_count ? Number(form.employee_count) : null,
        preferred_date: form.preferred_date || null,
        preferred_format: form.preferred_format,
        notes: form.notes || null,
      });
      if (error) throw error;

      // Confirmation email to company
      supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'business-inquiry',
          to: form.contact_email,
          data: { name: form.contact_name, company: form.company_name },
        },
      }).catch(err => console.error('confirmation email failed', err));

      // Notify admin
      supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'business-inquiry-notify',
          to: 'info@innersparkafrica.com',
          data: {
            name: form.contact_name,
            email: form.contact_email,
            company: form.company_name,
            message: `B2B SCREENING REQUEST\nPhone: ${form.contact_phone || 'n/a'}\nEmployees: ${form.employee_count || 'n/a'}\nPreferred date: ${form.preferred_date || 'n/a'}\nFormat: ${form.preferred_format}\nNotes: ${form.notes || 'n/a'}`,
          },
        },
      }).catch(err => console.error('admin notify failed', err));

      autoSubscribeNewsletter(form.contact_email);

      toast({ title: 'Request received', description: "We'll be in touch within 1 business day." });
      navigate('/thank-you-corporate');
    } catch (err: any) {
      toast({ title: 'Could not submit', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="b2b-screening" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <ShieldCheck className="h-4 w-4" />
              For Employers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Book a Mental Health Screening for Your Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confidential, clinician-led mental health screening for your workforce. Onsite, virtual, or hybrid — delivered by InnerSpark Africa specialists.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="p-5 flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div><p className="font-semibold">Group screening</p><p className="text-sm text-muted-foreground">Anxiety, depression, burnout, stress.</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-5 flex items-start gap-3">
              <CalendarCheck className="h-5 w-5 text-primary mt-0.5" />
              <div><p className="font-semibold">Flexible scheduling</p><p className="text-sm text-muted-foreground">Choose a date that works for your team.</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-5 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div><p className="font-semibold">Confidential</p><p className="text-sm text-muted-foreground">Aggregate insights only — individual results are private.</p></div>
            </CardContent></Card>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Request a Screening</CardTitle>
              <CardDescription>Tell us about your team and we'll respond within 1 business day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-company">Company name *</Label>
                  <Input id="b2b-company" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-contact">Contact name *</Label>
                  <Input id="b2b-contact" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-email">Work email *</Label>
                  <Input id="b2b-email" type="email" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-phone">Phone</Label>
                  <Input id="b2b-phone" type="tel" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} placeholder="+256..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-count">Approx. employees</Label>
                  <Input id="b2b-count" type="number" min={1} value={form.employee_count} onChange={(e) => update('employee_count', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b2b-date">Preferred date</Label>
                  <Input id="b2b-date" type="date" value={form.preferred_date} onChange={(e) => update('preferred_date', e.target.value)} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Preferred format</Label>
                  <Select value={form.preferred_format} onValueChange={(v) => update('preferred_format', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite at our office</SelectItem>
                      <SelectItem value="virtual">Virtual / online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="b2b-notes">Additional notes</Label>
                  <Textarea id="b2b-notes" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything specific you'd like covered?" />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitting}>
                    {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</> : 'Request Screening'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default B2BScreeningBookingSection;