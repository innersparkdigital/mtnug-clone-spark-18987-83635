import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, KeyRound, Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/copyToClipboard';

type HrAdmin = { id: string; full_name: string; email: string; is_active: boolean; created_at: string };
type Request = { id: string; request_type: string; service_code: string | null; message: string; status: string; created_at: string };
type Order = { id: string; credits: number; amount_ugx: number; status: string; payment_ref: string | null; created_at: string };
type Overview = { admins: HrAdmin[]; requests: Request[]; orders: Order[]; credit_balance: number; assessment_invites: { issued: number; completed: number } };

const DASHBOARD_PATH = '/corporate-dashboard';

export default function CorporateHrOperations({ companyId, companyName }: { companyId: string; companyName?: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});

  const dashboardUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${DASHBOARD_PATH}` : DASHBOARD_PATH;

  const load = async () => {
    setLoading(true);
    const { data: result, error } = await supabase.rpc('admin_corporate_account_overview' as any, { _company_id: companyId });
    if (error) {
      toast.error(error.message);
      setData(null);
    } else setData(result as unknown as Overview);
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, [companyId]);

  const invite = async () => {
    if (!name.trim() || !email.trim()) return toast.error('Enter the company admin name and email');
    setBusy(true);
    const { data: result, error } = await supabase.functions.invoke('admin-invite-corporate-hr', {
      body: { company_id: companyId, full_name: name.trim(), email: email.trim() },
    });
    setBusy(false);
    if (error || result?.error) return toast.error(result?.error || error?.message || 'Invitation failed');
    toast.success('Company dashboard invitation sent');
    setName('');
    setEmail('');
    await load();
  };

  const setHrActive = async (account: HrAdmin) => {
    if (account.is_active && !window.confirm(`Suspend ${account.email}'s company dashboard access?`)) return;
    const { data: changed, error } = await supabase.rpc('admin_set_corporate_hr_active' as any, {
      _company_id: companyId,
      _admin_id: account.id,
      _active: !account.is_active,
    });
    if (error || !changed) return toast.error(error?.message || 'Account not found');
    toast.success(account.is_active ? 'Access suspended' : 'Access restored');
    await load();
  };

  const updateRequest = async (id: string, status: string) => {
    const { data: changed, error } = await supabase.rpc('admin_update_corporate_request' as any, {
      _request_id: id,
      _status: status,
    });
    if (error || !changed) return toast.error(error?.message || 'Request not found');
    await load();
  };

  const confirmPayment = async (order: Order) => {
    const ref = paymentRefs[order.id]?.trim();
    if (!ref) return toast.error('Enter a verified payment reference first');
    if (
      !window.confirm(
        `Have you independently verified payment of UGX ${order.amount_ugx.toLocaleString()} for ${order.credits} credits?`,
      )
    )
      return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('psych_confirm_order_paid' as any, {
      _order_id: order.id,
      _payment_ref: ref,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(result?.already_paid ? 'Order was already paid' : 'Payment recorded and credits added');
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading company dashboard accounts…
      </div>
    );
  }
  if (!data) return <Button variant="outline" onClick={load}>Retry loading company accounts</Button>;

  const activeCount = data.admins.filter((a) => a.is_active).length;

  return (
    <div className="space-y-5">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Company dashboard access
            {companyName ? <span className="font-normal text-muted-foreground">· {companyName}</span> : null}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            This is how organisation administrators sign in to see <strong>aggregate</strong> wellbeing for their company
            only. It is separate from this InnerSpark staff admin page. Individual employee answers are never shown on
            their dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild className="gap-1.5">
            <Link to={DASHBOARD_PATH} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open company dashboard login
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={async () => {
              const ok = await copyToClipboard(dashboardUrl);
              toast.success(ok ? 'Dashboard link copied' : dashboardUrl);
            }}
          >
            <KeyRound className="h-4 w-4" />
            Copy dashboard link
          </Button>
          <Badge variant={activeCount > 0 ? 'default' : 'secondary'} className="h-9 px-3 text-xs font-medium">
            {activeCount > 0 ? `${activeCount} active login${activeCount === 1 ? '' : 's'}` : 'No active logins yet'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invite company / organisation administrator</CardTitle>
          <CardDescription>
            Sends a login invitation for <code className="text-xs">{DASHBOARD_PATH}</code>. They will not get InnerSpark
            staff admin access — only this company’s aggregate view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="hr-name">Full name</Label>
              <Input id="hr-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Nakato" />
            </div>
            <div>
              <Label htmlFor="hr-email">Work email</Label>
              <Input
                id="hr-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hr@company.com"
              />
            </div>
          </div>
          <Button disabled={busy} onClick={invite} className="gap-1.5">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Send dashboard invitation
          </Button>

          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked administrators</p>
            {data.admins.map((a) => (
              <div key={a.id} className="rounded-lg border p-3 text-sm flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {a.full_name}{' '}
                    <Badge variant={a.is_active ? 'default' : 'outline'} className="ml-1 text-[10px]">
                      {a.is_active ? 'Active' : 'Suspended'}
                    </Badge>
                  </p>
                  <p className="text-muted-foreground text-xs">{a.email}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Added {new Date(a.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setHrActive(a)}>
                  {a.is_active ? 'Suspend access' : 'Restore access'}
                </Button>
              </div>
            ))}
            {!data.admins.length && (
              <p className="text-sm text-muted-foreground rounded-md border border-dashed p-4 text-center">
                No company administrators yet. Invite one above so they can open the company dashboard.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service requests from this company</CardTitle>
          <CardDescription>Requests the company admin submits from their dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.requests.map((r) => (
            <div key={r.id} className="border-t pt-3 text-sm first:border-0 first:pt-0">
              <div className="font-semibold">
                {r.request_type} {r.service_code ? `· ${r.service_code}` : ''} · {r.status}
              </div>
              <p className="whitespace-pre-wrap break-words my-2">{r.message}</p>
              <div className="flex flex-wrap gap-2">
                {(['new', 'in_progress', 'done', 'closed'] as const)
                  .filter((s) => s !== r.status)
                  .map((s) => (
                    <Button key={s} size="sm" variant="outline" onClick={() => updateRequest(r.id, s)}>
                      {s.replace('_', ' ')}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
          {!data.requests.length && (
            <p className="text-sm text-muted-foreground">No requests from this company yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment credits · {data.credit_balance} available</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {data.assessment_invites?.issued || 0} links issued · {data.assessment_invites?.completed || 0} completed.
            Individual answers are not shown here.
          </p>
          {data.orders.map((o) => (
            <div key={o.id} className="border-t pt-3 text-sm space-y-2">
              <p>
                <strong>
                  {o.credits} credits · UGX {o.amount_ugx.toLocaleString()}
                </strong>{' '}
                · {o.status} · {new Date(o.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">Order reference: {o.id}</p>
              {o.status === 'awaiting_payment' && (
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-48">
                    <Label htmlFor={`payment-${o.id}`}>Verified payment reference</Label>
                    <Input
                      id={`payment-${o.id}`}
                      value={paymentRefs[o.id] || ''}
                      onChange={(e) => setPaymentRefs((p) => ({ ...p, [o.id]: e.target.value }))}
                    />
                  </div>
                  <Button disabled={busy} onClick={() => confirmPayment(o)}>
                    Confirm verified payment
                  </Button>
                </div>
              )}
            </div>
          ))}
          {!data.orders.length && <p className="text-sm text-muted-foreground">No credit requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

