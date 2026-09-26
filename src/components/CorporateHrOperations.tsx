import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, CreditCard, ExternalLink, KeyRound, Loader2, Shield,
  Plus, Minus, Ban, RefreshCw, CheckCircle2, XCircle,
} from 'lucide-react';
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
type Order = {
  id: string; pack_id?: string | null; credits: number; amount_ugx: number; status: string;
  payment_ref: string | null; payment_method?: string | null; payer_name?: string | null;
  payer_phone?: string | null; created_at: string; paid_at?: string | null; notes?: string | null;
};
type Pack = { id: string; name: string; credits: number; price_ugx: number };
type Ledger = { id: string; delta: number; balance_after: number; reason: string; created_at: string };
type Overview = {
  admins: HrAdmin[];
  requests: Request[];
  orders: Order[];
  credit_balance: number;
  credits_suspended?: boolean;
  assessment_invites: { issued: number; completed: number; pending?: number };
  packs?: Pack[];
  ledger?: Ledger[];
};

const DASHBOARD_PATH = '/corporate-dashboard';
const fmt = (n: number) => `UGX ${Math.round(n).toLocaleString()}`;

export default function CorporateHrOperations({ companyId, companyName }: { companyId: string; companyName?: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});
  const [grantAmount, setGrantAmount] = useState('5');
  const [grantNote, setGrantNote] = useState('');
  const [setBalance, setSetBalance] = useState('');
  const [renewPackId, setRenewPackId] = useState('pack-5');
  const [suspendReason, setSuspendReason] = useState('');

  const dashboardUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${DASHBOARD_PATH}` : DASHBOARD_PATH;

  const load = async () => {
    setLoading(true);
    const { data: result, error } = await supabase.rpc('admin_corporate_account_overview' as any, { _company_id: companyId });
    if (error) {
      toast.error(error.message);
      setData(null);
    } else {
      const d = result as unknown as Overview;
      setData(d);
      if (d.packs?.length && !d.packs.find((p) => p.id === renewPackId)) {
        setRenewPackId(d.packs[0].id);
      }
    }
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
        `Approve payment of ${fmt(order.amount_ugx)} for ${order.credits} credits? Credits will be added to ${companyName || 'this company'}.`,
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
    toast.success(result?.already_paid ? 'Order was already paid' : `Approved — ${order.credits} credits added`);
    await load();
  };

  const rejectOrder = async (order: Order) => {
    const note = window.prompt('Reason for rejecting this credit request (optional):', '') ?? '';
    if (note === null) return;
    setBusy(true);
    const { error } = await supabase.rpc('admin_psych_reject_order' as any, {
      _order_id: order.id,
      _note: note || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Credit request rejected');
    await load();
  };

  const grantCredits = async () => {
    const n = parseInt(grantAmount, 10);
    if (!n || n < 1) return toast.error('Enter how many credits to add');
    if (!window.confirm(`Add ${n} psychometric credits to ${companyName || 'this company'}?`)) return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('admin_psych_adjust_credits' as any, {
      _company_id: companyId,
      _delta: n,
      _reason: 'staff_grant',
      _note: grantNote.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Granted ${n} credits · balance now ${result?.balance}`);
    setGrantNote('');
    await load();
  };

  const removeCredits = async () => {
    const n = parseInt(grantAmount, 10);
    if (!n || n < 1) return toast.error('Enter how many credits to remove');
    if (!window.confirm(`Remove ${n} credits from ${companyName || 'this company'}?`)) return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('admin_psych_adjust_credits' as any, {
      _company_id: companyId,
      _delta: -n,
      _reason: 'staff_remove',
      _note: grantNote.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Removed credits · balance now ${result?.balance}`);
    await load();
  };

  const applySetBalance = async () => {
    const n = parseInt(setBalance, 10);
    if (Number.isNaN(n) || n < 0) return toast.error('Enter a balance of 0 or more');
    if (!window.confirm(`Set credit balance for ${companyName || 'company'} to exactly ${n}?`)) return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('admin_psych_set_credits' as any, {
      _company_id: companyId,
      _balance: n,
      _reason: 'staff_set',
      _note: grantNote.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Balance set to ${result?.balance}`);
    setSetBalance('');
    await load();
  };

  const renewPack = async () => {
    if (!renewPackId) return toast.error('Pick a pack');
    const pack = data?.packs?.find((p) => p.id === renewPackId);
    if (!window.confirm(`Renew ${pack?.name || renewPackId} (+${pack?.credits ?? '?'} credits) for ${companyName || 'this company'}?`)) return;
    setBusy(true);
    const { data: result, error } = await supabase.rpc('admin_psych_renew_pack' as any, {
      _company_id: companyId,
      _pack_id: renewPackId,
      _note: grantNote.trim() || 'Staff pack renewal',
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Renewed ${result?.pack_name} · +${result?.credits_added} · balance ${result?.balance}`);
    await load();
  };

  const suspendCredits = async () => {
    if (!window.confirm(`Suspend psychometric credits for ${companyName || 'this company'}? Balance will go to 0 and HR cannot create new assessment links until restored.`)) return;
    setBusy(true);
    const { error } = await supabase.rpc('admin_psych_suspend_credits' as any, {
      _company_id: companyId,
      _reason: suspendReason.trim() || 'Suspended by InnerSpark staff',
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Credits suspended');
    setSuspendReason('');
    await load();
  };

  const unsuspendCredits = async () => {
    setBusy(true);
    const { error } = await supabase.rpc('admin_psych_unsuspend_credits' as any, { _company_id: companyId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Credits unsuspended — grant or renew to add seats');
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading company dashboard & psychometrics…
      </div>
    );
  }
  if (!data) return <Button variant="outline" onClick={load}>Retry loading company accounts</Button>;

  const activeCount = data.admins.filter((a) => a.is_active).length;
  const pendingOrders = data.orders.filter((o) => o.status === 'awaiting_payment' || o.status === 'pending');
  const suspended = !!data.credits_suspended;

  return (
    <div className="space-y-5">
      {/* ── Company dashboard access ── */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Company dashboard access
            {companyName ? <span className="font-normal text-muted-foreground">· {companyName}</span> : null}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Organisation administrators sign in at <code className="text-xs">/corporate-dashboard</code> for aggregate wellbeing only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild className="gap-1.5">
            <Link to={DASHBOARD_PATH} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Open company dashboard login
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
            <KeyRound className="h-4 w-4" /> Copy dashboard link
          </Button>
          <Badge variant={activeCount > 0 ? 'default' : 'secondary'} className="h-9 px-3 text-xs font-medium">
            {activeCount > 0 ? `${activeCount} active login${activeCount === 1 ? '' : 's'}` : 'No active logins yet'}
          </Badge>
        </CardContent>
      </Card>

      {/* ── PSYCHOMETRIC HUB (staff) ── */}
      <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-700" />
                HR psychometric hub
                {companyName ? <span className="font-normal text-muted-foreground text-base">· {companyName}</span> : null}
              </CardTitle>
              <CardDescription className="mt-1.5 max-w-2xl">
                Approve credit purchases, grant or renew seats, suspend the wallet, and open the HR assessments page.
                Catalog: Workplace Personality, Stress Resilience, Leadership, Team Collaboration, Role Fit, Aptitude Lite.
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Credit balance</p>
              <p className="text-3xl font-bold text-orange-900">{data.credit_balance}</p>
              {suspended ? (
                <Badge variant="destructive" className="mt-1">Suspended</Badge>
              ) : (
                <Badge variant="secondary" className="mt-1">Active</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{data.assessment_invites?.issued || 0} links issued</span>
            <span>·</span>
            <span>{data.assessment_invites?.completed || 0} completed</span>
            {typeof data.assessment_invites?.pending === 'number' && (
              <>
                <span>·</span>
                <span>{data.assessment_invites.pending} open</span>
              </>
            )}
            {pendingOrders.length > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-800 font-medium">{pendingOrders.length} awaiting payment approval</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="gap-1.5 bg-orange-600 hover:bg-orange-700">
              <Link to="/corporate-assessments" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Open HR psychometric hub
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/corporate-assessments`;
                const ok = await copyToClipboard(url);
                toast.success(ok ? 'Psychometric hub link copied' : url);
              }}
            >
              Copy hub link for HR
            </Button>
          </div>

          {/* Pending approvals */}
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Approve / reject credit requests
            </p>
            {pendingOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending credit purchases from HR right now.</p>
            )}
            {pendingOrders.map((o) => (
              <div key={o.id} className="border rounded-lg p-3 space-y-2 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {o.credits} credits · {fmt(o.amount_ugx)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {o.pack_id || 'pack'} · {o.status.replace(/_/g, ' ')} ·{' '}
                      {new Date(o.created_at).toLocaleString('en-GB')}
                      {o.payer_name ? ` · ${o.payer_name}` : ''}
                      {o.payer_phone ? ` · ${o.payer_phone}` : ''}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">Order {o.id}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[10rem]">
                    <Label htmlFor={`pay-${o.id}`}>Verified payment ref</Label>
                    <Input
                      id={`pay-${o.id}`}
                      className="h-9 mt-1"
                      placeholder="MM receipt / bank ref"
                      value={paymentRefs[o.id] || ''}
                      onChange={(e) => setPaymentRefs((p) => ({ ...p, [o.id]: e.target.value }))}
                    />
                  </div>
                  <Button disabled={busy} className="gap-1" onClick={() => confirmPayment(o)}>
                    <CheckCircle2 className="h-4 w-4" /> Approve & add credits
                  </Button>
                  <Button disabled={busy} variant="outline" className="gap-1 text-destructive" onClick={() => rejectOrder(o)}>
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Grant / renew / set */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-white p-4 space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" /> Grant or remove credits
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Amount</Label>
                  <Input type="number" min={1} className="mt-1 h-9" value={grantAmount} onChange={(e) => setGrantAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Note (optional)</Label>
                  <Input className="mt-1 h-9" value={grantNote} onChange={(e) => setGrantNote(e.target.value)} placeholder="Comp / promo / correction" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled={busy} size="sm" className="gap-1" onClick={grantCredits}>
                  <Plus className="h-3.5 w-3.5" /> Grant
                </Button>
                <Button disabled={busy} size="sm" variant="outline" className="gap-1" onClick={removeCredits}>
                  <Minus className="h-3.5 w-3.5" /> Remove
                </Button>
              </div>
              <div className="border-t pt-3 space-y-2">
                <Label>Set exact balance</Label>
                <div className="flex gap-2">
                  <Input type="number" min={0} className="h-9" value={setBalance} onChange={(e) => setSetBalance(e.target.value)} placeholder="e.g. 10" />
                  <Button disabled={busy} size="sm" variant="secondary" onClick={applySetBalance}>Set</Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" /> Renew pack
              </p>
              <p className="text-xs text-muted-foreground">Adds pack credits and logs a paid staff order for audit.</p>
              <div>
                <Label>Pack</Label>
                <select
                  className="w-full mt-1 h-9 rounded-md border px-2 text-sm bg-background"
                  value={renewPackId}
                  onChange={(e) => setRenewPackId(e.target.value)}
                >
                  {(data.packs || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.credits} cr · {fmt(p.price_ugx)}
                    </option>
                  ))}
                  {!(data.packs || []).length && (
                    <>
                      <option value="pack-1">Single seat · 1</option>
                      <option value="pack-5">Starter · 5</option>
                      <option value="pack-10">Team · 10</option>
                      <option value="pack-25">Department · 25</option>
                    </>
                  )}
                </select>
              </div>
              <Button disabled={busy} className="gap-1.5 w-full sm:w-auto" onClick={renewPack}>
                <RefreshCw className="h-4 w-4" /> Renew this pack
              </Button>

              <div className="border-t pt-3 space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Ban className="h-4 w-4 text-destructive" /> Suspend / restore wallet
                </p>
                {suspended ? (
                  <Button disabled={busy} variant="outline" onClick={unsuspendCredits}>
                    Restore credit access
                  </Button>
                ) : (
                  <>
                    <Input
                      className="h-9"
                      placeholder="Suspend reason (optional)"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                    />
                    <Button disabled={busy} variant="destructive" className="gap-1" onClick={suspendCredits}>
                      <Ban className="h-4 w-4" /> Suspend credits (set to 0)
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order history */}
          <div className="rounded-xl border bg-white p-4 space-y-2">
            <p className="text-sm font-semibold">All credit orders</p>
            {data.orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {data.orders.map((o) => (
                <div key={o.id} className="flex flex-wrap justify-between gap-2 text-sm border-b last:border-0 pb-2">
                  <div>
                    <span className="font-medium">{o.credits} cr · {fmt(o.amount_ugx)}</span>
                    <span className="text-xs text-muted-foreground ml-2">{new Date(o.created_at).toLocaleDateString('en-GB')}</span>
                    {o.payment_ref && <span className="text-xs text-muted-foreground ml-2">ref {o.payment_ref}</span>}
                  </div>
                  <Badge
                    variant={o.status === 'paid' ? 'default' : o.status === 'rejected' ? 'destructive' : 'secondary'}
                    className="capitalize text-[10px]"
                  >
                    {o.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Ledger */}
          {(data.ledger || []).length > 0 && (
            <div className="rounded-xl border bg-white p-4 space-y-2">
              <p className="text-sm font-semibold">Recent credit ledger</p>
              <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs">
                {data.ledger!.map((l) => (
                  <div key={l.id} className="flex justify-between gap-2 border-b last:border-0 pb-1.5">
                    <span className="text-muted-foreground truncate">{l.reason}</span>
                    <span className={l.delta >= 0 ? 'text-emerald-700 font-medium' : 'text-destructive font-medium'}>
                      {l.delta >= 0 ? '+' : ''}{l.delta} → {l.balance_after}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite HR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invite company / organisation administrator</CardTitle>
          <CardDescription>
            Sends a login invitation for <code className="text-xs">{DASHBOARD_PATH}</code>. They only see this company’s aggregate view.
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
              <Input id="hr-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hr@company.com" />
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
                </div>
                <Button size="sm" variant="outline" onClick={() => setHrActive(a)}>
                  {a.is_active ? 'Suspend access' : 'Restore access'}
                </Button>
              </div>
            ))}
            {!data.admins.length && (
              <p className="text-sm text-muted-foreground rounded-md border border-dashed p-4 text-center">
                No company administrators yet. Invite one above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service requests from this company</CardTitle>
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
          {!data.requests.length && <p className="text-sm text-muted-foreground">No requests from this company yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
