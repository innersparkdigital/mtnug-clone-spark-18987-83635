import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Clock, Loader2, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import {
  BookHandoff,
  CrisisCallout,
  FaqSection,
  WhatYouLearn,
  needsCrisisCallout,
} from "@/components/blog/BlogCallouts";
import { normalizeBlogHtml } from "@/lib/blogContentNormalizer";


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
  const configuredUrl = post.canonical_url?.trim();
  const url = configuredUrl
    ? configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`
    : `${SITE}/blog/${post.slug}/`;
  const description = post.meta_description || post.excerpt || post.title;
  const seoTitle = post.meta_title?.trim() || `${post.title} | InnerSpark Africa`;
  const rawSocialImage = post.og_image_url?.trim() || post.hero_image_url;
  const socialImage = !rawSocialImage
    ? DEFAULT_OG
    : rawSocialImage.startsWith("http")
      ? rawSocialImage
      : `${SITE}${rawSocialImage.startsWith("/") ? "" : "/"}${rawSocialImage}`;
  const storedFaqs: FaqItem[] = Array.isArray(post.faqs)
    ? (post.faqs as FaqItem[]).filter((f) => f?.question && f?.answer)
    : [];
  // Older posts were pasted in as flat text: give every post the house structure.
  const structured = normalizeBlogHtml(post.content || "");
  const body = structured.html || post.content || "";
  const faqs: FaqItem[] = [...storedFaqs];
  structured.faqs.forEach((f) => {
    if (!faqs.some((e) => e.question.trim().toLowerCase() === f.question.trim().toLowerCase())) faqs.push(f);
  });
  const modified = post.last_updated_at || date;
  const showCrisis =
    !/blog-crisis/.test(body) &&
    needsCrisisCallout(post.title, post.category, description, post.meta_keywords);

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
      logo: { "@type": "ImageObject", url: `${SITE}/innerspark-logo.webp` },
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
      <main className="bg-[#F7F3EA]">
        {/* Editorial hero shared by every CMS article. */}
        <header className="border-b border-[#D9D0BF]">
          <div className="container mx-auto px-4 py-10 md:py-16 max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div>
              <Link to="/blog" className="inline-flex items-center text-primary font-semibold text-sm mb-7">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
              </Link>
              {post.category && (
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">{post.category}</span>
              )}
              <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#111827] leading-[1.08] tracking-tight mb-6">{post.title}</h1>
              <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed mb-7">{description}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#4B5563]">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                {post.read_time && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.read_time}</span>}
                <span className="flex items-center gap-1.5"><UserCheck className="h-4 w-4" />By {post.author || "InnerSpark Africa Clinical Team"}</span>
              </div>
            </div>
            <div className="relative">
              {post.hero_image_url ? (
                <img src={post.hero_image_url} alt={post.title} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-sm" />
              ) : (
                <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/25 to-primary/5" />
              )}
              <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white/95 border border-[#D9D0BF] p-4 shadow-sm">
                <p className="text-sm font-bold text-[#111827]">Video therapy: UGX 75,000 per session</p>
                <p className="text-sm text-[#4B5563]">Chat therapy: UGX 30,000 · Mobile Money or card</p>
              </div>
            </div>
          </div>
        </header>

        <article className="container mx-auto px-4 py-14 max-w-3xl">
          {post.excerpt && (
            <p className="text-xl text-foreground/80 leading-relaxed mb-6 font-light">{post.excerpt}</p>
          )}

          {/* Same "What you'll learn" box every InnerSpark article opens with */}
          <WhatYouLearn>{post.meta_description || post.excerpt || post.title}</WhatYouLearn>

          {/* Hand the reader over to booking before they scroll away */}
          <BookHandoff />

          <div
            className="blog-body prose prose-lg max-w-none text-[#1F2937] prose-headings:font-serif prose-headings:text-[#111827] prose-headings:tracking-tight prose-h2:border-t prose-h2:border-[#D9D0BF] prose-h2:pt-9 prose-p:leading-[1.85] prose-p:text-[#374151] prose-a:text-primary prose-a:font-semibold prose-img:rounded-2xl prose-strong:text-[#111827] prose-li:leading-relaxed prose-blockquote:border-primary prose-blockquote:bg-white prose-blockquote:rounded-r-xl prose-blockquote:py-2"
            dangerouslySetInnerHTML={{ __html: body }}
          />

          {showCrisis && <CrisisCallout />}

          <FaqSection items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />


          <div className="mt-14 rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Ready to talk to someone?</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Video therapy with a licensed African therapist costs UGX 75,000 per session. Chat therapy costs UGX 30,000. Pay by Mobile Money or card.
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
      <div className="bg-[#F7F3EA]">
        <RelatedArticles currentSlug={post.slug} />
      </div>
      <AppDownload />
      <Footer />
    </>
  );
};

export default CmsBlogPost;