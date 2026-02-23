import { useState } from "react";
import { Button } from "@/components/ui/button";
// Note: yellow-400 used for star ratings is intentional (universal rating color)
import { Link } from "react-router-dom";
import { Shield, Clock, Star, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import PreAssessmentModal from "./PreAssessmentModal";
import BookingFormModal from "./BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import heroImage from "@/assets/hero-slide-1.jpg";

const HeroSection = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const {
    startBooking,
    closeFlow,
    goToForm,
    resetFlow,
    isAssessmentModalOpen,
    isBookingFormOpen,
    actionType
  } = useBookingFlow();

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Therapy session" className={`w-full h-full object-cover object-top transition-opacity duration-100 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} loading="eager" fetchPriority="high" decoding="sync" onLoad={() => setHeroLoaded(true)} />
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
            <span className="text-sm font-medium text-primary-foreground">Uganda's #1 Online Therapy Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.08] tracking-tight mb-5 font-serif"
          >
            Talk to a Licensed{' '}
            <span className="text-primary">Therapist</span>{' '}
            Today
          </motion.h1>

          {/* Sub-headline with pricing */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/85 mb-4 leading-relaxed max-w-xl"
          >
            Affordable, confidential therapy from certified professionals — 
            via video, voice, or chat. Sessions start at{' '}
            <span className="font-bold text-primary-foreground">UGX 30,000</span>.
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={startBooking}
            >
              Book a Therapist Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-7 text-lg font-semibold rounded-full border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
              asChild
            >
              <a
                href="https://wa.me/256792085773?text=Hi,%20I%20would%20like%20to%20book%20a%20free%20consultation%20with%20Innerspark%20Africa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Free Consultation
              </a>
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

      {/* Pre-Assessment Modal */}
      <PreAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={closeFlow}
        actionType={actionType}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={resetFlow}
        formType={actionType}
      />
    </section>
  );
};

export default HeroSection;
