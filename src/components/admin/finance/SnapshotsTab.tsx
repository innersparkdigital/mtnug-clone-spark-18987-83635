import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Camera, Plus, Trash2, TrendingUp, Download } from 'lucide-react';
import { exportCSV, formatUGX } from '@/lib/financeExports';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Snapshot {
  id: string;
  label: string;
  snapshot_date: string;
  cash_balance: number;
  receivables: number;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  retained_earnings: number;
  notes: string | null;
  created_at: string;
}

const SnapshotsTab = () => {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [computing, setComputing] = useState(false);
  const [computed, setComputed] = useState<{ cash: number; receivables: number } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('financial_snapshots').select('*').order('snapshot_date', { ascending: false });
    if (data) setSnapshots(data as unknown as Snapshot[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const computeCurrent = async () => {
    setComputing(true);
    const [incRes, expRes, invRes] = await Promise.all([
      supabase.from('income_entries').select('amount'),
      supabase.from('expenses').select('amount'),
      supabase.from('invoices').select('balance_due,status'),
    ]);
    const totalIncome = (incRes.data || []).reduce((s, i: any) => s + Number(i.amount), 0);
    const totalExp = (expRes.data || []).reduce((s, e: any) => s + Number(e.amount), 0);
    const receivables = (invRes.data || [])
      .filter((i: any) => ['sent', 'overdue', 'partially_paid'].includes(i.status))
      .reduce((s, i: any) => s + Number(i.balance_due), 0);
    const cash = totalIncome - totalExp;
    setComputed({ cash, receivables });
    setComputing(false);
  };

  const handleSave = async (form: { label: string; notes: string; cash_balance: number; receivables: number }) => {
    const totalAssets = form.cash_balance + form.receivables;
    const totalEquity = totalAssets;
    const { error } = await supabase.from('financial_snapshots').insert({
      label: form.label,
      notes: form.notes || null,
      cash_balance: form.cash_balance,
      receivables: form.receivables,
      total_assets: totalAssets,
      total_liabilities: 0,
      total_equity: totalEquity,
      retained_earnings: form.cash_balance,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    await supabase.from('activity_logs').insert({
      user_id: user?.id, action: 'Created balance sheet snapshot', entity_type: 'snapshot',
      details: { label: form.label, total_assets: totalAssets },
    });
    toast({ title: 'Snapshot saved' });
    setShowForm(false);
    setComputed(null);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this snapshot?')) return;
    await supabase.from('financial_snapshots').delete().eq('id', id);
    toast({ title: 'Snapshot deleted' });
    fetchAll();
  };

  const exportRows = snapshots.map(s => ({
    Date: new Date(s.snapshot_date).toLocaleDateString(),
    Label: s.label,
    'Cash & Bank (UGX)': Number(s.cash_balance),
    'Receivables (UGX)': Number(s.receivables),
    'Total Assets (UGX)': Number(s.total_assets),
    'Total Liabilities (UGX)': Number(s.total_liabilities),
    'Total Equity (UGX)': Number(s.total_equity),
    Notes: s.notes || '',
  }));

  const chartData = [...snapshots]
    .sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date))
    .map(s => ({
      date: new Date(s.snapshot_date).toLocaleDateString(),
      Assets: Number(s.total_assets),
      Cash: Number(s.cash_balance),
      Receivables: Number(s.receivables),
      Equity: Number(s.total_equity),
    }));

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Camera className="h-5 w-5 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Balance Sheet Snapshots</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Save a point-in-time financial position to compare your business health month-over-month or year-over-year.
              Cash & Receivables can be auto-computed from current data, or entered manually for adjustments.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">{snapshots.length} snapshot(s) saved</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" disabled={!snapshots.length}
            onClick={() => exportCSV(exportRows, `snapshots-${new Date().toISOString().slice(0,10)}`)}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setComputed(null); }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={computeCurrent}>
                <Plus className="h-4 w-4" /> New Snapshot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Save Balance Sheet Snapshot</DialogTitle></DialogHeader>
              <SnapshotForm onSubmit={handleSave} computed={computed} computing={computing} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {chartData.length >= 2 && (
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-primary" /> Financial Position Over Time
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatUGX(v)} />
                <Legend />
                <Line type="monotone" dataKey="Assets" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="Cash" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Receivables" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Equity" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : snapshots.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Camera className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No snapshots yet. Save your first balance sheet snapshot to start tracking financial position over time.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="text-right">Cash & Bank</TableHead>
                <TableHead className="text-right">Receivables</TableHead>
                <TableHead className="text-right">Total Assets</TableHead>
                <TableHead className="text-right">Equity</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="text-xs">{new Date(s.snapshot_date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-sm">{s.label}</TableCell>
                  <TableCell className="text-right text-sm">{formatUGX(Number(s.cash_balance))}</TableCell>
                  <TableCell className="text-right text-sm">{formatUGX(Number(s.receivables))}</TableCell>
                  <TableCell className="text-right text-sm font-semibold text-primary">{formatUGX(Number(s.total_assets))}</TableCell>
                  <TableCell className="text-right text-sm">{formatUGX(Number(s.total_equity))}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate text-muted-foreground">{s.notes || '—'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-destructive h-7 w-7 p-0" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

const SnapshotForm = ({
  onSubmit, computed, computing,
}: {
  onSubmit: (d: any) => void;
  computed: { cash: number; receivables: number } | null;
  computing: boolean;
}) => {
  const today = new Date();
  const monthLabel = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [form, setForm] = useState({
    label: `${monthLabel} Snapshot`,
    notes: '',
    cash_balance: 0,
    receivables: 0,
  });

  useEffect(() => {
    if (computed) {
      setForm(f => ({ ...f, cash_balance: computed.cash, receivables: computed.receivables }));
    }
  }, [computed]);

  const totalAssets = form.cash_balance + form.receivables;

  return (
    <div className="space-y-4">
      {computing && <p className="text-xs text-muted-foreground">Computing current position...</p>}
      {computed && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-md p-3 text-xs">
          <p className="font-semibold text-emerald-700 mb-1">Auto-computed from current data:</p>
          <p>Cash: {formatUGX(computed.cash)} | Receivables: {formatUGX(computed.receivables)}</p>
          <p className="text-muted-foreground mt-1">You can adjust the values below before saving.</p>
        </div>
      )}
      <div>
        <Label>Snapshot Label *</Label>
        <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. End of Q1 2026" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cash & Bank (UGX)</Label>
          <Input type="number" value={form.cash_balance} onChange={e => setForm(f => ({ ...f, cash_balance: Number(e.target.value) }))} />
        </div>
        <div>
          <Label>Receivables (UGX)</Label>
          <Input type="number" value={form.receivables} onChange={e => setForm(f => ({ ...f, receivables: Number(e.target.value) }))} />
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
        <p className="text-xs text-muted-foreground">Total Assets</p>
        <p className="text-xl font-bold text-primary">{formatUGX(totalAssets)}</p>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Optional context, e.g. before annual audit" />
      </div>
      <Button onClick={() => onSubmit(form)} className="w-full" disabled={!form.label}>
        Save Snapshot
      </Button>
    </div>
  );
};

export default SnapshotsTab;
