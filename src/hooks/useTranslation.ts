import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTranslation(text: string): string {
  const { translate, language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (language === "en") {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    translate(text).then((result) => {
      if (!cancelled) {
        setTranslated(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, language, translate]);

  return translated;
}

export function useTranslations(texts: string[]): string[] {
  const { translateBatch, language } = useLanguage();
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (language === "en") {
      setTranslated(texts);
      return;
    }

    let cancelled = false;
    translateBatch(texts).then((results) => {
      if (!cancelled) {
        setTranslated(results);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [texts.join("|"), language, translateBatch]);

  return translated;
}
