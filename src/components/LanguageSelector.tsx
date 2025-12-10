import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, languages, Language } from "@/contexts/LanguageContext";

interface LanguageSelectorProps {
  variant?: "header" | "footer";
}

export function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguage, isTranslating } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger
        className={`gap-2 ${
          variant === "header"
            ? "w-auto border-none bg-transparent hover:bg-primary/10 text-xs h-8"
            : "w-[180px] bg-background/10 border-border/30 text-foreground"
        }`}
      >
        <Globe className="h-4 w-4" />
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{currentLanguage.flag}</span>
            <span className={variant === "header" ? "hidden sm:inline" : ""}>
              {currentLanguage.nativeName}
            </span>
          </span>
        </SelectValue>
        {isTranslating && (
          <span className="animate-spin ml-1">⟳</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-muted-foreground text-xs">({lang.name})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
