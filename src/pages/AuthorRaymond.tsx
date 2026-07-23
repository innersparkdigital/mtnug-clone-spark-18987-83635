import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail, Globe, GraduationCap, Briefcase, HeartHandshake, Sparkles } from "lucide-react";
import raymondPhoto from "@/assets/talemwa-raymond.jpg";

const AuthorRaymond = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Raymond Talemwa",
    jobTitle: "Founder & CEO, InnerSpark Africa",
    url: "https://www.innersparkafrica.com/about/raymond",
    image: "https://www.innersparkafrica.com/talemwa-raymond.jpg",
    sameAs: [
      "https://www.linkedin.com/in/raymond-talemwa",
      "https://www.innersparkafrica.com",
    ],
    worksFor: {
      "@type": "Organization",
      name: "InnerSpark Africa",
      url: "https://www.innersparkafrica.com",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Gulu University" },
      { "@type": "EducationalOrganization", name: "ALX Africa" },
    ],
    knowsAbout: [
      "Digital Mental Health",
      "Addiction Recovery",
      "Health Technology",
      "Behavioral Health",
      "Pharmacy",
      "Software Engineering",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Raymond Talemwa — Founder & CEO of InnerSpark Africa</title>
        <meta
          name="description"
          content="Raymond Talemwa is the founder and CEO of InnerSpark Africa, a health-tech company transforming how Africans access mental health, addiction recovery and behavioral care."
        />
        <link rel="canonical" href="https://www.innersparkafrica.com/about/raymond" />
        <meta property="og:title" content="Raymond Talemwa — Founder & CEO, InnerSpark Africa" />
        <meta
          property="og:description"
          content="Pharmacist, software-engineer-in-training and founder of InnerSpark — building human-centred mental health technology for Africa."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.innersparkafrica.com/about/raymond" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[380px,1fr] gap-10 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
              <img
                src={raymondPhoto}
                alt="Raymond Talemwa, Founder and CEO of InnerSpark Africa"
                className="relative rounded-3xl w-full aspect-square object-cover shadow-xl"
                loading="eager"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                Founder & CEO · InnerSpark Africa
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Raymond Talemwa
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Pharmacist, software-engineer-in-training and founder building the tools
                that make mental health care accessible, affordable and stigma-free across Africa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="mailto:info@innersparkafrica.com">
                    <Mail className="w-4 h-4 mr-2" /> Get in touch
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://www.linkedin.com/in/raymond-talemwa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/press">
                    <Globe className="w-4 h-4 mr-2" /> Press & Media
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bio body */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl mx-auto prose prose-lg prose-slate">
            <h2 className="text-2xl font-bold text-foreground">About Raymond</h2>
            <p className="text-muted-foreground leading-relaxed">
              I&rsquo;m Raymond Talemwa, Founder & CEO of InnerSpark &mdash; a health-tech
              company on a mission to transform how individuals access and experience
              mental health services in Africa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My journey began with a fascination for technology and a drive to
              understand how things work. That curiosity led me to study Pharmacy at
              Gulu University, and I&rsquo;m now expanding my capabilities through
              Software Engineering studies at ALX Africa. This intersection of health
              and tech is where I found my calling &mdash; and where I&rsquo;m building
              tools that save lives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              InnerSpark is more than a company &mdash; it&rsquo;s a movement. Whether
              it&rsquo;s through our Virtual Counseling, Virtual Support Groups that
              combat isolation through peer connection, or the upcoming{" "}
              <strong>SmartSip Watch</strong> &mdash; a discreet wearable that monitors
              blood-alcohol levels in real time &mdash; we are reimagining care for
              people battling addiction and mental health challenges.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8">Who we serve</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>Adults seeking confidential, holistic addiction recovery</li>
              <li>Families navigating the pain of a loved one&rsquo;s substance use</li>
              <li>Young adults with dual diagnoses looking for stability and identity</li>
              <li>Referring professionals who need trusted, evidence-based care</li>
            </ul>

            <p className="text-muted-foreground leading-relaxed mt-6">
              I believe innovation is only meaningful when it&rsquo;s human-centered.
              That&rsquo;s why we combine compassion, clinical integrity and cutting-edge
              tech to make care more accessible, personalized and sustainable &mdash;
              especially in underserved communities.
            </p>
          </div>
        </section>

        {/* Credentials grid */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <GraduationCap className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">
                  BPharm &mdash; Gulu University<br />
                  Software Engineering &mdash; ALX Africa
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Briefcase className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Digital mental health, addiction recovery, health-tech product design,
                  behavioural science.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <HeartHandshake className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Focus areas</h3>
                <p className="text-sm text-muted-foreground">
                  Virtual therapy, peer support groups, wearable health tech
                  (SmartSip Watch), workplace wellbeing.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Connect CTA */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl mx-auto bg-primary/5 border border-primary/10 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Let&rsquo;s connect if you&rsquo;re&hellip;
                </h3>
                <ul className="text-muted-foreground space-y-1 mb-5">
                  <li>A mental-health professional seeking a trusted referral partner</li>
                  <li>A health-tech enthusiast or investor interested in behavioural health</li>
                  <li>Someone looking for guidance, partnership, or hope</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="mailto:info@innersparkafrica.com">Email Raymond</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Partner with InnerSpark</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Published writing placeholder — links to blog */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-3">Published writing</h2>
            <p className="text-muted-foreground mb-4">
              Raymond regularly writes on digital mental health, addiction recovery and
              building health-tech in Africa. Read the latest on the InnerSpark blog.
            </p>
            <Button asChild variant="outline">
              <Link to="/blog">Read the InnerSpark blog →</Link>
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
};

export default AuthorRaymond;