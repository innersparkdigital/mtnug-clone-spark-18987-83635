import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";

interface FaqItem { question: string; answer: string }

interface Post {
  slug: string; title: string; excerpt: string | null; content: string;
  category: string | null; hero_image_url: string | null; author: string | null;
  read_time: string | null; published_at: string | null; created_at: string;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_title?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  faqs?: unknown;
  related_service_url?: string | null;
  schema_type?: string | null;
  last_updated_at?: string | null;
}

const SITE = "https://www.innersparkafrica.com";
const DEFAULT_OG = `${SITE}/og-image.jpg`;

const CmsBlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [redirectSlug, setRedirectSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (data) {
        setPost(data as unknown as Post);
      } else {
        // Honour an old slug that was renamed: send the reader to the current one.
        const { data: moved } = await supabase
          .from("blog_posts")
          .select("slug")
          .eq("redirect_from_slug", slug)
          .eq("status", "published")
          .maybeSingle();
        if (moved?.slug) setRedirectSlug(moved.slug);
        else setNotFound(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (redirectSlug) return <Navigate to={`/blog/${redirectSlug}`} replace />;
  if (notFound) return <Navigate to="/blog" replace />;
  if (!post) return null;

  const date = post.published_at || post.created_at;
  const url = post.canonical_url?.trim() || `${SITE}/blog/${post.slug}`;
  const description = post.meta_description || post.excerpt || post.title;
  const seoTitle = post.meta_title?.trim() || `${post.title} | InnerSpark Africa`;
  const socialImage = post.og_image_url?.trim() || post.hero_image_url || DEFAULT_OG;
  const faqs: FaqItem[] = Array.isArray(post.faqs)
    ? (post.faqs as FaqItem[]).filter((f) => f?.question && f?.answer)
    : [];
  const modified = post.last_updated_at || date;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schema_type === "HowTo" ? "HowTo" : "Article",
    headline: post.title,
    description,
    image: socialImage,
    datePublished: date,
    dateModified: modified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: post.author || "InnerSpark Africa" },
    publisher: {
      "@type": "Organization",
      name: "InnerSpark Africa",
      logo: { "@type": "ImageObject", url: `${SITE}/innerspark-logo.png` },
    },
  };

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={description} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.og_title?.trim() || post.title} />
        <meta property="og:description" content={post.og_description?.trim() || description} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="article:published_time" content={date} />
        <meta property="article:modified_time" content={modified} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.og_title?.trim() || post.title} />
        <meta name="twitter:description" content={post.og_description?.trim() || description} />
        <meta name="twitter:image" content={socialImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>
      <Header />
      <main>
        {/* Full-bleed hero with the headline over the image */}
        <header className="relative w-full h-[52vh] min-h-[360px] md:h-[62vh] flex items-end overflow-hidden">
          {post.hero_image_url ? (
            <img src={post.hero_image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          <div className="relative container mx-auto px-4 pb-10 md:pb-14 max-w-3xl">
            <Link to="/blog" className="inline-flex items-center text-white/90 hover:text-white bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-5">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
            {post.category && (
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/80 mb-3">{post.category}</span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              {post.read_time && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.read_time}</span>}
              {post.author && <span>By {post.author}</span>}
            </div>
          </div>
        </header>

        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {post.excerpt && (
            <p className="text-xl text-foreground/80 leading-relaxed mb-6 font-light">{post.excerpt}</p>
          )}

          {/* Hand the reader over to booking before they scroll away */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            If you would rather talk to someone than read on,{" "}
            <Link to="/book-therapist" className="text-primary font-semibold underline underline-offset-4">
              book a session with a licensed Ugandan therapist
            </Link>{" "}
            — video, voice or chat from UGX 30,000, bookable in about two minutes.
          </p>

          <div
            className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-[1.8] prose-p:text-foreground/90 prose-a:text-primary prose-a:font-medium prose-img:rounded-xl prose-strong:text-foreground prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {faqs.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">{f.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-14 rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Ready to talk to someone?</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Licensed Ugandan therapists, private sessions over video, voice or chat from UGX 30,000. Pay by MTN or Airtel Money.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book-therapist" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-primary-foreground font-semibold hover:opacity-90">
                Book a session
              </Link>
              {post.related_service_url && (
                <Link to={post.related_service_url} className="inline-flex items-center rounded-full border border-primary/30 px-6 py-3 text-primary font-semibold hover:bg-primary/5">
                  Learn more
                </Link>
              )}
            </div>
          </div>
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};

export default CmsBlogPost;