import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import mtnImage from "@/assets/mtn-internship.png";

const MTNPost = () => {
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
                <span className="text-sm text-muted-foreground">July 11th, 2025</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Managing Anxiety During Internship – MTN Uganda
              </h1>
              <p className="text-lg text-muted-foreground">
                Location: MTN Uganda Headquarters | Participants: 50 Career ACE Interns
              </p>
            </div>

            <img 
              src={mtnImage} 
              alt="MTN Uganda Career ACE internship mental health session" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                As part of MTN Uganda's Career ACE Internship Program, Innerspark facilitated an engaging and impactful session on "Managing Anxiety During Internship" — designed to equip young professionals with the emotional resilience and coping tools needed to thrive in high-performance corporate environments.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Understanding Anxiety in Career Transitions
              </h2>
              <p className="text-foreground mb-4">
                Interns were introduced to the concept of anxiety as a normal stress response, especially during transitions such as internships or first-time work experiences. The session emphasized that while mild anxiety can enhance focus and motivation, unmanaged anxiety can lead to burnout, disengagement, and decreased productivity.
              </p>
              <p className="text-foreground mb-4">
                Through relatable examples, facilitators connected psychological principles to real workplace challenges — helping participants recognize triggers and adopt healthier coping strategies.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Learning in Context
              </h2>
              <p className="text-foreground mb-4">
                The training addressed specific challenges faced by interns, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>Fear of underperformance or making mistakes</li>
                <li>Uncertainty about future career direction</li>
                <li>Self-doubt and imposter syndrome</li>
                <li>Pressure to impress or stand out</li>
              </ul>
              <p className="text-foreground mb-4">
                By acknowledging these shared experiences, the session created a safe environment for open dialogue, validation, and mutual support.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Practical Coping Tools for Everyday Use
              </h2>
              <p className="text-foreground mb-4">
                Interns practiced practical tools they could immediately apply both at work and in personal life:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>Breaking large tasks into smaller, achievable goals</li>
                <li>Mindfulness and deep breathing to manage stress in real-time</li>
                <li>Open communication with supervisors and mentors</li>
                <li>Journaling and celebrating small wins to build confidence</li>
              </ul>
              <p className="text-foreground mb-4">
                These strategies encouraged a proactive approach to maintaining mental balance during demanding work periods.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Global & Local Perspectives
              </h2>
              <p className="text-foreground mb-4">
                Participants were introduced to World Health Organization (WHO) data showing that 301 million people globally are affected by anxiety disorders, with a 25% increase post-COVID-19. This placed their experience in a broader context — underscoring the importance of early mental health care in shaping sustainable careers.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Building Mentally Resilient Future Leaders
              </h2>
              <p className="text-foreground mb-4">
                Through this partnership, MTN Uganda and Innerspark continue to champion mental wellness as a pillar of career development. By empowering interns to understand and manage anxiety, this initiative nurtures a new generation of emotionally intelligent, self-aware, and resilient professionals ready to take on tomorrow's challenges.
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

export default MTNPost;
