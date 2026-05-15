import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Plus, Check } from 'lucide-react';
import { CAMPAIGN_COPY, type CampaignLang } from '@/lib/campaignTranslations';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  language?: CampaignLang;
  companyId?: string | null;
}

const SESSION_KEY = 'is_faq_session';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Screening Anxiety FAQ — addresses the 5 fears that block participation:
 * employer privacy, job security, HIV-test confusion, WHO credibility, what-happens-next.
 * Order is fixed (Q3 must stay third — culturally most-loaded fear).
 */
export function ScreeningAnxietyFAQ({ language = 'en', companyId }: Props) {
  const T = CAMPAIGN_COPY[language].faq;
  const [openIndex, setOpenIndex] = useState(-1);
  const openedSetRef = useRef<Set<number>>(new Set());
  const firstOpenRef = useRef(false);
  const completedRef = useRef(false);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const log = async (event_type: string, item_index?: number) => {
    try {
      await supabase.from('campaign_faq_events').insert({
        company_id: companyId || null,
        session_id: getSessionId(),
        event_type,
        item_index: item_index ?? null,
        language,
      });
    } catch (_) { /* analytics best-effort */ }
  };

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
    if (!openedSetRef.current.has(i)) {
      openedSetRef.current.add(i);
      log('faq_item_opened', i + 1);
      if (!firstOpenRef.current) {
        firstOpenRef.current = true;
        log('faq_opened');
      }
      if (!completedRef.current && openedSetRef.current.size >= 3) {
        completedRef.current = true;
        log('faq_completed');
      }
    }
    // Mobile: scroll into view
    setTimeout(() => {
      const el = itemRefs.current[i];
      if (el && i !== openIndex) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 100);
  };

  // Render answer with green leading "No." / "Yes." / "Hapana." etc
  const renderAnswer = (text: string) => {
    const m = text.match(/^([A-Za-zÀ-ÿ]+\.)\s+(.*)$/s);
    if (!m) return <span>{text}</span>;
    return (
      <>
        <span style={{ color: '#15803d', fontWeight: 600 }}>{m[1]}</span>{' '}
        <span>{m[2]}</span>
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span className="text-xs font-medium text-foreground">{T.sectionTitle}</span>
      </div>
      <div className="space-y-1.5">
        {T.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="border border-border rounded-lg bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-xs font-medium text-foreground">{item.q}</span>
                <Plus
                  className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                />
              </button>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-out"
                style={{ maxHeight: isOpen ? '320px' : '0px' }}
              >
                <div className="px-3 pb-2.5 text-xs leading-relaxed text-muted-foreground">
                  {renderAnswer(item.a)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60">
        <Check className="w-3.5 h-3.5 text-green-600" />
        <span className="text-[11px] text-muted-foreground">{T.confirmText}</span>
      </div>
    </div>
  );
}