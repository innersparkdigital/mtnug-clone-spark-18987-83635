import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, AlertTriangle, Activity, TrendingUp, Eye, RefreshCw } from 'lucide-react';

interface ChatSession {
  id: string;
  anonymous_id: string;
  source_path: string | null;
  user_agent: string | null;
  message_count: number;
  high_risk_triggered: boolean;
  escalated: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  role: string;
  content: string;
  flagged: boolean;
  created_at: string;
}

interface ChatEvent {
  id: string;
  session_id: string | null;
  event_type: string;
  metadata: any;
  created_at: string;
}

const ChatAnalyticsTab = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high_risk' | 'escalated' | 'normal'>('all');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: sess }, { data: ev }] = await Promise.all([
        supabase.from('chat_sessions').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('chat_events').select('*').order('created_at', { ascending: false }).limit(500),
      ]);
      setSessions((sess || []) as ChatSession[]);
      setEvents((ev || []) as ChatEvent[]);
    } catch (e) {
      console.error('chat analytics fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openSession = async (session: ChatSession) => {
    setSelectedSession(session);
    setLoadingMessages(true);
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      setSessionMessages((data || []) as ChatMessage[]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (riskFilter === 'high_risk' && !s.high_risk_triggered) return false;
      if (riskFilter === 'escalated' && !s.escalated) return false;
      if (riskFilter === 'normal' && (s.high_risk_triggered || s.escalated)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.anonymous_id.toLowerCase().includes(q) &&
          !(s.source_path || '').toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [sessions, search, riskFilter]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const highRisk = sessions.filter((s) => s.high_risk_triggered).length;
    const escalated = sessions.filter((s) => s.escalated).length;
    const totalMessages = sessions.reduce((acc, s) => acc + (s.message_count || 0), 0);
    return { totalSessions, highRisk, escalated, totalMessages };
  }, [sessions]);

  const eventTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => { counts[e.event_type] = (counts[e.event_type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [events]);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Chat Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <MessageSquare className="h-7 w-7 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
              </div>
              <Activity className="h-7 w-7 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Escalated</p>
                <p className="text-2xl font-bold text-amber-600">{stats.escalated}</p>
              </div>
              <TrendingUp className="h-7 w-7 text-amber-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">High-Risk Triggers</p>
                <p className="text-2xl font-bold text-destructive">{stats.highRisk}</p>
              </div>
              <AlertTriangle className="h-7 w-7 text-destructive opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Breakdown</CardTitle>
          <CardDescription>Counts of analytics events captured by the AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          {eventTypeCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {eventTypeCounts.map(([type, count]) => (
                <Badge
                  key={type}
                  variant={type === 'high_risk_detected' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {type}: {count}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Chat Sessions</CardTitle>
              <CardDescription>Anonymized conversations from the AI Support Assistant</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search anon ID / path..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-56"
              />
              <Select value={riskFilter} onValueChange={(v: any) => setRiskFilter(v)}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sessions</SelectItem>
                  <SelectItem value="high_risk">High-risk only</SelectItem>
                  <SelectItem value="escalated">Escalated only</SelectItem>
                  <SelectItem value="normal">Normal only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchData} className="h-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No sessions match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Anon ID</TableHead>
                    <TableHead>Source Path</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((s, i) => (
                    <TableRow key={s.id} className={s.high_risk_triggered ? 'bg-destructive/5' : ''}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="text-xs">
                        {new Date(s.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.anonymous_id.slice(0, 12)}…</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{s.source_path || '—'}</TableCell>
                      <TableCell>{s.message_count}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.high_risk_triggered && <Badge variant="destructive" className="text-xs">High Risk</Badge>}
                          {s.escalated && !s.high_risk_triggered && <Badge className="text-xs bg-amber-500">Escalated</Badge>}
                          {!s.high_risk_triggered && !s.escalated && <Badge variant="secondary" className="text-xs">Normal</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => openSession(s)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
          <CardDescription>Last 50 chat analytics events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.slice(0, 50).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{new Date(e.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={e.event_type === 'high_risk_detected' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {e.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.session_id?.slice(0, 12) || '—'}…</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Messages dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat Transcript
              {selectedSession?.high_risk_triggered && (
                <Badge variant="destructive" className="ml-2">High Risk</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="text-xs text-muted-foreground border-b pb-2 mb-2 space-y-1">
              <div>Started: {new Date(selectedSession.created_at).toLocaleString()}</div>
              <div>Source: {selectedSession.source_path || '—'}</div>
              <div className="font-mono">Anon: {selectedSession.anonymous_id}</div>
            </div>
          )}
          <ScrollArea className="h-[400px] pr-4">
            {loadingMessages ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sessionMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No messages in this session.</p>
            ) : (
              <div className="space-y-3">
                {sessionMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      m.role === 'user'
                        ? 'bg-primary/10 ml-8'
                        : 'bg-muted mr-8'
                    } ${m.flagged ? 'border border-destructive/50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        {m.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.flagged && (
                      <Badge variant="destructive" className="text-xs mt-2">Flagged</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatAnalyticsTab;