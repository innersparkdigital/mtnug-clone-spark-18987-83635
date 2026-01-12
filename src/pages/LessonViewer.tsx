import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Play,
  Pause,
  CheckCircle2,
  Download,
  FileText,
  Video,
  Headphones,
  Target,
  Lightbulb,
  Award,
  Home,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

// Slide content for lessons
const lessonSlides: Record<string, {
  title: string;
  slides: {
    type: "title" | "content" | "scenario" | "activity" | "tips" | "quiz";
    title?: string;
    subtitle?: string;
    content?: string[];
    bullets?: string[];
    scenario?: { title: string; story: string; reflection: string };
    activity?: { instruction: string; prompts: string[] };
    tips?: { title: string; items: string[] };
    quiz?: { question: string; options: string[]; correct: number; explanation: string };
    image?: string;
  }[];
}> = {
  "1-1": {
    title: "What is Digital Mental Health?",
    slides: [
      {
        type: "title",
        title: "Module 1: Introduction to Digital Mental Health",
        subtitle: "Lesson 1: What is Digital Mental Health?",
        content: ["By the end of this lesson, you will:", "• Understand what digital mental health means", "• Recognize why it matters in today's world", "• Identify how technology impacts your wellbeing"]
      },
      {
        type: "content",
        title: "Defining Digital Mental Health",
        bullets: [
          "Digital mental health refers to the intersection of technology and psychological wellbeing",
          "It encompasses how we use digital tools, platforms, and devices in ways that affect our mental state",
          "Includes both the challenges (screen addiction, cyberbullying) and opportunities (mental health apps, online therapy)",
          "A growing field as our lives become increasingly digital"
        ],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
      },
      {
        type: "content",
        title: "Why Digital Mental Health Matters",
        bullets: [
          "The average person spends 7+ hours daily on screens",
          "Social media use is linked to increased rates of anxiety and depression in young people",
          "Digital skills are essential, but so is digital wellness",
          "Understanding the impact helps us make healthier choices",
          "Early awareness can prevent long-term mental health issues"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "Amara's Experience",
          story: "Amara, a second-year university student in Kampala, noticed she was spending 5-6 hours daily on Instagram and TikTok. She felt anxious when she couldn't check her phone and often compared herself to influencers. Her grades started dropping, and she had trouble sleeping. When she learned about digital mental health in an Innerspark workshop, she realized her habits were affecting her wellbeing.",
          reflection: "Have you ever experienced similar feelings related to your digital habits?"
        }
      },
      {
        type: "activity",
        title: "Quick Reflection",
        activity: {
          instruction: "Take a moment to think about your own digital habits:",
          prompts: [
            "How many hours do you spend on screens daily?",
            "What apps or platforms take up most of your time?",
            "How do you feel after extended screen time?",
            "What positive aspects of technology do you value?"
          ]
        }
      },
      {
        type: "tips",
        title: "Key Takeaways",
        tips: {
          title: "Remember these points:",
          items: [
            "Digital mental health is about finding balance in our technology use",
            "Awareness is the first step toward healthier digital habits",
            "Technology itself isn't bad—it's how we use it that matters",
            "Small changes in digital habits can have big impacts on wellbeing",
            "You're not alone—many students face similar challenges"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "Which of the following BEST describes digital mental health?",
          options: [
            "Avoiding all technology to protect mental health",
            "Using only mental health apps on your phone",
            "The intersection of technology use and psychological wellbeing",
            "Having a social media account"
          ],
          correct: 2,
          explanation: "Digital mental health refers to the relationship between our technology use and our psychological wellbeing. It's not about avoiding technology, but understanding how our digital habits affect us."
        }
      }
    ]
  },
  "1-2": {
    title: "The Digital Age & Your Mind",
    slides: [
      {
        type: "title",
        title: "The Digital Age & Your Mind",
        subtitle: "Understanding how constant connectivity shapes our mental landscape",
        content: ["In this lesson, we explore:", "• How the digital age differs from previous eras", "• The psychological effects of constant connectivity", "• Opportunities and challenges unique to digital natives"]
      },
      {
        type: "content",
        title: "Living in the Digital Age",
        bullets: [
          "We are the first generation to grow up fully immersed in digital technology",
          "Smartphones, social media, and internet access are woven into daily life",
          "Information is available instantly, anywhere, anytime",
          "Our brains are adapting to this new reality—for better and worse",
          "The average university student checks their phone 80+ times per day"
        ]
      },
      {
        type: "content",
        title: "How Digital Life Affects Your Brain",
        bullets: [
          "Dopamine loops: Social media notifications trigger reward centers, creating habitual checking",
          "Attention fragmentation: Constant switching between apps reduces deep focus",
          "Sleep disruption: Blue light and stimulating content affect sleep quality",
          "Memory changes: Why memorize when Google knows everything?",
          "Social comparison: Seeing curated lives affects self-esteem"
        ]
      },
      {
        type: "scenario",
        title: "Real Student Story",
        scenario: {
          title: "David's Discovery",
          story: "David, a student at Makerere University, realized he couldn't study for more than 15 minutes without checking his phone. Even when it was on silent, the urge was overwhelming. He felt anxious, distracted, and his exam results reflected his divided attention. After tracking his phone usage, he discovered he unlocked his phone over 100 times daily!",
          reflection: "What does your relationship with your phone look like? Do you control it, or does it control you?"
        }
      },
      {
        type: "activity",
        title: "Self-Assessment Exercise",
        activity: {
          instruction: "Rate each statement from 1 (Never) to 5 (Always):",
          prompts: [
            "I feel anxious when I can't check my phone",
            "I spend more time online than I planned to",
            "I compare myself to others I see online",
            "I have trouble focusing on tasks without checking notifications",
            "I use my phone right before bed"
          ]
        }
      },
      {
        type: "tips",
        title: "Navigating the Digital Age Wisely",
        tips: {
          title: "Practical strategies:",
          items: [
            "Use screen time tracking apps to understand your habits",
            "Schedule 'focus time' with notifications off",
            "Create phone-free zones (bedroom, study desk)",
            "Curate your feed to include positive, inspiring content",
            "Remember: You have the power to design your digital experience"
          ]
        }
      },
      {
        type: "quiz",
        title: "Knowledge Check",
        quiz: {
          question: "What is a 'dopamine loop' in the context of social media?",
          options: [
            "A type of social media filter",
            "A cycle where notifications trigger reward responses, encouraging repeated checking",
            "A fitness tracking feature",
            "A privacy setting on apps"
          ],
          correct: 1,
          explanation: "Dopamine loops occur when social media notifications trigger our brain's reward system, creating a cycle of checking for more notifications. This is by design—apps are engineered to be addictive."
        }
      }
    ]
  }
};

const defaultSlides = lessonSlides["1-1"];

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "slides": return FileText;
    case "audio": return Headphones;
    case "activity": return Target;
    case "quiz": return Lightbulb;
    case "certificate": return Award;
    default: return FileText;
  }
};

