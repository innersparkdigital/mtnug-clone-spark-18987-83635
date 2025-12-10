import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Cog, Users, Calendar, Video, BookOpen, GraduationCap, BarChart3, UserCheck, MessageSquare, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import corporateWellnessImage from "@/assets/corporate-wellness-service.jpg";
import mtnLogo from "@/assets/mtn-internship.png";
import uictLogo from "@/assets/uict-training.png";
import miicLogo from "@/assets/miic-mental-health.png";
import foundersLogo from "@/assets/founders-mindset-training.png";
import truckDriversLogo from "@/assets/truck-drivers-training.png";

const defaultTexts = {
  badge: "For Businesses",
  heroTitle1: "Good for the employee, even better for",
  heroTitle2: "your company",
  heroDesc: "For your employees, quality emotional care. Innerspark can help your company achieve more productivity and fewer leaves, with a focus on ROI and positive clinical outcomes.",
  ctaButton: "I Want to Care for My Business",
  clientsTitle: "Businesses Who Have Used Our Services",
  whyTitle1: "Why does your company need",
  whyTitle2: "emotional health care?",
  stat1: "of employees exhibit physical or psychological illness due to mental health issues.",
  stat2: "of employees have impaired productivity due to psychological problems.",
  stat3: "of business turnover is caused by mental health problems.",
  stat4: "not worked per year, per employee due to causes related to emotional health.",
  employeeTitle: "Mental health based on value delivery",
  forEmployee: "For the Employee",
  expertConsult: "Expert Consultations",
  expertDesc: "Consultations with Innerspark psychologists and counselors, with a selected and trained clinical staff.",
  careTracks: "Care Tracks & Resources",
  careDesc: "Progress tracking with educational content including articles, videos, guided exercises and wellness resources.",
  training: "Training & Workshops",
  trainingDesc: "Lectures, training and mental health literacy programs with qualified specialists.",
  forCompany: "For the Company",
  companyTitle: "Tools to transform your workplace",
  popMapping: "Population Mapping",
  popDesc: "Classification of employees into different levels of care with continuous measurement and follow-up.",
  popBullet1: "Classification into different care levels",
  popBullet2: "Continuous employee self-assessment",
  popBullet3: "Professional assessment follow-up",
  personalized: "Personalized Care Protocols",
  personalizedDesc: "Unique treatments for unique people. Personalized care protocols for each population profile.",
  consulting: "Emotional Health Consulting",
  consultingDesc: "Periodic meetings with our emotional health managers help you define action plans for your teams.",
  transformTitle: "Transform your company climate and culture",
  resultsTitle: "Measurable Results",
  result1: "clinical improvement of employees after the program",
  result2: "reduction in levels of mental disorders",
  result3: "increase in productivity",
  decrease: "Decrease",
  decreaseItem1: "Annual cost with health plan (loss ratio)",
  decreaseItem2: "Cost of replacement, recruitment and training (turnover)",
  decreaseItem3: "Number of absences (absenteeism)",
  promote: "Promote",
  promoteItem1: "Relief of employees' symptoms",
  promoteItem2: "Motivation, self-knowledge and quality of life",
  promoteItem3: "Increased productivity by up to 35%",
  evolutionTitle: "Evolution of Emotional Health",
  evolutionDesc: "Average score of employees who respond to self-assessments throughout the entire program.",
  beforeProgram: "Before program",
  afterProgram: "After program",
  contactTitle: "Calculate mental health costs in your company",
  contactDesc: "Get in touch and let's discuss how Innerspark can transform your workplace",
  yourName: "Your Name",
  emailAddress: "Email Address",
  companyName: "Company Name",
  tellUs: "Tell us about your needs",
  submitButton: "Get in Touch",
};

const ForBusiness = () => {
  const { toast } = useToast();
  const { language, translateBatch } = useLanguage();
  const [t, setT] = useState(defaultTexts);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  useEffect(() => {
    if (language === "en") {
      setT(defaultTexts);
      return;
    }

    const values = Object.values(defaultTexts);
    translateBatch(values).then((results) => {
      const keys = Object.keys(defaultTexts) as (keyof typeof defaultTexts)[];
      const newT = {} as typeof defaultTexts;
      keys.forEach((key, i) => {
        newT[key] = results[i];
      });
      setT(newT);
    });
  }, [language, translateBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `Hi, I'm ${formData.name} from ${formData.company}. I'm interested in Innerspark for Business. ${formData.message}`
    );
    window.open(`https://wa.me/256780570987?text=${whatsappMessage}`, "_blank");
    toast({
      title: "Redirecting to WhatsApp",
      description: "We'll connect with you shortly to discuss your business needs.",
    });
  };

  const stats = [
    { value: "84%", label: t.stat1, icon: Brain },
    { value: "61%", label: t.stat2, icon: Cog },
    { value: "38%", label: t.stat3, icon: Users },
    { value: "31 days", label: t.stat4, icon: Calendar },
  ];

  const employeeFeatures = [
    { title: t.expertConsult, description: t.expertDesc, icon: Video },
    { title: t.careTracks, description: t.careDesc, icon: BookOpen },
    { title: t.training, description: t.trainingDesc, icon: GraduationCap },
  ];

  const companyFeatures = [
    { 
      title: t.popMapping, 
      description: t.popDesc,
      icon: BarChart3,
      bullets: [t.popBullet1, t.popBullet2, t.popBullet3]
    },
    { title: t.personalized, description: t.personalizedDesc, icon: UserCheck },
    { title: t.consulting, description: t.consultingDesc, icon: MessageSquare },
  ];

  const results = [
    { value: "72%", label: t.result1 },
    { value: "44%", label: t.result2 },
    { value: "35%", label: t.result3 },
  ];

  return (
    <>
      <Helmet>
        <title>Innerspark for Business | Corporate Mental Health Solutions in Africa</title>
        <meta name="description" content="Transform your workplace with Innerspark's corporate mental health programs. Reduce absenteeism, improve productivity, and support employee wellbeing across Africa." />
        <meta name="keywords" content="corporate wellness, employee mental health, workplace wellbeing, corporate therapy, business mental health Africa, EAP programs Uganda" />
        <link rel="canonical" href="https://innersparkafrica.com/for-business" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Innerspark for Business",
            "description": "Corporate mental health and employee wellness programs",
            "provider": {
              "@type": "Organization",
              "name": "Innerspark Africa"
            },
            "areaServed": "Africa",
            "serviceType": "Corporate Mental Health Services"
          })}
        </script>
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  {t.badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {t.heroTitle1} <span className="text-primary">{t.heroTitle2}</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t.heroDesc}
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t.ctaButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <img 
                  src={corporateWellnessImage} 
                  alt="Corporate wellness program" 
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Clients/Partners Section */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground mb-10">
              <span className="font-semibold text-foreground text-lg">{t.clientsTitle}</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
                <img src={mtnLogo} alt="MTN Uganda" className="h-16 md:h-20 w-auto object-contain" />
              </div>
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
                <img src={uictLogo} alt="UICT" className="h-16 md:h-20 w-auto object-contain" />
              </div>
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
                <img src={miicLogo} alt="MIIC" className="h-16 md:h-20 w-auto object-contain" />
              </div>
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
                <img src={foundersLogo} alt="Founders Program" className="h-16 md:h-20 w-auto object-contain" />
              </div>
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                <img src={truckDriversLogo} alt="Truck Drivers Program" className="h-16 md:h-20 w-auto object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Mental Health Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              {t.whyTitle1}<br />
              <span className="text-primary">{t.whyTitle2}</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 text-center p-6">
                  <CardContent className="pt-6 space-y-4">
                    <stat.icon className="h-12 w-12 mx-auto text-primary" />
                    <p className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</p>
                    <p className="text-slate-300 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For the Employee Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t.employeeTitle}
              </h2>
              <p className="text-xl text-primary font-semibold">{t.forEmployee}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {employeeFeatures.map((feature, index) => (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors group">
                  <CardContent className="pt-8 pb-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For the Company Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xl text-primary font-semibold mb-4">{t.forCompany}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t.companyTitle}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {companyFeatures.map((feature, index) => (
                <Card key={index} className="border-border bg-background">
                  <CardContent className="pt-8 pb-8 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    {feature.bullets && (
                      <ul className="space-y-2 pt-2">
                        {feature.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Transform Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {t.transformTitle}
            </h2>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.ctaButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Measurable Results Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              {t.resultsTitle}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {results.map((result, index) => (
                <div key={index} className="text-center">
                  <p className="text-5xl md:text-6xl font-bold text-primary mb-2">{result.value}</p>
                  <p className="text-muted-foreground">{result.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="h-8 w-8 text-red-500" />
                    <h3 className="text-xl font-semibold text-foreground">{t.decrease}</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t.decreaseItem1}</li>
                    <li>• {t.decreaseItem2}</li>
                    <li>• {t.decreaseItem3}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <h3 className="text-xl font-semibold text-foreground">{t.promote}</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t.promoteItem1}</li>
                    <li>• {t.promoteItem2}</li>
                    <li>• {t.promoteItem3}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Evolution Score */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-center text-foreground mb-8">
                {t.evolutionTitle}
              </h3>
              <p className="text-center text-muted-foreground mb-8">
                {t.evolutionDesc}
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-muted-foreground">4.3</p>
                  <p className="text-sm text-muted-foreground">{t.beforeProgram}</p>
                </div>
                <ArrowRight className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">8.2</p>
                  <p className="text-sm text-muted-foreground">{t.afterProgram}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                {t.contactTitle}
              </h2>
              <p className="text-center text-slate-300 mb-12">
                {t.contactDesc}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t.yourName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                  <Input
                    type="email"
                    placeholder={t.emailAddress}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
                <Input
                  placeholder={t.companyName}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Textarea
                  placeholder={t.tellUs}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t.submitButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ForBusiness;
