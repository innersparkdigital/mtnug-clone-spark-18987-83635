import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
const KEY = "innerspark-calm-theme";

interface Ctx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const CalmThemeContext = createContext<Ctx | null>(null);

const initial = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const CalmThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(initial);

  useEffect(() => {
    try { window.localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <CalmThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </CalmThemeContext.Provider>
  );
};

export const useCalmTheme = () => {
  const ctx = useContext(CalmThemeContext);
  if (!ctx) return { theme: "light" as Theme, toggle: () => {}, setTheme: () => {} };
  return ctx;
};

/** Wraps a screen with the calm dashboard tokens. Adds `.calm-dark` when dark. */
export const CalmThemeRoot = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const { theme } = useCalmTheme();
  return (
    <div className={`calm-theme ${theme === "dark" ? "calm-dark" : ""} ${className}`}>
      {children}
    </div>
  );
};