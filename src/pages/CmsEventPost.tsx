import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EventItem {
  slug: string; title: string; summary: string | null; body: string;
  event_date: string | null; hero_image_url: string | null; published_at: string | null;
}

const CmsEventPost = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("events").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (!data) setNotFound(true); else setEvent(data as EventItem);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (notFound) return <Navigate to="/events-training" replace />;
  if (!event) return null;

  return (
    <>
      <Helmet>
        <title>{event.title} | InnerSpark Events</title>
        <meta name="description" content={event.summary || event.title} />
        <link rel="canonical" href={`https://www.innersparkafrica.com/events-training/${event.slug}`} />
      </Helmet>
      <Header />
      <main>
        <article className="container mx-auto px-4 py-12 pt-28 max-w-3xl">
          <Link to="/events-training" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{event.title}</h1>
          {event.event_date && (
            <p className="flex items-center gap-2 text-muted-foreground mb-6"><Calendar className="h-4 w-4" />{new Date(event.event_date).toLocaleDateString()}</p>
          )}
          {event.hero_image_url && <img src={event.hero_image_url} alt={event.title} className="w-full rounded-xl mb-8 aspect-video object-cover" />}
          {event.summary && <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{event.summary}</p>}
          <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: event.body }} />
        </article>
      </main>
      <Footer />
    </>
  );
};

export default CmsEventPost;