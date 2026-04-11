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
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Plus,
  Send,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Users,
  FileText,
  Image as ImageIcon,
  Upload,
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
  created_at: string;
  updated_at: string;
}

const NewsletterTab = () => {
  const { toast } = useToast();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'custom'>('all');
  const [customEmails, setCustomEmails] = useState('');
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);

  const [subscriberCount, setSubscriberCount] = useState(0);

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

  useEffect(() => {
    fetchNewsletters();
    fetchSubscriberCount();
  }, [fetchNewsletters, fetchSubscriberCount]);

  const resetForm = () => {
    setEditId(null);
    setSubject('');
    setContent('');
    setImageUrl('');
    setRecipientType('all');
    setCustomEmails('');
  };

  const openNew = () => {
    resetForm();
    setEditorOpen(true);
  };

  const openEdit = (n: Newsletter) => {
    setEditId(n.id);
    setSubject(n.subject);
    setContent(n.content);
    setImageUrl(n.image_url || '');
    const filter = n.recipient_filter as any;
    setRecipientType(filter?.type === 'custom' ? 'custom' : 'all');
    setCustomEmails(filter?.emails?.join(', ') || '');
    setEditorOpen(true);
  };

  const saveDraft = async () => {
    if (!subject.trim()) {
      toast({ title: 'Subject is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const recipientFilter = recipientType === 'custom'
      ? { type: 'custom', emails: customEmails.split(',').map(e => e.trim()).filter(Boolean) }
      : { type: 'all' };

    const payload = {
      subject: subject.trim(),
      content,
      image_url: imageUrl || null,
      recipient_filter: recipientFilter,
      status: 'draft',
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from('newsletters').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('newsletters').insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'Error saving draft', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Draft saved!' });
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
        description: `Sent to ${data?.recipientCount || 0} recipients.`,
      });
      fetchNewsletters();
    } catch (err: any) {
      toast({
        title: 'Error sending newsletter',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const deleteNewsletter = async (id: string) => {
    if (!window.confirm('Delete this newsletter draft?')) return;
    const { error } = await supabase.from('newsletters').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Newsletter deleted' });
      fetchNewsletters();
    }
  };

  const openPreview = (n: Newsletter) => {
    setPreviewNewsletter(n);
    setPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
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
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
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
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Send className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent Campaigns</p>
                <p className="text-2xl font-bold">{newsletters.filter(n => n.status === 'sent').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletters list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Campaigns
            </CardTitle>
            <CardDescription>Create and manage your email marketing campaigns</CardDescription>
          </div>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> New Campaign
          </Button>
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
                    <TableCell>
                      <Badge variant={n.status === 'sent' ? 'default' : 'secondary'}
                        className={n.status === 'sent' ? 'bg-green-500' : ''}>
                        {n.status === 'sent' ? 'Sent' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{n.status === 'sent' ? n.recipient_count : '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(n.status === 'sent' ? n.sent_at! : n.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openPreview(n)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {n.status === 'draft' && (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => openEdit(n)} title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => sendNewsletter(n)}
                              disabled={sending} title="Send">
                              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
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
              <Label>Hero Image URL (optional)</Label>
              <div className="flex gap-2">
                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg" className="flex-1" />
              </div>
              {imageUrl && (
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
                placeholder="Write your newsletter content here..."
                className="min-h-[200px]" />
            </div>

            <div>
              <Label>Recipients</Label>
              <Select value={recipientType} onValueChange={v => setRecipientType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers ({subscriberCount})</SelectItem>
                  <SelectItem value="custom">Specific Emails</SelectItem>
                </SelectContent>
              </Select>
              {recipientType === 'custom' && (
                <Textarea value={customEmails} onChange={e => setCustomEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="mt-2" />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button variant="secondary" onClick={saveDraft} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Draft
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
    </div>
  );
};

export default NewsletterTab;
