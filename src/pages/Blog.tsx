import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import NewsletterForm from "@/components/NewsletterForm";
import stressHeroImage from "@/assets/blog/stress-management-hero.jpg";
import panicHeroImage from "@/assets/blog/panic-attack-hero.jpg";
import depressionHeroImage from "@/assets/blog/depression-hero.jpg";
import mentalHealthHeroImage from "@/assets/blog/mental-health-hero.jpg";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "what-is-mental-health",
    title: "What Is Mental Health? A Complete Guide to Conditions, Warning Signs & Everyday Wellness",
    excerpt: "Mental health influences how we think, feel, and act every day. This guide explains what mental health is, common conditions, early warning signs, and proven tools to strengthen your emotional well-being.",
    date: "December 9, 2025",
    readTime: "15 min read",
    image: mentalHealthHeroImage,
    category: "Mental Health"
  },
  {
    slug: "how-to-deal-with-depression",
    title: "How to Deal With Depression? Simple, Compassionate Strategies That Actually Help",
    excerpt: "Depression can feel heavy and isolating, but you're not alone—and you're not stuck. Here's a clear, gentle, research-backed guide to dealing with depression.",
    date: "December 8, 2025",
    readTime: "12 min read",
    image: depressionHeroImage,
    category: "Depression Support"
  },
  {
    slug: "how-to-stop-a-panic-attack",
    title: "How Do I Stop a Panic Attack? Simple, Fast Techniques to Regain Control",
    excerpt: "Panic attacks can feel terrifying, but with the right tools, you can ease their intensity and return to balance. Learn expert-backed grounding techniques and breathing exercises.",
    date: "December 6, 2025",
    readTime: "10 min read",
    image: panicHeroImage,
    category: "Panic Management"
  },
  {
    slug: "how-to-handle-stress",
    title: "How Should I Handle Stress? Expert-Backed, Simple & Practical Ways to Regain Control",
    excerpt: "Stress doesn't have to run the show. Learn how to understand your stress, break it down, and manage it using simple tools backed by mental health experts.",
    date: "December 3, 2025",
    readTime: "8 min read",
    image: stressHeroImage,
    category: "Stress Management"
  }
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Mental Health Blog | Expert Wellness Tips & Resources | Innerspark Africa</title>
        <meta name="description" content="Discover expert-backed mental health articles, stress management tips, and wellness resources. Read our latest insights on managing anxiety, depression, and building emotional resilience." />
        <meta name="keywords" content="mental health blog, stress management, anxiety tips, wellness resources, emotional health, therapy advice, mental wellness Africa" />
        <link rel="canonical" href="https://innerspark.africa/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mental Health Blog | Innerspark Africa" />
        <meta property="og:description" content="Expert-backed mental health articles and wellness resources from Africa's leading digital wellness platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://innerspark.africa/blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mental Health Blog | Innerspark Africa" />
        <meta name="twitter:description" content="Expert-backed mental health articles and wellness resources." />
        
        {/* Schema.org Blog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Innerspark Africa Mental Health Blog",
            "description": "Expert-backed mental health articles and wellness resources",
            "url": "https://innerspark.africa/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Innerspark Africa",
              "logo": {
                "@type": "ImageObject",
                "url": "https://innerspark.africa/innerspark-logo.png"
              }
            }
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
                Mental Health & Wellness Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Expert-backed insights, practical tips, and resources to help you navigate your mental health journey. From stress management to building emotional resilience.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
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

            {blogPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">More articles coming soon...</p>
              </div>
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
              href="https://wa.me/256780570987?text=Hi%2C%20I%20read%20your%20blog%20and%20would%20like%20to%20book%20a%20therapy%20session"
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
