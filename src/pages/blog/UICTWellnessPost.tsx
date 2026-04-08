import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { Calendar, MapPin, Users } from "lucide-react";
import uictWellnessImage from "@/assets/uict-wellness-activity.jpg";

const UICTWellnessPost = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <img 
              src={uictWellnessImage} 
              alt="UICT Wellness Activity Day participants" 
              className="w-full h-[400px] object-cover rounded-lg shadow-xl"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>29th–30th October 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Uganda Institute of Communication Technology (UICT)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>~50 students</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            UICT Wellness Activity Day – Mental Health Is in the Palm of Your Hands
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              In a world where academic and social pressures are growing, Innerspark continues to champion mental health awareness across learning institutions. The UICT Wellness Activity Day, held on October 29th and 30th, 2025, brought together students and staff under the theme "Mental Health Is in the Palm of Your Hands – Awareness of Mental Health in Everyday Life."
            </p>

            <p className="mb-6">
              The two-day event combined interactive mental health training with individual counseling sessions, empowering participants to prioritize their physical, emotional, and cognitive wellness.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">📚 Day 1: Interactive Wellness Training</h2>
            
            <p className="mb-6">
              Facilitators Elizabeth and Julius Kizito led two engaging sessions that addressed different aspects of wellness.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Part 1 – Physical, Social & Relationship Wellness (Facilitator: Elizabeth)</h3>
            
            <p className="mb-6">
              Participants explored how exercise, nutrition, rest, and hygiene influence mental alertness and overall wellbeing. The session also delved into social and relationship wellness, emphasizing the role of healthy friendships and emotional safety.
            </p>

            <p className="mb-6">
              A hands-on activity — "The Making Room Balloon Challenge" — helped students understand how stress overload affects performance and how teamwork and pacing can serve as effective coping mechanisms.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Part 2 – Emotional, Psychological & Cognitive Wellness (Facilitator: Julius Kizito)</h3>
            
            <p className="mb-6">
              Julius guided students through emotional awareness, stress and anxiety management, and the importance of peer support and counseling. He also addressed time management, procrastination, and mental flexibility, using an experiential game — "The Unhooking Challenge" — to demonstrate how to detach from negative thoughts.
            </p>

            <p className="mb-6">
              The energy and engagement in the room were remarkable, with students asking meaningful questions about coping with academic stress, emotional pain, and anxiety.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">💬 Day 2: Individual Counseling Sessions</h2>
            
            <p className="mb-6">
              On the second day, Innerspark conducted four individual student sessions and one for a staff member, addressing issues such as anxiety, depression, grief, suicidal ideation, and interpersonal conflicts.
            </p>

            <p className="mb-6">
              The demand for more counseling revealed a deeper truth — mental health stigma still prevents many from seeking help, and one day of intervention isn't enough to meet all needs.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">🔍 Key Observations & Lessons</h2>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Many students experience academic and emotional challenges that require ongoing psychological support.</li>
              <li>Mental health stigma remains a key barrier to counseling uptake.</li>
              <li>Staff members also benefit from structured wellness interventions.</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">💡 Recommendations</h2>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Conduct regular mental health awareness and coping skills workshops, especially targeting first-year students.</li>
              <li>Introduce staff wellness programs to support emotional resilience within the institution.</li>
              <li>Recruit trained campus counselors to provide continuous psychological support.</li>
              <li>Train faculty and administrative staff to identify early warning signs and refer students compassionately for professional help.</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground">🌟 Innerspark's Commitment</h2>
            
            <p className="mb-6">
              At Innerspark, we believe mental health is not a luxury but a necessity for learning, productivity, and community building. Our collaboration with UICT reflects our dedication to creating safe, supportive, and stigma-free spaces where both students and staff can grow emotionally and intellectually.
            </p>

            <p className="text-lg font-semibold text-primary">
              Because true wellness begins in the mind — and the power to nurture it lies in our hands. 🤲
            </p>
          </div>
        </div>
      </article>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default UICTWellnessPost;
