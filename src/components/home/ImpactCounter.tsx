import ScrollReveal from "@/components/ScrollReveal";
import { useSiteSection } from "@/hooks/useSiteSection";

const FALLBACK = {
  is_visible: true,
  data: {
    eyebrow: "Our impact (updated monthly)",
    title: "Real lives. Real change. Across Africa.",
    items: [
      { value: "5,200+", label: "Sessions delivered" },
      { value: "8,500+", label: "People supported across Africa" },
      { value: "25+", label: "Organizations enrolled" },
    ],
  },
};

const ImpactCounter = () => {
  const { is_visible, data } = useSiteSection("impact_counter", FALLBACK);
  if (!is_visible) return null;
  const items = data.items || [];
  const colsClass = items.length >= 4 ? "md:grid-cols-4" : items.length === 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          {data.eyebrow && (
            <p className="text-xs font-semibold tracking-[0.06em] uppercase text-primary-foreground/70 mb-2 text-center">{data.eyebrow}</p>
          )}
          {data.title && (
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">{data.title}</h2>
          )}
        </ScrollReveal>
        <div className={`grid grid-cols-1 ${colsClass} gap-8 max-w-4xl mx-auto text-center`}>
          {items.map((s, i) => (
            <div key={s.label + i}>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">{s.value}</div>
              <div className="text-sm text-primary-foreground/80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactCounter;
