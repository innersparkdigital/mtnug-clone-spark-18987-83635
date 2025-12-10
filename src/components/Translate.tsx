import { useEffect, useState, ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranslateProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

// Simple inline translation component
export function T({ children, as: Component = "span", className }: TranslateProps) {
  const { translate, language } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (language === "en") {
      setTranslated(children);
      return;
    }

    let cancelled = false;
    translate(children).then((result) => {
      if (!cancelled) {
        setTranslated(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [children, language, translate]);

  if (Component === "span" && !className) {
    return <>{translated}</>;
  }

  return <Component className={className}>{translated}</Component>;
}

// Hook for translating multiple texts at once (more efficient)
export function usePageTranslations<T extends Record<string, string>>(
  texts: T
): T {
  const { translateBatch, language } = useLanguage();
  const [translations, setTranslations] = useState<T>(texts);

  useEffect(() => {
    if (language === "en") {
      setTranslations(texts);
      return;
    }

    const keys = Object.keys(texts) as (keyof T)[];
    const values = keys.map((k) => texts[k]);

    translateBatch(values).then((results) => {
      const newTranslations = {} as T;
      keys.forEach((key, i) => {
        newTranslations[key] = results[i] as T[keyof T];
      });
      setTranslations(newTranslations);
    });
  }, [language, JSON.stringify(texts)]);

  return translations;
}
