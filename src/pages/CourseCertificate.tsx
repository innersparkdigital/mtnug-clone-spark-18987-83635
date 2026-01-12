import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { 
  Award, 
  Download, 
  ChevronLeft, 
  Share2,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

// Course data for certificate
const coursesData: Record<string, {
  title: string;
  certificateTitle: string;
  modules: number;
  duration: string;
}> = {
  "digital-mental-health": {
    title: "Digital Mental Health & Wellness",
    certificateTitle: "Certificate of Completion in Digital Mental Health & Wellness",
    modules: 8,
    duration: "6-8 weeks"
  },
  "stress-academic-pressure": {
    title: "Managing Stress & Academic Pressure",
    certificateTitle: "Certificate in Stress Management & Academic Resilience",
    modules: 4,
    duration: "4 weeks"
  },
  "wellness-ambassador": {
    title: "Digital Wellness Ambassador Program",
    certificateTitle: "Certified Digital Wellness Ambassador",
    modules: 5,
    duration: "8 weeks"
  }
};

const CourseCertificate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrollments, lessonProgress, loading } = useLearningProgress(courseId);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const course = courseId && coursesData[courseId] ? coursesData[courseId] : null;
  
  // Find enrollment completion date
  const enrollment = enrollments.find(e => e.course_id === courseId);
  const completionDate = enrollment?.completed_at 
    ? new Date(enrollment.completed_at) 
    : new Date();

  // Get user display name
  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';

  // Check if course is actually completed
  const totalLessonsNeeded = courseId === 'digital-mental-health' ? 35 : 
                              courseId === 'stress-academic-pressure' ? 17 : 23;
  const completedLessons = lessonProgress.filter(p => p.completed).length;
  const isCompleted = completedLessons >= totalLessonsNeeded;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${course?.title.replace(/\s+/g, '-')}-Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I completed ${course?.title}!`,
          text: `I just earned my ${course?.certificateTitle} from Innerspark Africa!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Link to="/learning">
              <Button>Back to Learning</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Certificate - {course.title} | Innerspark Africa</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link to={`/learning/${courseId}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Course
          </Link>

          {!isCompleted ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Complete the Course to Earn Your Certificate</h2>
                <p className="text-muted-foreground mb-6">
                  You've completed {completedLessons} of {totalLessonsNeeded} lessons. 
                  Finish all lessons to unlock your certificate.
                </p>
                <Link to={`/learning/${courseId}`}>
                  <Button className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <Button onClick={handleDownloadPDF} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Certificate Preview */}
              <div className="max-w-4xl mx-auto">
                <div 
                  ref={certificateRef}
                  className="bg-white aspect-[1.414] relative overflow-hidden shadow-2xl"
                  style={{ minHeight: '600px' }}
                >
                  {/* Border Design */}
                  <div className="absolute inset-4 border-4 border-primary/30 rounded-lg" />
                  <div className="absolute inset-6 border-2 border-primary/20 rounded-lg" />
                  
                  {/* Corner Decorations */}
                  <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 py-12 text-center">
                    {/* Logo & Header */}
                    <div className="mb-6">
                      <img 
                        src="/innerspark-logo.png" 
                        alt="Innerspark Africa" 
                        className="h-12 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-500 tracking-widest uppercase">Learning Academy</p>
                    </div>

                    {/* Certificate Title */}
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">
                      Certificate of Completion
                    </h1>
                    <div className="w-32 h-1 bg-primary mx-auto mb-6" />

                    {/* Recipient */}
                    <p className="text-gray-600 mb-2">This is to certify that</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-serif">
                      {userName}
                    </h2>
                    <p className="text-gray-600 mb-6">has successfully completed</p>

                    {/* Course Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      {course.certificateTitle}
                    </h3>
                    <p className="text-gray-500 mb-8">
                      {course.modules} Modules • {course.duration}
                    </p>

                    {/* Award Icon */}
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Date & Signature */}
                    <div className="flex justify-between w-full max-w-md mt-auto">
                      <div className="text-center">
                        <div className="w-32 border-b-2 border-gray-300 mb-2" />
                        <p className="text-sm text-gray-600">{format(completionDate, 'MMMM d, yyyy')}</p>
                        <p className="text-xs text-gray-400">Date of Completion</p>
                      </div>
                      <div className="text-center">
                        <div className="w-32 border-b-2 border-gray-300 mb-2">
                          <p className="font-script text-lg text-gray-700">Innerspark Team</p>
                        </div>
                        <p className="text-xs text-gray-400">Authorized Signature</p>
                      </div>
                    </div>

                    {/* Verification */}
                    <p className="text-xs text-gray-400 mt-6">
                      Verified by Innerspark Africa • innersparkafrica.org
                    </p>
                  </div>
                </div>
              </div>

              {/* Congratulations Message */}
              <div className="max-w-2xl mx-auto mt-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  🎉 Congratulations!
                </h3>
                <p className="text-muted-foreground">
                  You've completed {course.title}. This certificate recognizes your commitment 
                  to mental health awareness and digital wellness. Share your achievement 
                  with your network!
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseCertificate;