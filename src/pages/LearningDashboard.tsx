import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { allWorkplaceCourses, getWorkplaceCourseById, careerTracks } from '@/lib/workplaceCourseData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Award, 
  Users, 
  TrendingUp,
  Play,
  CheckCircle2,
  BarChart3,
  Loader2
} from 'lucide-react';

// Original student courses (from Learning page pattern)
const originalCourses = [
  {
    id: "workplace-mental-health-fundamentals",
    title: "Workplace Mental Health Fundamentals",
    description: "Essential knowledge for understanding mental health in African workplaces",
    level: "Beginner",
    track: "workplace-mental-health",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
    modules: [
      { id: "mod-1", title: "Module 1", lessons: [{ id: "l-1", title: "Lesson 1" }] },
      { id: "mod-2", title: "Module 2", lessons: [{ id: "l-1", title: "Lesson 1" }] }
    ]
  }
];

// Combine all courses for lookup
const allCourses = [...allWorkplaceCourses];

const LearningDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { enrollments, lessonProgress, loading: progressLoading, getCourseProgress } = useLearningProgress();
  const { users, stats, loading: adminLoading } = useAdminDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getCourseById = (courseId: string) => {
    const original = originalCourses.find(c => c.id === courseId);
    if (original) return original;
    return getWorkplaceCourseById(courseId);
  };

  const getTrackName = (trackId: string) => {
    const track = careerTracks.find(t => t.id === trackId);
    return track?.name || 'General';
  };

  // Calculate total lessons for a course
  const getTotalLessons = (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    return course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and achievements
          </p>
        </div>

        {isAdmin ? (
          <Tabs defaultValue="my-learning" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-learning">My Learning</TabsTrigger>
              <TabsTrigger value="admin">Admin Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="my-learning">
              <UserDashboard 
                enrollments={enrollments}
                lessonProgress={lessonProgress}
                loading={progressLoading}
                getCourseById={getCourseById}
                getCourseProgress={getCourseProgress}
                getTotalLessons={getTotalLessons}
                getTrackName={getTrackName}
              />
            </TabsContent>

            <TabsContent value="admin">
              <AdminDashboard 
                users={users}
                stats={stats}
                loading={adminLoading}
                getCourseById={getCourseById}
                getTotalLessons={getTotalLessons}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <UserDashboard 
            enrollments={enrollments}
            lessonProgress={lessonProgress}
            loading={progressLoading}
            getCourseById={getCourseById}
            getCourseProgress={getCourseProgress}
            getTotalLessons={getTotalLessons}
            getTrackName={getTrackName}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

// User Dashboard Component
interface UserDashboardProps {
  enrollments: any[];
  lessonProgress: any[];
  loading: boolean;
  getCourseById: (id: string) => any;
  getCourseProgress: (courseId: string, totalLessons: number) => number;
  getTotalLessons: (courseId: string) => number;
  getTrackName: (trackId: string) => string;
}

const UserDashboard = ({ 
  enrollments, 
  lessonProgress, 
  loading,
  getCourseById,
  getCourseProgress,
  getTotalLessons,
  getTrackName
}: UserDashboardProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.completed_at).length;
  const inProgressCourses = enrollments.filter(e => !e.completed_at).length;
  const completedLessons = lessonProgress.filter(p => p.completed).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrollments.length}</p>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCourses}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Enrolled Courses
          </CardTitle>
          <CardDescription>
            Continue where you left off
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses enrolled yet</h3>
              <p className="text-muted-foreground mb-4">
                Explore our learning hub and start your mental health education journey
              </p>
              <Button asChild>
                <Link to="/learning">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map(enrollment => {
                const course = getCourseById(enrollment.course_id);
                if (!course) return null;

                const totalLessons = getTotalLessons(enrollment.course_id);
                const progress = getCourseProgress(enrollment.course_id, totalLessons);
                const isCompleted = !!enrollment.completed_at;

                return (
                  <div 
                    key={enrollment.id}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-24 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                      <img 
                        src={typeof course.image === 'string' ? course.image : course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{course.title}</h4>
                        {isCompleted && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline">{course.level}</Badge>
                        <span>•</span>
                        <span>{getTrackName(course.track)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-12">{progress}%</span>
                      </div>
                    </div>

                    <Button asChild size="sm">
                      <Link to={`/learning/${course.id}`}>
                        {isCompleted ? (
                          <>
                            <Award className="h-4 w-4 mr-1" />
                            Certificate
                          </>
                        ) : progress > 0 ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates */}
      {completedCourses > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              My Certificates
            </CardTitle>
            <CardDescription>
              Download your earned certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.filter(e => e.completed_at).map(enrollment => {
                const course = getCourseById(enrollment.course_id);
                if (!course) return null;

                return (
                  <Card key={enrollment.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Award className="h-12 w-12 mx-auto text-primary mb-3" />
                        <h4 className="font-semibold mb-1">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Completed {new Date(enrollment.completed_at).toLocaleDateString()}
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/learning/${course.id}/certificate`}>
                            View Certificate
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Admin Dashboard Component
interface AdminDashboardProps {
  users: any[];
  stats: {
    totalUsers: number;
    totalEnrollments: number;
    totalCompletions: number;
    averageProgress: number;
  };
  loading: boolean;
  getCourseById: (id: string) => any;
  getTotalLessons: (courseId: string) => number;
}

const AdminDashboard = ({ users, stats, loading, getCourseById, getTotalLessons }: AdminDashboardProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Learners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCompletions}</p>
                <p className="text-sm text-muted-foreground">Completions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Learners Progress
          </CardTitle>
          <CardDescription>
            View detailed progress for all enrolled users
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
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Lessons Done</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => {
                  const completedCourses = u.enrollments.filter((e: any) => e.completed_at).length;
                  const completedLessons = u.lessonProgress.filter((p: any) => p.completed).length;

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
                        <Badge variant="secondary">{u.enrollments.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={completedCourses > 0 ? "default" : "outline"} className={completedCourses > 0 ? "bg-green-500" : ""}>
                          {completedCourses}
                        </Badge>
                      </TableCell>
                      <TableCell>{completedLessons}</TableCell>
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

      {/* Course Enrollment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Enrollment Breakdown
          </CardTitle>
          <CardDescription>
            See which courses are most popular
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            // Aggregate enrollments by course
            const courseEnrollments: Record<string, number> = {};
            const courseCompletions: Record<string, number> = {};
            
            users.forEach(u => {
              u.enrollments.forEach((e: any) => {
                courseEnrollments[e.course_id] = (courseEnrollments[e.course_id] || 0) + 1;
                if (e.completed_at) {
                  courseCompletions[e.course_id] = (courseCompletions[e.course_id] || 0) + 1;
                }
              });
            });

            const courseIds = Object.keys(courseEnrollments);
            
            if (courseIds.length === 0) {
              return (
                <div className="text-center py-8 text-muted-foreground">
                  No course enrollments yet
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {courseIds.map(courseId => {
                  const course = getCourseById(courseId);
                  if (!course) return null;

                  const enrolled = courseEnrollments[courseId];
                  const completed = courseCompletions[courseId] || 0;
                  const completionRate = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;

                  return (
                    <div key={courseId} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{course.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{enrolled} enrolled</span>
                          <span>{completed} completed</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={completionRate} className="h-2" />
                        <span className="text-sm font-medium w-10">{completionRate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningDashboard;
