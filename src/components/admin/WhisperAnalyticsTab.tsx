import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Sparkles, AlertTriangle, Clock, MessageSquare, TrendingUp, Globe, Repeat, Mic, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { format, subDays, differenceInHours, startOfDay } from 'date-fns';

type W = {
  id: string; email: string; created_at: string; status: string;
  duration_seconds: number | null; topic_hint: string | null; reply_sent_at: string | null;
  replied_by: string | null; ai_sentiment: string | null; ai_urgency: string | null;
  ai_theme: string | null; ai_crisis: boolean | null; ai_language_detected: string | null;
  ai_summary: string | null; ai_analyzed_at: string | null; country: string | null;
  language: string | null;
};
type EV = { id: string; whisper_id: string; event_type: string; created_at: string };

const COLORS = ['#0a4a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function WhisperAnalyticsTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [whispers, setWhispers] = useState<W[]>([]);
  const [events, setEvents] = useState<EV[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: w }, { data: e }] = await Promise.all([
        supabase.from('whispers').select('*').order('created_at', { ascending: false }).limit(1000),
        supabase.from('whisper_events').select('*').order('created_at', { ascending: false }).limit(2000),
      ]);
      setWhispers((w || []) as W[]);
      setEvents((e || []) as EV[]);
    } catch (err: any) {
      toast({ title: 'Failed to load analytics', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const runAI = async () => {
    setAnalyzing(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-whisper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${sess.session?.access_token || ''}`,
        },
        body: JSON.stringify({}),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed');
      toast({ title: `Analyzed ${j.analyzed} whispers` });
      load();
    } catch (err: any) {
      toast({ title: 'AI analysis failed', description: err.message, variant: 'destructive' });
    } finally { setAnalyzing(false); }
  };

  const stats = useMemo(() => computeStats(whispers, events), [whispers, events]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Whisper Analytics</h2>
          <p className="text-sm text-muted-foreground">Volume, response performance, engagement, content & safety insights.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={runAI} disabled={analyzing}>
            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Analyze new whispers (AI)
          </Button>
        </div>
      </div>

      {/* Crisis alert banner */}
      {stats.crisisList.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4 pb-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">{stats.crisisList.length} CRISIS-flagged whisper{stats.crisisList.length > 1 ? 's' : ''} need urgent attention</p>
              <ul className="mt-2 space-y-1 text-sm text-red-900">
                {stats.crisisList.slice(0, 5).map(w => (
                  <li key={w.id} className="flex items-center justify-between gap-2">
                    <span>{w.email} · {format(new Date(w.created_at), 'MMM d, h:mm a')} · "{w.ai_summary || w.topic_hint || '—'}"</span>
                    <Badge variant="destructive">{w.ai_urgency}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.staleCount > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-3 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <span className="text-amber-900 font-medium">
              {stats.staleCount} whisper{stats.staleCount > 1 ? 's' : ''} unreplied for over 72h
            </span>
          </CardContent>
        </Card>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Total" value={stats.total} icon={MessageSquare} />
        <KPI label="This week" value={stats.thisWeek} icon={TrendingUp} />
        <KPI label="Today" value={stats.today} icon={Heart} />
        <KPI label="Avg response" value={stats.avgResponseHrs == null ? '—' : `${stats.avgResponseHrs.toFixed(1)}h`} icon={Clock} />
        <KPI label="Backlog >24h" value={stats.backlog24} icon={AlertTriangle} highlight={stats.backlog24 > 0} />
        <KPI label="Repeat senders" value={stats.repeatSenders} icon={Repeat} />
      </div>

      {/* SLA + reply performance */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">SLA — replied within</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <SlaBox label="≤ 24h" value={stats.sla24} pct={pct(stats.sla24, stats.repliedTotal)} color="text-green-600" />
              <SlaBox label="≤ 48h" value={stats.sla48} pct={pct(stats.sla48, stats.repliedTotal)} color="text-amber-600" />
              <SlaBox label="> 48h" value={stats.slaOver48} pct={pct(stats.slaOver48, stats.repliedTotal)} color="text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Out of {stats.repliedTotal} replied whispers.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Engagement (after reply sent)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <SlaBox label="Reply opened" value={stats.openedCount} pct={pct(stats.openedCount, stats.repliedTotal)} color="text-primary" />
              <SlaBox label="Audio played" value={stats.playedCount} pct={pct(stats.playedCount, stats.repliedTotal)} color="text-primary" />
              <SlaBox label="CTA: Book" value={stats.ctaBook} pct={pct(stats.ctaBook, stats.repliedTotal)} color="text-green-600" />
              <SlaBox label="CTA: Talk" value={stats.ctaTalk} pct={pct(stats.ctaTalk, stats.repliedTotal)} color="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily trend */}
      <Card>
        <CardHeader><CardTitle className="text-base">Daily volume — last 30 days</CardTitle></CardHeader>
        <CardContent style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="d" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0a4a8a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hour heatmap */}
      <Card>
        <CardHeader><CardTitle className="text-base">Peak hours (local)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
            {stats.hours.map((h) => (
              <div key={h.hour} className="flex flex-col items-center">
                <div
                  className="w-full rounded"
                  title={`${h.hour}:00 — ${h.count} whispers`}
                  style={{
                    height: 36,
                    background: `rgba(10, 74, 138, ${stats.maxHour ? 0.1 + 0.9 * (h.count / stats.maxHour) : 0.1})`,
                  }}
                />
                <span className="text-[9px] text-muted-foreground mt-1">{h.hour}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Darker = more whispers. Use this to schedule therapist on-call hours.</p>
        </CardContent>
      </Card>

      {/* Themes + sentiment + urgency + duration */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Top themes (AI)</CardTitle></CardHeader>
          <CardContent style={{ height: 260 }}>
            {stats.themes.length === 0 ? (
              <Empty msg="Run AI analysis to extract themes." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.themes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="theme" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0a4a8a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Sentiment / Urgency</CardTitle></CardHeader>
          <CardContent style={{ height: 260 }}>
            {stats.sentiment.length === 0 ? (
              <Empty msg="Run AI analysis." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.sentiment} dataKey="count" nameKey="name" outerRadius={70} label>
                    {stats.sentiment.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Duration + Languages + Geography */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mic className="w-4 h-4" /> Recording duration</CardTitle></CardHeader>
          <CardContent style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.durations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-1 text-center">Avg: {stats.avgDuration}s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Languages (AI-detected)</CardTitle></CardHeader>
          <CardContent>
            {stats.languages.length === 0 ? <Empty msg="Run AI analysis." /> : (
              <ul className="space-y-2 text-sm">
                {stats.languages.map(l => (
                  <li key={l.lang} className="flex justify-between border-b last:border-0 py-1">
                    <span className="font-mono uppercase">{l.lang}</span>
                    <span className="text-muted-foreground">{l.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Geography</CardTitle></CardHeader>
          <CardContent>
            {stats.countries.length === 0 ? <Empty msg="No geo data captured yet." /> : (
              <ul className="space-y-2 text-sm">
                {stats.countries.map(c => (
                  <li key={c.country} className="flex justify-between border-b last:border-0 py-1">
                    <span className="font-mono uppercase">{c.country}</span>
                    <span className="text-muted-foreground">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Returning / Triage / Per-therapist */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Returning vs new senders</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-center">
              <SlaBox label="New" value={stats.newEmails} pct={pct(stats.newEmails, stats.uniqueEmails)} color="text-primary" />
              <SlaBox label="Returning" value={stats.returningEmails} pct={pct(stats.returningEmails, stats.uniqueEmails)} color="text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">{stats.uniqueEmails} unique senders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Triage quality</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-center">
              <SlaBox label="Replied" value={stats.repliedTotal} pct={pct(stats.repliedTotal, stats.total)} color="text-green-600" />
              <SlaBox label="Archived" value={stats.archivedTotal} pct={pct(stats.archivedTotal, stats.total)} color="text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Replies per admin</CardTitle></CardHeader>
          <CardContent>
            {stats.byReplier.length === 0 ? <Empty msg="No replies recorded yet." /> : (
              <ul className="space-y-2 text-sm">
                {stats.byReplier.map(r => (
                  <li key={r.id} className="flex justify-between border-b last:border-0 py-1">
                    <span className="truncate">{r.id.slice(0, 8)}…</span>
                    <span className="text-muted-foreground">{r.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }

function KPI({ label, value, icon: Icon, highlight }: any) {
  return (
    <Card className={highlight ? 'border-red-300 bg-red-50' : ''}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function SlaBox({ label, value, pct, color }: any) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{pct}%</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{msg}</div>;
}

function computeStats(whispers: W[], events: EV[]) {
  const now = new Date();
  const today0 = startOfDay(now);
  const week0 = subDays(today0, 6);

  const total = whispers.length;
  const thisWeek = whispers.filter(w => new Date(w.created_at) >= week0).length;
  const today = whispers.filter(w => new Date(w.created_at) >= today0).length;

  const replied = whispers.filter(w => w.reply_sent_at);
  const repliedTotal = replied.length;
  const responseHrs = replied.map(w => differenceInHours(new Date(w.reply_sent_at!), new Date(w.created_at)));
  const avgResponseHrs = responseHrs.length ? responseHrs.reduce((a, b) => a + b, 0) / responseHrs.length : null;
  const sla24 = responseHrs.filter(h => h <= 24).length;
  const sla48 = responseHrs.filter(h => h > 24 && h <= 48).length;
  const slaOver48 = responseHrs.filter(h => h > 48).length;

  const backlog24 = whispers.filter(w =>
    (w.status === 'new' || w.status === 'in_review')
    && differenceInHours(now, new Date(w.created_at)) >= 24
  ).length;
  const staleCount = whispers.filter(w =>
    (w.status === 'new' || w.status === 'in_review')
    && differenceInHours(now, new Date(w.created_at)) >= 72
  ).length;

  // Daily 30-day trend
  const dayMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = subDays(today0, i);
    dayMap[format(d, 'MMM d')] = 0;
  }
  whispers.forEach(w => {
    const d = format(new Date(w.created_at), 'MMM d');
    if (d in dayMap) dayMap[d]++;
  });
  const daily = Object.entries(dayMap).map(([d, count]) => ({ d, count }));

  // Hours
  const hourCounts = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  whispers.forEach(w => { hourCounts[new Date(w.created_at).getHours()].count++; });
  const maxHour = Math.max(...hourCounts.map(h => h.count));

  // Themes
  const themeMap: Record<string, number> = {};
  whispers.forEach(w => { if (w.ai_theme) themeMap[w.ai_theme] = (themeMap[w.ai_theme] || 0) + 1; });
  const themes = Object.entries(themeMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([theme, count]) => ({ theme, count }));

  // Sentiment
  const sentMap: Record<string, number> = {};
  whispers.forEach(w => { if (w.ai_sentiment) sentMap[w.ai_sentiment] = (sentMap[w.ai_sentiment] || 0) + 1; });
  const sentiment = Object.entries(sentMap).map(([name, count]) => ({ name, count }));

  // Duration buckets
  const durBuckets: Record<string, number> = { '<15s': 0, '15–30s': 0, '30–60s': 0, '60–120s': 0, '>120s': 0 };
  let durSum = 0, durN = 0;
  whispers.forEach(w => {
    const d = w.duration_seconds || 0;
    if (d <= 0) return;
    durSum += d; durN++;
    if (d < 15) durBuckets['<15s']++;
    else if (d < 30) durBuckets['15–30s']++;
    else if (d < 60) durBuckets['30–60s']++;
    else if (d < 120) durBuckets['60–120s']++;
    else durBuckets['>120s']++;
  });
  const durations = Object.entries(durBuckets).map(([bucket, count]) => ({ bucket, count }));
  const avgDuration = durN ? Math.round(durSum / durN) : 0;

  // Languages
  const langMap: Record<string, number> = {};
  whispers.forEach(w => {
    const l = w.ai_language_detected || w.language;
    if (l) langMap[l] = (langMap[l] || 0) + 1;
  });
  const languages = Object.entries(langMap).sort((a, b) => b[1] - a[1]).map(([lang, count]) => ({ lang, count }));

  // Countries
  const countryMap: Record<string, number> = {};
  whispers.forEach(w => { if (w.country) countryMap[w.country] = (countryMap[w.country] || 0) + 1; });
  const countries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count }));

  // Returning emails
  const emailMap: Record<string, number> = {};
  whispers.forEach(w => { const e = (w.email || '').toLowerCase(); if (e) emailMap[e] = (emailMap[e] || 0) + 1; });
  const uniqueEmails = Object.keys(emailMap).length;
  const returningEmails = Object.values(emailMap).filter(n => n > 1).length;
  const newEmails = uniqueEmails - returningEmails;
  const repeatSenders = returningEmails;

  // By replier
  const replierMap: Record<string, number> = {};
  whispers.forEach(w => { if (w.replied_by) replierMap[w.replied_by] = (replierMap[w.replied_by] || 0) + 1; });
  const byReplier = Object.entries(replierMap).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, count }));

  // Engagement events
  const openedCount = uniqueByWhisper(events, 'reply_opened');
  const playedCount = uniqueByWhisper(events, 'audio_played');
  const ctaBook = events.filter(e => e.event_type === 'cta_book').length;
  const ctaTalk = events.filter(e => e.event_type === 'cta_talk').length;

  // Triage
  const archivedTotal = whispers.filter(w => w.status === 'archived').length;

  // Crisis list
  const crisisList = whispers
    .filter(w => w.ai_crisis || w.ai_urgency === 'crisis')
    .filter(w => w.status !== 'replied')
    .slice(0, 10);

  return {
    total, thisWeek, today, repliedTotal, archivedTotal,
    avgResponseHrs, sla24, sla48, slaOver48,
    backlog24, staleCount,
    daily, hours: hourCounts, maxHour,
    themes, sentiment,
    durations, avgDuration,
    languages, countries,
    uniqueEmails, returningEmails, newEmails, repeatSenders,
    byReplier,
    openedCount, playedCount, ctaBook, ctaTalk,
    crisisList,
  };
}

function uniqueByWhisper(events: EV[], type: string) {
  const set = new Set<string>();
  events.forEach(e => { if (e.event_type === type) set.add(e.whisper_id); });
  return set.size;
}