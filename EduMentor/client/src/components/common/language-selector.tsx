import { useState } from "react";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LanguageSelectorProps {
  currentLanguage: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LanguageSelector = ({ currentLanguage }: LanguageSelectorProps) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState(currentLanguage);

  const languages: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    
    // In a real app, this would call an API to update the user's language preference
    // For now, we'll just show a toast notification
    toast({
      title: "Language Changed",
      description: `Language set to ${languages.find(l => l.code === lang)?.name}`,
    });
  };

  const getCurrentLanguageName = () => {
    return languages.find(l => l.code === language)?.name || "English";
  };

  const getCurrentLanguageFlag = () => {
    return languages.find(l => l.code === language)?.flag || "🇺🇸";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 px-3">
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">{getCurrentLanguageName()}</span>
          <span className="inline md:hidden">{getCurrentLanguageFlag()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {lang.code === language && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
