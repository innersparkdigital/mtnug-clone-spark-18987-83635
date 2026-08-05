import { useParams } from "react-router-dom";
import GlobalLandingPage from "@/components/seo/GlobalLandingPage";
import NotFound from "@/pages/NotFound";
import { GLOBAL_LANDING_PAGES } from "@/lib/globalLandingData";

interface Props {
  /** Slug when rendered from a static route. */
  slug?: string;
}

export default function GlobalLanding({ slug }: Props) {
  const params = useParams();
  const key = slug || params.slug || "";
  const data = GLOBAL_LANDING_PAGES[key];
  if (!data) return <NotFound />;
  return <GlobalLandingPage {...data} />;
}