import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Shield } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

const AccountsTab = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
    if (data) setRoles(data as unknown as UserRole[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleAddRole = async (userId: string, role: string) => {
    const { error } = await supabase.from('user_roles').insert([{ user_id: userId, role: role as any }]);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('activity_logs').insert({ user_id: user?.id, action: `Assigned ${role} role`, entity_type: 'user_role', entity_id: userId });
      toast({ title: 'Role assigned' });
      setShowAdd(false);
      fetchRoles();
    }
  };

  const handleRemoveRole = async (id: string) => {
    if (!confirm('Remove this role?')) return;
    await supabase.from('user_roles').delete().eq('id', id);
    toast({ title: 'Role removed' });
    fetchRoles();
  };

  const roleLabels: Record<string, string> = {
    admin: 'Super Admin',
    finance_admin: 'Finance Admin',
    operations_admin: 'Operations Admin',
    moderator: 'Moderator',
    user: 'User',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    finance_admin: 'bg-emerald-100 text-emerald-700',
    operations_admin: 'bg-blue-100 text-blue-700',
    moderator: 'bg-amber-100 text-amber-700',
    user: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Admin Accounts & Roles
          </CardTitle>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Assign Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign Admin Role</DialogTitle></DialogHeader>
              <AddRoleForm onSubmit={handleAddRole} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No roles assigned</TableCell></TableRow>
                ) : roles.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs">{r.user_id.substring(0, 12)}...</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[r.role] || 'bg-gray-100 text-gray-700'}`}>
                        {roleLabels[r.role] || r.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(r.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRemoveRole(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AddRoleForm = ({ onSubmit }: { onSubmit: (userId: string, role: string) => void }) => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('finance_admin');

  return (
    <div className="space-y-4">
      <div>
        <Label>User ID</Label>
        <Input placeholder="Enter the user's UUID" value={userId} onChange={e => setUserId(e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Find the user ID from the Users section</p>
      </div>
      <div>
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Super Admin — Full system control</SelectItem>
            <SelectItem value="finance_admin">Finance Admin — Invoices, payments, reports</SelectItem>
            <SelectItem value="operations_admin">Operations Admin — Clients, bookings</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onSubmit(userId, role)} className="w-full" disabled={!userId}>Assign Role</Button>
    </div>
  );
};

export default AccountsTab;
