import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Smile, MessageCircle, Video, Users, Calendar, AlertTriangle, Search, Heart, Sparkles, Download } from "lucide-react";

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
    title: "Mood Tracker",
    tagline: "Your feelings deserve to be seen.",
    description: "Some days you're okay, some days you're not. Healing starts with understanding yourself. Track your mood with simple emojis and gently learn what your heart has been trying to tell you.",
    icon: Smile,
    gradient: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    mockup: moodTrackerMockup,
    usePhoneMockup: false
  },
  {
    id: 2,
    title: "Daily Reflection",
    tagline: "Your story matters, even on quiet days.",
    description: "Celebrate small wins. Write about how your day felt. Acknowledge the hard moments. Every week, see your growth in a gentle wellness report.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    mockup: dailyReflectionMockup,
    usePhoneMockup: false
  },
  {
    id: 3,
    title: "Find Therapists",
    tagline: "The right help is closer than you think.",
    description: "Browse through certified professionals who truly understand your condition. Find the therapist who matches your healing journey.",
    icon: Search,
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    mockup: findTherapistsMockup,
    usePhoneMockup: false
  },
  {
    id: 4,
    title: "Private Counselling",
    tagline: "Your healing is personal and completely confidential.",
    description: "Whether it's work stress, trauma, heartbreak, or emotional pain... Talk to a licensed therapist who gives you a safe space to breathe, feel, and find your strength again.",
    icon: Video,
    gradient: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    mockup: privateCounsellingMockup,
    usePhoneMockup: false
  },
  {
    id: 5,
    title: "24/7 Chat Consultation",
    tagline: "When life feels heavy, talk to someone who listens.",
    description: "You don't have to face stress, anxiety, or loneliness alone at 2:00am. A professional counsellor is always a message away ready to support you with compassion and zero judgment.",
    icon: MessageCircle,
    gradient: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-50",
    mockup: chatSessionMockup,
    usePhoneMockup: false
  },
  {
    id: 6,
    title: "Support Groups",
    tagline: "You're not alone... others feel it too.",
    description: "Connect with people who understand exactly what you're going through. Share your story. Hear theirs. Heal together.",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    mockup: supportGroupsMockup,
    usePhoneMockup: false
  },
  {
    id: 7,
    title: "Book Appointment",
    tagline: "Invest in your peace.",
    description: "Book a virtual session for as low as 50,000 UGX. Give yourself the gift of talking to someone who supports your mental and emotional wellbeing.",
    icon: Calendar,
    gradient: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    mockup: bookAppointmentMockup,
    usePhoneMockup: false
  },
  {
    id: 8,
    title: "Emergency Button",
    tagline: "Your life matters. Reach out — Now.",
    description: "When you feel unsafe or overwhelmed... Press the emergency button and immediately talk to a crisis counsellor who genuinely cares.",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    mockup: emergencyButtonMockup,
    usePhoneMockup: false
  },
  {
    id: 9,
    title: "Therapy Fund",
    tagline: "Your kindness can save someone's tomorrow.",
    description: "Even 5,000 UGX can help someone who desperately needs counselling but can't afford it. Be part of the healing.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-50",
    mockup: therapyFundMockup,
    usePhoneMockup: false
  },
  {
    id: 10,
    title: "Download App",
    tagline: "Your safe space is waiting.",
    description: "Create your account and open the door to real mental health support — anytime you need it.",
    icon: Download,
    gradient: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    mockup: downloadAppMockup
  }
];

