import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Trash2, Download, FileSpreadsheet, Link2, Pencil, FilterX } from 'lucide-react';
import { exportCSV, exportXLSX, formatUGX } from '@/lib/financeExports';
import { useTaxCodes } from '@/hooks/useTaxCodes';
import ColumnFilter from './ColumnFilter';
import TablePagination from './TablePagination';

interface Expense {
  id: string;
  category: string;
  custom_category: string | null;
  description: string;
  amount: number;
  expense_date: string;
  linked_income_id: string | null;
  tax_code_id: string | null;
  is_tax_deductible: boolean;
  created_at: string;
}

interface IncomeOpt {
  id: string;
  service_type: string;
  custom_service: string | null;
  amount: number;
  client_name: string | null;
  reference: string | null;
  income_date: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  staff: 'Staff Payments',
  marketing: 'Marketing',
  operations: 'Operations',
  transport: 'Transport',
  utilities: 'Utilities',
  rent: 'Rent',
  software: 'Software & Tools',
  other: 'Other',
};

const incomeLabel = (i: IncomeOpt) => {
  const svc = i.service_type === 'other' && i.custom_service ? i.custom_service : i.service_type;
  const ref = i.reference || i.client_name || new Date(i.income_date).toLocaleDateString();
  return `${svc} – ${ref} (${formatUGX(Number(i.amount))})`;
};

const emptyColFilters = {
  date: '', category: '', description: '', linked: '', minAmount: '', maxAmount: '',
};

