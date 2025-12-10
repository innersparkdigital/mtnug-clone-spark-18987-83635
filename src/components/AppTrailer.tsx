import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import mockup images
import appHome from "@/assets/mockups/app-home.jpeg";
import findTherapists from "@/assets/mockups/find-therapists.jpeg";
import supportGroups from "@/assets/mockups/support-groups.jpeg";
import wellnessVault from "@/assets/mockups/wellness-vault.jpeg";
import bookSession from "@/assets/mockups/book-session.jpeg";
import emergencyHelp from "@/assets/mockups/emergency-help.jpeg";
import therapyFund from "@/assets/mockups/therapy-fund.jpeg";

// Import persona images
import personHome from "@/assets/personas/person-home.png";
import personTherapist from "@/assets/personas/person-therapist.png";
import personBooking from "@/assets/personas/person-booking.png";
import personGroups from "@/assets/personas/person-groups.png";
import personPayment from "@/assets/personas/person-payment.png";
import personDonate from "@/assets/personas/person-donate.png";
import personEmergency from "@/assets/personas/person-emergency.png";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  bgColor: string;
  tooltip: string;
  persona: string;
}

const slides: Slide[] = [
  {
    image: appHome,
    title: "Innerspark Africa",
    subtitle: "Africa's Digital Wellness Hub",
    bgColor: "bg-primary",
    tooltip: "Your mental wellness journey starts here",
    persona: personHome,
  },
  {
    image: findTherapists,
    title: "Find Therapists",
    subtitle: "Connect with verified mental health professionals",
    bgColor: "bg-primary",
    tooltip: "Find and book sessions with verified therapists",
    persona: personTherapist,
  },
  {
    image: bookSession,
    title: "Book Sessions",
    subtitle: "Schedule therapy with ease",
    bgColor: "bg-primary",
    tooltip: "Schedule appointments in just a few taps",
    persona: personBooking,
  },
  {
    image: supportGroups,
    title: "Support Groups",
    subtitle: "Share and learn with like-minded communities",
    bgColor: "bg-primary",
    tooltip: "Join communities that understand you",
    persona: personGroups,
  },
  {
    image: wellnessVault,
    title: "Wellness Vault",
    subtitle: "Use MoMo or points to pay for therapy securely",
    bgColor: "bg-primary",
    tooltip: "Secure payments with Mobile Money or wellness points",
    persona: personPayment,
  },
  {
    image: therapyFund,
    title: "Therapy Fund",
    subtitle: "Donate to make therapy accessible to all",
    bgColor: "bg-primary",
    tooltip: "Help someone access mental health support",
    persona: personDonate,
  },
  {
    image: emergencyHelp,
    title: "Emergency Help",
    subtitle: "Crisis support when you need it most",
    bgColor: "bg-orange-500",
    tooltip: "24/7 crisis support at your fingertips",
    persona: personEmergency,
  },
];