// Helper function to convert Tailwind gradient classes to CSS colors
const getGradientColors = (gradient: string) => {
  const colorMap: Record<string, { from: string; to: string }> = {
    "from-blue-500 to-indigo-600": { from: "#3b82f6", to: "#4f46e5" },
    "from-purple-500 to-pink-500": { from: "#a855f7", to: "#ec4899" },
    "from-teal-500 to-cyan-500": { from: "#14b8a6", to: "#06b6d4" },
    "from-indigo-500 to-blue-600": { from: "#6366f1", to: "#2563eb" },
    "from-sky-500 to-blue-500": { from: "#0ea5e9", to: "#3b82f6" },
    "from-green-500 to-emerald-500": { from: "#22c55e", to: "#10b981" },
    "from-orange-500 to-amber-500": { from: "#f97316", to: "#f59e0b" },
    "from-red-500 to-rose-500": { from: "#ef4444", to: "#f43f5e" },
    "from-pink-500 to-rose-400": { from: "#ec4899", to: "#fb7185" },
    "from-violet-500 to-purple-600": { from: "#8b5cf6", to: "#9333ea" },
  };
  return colorMap[gradient] || { from: "#3b82f6", to: "#4f46e5" };
};

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
        img.onerror = () => resolve(); // Resolve even on error to not block
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
    }, 5000);
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
  const Icon = currentFeature.icon;

  return (
    <section className="pt-0 pb-8 md:pb-12 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Feature Showcase */}
        <div className="relative max-w-5xl mx-auto">
        {/* Main Feature Card */}
          <div 
            className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500`}
            style={{
              background: `linear-gradient(135deg, ${getGradientColors(currentFeature.gradient).from} 0%, ${getGradientColors(currentFeature.gradient).to} 100%)`
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Unified gradient overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
            
            <div className={`grid md:grid-cols-2 gap-0 min-h-[380px] md:min-h-[400px] relative z-10 transition-opacity duration-150 ease-out`}>
              {/* Left Content */}
              <div className="p-5 md:p-8 lg:p-10 flex flex-col justify-center relative z-10">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${currentFeature.gradient} text-white shadow-lg mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 transition-all duration-300">
                  {currentFeature.title}
                </h3>
                
                <div className={`inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r ${currentFeature.gradient} text-white text-sm font-medium mb-3 max-w-fit`}>
                  {currentFeature.tagline}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {currentFeature.description}
                </p>

                {/* App Store Buttons */}
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.innerspark.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                      alt="Get it on Google Play" 
                      className="h-9"
                    />
                  </a>
                  <a 
                    href="https://apps.apple.com/app/innerspark" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                      alt="Download on the App Store" 
                      className="h-9"
                    />
                  </a>
                </div>
              </div>

              {/* Right - Phone Mockup or Image */}
              <div className="relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
                
                {currentFeature.usePhoneMockup === false ? (
                  /* Direct Image Display */
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img 
                      src={currentFeature.mockup} 
                      alt={`${currentFeature.title}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full max-h-[300px] md:max-h-[340px] object-cover rounded-xl shadow-xl transition-all duration-500 hover:scale-105"
                    />
                    {/* Decorative glow */}
                    <div className={`absolute -top-3 -right-3 w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br ${currentFeature.gradient} opacity-60 blur-sm animate-pulse`} />
                  </div>
                ) : (
                  /* Phone Frame */
                  <div className="relative z-10 transform transition-all duration-500 hover:scale-105 ml-auto mr-2 md:mr-4">
                    {/* Phone outer frame */}
                    <div className="relative bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-1 md:p-1.5 shadow-xl">
                      {/* Phone notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-4 md:h-5 bg-gray-900 rounded-b-xl md:rounded-b-2xl z-20" />
                      
                      {/* Phone screen */}
                      <div className="relative w-[140px] md:w-[180px] h-[280px] md:h-[340px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white">
                        <img 
                          src={currentFeature.mockup} 
                          alt={`${currentFeature.title} app screen`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top transition-opacity duration-500"
                        />
                      </div>
                      
                      {/* Phone home indicator */}
                      <div className="absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 w-16 md:w-20 h-0.5 bg-gray-600 rounded-full" />
                    </div>

                    {/* Decorative glow */}
                    <div className={`absolute -top-3 -right-3 w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br ${currentFeature.gradient} opacity-60 blur-sm animate-pulse`} />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={goToPrevious}
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Next feature"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  changeSlide(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-150 ${
                  index === currentIndex 
                    ? `w-6 bg-gradient-to-r ${features[index].gradient}` 
                    : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          {/* Feature Quick Links */}
          <div className="mt-4 grid grid-cols-5 md:grid-cols-10 gap-1.5">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    changeSlide(index);
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all duration-150 ${
                    index === currentIndex 
                      ? `bg-gradient-to-br ${feature.gradient} text-white shadow-md scale-105` 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <FeatureIcon className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-medium text-center leading-tight hidden md:block">
                    {feature.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppFeaturesShowcase;
