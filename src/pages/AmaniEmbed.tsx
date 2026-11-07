import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import AmaniChat from "@/components/amani/AmaniChat";
import { cleanOrgKey } from "@/lib/amaniApi";

/**
 * Page loaded inside a partner website's iframe by /amani-embed.js.
 * No site header or footer. Always noindex (see PrivateRouteNoIndex).
 */
export default function AmaniEmbed() {
  const org = useMemo(() => cleanOrgKey(new URLSearchParams(window.location.search).get("org")), []);

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "transparent";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  const close = () => window.parent?.postMessage({ type: "amani:close" }, "*");

  return (
    <>
      <Helmet>
        <title>Amani chat</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <AmaniChat variant="inline" embedded orgKey={org} onClose={window.parent !== window ? close : undefined} />
    </>
  );
}
