export interface UserLocale {
  lang: string;
  region: string;
  country: string;
  timezone: string;
}

export function getUserLocale(): UserLocale {
  const lang = navigator.language || 'en';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Extract country code from language tag (e.g., 'en-US' -> 'US')
  const country = lang.includes('-') ? lang.split('-')[1] : 'US';
  
  // Get region from timezone (e.g., 'America/New_York' -> 'America')
  const region = timezone.split('/')[0] || 'Global';
  
  return { 
    lang: lang.split('-')[0], // Base language without country
    region, 
    country: country.toLowerCase(),
    timezone 
  };
}

export function getRegionDisplayName(region: string): string {
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

export function formatDateForLocale(date: Date, locale: UserLocale): string {
  return new Intl.DateTimeFormat(locale.lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: locale.timezone
  }).format(date);
}