import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Heart, TrendingUp, Users, Clock, Activity, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Tooltip, Legend, CartesianGrid
} from 'recharts';

interface Who5Session {
  id: string;
  session_id: string;
  source: string | null;
  device_type: string | null;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  last_question_reached: number | null;
  raw_score: number | null;
  percentage_score: number | null;
  wellbeing_level: string | null;
  time_taken_seconds: number | null;
}

interface CtaClick {
  id: string;
  session_id: string;
  cta_type: string;
  source: string | null;
  device_type: string | null;
  clicked_at: string;
}

const LEVEL_COLORS: Record<string, string> = {
  'Very Low Wellbeing': '#ef4444',
  'Low Wellbeing': '#eab308',
  'Moderate Wellbeing': '#84cc16',
  'Good Wellbeing': '#22c55e',
};

const CTA_LABELS: Record<string, string> = {
  app_download: 'App Download',
  talk_therapist: 'Talk to Therapist',
  support_group: 'Support Groups',
  detailed_assessment: 'Detailed Tests',
};

const Who5AnalyticsTab = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [sessions, setSessions] = useState<Who5Session[]>([]);
  const [ctaClicks, setCtaClicks] = useState<CtaClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const fetchData = useCallback(async () => {
    if (!user || !isAdmin) return;
    try {
      const [sessionsRes, ctaRes] = await Promise.all([
        supabase.from('who5_sessions').select('*').order('started_at', { ascending: false }),
        supabase.from('who5_cta_clicks').select('*').order('clicked_at', { ascending: false }),
      ]);
      setSessions((sessionsRes.data || []) as unknown as Who5Session[]);
      setCtaClicks((ctaRes.data || []) as unknown as CtaClick[]);
    } catch (e) {
      console.error('WHO-5 analytics error:', e);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime
  useEffect(() => {
    if (!user || !isAdmin) return;
    const channel = supabase
      .channel('who5-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'who5_sessions' }, (payload) => {
        if (payload.eventType === 'INSERT') setSessions(prev => [payload.new as unknown as Who5Session, ...prev]);
        else if (payload.eventType === 'UPDATE') setSessions(prev => prev.map(s => s.id === (payload.new as any).id ? (payload.new as unknown as Who5Session) : s));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'who5_cta_clicks' }, (payload) => {
        setCtaClicks(prev => [payload.new as unknown as CtaClick, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isAdmin]);

  const getDateFilter = useCallback(() => {
    const now = new Date();
    if (dateRange === '7d') return new Date(now.getTime() - 7 * 86400000);
    if (dateRange === '30d') return new Date(now.getTime() - 30 * 86400000);
    if (dateRange === '90d') return new Date(now.getTime() - 90 * 86400000);
    return new Date(0);
  }, [dateRange]);

  const filtered = useMemo(() => sessions.filter(s => new Date(s.started_at) >= getDateFilter()), [sessions, getDateFilter]);
  const filteredCta = useMemo(() => ctaClicks.filter(c => new Date(c.clicked_at) >= getDateFilter()), [ctaClicks, getDateFilter]);

  const completed = useMemo(() => filtered.filter(s => s.completed_at), [filtered]);
  const abandoned = useMemo(() => filtered.filter(s => s.abandoned_at && !s.completed_at), [filtered]);

  const avgScore = useMemo(() => {
    const withScore = completed.filter(s => s.percentage_score !== null);
    return withScore.length ? Math.round(withScore.reduce((sum, s) => sum + s.percentage_score!, 0) / withScore.length) : 0;
  }, [completed]);

  const avgTime = useMemo(() => {
    const withTime = completed.filter(s => s.time_taken_seconds !== null);
    return withTime.length ? Math.round(withTime.reduce((sum, s) => sum + s.time_taken_seconds!, 0) / withTime.length) : 0;
  }, [completed]);

  // Wellbeing distribution
  const wellbeingDist = useMemo(() => {
    const counts: Record<string, number> = {};
    completed.forEach(s => { if (s.wellbeing_level) counts[s.wellbeing_level] = (counts[s.wellbeing_level] || 0) + 1; });
    const total = completed.length || 1;
    return Object.entries(counts).map(([level, count]) => ({
      name: level,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: LEVEL_COLORS[level] || '#6b7280',
    }));
  }, [completed]);

  // CTA clicks
  const ctaDist = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredCta.forEach(c => { counts[c.cta_type] = (counts[c.cta_type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({
      name: CTA_LABELS[type] || type,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [filteredCta]);

  // Daily trends
  const dailyTrends = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 60;
    const trends = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      trends.push({
        date: ds,
        started: filtered.filter(s => s.started_at.startsWith(ds)).length,
        completed: completed.filter(s => s.completed_at?.startsWith(ds)).length,
        ctaClicks: filteredCta.filter(c => c.clicked_at.startsWith(ds)).length,
      });
    }
    return trends;
  }, [dateRange, filtered, completed, filteredCta]);

  // Export
  const exportCSV = useCallback(() => {
    const headers = ['Session ID', 'Source', 'Device', 'Started', 'Completed', 'Raw Score', 'Percentage', 'Level', 'Time (s)'];
    const rows = filtered.map(s => [
      s.session_id, s.source || '', s.device_type || '',
      new Date(s.started_at).toLocaleString(),
      s.completed_at ? new Date(s.completed_at).toLocaleString() : '',
      s.raw_score?.toString() || '', s.percentage_score?.toString() || '',
      s.wellbeing_level || '', s.time_taken_seconds?.toString() || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `who5-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }, [filtered]);

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading WHO-5 data...</div>;

  return (
    <div className="space-y-6">
      {/* Date filter + Export */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <Button key={range} variant={dateRange === range ? 'default' : 'outline'} size="sm" onClick={() => setDateRange(range)}>
              {range === 'all' ? 'All Time' : range}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Tests Started', value: filtered.length, icon: Heart, color: 'text-pink-500' },
          { label: 'Completed', value: completed.length, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Completion Rate', value: `${filtered.length ? Math.round((completed.length / filtered.length) * 100) : 0}%`, icon: Activity, color: 'text-blue-500' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: Zap, color: 'text-amber-500' },
          { label: 'Avg Time', value: `${avgTime}s`, icon: Clock, color: 'text-indigo-500' },
          { label: 'CTA Clicks', value: filteredCta.length, icon: Users, color: 'text-purple-500' },
        ].map(m => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                <p className="text-[11px] text-muted-foreground truncate">{m.label}</p>
              </div>
              <p className="text-xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellbeing Distribution Pie */}
        <Card>
          <CardHeader><CardTitle className="text-base">Wellbeing Level Distribution</CardTitle></CardHeader>
          <CardContent>
            {wellbeingDist.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={wellbeingDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percentage }) => `${name} (${percentage}%)`}>
                    {wellbeingDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">No completed tests yet</p>}
          </CardContent>
        </Card>

        {/* CTA Clicks Bar */}
        <Card>
          <CardHeader><CardTitle className="text-base">CTA Click Distribution</CardTitle></CardHeader>
          <CardContent>
            {ctaDist.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ctaDist}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">No CTA clicks yet</p>}
          </CardContent>
        </Card>

        {/* Daily Trends Line */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Daily Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="started" stroke="#6366f1" name="Started" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#22c55e" name="Completed" strokeWidth={2} />
                <Line type="monotone" dataKey="ctaClicks" stroke="#f59e0b" name="CTA Clicks" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent WHO-5 Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(s => (
                  <tr key={s.id} className="border-b border-border/30">
                    <td className="py-2">{new Date(s.started_at).toLocaleDateString()}</td>
                    <td className="py-2">{s.source || '-'}</td>
                    <td className="py-2">{s.device_type || '-'}</td>
                    <td className="py-2">{s.percentage_score !== null ? `${s.percentage_score}%` : '-'}</td>
                    <td className="py-2">
                      {s.wellbeing_level ? (
                        <Badge style={{ backgroundColor: `${LEVEL_COLORS[s.wellbeing_level]}20`, color: LEVEL_COLORS[s.wellbeing_level], borderColor: `${LEVEL_COLORS[s.wellbeing_level]}40` }} className="border text-xs">
                          {s.wellbeing_level}
                        </Badge>
                      ) : '-'}
                    </td>
                    <td className="py-2">{s.time_taken_seconds ? `${s.time_taken_seconds}s` : '-'}</td>
                    <td className="py-2">
                      {s.completed_at ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Completed</Badge>
                      ) : s.abandoned_at ? (
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">Abandoned</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">In Progress</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No WHO-5 sessions yet. Share the /wellbeing-check link to start collecting data.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Who5AnalyticsTab;
