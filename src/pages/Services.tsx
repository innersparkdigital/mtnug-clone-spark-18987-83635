import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import servicesHero from "@/assets/services-hero.jpg";
import virtualTherapy from "@/assets/virtual-therapy-service.jpg";
import supportGroups from "@/assets/support-groups-service.jpg";
import wellnessResources from "@/assets/wellness-resources-service.jpg";
import corporateWellness from "@/assets/corporate-wellness-service.jpg";
import testimonialBrian from "@/assets/testimonial-brian.jpg";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-deep/10 to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Mental Health Support That Fits Your Life
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                At Innerspark Africa, we make therapy, community support, and wellness resources accessible anytime, anywhere. Whether you're an individual, student, or organization, we have the right tools to help you heal, grow, and thrive.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/256780570987" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Book a Session</Button>
                </a>
                <a href="https://wa.me/256780570987" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">Join a Support Group</Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src={servicesHero} 
                alt="Mental health services" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Therapy */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={virtualTherapy} 
                alt="Virtual therapy session" 
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Virtual Therapy
              </h2>
              <p className="text-xl text-primary mb-4">
                Private, Professional Therapy from Anywhere
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect instantly with licensed therapists for one-on-one sessions through secure video or audio calls. Whether you're facing stress, anxiety, depression, or burnout, our therapists are available to listen, guide, and support your recovery journey — confidentially and conveniently.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Flexible scheduling (weekday & weekend options)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Secure, encrypted sessions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Affordable rates with multiple payment plans</p>
                </div>
              </div>
              <Link to="/virtual-therapy">
                <Button size="lg">Book a Therapist Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Support Groups
              </h2>
              <p className="text-xl text-primary mb-4">
                Heal Together, Grow Together
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join therapist-led peer groups designed around specific challenges like depression, addiction recovery, grief, or workplace stress. Each group provides a safe space to share, learn coping tools, and connect with others who understand your journey.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Weekly or monthly sessions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Moderated by licensed therapists</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Affordable subscription plans</p>
                </div>
              </div>
              <Link to="/support-groups">
                <Button size="lg" variant="secondary">Explore Support Circles</Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src={supportGroups} 
                alt="Support group session" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Resources */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={wellnessResources} 
                alt="Wellness resources and tools" 
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Wellness Resources
              </h2>
              <p className="text-xl text-primary mb-4">
                Tools for Daily Self-Care and Growth
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access practical tools like mood tracking, guided journaling, wellness challenges, and meditation audios — all designed to improve your emotional well-being and build consistent mental health habits.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Daily mood check-ins</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Self-reflection and progress tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Calming meditations & affirmations</p>
                </div>
              </div>
              <Link to="/mood-check-in">
                <Button size="lg">Start Your Daily Check-In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Wellness */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Corporate Wellness
              </h2>
              <p className="text-xl text-primary mb-4">
                Empower Your Team's Mental Health
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Innerspark partners with organizations, schools, and institutions to create healthier workplaces through customized Employee Assistance Programs (EAPs), training workshops, and digital wellness tools.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Employee Assistance Programs (EAPs)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Stress & burnout management workshops</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Mental health awareness training</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-foreground">Organizational wellness reports</p>
                </div>
              </div>
              <Link to="/contact">
                <Button size="lg" variant="secondary">Partner With Us</Button>
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src={corporateWellness} 
                alt="Corporate wellness program" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            What Our Clients Say
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 flex-shrink-0">
                  <img 
                    src={testimonialBrian} 
                    alt="Brian from Kampala" 
                    className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
                <div>
                  <p className="text-lg md:text-xl text-foreground mb-4 italic leading-relaxed">
                    "Innerspark's support group changed how I manage stress — it feels like family."
                  </p>
                  <p className="text-muted-foreground font-semibold">
                    — Brian, Kampala
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-r from-primary via-purple-deep to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether for yourself, your team, or your community — Innerspark Africa is here to support you every step of the way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/256780570987" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Book a Session
              </Button>
            </a>
            <a href="https://wa.me/256780570987" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join a Group
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default Services;
