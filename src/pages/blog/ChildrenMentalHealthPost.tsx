import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import childrenMentalHealthImage from "@/assets/children-mental-health.jpg";

const ChildrenMentalHealthPost = () => {
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
                <span className="text-sm text-muted-foreground">9th August 2025</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Innerspark Brings Mental Health Awareness to Children at Full Gospel Primary School, Nsambya CDC
              </h1>
              <p className="text-lg text-muted-foreground">
                Facilitator: Rita Lutta, Mental Health Facilitator
              </p>
            </div>

            <img 
              src={childrenMentalHealthImage} 
              alt="Children participating in mental health awareness session" 
              className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                At Innerspark, we believe that building emotionally healthy communities begins with our children. As part of our ongoing mission to promote mental wellness across all ages, our team recently held a Children's Mental Health Awareness Session at Full Gospel Primary School, Nsambya CDC.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                🧠 Understanding Mental Health from a Child's Perspective
              </h2>
              <p className="text-foreground mb-4">
                The interactive session introduced children to the basics of mental health — what it means to feel anxious, sad, or overwhelmed — and helped them identify everyday stressors that might affect their emotional wellbeing. Using relatable examples such as schoolwork pressure, disagreements with caregivers, or loss of loved ones, facilitators guided the learners through honest discussions about their feelings.
              </p>
              <p className="text-foreground mb-4">
                Through storytelling and open sharing, many children expressed personal experiences of loss, fear, and isolation. These stories reminded everyone that mental health challenges can affect anyone, even at a young age — and that empathy, listening, and support make a difference.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                ✏️ Creative Expression as Healing
              </h2>
              <p className="text-foreground mb-4">
                Children were encouraged to draw or write about how they felt. For many, art became a safe space to express emotions that words couldn't capture. This activity revealed deep emotional insights, with some drawings indicating sadness or harmful thoughts — highlighting the need for continued psychological support and follow-up care.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                💬 Group Learning & Takeaways
              </h2>
              <p className="text-foreground mb-4">
                The children were divided into small groups to brainstorm lessons learned. Some of the strongest messages from the discussions included:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>Seeking help from family members or teachers when facing challenges.</li>
                <li>Avoiding peer pressure and negative influences such as substance use.</li>
                <li>Creating safe environments through obedience, kindness, and self-awareness.</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                💖 Impact and Recommendations
              </h2>
              <p className="text-foreground mb-4">
                Out of 54 children who participated:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground space-y-2">
                <li>27 reported feeling happy after the session,</li>
                <li>12 felt angry or sad,</li>
                <li>13 felt neutral,</li>
                <li>2 expressed mixed emotions.</li>
              </ul>
              <p className="text-foreground mb-4">
                Innerspark recommends continuous engagement and follow-up counseling sessions, especially for children who exhibited signs of distress. We also emphasize the need for parent and teacher training to help caregivers recognize and respond early to emotional warning signs among children.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
                🌍 Our Commitment
              </h2>
              <p className="text-foreground mb-4">
                This initiative is part of Innerspark's broader mission to make mental health support accessible and stigma-free for all. We remain dedicated to nurturing resilience in children through awareness, art therapy, storytelling, and continuous care.
              </p>
              <p className="text-foreground font-semibold">
                Together, we can raise a generation that understands and values mental health as an essential part of life.
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

export default ChildrenMentalHealthPost;
