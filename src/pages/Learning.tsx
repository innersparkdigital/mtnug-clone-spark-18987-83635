import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Users, 
  GraduationCap, 
  Brain, 
  Heart, 
  Sparkles,
  Building2,
  Filter,
  Play,
  CheckCircle2,
  Briefcase,
  UserCog
} from "lucide-react";
import { useState } from "react";
import { 
  careerTracks, 
  transitioningToWorkCourses, 
  workplaceMentalHealthCourses, 
  leadershipHRCourses,
  allWorkplaceCourses,
  type CareerTrack 
} from "@/lib/workplaceCourseData";

// Original student-focused courses (keeping existing)
const studentCourses = [
  {
    id: "digital-mental-health",
    title: "Digital Mental Health & Wellness",
    description: "A comprehensive course covering digital wellbeing, online safety, and mental health fundamentals for the digital age.",
    duration: "6-8 weeks",
    level: "Beginner",
    format: "Online",
    category: "Student Wellness",
    modules: 8,
    enrolled: 1250,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    progress: 0,
    featured: true
  },
  {
    id: "stress-academic-pressure",
    title: "Managing Stress & Academic Pressure in the Digital Age",
    description: "Learn practical strategies to cope with academic stress, digital overload, and build resilience for success.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Online",
    category: "Student Wellness",
    modules: 6,
    enrolled: 890,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    progress: 0,
    featured: true
  },
  {
    id: "wellness-ambassador",
    title: "Digital Wellness Ambassador Program",
    description: "Become a certified ambassador to lead wellness initiatives in your school, university, or community.",
    duration: "8 weeks",
    level: "Advanced",
    format: "Hybrid",
    category: "Ambassador Programs",
    modules: 10,
    enrolled: 320,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    progress: 0,
    featured: true
  }
];

const stats = [
  { label: "Active Learners", value: "12,000+", icon: Users },
  { label: "Courses Available", value: "18", icon: BookOpen },
  { label: "Certificates Issued", value: "5,500+", icon: Award },
  { label: "Partner Organizations", value: "45+", icon: Building2 }
];

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

const getTrackIcon = (iconName: string) => {
  switch (iconName) {
    case "GraduationCap": return GraduationCap;
    case "Building2": return Building2;
    case "Users": return UserCog;
    default: return BookOpen;
  }
};

