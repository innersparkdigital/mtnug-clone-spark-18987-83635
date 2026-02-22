import { Globe } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  variant?: "header" | "footer";
}

export function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
      <SelectTrigger
        className={
          variant === "header"
            ? "w-[100px] h-8 text-xs gap-1 border-input bg-background"
            : "w-[140px] h-9 text-sm"
        }
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover z-[100]">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
