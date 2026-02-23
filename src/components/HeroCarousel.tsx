import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Your kindness saves someone tomorrow",
    subtitle: "Donate therapy sessions to those who cannot afford mental health support.",
    cta: "Donate Now",
    link: "/donate-therapy"
  },
  {
    image: heroSlide2,
    title: "The right help is closer than you think",
    subtitle: "Connect with licensed therapists from anywhere, anytime. Affordable, accessible, stigma-free support.",
    cta: "Find a Therapist",
    link: "/find-therapist"
  },
  {
    image: heroSlide3,
    title: "Your feelings are understood",
    subtitle: "Our compassionate specialists are trained to listen without judgment.",
    cta: "Talk to Someone",
    link: "/specialists"
  },
  {
    image: heroSlide1,
    title: "Your healing is completely confidential",
    subtitle: "Private, secure sessions with trusted professionals who respect your privacy.",
    cta: "Book a Session",
    link: "/virtual-therapy"
  },
  {
    image: heroSlide2,
    title: "Your life matters. Reach out to us now",
    subtitle: "You are not alone. We are here to support you through every step of your journey.",
    cta: "Get Help Now",
    link: "/emergency-support"
  },
  {
    image: heroSlide3,
    title: "Your story is worth celebrating",
    subtitle: "Every step forward is a victory. We're here to celebrate your progress with you.",
    cta: "Start Your Journey",
    link: "/services"
  },
  {
    image: heroSlide1,
    title: "Someone is ready to listen 24/7",
    subtitle: "Round-the-clock support whenever you need someone to talk to.",
    cta: "Chat Now",
    link: "/contact"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-secondary">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-left duration-700">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-in fade-in slide-in-from-left duration-700 delay-100">
                  {slide.subtitle}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg rounded-full animate-in fade-in slide-in-from-left duration-700 delay-200"
                >
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
