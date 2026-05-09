import { ClipboardCheck, UserCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  { icon: ClipboardCheck, title: "Take the free WHO-5 check", desc: "A 1-minute wellbeing screening to understand where you are today." },
  { icon: UserCheck, title: "Get matched to a therapist", desc: "We recommend the right licensed therapist for your needs and language." },
  { icon: Video, title: "Start your session today", desc: "Connect by video, voice or chat — from your phone, anywhere in Africa." },
];

const HowItWorksSimple = () => (
  <section className="py-20 bg-surface">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-primary mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Three steps to feeling better</h2>
        </div>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.title} className="relative bg-background border border-border rounded-2xl p-6 text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{i + 1}</div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mt-2 mb-4">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/mind-check">Start the free check</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default HowItWorksSimple;