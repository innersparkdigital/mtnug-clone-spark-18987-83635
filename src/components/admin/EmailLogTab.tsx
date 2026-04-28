import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, AlertTriangle, ShieldAlert, RefreshCw, Search } from 'lucide-react';

interface EmailRow {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

type Range = '24h' | '7d' | '30d' | 'all';

const PER_PAGE = 25;

const statusColor = (s: string) => {
  if (s === 'sent') return 'bg-green-100 text-green-700 border-green-200';
  if (s === 'pending') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s === 'suppressed') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

const EmailLogTab = () => {
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('7d');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const since = useMemo(() => {
    if (range === 'all') return null;
    const d = new Date();
    if (range === '24h') d.setHours(d.getHours() - 24);
    else if (range === '7d') d.setDate(d.getDate() - 7);
    else if (range === '30d') d.setDate(d.getDate() - 30);
    return d.toISOString();
  }, [range]);

  const fetchLogs = async () => {
    setLoading(true);
    let q = supabase
      .from('email_send_log' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (since) q = q.gte('created_at', since);
    const { data } = await q;
    setRows((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); /* eslint-disable-next-line */ }, [range]);

  // Deduplicate by message_id (latest row wins). Rows w/o message_id pass through.
  const deduped = useMemo(() => {
    const seen = new Map<string, EmailRow>();
    const noId: EmailRow[] = [];
    for (const r of rows) {
      if (!r.message_id) { noId.push(r); continue; }
      if (!seen.has(r.message_id)) seen.set(r.message_id, r);
    }
    return [...seen.values(), ...noId];
  }, [rows]);

  const templateOptions = useMemo(() => {
    const set = new Set<string>();
    deduped.forEach(r => set.add(r.template_name));
    return Array.from(set).sort();
  }, [deduped]);

  const filtered = useMemo(() => {
    return deduped.filter(r => {
      if (templateFilter !== 'all' && r.template_name !== templateFilter) return false;
      if (statusFilter !== 'all') {
        if (statusFilter === 'failed' && !['dlq', 'failed', 'bounced', 'complained'].includes(r.status)) return false;
        if (statusFilter !== 'failed' && r.status !== statusFilter) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!r.recipient_email.toLowerCase().includes(q) && !r.template_name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [deduped, templateFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const sent = filtered.filter(r => r.status === 'sent').length;
    const failed = filtered.filter(r => ['dlq', 'failed', 'bounced', 'complained'].includes(r.status)).length;
    const suppressed = filtered.filter(r => r.status === 'suppressed').length;
    return { total, sent, failed, suppressed };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [templateFilter, statusFilter, search, range]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Emails</p><p className="text-3xl font-bold">{stats.total}</p></div>
            <Mail className="h-8 w-8 text-primary opacity-60" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Delivered</p><p className="text-3xl font-bold text-green-600">{stats.sent}</p></div>
            <Send className="h-8 w-8 text-green-500 opacity-60" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Failed</p><p className="text-3xl font-bold text-red-600">{stats.failed}</p></div>
            <AlertTriangle className="h-8 w-8 text-red-500 opacity-60" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Suppressed</p><p className="text-3xl font-bold text-yellow-600">{stats.suppressed}</p></div>
            <ShieldAlert className="h-8 w-8 text-yellow-500 opacity-60" />
          </div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Email Send Log</CardTitle>
              <CardDescription>Tracking all transactional emails (deduplicated by message)</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <div className="flex items-center gap-1">
              {(['24h', '7d', '30d', 'all'] as Range[]).map(r => (
                <Button key={r} size="sm" variant={range === r ? 'default' : 'outline'} className="h-8 text-xs" onClick={() => setRange(r)}>
                  {r === '24h' ? 'Last 24h' : r === '7d' ? 'Last 7d' : r === '30d' ? 'Last 30d' : 'All time'}
                </Button>
              ))}
            </div>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[220px] h-8 text-xs"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All templates</SelectItem>
                {templateOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="suppressed">Suppressed</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search recipient or template..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs w-[260px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Template</th>
                  <th className="text-left p-3 font-medium">Recipient</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">When</th>
                  <th className="text-left p-3 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No emails match these filters.</td></tr>
                ) : paginated.map(r => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 text-xs font-mono">{r.template_name}</td>
                    <td className="p-3 text-xs">{r.recipient_email}</td>
                    <td className="p-3"><Badge variant="outline" className={`text-[10px] ${statusColor(r.status)}`}>{r.status}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString('en-GB')}</td>
                    <td className="p-3 text-xs text-red-600 max-w-[300px] truncate" title={r.error_message || ''}>{r.error_message || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between p-3 border-t">
              <p className="text-xs text-muted-foreground">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 text-xs" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-xs px-2">Page {page} of {totalPages}</span>
                <Button size="sm" variant="outline" className="h-8 text-xs" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailLogTab;
