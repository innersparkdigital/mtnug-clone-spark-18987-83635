import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Target, Eye, Users, Zap, Shield, Globe } from "lucide-react";
import { T } from "@/components/Translate";
import ScrollReveal, { StaggerContainer, StaggerItem, TextReveal } from "@/components/ScrollReveal";
import aboutHero from "@/assets/about-hero-new.png";
import talemwaRaymond from "@/assets/talemwa-raymond.jpg";
import hellenAturo from "@/assets/hellen-aturo.jpg";
import mutebiReagan from "@/assets/mutebi-reagan.jpg";
import jamesNiwamanya from "@/assets/james-niwamanya.jpg";
import carolineAchieng from "@/assets/caroline-achieng.png";

const About = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Innerspark Africa",
    "alternateName": "Innerspark",
    "url": "https://www.innersparkafrica.com",
    "logo": "https://www.innersparkafrica.com/innerspark-logo.png",
    "description": "Innerspark Africa is a digital mental wellness platform making professional mental health care affordable, accessible, and stigma-free globally.",
    "foundingDate": "2023",
    "areaServed": ["Worldwide", "Uganda", "Ghana", "Botswana", "Africa"],
    "medicalSpecialty": ["Psychiatry", "Psychology", "Counseling"],
    "sameAs": [
      "https://x.com/innersparkrcv",
      "https://www.facebook.com/innersparkrecover",
      "https://www.linkedin.com/in/inner-spark-581014326/",
      "https://www.youtube.com/@INNERSPARK36"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.innersparkafrica.com" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.innersparkafrica.com/about" }
    ]
  };
  const leaders = [
    {
      name: "Talemwa Raymond",
      position: "Founder and CEO",
      image: talemwaRaymond,
    },
    {
      name: "Hellen Aturo",
      position: "Co-founder and Human Resource Specialist",
      image: hellenAturo,
    },
    {
      name: "Mutebi Reagan",
      position: "Therapist and Director Virtual Therapy",
      image: mutebiReagan,
    },
    {
      name: "James Niwamanya",
      position: "Operations Lead",
      image: jamesNiwamanya,
    },
    {
      name: "Caroline Achieng",
      position: "Business Development & Partnership Manager",
      image: carolineAchieng,
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Innerspark Africa | Online Therapy Platform | Our Mission</title>
        <meta name="description" content="Learn about Innerspark Africa, the leading online therapy platform. Our mission is to make therapy accessible, affordable, and stigma-free globally. Meet our team and discover our vision for mental wellness." />
        <meta name="keywords" content="about Innerspark Africa, online therapy platform, mental health mission, accessible therapy, affordable counseling, mental health startup, teletherapy platform, digital mental wellness" />
        <link rel="canonical" href="https://www.innersparkafrica.com/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Innerspark Africa | Online Therapy Platform" />
        <meta property="og:description" content="Innerspark Africa is a digital mental wellness platform making professional mental health care affordable and accessible globally." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/about" />
        <meta property="og:image" content="https://innerspark.africa/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Innerspark Africa | Mental Health Platform" />
        <meta name="twitter:description" content="Learn about Innerspark Africa's mission to make mental health care accessible across Africa." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                <T>About Innerspark Africa</T>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                <T>Innerspark Africa is a digital mental wellness platform designed to make professional mental health care affordable, accessible, and stigma-free — right from your smartphone.</T>
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} scale>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={aboutHero} 
                alt="Innerspark Africa team" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-center">
                <T>What We Do</T>
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
                <T>We connect individuals, organizations, and communities to licensed therapists, support groups, and self-care tools that promote emotional healing, resilience, and mental well-being.</T>
              </p>
            </ScrollReveal>
            
            <StaggerContainer className="grid md:grid-cols-2 gap-8">
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Virtual Therapy</h3>
                  <p className="text-muted-foreground">Talk to licensed therapists anytime, anywhere through secure video and audio calls.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Support Groups</h3>
                  <p className="text-muted-foreground">Join safe, therapist-led spaces to share, heal, and grow with others.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Wellness Resources</h3>
                  <p className="text-muted-foreground">Access mood trackers, journaling tools, and guided meditations for daily self-care.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Corporate Wellness</h3>
                  <p className="text-muted-foreground">Partner with organizations to build healthier, more productive teams.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto" staggerDelay={0.2}>
            <StaggerItem direction="left">
              <div className="bg-gradient-to-br from-primary/10 to-purple-deep/10 p-8 rounded-2xl h-full">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower individuals across Africa to take control of their mental health through technology, therapy, and community connection — creating a continent where mental wellness is prioritized just like physical health.
                </p>
              </div>
            </StaggerItem>
            
            <StaggerItem direction="right">
              <div className="bg-gradient-to-br from-purple-deep/10 to-primary/10 p-8 rounded-2xl h-full">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A mentally healthy Africa — where everyone can access compassionate, professional support regardless of cost, location, or stigma.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center">
                Our Core Values
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="space-y-6">
              <StaggerItem>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Lead with Empathy</h3>
                  <p className="text-muted-foreground">We listen deeply and serve with compassion.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Act with Honesty and Purpose</h3>
                  <p className="text-muted-foreground">We act with integrity and transparency in everything we do.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Work Together, Move Fast</h3>
                  <p className="text-muted-foreground">We move fast by working together as one team.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Serve with Dignity</h3>
                  <p className="text-muted-foreground">We honor every individual's story without judgment.</p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Include Every Voice</h3>
                  <p className="text-muted-foreground">We build for everyone, everywhere.</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Our Belief */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Our Belief
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe that everyone deserves access to compassionate, affordable, and innovative mental health care — no matter where they live, how they feel, or what they've been through.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We are inspired by the untapped strength of individuals and communities across Africa. We are committed to bridging the mental health divide by using technology to increase access, reduce stigma, and promote healing.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our work supports the United Nations Sustainable Development Goals, especially those that promote good health and well-being, gender equality, reduced inequalities, and decent work and economic growth. We envision a future where every person has the tools to take care of their mind, rebuild their life, and thrive in dignity.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Intent */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-purple-deep/10">
        <div className="container mx-auto px-4">
          <ScrollReveal scale>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Our Intent
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To deliver cutting-edge mental health and wellness solutions that spark healing, build resilience, and empower Africa's progress — one mind, one community, one innovation at a time.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Strategic Priorities */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center">
                Strategic Priorities
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="space-y-8">
              <StaggerItem direction="left">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    1. Build the Leading Digital Mental Health Ecosystem
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We aim to develop Uganda's most trusted platform for digital mental health support — offering teletherapy, AI-powered wellness tools, and support groups.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem direction="left">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    2. Expand Accessible, Community-Based Mental Health Services
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We are building strong partnerships with health facilities, community leaders, schools, and workplaces to ensure localized access to care. Through both in-person and virtual group therapy, we're working to bridge the mental health gap in underserved populations.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem direction="left">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    3. Transform Awareness Through Digital Campaigns and Education
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We're changing the conversation around mental health by using tech and storytelling to dismantle stigma and spark public dialogue. From online campaigns to street activations and media appearances, we position mental wellness as essential and empowering.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem direction="left">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    4. Create Sustainable Value and Social Impact
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We're committed to inclusive, ethical, and impact-driven growth. We reinvest in mental health access, offer affordable care, and work with diverse stakeholders — from youth leaders to recovery champions — to foster healing in communities.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Strategic Enablers */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center">
                Strategic Enablers
              </h2>
              <p className="text-lg text-center text-muted-foreground mb-12">How We Deliver Impact</p>
            </ScrollReveal>
            
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Tech-Driven Service Delivery</h3>
                  <p className="text-muted-foreground">Seamless booking, AI chat, wearables, and virtual therapy</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Client-Centered Design</h3>
                  <p className="text-muted-foreground">Solutions built around lived experience and user feedback</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Trusted Collaborations</h3>
                  <p className="text-muted-foreground">With universities, federations, NGOs, and private health providers</p>
                </div>
              </StaggerItem>
              
              <StaggerItem scale>
                <div className="bg-card p-6 rounded-xl shadow-sm h-full">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Sustainability Through Partnerships</h3>
                  <p className="text-muted-foreground">Subscription models with pharmacies, donor-supported outreach, and scalable wellness programs</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Why These Priorities Matter */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center">
                Why These Priorities Matter
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="space-y-6">
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Uganda's mental health burden is increasing, yet services remain underfunded and stigmatized. Innerspark brings scalable, digital-first solutions to close this care gap.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Young people, especially students and employees, are disproportionately affected by anxiety, stress, and substance use. We meet them where they are — online and in their communities.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Digital health innovations are transforming care globally. We are positioning Uganda as a regional leader in tech-based wellness.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section id="leadership" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Leadership Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Meet the passionate individuals leading Innerspark's mission to transform 
                mental health and wellness across Uganda.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <StaggerItem key={index} scale>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {leader.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {leader.position}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-purple-deep to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Join Us in Transforming Mental Health
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Whether you're seeking support, looking to partner, or want to make a difference — we're here for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Services
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default About;
