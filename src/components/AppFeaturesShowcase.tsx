import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Smile, MessageCircle, Video, Users, Calendar, AlertTriangle, Search, Heart, Sparkles, Download } from "lucide-react";

// Import mockup images
import appHomeMockup from "@/assets/mockups/app-home.jpeg";
import findTherapistsMockup from "@/assets/mockups/find-therapists.jpeg";
import chatSessionMockup from "@/assets/mockups/chat-session.png";
import supportGroupsMockup from "@/assets/mockups/support-groups.jpeg";
import bookSessionMockup from "@/assets/mockups/book-session.jpeg";
import emergencyHelpMockup from "@/assets/mockups/emergency-help.jpeg";
import therapyFundMockup from "@/assets/mockups/therapy-fund.jpeg";
import wellnessVaultMockup from "@/assets/mockups/wellness-vault.jpeg";
import videoSessionMockup from "@/assets/mockups/video-session-mockup.png";
import appointmentMockup from "@/assets/mockups/appointment-mockup.png";

// Import persona images
import personHome from "@/assets/personas/person-home.png";
import personTherapist from "@/assets/personas/person-therapist.png";
import personGroups from "@/assets/personas/person-groups.png";
import personBooking from "@/assets/personas/person-booking.png";
import personEmergency from "@/assets/personas/person-emergency.png";
import personDonate from "@/assets/personas/person-donate.png";
import personPayment from "@/assets/personas/person-payment.png";

const features = [
  {
    id: 1,
    title: "Mood Tracker",
    tagline: "Your feelings deserve to be seen.",
    description: "Some days you're okay, some days you're not. Healing starts with understanding yourself. Track your mood with simple emojis and gently learn what your heart has been trying to tell you.",
    icon: Smile,
    gradient: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    mockup: appHomeMockup,
    persona: personHome
  },
  {
    id: 2,
    title: "Daily Reflection",
    tagline: "Your story matters, even on quiet days.",
    description: "Celebrate small wins. Write about how your day felt. Acknowledge the hard moments. Every week, see your growth in a gentle wellness report.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    mockup: wellnessVaultMockup,
    persona: personHome
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
    persona: personTherapist
  },
  {
    id: 4,
    title: "Private Counselling",
    tagline: "Your healing is personal and completely confidential.",
    description: "Whether it's work stress, trauma, heartbreak, or emotional pain... Talk to a licensed therapist who gives you a safe space to breathe, feel, and find your strength again.",
    icon: Video,
    gradient: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    mockup: videoSessionMockup,
    persona: personPayment
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
    persona: personTherapist
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
    persona: personGroups
  },
  {
    id: 7,
    title: "Book Appointment",
    tagline: "Invest in your peace.",
    description: "Book a virtual session for as low as 50,000 UGX. Give yourself the gift of talking to someone who supports your mental and emotional wellbeing.",
    icon: Calendar,
    gradient: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    mockup: bookSessionMockup,
    persona: personBooking
  },
  {
    id: 8,
    title: "Emergency Button",
    tagline: "Your life matters. Reach out — Now.",
    description: "When you feel unsafe or overwhelmed... Press the emergency button and immediately talk to a crisis counsellor who genuinely cares.",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    mockup: emergencyHelpMockup,
    persona: personEmergency
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
    persona: personDonate
  },
  {
    id: 10,
    title: "Download App",
    tagline: "Your safe space is waiting.",
    description: "Create your account and open the door to real mental health support — anytime you need it.",
    icon: Download,
    gradient: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    mockup: appointmentMockup,
    persona: personHome
  }
];

const AppFeaturesShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const currentFeature = features[currentIndex];
  const Icon = currentFeature.icon;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            App Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Mental Wellness</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your complete digital companion for mental health support, available 24/7 on the Innerspark App
          </p>
        </div>

        {/* Feature Showcase */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Feature Card */}
          <div 
            className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${currentFeature.bgColor}`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="grid md:grid-cols-2 gap-0 min-h-[500px] md:min-h-[550px]">
              {/* Left Content */}
              <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${currentFeature.gradient} text-white shadow-lg mb-5`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 transition-all duration-300">
                  {currentFeature.title}
                </h3>
                
                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${currentFeature.gradient} text-white text-base md:text-lg font-medium mb-5 max-w-fit`}>
                  {currentFeature.tagline}
                </div>
                
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                  {currentFeature.description}
                </p>

                {/* App Store Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.innerspark.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                      alt="Get it on Google Play" 
                      className="h-11"
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
                      className="h-11"
                    />
                  </a>
                </div>
              </div>

              {/* Right - Phone Mockup with Persona */}
              <div className="relative flex items-end justify-center p-6 md:p-8 overflow-hidden">
                {/* Persona Background Image */}
                <div className="absolute inset-0 flex items-end justify-start">
                  <img 
                    src={currentFeature.persona} 
                    alt="Person using Innerspark app"
                    className="h-[85%] md:h-[90%] object-contain object-bottom opacity-90 transition-all duration-500"
                  />
                </div>
                
                {/* Gradient Overlay for depth */}
                <div className={`absolute inset-0 bg-gradient-to-l ${currentFeature.gradient} opacity-10`} />
                
                {/* Phone Frame positioned to right */}
                <div className="relative z-10 transform transition-all duration-500 hover:scale-105 ml-auto mr-4 md:mr-8">
                  {/* Phone outer frame */}
                  <div className="relative bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-7 bg-gray-900 rounded-b-2xl md:rounded-b-3xl z-20" />
                    
                    {/* Phone screen */}
                    <div className="relative w-[160px] md:w-[220px] h-[340px] md:h-[460px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white">
                      <img 
                        src={currentFeature.mockup} 
                        alt={`${currentFeature.title} app screen`}
                        className="w-full h-full object-cover object-top transition-opacity duration-500"
                      />
                    </div>
                    
                    {/* Phone home indicator */}
                    <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-28 h-1 bg-gray-600 rounded-full" />
                  </div>

                  {/* Decorative glow */}
                  <div className={`absolute -top-4 -right-4 w-12 md:w-16 h-12 md:h-16 rounded-full bg-gradient-to-br ${currentFeature.gradient} opacity-60 blur-sm animate-pulse`} />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
              aria-label="Next feature"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? `w-8 bg-gradient-to-r ${features[index].gradient}` 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          {/* Feature Quick Links */}
          <div className="mt-8 grid grid-cols-5 md:grid-cols-10 gap-2">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                    index === currentIndex 
                      ? `bg-gradient-to-br ${feature.gradient} text-white shadow-lg scale-105` 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <FeatureIcon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium text-center leading-tight hidden md:block">
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
