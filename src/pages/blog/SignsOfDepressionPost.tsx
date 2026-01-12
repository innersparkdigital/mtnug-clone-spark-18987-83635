import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import depressionHeroImage from "@/assets/blog/depression-hero.jpg";

const SignsOfDepressionPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "10 Warning Signs of Depression You Shouldn't Ignore",
    "description": "Learn to recognize the common signs and symptoms of depression. Early detection can lead to faster recovery. Discover what to look for and when to seek help.",
    "image": "https://innerspark.africa/assets/blog/depression-hero.jpg",
    "author": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "url": "https://innerspark.africa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Innerspark Africa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://innerspark.africa/innerspark-logo.png"
      }
    },
    "datePublished": "2026-01-12",
    "dateModified": "2026-01-12",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://innerspark.africa/blog/signs-of-depression"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the early signs of depression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Early signs of depression include persistent sadness, loss of interest in activities you once enjoyed, changes in sleep patterns (sleeping too much or too little), fatigue, difficulty concentrating, and withdrawing from friends and family."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know if I'm depressed or just sad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sadness is a normal emotion that typically passes within a few days. Depression is persistent (lasting 2+ weeks), affects daily functioning, and includes multiple symptoms like fatigue, sleep changes, and loss of interest. If symptoms persist and interfere with your life, it may be depression."
        }
      },
      {
        "@type": "Question",
        "name": "Can depression go away on its own?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While mild depression may improve with self-care, moderate to severe depression typically requires professional treatment. Without treatment, depression often worsens or returns. Early intervention leads to better outcomes."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do if I notice signs of depression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you notice signs of depression, reach out to a mental health professional. You can also talk to your doctor, a trusted friend, or contact a mental health helpline. Early treatment is most effective for recovery."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://innerspark.africa" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://innerspark.africa/blog" },
      { "@type": "ListItem", "position": 3, "name": "Signs of Depression", "item": "https://innerspark.africa/blog/signs-of-depression" }
    ]
  };

  const warningSignsOfDepression = [
    {
      sign: "Persistent Sadness or Emptiness",
      description: "Feeling sad, empty, or hopeless most of the day, nearly every day, for two weeks or longer."
    },
    {
      sign: "Loss of Interest or Pleasure",
      description: "No longer enjoying activities, hobbies, or socializing that you used to love."
    },
    {
      sign: "Sleep Disturbances",
      description: "Insomnia (trouble falling or staying asleep) or hypersomnia (sleeping too much)."
    },
    {
      sign: "Fatigue and Low Energy",
      description: "Feeling tired all the time, even after adequate rest. Simple tasks feel exhausting."
    },
    {
      sign: "Changes in Appetite or Weight",
      description: "Significant weight loss or gain, or changes in appetite (eating much more or less than usual)."
    },
    {
      sign: "Difficulty Concentrating",
      description: "Trouble focusing, making decisions, or remembering things."
    },
    {
      sign: "Feelings of Worthlessness or Guilt",
      description: "Harsh self-criticism, feeling like a failure, or excessive guilt over minor issues."
    },
    {
      sign: "Physical Symptoms",
      description: "Unexplained aches, pains, headaches, or digestive problems that don't respond to treatment."
    },
    {
      sign: "Social Withdrawal",
      description: "Pulling away from friends, family, and social activities you once enjoyed."
    },
    {
      sign: "Thoughts of Death or Suicide",
      description: "Recurring thoughts about death, dying, or suicide. This requires immediate professional help."
    }
  ];

  return (
    <>
      <Helmet>
        <title>10 Warning Signs of Depression You Shouldn't Ignore | Innerspark Africa</title>
        <meta name="description" content="Learn to recognize the common signs and symptoms of depression. Persistent sadness, fatigue, sleep changes, and loss of interest are key warning signs. Know when to seek professional help." />
        <meta name="keywords" content="signs of depression, depression symptoms, am I depressed, warning signs depression, how to know if you're depressed, depression warning signs, symptoms of depression, depression signs to watch for, early signs of depression, clinical depression symptoms" />
        <link rel="canonical" href="https://innerspark.africa/blog/signs-of-depression" />
        
        {/* Open Graph */}
        <meta property="og:title" content="10 Warning Signs of Depression You Shouldn't Ignore" />
        <meta property="og:description" content="Learn to recognize the common signs of depression. Early detection leads to faster recovery. Know what to look for." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://innerspark.africa/blog/signs-of-depression" />
        <meta property="og:image" content="https://innerspark.africa/assets/blog/depression-hero.jpg" />
        <meta property="article:published_time" content="2026-01-12" />
        <meta property="article:section" content="Depression" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="10 Warning Signs of Depression" />
        <meta name="twitter:description" content="Learn to recognize depression symptoms. Early detection is key to recovery." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      <main>
        <article className="bg-background">
          {/* Hero Section */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img 
              src={depressionHeroImage} 
              alt="Person experiencing signs of depression"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto">
                <nav className="mb-4">
                  <Link to="/blog" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-primary/80 px-3 py-1 rounded-full text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Link>
                </nav>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Depression
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                  10 Warning Signs of Depression You Shouldn't Ignore
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    January 12, 2026
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    8 min read
                  </span>
                  <div className="ml-auto">
                    <SocialShareButtons 
                      url="https://innerspark.africa/blog/signs-of-depression"
                      title="10 Warning Signs of Depression You Shouldn't Ignore"
                      description="Learn to recognize the common signs of depression."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                {/* Introduction */}
                <section className="mb-12">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Depression affects more than 280 million people worldwide, yet many don't recognize the signs until the condition becomes severe. Understanding the warning signs of depression is the first step toward getting help and starting your recovery journey.
                  </p>
                  
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-amber-800 font-medium mb-0">
                          <strong>Important:</strong> If you or someone you know is having thoughts of suicide or self-harm, please reach out for help immediately. Contact a mental health professional or crisis helpline right away.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Warning Signs */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">The 10 Key Warning Signs of Depression</h2>
                  
                  <div className="space-y-6">
                    {warningSignsOfDepression.map((item, index) => (
                      <div key={index} className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">{item.sign}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* When to Seek Help */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">When Should You Seek Help?</h2>
                  
                  <p className="text-muted-foreground mb-6">
                    According to the <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">National Institute of Mental Health</a>, you should consider seeking professional help if:
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Symptoms persist for more than two weeks",
                      "Symptoms interfere with work, relationships, or daily activities",
                      "You're using alcohol or drugs to cope",
                      "You have thoughts of death or suicide",
                      "Physical symptoms don't improve with treatment"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Remember: Seeking Help Is a Sign of Strength
                    </h3>
                    <p className="text-muted-foreground mb-0">
                      Depression is a treatable condition. With proper support—whether through therapy, medication, or a combination—most people with depression experience significant improvement. The sooner you seek help, the sooner you can start feeling better.
                    </p>
                  </div>
                </section>

                {/* Treatment Options */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Treatment Options for Depression</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Psychotherapy</h3>
                      <p className="text-muted-foreground text-sm">Talk therapy, especially Cognitive Behavioral Therapy (CBT), is highly effective for treating depression.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Medication</h3>
                      <p className="text-muted-foreground text-sm">Antidepressants can help regulate brain chemistry and reduce symptoms.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Lifestyle Changes</h3>
                      <p className="text-muted-foreground text-sm">Exercise, healthy sleep, and nutrition can support mental health recovery.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Support Groups</h3>
                      <p className="text-muted-foreground text-sm">Connecting with others who understand can reduce isolation and provide hope.</p>
                    </div>
                  </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Ready to Take the First Step?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Take our free depression screening test or connect with a licensed therapist today.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/mind-check/depression">
                      <Button size="lg" variant="outline">
                        Take Depression Test
                      </Button>
                    </Link>
                    <Link to="/specialists">
                      <Button size="lg">
                        Find a Therapist
                      </Button>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default SignsOfDepressionPost;