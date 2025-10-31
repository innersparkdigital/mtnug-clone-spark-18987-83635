import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Calendar } from "lucide-react";
import truckDriversImage from "@/assets/truck-drivers-training.png";
import foundersMindsetImage from "@/assets/founders-mindset-training.png";

const EventsTraining = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Innerspark Events & Training
            </h1>
            <p className="text-xl text-muted-foreground">
              Stories from our community programs and wellness initiatives
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Blog Post 1 */}
            <article className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
              <img 
                src={truckDriversImage} 
                alt="Truck drivers attending training session" 
                className="w-full h-96 object-cover"
              />
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Preparing Truck Drivers for Life Beyond the Road: A Journey of Empowerment and Transition
                </h2>
                <p className="text-muted-foreground mb-6">
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
            </article>

            {/* Blog Post 2 */}
            <article className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
              <img 
                src={foundersMindsetImage} 
                alt="Startup founders attending wellness program" 
                className="w-full h-96 object-cover"
              />
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Shaping the Founder's Mindset at the National ICT Innovation Hub
                </h2>
                <p className="text-foreground mb-4">
                  Through our Startup Wellness Program, Innerspark in partnership with Dr. Lisa Tumwine from LILA Haven and Martin Tumwine from Zaantu Capital had the privilege of engaging with 30+ startup founders on a journey of self-discovery and alignment.
                </p>
                <p className="text-foreground mb-4">
                  Using the LILA Method (Listen – Illuminate – Liberate – Align), we explored the founder's mindset and guided entrepreneurs to reflect deeply on five key pillars of life:
                </p>
                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-foreground font-medium">✨ Work</span>
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-foreground font-medium">✨ Learning</span>
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-foreground font-medium">✨ Rest</span>
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-foreground font-medium">✨ Health</span>
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-foreground font-medium">✨ Family</span>
                </div>
                <p className="text-foreground mb-4">
                  We invited founders to map their current reality against their ideal life — a simple but powerful exercise that revealed hidden truths.
                </p>
                <div className="bg-muted p-6 rounded-lg mb-4 border-l-4 border-primary">
                  <p className="text-foreground italic mb-2">💬 "I felt like I was buried spiritually."</p>
                  <p className="text-foreground italic">💬 "Why did I even start?"</p>
                </div>
                <p className="text-foreground mb-4">
                  These raw reflections uncovered the unseen weight of entrepreneurship — the doubts, blind spots, and stress triggers often left unspoken.
                </p>
                <p className="text-foreground mb-4">
                  Yet, they also opened the door for growth: helping founders realign their personal vision with their business mission. Because when founders heal, businesses thrive.
                </p>
                <p className="text-foreground mb-4">
                  A big thank you to Dr. Lisa Tumwine and the National ICT Innovation Hub for creating space where innovation meets wellbeing.
                </p>
                <p className="text-foreground font-semibold">
                  We are excited to extend the Startup Wellness Program to other innovation hubs, accelerators, incubators, and organizations that want to empower founders with resilience, balance, and purpose-driven growth. Let's collaborate to build stronger businesses by investing in the wellbeing of their leaders.
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default EventsTraining;
