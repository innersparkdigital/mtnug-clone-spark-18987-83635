import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, boolean>();
const listeners = new Map<string, Set<(v: boolean) => void>>();
let loaded = false;
let loadPromise: Promise<void> | null = null;

const loadAll = () => {
  if (loadPromise) return loadPromise;
  loadPromise = (supabase as any)
    .from("site_sections")
    .select("section_key, is_visible")
    .then(({ data }: any) => {
      (data || []).forEach((r: any) => {
        cache.set(r.section_key, r.is_visible);
        listeners.get(r.section_key)?.forEach((cb) => cb(r.is_visible));
      });
      loaded = true;
    });
  return loadPromise;
};

export function useSectionVisibility(key: string, defaultVisible = true): boolean {
  const [visible, setVisible] = useState<boolean>(cache.get(key) ?? defaultVisible);
  useEffect(() => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(setVisible);
    if (cache.has(key)) setVisible(cache.get(key)!);
    else if (!loaded) loadAll();
    return () => { listeners.get(key)?.delete(setVisible); };
  }, [key]);
  return visible;
}