import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, Brain, CheckCircle2, ClipboardList, CreditCard, FileText,
  Lock, Shield, Users, Zap, Target, Sparkles, MessageCircle,
} from "lucide-react";

const CATALOG = [
  { name: "Workplace Personality Profile", credits: 1, blurb: "How someone prefers to work, communicate, and show up under pressure — for role fit and team design." },
  { name: "Stress Resilience at Work", credits: 1, blurb: "How staff bounce back from pressure and heavy seasons — before burnout becomes leave." },
  { name: "Leadership Style Snapshot", credits: 1, blurb: "How leaders motivate, decide, and handle conflict — useful for promotions and coaching." },
  { name: "Team Collaboration Style", credits: 1, blurb: "How people prefer to collaborate, give feedback, and share ownership." },
  { name: "Role Fit and Interest Map", credits: 1, blurb: "Interests and energy drivers that help place people where they do their best work." },
  { name: "Workplace Aptitude Lite", credits: 2, blurb: "A short practical aptitude check for screening and development — not a clinical diagnosis." },
];

const PACKS = [
  { name: "Single seat", credits: 1, price: "UGX 45,000" },
  { name: "Starter", credits: 5, price: "UGX 200,000" },
  { name: "Team", credits: 10, price: "UGX 360,000" },
  { name: "Department", credits: 25, price: "UGX 800,000" },
];

const STEPS = [
  { n: "1", title: "Buy credits", desc: "HR chooses a pack and pays via Mobile Money or card. Credits land in your company wallet." },
  { n: "2", title: "Send a private link", desc: "Pick an assessment and enter the employee name. They get a unique link." },
  { n: "3", title: "Employee completes privately", desc: "They fill it on phone or laptop. Results stay development-focused." },
  { n: "4", title: "Download the report", desc: "HR opens a clear development report for coaching and placement — not labels." },
];

const USES = [
  { icon: Target, title: "Hiring and role fit", desc: "Structured insight next to interviews — how someone works, leads, and handles stress." },
  { icon: Users, title: "Team design", desc: "Build teams that collaborate well. Coach friction styles early." },
  { icon: Sparkles, title: "Leadership pipelines", desc: "See leadership style and resilience before promotions." },
  { icon: Brain, title: "Development plans", desc: "Practical reports managers can act on — not clinical files." },
];

const FAQS = [
  { q: "Is this the same as the free WHO-5 wellbeing screen?", a: "No. The free team screen is aggregate only. Psychometrics are paid individual development tools with downloadable reports." },
  { q: "Are these clinical diagnoses?", a: "No. They are workplace development tools. Therapy and clinical care stay separate and confidential." },
  { q: "Who sees individual results?", a: "Company HR or L&D who run the psychometric hub. Employees use a private link." },
  { q: "How do credits work?", a: "Most assessments cost 1 credit; Aptitude Lite costs 2. Buy packs from 1 to 25 seats." },
  { q: "How do we get started?", a: "Request a company account, sign in at the company dashboard, open the psychometric hub, buy credits, and send links." },
];

export default function PsychometricAssessments() {
  const whatsapp =
    "https://wa.me/256792085773?text=" +
    encodeURIComponent(
      "Hi InnerSpark — I am interested in psychometric assessments for our company. Please share how we set up credits and the HR hub.",
    );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Workplace Psychometric Assessments for HR | InnerSpark Africa</title>
        <meta name="description" content="Paid workplace psychometrics for East African employers: personality, stress resilience, leadership, team style, role fit. Buy credits, send private links, download development reports." />
        <link rel="canonical" href="https://www.innersparkafrica.com/for-business/psychometric-assessments" />
        <meta property="og:title" content="Workplace Psychometric Assessments for HR | InnerSpark" />
        <meta property="og:description" content="Buy seats, send private employee links, download development reports." />
        <meta property="og:url" content="https://www.innersparkafrica.com/for-business/psychometric-assessments" />
      </Helmet>

      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-primary/40 text-white">
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 mb-5">
                <ClipboardList className="h-3.5 w-3.5" /> For Business · HR and L&D
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Psychometric assessments your HR team can actually use
              </h1>
              <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
                Buy seats, send a private link to each employee, and download a clear development report — personality,
                stress resilience, leadership, team collaboration, role fit, and aptitude. Built for East African workplaces.
                Not a clinical diagnosis.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> Talk to us on WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white" asChild>
                  <Link to="/corporate-dashboard">
                    Company admin login <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white/90 hover:bg-white/10 hover:text-white" asChild>
                  <Link to="/for-business">Back to For Business</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
                <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Private employee links</span>
                <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Development reports, not diagnoses</span>
                <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Mobile Money friendly packs</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why companies use psychometrics with InnerSpark</h2>
              <p className="mt-3 text-muted-foreground">Interviews alone miss how people work under pressure. These tools give HR a shared practical language.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {USES.map((u) => (
                <Card key={u.title} className="border-border">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><u.icon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-semibold text-foreground">{u.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How it works</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border bg-background p-5 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{s.n}</div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Assessment catalog</h2>
              <p className="mt-3 text-muted-foreground">Each assessment costs credits from your company wallet.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {CATALOG.map((c) => (
                <Card key={c.name} className="border-border hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-foreground leading-snug">{c.name}</h3>
                      <span className="shrink-0 text-xs font-semibold rounded-full bg-primary/10 text-primary px-2.5 py-1">{c.credits} credit{c.credits > 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.blurb}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Credit packs</h2>
              <p className="mt-3 text-white/70 max-w-xl mx-auto">Pay once, use when you hire, promote, or run a development cycle.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {PACKS.map((p) => (
                <div key={p.name} className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center space-y-2">
                  <p className="text-sm font-medium text-white/70">{p.name}</p>
                  <p className="text-3xl font-bold text-primary">{p.credits}</p>
                  <p className="text-xs uppercase tracking-wide text-white/50">credits</p>
                  <p className="text-lg font-semibold pt-2">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center"><FileText className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Privacy and boundaries</h2>
              </div>
              <ul className="space-y-3">
                {["Reports are workplace development tools — not clinical diagnoses.", "The free company wellbeing screen stays aggregate-only.", "Employees complete assessments on a unique private link.", "Handled under applicable privacy law, including Uganda Data Protection and Privacy Act 2019 where it applies."].map((t) => (
                  <li key={t} className="flex gap-3 text-sm md:text-base text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-10">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-xl border bg-background p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Zap className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to run psychometrics for your team?</h2>
            <p className="text-primary-foreground/85 mb-8">We will set up your company wallet, invite your HR admin, and walk you through the first pack.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="text-foreground" asChild>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp +256 792 085 773</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/for-business#proposal-form">Request a business proposal</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/15" asChild>
                <Link to="/corporate-dashboard">Existing company admin login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
