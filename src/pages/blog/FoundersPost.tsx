import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import foundersMindsetImage from "@/assets/founders-mindset-training.webp";
import ArticleSchema from "@/components/seo/ArticleSchema";

const FoundersPost = () => {
  return (
    <div className="min-h-screen bg-[#F7F3EA]">
      <Header />
      <ArticleSchema
        headline="Founder Mental Health Training in Uganda: ICT Hub Case Study"
        description="See how InnerSpark Africa delivers founder mental health training in Uganda for burnout prevention, resilience and healthier startup leadership."
        path="/events-training/founders-mindset-training"
        datePublished="2024-09-01"
        image={foundersMindsetImage}
        section="Press"
      />
      
      <article className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/events-training" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events & Training</span>
            </Link>

            <div className="mb-10 border-b border-[#D9D0BF] pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded">
                  PRESS
                </span>
                <span className="text-sm text-muted-foreground">September 2024</span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6 text-[#111827]">
                Founder Mental Health Training in Uganda: ICT Hub Case Study
              </h1>
            </div>

            <img 
              src={foundersMindsetImage} 
              alt="Startup founders attending wellness program" 
              className="w-full aspect-[16/9] object-cover rounded-3xl shadow-sm mb-10"
            />

            <div className="prose prose-lg max-w-none text-[#1F2937] prose-headings:font-serif prose-headings:text-[#111827] prose-h2:border-t prose-h2:border-[#D9D0BF] prose-h2:pt-9 prose-p:leading-[1.85] prose-a:text-primary">
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
            <aside className="mt-12 rounded-3xl border border-[#D9D0BF] bg-white p-7 md:p-9">
              <h2 className="font-serif text-2xl font-semibold text-[#111827] mb-3">Support the founders in your programme</h2>
              <p className="text-[#4B5563] mb-5">Request a practical resilience and burnout-prevention workshop for your hub, accelerator or incubator.</p>
              <a href="/corporate/service-request" className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Request founder training</a>
            </aside>
          </div>
        </div>
      </article>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default FoundersPost;
