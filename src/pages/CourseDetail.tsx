import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import {
  BookOpen,
  Clock,
  Award,
  Users,
  GraduationCap,
  Play,
  CheckCircle2,
  FileText,
  Video,
  Headphones,
  Download,
  ChevronLeft,
  Target,
  Lightbulb,
  BarChart3,
  Lock,
  LogIn,
  Loader2
} from "lucide-react";

// Course data (same as Learning page, in production would come from API/database)
const coursesData: Record<string, {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  level: string;
  format: string;
  category: string;
  modules: {
    id: string;
    title: string;
    lessons: { id: string; title: string; duration: string; type: string; completed: boolean }[];
    completed: boolean;
  }[];
  enrolled: number;
  image: string;
  progress: number;
  learningOutcomes: string[];
  prerequisites: string[];
  instructor: { name: string; title: string; image: string };
  certificateInfo: string;
}> = {
  "digital-mental-health": {
    id: "digital-mental-health",
    title: "Digital Mental Health & Wellness",
    description: "A comprehensive course covering digital wellbeing, online safety, and mental health fundamentals for the digital age.",
    longDescription: "This course is designed to equip university and senior secondary students with the knowledge and skills to maintain mental wellness in an increasingly digital world. You'll learn about the psychological effects of technology use, strategies for healthy digital habits, and how to support your mental health while navigating social media, online learning, and digital communication.",
    duration: "6-8 weeks",
    level: "Beginner",
    format: "Online",
    category: "Digital Mental Health",
    enrolled: 1250,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Understand the fundamentals of digital mental health",
      "Identify signs of digital burnout and screen addiction",
      "Develop healthy social media and screen-time habits",
      "Apply stress management techniques for academic success",
      "Build emotional intelligence and self-care routines",
      "Know when and how to seek professional mental health support",
      "Create a personal digital wellness plan"
    ],
    prerequisites: [
      "No prior experience required",
      "Access to a computer or smartphone",
      "Willingness to engage in self-reflection exercises"
    ],
    instructor: {
      name: "Dr. Sarah Namuli",
      title: "Mental Health Specialist",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
    },
    certificateInfo: "Upon successful completion of all modules and the final assessment, you will receive a Certificate of Completion in Digital Mental Health & Wellness, verified by Innerspark Africa.",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Digital Mental Health",
        completed: false,
        lessons: [
          { id: "1-1", title: "What is Digital Mental Health?", duration: "15 min", type: "video", completed: false },
          { id: "1-2", title: "The Digital Age & Your Mind", duration: "20 min", type: "slides", completed: false },
          { id: "1-3", title: "Self-Assessment: Your Digital Habits", duration: "10 min", type: "activity", completed: false },
          { id: "1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-2",
        title: "Digital Overload & Burnout",
        completed: false,
        lessons: [
          { id: "2-1", title: "Understanding Information Overload", duration: "20 min", type: "video", completed: false },
          { id: "2-2", title: "Signs of Digital Burnout", duration: "15 min", type: "slides", completed: false },
          { id: "2-3", title: "Real Student Stories: Burnout Recovery", duration: "25 min", type: "video", completed: false },
          { id: "2-4", title: "Reflection: Your Burnout Risk", duration: "15 min", type: "activity", completed: false },
          { id: "2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-3",
        title: "Social Media & Emotional Wellbeing",
        completed: false,
        lessons: [
          { id: "3-1", title: "How Social Media Affects Your Brain", duration: "20 min", type: "video", completed: false },
          { id: "3-2", title: "Comparison Culture & Self-Esteem", duration: "20 min", type: "slides", completed: false },
          { id: "3-3", title: "Building a Healthier Feed", duration: "15 min", type: "activity", completed: false },
          { id: "3-4", title: "Digital Detox Strategies", duration: "20 min", type: "slides", completed: false },
          { id: "3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-4",
        title: "Stress, Anxiety & Academic Pressure",
        completed: false,
        lessons: [
          { id: "4-1", title: "Understanding Stress & Anxiety", duration: "20 min", type: "video", completed: false },
          { id: "4-2", title: "Academic Pressure in the Digital Age", duration: "15 min", type: "slides", completed: false },
          { id: "4-3", title: "Coping Strategies That Work", duration: "25 min", type: "video", completed: false },
          { id: "4-4", title: "Guided Relaxation Exercise", duration: "15 min", type: "audio", completed: false },
          { id: "4-5", title: "Module 4 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-5",
        title: "Healthy Screen-Time & Digital Habits",
        completed: false,
        lessons: [
          { id: "5-1", title: "Setting Boundaries with Technology", duration: "20 min", type: "video", completed: false },
          { id: "5-2", title: "Sleep & Screen Time", duration: "15 min", type: "slides", completed: false },
          { id: "5-3", title: "Mindful Technology Use", duration: "20 min", type: "slides", completed: false },
          { id: "5-4", title: "Creating Your Screen-Time Plan", duration: "20 min", type: "activity", completed: false },
          { id: "5-5", title: "Module 5 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-6",
        title: "Emotional Intelligence & Self-Care",
        completed: false,
        lessons: [
          { id: "6-1", title: "What is Emotional Intelligence?", duration: "20 min", type: "video", completed: false },
          { id: "6-2", title: "Self-Awareness & Self-Regulation", duration: "20 min", type: "slides", completed: false },
          { id: "6-3", title: "Building a Self-Care Routine", duration: "25 min", type: "video", completed: false },
          { id: "6-4", title: "Mindfulness Exercise", duration: "15 min", type: "audio", completed: false },
          { id: "6-5", title: "Module 6 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-7",
        title: "Seeking Help & Supporting Others",
        completed: false,
        lessons: [
          { id: "7-1", title: "Recognizing When You Need Help", duration: "15 min", type: "video", completed: false },
          { id: "7-2", title: "Mental Health Resources in Africa", duration: "20 min", type: "slides", completed: false },
          { id: "7-3", title: "How to Support a Friend", duration: "20 min", type: "video", completed: false },
          { id: "7-4", title: "Starting the Conversation", duration: "15 min", type: "activity", completed: false },
          { id: "7-5", title: "Module 7 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-8",
        title: "Final Reflection & Personal Wellness Plan",
        completed: false,
        lessons: [
          { id: "8-1", title: "Course Review & Key Takeaways", duration: "20 min", type: "video", completed: false },
          { id: "8-2", title: "Creating Your Wellness Plan", duration: "30 min", type: "activity", completed: false },
          { id: "8-3", title: "Final Assessment", duration: "30 min", type: "quiz", completed: false },
          { id: "8-4", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  "stress-academic-pressure": {
    id: "stress-academic-pressure",
    title: "Managing Stress & Academic Pressure in the Digital Age",
    description: "Learn practical strategies to cope with academic stress, digital overload, and build resilience for success.",
    longDescription: "This intermediate course focuses specifically on the unique challenges students face balancing academic demands with digital life. You'll learn evidence-based techniques for managing stress, building resilience, and maintaining focus in a world full of digital distractions.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Online",
    category: "Stress & Anxiety Management",
    enrolled: 890,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Identify personal stress triggers and patterns",
      "Apply cognitive-behavioral techniques for stress management",
      "Develop effective study habits that reduce anxiety",
      "Build resilience to academic setbacks",
      "Create sustainable work-life-digital balance",
      "Use mindfulness techniques for focus and calm"
    ],
    prerequisites: [
      "Basic understanding of mental health concepts (or completion of Digital Mental Health course)",
      "Currently enrolled in academic program"
    ],
    instructor: {
      name: "James Okello",
      title: "Counseling Psychologist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    certificateInfo: "Earn a Certificate in Stress Management & Academic Resilience upon completing all modules and assessments.",
    modules: [
      {
        id: "module-1",
        title: "Understanding Stress & Its Impact",
        completed: false,
        lessons: [
          { id: "1-1", title: "The Science of Stress", duration: "20 min", type: "video", completed: false },
          { id: "1-2", title: "Stress in the Student Life Cycle", duration: "15 min", type: "slides", completed: false },
          { id: "1-3", title: "Your Stress Profile Assessment", duration: "20 min", type: "activity", completed: false },
          { id: "1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-2",
        title: "Cognitive Strategies for Stress",
        completed: false,
        lessons: [
          { id: "2-1", title: "Changing Your Stress Mindset", duration: "20 min", type: "video", completed: false },
          { id: "2-2", title: "Cognitive Restructuring Techniques", duration: "25 min", type: "slides", completed: false },
          { id: "2-3", title: "Practical Exercise: Thought Journaling", duration: "20 min", type: "activity", completed: false },
          { id: "2-4", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-3",
        title: "Building Academic Resilience",
        completed: false,
        lessons: [
          { id: "3-1", title: "What is Resilience?", duration: "15 min", type: "video", completed: false },
          { id: "3-2", title: "Growth Mindset & Learning from Failure", duration: "20 min", type: "slides", completed: false },
          { id: "3-3", title: "Student Success Stories", duration: "20 min", type: "video", completed: false },
          { id: "3-4", title: "Your Resilience Action Plan", duration: "25 min", type: "activity", completed: false },
          { id: "3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-4",
        title: "Mindfulness & Balance",
        completed: false,
        lessons: [
          { id: "4-1", title: "Introduction to Mindfulness", duration: "15 min", type: "video", completed: false },
          { id: "4-2", title: "Guided Meditation for Students", duration: "20 min", type: "audio", completed: false },
          { id: "4-3", title: "Creating Work-Life-Digital Balance", duration: "20 min", type: "slides", completed: false },
          { id: "4-4", title: "Your Personal Balance Plan", duration: "25 min", type: "activity", completed: false },
          { id: "4-5", title: "Final Assessment", duration: "30 min", type: "quiz", completed: false },
          { id: "4-6", title: "Get Your Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  },
  "wellness-ambassador": {
    id: "wellness-ambassador",
    title: "Digital Wellness Ambassador Program",
    description: "Become a certified ambassador to lead wellness initiatives in your school, university, or community.",
    longDescription: "This advanced program prepares you to become a Digital Wellness Ambassador, capable of leading mental health and wellness initiatives in your institution. You'll learn facilitation skills, program design, and how to create sustainable wellness programs that make a real impact.",
    duration: "8 weeks",
    level: "Advanced",
    format: "Hybrid",
    category: "Ambassador Programs",
    enrolled: 320,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    progress: 0,
    learningOutcomes: [
      "Facilitate wellness workshops and peer support sessions",
      "Design mental health awareness campaigns",
      "Build and lead a wellness club or initiative",
      "Provide basic peer support and referral skills",
      "Advocate for mental health policy changes",
      "Measure and report on wellness program impact"
    ],
    prerequisites: [
      "Completion of at least one Innerspark course",
      "Commitment to 8-week program with practical projects",
      "Letter of support from institution (recommended)"
    ],
    instructor: {
      name: "Grace Tumusiime",
      title: "Wellness Program Director",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop"
    },
    certificateInfo: "Graduate as a Certified Digital Wellness Ambassador with credentials recognized across East Africa.",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Wellness Leadership",
        completed: false,
        lessons: [
          { id: "1-1", title: "What is a Wellness Ambassador?", duration: "20 min", type: "video", completed: false },
          { id: "1-2", title: "Leadership Styles & Self-Assessment", duration: "25 min", type: "slides", completed: false },
          { id: "1-3", title: "Your Leadership Vision", duration: "20 min", type: "activity", completed: false },
          { id: "1-4", title: "Module 1 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-2",
        title: "Facilitation Skills",
        completed: false,
        lessons: [
          { id: "2-1", title: "Group Facilitation Fundamentals", duration: "25 min", type: "video", completed: false },
          { id: "2-2", title: "Creating Safe Spaces for Discussion", duration: "20 min", type: "slides", completed: false },
          { id: "2-3", title: "Handling Difficult Conversations", duration: "25 min", type: "video", completed: false },
          { id: "2-4", title: "Practice Session: Peer Facilitation", duration: "45 min", type: "activity", completed: false },
          { id: "2-5", title: "Module 2 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-3",
        title: "Program Design & Implementation",
        completed: false,
        lessons: [
          { id: "3-1", title: "Designing Wellness Programs", duration: "25 min", type: "video", completed: false },
          { id: "3-2", title: "Needs Assessment & Planning", duration: "20 min", type: "slides", completed: false },
          { id: "3-3", title: "Budget & Resource Management", duration: "20 min", type: "slides", completed: false },
          { id: "3-4", title: "Project: Design Your Initiative", duration: "60 min", type: "activity", completed: false },
          { id: "3-5", title: "Module 3 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-4",
        title: "Peer Support & Referrals",
        completed: false,
        lessons: [
          { id: "4-1", title: "Basics of Peer Support", duration: "20 min", type: "video", completed: false },
          { id: "4-2", title: "Active Listening Skills", duration: "25 min", type: "slides", completed: false },
          { id: "4-3", title: "When & How to Refer", duration: "20 min", type: "video", completed: false },
          { id: "4-4", title: "Role Play: Support Scenarios", duration: "40 min", type: "activity", completed: false },
          { id: "4-5", title: "Module 4 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-5",
        title: "Campaign & Advocacy",
        completed: false,
        lessons: [
          { id: "5-1", title: "Mental Health Awareness Campaigns", duration: "25 min", type: "video", completed: false },
          { id: "5-2", title: "Social Media for Good", duration: "20 min", type: "slides", completed: false },
          { id: "5-3", title: "Advocating for Policy Change", duration: "25 min", type: "video", completed: false },
          { id: "5-4", title: "Campaign Planning Workshop", duration: "45 min", type: "activity", completed: false },
          { id: "5-5", title: "Module 5 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-6",
        title: "Measuring Impact",
        completed: false,
        lessons: [
          { id: "6-1", title: "Why Measurement Matters", duration: "15 min", type: "video", completed: false },
          { id: "6-2", title: "Data Collection Methods", duration: "20 min", type: "slides", completed: false },
          { id: "6-3", title: "Reporting & Storytelling", duration: "20 min", type: "video", completed: false },
          { id: "6-4", title: "Create Your Impact Report", duration: "30 min", type: "activity", completed: false },
          { id: "6-5", title: "Module 6 Quiz", duration: "10 min", type: "quiz", completed: false }
        ]
      },
      {
        id: "module-7",
        title: "Practical Project",
        completed: false,
        lessons: [
          { id: "7-1", title: "Project Guidelines & Requirements", duration: "20 min", type: "slides", completed: false },
          { id: "7-2", title: "Mentor Check-in 1", duration: "30 min", type: "activity", completed: false },
          { id: "7-3", title: "Mentor Check-in 2", duration: "30 min", type: "activity", completed: false },
          { id: "7-4", title: "Project Submission", duration: "15 min", type: "activity", completed: false }
        ]
      },
      {
        id: "module-8",
        title: "Graduation & Certification",
        completed: false,
        lessons: [
          { id: "8-1", title: "Final Presentation Prep", duration: "30 min", type: "activity", completed: false },
          { id: "8-2", title: "Ambassador Commitment & Ethics", duration: "20 min", type: "slides", completed: false },
          { id: "8-3", title: "Final Assessment", duration: "45 min", type: "quiz", completed: false },
          { id: "8-4", title: "Digital Wellness Ambassador Certificate", duration: "5 min", type: "certificate", completed: false }
        ]
      }
    ]
  }
};

// Default fallback course
const defaultCourse = coursesData["digital-mental-health"];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-wellness/10 text-green-700 border-green-wellness/30";
    case "Intermediate":
      return "bg-primary/10 text-primary border-primary/30";
    case "Advanced":
      return "bg-purple-deep/10 text-purple-700 border-purple-deep/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return Video;
    case "slides":
      return FileText;
    case "audio":
      return Headphones;
    case "activity":
      return Target;
    case "quiz":
      return Lightbulb;
    case "certificate":
      return Award;
    default:
      return FileText;
  }
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isEnrolled, 
    enrollInCourse, 
    getCourseProgress, 
    getModuleProgress,
    lessonProgress,
    loading: progressLoading 
  } = useLearningProgress(courseId);
  
  const course = courseId && coursesData[courseId] ? coursesData[courseId] : defaultCourse;

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  
  // Calculate progress from database
  const completedLessons = lessonProgress.filter(p => p.completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const enrolled = courseId ? isEnrolled(courseId) : false;

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (courseId) {
      await enrollInCourse(courseId);
    }
  };

  // Check if a specific lesson is completed
  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return lessonProgress.some(
      p => p.module_id === moduleId && p.lesson_id === lessonId && p.completed
    );
  };

  // Check if a module is completed
  const isModuleCompleted = (moduleId: string, lessonCount: number) => {
    const completed = getModuleProgress(moduleId);
    return completed >= lessonCount;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{course.title} | Innerspark Africa Learning</title>
        <meta name="description" content={course.description} />
        <meta name="keywords" content={`${course.category}, mental health course, student wellness, ${course.level} course, Innerspark Africa`} />
        <link rel="canonical" href={`https://innersparkafrica.org/learning/${course.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.longDescription,
            "provider": {
              "@type": "Organization",
              "name": "Innerspark Africa"
            },
            "educationalLevel": course.level,
            "courseMode": course.format,
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "duration": course.duration
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/learning" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ScrollReveal direction="up">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  <Badge variant="outline">{course.format}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {course.longDescription}
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {course.modules.length} Modules
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {course.enrolled.toLocaleString()} enrolled
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="right" delay={0.2}>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-xl">Start Learning Today</CardTitle>
                    <CardDescription>Free access to all course materials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user && enrolled && progressPercent > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your Progress</span>
                          <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground">{completedLessons} of {totalLessons} lessons completed</p>
                      </div>
                    )}
                    
                    {!user ? (
                      <Link to="/auth">
                        <Button className="w-full gap-2" size="lg">
                          <LogIn className="w-5 h-5" />
                          Sign In to Enroll
                        </Button>
                      </Link>
                    ) : enrolled ? (
                      <Link to={`/learning/${course.id}/module/module-1/lesson/1-1`}>
                        <Button className="w-full gap-2" size="lg">
                          <Play className="w-5 h-5" />
                          {progressPercent > 0 ? "Continue Learning" : "Start Course"}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                        onClick={handleEnroll}
                        disabled={progressLoading}
                      >
                        {progressLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                        Enroll Now - Free
                      </Button>
                    )}
                    
                    {!user && (
                      <p className="text-xs text-center text-muted-foreground">
                        Create a free account to track your progress
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <img 
                        src={course.instructor.image} 
                        alt={course.instructor.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{course.instructor.name}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              <ScrollReveal direction="up">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-wellness flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Course Modules */}
              <ScrollReveal direction="up" delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Course Content
                    </CardTitle>
                    <CardDescription>
                      {course.modules.length} modules • {totalLessons} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules.map((module, moduleIndex) => {
                        const moduleCompleted = isModuleCompleted(module.id, module.lessons.length);
                        return (
                        <AccordionItem key={module.id} value={module.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                moduleCompleted 
                                  ? "bg-green-wellness/10 text-green-wellness" 
                                  : "bg-primary/10 text-primary"
                              }`}>
                                {moduleCompleted ? <CheckCircle2 className="w-4 h-4" /> : moduleIndex + 1}
                              </div>
                              <div>
                                <p className="font-medium">{module.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {getModuleProgress(module.id)}/{module.lessons.length} lessons completed
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pt-2">
                              {module.lessons.map((lesson) => {
                                const LessonIcon = getLessonIcon(lesson.type);
                                const completed = isLessonCompleted(module.id, lesson.id);
                                return (
                                  <li key={lesson.id}>
                                    <Link 
                                      to={`/learning/${course.id}/module/${module.id}/lesson/${lesson.id}`}
                                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                                    >
                                      <LessonIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                      <span className="flex-1 text-sm">{lesson.title}</span>
                                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                      {completed ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-wellness" />
                                      ) : (
                                        <Play className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prerequisites */}
              <ScrollReveal direction="right" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Certificate */}
              <ScrollReveal direction="right" delay={0.3}>
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Certificate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{course.certificateInfo}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Resources */}
              <ScrollReveal direction="right" delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="w-5 h-5 text-primary" />
                      Course Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        { icon: FileText, label: "PDF Slides & Notes", locked: true },
                        { icon: Video, label: "Video Lessons", locked: false },
                        { icon: Headphones, label: "Audio Exercises", locked: true },
                        { icon: BarChart3, label: "Self-Assessments", locked: false }
                      ].map((resource, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <resource.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1">{resource.label}</span>
                          {resource.locked ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-wellness" />
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4">
                      Full resources unlock as you progress through the course.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;