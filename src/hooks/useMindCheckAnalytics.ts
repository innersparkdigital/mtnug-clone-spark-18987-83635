import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from './useUserRole';

interface AssessmentSession {
  id: string;
  session_id: string;
  test_type: string;
  source: string;
  device_type: string;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  last_question_reached: number;
  total_questions: number;
  score: number | null;
  max_score: number | null;
  severity_level: string | null;
}

interface AssessmentEmail {
  id: string;
  session_id: string;
  email: string;
  test_type: string;
  severity_level: string | null;
  score: number | null;
  source: string;
  device_type: string;
  created_at: string;
}

interface PageVisit {
  id: string;
  session_id: string;
  source: string;
  device_type: string;
  visited_at: string;
}

export interface MindCheckStats {
  totalPageVisits: number;
  testsStarted: number;
  testsCompleted: number;
  testsAbandoned: number;
  completionRate: number;
  averageScore: number;
  emailsCollected: number;
}

export interface ConditionDistribution {
  condition: string;
  count: number;
  percentage: number;
}

export interface SeverityDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SourceAnalytics {
  source: string;
  visits: number;
  starts: number;
  completions: number;
  conversionRate: number;
}

export interface DailyTrend {
  date: string;
  visits: number;
  starts: number;
  completions: number;
}

export interface HourlyHeatmap {
  hour: number;
  label: string;
  visits: number;
  starts: number;
  completions: number;
}

export interface EngagementFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export interface ConditionSeverityMatrix {
  condition: string;
  minimal: number;
  mild: number;
  moderate: number;
  moderatelySevere: number;
  severe: number;
  total: number;
}

export interface RepeatUserStats {
  uniqueEmails: number;
  repeatUsers: number;
  repeatRate: number;
  avgTestsPerUser: number;
}

export interface WeekdayAnalytics {
  day: string;
  visits: number;
  starts: number;
  completions: number;
}

