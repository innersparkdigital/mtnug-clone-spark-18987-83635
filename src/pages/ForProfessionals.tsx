import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { T } from "@/components/Translate";
import { 
  Video, 
  Globe, 
  Calendar, 
  BookOpen, 
  DollarSign,
  ClipboardCheck,
  UserCheck,
  Mail,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { autoSubscribeNewsletter } from "@/lib/autoSubscribe";
import { Link } from "react-router-dom";
import { Stethoscope, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import professionalsHeroImage from "@/assets/professionals-hero.png";

const acceptedBodies = [
  { country: "Uganda", bodies: ["Uganda Counsellors & Psychotherapists Association (UCPA)", "Uganda Medical and Dental Practitioners Council (UMDPC)"] },
  { country: "Kenya", bodies: ["Kenya Medical Practitioners and Dentists Board (KMPDB)", "Kenya Psychological Association (KPA)"] },
  { country: "Tanzania", bodies: ["Medical Council of Tanganyika (MCT)"] },
  { country: "Rwanda", bodies: ["Rwanda Medical Council (RMC)"] },
];

const recruitingNow = [
  "Addiction Recovery Specialists",
  "Child & Adolescent Therapists",
  "Arabic-speaking Counsellors",
  "Grief & Bereavement Therapists",
  "Sign Language Capable Professionals",
];

const therapistQuotes = [
  { name: "Dr. Sarah N.", role: "Clinical Psychologist · Kampala", quote: "I'm seeing 18 clients a week without ever paying a platform fee. The booking and payment flow just works." },
  { name: "John M.", role: "Counsellor · Mbarara", quote: "InnerSpark connected me with clients in 3 different districts I'd never have reached otherwise." },
  { name: "Esther A.", role: "Trauma Therapist · Nairobi", quote: "Transparent pay-outs and a real human admin team. The onboarding took less than a week." },
];

const ForProfessionals = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send confirmation email via Resend
    try {
      await supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'professional-application',
          to: formData.email,
          data: {
            name: formData.name,
            specialty: formData.specialty,
          },
        },
      });

      // Notify admin
      await supabase.functions.invoke('send-resend-email', {
        body: {
          type: 'professional-application-notify',
          to: 'info@innersparkafrica.com',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            specialty: formData.specialty,
            licenseNumber: formData.licenseNumber,
            message: formData.message,
          },
        },
      });
    } catch (err) {
      console.error('Email send error:', err);
    }

    // Auto-subscribe to newsletter
    autoSubscribeNewsletter(formData.email);

    toast({
      title: "Application Submitted",
      description: "Your application has been sent to our team. We'll review it and get back to you soon.",
    });
  };

  const benefits = [
    {
      icon: Video,
      title: "Secure Video Consultations",
      description: "Conduct consultations conveniently via secure video calls, offering flexibility for both you and your patients."
    },
    {
      icon: Globe,
      title: "Expanded Reach",
      description: "Reach a broader patient base, including remote or underserved areas, extending the impact of your practice."
    },
    {
      icon: Calendar,
      title: "Digital Practice Tools",
      description: "Streamline your practice with digital tools for appointment scheduling, record-keeping, and secure information sharing."
    },
    {
      icon: BookOpen,
      title: "Diverse Case Experience",
      description: "Access a diverse range of patients and cases, continually expanding your clinical knowledge and expertise."
    },
    {
      icon: DollarSign,
      title: "Fair Compensation",
      description: "Enjoy a fair compensation model based on the value of services provided, ensuring your work is rewarded appropriately."
    }
  ];

  const registrationSteps = [
    {
      step: 1,
      icon: ClipboardCheck,
      title: "Complete the Form",
      description: "Fill out the entire registration form with your professional details. Must be registered with your professional association."
    },
    {
      step: 2,
      icon: UserCheck,
      title: "Profile Review",
      description: "We will review and approve your profile by cross-referencing it with your professional association records."
    },
    {
      step: 3,
      icon: Mail,
      title: "Get Approved",
      description: "If your profile has passed our review, we will contact you by email and/or telephone with next steps."
    }
  ];

  const faqs = [
    {
      question: "Can any mental health professional apply to join Innerspark?",
      answer: "Yes, enrollment is open to professionals who meet the minimum requirements. However, unlike a marketplace where every professional can join by paying a monthly fee, our professional management team carefully vets and selects top registered profiles based on opportunities that arise."
    },
    {
      question: "What are the minimum requirements for health professionals to apply?",
      answer: "You must hold a valid license or certification from a recognized professional body in your country. For psychologists, this includes registration with the Uganda Counselling Association or equivalent. Psychiatrists must be registered with the Medical and Dental Practitioners Council."
    },
    {
      question: "How does the compensation model work?",
      answer: "With Innerspark, there are no monthly fees. We operate on a percentage-based model where you pay only when you earn. This makes it accessible whether you're in private practice, collaborating with partner companies, or serving patients through health plans."
    },
    {
      question: "What support does Innerspark provide to professionals?",
      answer: "We provide technical support, marketing assistance, appointment management tools, secure communication channels, and continuous professional development opportunities through workshops and training sessions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Join InnerSpark's Therapist Network — Reach Clients Across Africa | InnerSpark Africa</title>
        <meta name="description" content="Are you a licensed therapist, counsellor, or psychologist? Join InnerSpark Africa's growing network. No monthly fees. Earn 65–75% of session fees. Apply in 10 minutes." />
        <meta name="keywords" content="therapist network, join therapist platform, online counseling jobs, mental health professionals Africa, therapy practice online" />
        <link rel="canonical" href="https://www.innersparkafrica.com/for-professionals" />
        <meta property="og:url" content="https://www.innersparkafrica.com/for-professionals" />
        <meta property="og:title" content="For Professionals | Join Innerspark" />
        <meta property="og:description" content="Join Innerspark's network of therapists and counselors in Africa." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <p className="text-primary font-medium mb-4"><T>For Therapists, Counsellors, Psychologists & Psychiatrists</T></p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  <T>More Than a Platform:</T> <span className="text-primary"><T>Your Online Practice</T></span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
                  <T>Join us online and extend your reach to patients across geographic boundaries. With Innerspark, there are no monthly fees; instead, we operate on a percentage-based model. You pay only when you earn.</T>
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-foreground">Earn 65–75% of every session fee.</p>
                  <p className="text-sm text-muted-foreground mt-1">A therapist conducting 20 sessions per week earns approximately <span className="font-semibold text-foreground">UGX 6M–10M per month</span> (~$1,600–$2,700). No monthly platform fees — you pay only when you earn.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Join Our Network
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Link to="/for-professionals/refer">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Refer a Patient
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className="order-first lg:order-last">
                <img 
                  src={professionalsHeroImage} 
                  alt="Professional therapist in online consultation" 
                  className="w-full h-auto max-w-sm lg:max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How Registration Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Registration & Approval Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Step 1: 10 minutes to complete. Step 2: Profile reviewed within 5 business days. Step 3: First client match within 2 weeks of approval.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {registrationSteps.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="bg-background border-border hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl font-bold text-primary">{item.step}</span>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  {index < registrationSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronDown className="w-8 h-8 text-primary/40 rotate-[-90deg]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Unlock New Opportunities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Grow your practice and make a greater impact with Innerspark's professional network
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-background border-border hover:border-primary/50 hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {/* Accepted Registration Bodies */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">Accepted registration bodies</h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">We currently accept credentials from these regulators. International credentials considered — email <a href="mailto:professionals@innersparkafrica.com" className="text-primary underline">professionals@innersparkafrica.com</a>.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {acceptedBodies.map((c) => (
                <Card key={c.country} className="border-border">
                  <CardContent className="pt-5">
                    <p className="font-semibold text-foreground mb-2">{c.country}</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {c.bodies.map((b) => <li key={b}>• {b}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Actively Recruiting */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">We are actively recruiting</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Specialties InnerSpark needs now</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {recruitingNow.map((s) => (
                <span key={s} className="bg-background border border-primary/30 text-foreground px-4 py-2 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Therapist Quotes */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Voices from our network</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {therapistQuotes.map((q) => (
                <Card key={q.name} className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-foreground italic mb-4">"{q.quote}"</p>
                    <p className="text-sm font-semibold text-foreground">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Referral Program */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Refer a colleague — earn UGX 50,000</h2>
            <p className="text-muted-foreground">Refer a qualified colleague. If they complete their first 10 sessions, you earn <span className="font-semibold text-foreground">UGX 50,000 (~$14)</span> as a thank-you. Add their name to your application below.</p>
          </div>
        </section>

        {/* Tech Requirements */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">What you need to start</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="bg-muted/30 rounded-xl p-4">📱 Any smartphone or laptop</div>
              <div className="bg-muted/30 rounded-xl p-4">🌐 Minimum 5 Mbps internet</div>
              <div className="bg-muted/30 rounded-xl p-4">🤫 A private, quiet space for sessions</div>
              <div className="bg-muted/30 rounded-xl p-4">🎧 Headphones recommended</div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 bg-muted/30 hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Common Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about joining Innerspark
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-background border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Join Form Section */}
        <section id="join-form" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Join Our Network
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We'd love to help you grow your practice. Complete the form below and a member of our team will reach out to share next steps.
                </p>
              </div>
              
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Dr. Jane Smith"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="jane@example.com"
                          className="bg-background"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+256 700 000 000"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Specialty *</label>
                        <Input
                          required
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          placeholder="e.g., Clinical Psychologist, Counsellor"
                          className="bg-background"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">License/Registration Number *</label>
                      <Input
                        required
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        placeholder="Your professional license number"
                        className="bg-background"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Tell Us About Your Practice</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Share your experience, specializations, and why you'd like to join Innerspark..."
                        className="bg-background min-h-[120px]"
                      />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForProfessionals;
