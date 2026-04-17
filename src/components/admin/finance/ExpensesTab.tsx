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
import { exportCSV, exportXLSX, formatUGX } from '@/lib/financeExports';

interface Expense {
  id: string;
  category: string;
  custom_category: string | null;
  description: string;
  amount: number;
  expense_date: string;
  created_at: string;
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

const ExpensesTab = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (data) setExpenses(data as unknown as Expense[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const filtered = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    (e.custom_category || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleCreate = async (data: any) => {
    const { error } = await supabase.from('expenses').insert({ ...data, recorded_by: user?.id });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    await supabase.from('activity_logs').insert({
      user_id: user?.id, action: 'Added expense', entity_type: 'expense',
      details: { amount: data.amount, category: data.category, custom: data.custom_category },
    });
    toast({ title: 'Expense added' });
    setShowForm(false);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Deleted expense', entity_type: 'expense', entity_id: id });
    toast({ title: 'Expense deleted' });
    fetchExpenses();
  };

  const exportRows = filtered.map(e => ({
    Date: new Date(e.expense_date).toLocaleDateString(),
    Category: e.category === 'other' && e.custom_category ? e.custom_category : (CATEGORY_LABELS[e.category] || e.category),
    Description: e.description,
    'Amount (UGX)': Number(e.amount),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
            <DialogContent>
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <ExpenseForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No expenses found</TableCell></TableRow>
              ) : filtered.map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="text-xs">{new Date(e.expense_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {e.category === 'other' && e.custom_category ? e.custom_category : (CATEGORY_LABELS[e.category] || e.category)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{e.description}</TableCell>
                  <TableCell className="text-right font-semibold text-red-700">{formatUGX(Number(e.amount))}</TableCell>
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

const ExpenseForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    category: 'operations',
    custom_category: '',
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
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
          <Input
            value={form.custom_category}
            onChange={e => setForm(f => ({ ...f, custom_category: e.target.value }))}
            placeholder="e.g. Workshop materials, Internet, Bank fees..."
          />
        </div>
      )}
      <div>
        <Label>Description *</Label>
        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
      </div>
      <div>
        <Label>Amount (UGX) *</Label>
        <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
      </div>
      <Button
        onClick={() => onSubmit(form)}
        className="w-full"
        disabled={!form.description || form.amount <= 0 || (isOther && !form.custom_category)}
      >
        Add Expense
      </Button>
    </div>
  );
};

export default ExpensesTab;
