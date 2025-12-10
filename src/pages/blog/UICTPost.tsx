import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import uictImage from "@/assets/uict-training.png";

const UICTPost = () => {
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
                <span className="text-sm text-muted-foreground">March 19th, 2025</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Mental Health Awareness Training – Uganda Institute of Communication Technology (UICT)
              </h1>
              <p className="text-lg text-muted-foreground">
                Location: Uganda Institute of Communication Technology (UICT) | Participants: 50 students
              </p>
            </div>

            <img 
              src={uictImage} 
              alt="Mental health awareness training at UICT" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                As part of its mission to empower young people with emotional resilience and mental wellness skills, Innerspark conducted a Mental Health Awareness Training at the Uganda Institute of Communication Technology (UICT). The workshop provided a safe and open space for students to explore their emotional well-being and learn practical ways to cope with the pressures of student life.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Creating Safe Conversations Around Mental Health
              </h2>
              <p className="text-foreground mb-4">
                The session gave students an opportunity to discuss sensitive topics that often go unspoken — including academic pressure, financial struggles, relationship challenges, and anxiety. Through guided discussions and anonymous feedback forms, participants were able to express their feelings freely and gain a deeper understanding of their emotional states.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Key Insights and Coping Tools
              </h2>
              <p className="text-foreground mb-4">
                Facilitators introduced students to practical coping strategies for managing stress and building self-awareness, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>Mindfulness and relaxation techniques for reducing anxiety</li>
                <li>Journaling to reflect and process emotions</li>
                <li>Seeking peer and mentor support when overwhelmed</li>
                <li>Breaking down academic tasks into manageable goals</li>
              </ul>
              <p className="text-foreground mb-4">
                These tools helped participants recognize that mental health challenges are common and manageable with the right mindset and support systems.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Understanding the Student Mental Health Landscape
              </h2>
              <p className="text-foreground mb-4">
                Findings from the anonymous feedback revealed an average mental health rating of 4.4/10, highlighting the significant emotional and psychological challenges faced by many students. This insight reinforced the need for continuous campus-based mental health support and awareness programs.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Impact and Next Steps
              </h2>
              <p className="text-foreground mb-4">
                The session inspired students to take collective responsibility for each other's well-being. One of the most meaningful outcomes was the encouragement to form peer-led wellness support groups, such as Tuli Nawe ("We Are With You") — aimed at fostering peer support, emotional check-ins, and shared healing among students.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Innerspark's Commitment to Student Wellness
              </h2>
              <p className="text-foreground mb-4">
                Innerspark remains committed to promoting mental health awareness in academic institutions, equipping young people with the knowledge, empathy, and tools to manage life's challenges. By supporting initiatives like Tuli Nawe, we continue to nurture emotionally intelligent, resilient, and supportive learning environments across Uganda.
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

export default UICTPost;
