import { Helmet } from "react-helmet";

const SITE = "https://www.innersparkafrica.com";
const DEFAULT_OG = `${SITE}/og-image.jpg`;

interface PageSeoProps {
  /** Route path, e.g. "/privacy-policy" — the canonical is built from it. */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

/**
 * Single source of truth for per-page head tags: self-referencing canonical,
 * title, description and a real 1200x630 social preview image.
 */
export default function PageSeo({
  path,
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG,
  ogTitle,
  ogDescription,
  type = "website",
  noindex = false,
}: PageSeoProps) {
  const url = `${SITE}${path === "/" ? "" : path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}