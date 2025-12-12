import { GoogleTranslate } from "./GoogleTranslate";

interface LanguageSelectorProps {
  variant?: "header" | "footer";
}

export function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  return (
    <div className={variant === "header" ? "scale-90" : ""}>
      <GoogleTranslate />
    </div>
  );
}
