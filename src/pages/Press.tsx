import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Download, Newspaper, Radio, Users } from "lucide-react";

const facts = [
  { label: "Founded", value: "2023" },
  { label: "Headquarters", value: "Kampala, Uganda" },
  { label: "Serving", value: "Uganda, Kenya & across Africa" },
  { label: "Founder", value: "Raymond Talemwa" },
  { label: "Category", value: "Digital mental health & health-tech" },
  { label: "Focus", value: "Virtual therapy, addiction recovery, wearable tech" },
];

const talkingPoints = [
  "How digital tools can close Africa&rsquo;s mental-health treatment gap",
  "Confidential, affordable therapy for young Africans (from UGX 30,000 / KES 1,500)",
  "Addiction recovery, families and the upcoming SmartSip wearable",
  "Workplace mental wellbeing across African employers",
  "AI in mental-health triage — Amani AI and safe design",
  "The Raymond Talemwa story: pharmacy → software engineering → founder",
];

const Press = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Press & Media — InnerSpark Africa</title>
      <meta
        name="description"
        content="Press kit, media enquiries, spokesperson bio and interview topics for InnerSpark Africa — a digital mental-health company serving Uganda, Kenya and Africa."
      />
      <link rel="canonical" href="https://www.innersparkafrica.com/press" />
      <meta property="og:title" content="Press & Media — InnerSpark Africa" />
      <meta
        property="og:description"
        content="Media enquiries, spokesperson bio and press kit for InnerSpark Africa."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.innersparkafrica.com/press" />
    </Helmet>

    <Header />

    <main className="pt-24 pb-16">
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
            Press & Media
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Media enquiries welcome
          </h1>
          <p className="text-lg text-muted-foreground">
            InnerSpark Africa is a digital mental-health company making therapy,
            addiction recovery and wellbeing tools affordable and accessible across
            Africa. Journalists, podcasters and event organisers &mdash; we&rsquo;re
            happy to help with interviews, quotes, data and expert commentary.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button asChild>
              <a href="mailto:info@innersparkafrica.com?subject=Media%20enquiry%20%E2%80%94%20InnerSpark%20Africa">
                <Mail className="w-4 h-4 mr-2" /> Contact media team
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about/raymond">Founder bio</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <Newspaper className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Press releases</h3>
              <p className="text-sm text-muted-foreground">
                For the latest announcements and product news, email us and we&rsquo;ll
                send the full release plus embargoed context.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Radio className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Interviews</h3>
              <p className="text-sm text-muted-foreground">
                Raymond Talemwa (Founder & CEO) is available for on-record interviews on
                radio, TV, podcasts and print.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Expert commentary</h3>
              <p className="text-sm text-muted-foreground">
                Our clinical team can comment on therapy, addiction, workplace mental
                health and youth wellbeing in Uganda and Kenya.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Company fact sheet</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="border border-border rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </p>
                <p className="text-foreground font-medium mt-1">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">Interview topics</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-muted-foreground">
            {talkingPoints.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span dangerouslySetInnerHTML={{ __html: t }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-14">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
          <Download className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Need logos, photos or brand assets?
          </h3>
          <p className="text-muted-foreground mb-4">
            Email us and we&rsquo;ll send the InnerSpark press kit — logos, founder
            headshots and product screenshots — within one working day.
          </p>
          <Button asChild>
            <a href="mailto:info@innersparkafrica.com?subject=Press%20kit%20request">
              Request press kit
            </a>
          </Button>
        </div>
      </section>

      <div className="mt-16">
        <AppDownload />
      </div>
    </main>

    <Footer />
  </div>
);

export default Press;