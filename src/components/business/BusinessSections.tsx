import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { autoSubscribeNewsletter } from "@/lib/autoSubscribe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pause, MessageSquare, RefreshCw, Sparkles, Shield, FileLock2, Building2, Users2, FileSignature, CalendarCheck, ClipboardCheck, Headphones } from "lucide-react";

export const PricingTable = () => {
  const tiers = [
    { name: "Screening only", price: "UGX 5,000", usd: "~$1.40", unit: "per employee · one-time", features: ["WHO-5 + workplace screening", "Aggregate company report", "Confidential individual results"] },
    { name: "S.P.A.R.K Training", price: "UGX 650,000", usd: "~$175", unit: "per session", features: ["On-site or virtual workshop", "Manager toolkit", "Up to 30 participants"] },
    { name: "Basic Digital Access", price: "UGX 150,000–250,000", usd: "~$40–68", unit: "per employee / year", features: ["App + self-care library", "Mind-Check unlimited", "Email support"] },
    { name: "Standard Support", price: "UGX 400,000–650,000", usd: "~$110–175", unit: "per employee / year", features: ["Everything in Basic", "4 therapy sessions / yr", "Quarterly screening"], popular: true },
    { name: "Full Premium", price: "UGX 700,000–1,000,000", usd: "~$190–270", unit: "per employee / year", features: ["Unlimited therapy", "Crisis hotline", "Dedicated wellness manager"] },
    { name: "Custom (200+ employees)", price: "Contact us", usd: "Volume pricing", unit: "tailored package", features: ["Custom SLAs", "On-site days", "ESG reporting"] },
  ];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Transparent pricing for every team size</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Per-employee, per-year. No hidden fees. UGX prices shown with USD equivalents.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative ${tier.popular ? "border-primary border-2 shadow-lg" : "border-border"}`}>
              {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>}
              <CardContent className="pt-6 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <div>
                  <p className="text-2xl font-bold text-primary">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.usd} · {tier.unit}</p>
                </div>
                <ul className="space-y-1.5 pt-2 border-t border-border">
                  {tier.features.map((f) => (<li key={f} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">✓</span>{f}</li>))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ROICalculator = () => {
  const [employees, setEmployees] = useState(50);
  // ILO 2022: ~31 productive days lost per employee per year due to mental health.
  // Assume avg daily wage UGX 35,000 (Kampala professional services baseline).
  const dailyWage = 35000;
  const daysLost = 31;
  const annualLoss = employees * daysLost * dailyWage;
  // InnerSpark Standard programme reduces this by ~44% (client data).
  const annualSavings = Math.round(annualLoss * 0.44);
  const programCost = employees * 525000; // mid-range Standard tier
  const netROI = annualSavings - programCost;
  const ugx = (n: number) => `UGX ${n.toLocaleString()}`;
  const usd = (n: number) => `$${Math.round(n / 3400).toLocaleString()}`;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">ROI calculator</h2>
          <p className="text-muted-foreground">Estimate annual savings from reduced absenteeism. Based on ILO 2022 productivity loss benchmarks.</p>
        </div>
        <Card className="border-border">
          <CardContent className="pt-8 space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground">Number of employees: {employees}</label>
              <input type="range" min="10" max="500" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} className="w-full mt-3 accent-primary" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Estimated annual loss without support</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{ugx(annualLoss)}</p>
                <p className="text-xs text-muted-foreground">{usd(annualLoss)}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Projected annual savings (44%)</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{ugx(annualSavings)}</p>
                <p className="text-xs text-muted-foreground">{usd(annualSavings)}</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Net ROI after program cost</p>
                <p className={`text-2xl font-bold mt-1 ${netROI >= 0 ? "text-primary" : "text-red-600"}`}>{ugx(netROI)}</p>
                <p className="text-xs text-muted-foreground">{usd(netROI)}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border pt-4">
              <strong>How we calculated this:</strong> employees × 31 lost days/yr (ILO 2022) × UGX 35,000 avg daily wage × 44% reduction (InnerSpark client programme data 2024–2025), minus a mid-range Standard programme cost (~UGX 525,000/employee/yr).
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export const SparkFramework = () => {
  const steps = [
    { letter: "S", title: "See & Sense", desc: "Spot early signs of stress and burnout in yourself and your team.", icon: Eye },
    { letter: "P", title: "Pause & Play", desc: "Rest the nervous system through micro-breaks and mindful movement.", icon: Pause },
    { letter: "A", title: "Ask & Align", desc: "Have honest conversations and align on what truly matters at work.", icon: MessageSquare },
    { letter: "R", title: "Release & Reframe", desc: "Process emotions and reframe limiting thoughts using CBT tools.", icon: RefreshCw },
    { letter: "K", title: "Keep the Spark", desc: "Build sustainable habits that protect long-term wellbeing.", icon: Sparkles },
  ];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">Proprietary methodology</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-3">The S.P.A.R.K™ Framework</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Our 5-step model used in every workplace training, manager workshop, and 1:1 therapy session.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((s) => (
            <Card key={s.letter} className="border-border text-center hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 pb-6 space-y-3">
                <div className="w-14 h-14 mx-auto bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold">{s.letter}</div>
                <s.icon className="h-5 w-5 mx-auto text-primary" />
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export const OnboardingTimeline = () => {
  const steps = [
    { day: "Day 0", title: "Sign", icon: FileSignature, desc: "Contract signed, kick-off scheduled." },
    { day: "Day 1–3", title: "Kick-off call", icon: CalendarCheck, desc: "Align on goals with your wellness manager." },
    { day: "Day 4–7", title: "Employee onboarding", icon: Users2, desc: "Access codes distributed, app rollout." },
    { day: "Day 8–10", title: "First screening", icon: ClipboardCheck, desc: "Confidential team-wide wellbeing baseline." },
    { day: "Day 11–14", title: "First sessions", icon: Headphones, desc: "Therapy and group support begin." },
  ];
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">From contract to first session in under 2 weeks</h2>
          <p className="text-muted-foreground">A clear, low-friction onboarding path.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-4 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-background border border-border rounded-xl p-5 relative">
              <div className="absolute -top-3 left-5 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">{s.day}</div>
              <s.icon className="h-7 w-7 text-primary mt-2 mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{i + 1}. {s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CaseStudies = () => {
  const cases = [
    { sector: "Recruitment · Kampala", size: "120 employees", stat: "28% reduction in sick leave after 6 months on InnerSpark Standard.", note: "Client data on file — company anonymized on request." },
    { sector: "Telecom · Kampala", size: "340 employees", stat: "44% improvement in average WHO-5 score across 3 quarterly screenings.", note: "Client data on file — company anonymized on request." },
    { sector: "Banking · Multi-branch UG", size: "210 employees", stat: "Manager-reported productivity up 35% after S.P.A.R.K Training rollout.", note: "Client data on file — company anonymized on request." },
  ];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Companies who benefited</h2>
          <p className="text-muted-foreground">Anonymized snapshots from current InnerSpark clients.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <Card key={c.sector} className="border-border">
              <CardContent className="pt-6 space-y-3">
                <Building2 className="h-7 w-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">{c.sector}</p>
                <p className="text-xs text-muted-foreground">{c.size}</p>
                <p className="text-base text-foreground border-l-2 border-primary pl-3">{c.stat}</p>
                <p className="text-xs text-muted-foreground italic">{c.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TrustBadges = () => {
  const items = [
    { icon: FileLock2, text: "All data encrypted in transit and at rest" },
    { icon: Shield, text: "Results reported in aggregate only" },
    { icon: Building2, text: "Compliant with Uganda Data Protection Act 2019" },
    { icon: Users2, text: "Individual results are never shared with employers" },
  ];
  return (
    <section className="py-12 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((i) => (
            <div key={i.text} className="flex items-start gap-3">
              <i.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProposalRequestForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ company: "", employees: "", industry: "", tier: "", name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: "Proposal Request",
        message: `Company: ${form.company}\nEmployees: ${form.employees}\nIndustry: ${form.industry}\nPreferred tier: ${form.tier}`,
      });
      autoSubscribeNewsletter(form.email);
      await supabase.functions.invoke("send-resend-email", {
        body: {
          type: "business-inquiry-notify",
          to: "info@innersparkafrica.com",
          data: { name: form.name, email: form.email, company: form.company, message: `[PROPOSAL REQUEST]\nEmployees: ${form.employees}\nIndustry: ${form.industry}\nTier: ${form.tier}\nPhone: ${form.phone}` },
        },
      }).catch(() => {});
      toast({ title: "Proposal request received", description: "Caroline Achieng, our BDM, will reach out within 1 business day." });
      setForm({ company: "", employees: "", industry: "", tier: "", name: "", email: "", phone: "" });
    } catch {
      toast({ title: "Submission failed", description: "Please try again or email info@innersparkafrica.com", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <section id="proposal-form" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Request a proposal</h2>
          <p className="text-muted-foreground">We respond within 1 business day. Caroline Achieng, our Business Development Manager, will reach out personally.</p>
        </div>
        <Card className="border-border">
          <CardContent className="pt-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input required placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input required placeholder="Number of employees" type="number" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  <option value="">Preferred tier (optional)</option>
                  <option>Screening only</option>
                  <option>S.P.A.R.K Training</option>
                  <option>Basic Digital</option>
                  <option>Standard Support</option>
                  <option>Full Premium</option>
                  <option>Custom (200+)</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input required type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Request proposal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};