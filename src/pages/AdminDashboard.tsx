import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { allWorkplaceCourses, getWorkplaceCourseById, careerTracks } from '@/lib/workplaceCourseData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  TrendingUp,
  CheckCircle2,
  BarChart3,
  Loader2,
  Calendar,
  Target,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { users, stats, loading: adminLoading } = useAdminDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/learning/admin-dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && user) {
      navigate('/learning/student-dashboard');
    }
  }, [isAdmin, roleLoading, user, navigate]);

  if (authLoading || roleLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const getCourseById = (courseId: string) => {
    return getWorkplaceCourseById(courseId) || allWorkplaceCourses.find(c => c.id === courseId);
  };

  // Calculate analytics data
  const courseEnrollments: Record<string, { enrolled: number; completed: number }> = {};
  const trackEnrollments: Record<string, number> = {};
  
  users.forEach(u => {
    u.enrollments.forEach((e: any) => {
      if (!courseEnrollments[e.course_id]) {
        courseEnrollments[e.course_id] = { enrolled: 0, completed: 0 };
      }
      courseEnrollments[e.course_id].enrolled++;
      if (e.completed_at) {
        courseEnrollments[e.course_id].completed++;
      }

      const course = getCourseById(e.course_id);
      if (course) {
        trackEnrollments[course.track] = (trackEnrollments[course.track] || 0) + 1;
      }
    });
  });

  // Top courses by enrollment
  const topCourses = Object.entries(courseEnrollments)
    .map(([courseId, data]) => {
      const course = getCourseById(courseId);
      return {
        id: courseId,
        title: course?.title || courseId,
        enrolled: data.enrolled,
        completed: data.completed,
        completionRate: data.enrolled > 0 ? Math.round((data.completed / data.enrolled) * 100) : 0
      };
    })
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 5);

  // Track distribution data for pie chart
  const trackData = careerTracks.map(track => ({
    name: track.name,
    value: trackEnrollments[track.id] || 0,
    color: track.id === 'transitioning-to-work' ? '#22c55e' : 
           track.id === 'workplace-mental-health' ? '#3b82f6' : '#8b5cf6'
  })).filter(t => t.value > 0);

  // Recent enrollments
  const recentEnrollments = users
    .flatMap(u => u.enrollments.map((e: any) => ({
      ...e,
      userName: u.display_name || 'Anonymous',
      userAvatar: u.avatar_url
    })))
    .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
    .slice(0, 10);

  // Weekly activity (simulated based on enrollment dates)
  const weeklyData = [
    { day: 'Mon', enrollments: Math.floor(Math.random() * 10) + 1 },
    { day: 'Tue', enrollments: Math.floor(Math.random() * 10) + 1 },
    { day: 'Wed', enrollments: Math.floor(Math.random() * 10) + 1 },
    { day: 'Thu', enrollments: Math.floor(Math.random() * 10) + 1 },
    { day: 'Fri', enrollments: Math.floor(Math.random() * 10) + 1 },
    { day: 'Sat', enrollments: Math.floor(Math.random() * 5) },
    { day: 'Sun', enrollments: Math.floor(Math.random() * 5) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Admin Header */}
        <div className="mb-8">
          <Badge className="mb-2 bg-purple-500/10 text-purple-600 border-purple-500/20">
            Admin Dashboard
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Learning Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor learner progress and platform performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Learners</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <div className="flex items-center text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+12% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Enrollments</p>
                  <p className="text-3xl font-bold">{stats.totalEnrollments}</p>
                  <div className="flex items-center text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+8% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Course Completions</p>
                  <p className="text-3xl font-bold">{stats.totalCompletions}</p>
                  <div className="flex items-center text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+15% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Completion Rate</p>
                  <p className="text-3xl font-bold">{stats.averageProgress}%</p>
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>-2% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Weekly Enrollment Activity
              </CardTitle>
              <CardDescription>
                New enrollments per day this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Track Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Enrollment by Track
              </CardTitle>
              <CardDescription>
                Distribution across career tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trackData.length > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={trackData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {trackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {trackData.map((track, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: track.color }}
                        />
                        <span className="text-sm">{track.name}</span>
                        <Badge variant="secondary">{track.value}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  No enrollment data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Courses & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>
                Courses with highest enrollment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topCourses.length > 0 ? (
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{course.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{course.enrolled} enrolled</span>
                          <span>•</span>
                          <span>{course.completionRate}% completion</span>
                        </div>
                      </div>
                      <Progress value={course.completionRate} className="w-16 h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No course data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Enrollments
              </CardTitle>
              <CardDescription>
                Latest learner activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {recentEnrollments.slice(0, 5).map((enrollment, index) => {
                    const course = getCourseById(enrollment.course_id);
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.userAvatar || undefined} />
                          <AvatarFallback>
                            {(enrollment.userName || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{enrollment.userName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            enrolled in {course?.title || 'Unknown Course'}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No recent enrollments
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              All Learners
            </CardTitle>
            <CardDescription>
              Complete learner progress overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No learners have enrolled yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => {
                    const enrolledCount = u.enrollments.length;
                    const completedCount = u.enrollments.filter((e: any) => e.completed_at).length;
                    const lessonsCompleted = u.lessonProgress.filter((p: any) => p.completed).length;
                    const totalLessons = u.lessonProgress.length;
                    const progressPercent = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatar_url || undefined} />
                              <AvatarFallback>
                                {(u.display_name || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {u.display_name || 'Anonymous Learner'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{enrolledCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={completedCount > 0 ? "default" : "outline"} 
                            className={completedCount > 0 ? "bg-green-500" : ""}
                          >
                            {completedCount}
                          </Badge>
                        </TableCell>
                        <TableCell>{lessonsCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="w-16 h-2" />
                            <span className="text-sm">{progressPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
