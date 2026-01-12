import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Search, CheckCircle, MessageSquare, DollarSign, Heart, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";

const HowToFindATherapistPost = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Find a Therapist: Complete Guide to Choosing the Right Mental Health Professional",
    "description": "Step-by-step guide to finding the right therapist for your needs. Learn what to look for, questions to ask, and how to make your first appointment.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Identify Your Needs",
        "text": "Determine what you want help with and what type of therapy might work best for you."
      },
      {
        "@type": "HowToStep",
        "name": "Research Therapist Types",
        "text": "Understand the difference between psychologists, counselors, psychiatrists, and other mental health professionals."
      },
      {
        "@type": "HowToStep",
        "name": "Check Credentials",
        "text": "Verify the therapist is licensed and has relevant experience with your concerns."
      },
      {
        "@type": "HowToStep",
        "name": "Consider Logistics",
        "text": "Factor in cost, location, availability, and whether online therapy is an option."
      },
      {
        "@type": "HowToStep",
        "name": "Book a Consultation",
        "text": "Schedule an initial session to see if you feel comfortable with the therapist."
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "Innerspark Africa"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find a good therapist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To find a good therapist, start by identifying your needs, then search therapist directories or ask for referrals. Check their credentials, read reviews, and schedule a consultation to ensure you feel comfortable with them."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between a psychologist and a counselor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Psychologists typically have doctoral degrees and specialize in psychological testing and research-based treatments. Counselors usually have master's degrees and focus on talk therapy for everyday life challenges. Both can provide effective mental health support."
        }
      },
      {
        "@type": "Question",
        "name": "Is online therapy as effective as in-person therapy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Research shows online therapy is just as effective as in-person therapy for many conditions including depression, anxiety, and stress. It offers additional benefits like convenience, accessibility, and often lower costs."
        }
      },
      {
        "@type": "Question",
        "name": "How much does therapy cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Therapy costs vary widely. At Innerspark Africa, sessions start from UGX 75,000 (approximately $20). Some therapists offer sliding scale fees, and many insurance plans cover mental health services."
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
      { "@type": "ListItem", "position": 3, "name": "How to Find a Therapist", "item": "https://innerspark.africa/blog/how-to-find-a-therapist" }
    ]
  };

  const therapistTypes = [
    {
      type: "Psychologist",
      description: "Has a doctoral degree (PhD or PsyD). Specializes in psychological testing and evidence-based treatments like CBT.",
      bestFor: "Complex mental health conditions, psychological assessments"
    },
    {
      type: "Licensed Counselor",
      description: "Has a master's degree in counseling. Focuses on talk therapy for life challenges and emotional support.",
      bestFor: "Relationship issues, stress, life transitions, grief"
    },
    {
      type: "Psychiatrist",
      description: "Medical doctor specializing in mental health. Can prescribe medication.",
      bestFor: "Severe mental illness, medication management"
    },
    {
      type: "Clinical Social Worker",
      description: "Has a master's in social work. Combines therapy with practical support and resources.",
      bestFor: "Family issues, community resources, practical life challenges"
    }
  ];

  const questionsToAsk = [
    "What is your experience treating [my specific concern]?",
    "What therapy approach do you use?",
    "How long does treatment typically take?",
    "What are your fees and payment options?",
    "Do you offer online sessions?",
    "How do you handle emergencies between sessions?",
    "What can I expect in our first session?"
  ];

  return (
    <>
      <Helmet>
        <title>How to Find a Therapist: Complete Guide | Choosing the Right Mental Health Professional</title>
        <meta name="description" content="Learn how to find the right therapist for your needs. Step-by-step guide to choosing a mental health professional, questions to ask, what to expect, and how to make your first appointment." />
        <meta name="keywords" content="how to find a therapist, find a therapist near me, how to choose a therapist, finding the right therapist, therapist search, mental health professional, how to get a therapist, first therapy appointment, therapy for beginners, affordable therapist, online therapist" />
        <link rel="canonical" href="https://innerspark.africa/blog/how-to-find-a-therapist" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How to Find a Therapist: Complete Guide" />
        <meta property="og:description" content="Step-by-step guide to finding the right therapist. Learn what to look for and how to make your first appointment." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://innerspark.africa/blog/how-to-find-a-therapist" />
        <meta property="og:image" content="https://innerspark.africa/innerspark-logo.png" />
        <meta property="article:published_time" content="2026-01-12" />
        <meta property="article:section" content="Therapy" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Find a Therapist: Complete Guide" />
        <meta name="twitter:description" content="Step-by-step guide to choosing the right mental health professional." />
        
        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />
      
      <main>
        <article className="bg-background">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16 md:py-24">
            <div className="container mx-auto px-4">
              <nav className="mb-6">
                <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </nav>
              <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                Finding Help
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 max-w-4xl">
                How to Find a Therapist: Your Complete Guide to Choosing the Right Mental Health Professional
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  January 12, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  12 min read
                </span>
              </div>
              <SocialShareButtons 
                url="https://innerspark.africa/blog/how-to-find-a-therapist"
                title="How to Find a Therapist: Complete Guide"
                description="Step-by-step guide to finding the right therapist."
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                {/* Introduction */}
                <section className="mb-12">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Finding the right therapist can feel overwhelming, especially if you've never been to therapy before. But choosing a good therapist is one of the most important steps you can take for your mental health. This guide will walk you through everything you need to know.
                  </p>
                  
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8">
                    <p className="text-foreground font-medium mb-0">
                      <strong>Good News:</strong> Research from the <a href="https://www.apa.org/ptsd-guideline/patients-and-families/finding-good-therapist" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">American Psychological Association</a> shows that the relationship between you and your therapist is one of the strongest predictors of successful treatment. Finding someone you connect with matters.
                    </p>
                  </div>
                </section>

                {/* Step 1: Identify Your Needs */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">1</div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Identify Your Needs</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Before searching for a therapist, take some time to think about what you want help with:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: Heart, text: "Emotional struggles (depression, anxiety, grief)" },
                      { icon: Users, text: "Relationship or family issues" },
                      { icon: Shield, text: "Trauma or past experiences" },
                      { icon: MessageSquare, text: "Life transitions or stress" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg">
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Step 2: Understand Therapist Types */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">2</div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Understand Therapist Types</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Different mental health professionals have different training and specialties:
                  </p>
                  
                  <div className="space-y-4">
                    {therapistTypes.map((type, index) => (
                      <div key={index} className="bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-foreground text-lg mb-2">{type.type}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{type.description}</p>
                        <p className="text-primary text-sm font-medium">Best for: {type.bestFor}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Step 3: Check Credentials */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">3</div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Check Credentials & Experience</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    A qualified therapist should have:
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "A valid license to practice in your area",
                      "Relevant education (usually master's or doctoral degree)",
                      "Experience with your specific concerns",
                      "No disciplinary actions on their record",
                      "Ongoing professional development"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Step 4: Consider Logistics */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">4</div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Consider Practical Factors</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-5 rounded-xl">
                      <DollarSign className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Cost & Payment</h3>
                      <p className="text-muted-foreground text-sm">Consider session fees, insurance coverage, and whether sliding scale options are available.</p>
                    </div>
                    <div className="bg-muted/50 p-5 rounded-xl">
                      <Search className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">Location & Format</h3>
                      <p className="text-muted-foreground text-sm">Decide between in-person and online therapy based on your preferences and schedule.</p>
                    </div>
                  </div>
                </section>

                {/* Step 5: Questions to Ask */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">5</div>
                    <h2 className="text-3xl font-bold text-foreground mb-0">Questions to Ask a Potential Therapist</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    During your initial consultation, consider asking:
                  </p>
                  
                  <div className="bg-card border border-border rounded-xl p-6">
                    <ul className="space-y-3">
                      {questionsToAsk.map((question, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Online Therapy Section */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Why Consider Online Therapy?</h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Online therapy has become increasingly popular and offers several advantages:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Convenient", desc: "Attend sessions from home, work, or anywhere private" },
                      { title: "Accessible", desc: "Connect with specialists who may not be in your area" },
                      { title: "Affordable", desc: "Often lower cost than traditional in-person therapy" }
                    ].map((item, index) => (
                      <div key={index} className="bg-primary/5 p-5 rounded-xl text-center">
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Ready to Find Your Therapist?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Browse our network of verified, licensed therapists and find the right match for you.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/specialists">
                      <Button size="lg" className="gap-2">
                        <Search className="w-5 h-5" />
                        Find a Therapist
                      </Button>
                    </Link>
                    <a href="https://wa.me/256780570987?text=Hi,%20I%20need%20help%20finding%20a%20therapist" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline">
                        Get Help Matching
                      </Button>
                    </a>
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

export default HowToFindATherapistPost;