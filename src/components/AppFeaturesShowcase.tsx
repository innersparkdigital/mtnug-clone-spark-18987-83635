import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Smile, MessageCircle, Video, Users, Calendar, AlertTriangle, Search, Heart, Sparkles, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Import feature images
import findTherapistsMockup from "@/assets/features/find-therapist.jpg";
import chatSessionMockup from "@/assets/mockups/chat-session.png";
import supportGroupsMockup from "@/assets/features/support-groups.webp";
import bookAppointmentMockup from "@/assets/features/book-appointment.jpg";
import emergencyButtonMockup from "@/assets/features/emergency-button.jpg";
import therapyFundMockup from "@/assets/features/donate-therapy.jpg";
import moodTrackerMockup from "@/assets/features/mood-tracker.jpg";
import dailyReflectionMockup from "@/assets/features/daily-reflection.jpg";
import downloadAppMockup from "@/assets/mockups/download-app.png";
import privateCounsellingMockup from "@/assets/features/private-counselling.jpg";

const features = [
  {
    id: 1,
    headline: "Your feelings,\nunderstood.",
    title: "Mood Tracker",
    description: "Track your mood with simple emojis and gently learn what your heart has been trying to tell you.",
    icon: Smile,
    mockup: moodTrackerMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 2,
    headline: "Your story,\ncelebrated.",
    title: "Daily Reflection",
    description: "Celebrate small wins. Write about how your day felt. Every week, see your growth in a wellness report.",
    icon: Sparkles,
    mockup: dailyReflectionMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 3,
    headline: "The right help,\ncloser than you think.",
    title: "Find Therapists",
    description: "Browse through certified professionals who truly understand your condition and match your healing journey.",
    icon: Search,
    mockup: findTherapistsMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 4,
    headline: "Your healing,\ncompletely confidential.",
    title: "Private Counselling",
    description: "Talk to a licensed therapist who gives you a safe space to breathe, feel, and find your strength again.",
    icon: Video,
    mockup: privateCounsellingMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 5,
    headline: "Someone listens,\n24/7.",
    title: "Chat Consultation",
    description: "A professional counsellor is always a message away — ready to support you with compassion and zero judgment.",
    icon: MessageCircle,
    mockup: chatSessionMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 6,
    headline: "You're not alone,\nothers feel it too.",
    title: "Support Groups",
    description: "Connect with people who understand exactly what you're going through. Share your story. Heal together.",
    icon: Users,
    mockup: supportGroupsMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 7,
    headline: "Invest in\nyour peace.",
    title: "Book Appointment",
    description: "Book a virtual session for as low as 50,000 UGX. Give yourself the gift of professional support.",
    icon: Calendar,
    mockup: bookAppointmentMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 8,
    headline: "Your life matters,\nreach out now.",
    title: "Emergency Button",
    description: "Press the emergency button and immediately talk to a crisis counsellor who genuinely cares.",
    icon: AlertTriangle,
    mockup: emergencyButtonMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 9,
    headline: "Your kindness,\nsaves tomorrow.",
    title: "Therapy Fund",
    description: "Even 5,000 UGX can help someone who desperately needs counselling but can't afford it.",
    icon: Heart,
    mockup: therapyFundMockup,
    accentColor: "hsl(var(--primary))"
  },
  {
    id: 10,
    headline: "Your safe space,\nis waiting.",
    title: "Download App",
    description: "Create your account and open the door to real mental health support — anytime you need it.",
    icon: Download,
    mockup: downloadAppMockup,
    accentColor: "hsl(var(--primary))"
  }
];

const AppFeaturesShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all images on mount
  useEffect(() => {
    const imagePromises = features.map((feature) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = feature.mockup;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    
    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, []);

  const changeSlide = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (!isAutoPlaying || !imagesLoaded) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % features.length;
      setCurrentIndex(nextIndex);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, imagesLoaded]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    changeSlide(prevIndex);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    const nextIndex = (currentIndex + 1) % features.length;
    changeSlide(nextIndex);
  };

  const currentFeature = features[currentIndex];

  return (
    <section 
      className="min-h-screen flex flex-col justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, hsl(142 40% 90%) 0%, hsl(142 30% 85%) 50%, hsl(142 25% 88%) 100%)'
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-12 lg:py-0">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 whitespace-pre-line font-serif">
                  {currentFeature.headline}
                </h1>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                  {currentFeature.description}
                </p>

                {/* CTA Button */}
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="https://play.google.com/store/apps/details?id=com.innerspark.app" target="_blank" rel="noopener noreferrer">
                    Get started
                  </a>
                </Button>

                {/* Trust Badge */}
                <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-medium text-foreground">Trusted by</span>
                  <span className="text-sm font-bold text-primary">5,000+</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">users</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Phone Mockup */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                {/* Large Card with Human Image - Positioned to be fully visible */}
                <div className="absolute -left-24 sm:-left-32 md:-left-40 lg:-left-48 top-1/2 -translate-y-1/2 w-52 sm:w-64 md:w-80 lg:w-96 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 z-0">
                  <img 
                    src={currentFeature.mockup}
                    alt=""
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </div>

                {/* Main Phone Frame - Blank */}
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-[1.02]">
                  {/* Phone outer frame */}
                  <div className="relative bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl">
                    {/* Phone notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 md:w-28 h-6 md:h-7 bg-gray-900 rounded-b-2xl z-20" />
                    
                    {/* Phone screen - Blank with subtle gradient */}
                    <div className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[400px] sm:h-[480px] md:h-[560px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
                      {/* Optional subtle app-like elements */}
                      <div className="absolute inset-x-4 top-12 flex flex-col gap-3">
                        <div className="h-2 w-3/4 bg-gray-300/50 rounded-full" />
                        <div className="h-2 w-1/2 bg-gray-300/50 rounded-full" />
                      </div>
                    </div>
                    
                    {/* Phone home indicator */}
                    <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-4 md:-right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <currentFeature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-foreground">{currentFeature.title}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
        aria-label="Previous feature"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
        aria-label="Next feature"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Feature Icons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  changeSlide(index);
                }}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary text-primary-foreground scale-110 shadow-md' 
                    : 'bg-transparent text-muted-foreground hover:bg-muted'
                }`}
                aria-label={`Go to ${feature.title}`}
              >
                <FeatureIcon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AppFeaturesShowcase;
