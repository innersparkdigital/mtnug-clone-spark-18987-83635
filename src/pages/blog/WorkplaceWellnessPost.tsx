import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import heroImage from "@/assets/blog/workplace-wellness-hero.jpg";
import burnoutInfographic from "@/assets/blog/burnout-signs-infographic.png";

const WorkplaceWellnessPost = () => {
  const postUrl = "https://innerspark.africa/blog/how-to-improve-mental-health-at-work";
  const postTitle = "How Can I Improve My Mental Health at Work? Practical Strategies for Workplace Wellness";

  return (
    <>
      <Helmet>
        <title>How Can I Improve My Mental Health at Work? Workplace Wellness Strategies | Innerspark</title>
        <meta name="description" content="Discover practical strategies to improve your mental health at work. Learn about managing workplace stress, setting boundaries, and creating a healthier work-life balance." />
        <meta name="keywords" content="workplace wellness, mental health at work, work stress, burnout prevention, work-life balance, employee wellbeing, occupational health" />
        <link rel="canonical" href={postUrl} />
        
        <meta property="og:title" content="How Can I Improve My Mental Health at Work?" />
        <meta property="og:description" content="Practical strategies for workplace wellness and managing work stress." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": postTitle,
            "description": "Discover practical strategies to improve your mental health at work.",
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
                "name": "How do I know if I'm experiencing workplace burnout?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Signs include chronic exhaustion, cynicism about work, feeling ineffective, increased errors, withdrawal from colleagues, and physical symptoms like headaches or insomnia."
                }
              },
              {
                "@type": "Question",
                "name": "Should I tell my employer about my mental health struggles?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This is a personal decision. Consider your workplace culture, your relationship with your manager, and whether disclosure might help you access accommodations or support."
                }
              },
              {
                "@type": "Question",
                "name": "Can I take time off work for mental health?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In many countries, mental health conditions qualify for medical leave. Check your company's policies and speak with HR about your options."
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
              { "@type": "ListItem", "position": 3, "name": "Workplace Wellness", "item": postUrl }
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
                  Workplace Wellness
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                How Can I Improve My Mental Health at Work? Practical Strategies for Workplace Wellness
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                We spend a significant portion of our lives at work, making workplace mental health crucial to our overall wellbeing. Learn practical strategies to reduce stress, prevent burnout, and create a healthier relationship with your work.
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
                  10 min read
                </span>
              </div>
              
              <SocialShareButtons url={postUrl} title={postTitle} />
            </header>

            <div className="max-w-4xl mx-auto mb-12">
              <img 
                src={heroImage} 
                alt="Professional in a healthy, plant-filled office environment representing workplace wellness"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
              <h2>Introduction: The Workplace-Mental Health Connection</h2>
              <p>
                Work can be a source of purpose, achievement, and connection—or it can become a significant source of stress and mental health challenges. According to the{" "}
                <a href="https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work" target="_blank" rel="noopener noreferrer">
                  World Health Organization
                </a>, an estimated 12 billion working days are lost annually to depression and anxiety, costing the global economy $1 trillion in lost productivity.
              </p>
              <p>
                But here's the good news: there are concrete steps you can take to protect and improve your mental health at work, regardless of your role or industry.
              </p>

              <h2>Understanding Workplace Stress</h2>
              <p>
                Some stress at work is normal—even motivating. But chronic workplace stress can lead to:
              </p>
              <ul>
                <li>Burnout and exhaustion</li>
                <li>Anxiety and depression</li>
                <li>Physical health problems</li>
                <li>Decreased job performance</li>
                <li>Relationship difficulties</li>
              </ul>

              <h3>Common Sources of Workplace Stress</h3>
              <ul>
                <li><strong>Workload:</strong> Too much work, unrealistic deadlines</li>
                <li><strong>Control:</strong> Little say in how work is done</li>
                <li><strong>Relationships:</strong> Conflict with colleagues or managers</li>
                <li><strong>Role clarity:</strong> Unclear expectations or responsibilities</li>
                <li><strong>Change:</strong> Organizational uncertainty or frequent changes</li>
                <li><strong>Support:</strong> Lack of resources or assistance</li>
              </ul>

              <h2>Practical Strategies for Better Mental Health at Work</h2>

              <h3>1. Set Clear Boundaries</h3>
              <p>
                In our always-connected world, the line between work and personal life easily blurs. Healthy boundaries protect your mental health.
              </p>
              <p><strong>Try:</strong></p>
              <ul>
                <li>Define specific work hours and stick to them</li>
                <li>Turn off work notifications after hours</li>
                <li>Create a dedicated workspace (especially if working from home)</li>
                <li>Learn to say "no" to additional tasks when overloaded</li>
                <li>Take your full lunch break away from your desk</li>
              </ul>

              <h3>2. Take Regular Breaks</h3>
              <p>
                Your brain isn't designed for hours of continuous focus. Regular breaks improve productivity and mental wellbeing.
              </p>
              <p><strong>The Pomodoro Technique:</strong></p>
              <ul>
                <li>Work for 25 minutes</li>
                <li>Take a 5-minute break</li>
                <li>After 4 cycles, take a longer 15-30 minute break</li>
              </ul>
              <p>Use breaks to stretch, walk, or practice deep breathing.</p>

              <h3>3. Manage Your Workload Effectively</h3>
              <p>
                Feeling overwhelmed is a major stress contributor. Better organization can help.
              </p>
              <p><strong>Strategies:</strong></p>
              <ul>
                <li><strong>Prioritize:</strong> Use the Eisenhower Matrix (urgent/important)</li>
                <li><strong>Break down tasks:</strong> Large projects into smaller steps</li>
                <li><strong>Time-block:</strong> Schedule specific tasks for specific times</li>
                <li><strong>Delegate:</strong> When possible, share the load</li>
                <li><strong>Communicate:</strong> Talk to your manager about unrealistic expectations</li>
              </ul>

              <h3>4. Build Positive Workplace Relationships</h3>
              <p>
                Social connection at work is protective for mental health. Research from{" "}
                <a href="https://hbr.org/2015/12/proof-that-positive-work-cultures-are-more-productive" target="_blank" rel="noopener noreferrer">
                  Harvard Business Review
                </a>{" "}
                shows positive workplace relationships increase engagement and reduce stress.
              </p>
              <p><strong>Try:</strong></p>
              <ul>
                <li>Have coffee or lunch with colleagues</li>
                <li>Participate in team activities</li>
                <li>Offer help when you can</li>
                <li>Express appreciation for others' contributions</li>
                <li>Address conflicts directly and respectfully</li>
              </ul>

              <h3>5. Create a Wellness-Friendly Workspace</h3>
              <p>Your physical environment affects your mental state.</p>
              <p><strong>Optimize your space:</strong></p>
              <ul>
                <li><strong>Natural light:</strong> Position yourself near windows when possible</li>
                <li><strong>Plants:</strong> Greenery reduces stress and improves air quality</li>
                <li><strong>Ergonomics:</strong> Comfortable setup reduces physical strain</li>
                <li><strong>Personal touches:</strong> Photos or items that bring you joy</li>
                <li><strong>Declutter:</strong> A tidy space supports a clearer mind</li>
              </ul>

              <h3>6. Practice Stress-Relief Techniques During the Day</h3>
              <p>Quick stress-busters you can do at work:</p>
              <ul>
                <li><strong>Deep breathing:</strong> Even 1 minute of slow, deep breaths helps</li>
                <li><strong>Progressive muscle relaxation:</strong> Tense and release muscle groups</li>
                <li><strong>Mindful moments:</strong> Focus fully on a simple task like drinking tea</li>
                <li><strong>Desk stretches:</strong> Release tension in neck, shoulders, and back</li>
                <li><strong>Step outside:</strong> A brief walk in fresh air resets your mind</li>
              </ul>

              <h3>7. Recognize and Address Burnout Early</h3>
              <p>
                Burnout is a state of chronic workplace stress that leads to exhaustion, cynicism, and reduced effectiveness.
              </p>
              <p><strong>Warning signs:</strong></p>
              <ul>
                <li>Dreading work every day</li>
                <li>Feeling emotionally drained</li>
                <li>Increased cynicism or detachment</li>
                <li>Reduced productivity despite working harder</li>
                <li>Physical symptoms (headaches, insomnia, illness)</li>
              </ul>
              <p>
                If you recognize these signs, take action early. Talk to your manager, take time off if possible, and consider professional support.
              </p>

              <div className="my-8">
                <img 
                  src={burnoutInfographic} 
                  alt="Workplace Burnout Warning Signs Infographic"
                  className="w-full max-w-lg mx-auto rounded-xl shadow-md"
                />
                <p className="text-center text-sm text-muted-foreground mt-2">Workplace Burnout Warning Signs</p>
              </div>

              <h2>For Employers and Managers</h2>
              <p>Creating a mentally healthy workplace benefits everyone:</p>
              <ul>
                <li><strong>Promote work-life balance:</strong> Discourage after-hours emails</li>
                <li><strong>Provide resources:</strong> Employee assistance programs, mental health days</li>
                <li><strong>Train managers:</strong> To recognize signs of struggle and respond supportively</li>
                <li><strong>Foster open communication:</strong> Make it safe to discuss mental health</li>
                <li><strong>Lead by example:</strong> Model healthy behaviors</li>
              </ul>

              <h2>When to Seek Professional Help</h2>
              <p>Consider professional support if:</p>
              <ul>
                <li>Work stress is affecting your sleep, relationships, or physical health</li>
                <li>You feel anxious or depressed most days</li>
                <li>You're using alcohol or substances to cope</li>
                <li>You've lost interest in activities you used to enjoy</li>
                <li>Self-help strategies aren't providing relief</li>
              </ul>

              <h2>FAQs About Workplace Mental Health</h2>
              <p><strong>1. How do I know if I'm experiencing workplace burnout?</strong></p>
              <p>
                Signs include chronic exhaustion, cynicism about work, feeling ineffective, increased errors, withdrawal from colleagues, and physical symptoms like headaches or insomnia.
              </p>
              <p><strong>2. Should I tell my employer about my mental health struggles?</strong></p>
              <p>
                This is a personal decision. Consider your workplace culture, your relationship with your manager, and whether disclosure might help you access accommodations or support.
              </p>
              <p><strong>3. Can I take time off work for mental health?</strong></p>
              <p>
                In many countries, mental health conditions qualify for medical leave. Check your company's policies and speak with HR about your options.
              </p>

              <h2>Final Thoughts</h2>
              <p>
                Your mental health is not separate from your work life—they're deeply interconnected. By implementing these strategies, you can create a healthier relationship with work that supports rather than undermines your wellbeing.
              </p>
              <p>
                <strong>Remember:</strong> You deserve to thrive at work, not just survive. Small changes can make a big difference over time.
              </p>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
              <SocialShareButtons url={postUrl} title={postTitle} />
            </div>

            <div className="max-w-3xl mx-auto mt-12 p-8 bg-primary/5 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Corporate Wellness Programs</h3>
              <p className="text-muted-foreground mb-6">
                We offer customized workplace wellness programs for organizations. Contact us to learn how we can support your team's mental health.
              </p>
              <a 
                href="https://wa.me/256780570987?text=Hi%2C%20I%27m%20interested%20in%20your%20corporate%20wellness%20programs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Learn About Corporate Programs
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

export default WorkplaceWellnessPost;
