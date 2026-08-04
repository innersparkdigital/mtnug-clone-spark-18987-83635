import { Helmet } from "react-helmet";

/**
 * Keeps private app surfaces (portals, dashboards, client space) out of Google.
 */
export default function NoIndex({ title }: { title?: string }) {
  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
    </Helmet>
  );
}