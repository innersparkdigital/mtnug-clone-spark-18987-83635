import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Import specialist images
import juliusKizito from "@/assets/specialists/julius-kizito.png";
import nassuunaMargret from "@/assets/specialists/nassuuna-margret.jpg";
import atwiiinePriscilla from "@/assets/specialists/atwiine-priscilla.jpg";

const therapists = [
  { name: "Atwiine Priscilla", image: atwiiinePriscilla, rotation: -6 },
  { name: "Julius Kizito", image: juliusKizito, rotation: 0 },
  { name: "Nassuuna Margret", image: nassuunaMargret, rotation: 6 },
];

const TherapistShowcase = () => {
  return (
    <section 
      className="py-20 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(210 40% 92%) 0%, hsl(210 30% 88%) 50%, hsl(210 25% 90%) 100%)'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Meet Our Therapists</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 whitespace-pre-line font-serif"
          >
            Your guide to{'\n'}mental wellness.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            Compassionate, qualified mental health professionals ready to provide
            personalized support for your journey to emotional wellbeing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/find-therapist">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Meet them all
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Therapist Cards - Overlapping Design */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center items-end gap-[-20px] relative"
        >
          <div className="flex justify-center items-end -space-x-4 md:-space-x-8 lg:-space-x-12">
            {therapists.map((therapist, index) => (
              <motion.div
                key={therapist.name}
                initial={{ opacity: 0, y: 50, rotate: therapist.rotation }}
                whileInView={{ opacity: 1, y: 0, rotate: therapist.rotation }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ 
                  y: -20, 
                  rotate: 0,
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.3 }
                }}
                className="relative group cursor-pointer"
                style={{ 
                  zIndex: index === 3 ? 10 : Math.abs(3 - index) < 2 ? 5 : 1,
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
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <Link to="/find-therapist">
            <Button 
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              Get started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TherapistShowcase;
