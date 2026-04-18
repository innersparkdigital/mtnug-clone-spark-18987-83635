import { useState, useEffect, useCallback } from 'react';
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
import { Plus, Trash2, Edit } from 'lucide-react';

export interface TaxCode {
  id: string;
  name: string;
  code: string;
  rate: number;
  type: string;
  description: string | null;
  is_active: boolean;
}

const TaxCodesTab = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<TaxCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TaxCode | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('tax_codes' as any).select('*').order('rate');
    if (data) setCodes(data as unknown as TaxCode[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  useEffect(() => {
    const channel = supabase.channel('tax-codes-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tax_codes' }, fetchCodes)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchCodes]);

  const handleSave = async (data: Partial<TaxCode>) => {
    if (editing) {
      const { error } = await supabase.from('tax_codes' as any).update(data).eq('id', editing.id);
      if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Tax code updated' });
    } else {
      const { error } = await supabase.from('tax_codes' as any).insert([data as any]);
      if (error) return toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Tax code created' });
    }
    await supabase.from('activity_logs').insert({
      user_id: user?.id, action: editing ? 'Updated tax code' : 'Created tax code',
      entity_type: 'tax_code', details: data,
    });
    setShowForm(false);
    setEditing(null);
    fetchCodes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tax code? Income/expenses linked to it will be unlinked.')) return;
    await supabase.from('tax_codes' as any).delete().eq('id', id);
    toast({ title: 'Tax code deleted' });
    fetchCodes();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Tax Codes</h2>
          <p className="text-sm text-muted-foreground">Configurable tax rates applied to income and expenses</p>
        </div>
        <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Tax Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'New'} Tax Code</DialogTitle></DialogHeader>
            <TaxCodeForm initial={editing} onSubmit={handleSave} />
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
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No tax codes</TableCell></TableRow>
              ) : codes.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-xs font-mono">{t.code}</TableCell>
                  <TableCell className="text-xs capitalize">{t.type}</TableCell>
                  <TableCell className="text-right font-semibold">{Number(t.rate).toFixed(2)}%</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditing(t); setShowForm(true); }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive h-7 w-7 p-0" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
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

const TaxCodeForm = ({ initial, onSubmit }: { initial: TaxCode | null; onSubmit: (d: Partial<TaxCode>) => void }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    rate: initial?.rate ?? 0,
    type: initial?.type || 'sales',
    description: initial?.description || '',
    is_active: initial?.is_active ?? true,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. VAT 18%" />
        </div>
        <div>
          <Label>Code *</Label>
          <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="VAT18" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rate (%) *</Label>
          <Input type="number" step="0.01" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: Number(e.target.value) }))} />
        </div>
        <div>
          <Label>Type *</Label>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Tax (VAT)</SelectItem>
              <SelectItem value="withholding">Withholding Tax</SelectItem>
              <SelectItem value="exempt">Exempt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="active">Active</Label>
        <Switch id="active" checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
      </div>
      <Button onClick={() => onSubmit(form)} className="w-full" disabled={!form.name || !form.code}>
        {initial ? 'Save Changes' : 'Create Tax Code'}
      </Button>
    </div>
  );
};

export default TaxCodesTab;
