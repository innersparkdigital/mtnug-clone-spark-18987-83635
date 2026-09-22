import { Navigate, useParams } from "react-router-dom";
import MarketLandingPage from "@/components/MarketLandingPage";
import { MARKET_LANDINGS } from "@/data/marketLandings";

export default function LocalizedTherapy({ marketOverride }: { marketOverride?: string }) {
  const { market: routeMarket = "" } = useParams();
  const key = (marketOverride || routeMarket).toLowerCase();
  const market = MARKET_LANDINGS[key];
  if (!market) return <Navigate to="/" replace />;
  return <MarketLandingPage market={market} />;
}