const LessonViewer = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lessonData = lessonId && lessonSlides[lessonId] ? lessonSlides[lessonId] : defaultSlides;
  const slides = lessonData.slides;
  const totalSlides = slides.length;
  const progress = Math.round(((currentSlide + 1) / totalSlides) * 100);

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];

    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Innerspark Learning
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-xl text-primary mb-8">{slide.subtitle}</p>
            )}
            {slide.content && (
              <div className="text-left bg-muted/50 rounded-xl p-6 max-w-xl">
                {slide.content.map((line, i) => (
                  <p key={i} className={`${i === 0 ? "font-medium mb-2" : "text-muted-foreground"}`}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case "content":
        return (
          <div className="py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.title}</h2>
            {slide.image && (
              <img src={slide.image} alt="" className="w-full h-48 md:h-64 object-cover rounded-xl mb-6" />
            )}
            <ul className="space-y-4">
              {slide.bullets?.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "scenario":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              Real Student Story
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.scenario?.title}</h2>
            <div className="bg-muted rounded-xl p-6 mb-6">
              <p className="text-lg leading-relaxed">{slide.scenario?.story}</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <p className="font-medium text-primary mb-2">Reflection Question:</p>
              <p className="text-lg">{slide.scenario?.reflection}</p>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-teal-calm/10 text-teal-700 border-teal-calm/20">
              <Target className="w-4 h-4 mr-2" />
              Activity
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{slide.title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{slide.activity?.instruction}</p>
            <div className="space-y-4">
              {slide.activity?.prompts.map((prompt, i) => (
                <div key={i} className="bg-muted rounded-xl p-4 flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-lg">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "tips":
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-green-wellness/10 text-green-700 border-green-wellness/30">
              <Lightbulb className="w-4 h-4 mr-2" />
              Key Takeaways
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{slide.title}</h2>
            <p className="text-muted-foreground mb-6">{slide.tips?.title}</p>
            <div className="space-y-3">
              {slide.tips?.items.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-green-wellness/5 rounded-lg p-4 border border-green-wellness/20">
                  <CheckCircle2 className="w-5 h-5 text-green-wellness flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "quiz":
        const quiz = slide.quiz!;
        const isCorrect = selectedAnswer === quiz.correct;
        return (
          <div className="py-8">
            <Badge className="mb-4 bg-purple-deep/10 text-purple-700 border-purple-deep/30">
              <Lightbulb className="w-4 h-4 mr-2" />
              Knowledge Check
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{quiz.question}</h2>
            <RadioGroup 
              value={selectedAnswer?.toString()} 
              onValueChange={(val) => !showResult && setSelectedAnswer(parseInt(val))}
              className="space-y-3"
            >
              {quiz.options.map((option, i) => {
                let optionClass = "border-border hover:border-primary/50";
                if (showResult) {
                  if (i === quiz.correct) {
                    optionClass = "border-green-wellness bg-green-wellness/10";
                  } else if (i === selectedAnswer) {
                    optionClass = "border-destructive bg-destructive/10";
                  }
                } else if (selectedAnswer === i) {
                  optionClass = "border-primary bg-primary/5";
                }
                
                return (
                  <div key={i} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${optionClass}`}>
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} disabled={showResult} />
                    <Label htmlFor={`option-${i}`} className="text-lg cursor-pointer flex-1">
                      {option}
                    </Label>
                    {showResult && i === quiz.correct && (
                      <CheckCircle2 className="w-5 h-5 text-green-wellness" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
            
            {!showResult && selectedAnswer !== null && (
              <Button onClick={checkAnswer} className="mt-6">
                Check Answer
              </Button>
            )}
            
            {showResult && (
              <div className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-green-wellness/10 border border-green-wellness/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
                <p className={`font-medium ${isCorrect ? "text-green-700" : "text-yellow-700"}`}>
                  {isCorrect ? "✓ Correct!" : "Not quite right"}
                </p>
                <p className="mt-2 text-muted-foreground">{quiz.explanation}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{lessonData.title} | Innerspark Learning</title>
      </Helmet>

      {/* Minimal Header */}
      <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to={`/learning/${courseId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Course</span>
            </Link>
          </div>
          
          <div className="flex-1 mx-4 max-w-md">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {currentSlide + 1}/{totalSlides}
              </span>
            </div>
          </div>

          <Link to="/learning">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Learning Hub</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile by default */}
        <aside className={`fixed md:static left-0 top-[57px] h-[calc(100vh-57px)] w-72 bg-muted/30 border-r border-border overflow-y-auto z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div className="p-4">
            <h2 className="font-semibold text-sm text-muted-foreground mb-4">Lesson Content</h2>
            <nav className="space-y-2">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                    currentSlide === index 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 line-clamp-1">
                    {slide.title || slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                  </span>
                  {index < currentSlide && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>
              ))}
            </nav>

            {/* Resources Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Resources</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors flex items-center gap-3">
                  <Download className="w-4 h-4 text-primary" />
                  Download Slides (PDF)
                </button>
                <button className="w-full text-left p-3 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Worksheet
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <Card className="min-h-[60vh]">
              <CardContent className="p-6 md:p-8">
                {renderSlideContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={goToPrevSlide}
                disabled={currentSlide === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentSlide === totalSlides - 1 ? (
                <Link to={`/learning/${courseId}`}>
                  <Button className="gap-2">
                    Complete Lesson
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button onClick={goToNextSlide} className="gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonViewer;