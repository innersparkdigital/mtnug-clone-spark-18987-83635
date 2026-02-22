import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, MessageSquare, Shield, Star, Users, Video, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import PreAssessmentModal from "@/components/PreAssessmentModal";
import BookingFormModal from "@/components/BookingFormModal";
import { useBookingFlow } from "@/hooks/useBookingFlow";

const BookTherapist = () => {
  const { 
    startBooking, 
    closeFlow, 
    actionType,
    isAssessmentModalOpen,
    isBookingFormOpen,
  } = useBookingFlow();

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Book a Therapist Online - Schedule Therapy Session Today",
    "description": "Book a licensed therapist online today. Schedule your therapy appointment in minutes. Video, voice, and chat sessions available globally.",
    "url": "https://www.innersparkafrica.com/book-therapist"
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Book Therapy Appointment",
    "description": "Schedule a therapy session with a licensed mental health professional. Same-day appointments available.",
    "provider": {
      "@type": "MedicalOrganization",
      "name": "Innerspark Africa",
      "url": "https://www.innersparkafrica.com"
    },
    "serviceType": "Therapy Appointment Booking",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How quickly can I book a therapy session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book a therapy session in just a few minutes. Many therapists have same-day availability, so you can start getting help today."
        }
      },
      {
        "@type": "Question",
        "name": "What types of therapists can I book?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We have licensed psychologists, counselors, and psychiatrists specializing in depression, anxiety, trauma, relationships, and more."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book a therapist for an emergency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer urgent support. Contact us via WhatsApp for immediate assistance and same-day booking."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Book a Therapy Session Online – Same-Day Appointments | Innerspark</title>
        <meta name="description" content="Schedule a therapy session online in minutes. Same-day appointments with licensed counselors. Video, voice & chat options. Affordable rates from UGX 50,000." />
        <meta name="keywords" content="book therapy session, schedule therapy appointment, same-day therapy, therapy appointment online, book counselor, therapy booking" />
        <link rel="canonical" href="https://www.innersparkafrica.com/book-therapist" />
        
        <meta property="og:title" content="Book a Therapist Online | Schedule Therapy Today" />
        <meta property="og:description" content="Book a licensed therapist online in minutes. Same-day appointments available. Start your healing journey now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/book-therapist" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book a Therapist Online | Innerspark" />
        <meta name="twitter:description" content="Schedule your therapy appointment in minutes. Same-day availability with licensed therapists." />
        
        <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4" />
              Same-Day Appointments Available
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Book a Therapist <span className="text-primary">Online</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule your therapy appointment in minutes. Get matched with a licensed therapist and start your session today.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <Button size="lg" className="gap-2 text-lg px-8 py-6" onClick={startBooking}>
                <Calendar className="w-5 h-5" />
                Book Appointment Now
              </Button>
              <Link to="/specialists">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Browse Therapists
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Book in 2 Minutes
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Licensed Professionals
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Available Worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              How to Book Your Therapist
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Choose Therapist", desc: "Browse profiles and select a therapist that matches your needs", icon: Users },
                { step: "2", title: "Pick a Time", desc: "Select a date and time that works for your schedule", icon: Calendar },
                { step: "3", title: "Confirm Booking", desc: "Complete your booking via WhatsApp or online", icon: Check },
                { step: "4", title: "Start Session", desc: "Join your secure video, voice, or chat session", icon: Video }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Why Book With Innerspark?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Star,
                  title: "Top-Rated Therapists",
                  desc: "All our therapists are licensed, verified, and highly rated by clients"
                },
                {
                  icon: Clock,
                  title: "Flexible Scheduling",
                  desc: "Book sessions that fit your schedule. Evening and weekend slots available"
                },
                {
                  icon: Shield,
                  title: "Private & Secure",
                  desc: "Your sessions and information are 100% confidential and encrypted"
                },
                {
                  icon: Heart,
                  title: "Affordable Rates",
                  desc: "Quality therapy at accessible prices. Starting from $22 per session"
                },
                {
                  icon: Globe,
                  title: "Global Access",
                  desc: "Book from anywhere in the world. No geographic restrictions"
                },
                {
                  icon: MessageSquare,
                  title: "Multiple Formats",
                  desc: "Choose video, voice, or chat — whatever feels comfortable for you"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
              Book a Therapist For
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Our therapists specialize in a wide range of mental health concerns:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Depression Therapy",
                "Anxiety Counseling",
                "Trauma & PTSD",
                "Relationship Issues",
                "Stress Management",
                "Grief Counseling",
                "Addiction Support",
                "Family Therapy",
                "Couples Counseling",
                "Career Stress",
                "Self-Esteem",
                "Anger Management"
              ].map((specialty, index) => (
                <div key={index} className="bg-background rounded-lg p-3 text-center border border-border hover:border-primary/50 transition-colors">
                  <span className="text-foreground text-sm font-medium">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgent CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Session?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Take the first step today. Book a licensed therapist and start your journey to better mental health.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={startBooking}>
              Book Now
            </Button>
            <Link to="/specialists">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View All Therapists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Booking FAQs
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How quickly can I book a therapy session?",
                  a: "You can book a therapy session in just a few minutes. Many therapists have same-day availability, so you can start getting help today."
                },
                {
                  q: "What types of therapists can I book?",
                  a: "We have licensed psychologists, counselors, and psychiatrists specializing in depression, anxiety, trauma, relationships, and more."
                },
                {
                  q: "Can I book a therapist for an emergency?",
                  a: "Yes, we offer urgent support. Contact us via WhatsApp for immediate assistance and same-day booking."
                },
                {
                  q: "How do I reschedule my appointment?",
                  a: "Simply contact us via WhatsApp or message your therapist directly to reschedule. We offer flexible rescheduling options."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookTherapist;
