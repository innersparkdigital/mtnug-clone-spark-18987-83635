import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const DISMISS_KEY = "ke_banner_dismissed";

export default function GeoKenyaBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "true") return;
    } catch {}
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lang = (navigator.language || "").toLowerCase();
      const isKE = tz === "Africa/Nairobi" || lang.includes("ke") || lang === "sw" || lang.startsWith("sw-");
      if (isKE) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2" style={{ background: "#EEF0FD", borderBottom: "1px solid #C5CAF5" }}>
      <span className="text-[13px]" style={{ color: "#0C447C" }}>
        You're visiting from Kenya — we have a page built for you.
      </span>
      <div className="flex items-center gap-4">
        <Link to="/kenya" className="text-[13px] font-medium" style={{ color: "#3B4FD4" }}>
          View Kenya page →
        </Link>
        <button
          aria-label="Dismiss"
          onClick={() => {
            try { sessionStorage.setItem(DISMISS_KEY, "true"); } catch {}
            setShow(false);
          }}
          style={{ color: "#0C447C" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}