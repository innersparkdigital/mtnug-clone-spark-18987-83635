import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import miicImage from "@/assets/miic-mental-health.png";

const MIICPost = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/events-training" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events & Training</span>
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded">
                  PRESS
                </span>
                <span className="text-sm text-muted-foreground">August 1st, 2025</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Fostering Wellness in Innovation: Innerspark Conducts Mental Health Awareness Session at MIIC
              </h1>
              <p className="text-lg text-muted-foreground">
                Location: Makerere Innovation & Incubation Center (MIIC), Uganda | Participants: 20 staff & startup support members
              </p>
            </div>

            <img 
              src={miicImage} 
              alt="Mental health awareness session at MIIC" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                At the heart of every thriving startup ecosystem lies a simple truth — innovation flourishes where minds are healthy and supported. On August 1st, 2025, Innerspark partnered with the Makerere Innovation & Incubation Center (MIIC) to deliver a powerful Mental Health Awareness Session focused on promoting workplace mental well-being among staff and startup support teams.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Building Mental Resilience in the Startup Space
              </h2>
              <p className="text-foreground mb-4">
                As part of MIIC's Startup Advisory Program, the session explored how mental health directly influences creativity, productivity, and service delivery. Facilitators from Innerspark led engaging discussions on recognizing stress, managing burnout, and creating emotionally safe work environments — key elements for sustaining innovation and leadership in high-pressure startup settings.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Creating Conversations That Matter
              </h2>
              <p className="text-foreground mb-4">
                Participants reflected on the challenges of balancing personal wellness with the demands of supporting startups. Through interactive activities, they learned practical techniques for emotional regulation, time management, and peer support.
              </p>
              <p className="text-foreground mb-4">
                The session also encouraged open dialogue about mental health stigma, emphasizing that wellness is not a luxury — it's a leadership strategy.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Impact Beyond the Room
              </h2>
              <p className="text-foreground mb-4">
                The training not only strengthened the mental wellness capacity of the 20 participants but also sparked a wider conversation on social media under the hashtag #MIICStartups, amplifying the message across Uganda's innovation ecosystem.
              </p>
              <p className="text-foreground mb-4">
                This demonstrated MIIC's institutional commitment to wellness and sustainable innovation, reinforcing the idea that mental health is integral to both individual success and organizational growth.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Innerspark's Ongoing Mission
              </h2>
              <p className="text-foreground mb-4">
                Innerspark continues to champion mental wellness in workplaces, schools, and communities through awareness sessions, Employee Assistance Programs (EAPs), and digital support initiatives. Our goal is to ensure that every professional — from startup founders to support staff — has access to the tools and support needed to thrive both mentally and professionally.
              </p>
              <p className="text-foreground font-semibold">
                Together, we're building workplaces where innovation starts from within.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
};

export default MIICPost;
