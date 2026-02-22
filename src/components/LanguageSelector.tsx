import { GoogleTranslate } from "./GoogleTranslate";

interface LanguageSelectorProps {
  variant?: "header" | "footer";
}

export function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  return (
    <div className={variant === "header" ? "inline-flex items-center border border-input rounded-md px-2 py-1 bg-background text-foreground text-sm scale-90" : ""}>
      <GoogleTranslate />
    </div>
  );
}
