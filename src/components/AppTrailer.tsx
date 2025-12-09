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

// Import team avatars
import hellenAvatar from "@/assets/hellen-aturo.jpg";
import jamesAvatar from "@/assets/james-niwamanya.jpg";
import reaganAvatar from "@/assets/mutebi-reagan.jpg";
import raymondAvatar from "@/assets/talemwa-raymond.jpg";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  bgColor: string;
  tooltip: string;
  avatar: string;
  avatarName: string;
  avatarRole: string;
}

const slides: Slide[] = [
  {
    image: appHome,
    title: "Innerspark Africa",
    subtitle: "Africa's Digital Wellness Hub",
    bgColor: "bg-primary",
    tooltip: "Your mental wellness journey starts here",
    avatar: hellenAvatar,
    avatarName: "Hellen",
    avatarRole: "Founder",
  },
  {
    image: findTherapists,
    title: "Find Therapists",
    subtitle: "Connect with verified mental health professionals",
    bgColor: "bg-primary",
    tooltip: "Find and book sessions with verified therapists",
    avatar: jamesAvatar,
    avatarName: "James",
    avatarRole: "Therapist",
  },
  {
    image: bookSession,
    title: "Book Sessions",
    subtitle: "Schedule therapy with ease",
    bgColor: "bg-primary",
    tooltip: "Schedule appointments in just a few taps",
    avatar: reaganAvatar,
    avatarName: "Reagan",
    avatarRole: "User",
  },
  {
    image: supportGroups,
    title: "Support Groups",
    subtitle: "Share and learn with like-minded communities",
    bgColor: "bg-primary",
    tooltip: "Join communities that understand you",
    avatar: raymondAvatar,
    avatarName: "Raymond",
    avatarRole: "Member",
  },
  {
    image: wellnessVault,
    title: "Wellness Vault",
    subtitle: "Use MoMo or points to pay for therapy securely",
    bgColor: "bg-primary",
    tooltip: "Secure payments with Mobile Money or wellness points",
    avatar: hellenAvatar,
    avatarName: "Hellen",
    avatarRole: "Guide",
  },
  {
    image: therapyFund,
    title: "Therapy Fund",
    subtitle: "Donate to make therapy accessible to all",
    bgColor: "bg-primary",
    tooltip: "Help someone access mental health support",
    avatar: jamesAvatar,
    avatarName: "James",
    avatarRole: "Advocate",
  },
  {
    image: emergencyHelp,
    title: "Emergency Help",
    subtitle: "Crisis support when you need it most",
    bgColor: "bg-orange-500",
    tooltip: "24/7 crisis support at your fingertips",
    avatar: reaganAvatar,
    avatarName: "Reagan",
    avatarRole: "Support",
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
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background with animated gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${slides[currentSlide].bgColor}`}
      >
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/10 blur-2xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div
              key={currentSlide}
              className="animate-fade-in"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevSlide}
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
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
                className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <a
                href="https://play.google.com/store/apps/details?id=com.innersparkafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.991l-2.302 2.302-8.634-8.635z"/>
                </svg>
                Download App
              </a>
              <a
                href="https://wa.me/256780570987?text=Hi,%20I%20want%20to%20learn%20more%20about%20Innerspark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Avatar leaning on phone - positioned to the left */}
              <div
                key={`avatar-${currentSlide}`}
                className="absolute -left-16 md:-left-20 lg:-left-24 top-1/3 z-30 animate-fade-in hidden sm:block"
              >
                <div className="relative">
                  {/* Avatar image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <img
                      src={slides[currentSlide].avatar}
                      alt={slides[currentSlide].avatarName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Name badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg">
                    <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                      {slides[currentSlide].avatarName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tooltip Speech Bubble - now connected to avatar */}
              <div
                key={`tooltip-${currentSlide}`}
                className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in"
              >
                <div className="bg-white text-foreground px-4 py-2 rounded-xl shadow-lg text-sm font-medium max-w-[280px] text-center relative">
                  {slides[currentSlide].tooltip}
                  {/* Speech bubble arrow pointing down */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                </div>
              </div>

              {/* Phone Frame Shadow */}
              <div className="absolute -inset-4 bg-black/20 rounded-[3rem] blur-2xl transform rotate-3" />
              
              {/* Phone Device */}
              <div className="relative w-[280px] md:w-[320px] lg:w-[360px] aspect-[9/19] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                  </div>
                  
                  {/* Screen Content */}
                  <div className="relative w-full h-full overflow-hidden">
                    {slides.map((slide, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-600 ease-out ${
                          index === currentSlide
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute -bottom-8 -right-8 hidden lg:block">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-white/30">
                  {[...Array(9)].map((_, i) => (
                    <circle
                      key={i}
                      cx={10 + (i % 3) * 25}
                      cy={10 + Math.floor(i / 3) * 25}
                      r="4"
                      fill="currentColor"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 lg:mt-16 flex flex-wrap justify-center gap-3">
          {["Find Therapists", "Support Groups", "Mood Tracking", "Emergency Help", "Wellness Vault"].map(
            (feature) => (
              <span
                key={feature}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
              >
                {feature}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default AppTrailer;
