import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import heroImage from "@/assets/blog/depression-awareness-hero.jpg";

const DepressionAwarenessPost = () => {
  const postUrl = "https://innerspark.africa/blog/what-is-depression";
  const postTitle = "What Is Depression? Understanding the Signs and Finding Hope";

  return (
    <>
      <Helmet>
        <title>What Is Depression? Understanding the Signs and Finding Hope | Innerspark</title>
        <meta name="description" content="Learn about depression symptoms, causes, and effective treatments. Understand the difference between sadness and clinical depression, and discover paths to recovery and hope." />
        <meta name="keywords" content="depression, depression symptoms, mental health, depression treatment, depression help, clinical depression, mental wellness" />
        <link rel="canonical" href={postUrl} />
        
        <meta property="og:title" content="What Is Depression? Understanding the Signs" />
        <meta property="og:description" content="Learn about depression symptoms, causes, and effective treatments." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": postTitle,
            "description": "Learn about depression symptoms, causes, and effective treatments.",
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
                "name": "How is depression different from sadness?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sadness is a normal emotion that passes. Depression is persistent (lasting 2+ weeks), affects daily functioning, and includes multiple symptoms beyond just feeling sad."
                }
              },
              {
                "@type": "Question",
                "name": "Can depression go away on its own?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Some mild episodes may improve, but clinical depression typically requires treatment. Without intervention, symptoms often worsen or become chronic."
                }
              },
              {
                "@type": "Question",
                "name": "Is depression a sign of weakness?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely not. Depression is a medical condition caused by brain chemistry, genetics, and life circumstances. It can affect anyone regardless of strength or character."
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
              { "@type": "ListItem", "position": 3, "name": "What Is Depression?", "item": postUrl }
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
                  Depression Awareness
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                What Is Depression? Understanding the Signs and Finding Hope
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Depression is more than feeling sad—it's a complex mental health condition that affects millions worldwide. Understanding depression is the first step toward healing. Here's what you need to know about symptoms, causes, and the path to recovery.
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
                  11 min read
                </span>
              </div>
              
              <SocialShareButtons url={postUrl} title={postTitle} />
            </header>

            <div className="max-w-4xl mx-auto mb-12">
              <img 
                src={heroImage} 
                alt="Sunrise representing hope and recovery from depression"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
              <h2>Introduction: Breaking the Silence Around Depression</h2>
              <p>
                Depression affects approximately{" "}
                <a href="https://www.who.int/news-room/fact-sheets/detail/depression" target="_blank" rel="noopener noreferrer">
                  280 million people worldwide
                </a>, yet it remains surrounded by stigma and misunderstanding. Many people suffer in silence, believing their struggles are personal failures rather than symptoms of a treatable medical condition.
              </p>
              <p>
                Understanding depression—what it is, what it isn't, and how it can be treated—is essential for anyone affected, whether personally or through a loved one. This guide will help you recognize the signs and discover that recovery is possible.
              </p>

              <h2>What Is Depression?</h2>
              <p>
                Depression (clinically known as Major Depressive Disorder) is a mood disorder that causes persistent feelings of sadness, hopelessness, and loss of interest in activities you once enjoyed. It affects how you think, feel, and handle daily activities.
              </p>
              <p>
                Unlike temporary sadness or "the blues," depression:
              </p>
              <ul>
                <li>Persists for at least two weeks</li>
                <li>Significantly impacts daily functioning</li>
                <li>Involves multiple symptoms beyond mood</li>
                <li>Doesn't simply go away with willpower</li>
              </ul>

              <h2>Common Signs and Symptoms</h2>
              <p>Depression manifests differently in each person, but common symptoms include:</p>
              
              <h3>Emotional Symptoms</h3>
              <ul>
                <li>Persistent sadness or emptiness</li>
                <li>Feelings of hopelessness or pessimism</li>
                <li>Guilt, worthlessness, or helplessness</li>
                <li>Irritability or frustration</li>
                <li>Loss of interest in hobbies and activities</li>
              </ul>

              <h3>Physical Symptoms</h3>
              <ul>
                <li>Fatigue and decreased energy</li>
                <li>Sleep problems (insomnia or oversleeping)</li>
                <li>Appetite changes (eating too much or too little)</li>
                <li>Unexplained aches and pains</li>
                <li>Slowed movements or speech</li>
              </ul>

              <h3>Cognitive Symptoms</h3>
              <ul>
                <li>Difficulty concentrating or making decisions</li>
                <li>Memory problems</li>
                <li>Negative thought patterns</li>
                <li>Thoughts of death or suicide</li>
              </ul>

              <p>
                If you experience several of these symptoms for more than two weeks, consider reaching out to a mental health professional. Learn more from the{" "}
                <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                  National Institute of Mental Health
                </a>.
              </p>

              <h2>What Causes Depression?</h2>
              <p>Depression doesn't have a single cause—it results from a complex interaction of factors:</p>
              
              <h3>Biological Factors</h3>
              <ul>
                <li><strong>Brain chemistry:</strong> Imbalances in neurotransmitters like serotonin and dopamine</li>
                <li><strong>Genetics:</strong> Family history increases risk</li>
                <li><strong>Hormonal changes:</strong> Pregnancy, menopause, thyroid issues</li>
              </ul>

              <h3>Psychological Factors</h3>
              <ul>
                <li>Negative thinking patterns</li>
                <li>Low self-esteem</li>
                <li>History of trauma or abuse</li>
                <li>Chronic stress</li>
              </ul>

              <h3>Environmental Factors</h3>
              <ul>
                <li>Loss of a loved one</li>
                <li>Relationship problems</li>
                <li>Financial difficulties</li>
                <li>Isolation and loneliness</li>
              </ul>

              <h2>Depression vs. Normal Sadness</h2>
              <p>
                It's important to distinguish between normal sadness and clinical depression:
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">Normal Sadness</th>
                    <th className="text-left p-2 border-b">Depression</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">Triggered by specific events</td>
                    <td className="p-2 border-b">May have no clear trigger</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Temporary (days)</td>
                    <td className="p-2 border-b">Persistent (2+ weeks)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Doesn't affect self-worth</td>
                    <td className="p-2 border-b">Impacts self-esteem deeply</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Still find moments of joy</td>
                    <td className="p-2 border-b">Pervasive loss of pleasure</td>
                  </tr>
                </tbody>
              </table>

              <h2>Treatment Options</h2>
              <p>
                Depression is highly treatable. Most people improve with the right combination of approaches:
              </p>

              <h3>Psychotherapy</h3>
              <p>
                <strong>Cognitive Behavioral Therapy (CBT)</strong> is particularly effective, helping identify and change negative thought patterns. Other approaches include:
              </p>
              <ul>
                <li>Interpersonal therapy</li>
                <li>Psychodynamic therapy</li>
                <li>Mindfulness-based therapy</li>
              </ul>

              <h3>Medication</h3>
              <p>
                Antidepressants can help correct brain chemistry imbalances. Common types include SSRIs, SNRIs, and atypical antidepressants. Always work with a healthcare provider to find the right medication.
              </p>

              <h3>Lifestyle Changes</h3>
              <ul>
                <li><strong>Exercise:</strong> Regular physical activity boosts mood-enhancing chemicals</li>
                <li><strong>Sleep:</strong> Maintaining a consistent sleep schedule</li>
                <li><strong>Nutrition:</strong> A balanced diet supports brain health</li>
                <li><strong>Social connection:</strong> Reducing isolation</li>
                <li><strong>Stress management:</strong> Relaxation techniques and boundaries</li>
              </ul>

              <h2>How to Support Someone with Depression</h2>
              <p>If a loved one is struggling:</p>
              <ul>
                <li><strong>Listen without judgment:</strong> Sometimes presence matters more than advice</li>
                <li><strong>Avoid minimizing:</strong> Don't say "just cheer up" or "it's all in your head"</li>
                <li><strong>Encourage professional help:</strong> Offer to help find a therapist</li>
                <li><strong>Stay connected:</strong> Keep reaching out even if they withdraw</li>
                <li><strong>Take care of yourself:</strong> Supporting someone with depression can be draining</li>
              </ul>

              <h2>FAQs About Depression</h2>
              <p><strong>1. How is depression different from sadness?</strong></p>
              <p>
                Sadness is a normal emotion that passes. Depression is persistent (lasting 2+ weeks), affects daily functioning, and includes multiple symptoms beyond just feeling sad.
              </p>
              <p><strong>2. Can depression go away on its own?</strong></p>
              <p>
                Some mild episodes may improve, but clinical depression typically requires treatment. Without intervention, symptoms often worsen or become chronic.
              </p>
              <p><strong>3. Is depression a sign of weakness?</strong></p>
              <p>
                Absolutely not. Depression is a medical condition caused by brain chemistry, genetics, and life circumstances. It can affect anyone regardless of strength or character.
              </p>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-8">
                <h3 className="text-destructive font-bold mb-2">Important: If You're in Crisis</h3>
                <p className="text-foreground mb-4">
                  If you or someone you know is having thoughts of suicide, please reach out immediately:
                </p>
                <ul className="text-foreground">
                  <li>Contact Innerspark emergency support: <a href="tel:+256780570987" className="font-bold">+256 780 570 987</a></li>
                  <li>Go to your nearest emergency room</li>
                  <li>Call a trusted friend or family member</li>
                </ul>
              </div>

              <h2>There Is Hope</h2>
              <p>
                Depression can make everything feel hopeless, but recovery is possible. With proper treatment, support, and time, most people with depression improve significantly.
              </p>
              <p>
                <strong>You are not your depression.</strong> It's a condition you're experiencing, not who you are. And there are people ready to help you through it.
              </p>
            </div>

            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
              <SocialShareButtons url={postUrl} title={postTitle} />
            </div>

            <div className="max-w-3xl mx-auto mt-12 p-8 bg-primary/5 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Take the First Step Toward Healing</h3>
              <p className="text-muted-foreground mb-6">
                Our compassionate therapists are here to support your recovery journey. You don't have to face this alone.
              </p>
              <a 
                href="https://wa.me/256780570987?text=Hi%2C%20I%20read%20your%20article%20on%20depression%20and%20would%20like%20to%20speak%20with%20a%20therapist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Connect with a Therapist
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

export default DepressionAwarenessPost;
