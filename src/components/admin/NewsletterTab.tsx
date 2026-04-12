import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Mail, Plus, Send, Edit, Trash2, Eye, Loader2, Users, FileText, Upload,
  BarChart3, CheckCircle, XCircle, Clock, AlertTriangle, Search,
  CalendarClock, RefreshCw,
} from 'lucide-react';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  image_url: string | null;
  status: string;
  recipient_filter: any;
  recipient_count: number;
  sent_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailLogEntry {
  id: string;
  message_id: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: any;
  created_at: string;
}

const NewsletterTab = () => {
  const { toast } = useToast();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [syncingSubscribers, setSyncingSubscribers] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'custom'>('all');
  const [customEmails, setCustomEmails] = useState('');
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);

  // Scheduling
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [subscriberCount, setSubscriberCount] = useState(0);

  // Analytics state
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsStats, setAnalyticsStats] = useState({
    total: 0, sent: 0, failed: 0, pending: 0,
  });

  const fetchNewsletters = useCallback(async () => {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setNewsletters(data as Newsletter[]);
    setLoading(false);
  }, []);

  const fetchSubscriberCount = useCallback(async () => {
    const { count } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    setSubscriberCount(count || 0);
  }, []);

  const fetchEmailAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      let query = supabase
        .from('email_send_log')
        .select('*')
        .eq('template_name', 'newsletter')
        .order('created_at', { ascending: false });

      if (timeRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        switch (timeRange) {
          case '24h': startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
          case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
          case '30d': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
          default: startDate = new Date(0);
        }
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) { console.error('Error fetching analytics:', error); return; }

      const logs = (data || []) as EmailLogEntry[];
      const latestByMessage = new Map<string, EmailLogEntry>();
      for (const log of logs) {
        const existing = latestByMessage.get(log.message_id);
        if (!existing || new Date(log.created_at) > new Date(existing.created_at)) {
          latestByMessage.set(log.message_id, log);
        }
      }
      const deduplicated = Array.from(latestByMessage.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setEmailLogs(deduplicated);

      const stats = { total: deduplicated.length, sent: 0, failed: 0, pending: 0 };
      for (const log of deduplicated) {
        if (log.status === 'sent') stats.sent++;
        else if (log.status === 'failed' || log.status === 'dlq') stats.failed++;
        else if (log.status === 'pending') stats.pending++;
      }
      setAnalyticsStats(stats);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchNewsletters();
    fetchSubscriberCount();
  }, [fetchNewsletters, fetchSubscriberCount]);

  useEffect(() => {
    fetchEmailAnalytics();
  }, [fetchEmailAnalytics]);

  const resetForm = () => {
    setEditId(null);
    setSubject('');
    setContent('');
    setImageUrl('');
    setRecipientType('all');
    setCustomEmails('');
    setScheduleDate('');
    setScheduleTime('');
  };

  const openNew = () => { resetForm(); setEditorOpen(true); };

  const openEdit = (n: Newsletter) => {
    setEditId(n.id);
    setSubject(n.subject);
    setContent(n.content);
    setImageUrl(n.image_url || '');
    const filter = n.recipient_filter as any;
    setRecipientType(filter?.type === 'custom' ? 'custom' : 'all');
    setCustomEmails(filter?.emails?.join(', ') || '');
    if (n.scheduled_at) {
      const d = new Date(n.scheduled_at);
      setScheduleDate(d.toISOString().split('T')[0]);
      setScheduleTime(d.toTimeString().slice(0, 5));
    } else {
      setScheduleDate('');
      setScheduleTime('');
    }
    setEditorOpen(true);
  };

  const buildPayload = () => {
    const recipientFilter = recipientType === 'custom'
      ? { type: 'custom', emails: customEmails.split(',').map(e => e.trim()).filter(Boolean) }
      : { type: 'all' };

    const scheduledAt = scheduleDate && scheduleTime
      ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
      : null;

    return {
      subject: subject.trim(),
      content,
      image_url: imageUrl || null,
      recipient_filter: recipientFilter,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt,
    };
  };

  const saveDraft = async () => {
    if (!subject.trim()) {
      toast({ title: 'Subject is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = buildPayload();
    let error;
    if (editId) {
      ({ error } = await supabase.from('newsletters').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('newsletters').insert(payload));
    }
    setSaving(false);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: payload.status === 'scheduled' ? 'Newsletter scheduled!' : 'Draft saved!' });
      setEditorOpen(false);
      resetForm();
      fetchNewsletters();
    }
  };

  const sendNewsletter = async (newsletter: Newsletter) => {
    const confirmed = window.confirm(
      `Send this newsletter "${newsletter.subject}" to ${recipientType === 'custom' ? 'selected' : 'all'} subscribers?`
    );
    if (!confirmed) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { newsletterId: newsletter.id },
      });
      if (error) throw error;
      toast({
        title: 'Newsletter sent!',
        description: `Sent to ${data?.recipientCount || 0} recipients${data?.failedCount ? ` (${data.failedCount} failed)` : ''}.`,
      });
      fetchNewsletters();
      fetchEmailAnalytics();
    } catch (err: any) {
      toast({ title: 'Error sending newsletter', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const deleteNewsletter = async (id: string) => {
    if (!window.confirm('Delete this newsletter?')) return;
    const { error } = await supabase.from('newsletters').delete().eq('id', id);
    if (!error) { toast({ title: 'Newsletter deleted' }); fetchNewsletters(); }
  };

  const openPreview = (n: Newsletter) => { setPreviewNewsletter(n); setPreviewOpen(true); };

  const syncSubscribers = async () => {
    setSyncingSubscribers(true);
    try {
      const { data, error } = await supabase.rpc('sync_form_emails_to_subscribers');
      if (error) throw error;
      const result = data as any;
      toast({
        title: 'Subscribers synced!',
        description: `${result?.new_subscribers || 0} new emails added from form submissions.`,
      });
      fetchSubscriberCount();
    } catch (err: any) {
      toast({ title: 'Sync failed', description: err.message, variant: 'destructive' });
    } finally {
      setSyncingSubscribers(false);
    }
  };

  const filteredLogs = emailLogs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return log.recipient_email.toLowerCase().includes(q) ||
        (log.metadata?.subject || '').toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500 text-white gap-1"><CheckCircle className="h-3 w-3" /> Sent</Badge>;
      case 'failed':
      case 'dlq':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'suppressed':
        return <Badge className="bg-amber-500 text-white gap-1"><AlertTriangle className="h-3 w-3" /> Suppressed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getNewsletterStatusBadge = (n: Newsletter) => {
    if (n.status === 'sent') return <Badge className="bg-green-500 text-white">Sent</Badge>;
    if (n.status === 'scheduled') return <Badge className="bg-blue-500 text-white gap-1"><CalendarClock className="h-3 w-3" /> Scheduled</Badge>;
    return <Badge variant="secondary">Draft</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="campaigns" className="space-y-6">
      <TabsList>
        <TabsTrigger value="campaigns" className="gap-2"><Mail className="h-4 w-4" /> Campaigns</TabsTrigger>
        <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
      </TabsList>

      {/* CAMPAIGNS TAB */}
      <TabsContent value="campaigns" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="h-5 w-5 text-blue-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscribers</p>
                  <p className="text-2xl font-bold">{subscriberCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg"><FileText className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">{newsletters.filter(n => n.status === 'draft').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg"><CalendarClock className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{newsletters.filter(n => n.status === 'scheduled').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg"><Send className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-2xl font-bold">{newsletters.filter(n => n.status === 'sent').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync subscribers */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sync Form Submissions</p>
                <p className="text-sm text-muted-foreground">Pull all emails from Contact, Careers, Training & Assessment forms into your subscriber list.</p>
              </div>
              <Button variant="outline" onClick={syncSubscribers} disabled={syncingSubscribers} className="gap-2">
                {syncingSubscribers ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Newsletters list */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Campaigns</CardTitle>
              <CardDescription>Create and manage your email marketing campaigns</CardDescription>
            </div>
            <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> New Campaign</Button>
          </CardHeader>
          <CardContent>
            {newsletters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No campaigns yet</p>
                <p className="text-sm">Create your first email campaign to engage your subscribers.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((n, i) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{n.subject}</TableCell>
                      <TableCell>{getNewsletterStatusBadge(n)}</TableCell>
                      <TableCell>{n.status === 'sent' ? n.recipient_count : '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {n.status === 'scheduled' && n.scheduled_at ? (
                          <span className="flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" />
                            {new Date(n.scheduled_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        ) : (
                          new Date(n.status === 'sent' ? n.sent_at! : n.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openPreview(n)} title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(n.status === 'draft' || n.status === 'scheduled') && (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => openEdit(n)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {n.status === 'draft' && (
                                <Button size="icon" variant="ghost" onClick={() => sendNewsletter(n)}
                                  disabled={sending} title="Send Now">
                                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                              )}
                              <Button size="icon" variant="ghost" onClick={() => deleteNewsletter(n.id)} title="Delete"
                                className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ANALYTICS TAB */}
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Mail className="h-5 w-5 text-blue-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Emails</p>
                  <p className="text-2xl font-bold">{analyticsStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg"><CheckCircle className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{analyticsStats.sent}</p>
                  {analyticsStats.total > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((analyticsStats.sent / analyticsStats.total) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg"><XCircle className="h-5 w-5 text-red-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold">{analyticsStats.failed}</p>
                  {analyticsStats.total > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((analyticsStats.failed / analyticsStats.total) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{analyticsStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Email Delivery Log</CardTitle>
            <CardDescription>Track the delivery status of every newsletter email sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-1">
                {(['24h', '7d', '30d', 'all'] as const).map(range => (
                  <Button key={range} size="sm" variant={timeRange === range ? 'default' : 'outline'}
                    onClick={() => setTimeRange(range)}>
                    {range === '24h' ? '24h' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
                  </Button>
                ))}
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suppressed">Suppressed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by email or subject..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="sm" onClick={fetchEmailAnalytics} disabled={analyticsLoading}>
                {analyticsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
              </Button>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No email logs yet</p>
                <p className="text-sm">Send your first newsletter to see delivery analytics here.</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Showing {filteredLogs.length} email{filteredLogs.length !== 1 ? 's' : ''}
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.slice(0, 100).map((log, i) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-mono text-sm max-w-[200px] truncate">{log.recipient_email}</TableCell>
                          <TableCell className="max-w-[180px] truncate text-sm">{log.metadata?.subject || '—'}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-destructive">
                            {log.error_message || '—'}
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
      </TabsContent>

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
            <DialogDescription>Compose your newsletter email to send to subscribers.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Subject Line *</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Mental Wellness Tips for This Month" />
            </div>

            <div>
              <Label>Hero Image (optional)</Label>
              <div className="flex gap-2 items-center">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? 'Uploading...' : imageUrl ? 'Change image' : 'Upload an image'}
                  </div>
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const ext = file.name.split('.').pop() || 'jpg';
                        const fileName = `newsletter-${Date.now()}.${ext}`;
                        const { error: uploadError } = await supabase.storage
                          .from('email-assets').upload(fileName, file, { upsert: true });
                        if (uploadError) throw uploadError;
                        const { data: urlData } = supabase.storage.from('email-assets').getPublicUrl(fileName);
                        setImageUrl(urlData.publicUrl);
                        toast({ title: 'Image uploaded!' });
                      } catch (err: any) {
                        toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
                      } finally {
                        setUploadingImage(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
                {imageUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setImageUrl('')}
                    className="text-destructive hover:text-destructive">Remove</Button>
                )}
              </div>
              {uploadingImage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading image...
                </div>
              )}
              {imageUrl && !uploadingImage && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div>
              <Label>Email Content *</Label>
              <p className="text-xs text-muted-foreground mb-1">
                Use simple text. Each paragraph will be formatted. Use **bold** for emphasis.
              </p>
              <Textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write your newsletter content here..." className="min-h-[200px]" />
            </div>

            <div>
              <Label>Recipients</Label>
              <Select value={recipientType} onValueChange={v => setRecipientType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers ({subscriberCount})</SelectItem>
                  <SelectItem value="custom">Specific Emails</SelectItem>
                </SelectContent>
              </Select>
              {recipientType === 'custom' && (
                <Textarea value={customEmails} onChange={e => setCustomEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com" className="mt-2" />
              )}
            </div>

            {/* Scheduling */}
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <Label className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" /> Schedule for Later (optional)
              </Label>
              <p className="text-xs text-muted-foreground">
                Set a date and time to automatically send this newsletter. Leave empty to save as draft.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label className="text-xs">Time</Label>
                  <Input type="time" value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)} />
                </div>
              </div>
              {scheduleDate && scheduleTime && (
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  Will be sent on {new Date(`${scheduleDate}T${scheduleTime}:00`).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={saveDraft} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {scheduleDate && scheduleTime ? 'Schedule' : 'Save Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {previewNewsletter?.subject}</DialogTitle>
          </DialogHeader>
          {previewNewsletter && (
            <div className="border rounded-lg p-6 bg-muted/30">
              {previewNewsletter.image_url && (
                <img src={previewNewsletter.image_url} alt="Hero"
                  className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <div className="prose prose-sm max-w-none">
                {previewNewsletter.content.split('\n').map((para, i) => (
                  <p key={i} className="text-sm text-foreground leading-relaxed mb-3">
                    {para.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default NewsletterTab;