export const useMindCheckAnalytics = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [emails, setEmails] = useState<AssessmentEmail[]>([]);
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isRealtime, setIsRealtime] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const [sessionsRes, emailsRes, visitsRes] = await Promise.all([
        supabase.from('assessment_sessions').select('*').order('started_at', { ascending: false }),
        supabase.from('assessment_emails').select('*').order('created_at', { ascending: false }),
        supabase.from('mindcheck_page_visits').select('*').order('visited_at', { ascending: false }),
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      if (emailsRes.error) throw emailsRes.error;
      if (visitsRes.error) throw visitsRes.error;

      setSessions((sessionsRes.data || []) as unknown as AssessmentSession[]);
      setEmails((emailsRes.data || []) as unknown as AssessmentEmail[]);
      setVisits((visitsRes.data || []) as unknown as PageVisit[]);
    } catch (error) {
      console.error('Error fetching Mind Check analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase
      .channel('mindcheck-analytics-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assessment_sessions' }, (payload) => {
        setIsRealtime(true);
        if (payload.eventType === 'INSERT') {
          setSessions(prev => [payload.new as unknown as AssessmentSession, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setSessions(prev => prev.map(s => s.id === (payload.new as any).id ? (payload.new as unknown as AssessmentSession) : s));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assessment_emails' }, (payload) => {
        setIsRealtime(true);
        setEmails(prev => [payload.new as unknown as AssessmentEmail, ...prev]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mindcheck_page_visits' }, (payload) => {
        setIsRealtime(true);
        setVisits(prev => [payload.new as unknown as PageVisit, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchData();
    else setLoading(false);
  }, [fetchData, isAdmin]);

  // Filter by date range
  const getDateFilter = useCallback(() => {
    const now = new Date();
    if (dateRange === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (dateRange === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (dateRange === '90d') return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    return new Date(0);
  }, [dateRange]);

  const filteredSessions = useMemo(() => sessions.filter(s => new Date(s.started_at) >= getDateFilter()), [sessions, getDateFilter]);
  const filteredVisits = useMemo(() => visits.filter(v => new Date(v.visited_at) >= getDateFilter()), [visits, getDateFilter]);
  const filteredEmails = useMemo(() => emails.filter(e => new Date(e.created_at) >= getDateFilter()), [emails, getDateFilter]);

  // Overview stats
  const stats: MindCheckStats = useMemo(() => {
    const completed = filteredSessions.filter(s => s.completed_at);
    const completedWithScores = filteredSessions.filter(s => s.score !== null && s.max_score !== null);
    return {
      totalPageVisits: filteredVisits.length,
      testsStarted: filteredSessions.length,
      testsCompleted: completed.length,
      testsAbandoned: filteredSessions.filter(s => s.abandoned_at && !s.completed_at).length,
      completionRate: filteredSessions.length > 0 ? Math.round((completed.length / filteredSessions.length) * 100) : 0,
      averageScore: completedWithScores.length > 0
        ? Math.round(completedWithScores.reduce((sum, s) => sum + ((s.score! / s.max_score!) * 100), 0) / completedWithScores.length)
        : 0,
      emailsCollected: filteredEmails.length,
    };
  }, [filteredSessions, filteredVisits, filteredEmails]);

  // Condition distribution
  const conditionDistribution: ConditionDistribution[] = useMemo(() => {
    const completed = filteredSessions.filter(s => s.completed_at);
    const counts: Record<string, number> = {};
    completed.forEach(s => { counts[s.test_type] = (counts[s.test_type] || 0) + 1; });
    const total = completed.length || 1;
    return Object.entries(counts)
      .map(([condition, count]) => ({
        condition: condition.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredSessions]);

  // Severity distribution
  const severityDistribution: SeverityDistribution[] = useMemo(() => {
    const completed = filteredSessions.filter(s => s.severity_level);
    const counts: Record<string, number> = {};
    completed.forEach(s => { counts[s.severity_level!] = (counts[s.severity_level!] || 0) + 1; });
    const total = completed.length || 1;
    const colorMap: Record<string, string> = {
      'Minimal': '#22c55e', 'Mild': '#84cc16', 'Moderate': '#eab308',
      'Moderately Severe': '#f97316', 'Severe': '#ef4444',
    };
    return Object.entries(counts)
      .map(([level, count]) => ({ level, count, percentage: Math.round((count / total) * 100), color: colorMap[level] || '#6b7280' }))
      .sort((a, b) => {
        const order = ['Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe'];
        return order.indexOf(a.level) - order.indexOf(b.level);
      });
  }, [filteredSessions]);

  // Source analytics
  const sourceAnalytics: SourceAnalytics[] = useMemo(() => {
    const sources = new Set<string>();
    filteredVisits.forEach(v => sources.add(v.source));
    filteredSessions.forEach(s => sources.add(s.source));
    return Array.from(sources).map(source => {
      const visitCount = filteredVisits.filter(v => v.source === source).length;
      const startCount = filteredSessions.filter(s => s.source === source).length;
      const completeCount = filteredSessions.filter(s => s.source === source && s.completed_at).length;
      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        visits: visitCount, starts: startCount, completions: completeCount,
        conversionRate: visitCount > 0 ? Math.round((completeCount / visitCount) * 100) : 0,
      };
    }).sort((a, b) => b.visits - a.visits);
  }, [filteredVisits, filteredSessions]);

  // Daily trends
  const dailyTrends: DailyTrend[] = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 60;
    const trends: DailyTrend[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends.push({
        date: dateStr,
        visits: filteredVisits.filter(v => v.visited_at.startsWith(dateStr)).length,
        starts: filteredSessions.filter(s => s.started_at.startsWith(dateStr)).length,
        completions: filteredSessions.filter(s => s.completed_at?.startsWith(dateStr)).length,
      });
    }
    return trends;
  }, [dateRange, filteredVisits, filteredSessions]);

  // Drop-off analysis
  const dropOffData = useMemo(() => {
    const abandoned = filteredSessions.filter(s => s.abandoned_at && !s.completed_at);
    const dropOffByQuestion: Record<number, number> = {};
    abandoned.forEach(s => { dropOffByQuestion[s.last_question_reached] = (dropOffByQuestion[s.last_question_reached] || 0) + 1; });
    return Object.entries(dropOffByQuestion)
      .map(([q, count]) => ({ question: parseInt(q), count }))
      .sort((a, b) => a.question - b.question);
  }, [filteredSessions]);

  // ===== ADVANCED ANALYTICS =====

  // Engagement funnel
  const engagementFunnel: EngagementFunnel[] = useMemo(() => {
    const visitCount = filteredVisits.length;
    const startCount = filteredSessions.length;
    const completedCount = filteredSessions.filter(s => s.completed_at).length;
    const emailCount = filteredEmails.length;
    const base = Math.max(visitCount, 1);
    return [
      { stage: 'Page Visits', count: visitCount, percentage: 100 },
      { stage: 'Tests Started', count: startCount, percentage: Math.round((startCount / base) * 100) },
      { stage: 'Tests Completed', count: completedCount, percentage: Math.round((completedCount / base) * 100) },
      { stage: 'Email Submitted', count: emailCount, percentage: Math.round((emailCount / base) * 100) },
    ];
  }, [filteredVisits, filteredSessions, filteredEmails]);

  // Hourly heatmap
  const hourlyHeatmap: HourlyHeatmap[] = useMemo(() => {
    const hours: HourlyHeatmap[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i.toString().padStart(2, '0')}:00`,
      visits: 0, starts: 0, completions: 0,
    }));
    filteredVisits.forEach(v => { hours[new Date(v.visited_at).getHours()].visits++; });
    filteredSessions.forEach(s => {
      hours[new Date(s.started_at).getHours()].starts++;
      if (s.completed_at) hours[new Date(s.completed_at).getHours()].completions++;
    });
    return hours;
  }, [filteredVisits, filteredSessions]);

  // Weekday analytics
  const weekdayAnalytics: WeekdayAnalytics[] = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days = dayNames.map(d => ({ day: d, visits: 0, starts: 0, completions: 0 }));
    filteredVisits.forEach(v => { days[new Date(v.visited_at).getDay()].visits++; });
    filteredSessions.forEach(s => {
      days[new Date(s.started_at).getDay()].starts++;
      if (s.completed_at) days[new Date(s.completed_at).getDay()].completions++;
    });
    return days;
  }, [filteredVisits, filteredSessions]);

  // Condition-severity matrix
  const conditionSeverityMatrix: ConditionSeverityMatrix[] = useMemo(() => {
    const completed = filteredSessions.filter(s => s.completed_at && s.severity_level);
    const matrix: Record<string, ConditionSeverityMatrix> = {};
    completed.forEach(s => {
      const condition = s.test_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!matrix[condition]) {
        matrix[condition] = { condition, minimal: 0, mild: 0, moderate: 0, moderatelySevere: 0, severe: 0, total: 0 };
      }
      matrix[condition].total++;
      const lvl = s.severity_level!;
      if (lvl === 'Minimal') matrix[condition].minimal++;
      else if (lvl === 'Mild') matrix[condition].mild++;
      else if (lvl === 'Moderate') matrix[condition].moderate++;
      else if (lvl === 'Moderately Severe') matrix[condition].moderatelySevere++;
      else if (lvl === 'Severe') matrix[condition].severe++;
    });
    return Object.values(matrix).sort((a, b) => b.total - a.total);
  }, [filteredSessions]);

  // Repeat user stats
  const repeatUserStats: RepeatUserStats = useMemo(() => {
    const emailCounts: Record<string, number> = {};
    filteredEmails.forEach(e => { emailCounts[e.email] = (emailCounts[e.email] || 0) + 1; });
    const uniqueEmails = Object.keys(emailCounts).length;
    const repeatUsers = Object.values(emailCounts).filter(c => c > 1).length;
    const totalTests = Object.values(emailCounts).reduce((sum, c) => sum + c, 0);
    return {
      uniqueEmails,
      repeatUsers,
      repeatRate: uniqueEmails > 0 ? Math.round((repeatUsers / uniqueEmails) * 100) : 0,
      avgTestsPerUser: uniqueEmails > 0 ? Math.round((totalTests / uniqueEmails) * 10) / 10 : 0,
    };
  }, [filteredEmails]);

  // Average completion time (minutes)
  const avgCompletionTime = useMemo(() => {
    const completed = filteredSessions.filter(s => s.completed_at && s.started_at);
    if (completed.length === 0) return 0;
    const totalMs = completed.reduce((sum, s) => {
      return sum + (new Date(s.completed_at!).getTime() - new Date(s.started_at).getTime());
    }, 0);
    return Math.round((totalMs / completed.length) / 60000 * 10) / 10;
  }, [filteredSessions]);

  // Top severity conditions (conditions with highest severe %)
  const highRiskConditions = useMemo(() => {
    return conditionSeverityMatrix
      .filter(c => c.total >= 2)
      .map(c => ({
        condition: c.condition,
        severePercent: Math.round(((c.severe + c.moderatelySevere) / c.total) * 100),
        total: c.total,
      }))
      .sort((a, b) => b.severePercent - a.severePercent)
      .slice(0, 5);
  }, [conditionSeverityMatrix]);

  // CSV exports
  const exportCSV = useCallback(() => {
    const headers = ['Email', 'Test Type', 'Severity', 'Score', 'Source', 'Device', 'Date'];
    const rows = filteredEmails.map(e => [
      e.email, e.test_type, e.severity_level || 'N/A', e.score?.toString() || 'N/A',
      e.source, e.device_type, new Date(e.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcheck-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEmails]);

  const exportAllSessionsCSV = useCallback(() => {
    const headers = ['Session ID', 'Test Type', 'Source', 'Device', 'Started', 'Completed', 'Abandoned', 'Last Question', 'Total Questions', 'Score', 'Max Score', 'Severity'];
    const rows = filteredSessions.map(s => [
      s.session_id, s.test_type, s.source, s.device_type,
      new Date(s.started_at).toLocaleString(),
      s.completed_at ? new Date(s.completed_at).toLocaleString() : '',
      s.abandoned_at ? new Date(s.abandoned_at).toLocaleString() : '',
      s.last_question_reached.toString(), s.total_questions.toString(),
      s.score?.toString() || '', s.max_score?.toString() || '', s.severity_level || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcheck-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredSessions]);

  // Generate full backup CSV content for email
  const generateBackupCSV = useCallback(() => {
    const sections: string[] = [];
    
    // Sessions
    const sHeaders = ['Session ID', 'Test Type', 'Source', 'Device', 'Started', 'Completed', 'Abandoned', 'Score', 'Max Score', 'Severity'];
    const sRows = sessions.map(s => [
      s.session_id, s.test_type, s.source, s.device_type,
      new Date(s.started_at).toLocaleString(),
      s.completed_at ? new Date(s.completed_at).toLocaleString() : '',
      s.abandoned_at ? new Date(s.abandoned_at).toLocaleString() : '',
      s.score?.toString() || '', s.max_score?.toString() || '', s.severity_level || '',
    ]);
    sections.push('=== ASSESSMENT SESSIONS ===\n' + [sHeaders, ...sRows].map(r => r.map(c => `"${c}"`).join(',')).join('\n'));
    
    // Emails
    const eHeaders = ['Email', 'Test Type', 'Severity', 'Score', 'Source', 'Device', 'Date'];
    const eRows = emails.map(e => [
      e.email, e.test_type, e.severity_level || '', e.score?.toString() || '',
      e.source, e.device_type, new Date(e.created_at).toLocaleDateString(),
    ]);
    sections.push('\n\n=== COLLECTED EMAILS ===\n' + [eHeaders, ...eRows].map(r => r.map(c => `"${c}"`).join(',')).join('\n'));
    
    // Visits
    const vHeaders = ['Session ID', 'Source', 'Device', 'Visited At'];
    const vRows = visits.map(v => [v.session_id, v.source, v.device_type, new Date(v.visited_at).toLocaleString()]);
    sections.push('\n\n=== PAGE VISITS ===\n' + [vHeaders, ...vRows].map(r => r.map(c => `"${c}"`).join(',')).join('\n'));
    
    return sections.join('');
  }, [sessions, emails, visits]);

  // Clear data
  const clearData = useCallback(async (tables: string[]) => {
    const { data, error } = await supabase.rpc('clear_mindcheck_data', { tables_to_clear: tables });
    if (error) throw error;
    // Refresh data
    await fetchData();
    return data;
  }, [fetchData]);

  return {
    stats,
    conditionDistribution,
    severityDistribution,
    sourceAnalytics,
    dailyTrends,
    dropOffData,
    emails: filteredEmails,
    sessions: filteredSessions,
    loading,
    dateRange,
    setDateRange,
    exportCSV,
    exportAllSessionsCSV,
    refetch: fetchData,
    isRealtime,
    // Advanced analytics
    engagementFunnel,
    hourlyHeatmap,
    weekdayAnalytics,
    conditionSeverityMatrix,
    repeatUserStats,
    avgCompletionTime,
    highRiskConditions,
  };
};
