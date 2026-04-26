import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Send, Search, Eye, Trash2, FilterX } from 'lucide-react';
import InvoiceDetailModal from './InvoiceDetailModal';
import ColumnFilter from './ColumnFilter';
import TablePagination from './TablePagination';

interface Client {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  payment_instructions: string | null;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  created_at: string;
}

const InvoicesTab = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [colFilters, setColFilters] = useState({ number: '', client: '', date: '', minTotal: '', maxTotal: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [invRes, clientRes] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_clients').select('id, company_name, contact_person, email, phone'),
    ]);
    if (invRes.data) setInvoices(invRes.data as unknown as Invoice[]);
    if (clientRes.data) setClients(clientRes.data as unknown as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'N/A';
    return clients.find(c => c.id === clientId)?.company_name || 'Unknown';
  };

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(inv.client_id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    if (!matchSearch || !matchStatus) return false;
    if (colFilters.number && !inv.invoice_number.toLowerCase().includes(colFilters.number.toLowerCase())) return false;
    if (colFilters.client && !getClientName(inv.client_id).toLowerCase().includes(colFilters.client.toLowerCase())) return false;
    if (colFilters.date && !inv.issue_date.startsWith(colFilters.date)) return false;
    if (colFilters.minTotal && Number(inv.total_amount) < Number(colFilters.minTotal)) return false;
    if (colFilters.maxTotal && Number(inv.total_amount) > Number(colFilters.maxTotal)) return false;
    return true;
  });
  const hasColFilters = Object.values(colFilters).some(v => v);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [search, statusFilter, colFilters, pageSize]);

  const handleCreateInvoice = async (data: { client_id: string; notes: string; tax_rate: number; due_date: string; payment_instructions: string }) => {
    const { error } = await supabase.from('invoices').insert({
      client_id: data.client_id || null,
      notes: data.notes || null,
      tax_rate: data.tax_rate,
      due_date: data.due_date,
      payment_instructions: data.payment_instructions,
      created_by: user?.id,
      invoice_number: '', // trigger will auto-generate
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Invoice created' });
      await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Created invoice', entity_type: 'invoice' });
      setShowCreate(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    await supabase.from('invoices').delete().eq('id', id);
    await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Deleted invoice', entity_type: 'invoice', entity_id: id });
    toast({ title: 'Invoice deleted' });
    fetchData();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('invoices').update({ status }).eq('id', id);
    await supabase.from('activity_logs').insert({ user_id: user?.id, action: `Updated invoice status to ${status}`, entity_type: 'invoice', entity_id: id });
    toast({ title: `Invoice marked as ${status}` });
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="partially_paid">Partial</SelectItem>
            </SelectContent>
          </Select>
          {hasColFilters && (
            <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => setColFilters({ number: '', client: '', date: '', minTotal: '', maxTotal: '' })}>
              <FilterX className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
            <CreateInvoiceForm clients={clients} onSubmit={handleCreateInvoice} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading invoices...</div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="min-w-[140px]">Invoice No.</TableHead>
                <TableHead className="min-w-[140px]">Client</TableHead>
                <TableHead className="min-w-[140px]">Date</TableHead>
                <TableHead className="min-w-[140px]">Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead></TableHead>
                <TableHead><ColumnFilter value={colFilters.number} onChange={v => setColFilters(f => ({ ...f, number: v }))} placeholder="Number..." /></TableHead>
                <TableHead><ColumnFilter value={colFilters.client} onChange={v => setColFilters(f => ({ ...f, client: v }))} placeholder="Client..." /></TableHead>
                <TableHead><ColumnFilter type="date" value={colFilters.date} onChange={v => setColFilters(f => ({ ...f, date: v }))} /></TableHead>
                <TableHead>
                  <div className="flex gap-1">
                    <ColumnFilter type="number" value={colFilters.minTotal} onChange={v => setColFilters(f => ({ ...f, minTotal: v }))} placeholder="Min" />
                    <ColumnFilter type="number" value={colFilters.maxTotal} onChange={v => setColFilters(f => ({ ...f, maxTotal: v }))} placeholder="Max" />
                  </div>
                </TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No invoices found</TableCell></TableRow>
              ) : filtered.map((inv, i) => (
                <TableRow key={inv.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                  <TableCell>{getClientName(inv.client_id)}</TableCell>
                  <TableCell>{new Date(inv.issue_date).toLocaleDateString()}</TableCell>
                  <TableCell>UGX {Number(inv.total_amount).toLocaleString()}</TableCell>
                  <TableCell>UGX {Number(inv.amount_paid).toLocaleString()}</TableCell>
                  <TableCell>UGX {Number(inv.balance_due).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedInvoice(inv.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {inv.status === 'draft' && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatusChange(inv.id, 'sent')}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(inv.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {selectedInvoice && (
        <InvoiceDetailModal
          invoiceId={selectedInvoice}
          clients={clients}
          onClose={() => { setSelectedInvoice(null); fetchData(); }}
        />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
    partially_paid: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const CreateInvoiceForm = ({ clients, onSubmit }: { clients: Client[]; onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    client_id: '',
    notes: '',
    tax_rate: 0,
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    payment_instructions: 'Payment via Mobile Money: +256 792 085 773 (MTN) or Bank Transfer',
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Client</Label>
        <Select value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))}>
          <SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger>
          <SelectContent>
            {clients.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Due Date</Label>
          <Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
        </div>
        <div>
          <Label>Tax Rate (%)</Label>
          <Input type="number" value={form.tax_rate} onChange={e => setForm(f => ({ ...f, tax_rate: Number(e.target.value) }))} />
        </div>
      </div>
      <div>
        <Label>Payment Instructions</Label>
        <Textarea value={form.payment_instructions} onChange={e => setForm(f => ({ ...f, payment_instructions: e.target.value }))} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>
      <Button onClick={() => onSubmit(form)} className="w-full">Create Invoice</Button>
    </div>
  );
};

export default InvoicesTab;
