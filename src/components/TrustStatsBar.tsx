import { Shield, Users, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "5,000+", label: "Sessions Delivered" },
  { icon: Shield, value: "20+", label: "Licensed Therapists" },
  { icon: MapPin, value: "3", label: "African Countries" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const TrustStatsBar = () => {
  return (
    <section className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 justify-center"
            >
              <stat.icon className="w-6 h-6 text-primary-foreground/80 flex-shrink-0" />
              <div>
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-primary-foreground/70">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStatsBar;
