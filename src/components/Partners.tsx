import { T } from "@/components/Translate";
import ScrollReveal, { StaggerContainer, StaggerItem, Parallax, FadeOnScroll } from "@/components/ScrollReveal";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import nationalIctHub from "@/assets/partners/national-ict-hub.png";
import awsLogo from "@/assets/partners/aws.png";

const partners = [
  { name: "National ICT Innovation Hub", logo: nationalIctHub },
  { name: "Amazon Web Services", logo: awsLogo },
];

const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothBgY = useSpring(bgY, { stiffness: 100, damping: 30 });

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Parallax background decoration */}
      <motion.div
        style={{ y: smoothBgY }}
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-3xl"
      />
      <motion.div
        style={{ y: smoothBgY }}
        className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal distance={60} duration={0.8}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              <T>Our Partners</T>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <T>We collaborate with leading organizations to bring you the best mental health support</T>
            </p>
          </div>
        </ScrollReveal>
        
        <StaggerContainer className="flex flex-wrap justify-center items-center gap-12 md:gap-16" staggerDelay={0.15}>
          {partners.map((partner, index) => (
            <StaggerItem key={partner.name} scale>
              <motion.div 
                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Partners;
