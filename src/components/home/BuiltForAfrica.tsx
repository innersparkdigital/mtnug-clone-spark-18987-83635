import { Smartphone, MessageCircle, Wifi, Languages, Users } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { icon: Smartphone, title: "Mobile Money", desc: "Pay seamlessly with MTN MoMo & Airtel Money." },
  { icon: MessageCircle, title: "WhatsApp booking", desc: "Book or get help over WhatsApp." },
  { icon: Wifi, title: "Low-bandwidth ready", desc: "Optimised app that works on slow, mobile networks." },
  { icon: Languages, title: "Multilingual therapists", desc: "Sessions in Luganda, Swahili, English, French and more." },
  { icon: Users, title: "Culturally trained pros", desc: "Therapists who understand African families & faith." },
];

const BuiltForAfrica = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-green-wellness mb-3">Built for Africa</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Designed around how Africans actually live</h2>
          <p className="text-muted-foreground">From Mobile Money to WhatsApp, every detail is built for the realities of Uganda, Kenya, Tanzania and beyond.</p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="text-center p-5 rounded-2xl bg-muted border border-border">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-wellness/10 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-green-wellness" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BuiltForAfrica;