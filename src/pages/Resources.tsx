import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type Resource = { name: string; url: string; description: string };
type Group = { title: string; note?: string; items: Resource[] };

const groups: Group[] = [
  {
    title: "Uganda",
    items: [
      {
        name: "Ministry of Health Uganda",
        url: "https://www.health.go.ug",
        description: "National health guidance, mental-health policy and helplines.",
      },
      {
        name: "Butabika National Referral Mental Hospital",
        url: "https://butabikahospital.com",
        description: "Uganda's national referral hospital for mental health care.",
      },
      {
        name: "Uganda Counselling Association",
        url: "https://ugandacounsellingassociation.org",
        description: "Professional body for counsellors and psychotherapists in Uganda.",
      },
    ],
  },
  {
    title: "Kenya",
    items: [
      {
        name: "Ministry of Health Kenya — Mental Health",
        url: "https://www.health.go.ke",
        description: "National policy, mental-health programs and helplines.",
      },
      {
        name: "Kenya Counselling and Psychological Association",
        url: "https://www.kcpakenya.org",
        description: "Professional standards and directory of practitioners.",
      },
    ],
  },
  {
    title: "Global",
    items: [
      {
        name: "World Health Organization — Mental Health",
        url: "https://www.who.int/health-topics/mental-health",
        description: "Global guidance, data and evidence on mental-health care.",
      },
      {
        name: "Movember",
        url: "https://uk.movember.com/",
        description: "Global men's health movement including mental health & suicide prevention.",
      },
      {
        name: "International Association for Suicide Prevention",
        url: "https://www.iasp.info/resources/Crisis_Centres/",
        description: "Directory of crisis centres and helplines worldwide.",
      },
    ],
  },
  {
    title: "InnerSpark tools",
    note: "Free, evidence-informed tools you can use right now.",
    items: [
      {
        name: "Mind Check — 37 screening tools",
        url: "https://www.innersparkafrica.com/mind-check",
        description: "Free screening for depression, anxiety, PTSD, addiction and more.",
      },
      {
        name: "Wellbeing Check (WHO-5)",
        url: "https://www.innersparkafrica.com/wellbeing-check",
        description: "Two-minute WHO-5 wellbeing check with private results.",
      },
      {
        name: "Whisper — anonymous support",
        url: "https://www.innersparkafrica.com/whisper",
        description: "Send an anonymous whisper and receive support via WhatsApp.",
      },
      {
        name: "InnerSpark blog",
        url: "https://www.innersparkafrica.com/blog",
        description: "Expert-backed articles on therapy, anxiety, depression and recovery.",
      },
    ],
  },
];

const Resources = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Mental Health Resources — Uganda, Kenya & Global | InnerSpark Africa</title>
      <meta
        name="description"
        content="Curated mental-health resources for Uganda, Kenya and Africa — government helplines, professional bodies, WHO guidance and free InnerSpark tools."
      />
      <link rel="canonical" href="https://www.innersparkafrica.com/resources" />
      <meta property="og:title" content="Mental Health Resources — InnerSpark Africa" />
      <meta
        property="og:description"
        content="Trusted mental-health links for Uganda, Kenya and the world, plus free InnerSpark tools."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.innersparkafrica.com/resources" />
    </Helmet>

    <Header />

    <main className="pt-24 pb-16">
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
            Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trusted mental-health resources
          </h1>
          <p className="text-lg text-muted-foreground">
            A curated directory of national health services, professional bodies, global
            guidance and free InnerSpark tools you can share with anyone who needs help.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>In an emergency:</strong> if you or someone you know is in immediate
            danger, please contact local emergency services. In Uganda dial{" "}
            <a className="underline" href="tel:911">911</a> or the Butabika helpline. In
            Kenya dial <a className="underline" href="tel:1199">1199</a>.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="text-2xl font-bold text-foreground mb-1">{g.title}</h2>
              {g.note && (
                <p className="text-sm text-muted-foreground mb-4">{g.note}</p>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {g.items.map((r) => (
                  <Card key={r.url}>
                    <CardContent className="p-5">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-3"
                      >
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {r.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {r.description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <AppDownload />
      </div>
    </main>

    <Footer />
  </div>
);

export default Resources;