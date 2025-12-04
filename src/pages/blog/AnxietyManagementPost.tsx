import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import heroImage from "@/assets/blog/anxiety-management-hero.jpg";
import groundingInfographic from "@/assets/blog/grounding-technique-infographic.png";

const AnxietyManagementPost = () => {
  const postUrl = "https://innerspark.africa/blog/how-to-manage-anxiety";
  const postTitle = "How Do I Manage Anxiety? Practical Tools to Feel Calmer Every Day";

  return (
    <>
      <Helmet>
        <title>How Do I Manage Anxiety? Practical Tools to Feel Calmer Every Day | Innerspark</title>
        <meta name="description" content="Discover expert-backed strategies to manage anxiety effectively. Learn practical coping techniques, lifestyle changes, and when to seek professional help for anxiety disorders." />
        <meta name="keywords" content="anxiety management, anxiety relief, calm anxiety, anxiety coping strategies, mental health, anxiety tips, manage worry" />
        <link rel="canonical" href={postUrl} />
        
        <meta property="og:title" content="How Do I Manage Anxiety? Practical Tools" />
        <meta property="og:description" content="Discover expert-backed strategies to manage anxiety effectively with practical coping techniques." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Do I Manage Anxiety?" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": postTitle,
            "description": "Discover expert-backed strategies to manage anxiety effectively.",
            "author": { "@type": "Organization", "name": "Innerspark Africa" },
            "publisher": { "@type": "Organization", "name": "Innerspark Africa" },
            "datePublished": "2025-12-04",
            "dateModified": "2025-12-04"
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between anxiety and an anxiety disorder?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Normal anxiety is temporary and tied to specific situations. An anxiety disorder involves persistent, excessive worry that interferes with daily life for six months or more."
                }
              },
              {
                "@type": "Question",
                "name": "Can anxiety be cured?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While anxiety may not be completely eliminated, it can be effectively managed through therapy, lifestyle changes, and sometimes medication."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to see improvement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "With consistent practice of coping techniques, many people notice improvements within 4-8 weeks. Professional therapy typically shows results within 12-16 sessions."
                }
              }
            ]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://innerspark.africa" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://innerspark.africa/blog" },
              { "@type": "ListItem", "position": 3, "name": "How Do I Manage Anxiety?", "item": postUrl }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      
      <main>
        <article className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <nav className="mb-8">
              <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </nav>

            <header className="max-w-4xl mx-auto mb-12">
              <div className="mb-6">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
                  Anxiety Management
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                How Do I Manage Anxiety? Practical Tools to Feel Calmer Every Day
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Anxiety is one of the most common mental health challenges, but it doesn't have to control your life. Learn evidence-based strategies to reduce worry, calm your nervous system, and build long-term resilience.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Innerspark Africa
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  December 4, 2025
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  12 min read
                </span>
              </div>
              
              <SocialShareButtons url={postUrl} title={postTitle} />
            </header>

            <div className="max-w-4xl mx-auto mb-12">
              <img 
                src={heroImage} 
                alt="Person feeling calm and peaceful while practicing anxiety management techniques"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
              <h2>Introduction: Understanding Anxiety</h2>
              <p>
                Anxiety is your body's natural alarm system—a feeling of fear or worry about what might happen. While some anxiety is normal and even helpful (it can motivate you to prepare for challenges), too much anxiety can interfere with daily life.
              </p>
              <p>
                According to the{" "}
                <a href="https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                  World Health Organization
                </a>, anxiety disorders affect over 300 million people worldwide, making them the most common mental health condition globally.
              </p>
              <p>The good news? Anxiety is highly treatable, and there are many practical strategies you can start using today.</p>

              <h2>What Does Anxiety Feel Like?</h2>
              <p>Anxiety manifests differently for everyone, but common symptoms include:</p>
              <ul>
                <li><strong>Physical:</strong> Racing heart, sweating, trembling, muscle tension, fatigue</li>
                <li><strong>Mental:</strong> Excessive worry, racing thoughts, difficulty concentrating</li>
                <li><strong>Emotional:</strong> Restlessness, irritability, sense of dread</li>
                <li><strong>Behavioral:</strong> Avoidance, procrastination, difficulty sleeping</li>
              </ul>
              <p>
                Recognizing your personal anxiety signals is the first step toward managing them effectively.
              </p>

              <h2>Evidence-Based Strategies to Manage Anxiety</h2>

              <h3>1. Practice Deep Breathing</h3>
              <p>
                When anxiety strikes, your breath becomes shallow and rapid. Deep breathing activates your parasympathetic nervous system, signaling safety to your brain.
              </p>
              <p><strong>Try the 4-7-8 Technique:</strong></p>
              <ul>
                <li>Inhale through your nose for 4 seconds</li>
                <li>Hold your breath for 7 seconds</li>
                <li>Exhale slowly through your mouth for 8 seconds</li>
                <li>Repeat 3-4 times</li>
              </ul>

              <h3>2. Use Grounding Techniques</h3>
              <p>
                Grounding brings your attention back to the present moment, interrupting anxious thought spirals.
              </p>
              
              <div className="my-8">
                <img 
                  src={groundingInfographic} 
                  alt="Grounding technique infographic for anxiety management"
                  className="w-full max-w-lg mx-auto rounded-xl shadow-md"
                />
                <p className="text-center text-sm text-muted-foreground mt-2">Grounding Techniques for Anxiety</p>
              </div>

              <p>
                Learn more grounding methods from{" "}
                <a href="https://www.healthline.com/health/grounding-techniques" target="_blank" rel="noopener noreferrer">
                  Healthline's guide to grounding techniques
                </a>.
              </p>

              <h3>3. Challenge Anxious Thoughts</h3>
              <p>
                Anxiety often distorts reality. Cognitive restructuring helps you examine and reframe unhelpful thoughts.
              </p>
              <p><strong>Ask yourself:</strong></p>
              <ul>
                <li>What evidence supports this worry?</li>
                <li>What evidence contradicts it?</li>
                <li>What would I tell a friend with this worry?</li>
                <li>What's the most realistic outcome?</li>
              </ul>

              <h3>4. Limit Caffeine and Alcohol</h3>
              <p>
                Both substances can trigger or worsen anxiety symptoms. Caffeine stimulates your nervous system, while alcohol disrupts sleep and can cause rebound anxiety.
              </p>
              <p>Try reducing intake gradually and notice how your anxiety levels change.</p>

              <h3>5. Prioritize Sleep</h3>
              <p>
                Poor sleep and anxiety create a vicious cycle. The{" "}
                <a href="https://www.sleepfoundation.org/mental-health/anxiety-and-sleep" target="_blank" rel="noopener noreferrer">
                  Sleep Foundation
                </a>{" "}
                recommends 7-9 hours for adults and maintaining a consistent sleep schedule.
              </p>
              <p><strong>Sleep hygiene tips:</strong></p>
              <ul>
                <li>Keep a consistent bedtime routine</li>
                <li>Avoid screens 1 hour before bed</li>
                <li>Create a cool, dark sleeping environment</li>
                <li>Limit naps to 20-30 minutes</li>
              </ul>

              <h3>6. Exercise Regularly</h3>
              <p>
                Physical activity is one of the most effective anxiety treatments. Exercise releases endorphins, reduces stress hormones, and improves sleep.
              </p>
              <p>
                The{" "}
                <a href="https://www.apa.org/monitor/2011/12/exercise" target="_blank" rel="noopener noreferrer">
                  American Psychological Association
                </a>{" "}
                notes that just 30 minutes of moderate exercise can significantly reduce anxiety symptoms.
              </p>

              <h3>7. Practice Mindfulness</h3>
              <p>
                Mindfulness meditation trains your brain to observe thoughts without judgment, reducing their power over you.
              </p>
              <p><strong>Start with 5 minutes daily:</strong></p>
              <ul>
                <li>Find a quiet spot</li>
                <li>Focus on your breath</li>
                <li>When thoughts arise, acknowledge them and return to breathing</li>
                <li>Be patient with yourself</li>
              </ul>

              <h2>When to Seek Professional Help</h2>
              <p>Consider reaching out to a mental health professional if:</p>
              <ul>
                <li>Anxiety interferes with work, relationships, or daily activities</li>
                <li>You experience panic attacks</li>
                <li>Self-help strategies aren't providing relief</li>
                <li>You're using substances to cope</li>
                <li>You have thoughts of self-harm</li>
              </ul>
              <p>
                Professional treatments like Cognitive Behavioral Therapy (CBT) have a high success rate for anxiety disorders. Learn more from the{" "}
                <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                  National Institute of Mental Health
                </a>.
              </p>

              <h2>FAQs About Anxiety Management</h2>
              <p><strong>1. What is the difference between anxiety and an anxiety disorder?</strong></p>
              <p>
                Normal anxiety is temporary and tied to specific situations. An anxiety disorder involves persistent, excessive worry that interferes with daily life for six months or more.
              </p>
              <p><strong>2. Can anxiety be cured?</strong></p>
              <p>
                While anxiety may not be completely eliminated, it can be effectively managed through therapy, lifestyle changes, and sometimes medication.
              </p>
              <p><strong>3. How long does it take to see improvement?</strong></p>
              <p>
                With consistent practice of coping techniques, many people notice improvements within 4-8 weeks. Professional therapy typically shows results within 12-16 sessions.
              </p>

              <h2>Building Long-Term Resilience</h2>
              <p>
                Managing anxiety is not about eliminating all worry—it's about developing tools to navigate uncertainty with greater ease. With practice, patience, and possibly professional support, you can build a calmer, more resilient mind.
              </p>
              <p>
                <strong>Remember:</strong> You're not alone, and seeking help is a sign of strength, not weakness.
              </p>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
              <SocialShareButtons url={postUrl} title={postTitle} />
            </div>

            <div className="max-w-3xl mx-auto mt-12 p-8 bg-primary/5 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Take Control of Your Anxiety?</h3>
              <p className="text-muted-foreground mb-6">
                Our licensed therapists specialize in anxiety treatment. Book a session today.
              </p>
              <a 
                href="https://wa.me/256780570987?text=Hi%2C%20I%20read%20your%20article%20on%20anxiety%20management%20and%20would%20like%20to%20book%20a%20therapy%20session"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Book a Session
              </a>
            </div>
          </div>
        </article>
      </main>

      <AppDownload />
      <Footer />
    </>
  );
};

export default AnxietyManagementPost;
