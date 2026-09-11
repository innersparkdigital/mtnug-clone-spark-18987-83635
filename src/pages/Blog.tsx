import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import NewsletterForm from "@/components/NewsletterForm";
import { T } from "@/components/Translate";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

const Blog = () => {
  const [cmsPosts, setCmsPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,category,hero_image_url,read_time,published_at,created_at,status")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });
      if (data) {
        setCmsPosts(
          data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt || "",
            date: new Date(p.published_at || p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            readTime: p.read_time || "5 min read",
            image: p.hero_image_url || "/placeholder.svg",
            category: p.category || "Mental Health",
          })),
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Mental Health Blog Uganda | InnerSpark Africa</title>
        <meta name="description" content="Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today." />
        <meta name="keywords" content="mental health blog Uganda, therapy tips, depression help Uganda, anxiety help Africa, stress management tips, trauma recovery, relationship counseling advice, online therapy blog, mental wellness Africa, therapist advice Uganda, how to deal with depression, panic attack help, marriage counseling tips, loneliness help, overthinking solutions, sadness therapy" />
        <link rel="canonical" href="https://www.innersparkafrica.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mental Health Blog Uganda | InnerSpark Africa" />
        <meta property="og:description" content="Expert articles on depression, anxiety, stress and relationships, written by licensed African therapists. Practical tips you can use today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.innersparkafrica.com/blog" />
        <meta property="og:image" content="https://www.innersparkafrica.com/innerspark-logo.webp" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mental Health Blog | Innerspark Africa" />
        <meta name="twitter:description" content="Expert-backed mental health articles on depression, anxiety, stress & therapy tips from licensed therapists." />
        
        {/* Schema.org Blog + BlogPosting list + FAQ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Blog",
                "name": "Innerspark Africa Mental Health Blog",
                "description": "Expert-backed mental health articles, therapy tips, and wellness resources for depression, anxiety, stress, trauma and relationship issues in Uganda and Africa",
                "url": "https://www.innersparkafrica.com/blog",
                "inLanguage": "en",
                "publisher": {
                  "@type": "Organization",
                  "name": "Innerspark Africa",
                  "url": "https://www.innersparkafrica.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.innersparkafrica.com/innerspark-logo.webp"
                  }
                },
                "blogPost": cmsPosts.map(post => ({
                  "@type": "BlogPosting",
                  "headline": post.title,
                  "description": post.excerpt,
                  "url": `https://www.innersparkafrica.com/blog/${post.slug}`,
                  "datePublished": post.date,
                  "author": {
                    "@type": "Organization",
                    "name": "Innerspark Africa"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "Innerspark Africa"
                  }
                }))
              },
              {
                "@type": "CollectionPage",
                "name": "Mental Health Blog",
                "url": "https://www.innersparkafrica.com/blog",
                "description": "Browse expert articles on depression, anxiety, stress, trauma, relationship issues and therapy options in Uganda",
                "isPartOf": { "@id": "https://www.innersparkafrica.com/#website" }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.innersparkafrica.com" },
                  { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.innersparkafrica.com/blog" }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How can I manage depression without medication?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "While medication helps many people, therapy (especially CBT), regular exercise, social support, and healthy routines are evidence-based ways to manage depression. A licensed therapist can create a personalized plan. Book a session at Innerspark Africa."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are the signs of anxiety?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Common signs include excessive worry, restlessness, difficulty concentrating, sleep problems, muscle tension, and avoidance of situations. If these persist for weeks, consider speaking with a therapist."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I find affordable therapy in Uganda?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Innerspark Africa offers affordable online therapy starting from UGX 30,000 per session with licensed therapists. Sessions are available via video, voice, or chat from anywhere."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can online therapy help with relationship problems?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, online couples and individual therapy is highly effective for relationship issues. Licensed therapists can help with communication, conflict resolution, trust, and intimacy concerns through video or chat sessions."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I stop overthinking and anxiety?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Grounding techniques like the 5-4-3-2-1 method, mindfulness, journaling, and CBT are proven strategies. A therapist can teach you personalized techniques. Read our blog articles for free tips."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8">
              <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <T>Mental Health & Wellness Blog</T>
              </h1>
              <p className="text-xl text-muted-foreground">
                <T>Expert-backed insights, practical tips, and resources to help you navigate your mental health journey. From stress management to building emotional resilience.</T>
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cmsPosts.map((post) => (
                    <article key={post.slug} className="group">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
                            </span>
                          </div>
                          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {cmsPosts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">More articles coming soon...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterForm />

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Need Professional Support?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our licensed therapists are here to help you navigate life's challenges. Book a session today.
            </p>
            <a 
              href="https://wa.me/256792085773?text=Hi%2C%20I%20read%20your%20blog%20and%20would%20like%20to%20book%20a%20therapy%20session"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Book a Session
            </a>
          </div>
        </section>
      </main>

      <AppDownload />
      <Footer />
    </>
  );
};

export default Blog;
