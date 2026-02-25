import { useEffect, useState } from 'react';

interface UserLocale {
  lang: string;
  region: string;
  country: string;
  timezone: string;
}

function getUserLocale(): UserLocale {
  const lang = navigator.language || 'en';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const country = lang.includes('-') ? lang.split('-')[1] : 'US';
  const region = timezone.split('/')[0] || 'Global';
  
  return { 
    lang: lang.split('-')[0],
    region, 
    country: country.toLowerCase(),
    timezone 
  };
}

function getRegionDisplayName(region: string): string {
  const regionNames: Record<string, string> = {
    'America': 'Americas',
    'Europe': 'Europe',
    'Asia': 'Asia Pacific',
    'Africa': 'Africa',
    'Australia': 'Oceania',
    'Global': 'Global'
  };
  
  return regionNames[region] || region;
}

interface LocaleDetectorProps {
  onLocaleDetected: (locale: UserLocale) => void;
}

export default function LocaleDetector({ onLocaleDetected }: LocaleDetectorProps) {
  const [locale, setLocale] = useState<UserLocale | null>(null);

  useEffect(() => {
    const detectedLocale = getUserLocale();
    setLocale(detectedLocale);
    onLocaleDetected(detectedLocale);
    console.log(`Detected language: ${detectedLocale.lang}, Region: ${detectedLocale.region}, Country: ${detectedLocale.country}`);
  }, [onLocaleDetected]);

  if (!locale) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <i className="fas fa-globe text-blue-500"></i>
      <span>{getRegionDisplayName(locale.region)}</span>
      <span className="text-xs opacity-75">({locale.lang.toUpperCase()})</span>
    </div>
  );
}