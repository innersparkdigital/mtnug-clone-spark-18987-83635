import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, UserCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppDownload from "@/components/AppDownload";
import SocialShareButtons from "@/components/SocialShareButtons";
import RelatedArticles from "@/components/RelatedArticles";
import {
  BookHandoff,
  CheckGrid,
  CrisisCallout,
  FaqSection,
  InfoCallout,
  NumberedSteps,
  WhatYouLearn,
  needsCrisisCallout,
} from "@/components/blog/BlogCallouts";


export type BlogBlock =
  | { type: "lead"; text: ReactNode }
  | { type: "p"; text: ReactNode }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "callout"; label?: string; text: ReactNode }
  | { type: "crisis"; text?: ReactNode }
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
  /** Named author byline. Defaults to the InnerSpark clinical editorial team. */
  author?: string;
  /** Optional clinical reviewer, e.g. "Reviewed by Mirembe Norah, Clinical Counselling Psychologist". */
  reviewedBy?: { name: string; credential?: string };
  heroImage: string;
  heroAlt: string;
  /** One short paragraph of key takeaways, shown in the "What you'll learn" box. */
  whatYouLearn?: ReactNode;
  /** Force-show or hide the crisis/safety box. Defaults to topic detection. */
  crisisBox?: boolean;
  sections: BlogSection[];
  faqs: BlogFaq[];
  resources?: BlogResource[];
  closing?: { headline: string; primary: string };
  cta?: { heading: string; body: string; whatsappText: string };
}


const SITE = "https://www.innersparkafrica.com";
const LOGO = `${SITE}/innerspark-logo.webp`;
const DEFAULT_OG = `${SITE}/og-image.jpg`;
const absUrl = (src?: string) =>
  !src ? DEFAULT_OG : src.startsWith("http") ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
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
      return <InfoCallout key={i} label={b.label}>{b.text}</InfoCallout>;
    case "crisis":
      return <CrisisCallout key={i}>{b.text}</CrisisCallout>;
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
      return <NumberedSteps key={i} title={b.title} items={b.items} />;
    case "checkGrid":
      return <CheckGrid key={i} items={b.items} />;
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
    image: absUrl(data.heroImage),
    author: data.author
      ? { "@type": "Person", name: data.author }
      : { "@type": "Organization", name: "Innerspark Africa Clinical Team", url: SITE },
    ...(data.reviewedBy
      ? {
          reviewedBy: {
            "@type": "Person",
            name: data.reviewedBy.name,
            ...(data.reviewedBy.credential ? { jobTitle: data.reviewedBy.credential } : {}),
          },
        }
      : {}),
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

  // Crisis-adjacent topics always carry the safety box, unless the post already has one.
  const hasCrisisBlock = data.sections.some((s) => s.blocks.some((b) => b.type === "crisis"));
  const showCrisis =
    !hasCrisisBlock &&
    (data.crisisBox ?? needsCrisisCallout(data.title, data.category, data.metaDescription, data.keywords.join(" ")));

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
        <meta property="og:image" content={absUrl(data.heroImage)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={data.isoDate} />
        <meta property="article:modified_time" content={data.modified || data.isoDate} />
        <meta property="article:author" content={data.author || "Innerspark Africa Clinical Team"} />
        <meta property="article:section" content={data.category} />
        {data.keywords.slice(0, 4).map((k) => <meta key={k} property="article:tag" content={k} />)}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.metaTitle} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content={data.heroImage || DEFAULT_OG} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="bg-[#F7F3EA]">
        <article>
          {/* Editorial hero shared by every code-based blog post. */}
          <header className="border-b border-[#D9D0BF]">
            <div className="container mx-auto px-4 py-10 md:py-16 max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
              <div>
                <Link to="/blog" className="inline-flex items-center text-primary font-semibold text-sm mb-7">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
                </Link>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">{data.category}</span>
                <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#111827] leading-[1.08] tracking-tight mb-6">{data.title}</h1>
                <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed mb-7">{data.metaDescription}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#4B5563]">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {data.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {data.readTime}</span>
                  <span className="flex items-center gap-1.5"><UserCheck className="h-4 w-4" /> By {data.author || "InnerSpark Africa Clinical Team"}</span>
                </div>
              </div>
              <div className="relative">
                <img src={data.heroImage} alt={data.heroAlt} className="w-full aspect-[4/3] object-cover rounded-3xl shadow-sm" />
                <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white/95 border border-[#D9D0BF] p-4 shadow-sm">
                  <p className="text-sm font-bold text-[#111827]">Video therapy: UGX 75,000 per session</p>
                  <p className="text-sm text-[#4B5563]">Chat therapy: UGX 30,000 · Mobile Money or card</p>
                </div>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none text-[#1F2937] prose-headings:font-serif prose-headings:text-[#111827] prose-headings:tracking-tight prose-p:leading-[1.85] prose-p:text-[#374151] prose-a:text-primary prose-a:font-semibold prose-strong:text-[#111827]">
                {data.sections.map((s, i) => (
                  <section key={i} className="mb-12">
                    <h2 className="text-3xl font-serif font-semibold text-[#111827] border-t border-[#D9D0BF] pt-9 mb-6">{s.title}</h2>
                    {s.blocks.map((b, bi) => (
                      <div key={bi} className="contents">
                        {renderBlock(b, bi)}
                        {i === 0 && bi === 0 ? (
                          <WhatYouLearn>{data.whatYouLearn || data.metaDescription}</WhatYouLearn>
                        ) : null}
                        {i === 0 && bi === 1 ? <BookHandoff /> : null}
                      </div>
                    ))}
                    {i === 0 && s.blocks.length < 2 ? <BookHandoff /> : null}
                    {showCrisis && i === Math.min(1, data.sections.length - 1) ? <CrisisCallout /> : null}
                  </section>
                ))}

                {/* FAQ */}
                <FaqSection items={data.faqs} />


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
                    <p className="text-muted-foreground mb-2">Video therapy is UGX 75,000 per session; chat therapy is UGX 30,000.</p>
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

      <div className="bg-[#F7F3EA]">
        <RelatedArticles currentSlug={data.slug} />
      </div>
      <AppDownload />
      <Footer />
    </>
  );
};

export default BlogPostLayout;