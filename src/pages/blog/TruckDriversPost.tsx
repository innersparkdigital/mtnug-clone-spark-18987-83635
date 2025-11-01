import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import truckDriversImage from "@/assets/truck-drivers-training.png";

const TruckDriversPost = () => {
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
                <span className="text-sm text-muted-foreground">July 2024</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Preparing Truck Drivers for Life Beyond the Road: A Journey of Empowerment and Transition
              </h1>
            </div>

            <img 
              src={truckDriversImage} 
              alt="Truck drivers attending training session" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-6">
                For many truck drivers, the road is more than a workplace — it's a way of life. But what happens when the journey shifts from highways to a new horizon called retirement?
              </p>
              
              <p className="text-foreground mb-4">
                In July, at the Nakawa National Innovation Hub, Markh Investment Ltd, with support from Inner Spark Recovery, held a six-day program to prepare truck drivers for this life transition. The goal was simple but profound: to equip participants with the tools, knowledge, and confidence to thrive beyond their driving careers.
              </p>
              
              <h3 className="text-2xl font-semibold mb-3 text-foreground mt-6">
                A Holistic Vision of Retirement
              </h3>
              <p className="text-foreground mb-4">
                The training addressed the practical, emotional, and social aspects of leaving the workforce. Participants explored:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground mb-4 ml-4">
                <li><strong>Mindset and Vision:</strong> Defining life after the wheel and embracing change with purpose.</li>
                <li><strong>Financial Fitness:</strong> Managing retirement income, budgeting, and avoiding scams that often target retirees.</li>
                <li><strong>Health and Wellness:</strong> Sustaining physical strength, emotional resilience, and mental well-being after years on the road.</li>
                <li><strong>Legal Preparedness:</strong> Understanding asset protection, will drafting, and the importance of powers of attorney.</li>
              </ul>
              <p className="text-foreground mb-4">
                Through lectures, group discussions, role-plays, and one-on-one counseling, drivers built not just knowledge, but a renewed sense of self-worth.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-foreground mt-6">
                Listening to Voices That Matter
              </h3>
              <p className="text-foreground mb-4">
                The most powerful part of the program was the honest feedback from participants. They asked for earlier preparation — ideally a year before retirement — and for tailored sessions to address the unique challenges faced by female truck drivers. They also voiced the importance of better workplace communication and burnout prevention for all employees.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-foreground mt-6">
                Impact That Lasts
              </h3>
              <p className="text-foreground mb-4">
                By the end, drivers left with a clearer vision of their next chapter and the confidence to navigate it. This wasn't just about planning finances or legal documents; it was about preserving dignity, purpose, and community in the next stage of life.
              </p>
              <p className="text-foreground mb-4">
                At Inner Spark Recovery, we believe transitions like retirement are milestones worth honoring. With the right resources, empathy, and preparation, the road ahead can be just as fulfilling as the miles already traveled.
              </p>
              <p className="text-foreground">
                If you've ever been part of a major career shift — or helped others through one — you know it's not just a change in work, but a change in identity. Let's keep building programs that prepare people not just to survive transitions, but to thrive in them.
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

export default TruckDriversPost;
