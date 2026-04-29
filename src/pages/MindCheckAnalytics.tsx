import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { usePagePermissions } from '@/hooks/usePagePermissions';
import SensitiveAccessGate from '@/components/admin/SensitiveAccessGate';
import { useMindCheckAnalytics } from '@/hooks/useMindCheckAnalytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Who5AnalyticsTab from '@/components/Who5AnalyticsTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Eye, Brain, CheckCircle2, XCircle, TrendingUp, Mail, Download,
  BarChart3, PieChart as PieChartIcon, Activity, Users, Loader2, ArrowLeft,
  Clock, AlertTriangle, Repeat, Zap, Timer, Shield, Trash2, Send
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Tooltip, Legend, CartesianGrid, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, FunnelChart, Funnel, LabelList
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

const MindCheckAnalytics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { hasPageAccess, loading: permLoading } = usePagePermissions();
  const canView = isAdmin || hasPageAccess('mindcheck');
  const {
    stats, conditionDistribution, severityDistribution, sourceAnalytics,
    dailyTrends, dropOffData, emails, sessions,
    loading: dataLoading, dateRange, setDateRange, exportCSV, exportAllSessionsCSV,
    isRealtime,
    engagementFunnel, hourlyHeatmap, weekdayAnalytics,
    conditionSeverityMatrix, repeatUserStats, avgCompletionTime, highRiskConditions,
    generateBackupCSV, clearData,
  } = useMindCheckAnalytics();

  const [backupEmail, setBackupEmail] = useState('');
  const [sendingBackup, setSendingBackup] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleBackupToEmail = async () => {
    if (!backupEmail || !backupEmail.includes('@')) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    setSendingBackup(true);
    try {
      const csvContent = generateBackupCSV();
      
      // Always download the CSV first
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindcheck-backup-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Then try to send via edge function
      try {
        const { data, error } = await supabase.functions.invoke('send-backup-email', {
          body: {
            email: backupEmail,
            csvContent,
            totalSessions: sessions.length,
            totalEmails: emails.length,
          },
        });
        
        if (error) throw error;
        
        if (data?.method === 'email_sent') {
          toast({ title: 'Backup complete', description: `CSV downloaded and email queued to ${backupEmail}.` });
        } else {
          toast({ title: 'CSV downloaded', description: data?.message || 'Email sending is not yet available. CSV has been downloaded.' });
        }
      } catch (emailError) {
        console.warn('Email send failed, CSV still downloaded:', emailError);
        toast({ title: 'CSV downloaded', description: 'Backup CSV downloaded successfully. Email sending is not yet available (DNS pending).' });
      }
    } catch (error) {
      toast({ title: 'Backup failed', description: 'Could not generate backup.', variant: 'destructive' });
    } finally {
      setSendingBackup(false);
    }
  };

  const handleClearData = async () => {
    setClearing(true);
    try {
      await clearData([
        'assessment_sessions', 'assessment_emails', 'mindcheck_page_visits',
        'who5_sessions', 'who5_cta_clicks', 'callback_requests'
      ]);
      toast({ title: 'Data cleared', description: 'All analytics data has been reset successfully.' });
    } catch (error: any) {
      toast({ title: 'Clear failed', description: error.message || 'Could not clear data.', variant: 'destructive' });
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/mind-check/analytics');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !permLoading && !canView && user) navigate('/mind-check');
  }, [canView, roleLoading, permLoading, user, navigate]);

  if (authLoading || roleLoading || permLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !canView) return null;

  return (
    <SensitiveAccessGate pageKey="mindcheck" pageLabel="Mind Check Analytics">
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/mind-check')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Admin</Badge>
              {isRealtime && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 inline-block" />
                  Live
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground">Mind Check Analytics</h1>
            <p className="text-muted-foreground">Real-time engagement, mental health trends, and advanced behavioral insights</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange(range)}
              >
                {range === 'all' ? 'All Time' : range}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Backup & Clear */}
        <Card className="mb-6 border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              {/* Backup to Email */}
              <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                <Send className="h-4 w-4 text-primary flex-shrink-0" />
                <Input
                  type="email"
                  placeholder="Enter email for backup..."
                  value={backupEmail}
                  onChange={e => setBackupEmail(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleBackupToEmail} disabled={sendingBackup}>
                  {sendingBackup ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Download className="h-4 w-4 mr-1" />}
                  Backup & Email
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={exportCSV}>
                  <Download className="h-4 w-4 mr-1" /> Export Emails
                </Button>
                <Button size="sm" variant="outline" onClick={exportAllSessionsCSV}>
                  <Download className="h-4 w-4 mr-1" /> Export Sessions
                </Button>

                {/* Clear Data */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" disabled={clearing}>
                      {clearing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
                      Reset Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>⚠️ Clear All Analytics Data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>all</strong> Mind Check analytics data including:
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          <li>Assessment sessions & scores</li>
                          <li>Collected emails</li>
                          <li>Page visit logs</li>
                          <li>WHO-5 sessions & CTA clicks</li>
                          <li>Callback requests</li>
                        </ul>
                        <p className="mt-3 font-medium text-destructive">This action cannot be undone. Please download a backup first!</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Clear All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { label: 'Page Visits', value: stats.totalPageVisits, icon: Eye, color: 'text-blue-500' },
            { label: 'Tests Started', value: stats.testsStarted, icon: Brain, color: 'text-purple-500' },
            { label: 'Completed', value: stats.testsCompleted, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'Abandoned', value: stats.testsAbandoned, icon: XCircle, color: 'text-red-500' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'text-amber-500' },
            { label: 'Avg Score', value: `${stats.averageScore}%`, icon: Activity, color: 'text-cyan-500' },
            { label: 'Avg Time', value: `${avgCompletionTime}m`, icon: Timer, color: 'text-indigo-500' },
            { label: 'Emails', value: stats.emailsCollected, icon: Mail, color: 'text-pink-500' },
          ].map((metric) => (
            <Card key={metric.label} className="border-border/50">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <metric.icon className={`h-3.5 w-3.5 ${metric.color}`} />
                  <p className="text-[11px] text-muted-foreground truncate">{metric.label}</p>
                </div>
                <p className="text-xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="who5">WHO-5</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* WHO-5 Tab */}
          <TabsContent value="who5">
            <Who5AnalyticsTab />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Daily Activity
                  </CardTitle>
                  <CardDescription>Visits, starts, and completions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrends.slice(-14)}>
                        <defs>
                          <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="startGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="completeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                        <Legend />
                        <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="url(#visitGrad)" strokeWidth={2} name="Visits" />
                        <Area type="monotone" dataKey="starts" stroke="#8b5cf6" fill="url(#startGrad)" strokeWidth={2} name="Starts" />
                        <Area type="monotone" dataKey="completions" stroke="#22c55e" fill="url(#completeGrad)" strokeWidth={2} name="Completions" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" /> Severity Distribution
                  </CardTitle>
                  <CardDescription>Distribution of assessment severity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {severityDistribution.length > 0 ? (
                    <div className="flex items-center gap-6">
                      <div className="h-56 w-56 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={severityDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="count" nameKey="level">
                              {severityDistribution.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 flex-1">
                        {severityDistribution.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                              <span className="text-sm">{s.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{s.count}</Badge>
                              <span className="text-xs text-muted-foreground">{s.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 flex items-center justify-center text-muted-foreground">No data yet</div>
                  )}
                </CardContent>
              </Card>

              {/* Engagement Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" /> Engagement Funnel
                  </CardTitle>
                  <CardDescription>User journey from page visit to email submission</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {engagementFunnel.map((stage, i) => (
                      <div key={stage.stage}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{stage.stage}</span>
                          <span className="text-muted-foreground">{stage.count} ({stage.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                          <div
                            className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white transition-all duration-700"
                            style={{
                              width: `${Math.max(stage.percentage, 5)}%`,
                              backgroundColor: COLORS[i],
                            }}
                          >
                            {stage.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Repeat User Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5" /> User Engagement Depth
                  </CardTitle>
                  <CardDescription>Repeat usage and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{repeatUserStats.uniqueEmails}</p>
                      <p className="text-xs text-muted-foreground mt-1">Unique Users</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{repeatUserStats.repeatUsers}</p>
                      <p className="text-xs text-muted-foreground mt-1">Repeat Users</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{repeatUserStats.repeatRate}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Repeat Rate</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{repeatUserStats.avgTestsPerUser}</p>
                      <p className="text-xs text-muted-foreground mt-1">Avg Tests/User</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" /> Most Tested Conditions
                  </CardTitle>
                  <CardDescription>Mental health conditions by assessment volume</CardDescription>
                </CardHeader>
                <CardContent>
                  {conditionDistribution.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conditionDistribution.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis type="number" fontSize={12} />
                          <YAxis dataKey="condition" type="category" width={140} fontSize={11} />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">No data yet</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Condition Breakdown</CardTitle>
                  <CardDescription>Percentage distribution of completed assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  {conditionDistribution.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {conditionDistribution.map((c, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-sm flex-1">{c.condition}</span>
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${c.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{c.percentage}%</span>
                          <Badge variant="secondary" className="min-w-[2rem] justify-center">{c.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">No data yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Traffic Sources
                  </CardTitle>
                  <CardDescription>Where users are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  {sourceAnalytics.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sourceAnalytics}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="source" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="visits" fill="#3b82f6" name="Visits" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="starts" fill="#8b5cf6" name="Starts" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="completions" fill="#22c55e" name="Completions" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-muted-foreground">No data yet</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion by Source</CardTitle>
                  <CardDescription>Conversion rates per traffic source</CardDescription>
                </CardHeader>
                <CardContent>
                  {sourceAnalytics.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Visits</TableHead>
                          <TableHead>Starts</TableHead>
                          <TableHead>Completions</TableHead>
                          <TableHead>Conversion</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sourceAnalytics.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{s.source}</TableCell>
                            <TableCell>{s.visits}</TableCell>
                            <TableCell>{s.starts}</TableCell>
                            <TableCell>{s.completions}</TableCell>
                            <TableCell>
                              <Badge variant={s.conversionRate > 50 ? 'default' : 'secondary'}>
                                {s.conversionRate}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-muted-foreground">No data yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> Drop-off Analysis
                  </CardTitle>
                  <CardDescription>At which question users abandon the test</CardDescription>
                </CardHeader>
                <CardContent>
                  {dropOffData.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dropOffData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="question" label={{ value: 'Question #', position: 'insideBottom', offset: -5 }} fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#ef4444" name="Drop-offs" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-muted-foreground">No drop-off data yet</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Tests by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const deviceCounts: Record<string, number> = {};
                    sessions.forEach(s => { deviceCounts[s.device_type] = (deviceCounts[s.device_type] || 0) + 1; });
                    const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
                    return deviceData.length > 0 ? (
                      <div className="flex items-center gap-6">
                        <div className="h-48 w-48 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={70} paddingAngle={4} dataKey="value">
                                {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                          {deviceData.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="text-sm">{d.name}</span>
                              <Badge variant="secondary">{d.value}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">No data yet</div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Weekday Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Activity by Day of Week
                  </CardTitle>
                  <CardDescription>When users are most active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" tickFormatter={d => d.slice(0, 3)} fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visits" fill="#3b82f6" name="Visits" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="starts" fill="#8b5cf6" name="Starts" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completions" fill="#22c55e" name="Completions" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Hourly Activity Pattern
                  </CardTitle>
                  <CardDescription>Peak hours for assessments (24h)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyHeatmap}>
                        <defs>
                          <linearGradient id="hourVisitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="label" fontSize={10} interval={2} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="url(#hourVisitGrad)" strokeWidth={2} name="Visits" />
                        <Line type="monotone" dataKey="starts" stroke="#8b5cf6" strokeWidth={2} name="Starts" dot={false} />
                        <Line type="monotone" dataKey="completions" stroke="#22c55e" strokeWidth={2} name="Completions" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* High Risk Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" /> High-Risk Conditions
                  </CardTitle>
                  <CardDescription>Conditions with highest severe/moderately severe rates</CardDescription>
                </CardHeader>
                <CardContent>
                  {highRiskConditions.length > 0 ? (
                    <div className="space-y-4">
                      {highRiskConditions.map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{c.condition}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={c.severePercent >= 50 ? 'destructive' : 'secondary'}>
                                {c.severePercent}% high severity
                              </Badge>
                              <span className="text-xs text-muted-foreground">({c.total} tests)</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${c.severePercent}%`,
                                backgroundColor: c.severePercent >= 70 ? '#ef4444' : c.severePercent >= 40 ? '#f97316' : '#eab308',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">Insufficient data (need ≥2 tests per condition)</div>
                  )}
                </CardContent>
              </Card>

              {/* Condition-Severity Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Condition × Severity Matrix
                  </CardTitle>
                  <CardDescription>Cross-tabulation of conditions and severity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {conditionSeverityMatrix.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Condition</TableHead>
                            <TableHead className="text-xs text-center">Min</TableHead>
                            <TableHead className="text-xs text-center">Mild</TableHead>
                            <TableHead className="text-xs text-center">Mod</TableHead>
                            <TableHead className="text-xs text-center">M.Sev</TableHead>
                            <TableHead className="text-xs text-center">Sev</TableHead>
                            <TableHead className="text-xs text-center">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {conditionSeverityMatrix.slice(0, 10).map((c, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-xs font-medium max-w-[120px] truncate">{c.condition}</TableCell>
                              <TableCell className="text-center">
                                {c.minimal > 0 && <Badge className="bg-green-500/20 text-green-700 text-xs">{c.minimal}</Badge>}
                              </TableCell>
                              <TableCell className="text-center">
                                {c.mild > 0 && <Badge className="bg-lime-500/20 text-lime-700 text-xs">{c.mild}</Badge>}
                              </TableCell>
                              <TableCell className="text-center">
                                {c.moderate > 0 && <Badge className="bg-yellow-500/20 text-yellow-700 text-xs">{c.moderate}</Badge>}
                              </TableCell>
                              <TableCell className="text-center">
                                {c.moderatelySevere > 0 && <Badge className="bg-orange-500/20 text-orange-700 text-xs">{c.moderatelySevere}</Badge>}
                              </TableCell>
                              <TableCell className="text-center">
                                {c.severe > 0 && <Badge className="bg-red-500/20 text-red-700 text-xs">{c.severe}</Badge>}
                              </TableCell>
                              <TableCell className="text-center font-bold text-xs">{c.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">No completed assessments with severity data</div>
                  )}
                </CardContent>
              </Card>

              {/* Condition Distribution Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" /> Condition Radar
                  </CardTitle>
                  <CardDescription>Top conditions visualized as radar chart</CardDescription>
                </CardHeader>
                <CardContent>
                  {conditionDistribution.length >= 3 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={conditionDistribution.slice(0, 8)}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="condition" fontSize={10} />
                          <PolarRadiusAxis fontSize={10} />
                          <Radar name="Tests" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">Need ≥3 conditions for radar view</div>
                  )}
                </CardContent>
              </Card>

              {/* Key Insights Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Key Insights
                  </CardTitle>
                  <CardDescription>Auto-generated observations from data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.completionRate > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm">
                          <strong>Completion Rate:</strong> {stats.completionRate}% of users who start a test complete it.
                          {stats.completionRate < 50 ? ' Consider shortening assessments or improving UX.' : ' Great engagement!'}
                        </p>
                      </div>
                    )}
                    {conditionDistribution.length > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm">
                          <strong>Top Condition:</strong> {conditionDistribution[0].condition} is the most assessed condition
                          ({conditionDistribution[0].percentage}% of all completions).
                        </p>
                      </div>
                    )}
                    {avgCompletionTime > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm">
                          <strong>Avg Completion Time:</strong> Users take ~{avgCompletionTime} minutes to complete an assessment.
                        </p>
                      </div>
                    )}
                    {repeatUserStats.repeatRate > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-amber-500">
                        <p className="text-sm">
                          <strong>Repeat Users:</strong> {repeatUserStats.repeatRate}% of email-submitting users have taken multiple tests,
                          averaging {repeatUserStats.avgTestsPerUser} tests per user.
                        </p>
                      </div>
                    )}
                    {highRiskConditions.length > 0 && highRiskConditions[0].severePercent >= 40 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-red-500">
                        <p className="text-sm">
                          <strong>⚠ High Severity Alert:</strong> {highRiskConditions[0].condition} has {highRiskConditions[0].severePercent}%
                          of users scoring in severe/moderately severe range.
                        </p>
                      </div>
                    )}
                    {stats.totalPageVisits === 0 && stats.testsStarted === 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-muted-foreground">
                        <p className="text-sm text-muted-foreground">
                          No activity data yet for this period. Insights will appear as users interact with Mind Check.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" /> User Database
                    </CardTitle>
                    <CardDescription>{emails.length} users who opted to receive results</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportCSV} disabled={emails.length === 0}>
                      <Download className="h-4 w-4 mr-1" /> Export Emails CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportAllSessionsCSV} disabled={sessions.length === 0}>
                      <Download className="h-4 w-4 mr-1" /> Export Sessions CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {emails.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emails.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.email}</TableCell>
                            <TableCell>{e.test_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                            <TableCell>
                              <Badge variant={
                                e.severity_level === 'Severe' ? 'destructive' :
                                e.severity_level === 'Moderately Severe' ? 'destructive' :
                                e.severity_level === 'Moderate' ? 'default' : 'secondary'
                              }>
                                {e.severity_level || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell>{e.score ?? 'N/A'}</TableCell>
                            <TableCell>{e.source}</TableCell>
                            <TableCell>{e.device_type}</TableCell>
                            <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No email submissions yet. Users can opt-in to receive their results by email after completing an assessment.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
    </SensitiveAccessGate>
  );
};

export default MindCheckAnalytics;