const Learning = () => {
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack | "all" | "student">("all");
  
  const getFilteredCourses = () => {
    if (selectedTrack === "all") {
      return [...studentCourses.map(c => ({ ...c, track: "student" as const })), ...allWorkplaceCourses];
    }
    if (selectedTrack === "student") {
      return studentCourses.map(c => ({ ...c, track: "student" as const }));
    }
    return allWorkplaceCourses.filter(course => course.track === selectedTrack);
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Learning Hub | Innerspark Africa - Workplace Mental Health Courses</title>
        <meta name="description" content="Build healthy workplace mental health with Innerspark Africa's Learning Hub. Access courses for career transitions, workplace wellness, and leadership mental health training." />
        <meta name="keywords" content="workplace mental health courses, career transition training, leadership mental health, employee wellness, HR mental health training Africa" />
        <link rel="canonical" href="https://innersparkafrica.org/learning" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-teal-calm/10 to-background z-0" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-calm rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Workplace Mental Health Academy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Learning Hub
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium mb-4">
                Mental Health Training for Every Career Stage
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                From students entering the workforce to senior leaders—access structured courses 
                designed to build mental health awareness, resilience, and leadership skills.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}>
                  <BookOpen className="w-5 h-5" />
                  Explore Courses
                </Button>
                <Link to="/for-business">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Building2 className="w-5 h-5" />
                    For Organizations
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Career Tracks Section */}
      <section id="tracks" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Learning Track
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select courses designed for your career stage and professional needs
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-8">
            {careerTracks.map((track) => {
              const IconComponent = getTrackIcon(track.icon);
              const courseCount = allWorkplaceCourses.filter(c => c.track === track.id).length;
              return (
                <StaggerItem key={track.id}>
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      selectedTrack === track.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTrack(track.id)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${track.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{track.name}</CardTitle>
                      <CardDescription>{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">{courseCount} Courses</Badge>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTrack === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTrack("all")}
            >
              All Courses
            </Button>
            <Button
              variant={selectedTrack === "student" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTrack("student")}
              className="gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Student Wellness
            </Button>
            {careerTracks.map((track) => {
              const IconComponent = getTrackIcon(track.icon);
              return (
                <Button
                  key={track.id}
                  variant={selectedTrack === track.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTrack(track.id)}
                  className="gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {track.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section id="courses" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {selectedTrack === "all" ? "All Courses" : 
                 selectedTrack === "student" ? "Student Wellness Courses" :
                 careerTracks.find(t => t.id === selectedTrack)?.name || "Courses"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <StaggerItem key={course.id}>
                <Link to={`/learning/${course.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        {'track' in course && course.track !== 'student' && (
                          <Badge className="bg-background/90 text-foreground border-0 text-xs">
                            {careerTracks.find(t => t.id === course.track)?.name}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                        <span className="mx-1">•</span>
                        <BookOpen className="w-3 h-3" />
                        {'modules' in course && typeof course.modules === 'number' ? course.modules : (course as any).modules?.length || 4} Modules
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2 mb-4">
                        {course.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {course.enrolled.toLocaleString()} enrolled
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Free
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your Learning Journey
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Progress through courses designed for each stage of your career
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <StaggerContainer className="space-y-4">
              {[
                { step: 1, title: "Transitioning to Work", desc: "Build mental health awareness, emotional intelligence, and resilience for your first job", icon: GraduationCap, color: "from-green-500 to-emerald-600" },
                { step: 2, title: "Workplace Fundamentals", desc: "Master workplace mental health, stress management, and productivity skills", icon: Building2, color: "from-blue-500 to-indigo-600" },
                { step: 3, title: "Leadership & Management", desc: "Lead with compassion, create healthy cultures, and support team wellbeing", icon: UserCog, color: "from-purple-500 to-violet-600" },
                { step: 4, title: "Earn Certifications", desc: "Complete courses to earn recognized certificates for your professional development", icon: Award, color: "from-yellow-500 to-orange-600" }
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <div className="flex items-center gap-4 bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground/30">{item.step}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <Badge className="mb-4 bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                  <Award className="w-4 h-4 mr-2" />
                  Certification
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Earn Recognized Certificates
                </h2>
                <p className="text-muted-foreground mb-6">
                  Complete courses to earn digital certificates that showcase your mental health literacy 
                  and workplace wellness expertise. Perfect for professional development and career growth.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Verified by Innerspark Africa",
                    "Shareable on LinkedIn & professional profiles",
                    "Demonstrates commitment to workplace wellbeing",
                    "Meets organizational training requirements"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Earning Certificates
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-gradient-to-br from-primary/10 via-teal-calm/10 to-purple-deep/10 rounded-2xl p-8 border border-border">
                <div className="bg-background rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-10 h-10 text-yellow-500" />
                    <div>
                      <p className="font-bold text-foreground">Certificate of Completion</p>
                      <p className="text-sm text-muted-foreground">Workplace Mental Health</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-2">This certifies that</p>
                    <p className="font-semibold text-foreground mb-2">[Your Name]</p>
                    <p className="text-sm text-muted-foreground">
                      has successfully completed the Workplace Mental Health Fundamentals course
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Institutional Access */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <Building2 className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Institutional & Corporate Access
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Bring Innerspark's workplace mental health training to your organization. 
                Get custom learning paths, team analytics, and dedicated support.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/for-business">
                  <Button size="lg" variant="secondary">
                    Learn More
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learning;
