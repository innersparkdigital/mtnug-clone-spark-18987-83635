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
  // Locked to dark: dashboards permanently use the deep-blue calm theme.
  return "dark";
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
  // Force calm-dark on every dashboard for a consistent deep-blue surface.
  return (
    <div className={`calm-theme calm-dark ${className}`}>
      {children}
    </div>
  );
};