const AppTrailer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 min-h-[90vh]">
      {/* Cinematic animation keyframes */}
      <style>{`
        @keyframes personaFloat {
          0%, 100% { transform: translateY(0) rotate(3deg) scale(1); }
          50% { transform: translateY(-12px) rotate(1deg) scale(1.02); }
        }
        @keyframes cinematicFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematicSlideIn {
          0% { opacity: 0; transform: translateX(-60px) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes cinematicSlideUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        @keyframes connectionPulse {
          0%, 100% { opacity: 0.3; stroke-dashoffset: 0; }
          50% { opacity: 0.8; stroke-dashoffset: 12; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.2); }
        }
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0) rotateY(0deg); }
          50% { transform: translateY(-8px) rotateY(2deg); }
        }
        @keyframes textReveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-25px) translateX(15px); opacity: 0.5; }
        }
        @keyframes screenTransition {
          0% { opacity: 0; transform: scale(1.1) rotateX(5deg); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1) rotateX(0deg); filter: brightness(1); }
        }
        .cinematic-title {
          animation: cinematicSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cinematic-subtitle {
          animation: cinematicSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .cinematic-persona {
          animation: cinematicFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards, personaFloat 4s ease-in-out 0.9s infinite;
        }
        .cinematic-phone {
          animation: phoneFloat 5s ease-in-out infinite;
        }
        .cinematic-screen {
          animation: screenTransition 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shimmer-overlay {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
      
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-out ${slides[currentSlide].bgColor}`}
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
        }}
      >
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: `${20 + i * 15}px`,
                height: `${20 + i * 15}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `particleFloat ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative glowing orbs */}
        <div 
          className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/15 blur-3xl"
          style={{ animation: 'breathe 4s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-white/10 blur-3xl"
          style={{ animation: 'breathe 5s ease-in-out infinite 1s' }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/15 blur-2xl"
          style={{ animation: 'breathe 3s ease-in-out infinite 0.5s' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-white/10 blur-2xl"
          style={{ animation: 'breathe 4.5s ease-in-out infinite 2s' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text Content with cinematic animations */}
          <div className="flex-1 text-center lg:text-left">
            <div key={currentSlide}>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 tracking-tight cinematic-title"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
              >
                {slides[currentSlide].title}
              </h2>
              <p 
                className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0 cinematic-subtitle"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
              >
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Controls with enhanced styling */}
            <div 
              className="flex items-center justify-center lg:justify-start gap-4 mb-8"
              style={{ animation: 'cinematicSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevSlide}
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/40 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/40 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextSlide}
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/40 hover:text-white hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress bar style indicators */}
            <div 
              className="flex items-center justify-center lg:justify-start gap-2"
              style={{ animation: 'cinematicSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                  style={{ width: index === currentSlide ? '48px' : '12px' }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className="absolute inset-0 bg-white/30" />
                  {index === currentSlide && (
                    <div 
                      className="absolute inset-0 bg-white origin-left"
                      style={{
                        animation: isPlaying ? 'progressFill 4s linear forwards' : 'none',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Buttons with enhanced animations */}
            <div 
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
              style={{ animation: 'cinematicSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.innersparkafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-overlay" />
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.991l-2.302 2.302-8.634-8.635z"/>
                </svg>
                <span className="relative z-10">Download App</span>
              </a>
              <a
                href="https://wa.me/256780570987?text=Hi,%20I%20want%20to%20learn%20more%20about%20Innerspark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Phone Mockup with cinematic Person animation */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative flex items-end">
              {/* Full-body Person with cinematic entrance */}
              <div
                key={`persona-${currentSlide}`}
                className="relative z-20 -mr-8 md:-mr-12 lg:-mr-16 hidden sm:block cinematic-persona"
              >
                {/* Enhanced glow effect */}
                <div 
                  className="absolute inset-0 bg-white/25 blur-3xl rounded-full"
                  style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
                />
                <img
                  src={slides[currentSlide].persona}
                  alt="App user"
                  className="relative w-44 md:w-56 lg:w-72 h-auto object-contain transform rotate-3 hover:rotate-0 transition-transform duration-700"
                  style={{
                    filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.35))',
                  }}
                />
              </div>

              {/* Enhanced connecting visual element */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:block pointer-events-none">
                <svg 
                  width="220" 
                  height="220" 
                  viewBox="0 0 220 220" 
                  className="opacity-50"
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 110 Q 110 50 190 110"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    style={{ animation: 'connectionPulse 2s ease-in-out infinite' }}
                  />
                  <circle r="5" fill="white" filter="url(#glow)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 30 110 Q 110 50 190 110" />
                  </circle>
                  <circle r="3" fill="white" opacity="0.5">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 30 110 Q 110 50 190 110" begin="0.8s" />
                  </circle>
                </svg>
              </div>

              {/* Glow connection */}
              <div 
                className="absolute left-0 top-1/3 w-40 h-40 bg-white/15 blur-3xl rounded-full hidden sm:block pointer-events-none"
                style={{ animation: 'glowPulse 4s ease-in-out infinite' }}
              />

              {/* Phone Device Container with cinematic effects */}
              <div className="relative cinematic-phone">
                {/* Tooltip with cinematic animation */}
                <div
                  key={`tooltip-${currentSlide}`}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 z-30"
                  style={{ animation: 'cinematicFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}
                >
                  <div className="bg-white/95 backdrop-blur-md text-foreground px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium max-w-[300px] text-center relative">
                    {slides[currentSlide].tooltip}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
                  </div>
                </div>

                {/* Enhanced phone shadow */}
                <div className="absolute -inset-6 bg-black/30 rounded-[3.5rem] blur-3xl transform rotate-3" />
                
                {/* Phone Device with perspective */}
                <div 
                  className="relative w-[280px] md:w-[320px] lg:w-[380px] aspect-[9/19] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-[2.8rem] p-2 shadow-2xl"
                  style={{ 
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Screen bezel highlight */}
                  <div className="absolute inset-2 rounded-[2.4rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-black rounded-[2.4rem] overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-10 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-gray-700 rounded-full" />
                      <div className="w-16 h-1 bg-gray-800 rounded-full" />
                    </div>
                    
                    {/* Screen Content with cinematic transitions */}
                    <div className="relative w-full h-full overflow-hidden">
                      {slides.map((slide, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 ${index === currentSlide ? "cinematic-screen" : ""}`}
                          style={{
                            opacity: index === currentSlide ? 1 : 0,
                            transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
                            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover object-top"
                            style={{
                              animation: index === currentSlide ? 'kenBurns 8s ease-in-out infinite' : 'none',
                            }}
                          />
                          {/* Screen shine overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 hidden lg:block">
                  <svg width="100" height="100" viewBox="0 0 100 100" className="text-white/20">
                    {[...Array(16)].map((_, i) => (
                      <circle
                        key={i}
                        cx={10 + (i % 4) * 25}
                        cy={10 + Math.floor(i / 4) * 25}
                        r="3"
                        fill="currentColor"
                        style={{
                          animation: `breathe ${2 + (i % 3)}s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills with staggered animation */}
        <div className="mt-16 lg:mt-20 flex flex-wrap justify-center gap-3">
          {["Find Therapists", "Support Groups", "Mood Tracking", "Emergency Help", "Wellness Vault"].map(
            (feature, index) => (
              <span
                key={feature}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default"
                style={{
                  animation: `cinematicSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + index * 0.1}s both`,
                }}
              >
                {feature}
              </span>
            )
          )}
        </div>
      </div>

      {/* Progress bar animation keyframe */}
      <style>{`
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default AppTrailer;
