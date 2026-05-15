import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { CAMPAIGN_COPY, type CampaignLang } from '@/lib/campaignTranslations';
import { ScreeningAnxietyFAQ } from '@/components/wellbeing/ScreeningAnxietyFAQ';
import { Loader2, X, Check } from 'lucide-react';

const LANG_KEY = 'is_lang';
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
  mode: 'corporate' | 'community' | 'informal' | string;
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

export default function CampaignLanding() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [language, setLanguage] = useState<CampaignLang>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = sessionStorage.getItem(LANG_KEY) as CampaignLang | null;
    return stored || 'en';
  });
  const [now, setNow] = useState(Date.now());
  const [completion, setCompletion] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const lockedRef = useRef(false);

  // Load campaign
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_campaign_by_slug', { _slug: slug });
      if (cancelled) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        const c = data as unknown as Campaign;
        setCampaign(c);
        // Fall back to first enabled language if current isn't enabled
        if (c.languages_enabled?.length && !c.languages_enabled.includes(language)) {
          setLanguage(c.languages_enabled[0] as CampaignLang);
        }
        // Fire-and-forget: lock the slug on first public hit
        if (!lockedRef.current) {
          lockedRef.current = true;
          supabase.rpc('lock_campaign_slug', { _slug: slug }).then(() => undefined);
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Countdown ticker
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Participation polling
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
    const id = setInterval(fetchCompletion, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [campaign]);

  const T = CAMPAIGN_COPY[language];
  const closed = useMemo(() => {
    if (!campaign?.campaign_close_date) return false;
    return new Date(campaign.campaign_close_date).getTime() <= now;
  }, [campaign, now]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <BrandedPanel
        title={T.notFoundTitle}
        body={T.notFoundBody}
        accentColor="#dc2626"
      />
    );
  }

  const headline = campaign.campaign_headline?.trim() || T.defaultHeadline(campaign.name);
  const subtext = campaign.campaign_subtext?.trim() || T.defaultSubtext;
  const remaining = campaign.campaign_close_date ? getRemaining(campaign.campaign_close_date) : null;
  const totalEmployees = Math.max(completion.total, campaign.employee_count || 0, 1);
  const pct = Math.min(100, Math.round((completion.completed / totalEmployees) * 100));

  const startCheck = () => {
    sessionStorage.setItem(LANG_KEY, language);
    navigate(`/corporate-wellbeing-check?slug=${encodeURIComponent(campaign.slug)}&lang=${language}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${campaign.name} — Wellbeing Check`}</title>
        <meta name="description" content={subtext.slice(0, 160)} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* ZONE 1 — Hero */}
      <header style={{ backgroundColor: SPARK_BLUE }} className="px-5 py-5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {campaign.logo_url ? (
              <>
                <div className="bg-white rounded-full px-2 py-1 inline-flex items-center" style={{ height: 40, maxWidth: 140 }}>
                  <img src={campaign.logo_url} alt={campaign.name} className="object-contain" style={{ maxHeight: 28, maxWidth: 120 }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>×</span>
              </>
            ) : null}
            <img
              src="https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png"
              alt="InnerSpark Africa"
              style={{ height: 32, filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <h1 className="text-white" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4 }}>{headline}</h1>
          <p style={{ color: '#C5CAF5', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>{subtext}</p>
        </div>
      </header>

      {/* ZONE 2 — Warmth stripe */}
      <div style={{ height: 4, backgroundColor: ACCENT_ORANGE }} />

      <main className="max-w-md mx-auto px-5 py-5 space-y-5">
        {/* ZONE 3 — Language selector */}
        {campaign.languages_enabled && campaign.languages_enabled.length > 1 && (
          <div className="flex gap-2">
            {(campaign.languages_enabled as CampaignLang[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => { setLanguage(lng); sessionStorage.setItem(LANG_KEY, lng); }}
                className="px-3 py-1.5 rounded-md text-[11px] transition-colors"
                style={
                  language === lng
                    ? { backgroundColor: '#EEF0FD', border: `1px solid ${SPARK_BLUE}`, color: '#0C447C', fontWeight: 500 }
                    : { backgroundColor: 'hsl(var(--muted))', border: '1px solid transparent', color: 'hsl(var(--foreground))' }
                }
              >
                {CAMPAIGN_COPY[lng].langName}
              </button>
            ))}
          </div>
        )}

        {/* ZONE 4 — Countdown */}
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
                  <div style={{ fontSize: 20, fontWeight: 500 }} className="text-foreground">{String(v).padStart(2, '0')}</div>
                  <div style={{ fontSize: 10 }} className="text-muted-foreground">{T.countdown[k]}</div>
                </div>
              ))}
            </div>
          ) : null
        )}

        {/* ZONE 5 — Participation */}
        {totalEmployees > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">{T.participation(completion.completed, totalEmployees)}</div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: HEALING_GREEN }} />
            </div>
          </div>
        )}

        {/* ZONE 8 — Myths card (community/informal only) */}
        {(campaign.mode === 'community' || campaign.mode === 'informal') && (
          <div className="rounded-lg p-4" style={{ backgroundColor: '#FCEBEB', borderLeft: '4px solid #E24B4A' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: '#991b1b' }}>{T.myths.title}</div>
            <div className="space-y-1.5">
              {[
                { ic: '✗', t: T.myths.notHiv, c: '#dc2626' },
                { ic: '✗', t: T.myths.notMedical, c: '#dc2626' },
                { ic: '✗', t: T.myths.notEmployer, c: '#dc2626' },
                { ic: '✗', t: T.myths.notPerformance, c: '#dc2626' },
                { ic: '✓', t: T.myths.isFeelings, c: '#15803d' },
                { ic: '✓', t: T.myths.isPrivate, c: '#15803d' },
              ].map((row, i) => (
                <div key={i} className="bg-white rounded-md px-3 py-2 flex items-center gap-2 text-xs">
                  <span style={{ color: row.c, fontWeight: 700, width: 14, display: 'inline-block', textAlign: 'center' }}>{row.ic}</span>
                  <span style={{ color: row.c }}>{row.t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZONE 6 — FAQ */}
        <ScreeningAnxietyFAQ language={language} companyId={campaign.id} />

        {/* ZONE 9 — Incentive (community-style, but show whenever > 0) */}
        {campaign.incentive_amount_ugx > 0 && (
          <div className="rounded-md px-4 py-3 text-xs" style={{ backgroundColor: '#E8F5EE', color: '#085041' }}>
            {T.incentive(campaign.incentive_amount_ugx)}
          </div>
        )}

        {/* ZONE 7 — CTA */}
        {!closed && (
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={startCheck}
              className="w-full text-white rounded-lg transition-opacity hover:opacity-95"
              style={{ backgroundColor: SPARK_BLUE, padding: '13px', fontSize: 14, fontWeight: 500 }}
            >
              {T.cta}
            </button>
            <p className="text-[11px] text-center text-muted-foreground leading-relaxed">{T.privacy}</p>
          </div>
        )}
      </main>
    </div>
  );
}

function BrandedPanel({ title, body, accentColor }: { title: string; body: string; accentColor: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="max-w-md w-full">
        <header style={{ backgroundColor: SPARK_BLUE }} className="px-5 py-5 rounded-t-lg">
          <img
            src="https://hnjpsvpudwwyzrrwzbpa.supabase.co/storage/v1/object/public/email-assets/innerspark-logo.png"
            alt="InnerSpark Africa"
            style={{ height: 32, filter: 'brightness(0) invert(1)' }}
          />
        </header>
        <div style={{ height: 4, backgroundColor: ACCENT_ORANGE }} />
        <div className="bg-card rounded-b-lg p-6 text-center">
          <div className="mx-auto mb-3 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>
            <X className="w-5 h-5" />
          </div>
          <h1 className="text-base font-semibold text-foreground mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}