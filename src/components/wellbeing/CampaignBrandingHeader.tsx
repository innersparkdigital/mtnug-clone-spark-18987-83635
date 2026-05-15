import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CAMPAIGN_COPY, type CampaignLang } from '@/lib/campaignTranslations';

const SPARK_BLUE = '#3B4FD4';
const ACCENT_ORANGE = '#F2994A';
const HEALING_GREEN = '#2E7D5E';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  campaign_headline: string | null;
  campaign_subtext: string | null;
  campaign_close_date: string | null;
  languages_enabled: string[];
  mode: string;
  incentive_amount_ugx: number;
  employee_count: number | null;
}

function getRemaining(target: string) {
  const total = new Date(target).getTime() - Date.now();
  const seconds = Math.max(0, Math.floor((total / 1000) % 60));
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));
  return { total, days, hours, minutes, seconds };
}

interface Props {
  slug: string;
  language: CampaignLang;
  onLanguageChange?: (lng: CampaignLang) => void;
  /** Show the participation progress bar */
  showProgress?: boolean;
}

/**
 * Branded campaign hero injected into the wellbeing-check flow when the
 * employee arrives via /check/:slug. Mirrors the public CampaignLanding hero
 * (logo lockup + headline + language switcher + countdown + progress bar)
 * so the experience stays consistent across the access-code entry, welcome
 * screen, and the test itself.
 */
export const CampaignBrandingHeader = ({ slug, language, onLanguageChange, showProgress = true }: Props) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [completion, setCompletion] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.rpc('get_campaign_by_slug', { _slug: slug });
      if (!cancelled && data) setCampaign(data as unknown as Campaign);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!campaign) return;
    let cancelled = false;
    const fetchCompletion = async () => {
      const { data } = await supabase.rpc('get_campaign_completion', { _company_id: campaign.id });
      if (cancelled || !data) return;
      const d = data as { completed: number; total: number };
      setCompletion({
        completed: d.completed || 0,
        total: Math.max(d.total || 0, campaign.employee_count || 0),
      });
    };
    fetchCompletion();
    const id = setInterval(fetchCompletion, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [campaign]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const T = CAMPAIGN_COPY[language] || CAMPAIGN_COPY.en;
  const closed = useMemo(() => {
    if (!campaign?.campaign_close_date) return false;
    return new Date(campaign.campaign_close_date).getTime() <= now;
  }, [campaign, now]);

  if (!campaign) return null;

  const headline = campaign.campaign_headline?.trim() || T.defaultHeadline(campaign.name);
  const subtext = campaign.campaign_subtext?.trim() || T.defaultSubtext;
  const remaining = campaign.campaign_close_date ? getRemaining(campaign.campaign_close_date) : null;
  const totalEmployees = Math.max(completion.total, campaign.employee_count || 0, 1);
  const pct = Math.min(100, Math.round((completion.completed / totalEmployees) * 100));

  return (
    <div className="mb-6">
      {/* Hero */}
      <div style={{ backgroundColor: SPARK_BLUE }} className="px-5 py-5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {campaign.logo_url ? (
              <>
                <div className="bg-white rounded-full px-2 py-1 inline-flex items-center" style={{ height: 40, maxWidth: 140 }}>
                  <img src={campaign.logo_url} alt={campaign.name} className="object-contain" style={{ maxHeight: 28, maxWidth: 120 }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>×</span>
              </>
            ) : (
              <div className="bg-white/10 rounded-full px-3 py-1 text-white text-xs font-medium">{campaign.name}</div>
            )}
            <img
              src="https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png"
              alt="InnerSpark Africa"
              style={{ height: 28, filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <h1 className="text-white" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.4 }}>{headline}</h1>
          <p style={{ color: '#C5CAF5', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>{subtext}</p>
        </div>
      </div>

      {/* Warmth stripe */}
      <div style={{ height: 4, backgroundColor: ACCENT_ORANGE }} />

      <div className="max-w-md mx-auto px-5 pt-4 space-y-4">
        {/* Language switcher */}
        {campaign.languages_enabled?.length > 1 && onLanguageChange && (
          <div className="flex gap-2">
            {(campaign.languages_enabled as CampaignLang[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => onLanguageChange(lng)}
                className="px-3 py-1.5 rounded-md text-[11px] transition-colors"
                style={
                  language === lng
                    ? { backgroundColor: '#EEF0FD', border: `1px solid ${SPARK_BLUE}`, color: '#0C447C', fontWeight: 500 }
                    : { backgroundColor: 'hsl(var(--muted))', border: '1px solid transparent', color: 'hsl(var(--foreground))' }
                }
              >
                {CAMPAIGN_COPY[lng]?.langName || lng}
              </button>
            ))}
          </div>
        )}

        {/* Countdown */}
        {campaign.campaign_close_date && (
          closed ? (
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-center text-muted-foreground">{T.closed}</div>
          ) : remaining ? (
            <div className="grid grid-cols-4 gap-2">
              {([
                ['days', remaining.days], ['hours', remaining.hours],
                ['minutes', remaining.minutes], ['seconds', remaining.seconds],
              ] as const).map(([k, v]) => (
                <div key={k} className="bg-muted rounded-lg py-2 text-center">
                  <div style={{ fontSize: 18, fontWeight: 600 }} className="text-foreground">{String(v).padStart(2, '0')}</div>
                  <div style={{ fontSize: 10 }} className="text-muted-foreground">{T.countdown[k]}</div>
                </div>
              ))}
            </div>
          ) : null
        )}

        {/* Participation */}
        {showProgress && totalEmployees > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">{T.participation(completion.completed, totalEmployees)}</div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: HEALING_GREEN }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBrandingHeader;