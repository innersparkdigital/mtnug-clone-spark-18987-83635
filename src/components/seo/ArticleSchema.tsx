import { Helmet } from "react-helmet";

const SITE = "https://www.innersparkafrica.com";
const LOGO = `${SITE}/innerspark-logo.webp`;

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  /** Route path, e.g. "/events-training/mtn-internship-anxiety" */
  path: string;
  /** ISO date, e.g. "2025-07-11" */
  datePublished: string;
  dateModified?: string;
  /** Imported asset or absolute URL */
  image: string;
  author?: string;
  authorUrl?: string;
  section?: string;
  keywords?: string[];
  /** Also emit <title> and meta description for the page */
  withMeta?: boolean;
}

const absolute = (src: string) =>
  src.startsWith("http") ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;

/** Emits Article JSON-LD (and optional head metadata) for editorial pages. */
const ArticleSchema = ({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  image,
  author = "InnerSpark Africa",
  authorUrl,
  section,
  keywords,
  withMeta = true,
}: ArticleSchemaProps) => {
  const url = `${SITE}${path}`;
  const img = absolute(image);
  const organizationAuthored = author.trim().toLowerCase() === "innerspark africa";
  const authorSchema = organizationAuthored
    ? { "@type": "Organization", "@id": `${SITE}/#organization`, name: "InnerSpark Africa", url: SITE }
    : { "@type": "Person", name: author, ...(authorUrl ? { url: absolute(authorUrl) } : {}) };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: { "@type": "ImageObject", url: img },
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "en",
    ...(section ? { articleSection: section } : {}),
    ...(keywords?.length ? { keywords } : {}),
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "InnerSpark Africa",
      logo: { "@type": "ImageObject", url: LOGO },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <Helmet>
      {withMeta && <title>{`${headline} | Innerspark Africa`}</title>}
      {withMeta && <meta name="description" content={description} />}
      {withMeta && <link rel="canonical" href={url} />}
      {withMeta && <meta property="og:type" content="article" />}
      {withMeta && <meta property="og:title" content={headline} />}
      {withMeta && <meta property="og:description" content={description} />}
      {withMeta && <meta property="og:url" content={url} />}
      {withMeta && <meta property="og:image" content={img} />}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ArticleSchema;
