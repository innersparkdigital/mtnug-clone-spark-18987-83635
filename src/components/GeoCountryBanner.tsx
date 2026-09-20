import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisitorMarket, type VisitorMarket } from "@/hooks/useVisitorMarket";

const MARKETS: Record<VisitorMarket, { country: string; flag: string; path: string }> = {
  kenya: { country: "Kenya", flag: "🇰🇪", path: "/kenya" },
  nigeria: { country: "Nigeria", flag: "🇳🇬", path: "/nigeria" },
  tanzania: { country: "Tanzania", flag: "🇹🇿", path: "/tanzania" },
  gambia: { country: "The Gambia", flag: "🇬🇲", path: "/gambia" },
  ghana: { country: "Ghana", flag: "🇬🇭", path: "/ghana" },
  usa: { country: "the United States", flag: "🇺🇸", path: "/usa" },
};

export default function GeoCountryBanner() {
  const market = useVisitorMarket();
  const [dismissed, setDismissed] = useState(false);
  const details = market ? MARKETS[market] : null;

  useEffect(() => {
    if (!market) return;
    try {
      setDismissed(sessionStorage.getItem(`country_banner_${market}`) === "true");
    } catch {
      setDismissed(false);
    }
  }, [market]);

  if (!market || !details || dismissed) return null;

  return (
    <div className="border-b border-primary/20 bg-accent px-4 py-2 text-accent-foreground">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs sm:text-sm">
          <span className="mr-2" aria-hidden>{details.flag}</span>
          Therapy information and local pricing for {details.country}.
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <Button asChild variant="link" size="sm" className="h-8 px-2 text-xs sm:text-sm">
            <Link to={details.path}>View your local page</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Dismiss country suggestion"
            onClick={() => {
              try { sessionStorage.setItem(`country_banner_${market}`, "true"); } catch {}
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}