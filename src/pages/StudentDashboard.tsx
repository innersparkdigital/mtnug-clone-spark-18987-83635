import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { allWorkplaceCourses, getWorkplaceCourseById, careerTracks } from '@/lib/workplaceCourseData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Award, 
  Play,
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react';

// Original student courses (same as Learning page)
const studentCourses = [
  {
    id: "digital-mental-health",
    title: "Digital Mental Health & Wellness",
    description: "A comprehensive course covering digital wellbeing, online safety, and mental health fundamentals for the digital age.",
    duration: "6-8 weeks",
    level: "Beginner",
    format: "Online",
    track: "student",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    modules: [
      { id: "mod-1", title: "Introduction to Digital Wellness", lessons: [
        { id: "lesson-1", title: "Understanding Digital Health" },
        { id: "lesson-2", title: "Screen Time Management" }
      ]},
      { id: "mod-2", title: "Online Safety", lessons: [
        { id: "lesson-1", title: "Privacy Basics" },
        { id: "lesson-2", title: "Cyberbullying Prevention" }
      ]}
    ]
  },
  {
    id: "stress-academic-pressure",
    title: "Managing Stress & Academic Pressure in the Digital Age",
    description: "Learn practical strategies to cope with academic stress, digital overload, and build resilience for success.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Online",
    track: "student",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    modules: [
      { id: "mod-1", title: "Understanding Stress", lessons: [
        { id: "lesson-1", title: "What is Stress?" },
        { id: "lesson-2", title: "Stress Triggers" }
      ]},
      { id: "mod-2", title: "Coping Strategies", lessons: [
        { id: "lesson-1", title: "Relaxation Techniques" },
        { id: "lesson-2", title: "Time Management" }
      ]}
    ]
  },
  {
    id: "wellness-ambassador",
    title: "Digital Wellness Ambassador Program",
    description: "Become a certified ambassador to lead wellness initiatives in your school, university, or community.",
    duration: "8 weeks",
    level: "Advanced",
    format: "Hybrid",
    track: "student",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    modules: [
      { id: "mod-1", title: "Ambassador Foundations", lessons: [
        { id: "lesson-1", title: "Role of a Wellness Ambassador" },
        { id: "lesson-2", title: "Communication Skills" }
      ]},
      { id: "mod-2", title: "Leading Initiatives", lessons: [
        { id: "lesson-1", title: "Planning Events" },
        { id: "lesson-2", title: "Peer Support" }
      ]}
    ]
  }
];

// All courses combined
const allCourses = [...studentCourses, ...allWorkplaceCourses];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { enrollments, lessonProgress, loading: progressLoading, getCourseProgress } = useLearningProgress();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/learning/student-dashboard');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || progressLoading) {
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
    // Check student courses first, then workplace courses
    const studentCourse = studentCourses.find(c => c.id === courseId);
    if (studentCourse) return studentCourse;
    return getWorkplaceCourseById(courseId) || allWorkplaceCourses.find(c => c.id === courseId);
  };

  const getTrackName = (trackId: string) => {
    if (trackId === 'student') return 'Student Wellness';
    const track = careerTracks.find(t => t.id === trackId);
    return track?.name || 'General';
  };

  const getTotalLessons = (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    return course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  };

  const completedCourses = enrollments.filter(e => e.completed_at).length;
  const inProgressCourses = enrollments.filter(e => !e.completed_at).length;
  const completedLessons = lessonProgress.filter(p => p.completed).length;

  // Get next lesson to resume for each course
  const getResumeLesson = (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) return null;

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const progress = lessonProgress.find(
          p => p.course_id === courseId && p.module_id === module.id && p.lesson_id === lesson.id
        );
        if (!progress || !progress.completed) {
          return { moduleId: module.id, lessonId: lesson.id, lessonTitle: lesson.title };
        }
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.display_name || 'Learner'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your mental health learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressCourses}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCourses}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
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

        {/* Continue Learning Section */}
        {inProgressCourses > 0 && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.filter(e => !e.completed_at).slice(0, 3).map(enrollment => {
                  const course = getCourseById(enrollment.course_id);
                  if (!course) return null;

                  const totalLessons = getTotalLessons(enrollment.course_id);
                  const progress = getCourseProgress(enrollment.course_id, totalLessons);
                  const resumeLesson = getResumeLesson(enrollment.course_id);

                  return (
                    <div 
                      key={enrollment.id}
                      className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-background border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-muted shrink-0">
                        <img 
                          src={typeof course.image === 'string' ? course.image : course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate mb-1">{course.title}</h4>
                        {resumeLesson && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Next: {resumeLesson.lessonTitle}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-2 flex-1 max-w-xs" />
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </div>

                      <Button asChild className="gap-2">
                        {resumeLesson ? (
                          <Link to={`/learning/${course.id}/module/${resumeLesson.moduleId}/lesson/${resumeLesson.lessonId}`}>
                            Resume <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <Link to={`/learning/${course.id}`}>
                            Continue <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Enrolled Courses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              All your enrolled courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start your mental health education journey by enrolling in one of our courses
                </p>
                <Button asChild size="lg">
                  <Link to="/learning">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map(enrollment => {
                  const course = getCourseById(enrollment.course_id);
                  if (!course) return null;

                  const totalLessons = getTotalLessons(enrollment.course_id);
                  const progress = getCourseProgress(enrollment.course_id, totalLessons);
                  const isCompleted = !!enrollment.completed_at;

                  return (
                    <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={typeof course.image === 'string' ? course.image : course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{course.level}</Badge>
                          {isCompleted && (
                            <Badge className="bg-green-500 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold mb-2 line-clamp-2">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{getTrackName(course.track)}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>

                        <Button asChild className="w-full" variant={isCompleted ? "outline" : "default"}>
                          <Link to={isCompleted ? `/learning/${course.id}/certificate` : `/learning/${course.id}`}>
                            {isCompleted ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                View Certificate
                              </>
                            ) : progress > 0 ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start Learning
                              </>
                            )}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificates Section */}
        {completedCourses > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
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
                      <CardContent className="pt-6 text-center">
                        <Award className="h-12 w-12 mx-auto text-primary mb-3" />
                        <h4 className="font-semibold mb-1 line-clamp-2">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Completed {new Date(enrollment.completed_at!).toLocaleDateString()}
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/learning/${course.id}/certificate`}>
                            View Certificate
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
