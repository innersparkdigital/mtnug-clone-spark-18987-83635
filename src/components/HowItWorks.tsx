import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Video, MessageCircle, Calendar, Users, Star, Play } from "lucide-react";
import videoSessionMockup from "@/assets/mockups/video-session-mockup.png";
import chatSessionMockup from "@/assets/mockups/chat-session.png";
import supportGroupsMockup from "@/assets/mockups/support-groups-mockup.png";
import appointmentMockup from "@/assets/mockups/appointment-mockup.png";

// Import persona images for the background cards
import chatConsultationImage from "@/assets/personas/chat-consultation.jpg";
import bookAppointmentImage from "@/assets/personas/book-appointment.jpg";
import supportGroupsImage from "@/assets/personas/support-groups.png";
import findTherapistImage from "@/assets/personas/find-therapist.jpg";

const tabs = [
  {
    id: "video",
    label: "Video",
    icon: Video,
    headline: "Face-to-face,\nfrom anywhere.",
    description: "Connect with your therapist through secure HD video calls. It's like being in the same room, but from the comfort of your home.",
    mockup: videoSessionMockup,
    personImage: findTherapistImage,
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    headline: "Talk it out,\none message at a time.",
    description: "Sometimes words come easier through text. Chat with a licensed counsellor who's ready to listen without judgment.",
    mockup: chatSessionMockup,
    personImage: chatConsultationImage,
  },
  {
    id: "appointment",
    label: "Appointment",
    icon: Calendar,
    headline: "Book your\nhealing time.",
    description: "Schedule sessions that fit your life. Morning, afternoon, or evening — your therapist is ready when you are.",
    mockup: appointmentMockup,
    personImage: bookAppointmentImage,
  },
  {
    id: "groups",
    label: "Support Groups",
    icon: Users,
    headline: "Heal together,\ngrow together.",
    description: "Join others who understand your journey. Share, listen, and find strength in community support.",
    mockup: supportGroupsMockup,
    personImage: supportGroupsImage,
  },
];

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { translateBatch, language } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["50px", "0px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Auto-cycle through tabs
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTab = tabs[activeTab];

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, hsl(200 40% 92%) 0%, hsl(200 30% 88%) 50%, hsl(180 25% 90%) 100%)'
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex-1 flex items-center relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-12 lg:py-0">
          
          {/* Left Content */}
          <motion.div 
            className="order-2 lg:order-1 text-center lg:text-left"
            style={{ y: textY, opacity }}
          >
            {/* Section Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-6"
            >
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">A virtual consultation that feels less virtual</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 whitespace-pre-line font-serif">
                  {currentTab.headline}
                </h2>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                  {currentTab.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <a href="https://play.google.com/store/apps/details?id=com.innerspark.app" target="_blank" rel="noopener noreferrer">
                      Start healing today
                    </a>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold rounded-full border-2 hover:bg-white/50 transition-all duration-300"
                    asChild
                  >
                    <a href="/find-therapist">
                      Find a therapist
                    </a>
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-medium text-foreground">Rated</span>
                  <span className="text-sm font-bold text-primary">4.8/5</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">by users</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right - Phone Mockup with Layered Card */}
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
                {/* Large Card with Human Image */}
                <div className="absolute -left-32 sm:-left-40 md:-left-52 lg:-left-64 top-1/2 -translate-y-1/2 w-52 sm:w-64 md:w-80 lg:w-96 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 z-0 bg-white">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`person-${currentTab.id}`}
                      src={currentTab.personImage}
                      alt=""
                      className="w-full h-auto object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  </AnimatePresence>
                </div>

                {/* Main Phone Frame */}
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-[1.02]">
                  <div className="relative bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl">
                    {/* Phone notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 md:w-28 h-6 md:h-7 bg-gray-900 rounded-b-2xl z-20" />
                    
                    {/* Phone screen */}
                    <div className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[400px] sm:h-[480px] md:h-[560px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentTab.id}
                          src={currentTab.mockup}
                          alt={currentTab.label}
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

                {/* Floating Element with Icon */}
                <div className="absolute -right-4 md:-right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <currentTab.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-foreground">{currentTab.label}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          {tabs.map((tab, index) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveTab(index);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  index === activeTab 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                aria-label={`View ${tab.label}`}
              >
                <TabIcon className="w-4 h-4" />
                <span className={`text-sm font-medium ${index === activeTab ? 'block' : 'hidden md:block'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;