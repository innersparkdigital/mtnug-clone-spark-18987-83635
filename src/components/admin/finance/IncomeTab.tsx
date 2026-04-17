import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Trash2, Download, FileSpreadsheet } from 'lucide-react';
import { SERVICE_LABELS, exportCSV, exportXLSX, formatUGX } from '@/lib/financeExports';

interface Income {
  id: string;
  source: string;
  service_type: string;
  custom_service: string | null;
  amount: number;
  income_date: string;
  client_name: string | null;
  reference: string | null;
  payment_method: string;
  notes: string | null;
  invoice_id: string | null;
  created_at: string;
}

const IncomeTab = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const fetchIncome = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('income_entries').select('*').order('income_date', { ascending: false });
    if (data) setIncome(data as unknown as Income[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchIncome(); }, [fetchIncome]);

  const filtered = income.filter(e => {
    const matchSearch =
      (e.client_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.reference || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchSvc = serviceFilter === 'all' || e.service_type === serviceFilter;
    return matchSearch && matchSvc;
  });

  const totalAmount = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  const byService = filtered.reduce<Record<string, number>>((acc, e) => {
    acc[e.service_type] = (acc[e.service_type] || 0) + Number(e.amount);
    return acc;
  }, {});

  const handleCreate = async (data: any) => {
    const { error } = await supabase.from('income_entries').insert({
      ...data,
      source: 'manual',
      recorded_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    await supabase.from('activity_logs').insert({
      user_id: user?.id, action: 'Recorded income', entity_type: 'income',
      details: { amount: data.amount, service: data.service_type },
    });
    toast({ title: 'Income recorded' });
    setShowForm(false);
    fetchIncome();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this income record? Auto-recorded payments cannot be undone here.')) return;
    await supabase.from('income_entries').delete().eq('id', id);
    toast({ title: 'Income deleted' });
    fetchIncome();
  };

  const exportRows = filtered.map(e => ({
    Date: new Date(e.income_date).toLocaleDateString(),
    Service: SERVICE_LABELS[e.service_type] || e.service_type,
    'Custom Service': e.custom_service || '',
    Source: e.source.replace('_', ' '),
    Client: e.client_name || '',
    Reference: e.reference || '',
    'Payment Method': e.payment_method.replace('_', ' '),
    'Amount (UGX)': Number(e.amount),
    Notes: e.notes || '',
  }));

  return (
    <div className="space-y-4">
      {/* Service breakdown chips */}
      {Object.keys(byService).length > 0 && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2 font-medium">Income by Service ({filtered.length} entries)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byService).map(([svc, amt]) => (
              <div key={svc} className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md text-xs">
                <span className="text-muted-foreground">{SERVICE_LABELS[svc] || svc}: </span>
                <span className="font-bold text-emerald-700">{formatUGX(amt)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search income..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-sm text-muted-foreground">Total: <strong className="text-emerald-600">{formatUGX(totalAmount)}</strong></span>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportCSV(exportRows, `income-${new Date().toISOString().slice(0,10)}`)}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportXLSX({ Income: exportRows }, `income-${new Date().toISOString().slice(0,10)}`)}>
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </Button>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Income</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Income</DialogTitle></DialogHeader>
              <IncomeForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No income records found</TableCell></TableRow>
              ) : filtered.map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="text-xs">{new Date(e.income_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
                      {e.service_type === 'other' && e.custom_service ? e.custom_service : (SERVICE_LABELS[e.service_type] || e.service_type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs capitalize">{e.source.replace('_', ' ')}</TableCell>
                  <TableCell className="text-xs">{e.client_name || '—'}</TableCell>
                  <TableCell className="text-xs">{e.reference || '—'}</TableCell>
                  <TableCell className="text-xs capitalize">{e.payment_method.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-700">{formatUGX(Number(e.amount))}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-destructive h-7 w-7 p-0" onClick={() => handleDelete(e.id)}>
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

const IncomeForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    service_type: 'therapy',
    custom_service: '',
    amount: 0,
    income_date: new Date().toISOString().split('T')[0],
    client_name: '',
    reference: '',
    payment_method: 'mobile_money',
    notes: '',
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Service Type *</Label>
          <Select value={form.service_type} onValueChange={v => setForm(f => ({ ...f, service_type: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date *</Label>
          <Input type="date" value={form.income_date} onChange={e => setForm(f => ({ ...f, income_date: e.target.value }))} />
        </div>
      </div>
      {form.service_type === 'other' && (
        <div>
          <Label>Custom Service Name *</Label>
          <Input value={form.custom_service} onChange={e => setForm(f => ({ ...f, custom_service: e.target.value }))} placeholder="e.g. Workshop facilitation" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Amount (UGX) *</Label>
          <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
        </div>
        <div>
          <Label>Payment Method</Label>
          <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="pesapal">PesaPal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Client / Source</Label>
          <Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="e.g. Walk-in client" />
        </div>
        <div>
          <Label>Reference</Label>
          <Input value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="Receipt no, txn id" />
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
      </div>
      <Button
        onClick={() => onSubmit(form)}
        className="w-full"
        disabled={form.amount <= 0 || (form.service_type === 'other' && !form.custom_service)}
      >
        Record Income
      </Button>
    </div>
  );
};

export default IncomeTab;
