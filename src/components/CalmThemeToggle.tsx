import { Moon, Sun } from "lucide-react";
import { useCalmTheme } from "@/contexts/CalmThemeContext";

const CalmThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useCalmTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-card text-foreground hover:bg-accent transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default CalmThemeToggle;