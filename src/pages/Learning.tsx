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
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

// Course data
const courses = [
  {
    id: "digital-mental-health",
    title: "Digital Mental Health & Wellness",
    description: "A comprehensive course covering digital wellbeing, online safety, and mental health fundamentals for the digital age.",
    duration: "6-8 weeks",
    level: "Beginner",
    format: "Online",
    category: "Digital Mental Health",
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
    category: "Stress & Anxiety Management",
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
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence for Students",
    description: "Develop self-awareness, empathy, and social skills essential for personal and academic success.",
    duration: "5 weeks",
    level: "Beginner",
    format: "Online",
    category: "Emotional Intelligence",
    modules: 5,
    enrolled: 680,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
    progress: 0,
    featured: false
  },
  {
    id: "digital-skills-wellbeing",
    title: "Digital Skills for Mental Wellbeing",
    description: "Master the use of digital tools and apps that support mental health and productivity.",
    duration: "3 weeks",
    level: "Beginner",
    format: "Online",
    category: "Digital Skills for Wellbeing",
    modules: 4,
    enrolled: 450,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    progress: 0,
    featured: false
  },
  {
    id: "student-wellness-fundamentals",
    title: "Student Wellness Fundamentals",
    description: "Essential wellness practices for maintaining balance, focus, and mental health throughout your academic journey.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    category: "Student Wellness",
    modules: 6,
    enrolled: 920,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    progress: 0,
    featured: false
  }
];

const categories = [
  { name: "All Courses", icon: BookOpen, count: courses.length },
  { name: "Digital Mental Health", icon: Brain, count: 1 },
  { name: "Student Wellness", icon: Heart, count: 1 },
  { name: "Stress & Anxiety Management", icon: Sparkles, count: 1 },
  { name: "Emotional Intelligence", icon: Users, count: 1 },
  { name: "Digital Skills for Wellbeing", icon: GraduationCap, count: 1 },
  { name: "Ambassador Programs", icon: Award, count: 1 }
];

const stats = [
  { label: "Active Learners", value: "5,000+", icon: Users },
  { label: "Courses Available", value: "6", icon: BookOpen },
  { label: "Certificates Issued", value: "2,500+", icon: Award },
  { label: "Partner Institutions", value: "15+", icon: Building2 }
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

const Learning = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  
  const filteredCourses = selectedCategory === "All Courses" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Learning Hub | Innerspark Africa - Digital Mental Health Courses</title>
        <meta name="description" content="Build healthy digital habits and mental resilience with Innerspark Africa's Learning Hub. Access courses on digital mental health, stress management, and wellness for students." />
        <meta name="keywords" content="mental health courses, digital wellness training, student mental health, emotional intelligence, stress management courses Africa" />
        <link rel="canonical" href="https://innersparkafrica.org/learning" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Innerspark Africa Learning Hub",
            "description": "Digital mental health and wellness courses for students in Africa",
            "url": "https://innersparkafrica.org/learning",
            "hasCourse": courses.map(course => ({
              "@type": "Course",
              "name": course.title,
              "description": course.description,
              "provider": {
                "@type": "Organization",
                "name": "Innerspark Africa"
              },
              "educationalLevel": course.level,
              "courseMode": course.format
            }))
          })}
        </script>
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
                <GraduationCap className="w-4 h-4 mr-2" />
                Innerspark Learning Hub
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Learning Hub
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium mb-4">
                Build Healthy Digital Habits & Mental Resilience
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Access free, structured courses designed for African students. Learn about digital mental health, 
                stress management, and emotional wellness through interactive modules and practical exercises.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                  <BookOpen className="w-5 h-5" />
                  Browse Courses
                </Button>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Building2 className="w-5 h-5" />
                    Partner With Innerspark
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

      {/* Categories Filter */}
      <section className="py-8 bg-muted/30 border-y border-border sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section id="courses" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {selectedCategory === "All Courses" ? "All Courses" : selectedCategory}
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
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        {course.featured && (
                          <Badge className="bg-yellow-500/90 text-white border-0">
                            Featured
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
                        {course.modules} Modules
                        <span className="mx-1">•</span>
                        {course.format}
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
                        {course.progress > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="w-16 h-2" />
                            <span className="text-xs">{course.progress}%</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Free
                          </Badge>
                        )}
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
                Follow our structured path from fundamentals to becoming a certified Digital Wellness Ambassador
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <StaggerContainer className="space-y-4">
              {[
                { step: 1, title: "Start with Fundamentals", desc: "Begin with Student Wellness Fundamentals or Digital Mental Health basics", icon: BookOpen },
                { step: 2, title: "Build Core Skills", desc: "Progress to Stress Management and Emotional Intelligence courses", icon: Brain },
                { step: 3, title: "Apply Your Knowledge", desc: "Complete practical exercises and real-world projects", icon: CheckCircle2 },
                { step: 4, title: "Become an Ambassador", desc: "Graduate to the Advanced Ambassador Program and lead change", icon: Award }
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <div className="flex items-center gap-4 bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <item.icon className="w-6 h-6 text-primary" />
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
                  and wellness advocacy skills. Stand out to employers and institutions.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Course completion certificates",
                    "Digital Wellness Ambassador certification",
                    "Shareable on LinkedIn and social media",
                    "Verified by Innerspark Africa"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-green-wellness" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Start Earning Certificates
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 via-yellow-500/10 to-teal-calm/20 rounded-2xl p-8 border border-border">
                  <div className="bg-background rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <img src="/innerspark-logo.png" alt="Innerspark" className="h-8" />
                      <Award className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Certificate of Completion</h3>
                    <p className="text-sm text-muted-foreground mb-4">Digital Mental Health & Wellness</p>
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground">This certifies that</p>
                      <p className="font-semibold text-foreground">[Your Name]</p>
                      <p className="text-xs text-muted-foreground mt-2">has successfully completed all requirements</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Institutional Access */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-teal-calm/10">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Building2 className="w-4 h-4 mr-2" />
                For Institutions
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Bring Innerspark Learning to Your Institution
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Partner with us to provide mental health and wellness education to your students. 
                We offer bulk enrollment, customized content, and progress tracking for universities and schools.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Bulk Enrollment", desc: "Easy registration for entire cohorts" },
                  { title: "Progress Tracking", desc: "Monitor student engagement and completion" },
                  { title: "Custom Content", desc: "Tailored modules for your institution" }
                ].map((item, index) => (
                  <div key={index} className="bg-background rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  Request Institutional Access
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learning;