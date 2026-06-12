import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";

export type BlogBlock =
  | { type: "lead"; text: ReactNode }
  | { type: "p"; text: ReactNode }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "callout"; label?: string; text: ReactNode }
  | { type: "highlight"; title?: string; items?: ReactNode[]; text?: ReactNode }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: ReactNode[] }
  | { type: "ordered"; items: ReactNode[] }
  | { type: "numberedCards"; title?: string; items: string[] }
  | { type: "checkGrid"; items: string[] }
  | { type: "iconGrid"; items: { icon: string; text: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type BlogSection = { title: string; blocks: BlogBlock[] };
export type BlogFaq = { q: string; a: ReactNode };
export type BlogResource = { label: string; url: string };

export interface BlogPostData {
  slug: string;
  title: string;            // Display H1
  metaTitle: string;        // <title>
  metaDescription: string;
  category: string;
  date: string;             // "December 3, 2025"
  isoDate: string;          // "2025-12-03"
  modified?: string;
  readTime: string;         // "8 min read"
  keywords: string[];
  heroImage: string;
  heroAlt: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  resources?: BlogResource[];
  closing?: { headline: string; primary: string };
  cta?: { heading: string; body: string; whatsappText: string };
}

const SITE = "https://www.innersparkafrica.com";
const LOGO = `${SITE}/innerspark-logo.png`;
const WA_NUMBER = "256792085773";

function renderBlock(b: BlogBlock, i: number) {
  switch (b.type) {
    case "lead":
      return <p key={i} className="text-xl text-muted-foreground leading-relaxed mb-6">{b.text}</p>;
    case "p":
      return <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{b.text}</p>;
    case "h3":
      return <h3 key={i} className="text-2xl font-semibold text-foreground mt-10 mb-4">{b.text}</h3>;
    case "h4":
      return <h4 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">{b.text}</h4>;
    case "callout":
      return (
        <div key={i} className="bg-accent/50 border-l-4 border-primary p-6 rounded-r-lg my-8">
          <p className="text-foreground font-medium text-lg mb-0">
            {b.label && <strong>{b.label} </strong>}{b.text}
          </p>
        </div>
      );
    case "quote":
      return (
        <blockquote key={i} className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8 italic">
          <p className="text-foreground text-lg mb-2">"{b.text}"</p>
          {b.cite && <cite className="text-muted-foreground not-italic">— {b.cite}</cite>}
        </blockquote>
      );
    case "list":
      return (
        <ul key={i} className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
          {b.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      );
    case "ordered":
      return (
        <ol key={i} className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
          {b.items.map((it, j) => <li key={j}>{it}</li>)}
        </ol>
      );
    case "highlight":
      return (
        <div key={i} className="bg-primary/5 p-6 rounded-xl my-6">
          {b.title && <h4 className="font-semibold text-foreground mb-4">{b.title}</h4>}
          {b.text && <p className="text-muted-foreground mb-0">{b.text}</p>}
          {b.items && (
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              {b.items.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          )}
        </div>
      );
    case "numberedCards":
      return (
        <div key={i} className="bg-secondary p-6 rounded-xl my-8">
          {b.title && <h4 className="text-xl font-semibold text-foreground mb-4">{b.title}</h4>}
          <ul className="list-none space-y-3">
            {b.items.map((it, j) => (
              <li key={j} className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{j + 1}</span>
                <span className="text-muted-foreground">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "checkGrid":
      return (
        <div key={i} className="grid md:grid-cols-2 gap-4 my-8">
          {b.items.map((it, j) => (
            <div key={j} className="bg-accent/30 p-4 rounded-lg flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span className="text-foreground">{it}</span>
            </div>
          ))}
        </div>
      );
    case "iconGrid":
      return (
        <div key={i} className="grid sm:grid-cols-2 gap-4 my-8">
          {b.items.map((it, j) => (
            <div key={j} className="bg-secondary p-4 rounded-lg flex items-center gap-4">
              <span className="text-2xl">{it.icon}</span>
              <span className="text-foreground font-medium">{it.text}</span>
            </div>
          ))}
        </div>
      );
    case "image":
      return (
        <figure key={i} className="my-8">
          <img src={b.src} alt={b.alt} className="w-full rounded-xl shadow-lg" loading="lazy" />
          {b.caption && <figcaption className="text-center text-sm text-muted-foreground mt-3">{b.caption}</figcaption>}
        </figure>
      );
  }
}

const BlogPostLayout = ({ data }: { data: BlogPostData }) => {
  const url = `${SITE}/blog/${data.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.metaDescription,
    image: LOGO,
    author: { "@type": "Organization", name: "Innerspark Africa", url: SITE },
    publisher: { "@type": "Organization", name: "Innerspark Africa", logo: { "@type": "ImageObject", url: LOGO } },
    datePublished: data.isoDate,
    dateModified: data.modified || data.isoDate,
    inLanguage: "en",
    keywords: data.keywords,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const faqSchema = data.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: typeof f.a === "string" ? f.a : "See article for details." },
    })),
  } : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: data.category, item: url },
    ],
  };

  const waText = encodeURIComponent(data.cta?.whatsappText || `Hi, I just read your article "${data.title}" and would like to book a therapy session.`);

  return (
    <>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <meta name="keywords" content={data.keywords.join(", ")} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={data.heroImage} />
        <meta property="article:published_time" content={data.isoDate} />
        <meta property="article:author" content="Innerspark Africa" />
        <meta property="article:section" content={data.category} />
        {data.keywords.slice(0, 4).map((k) => <meta key={k} property="article:tag" content={k} />)}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.metaTitle} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content={data.heroImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main>
        <article className="bg-background">
          {/* Hero */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img src={data.heroImage} alt={data.heroAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto">
                <nav className="mb-4">
                  <Link to="/blog" className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground bg-primary/80 px-3 py-1 rounded-full text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
                  </Link>
                </nav>
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {data.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">{data.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {data.date}</span>
                  <span className="flex items-center gap-2"><Clock className="h-5 w-5" /> {data.readTime}</span>
                  <div className="ml-auto">
                    <SocialShareButtons url={url} title={data.title} description={data.metaDescription} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {data.sections.map((s, i) => (
                  <section key={i} className="mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-6">{s.title}</h2>
                    {s.blocks.map(renderBlock)}
                  </section>
                ))}

                {/* FAQ */}
                {data.faqs.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {data.faqs.map((f, i) => (
                        <div key={i} className="bg-accent/30 p-6 rounded-xl">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{f.q}</h3>
                          <p className="text-muted-foreground mb-0">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Resources */}
                {data.resources && data.resources.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Helpful Resources</h2>
                    <div className="bg-secondary p-6 rounded-xl">
                      <ul className="space-y-3">
                        {data.resources.map((r, i) => (
                          <li key={i}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                              {r.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}

                {/* Closing */}
                {data.closing && (
                  <section className="mb-12">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/30 p-8 rounded-xl my-8 text-center">
                      <p className="text-xl text-foreground font-semibold mb-2">{data.closing.headline}</p>
                      <p className="text-2xl text-primary font-bold">{data.closing.primary}</p>
                    </div>
                  </section>
                )}

                {/* CTA */}
                {data.cta && (
                  <section className="bg-primary/10 p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{data.cta.heading}</h3>
                    <p className="text-muted-foreground mb-6">{data.cta.body}</p>
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Book a Session on WhatsApp
                    </a>
                  </section>
                )}

                <div className="flex items-center justify-center mt-12 pt-8 border-t border-border">
                  <SocialShareButtons url={url} title={data.title} description={data.metaDescription} />
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <RelatedArticles currentSlug={data.slug} />
      <AppDownload />
      <Footer />
    </>
  );
};

export default BlogPostLayout;