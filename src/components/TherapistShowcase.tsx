import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import ScrollReveal, { Parallax, ScaleOnScroll } from "@/components/ScrollReveal";

// Import specialist images
import juliusKizito from "@/assets/specialists/julius-kizito.png";
import nassuunaMargret from "@/assets/specialists/nassuuna-margret.jpg";
import atwiiinePriscilla from "@/assets/specialists/atwiine-priscilla.jpg";
import mbabaziJovia from "@/assets/specialists/mbabazi-jovia.jpg";
import zemeyiRita from "@/assets/specialists/zemeyi-rita.jpg";
import florenceNakaweesa from "@/assets/specialists/florence-winfred-nakaweesa.jpg";
import winnieAnzaziJira from "@/assets/specialists/winnie-anzazi-jira.jpg";

const therapists = [
  { name: "Mbabazi Jovia", image: mbabaziJovia, rotation: -15 },
  { name: "Atwiine Priscilla", image: atwiiinePriscilla, rotation: -10 },
  { name: "Zemeyi Rita", image: zemeyiRita, rotation: -5 },
  { name: "Julius Kizito", image: juliusKizito, rotation: 0 },
  { name: "Nassuuna Margret", image: nassuunaMargret, rotation: 5 },
  { name: "Florence Winfred", image: florenceNakaweesa, rotation: 10 },
  { name: "Winnie Anzazi Jira", image: winnieAnzaziJira, rotation: 15 },
];

const TherapistShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth parallax for decorative elements
  const decorY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const smoothDecorY = useSpring(decorY, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, hsl(210 40% 92%) 0%, hsl(210 30% 88%) 50%, hsl(210 25% 90%) 100%)'
      }}
    >
      {/* Floating decorative elements with parallax */}
      <motion.div
        style={{ y: smoothDecorY }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: smoothDecorY }}
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal delay={0.1}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Meet Our Therapists</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} distance={80}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 whitespace-pre-line font-serif">
              Your guide to{'\n'}mental wellness.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3} blur>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              Compassionate, qualified mental health professionals ready to provide
              personalized support for your journey to emotional wellbeing.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} scale>
            <Link to="/find-therapist">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Meet them all
              </Button>
            </Link>
          </ScrollReveal>
        </div>

        {/* Therapist Cards - Overlapping Design with enhanced animations */}
        <ScaleOnScroll scaleFrom={0.85} scaleTo={1}>
          <div className="flex justify-center items-end -space-x-4 md:-space-x-8 lg:-space-x-12">
            {therapists.map((therapist, index) => (
              <motion.div
                key={therapist.name}
                initial={{ opacity: 0, y: 80, rotate: therapist.rotation }}
                whileInView={{ opacity: 1, y: 0, rotate: therapist.rotation }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15 * index,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                whileHover={{ 
                  y: -20, 
                  rotate: 0,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.3 }
                }}
                className="relative group cursor-pointer"
                style={{ 
                  zIndex: index === 1 ? 10 : Math.abs(1 - index) < 2 ? 5 : 1,
                  transform: `rotate(${therapist.rotation}deg)`
                }}
              >
                <div 
                  className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-52 lg:h-72 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                  style={{ 
                    backgroundColor: 'hsl(35 50% 90%)',
                  }}
                >
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Name tooltip on hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground bg-background/90 px-3 py-1 rounded-full shadow-sm">
                    {therapist.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScaleOnScroll>

        {/* CTA Button */}
        <ScrollReveal delay={0.5} scale>
          <div className="text-center mt-20">
            <Link to="/find-therapist">
              <Button 
                size="lg"
                className="rounded-full px-10 py-6 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                Get started
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TherapistShowcase;
