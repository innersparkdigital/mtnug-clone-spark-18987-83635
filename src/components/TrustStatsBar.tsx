import { Globe, Languages, Clock, Shield, Users, Heart, Star, Award, TrendingUp, CheckCircle, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSection } from "@/hooks/useSiteSection";

const ICONS: Record<string, LucideIcon> = { Globe, Languages, Clock, Shield, Users, Heart, Star, Award, TrendingUp, CheckCircle };

const FALLBACK = {
  is_visible: true,
  data: {
    items: [
      { icon: "Globe", value: "5+", label: "Countries served" },
      { icon: "Languages", value: "8+", label: "African languages" },
      { icon: "Clock", value: "24/7", label: "Always available" },
      { icon: "Shield", value: "100%", label: "Confidential" },
    ],
  },
};

const TrustStatsBar = () => {
  const { is_visible, data } = useSiteSection("trust_stats_bar", FALLBACK);
  if (!is_visible) return null;
  const items = data.items || [];

  return (
    <section className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-2 ${items.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-" + items.length} gap-6 md:gap-8`}>
          {items.map((stat, index) => {
            const Icon = ICONS[stat.icon || "Star"] || Star;
            return (
              <motion.div
                key={stat.label + index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 justify-center"
              >
                <Icon className="w-6 h-6 text-primary-foreground/80 flex-shrink-0" />
                <div>
                  <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/70">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStatsBar;
