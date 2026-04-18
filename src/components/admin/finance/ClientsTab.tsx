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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Client {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

const ClientsTab = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_clients').select('*').order('company_name');
    if (data) setClients(data as unknown as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = clients.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.contact_person || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<Client>) => {
    if (editing) {
      await supabase.from('admin_clients').update(data).eq('id', editing.id);
      await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Updated client', entity_type: 'client', entity_id: editing.id });
      toast({ title: 'Client updated' });
    } else {
      await supabase.from('admin_clients').insert([{ ...data, created_by: user?.id } as any]);
      await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Created client', entity_type: 'client' });
      toast({ title: 'Client created' });
    }
    setShowForm(false);
    setEditing(null);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client? Linked invoices will be preserved.')) return;
    await supabase.from('admin_clients').delete().eq('id', id);
    await supabase.from('activity_logs').insert({ user_id: user?.id, action: 'Deleted client', entity_type: 'client', entity_id: id });
    toast({ title: 'Client deleted' });
    fetchClients();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={showForm} onOpenChange={v => { setShowForm(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit Client' : 'New Client'}</DialogTitle></DialogHeader>
            <ClientForm initial={editing} onSubmit={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No clients found</TableCell></TableRow>
              ) : filtered.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{c.company_name}</TableCell>
                  <TableCell>{c.contact_person || '-'}</TableCell>
                  <TableCell>{c.email || '-'}</TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(c); setShowForm(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}>
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
    </div>
  );
};

const ClientForm = ({ initial, onSubmit }: { initial: Client | null; onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({
    company_name: initial?.company_name || '',
    contact_person: initial?.contact_person || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    address: initial?.address || '',
    notes: initial?.notes || '',
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Name *</Label>
        <Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Contact Person</Label>
          <Input value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>
      <Button onClick={() => onSubmit(form)} className="w-full" disabled={!form.company_name}>
        {initial ? 'Update Client' : 'Add Client'}
      </Button>
    </div>
  );
};

export default ClientsTab;
