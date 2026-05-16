import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SectionItem = { icon?: string; value: string; label: string };
export type SectionData = { eyebrow?: string; title?: string; items: SectionItem[] };

export function useSiteSection(key: string, fallback: { is_visible: boolean; data: SectionData }) {
  const [state, setState] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase as any)
      .from("site_sections")
      .select("is_visible, data")
      .eq("section_key", key)
      .maybeSingle()
      .then(({ data }: any) => {
        if (cancelled || !data) { setLoaded(true); return; }
        setState({ is_visible: data.is_visible, data: data.data });
        setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [key]);

  return { ...state, loaded };
}
