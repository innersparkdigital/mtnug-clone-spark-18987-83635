import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useMindCheckAnalytics } from '@/hooks/useMindCheckAnalytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, Brain, CheckCircle2, XCircle, TrendingUp, Mail, Download,
  BarChart3, PieChart as PieChartIcon, Activity, Users, Loader2, ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

const MindCheckAnalytics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const {
    stats, conditionDistribution, severityDistribution, sourceAnalytics,
    dailyTrends, dropOffData, emails, sessions,
    loading: dataLoading, dateRange, setDateRange, exportCSV, exportAllSessionsCSV,
  } = useMindCheckAnalytics();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/mind-check/analytics');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && user) navigate('/mind-check');
  }, [isAdmin, roleLoading, user, navigate]);

  if (authLoading || roleLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
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
            </div>
            <h1 className="text-3xl font-bold text-foreground">Mind Check Analytics</h1>
            <p className="text-muted-foreground">Track engagement, mental health trends, and user behavior</p>
          </div>
          <div className="flex gap-2">
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: 'Page Visits', value: stats.totalPageVisits, icon: Eye, color: 'blue' },
            { label: 'Tests Started', value: stats.testsStarted, icon: Brain, color: 'purple' },
            { label: 'Completed', value: stats.testsCompleted, icon: CheckCircle2, color: 'green' },
            { label: 'Abandoned', value: stats.testsAbandoned, icon: XCircle, color: 'red' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'amber' },
            { label: 'Avg Score', value: `${stats.averageScore}%`, icon: Activity, color: 'cyan' },
            { label: 'Emails', value: stats.emailsCollected, icon: Mail, color: 'pink' },
          ].map((metric) => (
            <Card key={metric.label} className={`bg-gradient-to-br from-${metric.color}-500/10 to-${metric.color}-600/5 border-${metric.color}-500/20`}>
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon className={`h-4 w-4 text-${metric.color}-500`} />
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

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
                      <LineChart data={dailyTrends.slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                        <Legend />
                        <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} name="Visits" />
                        <Line type="monotone" dataKey="starts" stroke="#8b5cf6" strokeWidth={2} name="Starts" />
                        <Line type="monotone" dataKey="completions" stroke="#22c55e" strokeWidth={2} name="Completions" />
                      </LineChart>
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
                    sessions.forEach(s => {
                      deviceCounts[s.device_type] = (deviceCounts[s.device_type] || 0) + 1;
                    });
                    const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
                    return deviceData.length > 0 ? (
                      <div className="flex items-center gap-6">
                        <div className="h-48 w-48 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={70} paddingAngle={4} dataKey="value">
                                {deviceData.map((_, i) => (
                                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
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
  );
};

export default MindCheckAnalytics;
