import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Search, Users, CalendarDays, Trash2, Mail, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  organisation: string | null;
  position: string | null;
  created_at: string;
  training_id: string;
}

interface Training {
  id: string;
  title: string;
}

type SortKey = 'full_name' | 'email' | 'organisation' | 'position' | 'training' | 'created_at';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

const TrainingRegistrationsTab = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTraining, setSelectedTraining] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, trainRes] = await Promise.all([
        supabase.from('training_registrations').select('*').order('created_at', { ascending: false }),
        supabase.from('trainings').select('id, title').order('training_date', { ascending: false }),
      ]);
      if (regRes.data) setRegistrations(regRes.data);
      if (trainRes.data) setTrainings(trainRes.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const trainingMap = useMemo(() => {
    const map: Record<string, string> = {};
    trainings.forEach(t => { map[t.id] = t.title; });
    return map;
  }, [trainings]);

  const filtered = useMemo(() => {
    let data = registrations.filter(r => {
      const matchesTraining = selectedTraining === 'all' || r.training_id === selectedTraining;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.organisation || '').toLowerCase().includes(q) ||
        (r.position || '').toLowerCase().includes(q);
      return matchesTraining && matchesSearch;
    });

    data.sort((a, b) => {
      let aVal: string, bVal: string;
      if (sortKey === 'training') {
        aVal = (trainingMap[a.training_id] || '').toLowerCase();
        bVal = (trainingMap[b.training_id] || '').toLowerCase();
      } else if (sortKey === 'created_at') {
        aVal = a.created_at;
        bVal = b.created_at;
      } else {
        aVal = (a[sortKey] || '').toLowerCase();
        bVal = (b[sortKey] || '').toLowerCase();
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [registrations, selectedTraining, search, sortKey, sortDir, trainingMap]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, selectedTraining]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startEntry = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(page * PAGE_SIZE, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    setDeleting(id);
    const { error } = await supabase.from('training_registrations').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete registration');
    } else {
      setRegistrations(prev => prev.filter(r => r.id !== id));
      toast.success('Registration deleted');
    }
    setDeleting(null);
  };

  const exportCSV = () => {
    const headers = ['#', 'Name', 'Email', 'Phone', 'Organisation', 'Position', 'Training', 'Registered At'];
    const rows = filtered.map((r, i) => [
      i + 1,
      r.full_name,
      r.email,
      r.phone_number,
      r.organisation || '',
      r.position || '',
      trainingMap[r.training_id] || r.training_id,
      new Date(r.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backupToEmail = async () => {
    const email = prompt('Enter the email address to send backup data to:');
    if (!email) return;
    setBackingUp(true);

    const headers = ['#', 'Name', 'Email', 'Phone', 'Organisation', 'Position', 'Training', 'Registered At'];
    const rows = filtered.map((r, i) => [
      i + 1, r.full_name, r.email, r.phone_number, r.organisation || '—', r.position || '—',
      trainingMap[r.training_id] || 'Unknown', new Date(r.created_at).toLocaleDateString(),
    ]);

    const tableHtml = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:13px;">
        <thead>
          <tr style="background:#1a365d;color:#fff;">
            ${headers.map(h => `<th style="padding:10px 8px;text-align:left;">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => `
            <tr style="background:${i % 2 === 0 ? '#f7fafc' : '#ffffff'};">
              ${row.map(v => `<td style="padding:8px;border:1px solid #e2e8f0;">${v}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    try {
      const { data, error } = await supabase.functions.invoke('send-resend-email', {
        body: {
          to: email,
          subject: `Training Registrations Backup — ${new Date().toLocaleDateString()}`,
          type: 'backup',
          data: {
            title: 'Training Registrations Backup',
            tableHtml,
            totalRecords: filtered.length,
          },
        },
      });
      if (error) throw error;
      toast.success(`Backup sent to ${email}`);
    } catch (err: any) {
      console.error('Backup email error:', err);
      toast.error('Failed to send backup email');
    } finally {
      setBackingUp(false);
    }
  };

  const regCountByTraining: Record<string, number> = {};
  registrations.forEach(r => {
    regCountByTraining[r.training_id] = (regCountByTraining[r.training_id] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SortableHead = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground"
      onClick={() => toggleSort(sortKeyVal)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === sortKeyVal ? 'text-primary' : 'text-muted-foreground/50'}`} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Registrations</p>
                <p className="text-3xl font-bold">{registrations.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Trainings</p>
                <p className="text-3xl font-bold">{trainings.length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CalendarDays className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unique Emails</p>
                <p className="text-3xl font-bold">
                  {new Set(registrations.map(r => r.email.toLowerCase())).size}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Search className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Registrations ({filtered.length})</CardTitle>
          <CardDescription>View, filter, export and manage all training sign-ups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, organisation..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedTraining} onValueChange={setSelectedTraining}>
              <SelectTrigger className="w-full sm:w-[260px]">
                <SelectValue placeholder="Filter by training" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trainings</SelectItem>
                {trainings.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title} ({regCountByTraining[t.id] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={backupToEmail} disabled={backingUp} className="gap-2">
              {backingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Backup to Email
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registrations found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <SortableHead label="Name" sortKeyVal="full_name" />
                      <SortableHead label="Email" sortKeyVal="email" />
                      <TableHead>Phone</TableHead>
                      <SortableHead label="Organisation" sortKeyVal="organisation" />
                      <SortableHead label="Position" sortKeyVal="position" />
                      <SortableHead label="Training" sortKeyVal="training" />
                      <SortableHead label="Registered" sortKeyVal="created_at" />
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((r, i) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground">{startEntry + i}</TableCell>
                        <TableCell className="font-medium">{r.full_name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.phone_number}</TableCell>
                        <TableCell>{r.organisation || '—'}</TableCell>
                        <TableCell>{r.position || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs max-w-[180px] truncate">
                            {trainingMap[r.training_id] || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deleting === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startEntry} to {endEntry} of {filtered.length} entries
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                    Math.max(0, page - 3), Math.min(totalPages, page + 2)
                  ).map(p => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      className="w-9"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRegistrationsTab;
