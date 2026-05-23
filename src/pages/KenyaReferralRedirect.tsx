import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { setReferralCookie } from "@/lib/referralCookie";

export default function KenyaReferralRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate("/kenya", { replace: true });
      return;
    }
    (async () => {
      const { data } = await supabase.rpc("get_referral_link_by_slug", { _slug: slug });
      if (!data || !(data as any).is_active) {
        setExpired(true);
        return;
      }
      // log click (best-effort)
      try {
        await supabase.rpc("log_referral_click", {
          _slug: slug,
          _ip_hash: null,
          _user_agent: navigator.userAgent,
        });
      } catch {}
      setReferralCookie(slug);
      navigate("/kenya", { replace: true });
    })();
  }, [slug, navigate]);

  if (expired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: "#F5F6FF" }}>
        <Helmet><title>Referral link expired | InnerSpark Africa</title></Helmet>
        <div className="max-w-md bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">This referral link has expired.</h1>
          <p className="text-sm text-gray-600 mt-3">The person who shared this link may have updated it. You can still access InnerSpark Africa directly:</p>
          <Link to="/kenya" className="inline-flex mt-6 font-medium text-white rounded-lg px-6 py-3" style={{ background: "#3B4FD4" }}>
            Visit innersparkafrica.com/kenya →
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">Loading…</div>
  );
}