const ExpensesTab = () => {
  const { user } = useAuth();
  const { taxCodes } = useTaxCodes();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<IncomeOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [colFilters, setColFilters] = useState(emptyColFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [expRes, incRes] = await Promise.all([
      supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
      supabase.from('income_entries').select('id,service_type,custom_service,amount,client_name,reference,income_date').order('income_date', { ascending: false }),
    ]);
    if (expRes.data) setExpenses(expRes.data as unknown as Expense[]);
    if (incRes.data) setIncomes(incRes.data as unknown as IncomeOpt[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const ch = supabase.channel('expenses-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'income_entries' }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll]);

  const incomeMap = useMemo(() => new Map(incomes.map(i => [i.id, i])), [incomes]);

  const filtered = useMemo(() => expenses.filter(e => {
    if (search) {
      const s = search.toLowerCase();
      const match = e.description.toLowerCase().includes(s) ||
        e.category.toLowerCase().includes(s) ||
        (e.custom_category || '').toLowerCase().includes(s);
      if (!match) return false;
    }
    if (colFilters.date && !e.expense_date.startsWith(colFilters.date)) return false;
    if (colFilters.category) {
      const cat = e.category === 'other' && e.custom_category ? e.custom_category : (CATEGORY_LABELS[e.category] || e.category);
      if (!cat.toLowerCase().includes(colFilters.category.toLowerCase())) return false;
    }
    if (colFilters.description && !e.description.toLowerCase().includes(colFilters.description.toLowerCase())) return false;
    if (colFilters.linked) {
      const linked = e.linked_income_id ? incomeMap.get(e.linked_income_id) : null;
      const lbl = linked ? incomeLabel(linked) : '';
      if (colFilters.linked === 'yes' && !linked) return false;
      if (colFilters.linked === 'no' && linked) return false;
      if (colFilters.linked !== 'yes' && colFilters.linked !== 'no' && !lbl.toLowerCase().includes(colFilters.linked.toLowerCase())) return false;
    }
    if (colFilters.minAmount && Number(e.amount) < Number(colFilters.minAmount)) return false;
    if (colFilters.maxAmount && Number(e.amount) > Number(colFilters.maxAmount)) return false;
    return true;
  }), [expenses, search, colFilters, incomeMap]);

  const totalAmount = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  const hasColFilters = Object.values(colFilters).some(v => v);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [search, colFilters, pageSize]);

  const handleSave = async (data: any, id?: string) => {
    const payload = {
      ...data,
      linked_income_id: data.linked_income_id || null,
      tax_code_id: data.tax_code_id || null,
    };
    if (id) {
      const { error } = await supabase.from('expenses').update(payload).eq('id', id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      await supabase.from('activity_logs').insert({
        user_id: user?.id, action: 'Edited expense', entity_type: 'expense', entity_id: id,
        details: { amount: data.amount, category: data.category },
      });
      toast({ title: 'Expense updated' });
      setEditing(null);
    } else {
      const { error } = await supabase.from('expenses').insert({ ...payload, recorded_by: user?.id });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      await supabase.from('activity_logs').insert({
        user_id: user?.id, action: 'Added expense', entity_type: 'expense',
        details: { amount: data.amount, category: data.category, linked: !!data.linked_income_id },
      });
      toast({ title: 'Expense added', description: data.linked_income_id ? 'Linked to income — net profit updated' : undefined });
      setShowForm(false);
    }
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Deleted expense', entity_type: 'expense', entity_id: id });
    toast({ title: 'Expense deleted' });
    fetchAll();
  };

  const exportRows = filtered.map(e => {
    const linked = e.linked_income_id ? incomeMap.get(e.linked_income_id) : null;
    const tax = e.tax_code_id ? taxCodes.find(t => t.id === e.tax_code_id) : null;
    return {
      Date: new Date(e.expense_date).toLocaleDateString(),
      Category: e.category === 'other' && e.custom_category ? e.custom_category : (CATEGORY_LABELS[e.category] || e.category),
      Description: e.description,
      'Amount (UGX)': Number(e.amount),
      'Linked Income': linked ? incomeLabel(linked) : '',
      'Tax Code': tax ? tax.name : '',
      'Tax Deductible': e.is_tax_deductible ? 'Yes' : 'No',
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          {hasColFilters && (
            <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => setColFilters(emptyColFilters)}>
              <FilterX className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-sm text-muted-foreground">Total: <strong className="text-red-600">{formatUGX(totalAmount)}</strong></span>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportCSV(exportRows, `expenses-${new Date().toISOString().slice(0,10)}`)}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportXLSX({ Expenses: exportRows }, `expenses-${new Date().toISOString().slice(0,10)}`)}>
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </Button>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <ExpenseForm onSubmit={(d) => handleSave(d)} incomes={incomes} taxCodes={taxCodes} />
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
                <TableHead className="w-10">#</TableHead>
                <TableHead className="min-w-[140px]">Date</TableHead>
                <TableHead className="min-w-[140px]">Category</TableHead>
                <TableHead className="min-w-[160px]">Description</TableHead>
                <TableHead className="min-w-[160px]">Linked Income</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead className="text-right min-w-[140px]">Amount</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead></TableHead>
                <TableHead><ColumnFilter type="date" value={colFilters.date} onChange={v => setColFilters(f => ({ ...f, date: v }))} /></TableHead>
                <TableHead><ColumnFilter value={colFilters.category} onChange={v => setColFilters(f => ({ ...f, category: v }))} placeholder="Category..." /></TableHead>
                <TableHead><ColumnFilter value={colFilters.description} onChange={v => setColFilters(f => ({ ...f, description: v }))} placeholder="Description..." /></TableHead>
                <TableHead>
                  <ColumnFilter type="select" value={colFilters.linked} onChange={v => setColFilters(f => ({ ...f, linked: v }))}
                    options={[{ value: 'yes', label: 'Linked only' }, { value: 'no', label: 'Unlinked only' }]} />
                </TableHead>
                <TableHead></TableHead>
                <TableHead>
                  <div className="flex gap-1">
                    <ColumnFilter type="number" value={colFilters.minAmount} onChange={v => setColFilters(f => ({ ...f, minAmount: v }))} placeholder="Min" />
                    <ColumnFilter type="number" value={colFilters.maxAmount} onChange={v => setColFilters(f => ({ ...f, maxAmount: v }))} placeholder="Max" />
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No expenses found</TableCell></TableRow>
              ) : paged.map((e, i) => {
                const linked = e.linked_income_id ? incomeMap.get(e.linked_income_id) : null;
                const tax = e.tax_code_id ? taxCodes.find(t => t.id === e.tax_code_id) : null;
                return (
                  <TableRow key={e.id}>
                    <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                    <TableCell className="text-xs">{new Date(e.expense_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {e.category === 'other' && e.custom_category ? e.custom_category : (CATEGORY_LABELS[e.category] || e.category)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{e.description}</TableCell>
                    <TableCell className="text-xs">
                      {linked ? (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Link2 className="h-3 w-3" /> {incomeLabel(linked).slice(0, 30)}…
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {tax ? <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700">{tax.code}</span> : '—'}
                      {!e.is_tax_deductible && <span className="ml-1 text-muted-foreground text-[10px]">(not ded.)</span>}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-700">{formatUGX(Number(e.amount))}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditing(e)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive h-7 w-7 p-0" onClick={() => handleDelete(e.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </Card>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
          {editing && <ExpenseForm onSubmit={(d) => handleSave(d, editing.id)} incomes={incomes} taxCodes={taxCodes} initial={editing} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ExpenseForm = ({
  onSubmit, incomes, taxCodes, initial,
}: { onSubmit: (data: any) => void; incomes: IncomeOpt[]; taxCodes: any[]; initial?: Expense }) => {
  const [form, setForm] = useState({
    category: initial?.category || 'operations',
    custom_category: initial?.custom_category || '',
    description: initial?.description || '',
    amount: initial?.amount || 0,
    expense_date: initial?.expense_date || new Date().toISOString().split('T')[0],
    linked_income_id: initial?.linked_income_id || '',
    tax_code_id: initial?.tax_code_id || '',
    is_tax_deductible: initial?.is_tax_deductible ?? true,
  });

  const isOther = form.category === 'other';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v, custom_category: v === 'other' ? f.custom_category : '' }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date *</Label>
          <Input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
        </div>
      </div>
      {isOther && (
        <div>
          <Label>Custom Category Name *</Label>
          <Input value={form.custom_category} onChange={e => setForm(f => ({ ...f, custom_category: e.target.value }))} placeholder="e.g. Workshop materials" />
        </div>
      )}
      <div>
        <Label>Description *</Label>
        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Amount (UGX) *</Label>
          <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
        </div>
        <div>
          <Label>Tax Code</Label>
          <Select value={form.tax_code_id || 'none'} onValueChange={v => setForm(f => ({ ...f, tax_code_id: v === 'none' ? '' : v }))}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No tax code</SelectItem>
              {taxCodes.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.code})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border-t pt-3">
        <Label className="text-primary flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" /> Link to Income (offset for net profit)
        </Label>
        <p className="text-xs text-muted-foreground mb-2">e.g. Facilitator fee linked to a Training income → reduces net income for that service</p>
        <Select value={form.linked_income_id || 'none'} onValueChange={v => setForm(f => ({ ...f, linked_income_id: v === 'none' ? '' : v }))}>
          <SelectTrigger><SelectValue placeholder="No link (general expense)" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="none">No link (general expense)</SelectItem>
            {incomes.map(i => <SelectItem key={i.id} value={i.id}>{incomeLabel(i)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div>
          <Label htmlFor="ded">Tax Deductible</Label>
          <p className="text-xs text-muted-foreground">Include in deductible expenses for tax reports</p>
        </div>
        <Switch id="ded" checked={form.is_tax_deductible} onCheckedChange={v => setForm(f => ({ ...f, is_tax_deductible: v }))} />
      </div>
      <Button onClick={() => onSubmit(form)} className="w-full" disabled={!form.description || form.amount <= 0 || (isOther && !form.custom_category)}>
        {initial ? 'Save Changes' : 'Add Expense'}
      </Button>
    </div>
  );
};

export default ExpensesTab;
