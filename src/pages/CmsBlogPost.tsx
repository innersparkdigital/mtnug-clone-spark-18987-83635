import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";

interface Post {
  slug: string; title: string; excerpt: string | null; content: string;
  category: string | null; hero_image_url: string | null; author: string | null;
  read_time: string | null; published_at: string | null; created_at: string;
}

const CmsBlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (!data) setNotFound(true); else setPost(data as Post);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (notFound) return <Navigate to="/blog" replace />;
  if (!post) return null;

  const date = post.published_at || post.created_at;
  const url = `https://www.innersparkafrica.com/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} | InnerSpark Africa</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.hero_image_url && <meta property="og:image" content={post.hero_image_url} />}
        <meta property="og:type" content="article" />
      </Helmet>
      <Header />
      <main>
        <article className="container mx-auto px-4 py-12 pt-28 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
          {post.category && <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">{post.category}</span>}
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(date).toLocaleDateString()}</span>
            {post.read_time && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.read_time}</span>}
            {post.author && <span>By {post.author}</span>}
          </div>
          {post.hero_image_url && (
            <img src={post.hero_image_url} alt={post.title} className="w-full rounded-xl mb-8 aspect-video object-cover" />
          )}
          {post.excerpt && <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>}
          <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
};

export default CmsBlogPost;