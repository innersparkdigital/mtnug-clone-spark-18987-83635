import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import worldMentalHealthImage from "@/assets/world-mental-health-day.png";

const WorldMentalHealthDayPost = () => {
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
                <span className="text-sm text-muted-foreground">October 8th, 2024</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                World Mental Health Day Workshop: Prioritizing Workplace Mental Health
              </h1>
              <p className="text-lg text-muted-foreground">
                Location: National ICT Innovation Hub, Nakawa | Participants: 50 professionals from government, private sector, academia, and healthcare
              </p>
            </div>

            <img 
              src={worldMentalHealthImage} 
              alt="World Mental Health Day workshop at National ICT Innovation Hub" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                In commemoration of World Mental Health Day 2024, Innerspark, in collaboration with the National ICT Innovation Hub and MindLyfe Limited, hosted a transformative workshop under the theme "Let's Prioritize Mental Health in the Workplace." The event brought together diverse professionals to discuss how mental wellness directly impacts productivity, innovation, and organizational culture.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                A Collective Conversation on Workplace Wellness
              </h2>
              <p className="text-foreground mb-4">
                The session featured a blend of personal testimonies, a dynamic expert panel, and interactive group discussions designed to unpack the realities of mental health in Uganda's evolving work environments.
              </p>
              <p className="text-foreground mb-4">
                Speakers shared personal and professional insights on navigating stress, preventing burnout, and building supportive workplace ecosystems that prioritize empathy and balance.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Engaging Activities and Shared Experiences
              </h2>
              <p className="text-foreground mb-4">
                Participants actively engaged in breakout sessions focused on:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>Burnout prevention and recovery</li>
                <li>Reducing stigma and promoting open dialogue</li>
                <li>Developing sustainable workplace wellness strategies</li>
              </ul>
              <p className="text-foreground mb-4">
                Through these interactive exercises, attendees were encouraged to reflect on their own experiences and collaborate on practical ways to make mental wellness an institutional priority.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Strengthening Collaboration Across Sectors
              </h2>
              <p className="text-foreground mb-4">
                The workshop fostered multi-sectoral collaboration, connecting professionals from ICT, health, education, and corporate sectors to share best practices and explore future partnerships.
              </p>
              <p className="text-foreground mb-4">
                The discussions sparked growing interest in follow-up programs such as Burnout Prevention Training and Employee Assistance Programs (EAPs) — signaling a collective commitment to creating mentally healthy workplaces.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                Innerspark's Continuing Mission
              </h2>
              <p className="text-foreground mb-4">
                At Innerspark, we believe that mental health is the foundation of sustainable productivity and innovation. This World Mental Health Day event reaffirmed our dedication to helping organizations build emotionally intelligent, resilient, and supportive work cultures.
              </p>
              <p className="text-foreground font-semibold">
                Together, we can create a future where mental wellness is not just acknowledged — but actively prioritized in every workplace.
              </p>
            </div>
          </div>
        </div>
      </article>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default WorldMentalHealthDayPost;
