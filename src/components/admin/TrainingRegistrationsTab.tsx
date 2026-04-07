import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Search, Users, CalendarDays } from 'lucide-react';

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

const TrainingRegistrationsTab = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTraining, setSelectedTraining] = useState<string>('all');

  useEffect(() => {
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
    fetchData();
  }, []);

  const trainingMap = useMemo(() => {
    const map: Record<string, string> = {};
    trainings.forEach(t => { map[t.id] = t.title; });
    return map;
  }, [trainings]);

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      const matchesTraining = selectedTraining === 'all' || r.training_id === selectedTraining;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.organisation || '').toLowerCase().includes(q) ||
        (r.position || '').toLowerCase().includes(q);
      return matchesTraining && matchesSearch;
    });
  }, [registrations, selectedTraining, search]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Organisation', 'Position', 'Training', 'Registered At'];
    const rows = filtered.map(r => [
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Stats per training
  const regCountByTraining: Record<string, number> = {};
  registrations.forEach(r => {
    regCountByTraining[r.training_id] = (regCountByTraining[r.training_id] || 0) + 1;
  });

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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Training Registrations</CardTitle>
          <CardDescription>View and export all training sign-ups</CardDescription>
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
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registrations found
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Showing {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(r => (
                      <TableRow key={r.id}>
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
                          {new Date(r.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRegistrationsTab;
