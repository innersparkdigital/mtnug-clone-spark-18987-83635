import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Video, MessageCircle, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import videoSessionMockup from "@/assets/mockups/video-session-mockup.png";
import chatSessionMockup from "@/assets/mockups/chat-session-new.png";
import supportGroupsMockup from "@/assets/mockups/support-groups-new.png";
import appointmentMockup from "@/assets/mockups/find-therapists-new.png";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { translateBatch, language } = useLanguage();
  const [translations, setTranslations] = useState({
    getItOn: "GET IT ON",
    googlePlay: "Google Play",
    downloadOn: "Download on the",
    appStore: "App Store",
  });

  useEffect(() => {
    if (language === "en") {
      setTranslations({
        getItOn: "GET IT ON",
        googlePlay: "Google Play",
        downloadOn: "Download on the",
        appStore: "App Store",
      });
      return;
    }
    translateBatch([
      "GET IT ON",
      "Google Play",
      "Download on the",
      "App Store",
    ]).then((results) => {
      setTranslations({
        getItOn: results[0],
        googlePlay: results[1],
        downloadOn: results[2],
        appStore: results[3],
      });
    });
  }, [language, translateBatch]);

  const tabs = [
    {
      label: "Video",
      icon: Video,
      headline: "Professional care,\nface to face.",
      image: videoSessionMockup,
      alt: "InnerSpark App - Video Therapy",
      steps: [
        {
          title: "Download the InnerSpark App",
          description: "Get started by downloading our app from Google Play or the App Store. Create your profile in minutes."
        },
        {
          title: "Choose Your Therapist",
          description: "Browse our network of licensed therapists. Filter by specialty, price, and availability to find your perfect match."
        },
        {
          title: "Book & Start Your Session",
          description: "Schedule a session at your convenience. Connect via video call and begin your healing journey from anywhere."
        }
      ]
    },
    {
      label: "Chat",
      icon: MessageCircle,
      headline: "Support that's\nalways there.",
      image: chatSessionMockup,
      alt: "InnerSpark App - Chat with Therapist",
      steps: [
        {
          title: "Start a Conversation with a Therapist",
          description: "Share your mental health concerns with our licensed counsellors. Get instant support and guidance anytime you need it."
        },
        {
          title: "Choose Your Path",
          description: "Select from recommended options and choose \"Chat with Therapist/Counsellor\" for personalized mental health advice from real professionals."
        },
        {
          title: "Connect with a Therapist",
          description: "Complete your payment if you're not a premium member, and get placed in the queue for our therapists to assist you."
        }
      ]
    },
    {
      label: "Appointment",
      icon: Calendar,
      headline: "Your time,\nyour schedule.",
      image: appointmentMockup,
      alt: "InnerSpark App - Book Appointment",
      steps: [
        {
          title: "Browse Available Slots",
          description: "View your therapist's calendar and find a time that works best for your schedule."
        },
        {
          title: "Select Your Preferred Time",
          description: "Choose from morning, afternoon, or evening sessions. Pick what fits your lifestyle."
        },
        {
          title: "Confirm & Get Reminders",
          description: "Receive confirmation and helpful reminders before your appointment so you never miss a session."
        }
      ]
    },
    {
      label: "Support Groups",
      icon: Users,
      headline: "Healing together,\ngrowing stronger.",
      image: supportGroupsMockup,
      alt: "InnerSpark App - Support Groups",
      steps: [
        {
          title: "Explore Support Groups",
          description: "Discover groups tailored to your needs - anxiety, depression, grief, and more."
        },
        {
          title: "Join a Community",
          description: "Connect with others who understand your journey. Share experiences in a safe, moderated space."
        },
        {
          title: "Attend Group Sessions",
          description: "Participate in live group therapy sessions led by professional facilitators."
        }
      ]
    }
  ];

  const currentTab = tabs[activeTab];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, tabs.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  return (
    <section 
      className="min-h-screen flex flex-col justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, hsl(210 40% 92%) 0%, hsl(210 30% 88%) 50%, hsl(210 25% 90%) 100%)'
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
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 whitespace-pre-line font-serif">
                  {currentTab.headline}
                </h2>
                
                {/* How it works label */}
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">How it works</p>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  {currentTab.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                        <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* App Store Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.innerspark.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-lg hover:bg-foreground/90 transition-colors group"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] opacity-80">{translations.getItOn}</div>
                      <div className="font-semibold text-sm">{translations.googlePlay}</div>
                    </div>
                  </a>
                  
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-lg hover:bg-foreground/90 transition-colors group"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] opacity-80">{translations.downloadOn}</div>
                      <div className="font-semibold text-sm">{translations.appStore}</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Phone Mockup */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                {/* Main Phone Frame */}
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-[1.02]">
                  <div className="relative bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl">
                    {/* Phone notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 md:w-28 h-6 md:h-7 bg-gray-900 rounded-b-2xl z-20" />
                    
                    {/* Phone screen */}
                    <div className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[400px] sm:h-[480px] md:h-[560px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeTab}
                          src={currentTab.image}
                          alt={currentTab.alt}
                          className="w-full h-full object-contain object-top bg-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      </AnimatePresence>
                    </div>
                    
                    {/* Phone home indicator */}
                    <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>

                {/* Floating Label */}
                <div className="absolute -right-4 md:-right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <currentTab.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-foreground">{currentTab.label}</span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
        aria-label="Previous step"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all hover:scale-110 z-20"
        aria-label="Next step"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Tab Icons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          {tabs.map((tab, index) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveTab(index);
                }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index === activeTab 
                    ? 'bg-primary text-primary-foreground scale-110 shadow-md' 
                    : 'bg-transparent text-muted-foreground hover:bg-muted'
                }`}
                aria-label={`Go to ${tab.label}`}
              >
                <TabIcon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
