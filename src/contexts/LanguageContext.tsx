import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "fr" | "sw" | "pt";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "sw", name: "Kiswahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
];

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  currentLanguage: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CACHE_KEY = "innerspark_translations";
const LANGUAGE_KEY = "innerspark_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || "en";
  });
  const [cache, setCache] = useState<TranslationCache>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // Cache might be too large, clear it
      localStorage.removeItem(CACHE_KEY);
    }
  }, [cache]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translate = async (text: string): Promise<string> => {
    if (language === "en" || !text.trim()) return text;

    // Check cache
    const cacheKey = text.trim().toLowerCase();
    if (cache[cacheKey]?.[language]) {
      return cache[cacheKey][language];
    }

    setIsTranslating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, targetLang: language }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const { translation } = await response.json();

      // Update cache
      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          ...prev[cacheKey],
          [language]: translation,
        },
      }));

      return translation;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateBatch = async (texts: string[]): Promise<string[]> => {
    if (language === "en") return texts;

    const results: string[] = [];
    const toTranslate: { index: number; text: string }[] = [];

    // Check cache first
    texts.forEach((text, index) => {
      const cacheKey = text.trim().toLowerCase();
      if (cache[cacheKey]?.[language]) {
        results[index] = cache[cacheKey][language];
      } else {
        results[index] = text;
        toTranslate.push({ index, text });
      }
    });

    if (toTranslate.length === 0) return results;

    setIsTranslating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            texts: toTranslate.map((t) => t.text),
            targetLang: language,
          }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const { translations } = await response.json();

      // Update results and cache
      const newCache = { ...cache };
      toTranslate.forEach(({ index, text }, i) => {
        const translated = translations[i] || text;
        results[index] = translated;
        const cacheKey = text.trim().toLowerCase();
        newCache[cacheKey] = {
          ...newCache[cacheKey],
          [language]: translated,
        };
      });
      setCache(newCache);

      return results;
    } catch (error) {
      console.error("Batch translation error:", error);
      return results;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        translateBatch,
        isTranslating,
        currentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
