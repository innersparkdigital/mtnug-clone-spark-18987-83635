import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Import specialist images
import giftNakayinga from "@/assets/specialists/gift-nakayinga.jpg";
import nanzigeJannet from "@/assets/specialists/nanzige-jannet.jpg";
import mirembeNorah from "@/assets/specialists/mirembe-norah.jpg";
import pamelaKanyange from "@/assets/specialists/pamela-kanyange.jpg";
import juliusKizito from "@/assets/specialists/julius-kizito.png";
import nassuunaMargret from "@/assets/specialists/nassuuna-margret.jpg";
import winnieAnzaziJira from "@/assets/specialists/winnie-anzazi-jira.jpg";

const therapists = [
  { name: "Gift Nakayinga", image: giftNakayinga, rotation: -8 },
  { name: "Nanzige Jannet", image: nanzigeJannet, rotation: -4 },
  { name: "Mirembe Norah", image: mirembeNorah, rotation: 0 },
  { name: "Pamela Kanyange", image: pamelaKanyange, rotation: 4 },
  { name: "Julius Kizito", image: juliusKizito, rotation: 8 },
  { name: "Nassuuna Margret", image: nassuunaMargret, rotation: 12 },
  { name: "Winnie Anzazi Jira", image: winnieAnzaziJira, rotation: -12 },
];

const TherapistShowcase = () => {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6"
          >
            Your Guide to Mental Wellness
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-8"
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
