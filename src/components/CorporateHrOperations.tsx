import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type HrAdmin = { id: string; full_name: string; email: string; is_active: boolean; created_at: string };
type Request = { id: string; request_type: string; service_code: string | null; message: string; status: string; created_at: string };
type Order = { id: string; credits: number; amount_ugx: number; status: string; payment_ref: string | null; created_at: string };
type Overview = { admins: HrAdmin[]; requests: Request[]; orders: Order[]; credit_balance: number; assessment_invites: { issued: number; completed: number } };

export default function CorporateHrOperations({ companyId }: { companyId: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});
  const load = async () => {
    setLoading(true);
    const { data: result, error } = await supabase.rpc('admin_corporate_account_overview' as any, { _company_id: companyId });
    if (error) { toast.error(error.message); setData(null); }
    else setData(result as unknown as Overview);
    setLoading(false);
  };
  useEffect(() => { void load(); }, [companyId]);

  const invite = async () => {
    if (!name.trim() || !email.trim()) return toast.error('Enter the HR contact name and email');
    setBusy(true);
    const { data: result, error } = await supabase.functions.invoke('admin-invite-corporate-hr', {
      body: { company_id: companyId, full_name: name.trim(), email: email.trim() },
    });
    setBusy(false);
    if (error || result?.error) return toast.error(result?.error || error?.message || 'Invitation failed');
    toast.success('HR invitation sent');
    setName(''); setEmail('');
    await load();
  };
  const updateRequest = async (id: string, status: string) => {
    const { data: changed, error } = await supabase.rpc('admin_update_corporate_request' as any, { _request_id: id, _status: status });
    if (error || !changed) return toast.error(error?.message || 'Request not found');
    await load();
  };
  const confirmPayment = async (order: Order) => {
    const ref = paymentRefs[order.id]?.trim();
    if (!ref) return toast.error('Enter a verified payment reference first');
    if (!window.confirm(`Have you independently verified payment of UGX ${order.amount_ugx.toLocaleString()} for ${order.credits} credits?`)) return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('psych_confirm_order_paid' as any, { _order_id: order.id, _payment_ref: ref });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(result?.already_paid ? 'Order was already paid' : 'Payment recorded and credits added');
    await load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading HR accounts and credit requests…</p>;
  if (!data) return <Button variant="outline" onClick={load}>Retry loading company accounts</Button>;
  return <div className="space-y-5">
    <Card><CardHeader><CardTitle className="text-lg">Company HR accounts</CardTitle></CardHeader><CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">Only InnerSpark staff can invite company HR. Each account is tied to this company; it does not receive staff admin access.</p>
      <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="hr-name">HR contact name</Label><Input id="hr-name" value={name} onChange={e => setName(e.target.value)} /></div><div><Label htmlFor="hr-email">HR contact email</Label><Input id="hr-email" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
      <Button disabled={busy} onClick={invite}>Send HR invitation</Button>
      {data.admins.map(a => <div key={a.id} className="border-t pt-3 text-sm"><strong>{a.full_name}</strong> · {a.email} · {a.is_active ? 'Active' : 'Inactive'}</div>)}
      {!data.admins.length && <p className="text-sm text-muted-foreground">No HR accounts linked yet.</p>}
    </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Service requests</CardTitle></CardHeader><CardContent className="space-y-3">
      {data.requests.map(r => <div key={r.id} className="border-t pt-3 text-sm"><div className="font-semibold">{r.request_type} {r.service_code ? `· ${r.service_code}` : ''} · {r.status}</div><p className="whitespace-pre-wrap break-words my-2">{r.message}</p><div className="flex flex-wrap gap-2">{(['new','in_progress','done','closed'] as const).filter(s => s !== r.status).map(s => <Button key={s} size="sm" variant="outline" onClick={() => updateRequest(r.id, s)}>{s.replace('_',' ')}</Button>)}</div></div>)}
      {!data.requests.length && <p className="text-sm text-muted-foreground">No requests from this company yet.</p>}
    </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Assessment credits · {data.credit_balance} available</CardTitle></CardHeader><CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground">{data.assessment_invites?.issued || 0} links issued · {data.assessment_invites?.completed || 0} completed. Individual answers are not shown here.</p>
      {data.orders.map(o => <div key={o.id} className="border-t pt-3 text-sm space-y-2"><p><strong>{o.credits} credits · UGX {o.amount_ugx.toLocaleString()}</strong> · {o.status} · {new Date(o.created_at).toLocaleDateString()}</p><p className="text-xs text-muted-foreground">Order reference: {o.id}</p>{o.status === 'awaiting_payment' && <div className="flex flex-wrap items-end gap-2"><div className="flex-1 min-w-48"><Label htmlFor={`payment-${o.id}`}>Verified payment reference</Label><Input id={`payment-${o.id}`} value={paymentRefs[o.id] || ''} onChange={e => setPaymentRefs(p => ({ ...p, [o.id]: e.target.value }))} /></div><Button disabled={busy} onClick={() => confirmPayment(o)}>Confirm verified payment</Button></div>}</div>)}
      {!data.orders.length && <p className="text-sm text-muted-foreground">No credit requests yet.</p>}
    </CardContent></Card>
  </div>;
}
