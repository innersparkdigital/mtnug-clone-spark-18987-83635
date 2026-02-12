import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Users, Check, Shield, Calendar, Heart, MessageCircle, Clock, Globe } from "lucide-react";
import { T } from "@/components/Translate";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";

const SupportGroups = () => {
  const { 
    startBooking,
    startGroup, 
    closeFlow, 
    actionType,
    isAssessmentModalOpen,
    isBookingFormOpen,
    isGroupFormOpen,
  } = useBookingFlow();
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Mental Health Support Groups in Africa",
    "description": "Join professionally moderated mental health support groups for depression, anxiety, grief, addiction, and more. Connect with others who understand your journey.",
    "url": "https://www.innersparkafrica.com/support-groups",
    "specialty": "Psychiatry",
    "about": {
      "@type": "MedicalCondition",
      "name": "Mental Health Conditions"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mental Health Support Groups",
    "alternateName": ["Peer Support Groups", "Group Therapy", "Online Support Groups", "Mental Health Community"],
    "description": "Professionally moderated peer support groups for mental health. Join safe, confidential group sessions for depression, anxiety, grief, addiction, and other challenges.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Group Therapy",
    "areaServed": {
      "@type": "Continent",
      "name": "Africa"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "People seeking mental health support"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are mental health support groups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mental health support groups are safe spaces where people facing similar challenges come together to share experiences, coping strategies, and emotional support. Our groups are professionally moderated by licensed therapists to ensure a supportive and therapeutic environment."
        }
      },
      {
        "@type": "Question",
        "name": "Are support groups confidential?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our support groups maintain strict confidentiality. What is shared in the group stays in the group. We also offer anonymous participation options for those who prefer additional privacy."
        }
      },
      {
        "@type": "Question",
        "name": "What types of support groups are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer support groups for various challenges including depression, anxiety, grief and loss, addiction recovery, relationship issues, trauma, and more. Groups are organized by topic and sometimes by demographics (women's groups, men's groups, young adults, etc.)."
        }
      },
      {
        "@type": "Question",
        "name": "How do I join a support group?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can join a support group by contacting us via WhatsApp or browsing available groups on our platform. We'll help match you with a group that fits your needs and schedule."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.innersparkafrica.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Support Groups",
        "item": "https://www.innersparkafrica.com/support-groups"
      }
    ]
  };

  const groupTypes = [
    { name: "Depression Support", desc: "For those experiencing depression or low mood" },
    { name: "Anxiety Support", desc: "Managing anxiety, worry, and panic" },
    { name: "Grief & Loss", desc: "Coping with the loss of loved ones" },
    { name: "Addiction Recovery", desc: "Support for substance and behavioral addictions" },
    { name: "Relationship Issues", desc: "Navigating relationship challenges" },
    { name: "Trauma Survivors", desc: "Healing from traumatic experiences" },
    { name: "Stress Management", desc: "Managing work and life stress" },
    { name: "New Parents", desc: "Support for new mothers and fathers" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Mental Health Support Groups in Africa | Peer Support | Innerspark</title>
        <meta name="description" content="Join mental health support groups in Africa. Professionally moderated peer support for depression, anxiety, grief, addiction & more. Safe, confidential group sessions. Connect with others who understand." />
        <meta name="keywords" content="mental health support groups, peer support groups, group therapy Africa, depression support group, anxiety support group, grief support group, addiction support group, online support groups, mental health community, therapy groups, support circle, mental wellness groups, emotional support group, recovery groups" />
        <link rel="canonical" href="https://www.innersparkafrica.com/support-groups" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mental Health Support Groups | Peer Support | Innerspark Africa" />
        <meta property="og:description" content="Join professionally moderated mental health support groups. Safe spaces to share, heal, and connect with others facing similar challenges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/support-groups" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mental Health Support Groups | Innerspark Africa" />
        <meta name="twitter:description" content="Join peer support groups for depression, anxiety, grief, and more. Safe, confidential, professionally moderated." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Pre-Assessment Modal */}
      <PreAssessmentModal 
        isOpen={isAssessmentModalOpen} 
        onClose={closeFlow}
        actionType={actionType}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingFormOpen}
        onClose={closeFlow}
        formType="book"
      />

      {/* Group Form Modal */}
      <BookingFormModal
        isOpen={isGroupFormOpen}
        onClose={closeFlow}
        formType="group"
      />

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <T>Mental Health Support Groups</T>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              <T>Safe, professionally moderated peer spaces where you can share experiences, find understanding, and heal together. Connect with others who truly understand your journey.</T>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="gap-2" onClick={startGroup}>
                <Users className="w-5 h-5" />
                <T>Join a Group</T>
              </Button>
              <Button size="lg" variant="outline" onClick={startGroup}><T>Browse Groups</T></Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                100% Confidential
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Professionally Moderated
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                Safe & Supportive
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              <T>Benefits of Joining Support Groups</T>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Research shows that peer support significantly improves mental health outcomes and recovery.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Shield, text: "Professionally moderated safe spaces" },
                { icon: Users, text: "Connect with people facing similar challenges" },
                { icon: MessageCircle, text: "Share experiences and coping strategies" },
                { icon: Calendar, text: "Weekly scheduled group sessions" },
                { icon: Check, text: "Anonymous participation options available" },
                { icon: Heart, text: "Groups for anxiety, depression, grief, and more" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground text-lg">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Group Types Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              Available Support Groups
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Find a group that matches your needs. All groups are led by licensed mental health professionals.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupTypes.map((group, index) => (
                <div key={index} className="bg-background rounded-xl p-5 border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              How to Join a Support Group
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Find Your Group", desc: "Explore our groups based on your specific needs, challenges, and preferences" },
                { step: "2", title: "Register", desc: "Sign up for the group that resonates with you - we'll confirm your spot" },
                { step: "3", title: "Participate", desc: "Join weekly sessions and connect with your supportive community" }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            You Don't Have to Face It Alone
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join a supportive community of people who understand your journey
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={startGroup}>
              Explore Support Groups
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={startBooking}
            >
              Talk to a Therapist
            </Button>
          </div>
        </div>
      </section>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default SupportGroups;