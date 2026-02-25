import { useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or detect from browser
    const saved = localStorage.getItem('vnx-language');
    if (saved && saved in translations) {
      return saved as Language;
    }
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('sw')) return 'sw';
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('vnx-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return (translations[language] as any)[key] || translations.en[key] || key;
  };

  return {
    language,
    setLanguage,
    t
  };
}

export type { Language };