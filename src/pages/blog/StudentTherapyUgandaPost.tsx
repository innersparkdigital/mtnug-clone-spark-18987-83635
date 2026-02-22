import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import RelatedArticles from "@/components/RelatedArticles";
import { ArrowLeft, Calendar, Clock, CheckCircle, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import stressHeroImage from "@/assets/blog/stress-management-hero.jpg";

const StudentTherapyUgandaPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Best Therapy Options for University Students in Uganda (2026 Guide)",
    description: "University students in Uganda face unique mental health challenges. Discover affordable therapy options, free counseling resources, and how to get help while at school.",
    image: "https://www.innersparkafrica.com/innerspark-logo.png",
    author: { "@type": "Organization", name: "Innerspark Africa", url: "https://www.innersparkafrica.com" },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: "https://www.innersparkafrica.com/innerspark-logo.png" } },
    datePublished: "2026-02-22",
    dateModified: "2026-02-22",
    inLanguage: "en",
    keywords: ["student therapy Uganda", "university counseling Uganda", "student mental health", "affordable therapy students", "Makerere counseling"],
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.innersparkafrica.com/blog/student-therapy-uganda" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can university students in Uganda get free therapy?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Most universities in Uganda including Makerere, Kyambogo, and UCU offer free counseling services through their Dean of Students offices. Online platforms like Innerspark Africa also offer free initial consultations and affordable sessions from UGX 30,000." }
      },
      {
        "@type": "Question",
        name: "What mental health issues do Ugandan university students face?",
        acceptedAnswer: { "@type": "Answer", text: "Common issues include academic stress, exam anxiety, depression, relationship problems, financial pressure, substance use, identity struggles, and adjustment difficulties, especially for students from rural areas." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Best Therapy Options for University Students in Uganda | Innerspark Africa</title>
        <meta name="description" content="University students in Uganda can access affordable therapy from UGX 30,000. Discover free campus counseling, online therapy, and student mental health resources." />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog/student-therapy-uganda" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />
      <main>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </nav>

          <header className="mb-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Student Mental Health</span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">Best Therapy Options for University Students in Uganda (2026 Guide)</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> February 22, 2026</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 9 min read</span>
            </div>
            <img src={stressHeroImage} alt="University student mental health in Uganda" className="w-full rounded-xl aspect-video object-cover" />
          </header>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground leading-relaxed">
              University life in Uganda brings excitement — and enormous pressure. A <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8266549/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">2021 study</a> found that <strong>over 30% of Ugandan university students</strong> experience depression or anxiety symptoms. Yet most never seek help. Here are the best therapy options available to you.
            </p>

            <h2>The Student Mental Health Crisis in Uganda</h2>
            <p>
              Between academic pressure, financial stress, relationship challenges, and uncertain career prospects, Ugandan students face a perfect storm of mental health risks:
            </p>
            <div className="bg-accent/50 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Student Mental Health Statistics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-3xl font-bold text-primary">35%</p>
                  <p className="text-sm text-muted-foreground">of Ugandan students report anxiety symptoms</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-3xl font-bold text-primary">28%</p>
                  <p className="text-sm text-muted-foreground">report depression symptoms</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-3xl font-bold text-primary">70%</p>
                  <p className="text-sm text-muted-foreground">cite academic stress as a primary concern</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-3xl font-bold text-primary">90%</p>
                  <p className="text-sm text-muted-foreground">have never spoken to a counselor</p>
                </div>
              </div>
            </div>

            <h2>1. Campus Counseling Services (Free)</h2>
            <p>Most Ugandan universities offer free counseling through the Dean of Students' office:</p>
            <ul>
              <li><strong>Makerere University:</strong> Counseling and Guidance Centre, Senate Building</li>
              <li><strong>Kyambogo University:</strong> Student Affairs counseling services</li>
              <li><strong>Uganda Christian University:</strong> Chaplaincy and wellness programs</li>
              <li><strong>Mbarara University:</strong> Student counseling unit</li>
              <li><strong>IUIU:</strong> Guidance and counseling department</li>
            </ul>
            <p><em>Limitation:</em> Campus counselors are often overwhelmed with long wait times. If you need faster access, consider online options.</p>

            <h2>2. Online Therapy (From UGX 30,000)</h2>
            <p>
              Online therapy is the most practical option for busy students. <Link to="/" className="text-primary hover:underline">Innerspark Africa</Link> offers:
            </p>
            <div className="space-y-3 my-4">
              {[
                "Sessions from UGX 30,000 — less than a night out",
                "Video, voice, or chat — your choice",
                "Evening and weekend availability around class schedules",
                "Complete privacy — no one knows you're in therapy",
                "Therapists who understand student-specific challenges"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <h2>3. Peer Support Groups</h2>
            <p>
              Sometimes talking to peers who understand your experience is exactly what you need. <Link to="/support-groups" className="text-primary hover:underline">Innerspark's support groups</Link> connect you with other young adults navigating similar challenges — facilitated by a licensed therapist for as little as UGX 15,000.
            </p>

            <h2>4. Self-Help Tools</h2>
            <p>
              While not a substitute for professional help, these free tools can complement your mental health journey:
            </p>
            <ul>
              <li><Link to="/mind-check" className="text-primary hover:underline">Mind-Check assessments</Link> — understand your anxiety, depression, or stress levels</li>
              <li><Link to="/meditations" className="text-primary hover:underline">Guided meditations</Link> — manage exam stress and improve sleep</li>
              <li><Link to="/mood-check-in" className="text-primary hover:underline">Mood tracking</Link> — identify patterns in your emotional health</li>
            </ul>

            <h2>5. Crisis Support</h2>
            <p>
              If you're in immediate distress, don't wait for an appointment:
            </p>
            <ul>
              <li>Call <strong>0792 085 773</strong> (Innerspark crisis support)</li>
              <li>Visit the <Link to="/emergency-support" className="text-primary hover:underline">Emergency Support page</Link></li>
              <li>Go to Butabika Hospital emergency or your campus health center</li>
            </ul>

            <h2>Common Issues Students Seek Therapy For</h2>
            <ul>
              <li><strong>Exam anxiety and academic stress</strong> — fear of failure, perfectionism</li>
              <li><strong>Depression</strong> — especially during semester breaks and after results</li>
              <li><strong>Relationship issues</strong> — breakups, family conflicts, loneliness</li>
              <li><strong>Financial stress</strong> — tuition worries, lack of pocket money</li>
              <li><strong>Identity and purpose</strong> — career confusion, self-doubt</li>
              <li><strong>Substance use</strong> — alcohol, cannabis, prescription drug misuse</li>
              <li><strong>Grief and loss</strong> — losing a parent or loved one during university</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <div className="space-y-6 my-8">
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">Can university students in Uganda get free therapy?</h3>
                <p className="text-muted-foreground">Yes. Most universities offer free counseling through the Dean of Students. Online platforms also offer free consultations and affordable sessions from UGX 30,000.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-bold mb-2">What mental health issues do Ugandan students face?</h3>
                <p className="text-muted-foreground">Common issues include academic stress, exam anxiety, depression, relationship problems, financial pressure, substance use, and adjustment difficulties.</p>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Student? Get Affordable Therapy Today</h2>
            <p className="text-primary-foreground/85 mb-6 max-w-lg mx-auto">
              Sessions from UGX 30,000. Therapists who understand student life. Book in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full font-bold px-8">
                <Link to="/specialists">Book a Session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-bold px-8 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/256792085773?text=Hi,%20I'm%20a%20student%20and%20I'd%20like%20to%20talk%20to%20a%20therapist" target="_blank" rel="noopener noreferrer">
                  Free Consultation
                </a>
              </Button>
            </div>
          </div>

          <SocialShareButtons title="Best Therapy Options for University Students in Uganda" url="https://www.innersparkafrica.com/blog/student-therapy-uganda" />
          <RelatedArticles currentSlug="student-therapy-uganda" />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default StudentTherapyUgandaPost;
