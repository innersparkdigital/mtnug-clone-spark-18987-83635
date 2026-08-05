import { Helmet } from "react-helmet";

const SITE = "https://www.innersparkafrica.com";
const LOGO = `${SITE}/innerspark-logo.png`;

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
  author = "Innerspark Africa",
  section,
  keywords,
  withMeta = true,
}: ArticleSchemaProps) => {
  const url = `${SITE}${path}`;
  const img = absolute(image);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: img,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "en",
    ...(section ? { articleSection: section } : {}),
    ...(keywords?.length ? { keywords } : {}),
    author: { "@type": "Organization", name: author, url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Innerspark Africa",
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
