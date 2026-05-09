import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "5,200+", label: "Sessions delivered" },
  { value: "8,500+", label: "People supported across Africa" },
  { value: "25+", label: "Organizations enrolled" },
];

const ImpactCounter = () => (
  <section className="py-16 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <p className="text-xs font-semibold tracking-[0.06em] uppercase text-primary-foreground/70 mb-2 text-center">Our impact (updated monthly)</p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">Real lives. Real change. Across Africa.</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-4xl md:text-5xl font-display font-bold mb-2">{s.value}</div>
            <div className="text-sm text-primary-foreground/80">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactCounter;