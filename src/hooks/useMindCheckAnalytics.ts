import { useState, useEffect, useCallback } from 'react';
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

export const useMindCheckAnalytics = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [emails, setEmails] = useState<AssessmentEmail[]>([]);
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

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

  const filteredSessions = sessions.filter(s => new Date(s.started_at) >= getDateFilter());
  const filteredVisits = visits.filter(v => new Date(v.visited_at) >= getDateFilter());
  const filteredEmails = emails.filter(e => new Date(e.created_at) >= getDateFilter());

  // Overview stats
  const stats: MindCheckStats = {
    totalPageVisits: filteredVisits.length,
    testsStarted: filteredSessions.length,
    testsCompleted: filteredSessions.filter(s => s.completed_at).length,
    testsAbandoned: filteredSessions.filter(s => s.abandoned_at && !s.completed_at).length,
    completionRate: filteredSessions.length > 0
      ? Math.round((filteredSessions.filter(s => s.completed_at).length / filteredSessions.length) * 100)
      : 0,
    averageScore: (() => {
      const completed = filteredSessions.filter(s => s.score !== null && s.max_score !== null);
      if (completed.length === 0) return 0;
      const avgPercent = completed.reduce((sum, s) => sum + ((s.score! / s.max_score!) * 100), 0) / completed.length;
      return Math.round(avgPercent);
    })(),
    emailsCollected: filteredEmails.length,
  };

  // Condition distribution
  const conditionDistribution: ConditionDistribution[] = (() => {
    const completed = filteredSessions.filter(s => s.completed_at);
    const counts: Record<string, number> = {};
    completed.forEach(s => {
      counts[s.test_type] = (counts[s.test_type] || 0) + 1;
    });
    const total = completed.length || 1;
    return Object.entries(counts)
      .map(([condition, count]) => ({
        condition: condition.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  })();

  // Severity distribution
  const severityDistribution: SeverityDistribution[] = (() => {
    const completed = filteredSessions.filter(s => s.severity_level);
    const counts: Record<string, number> = {};
    completed.forEach(s => {
      counts[s.severity_level!] = (counts[s.severity_level!] || 0) + 1;
    });
    const total = completed.length || 1;
    const colorMap: Record<string, string> = {
      'Minimal': '#22c55e',
      'Mild': '#84cc16',
      'Moderate': '#eab308',
      'Moderately Severe': '#f97316',
      'Severe': '#ef4444',
    };
    return Object.entries(counts)
      .map(([level, count]) => ({
        level,
        count,
        percentage: Math.round((count / total) * 100),
        color: colorMap[level] || '#6b7280',
      }))
      .sort((a, b) => {
        const order = ['Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe'];
        return order.indexOf(a.level) - order.indexOf(b.level);
      });
  })();

  // Source analytics
  const sourceAnalytics: SourceAnalytics[] = (() => {
    const sources = new Set<string>();
    filteredVisits.forEach(v => sources.add(v.source));
    filteredSessions.forEach(s => sources.add(s.source));

    return Array.from(sources).map(source => {
      const visitCount = filteredVisits.filter(v => v.source === source).length;
      const startCount = filteredSessions.filter(s => s.source === source).length;
      const completeCount = filteredSessions.filter(s => s.source === source && s.completed_at).length;
      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        visits: visitCount,
        starts: startCount,
        completions: completeCount,
        conversionRate: visitCount > 0 ? Math.round((completeCount / visitCount) * 100) : 0,
      };
    }).sort((a, b) => b.visits - a.visits);
  })();

  // Daily trends
  const dailyTrends: DailyTrend[] = (() => {
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
  })();

  // Drop-off analysis
  const dropOffData = (() => {
    const abandoned = filteredSessions.filter(s => s.abandoned_at && !s.completed_at);
    const dropOffByQuestion: Record<number, number> = {};
    abandoned.forEach(s => {
      dropOffByQuestion[s.last_question_reached] = (dropOffByQuestion[s.last_question_reached] || 0) + 1;
    });
    return Object.entries(dropOffByQuestion)
      .map(([q, count]) => ({ question: parseInt(q), count }))
      .sort((a, b) => a.question - b.question);
  })();

  // CSV export
  const exportCSV = useCallback(() => {
    const headers = ['Email', 'Test Type', 'Severity', 'Score', 'Source', 'Device', 'Date'];
    const rows = filteredEmails.map(e => [
      e.email,
      e.test_type,
      e.severity_level || 'N/A',
      e.score?.toString() || 'N/A',
      e.source,
      e.device_type,
      new Date(e.created_at).toLocaleDateString(),
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
      s.session_id,
      s.test_type,
      s.source,
      s.device_type,
      new Date(s.started_at).toLocaleString(),
      s.completed_at ? new Date(s.completed_at).toLocaleString() : '',
      s.abandoned_at ? new Date(s.abandoned_at).toLocaleString() : '',
      s.last_question_reached.toString(),
      s.total_questions.toString(),
      s.score?.toString() || '',
      s.max_score?.toString() || '',
      s.severity_level || '',
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
  };
};
