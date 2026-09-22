import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Partners | InnerSpark Africa</title>
        <meta name="description" content="Organisations working with InnerSpark Africa on employee wellbeing, community mental health and access to licensed therapists." />
        <link rel="canonical" href="https://www.innersparkafrica.com/partners" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl space-y-10">
        <section>
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">Partners</p>
          <h1 className="text-4xl font-bold">Working with organisations across Africa</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            InnerSpark collaborates with employers, universities, health teams and community organisations on confidential counselling access, WHO-5 wellbeing screening and practical workplace mental health support.
          </p>
        </section>
        <section className="rounded-2xl border p-6 space-y-3">
          <h2 className="text-2xl font-semibold">Partner directory</h2>
          <p className="text-sm text-muted-foreground">
            Public partner names and logos are shown only for collaborations confirmed for listing. If your organisation has worked with InnerSpark and wants to be listed, email info@innersparkafrica.com.
          </p>
        </section>
        <section className="rounded-2xl border p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Ways to partner</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>Corporate wellbeing screening and employee counselling access</li>
            <li>S.P.A.R.K workplace mental health training</li>
            <li>Community and campus mental health programmes</li>
            <li>Embeddable free WHO-5 wellbeing check for partner websites</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link to="/for-business">Corporate services</Link></Button>
            <Button asChild variant="outline"><Link to="/wellbeing-check/embed">Embed wellbeing check</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
