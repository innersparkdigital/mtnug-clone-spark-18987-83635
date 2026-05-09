import { Globe, Languages, Smartphone, ClipboardCheck, Heart } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const reasons = [
  { icon: Globe, title: "Africa-first therapists", desc: "Licensed professionals trained in African contexts and cultural realities." },
  { icon: Languages, title: "Local language sessions", desc: "Talk in Luganda, Swahili, English, French and more — your language, your healing." },
  { icon: Smartphone, title: "Mobile Money payments", desc: "Pay easily with MTN MoMo, Airtel Money, card or bank transfer." },
  { icon: ClipboardCheck, title: "WHO-5 screening tools", desc: "Free, validated mental wellbeing checks to guide your next step." },
  { icon: Heart, title: "Culturally grounded care", desc: "Therapy that respects faith, family and community — not imported templates." },
];

const WhyInnerSpark = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-primary mb-3">Why InnerSpark</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Built for Africa, by Africans</h2>
          <p className="text-muted-foreground leading-relaxed">We're not a global app translated into Swahili. We're a homegrown platform built around how Africans actually live, pay and heal.</p>
        </div>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reasons.map((r) => (
          <div key={r.title} className="bg-background border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <r.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyInnerSpark;