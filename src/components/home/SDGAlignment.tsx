import { HeartPulse, Users, Briefcase, Scale } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const sdgs = [
  { icon: HeartPulse, num: "SDG 3", title: "Good Health & Wellbeing", desc: "Expanding access to quality mental health care." },
  { icon: Users, num: "SDG 5", title: "Gender Equality", desc: "Safe, gender-sensitive support for women and girls." },
  { icon: Briefcase, num: "SDG 8", title: "Decent Work", desc: "Healthier workplaces through corporate wellness." },
  { icon: Scale, num: "SDG 10", title: "Reduced Inequalities", desc: "Affordable therapy regardless of income or location." },
];

const SDGAlignment = () => (
  <section className="py-16 bg-background border-y border-border">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-green-wellness mb-2">Aligned with the UN SDGs</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Mental wellness is sustainable development</h2>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {sdgs.map((s) => (
          <div key={s.num} className="text-center p-5 rounded-2xl border border-border bg-surface">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-wellness/10 flex items-center justify-center mb-3">
              <s.icon className="w-5 h-5 text-green-wellness" />
            </div>
            <div className="text-xs font-semibold text-green-wellness mb-1">{s.num}</div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SDGAlignment;