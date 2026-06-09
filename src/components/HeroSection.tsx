import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Star, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import heroVideo1 from "@/assets/hero-videos/hero-1.mp4.asset.json";
import heroVideo2 from "@/assets/hero-videos/hero-2.mp4.asset.json";
import heroVideo3 from "@/assets/hero-videos/hero-3.mp4.asset.json";
import heroVideo4 from "@/assets/hero-videos/hero-4.mp4.asset.json";

const heroVideos = [heroVideo1.url, heroVideo2.url, heroVideo3.url, heroVideo4.url];
const SLIDE_MS = 7000;
const PRELOAD_LEAD_MS = 1500; // start fetching the next clip this long before the swap

// Skip videos only on the clearest low-power signals.
const shouldDisableVideo = () => {
  if (typeof window === "undefined") return false;
  const nav: any = navigator;
  if (nav?.connection?.saveData) return true;
  const eff = nav?.connection?.effectiveType;
  if (eff && /(^|-)2g$/i.test(eff)) return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
};

const HeroSection = () => {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showA, setShowA] = useState(true);
  const [preloadNext, setPreloadNext] = useState(false); // gate the second buffer's src
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);

  // Enable videos immediately on capable devices (no idle delay so mobile shows it too).
  useEffect(() => {
    if (shouldDisableVideo()) return;
    setVideoEnabled(true);
  }, []);

  // Rotate clips — fetch the next clip only ~1.5s before swapping (saves 1 video download upfront).
  useEffect(() => {
    if (!videoEnabled) return;
    let preloadTimer: number | undefined;
    const tick = () => {
      preloadTimer = window.setTimeout(() => setPreloadNext(true), SLIDE_MS - PRELOAD_LEAD_MS);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % heroVideos.length);
        setShowA((s) => !s);
        setPreloadNext(false);
      }, SLIDE_MS);
    };
    tick();
    const id = window.setInterval(tick, SLIDE_MS);
    const onVis = () => {
      const v = showA ? aRef.current : bRef.current;
      if (document.hidden) v?.pause();
      else v?.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      if (preloadTimer) window.clearTimeout(preloadTimer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [videoEnabled, showA]);

  const visibleSrc = heroVideos[idx];
  const nextSrc = heroVideos[(idx + 1) % heroVideos.length];
  const aSrc = showA ? visibleSrc : nextSrc;
  const bSrc = showA ? nextSrc : visibleSrc;
  // Only attach the hidden buffer's src when we're about to need it.
  const hiddenHasSrc = preloadNext;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Solid fallback so there's never a flash of broken content */}
        <div className="absolute inset-0 bg-foreground" />
        {videoEnabled && (
          <>
            <video
              ref={aRef}
              src={showA ? aSrc : (hiddenHasSrc ? aSrc : undefined)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1000ms] ease-in-out ${showA ? "opacity-100" : "opacity-0"}`}
            />
            <video
              ref={bRef}
              src={!showA ? bSrc : (hiddenHasSrc ? bSrc : undefined)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1000ms] ease-in-out ${showA ? "opacity-0" : "opacity-100"}`}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
        <div className="max-w-2xl">
          {/* Trust micro-badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1.5 mb-6"
          >
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Africa's Most Accessible Mental Wellness Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.08] tracking-tight mb-5 font-display"
          >
            Africa's Most{' '}
            <span className="text-primary">Accessible</span>{' '}
            Mental Wellness Platform
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/85 mb-4 leading-relaxed max-w-xl"
          >
            Connect with licensed African therapists via video, voice, or chat. Starting from{' '}
            <span className="font-bold text-primary-foreground">UGX 30,000 / ~$8</span> per session. Available in Uganda, Kenya, Tanzania and beyond.
          </motion.p>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8 text-primary-foreground/80 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-wellness" />
              Licensed Professionals
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-wellness" />
              100% Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-wellness" />
              Available 24/7
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/mind-check">Start with a Free Wellbeing Check</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-7 text-lg font-semibold rounded-full border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <Link to="/specialists">Browse Therapists</Link>
            </Button>
          </motion.div>

          {/* Social proof row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 text-primary-foreground/70 text-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/60 border-2 border-primary-foreground/20 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs">Trusted by 5,000+ people across Africa</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
