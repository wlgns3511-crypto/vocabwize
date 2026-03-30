export interface Word {
  slug: string;
  word: string;
  phonetic: string | null;
  definition: string;
  pos: string | null;
  frequency: number;
  exchange: string | null;
  examples: string | null;
  etymology: string | null;
  synonyms: string | null;
  antonyms: string | null;
  level: string | null;
  usage_note: string | null;
}

export interface SiteConfig {
  domain: string;
  siteName: string;
  primaryLang: string;
  targetLangs: string[];
  locale: string;
  dbPath: string;
  gaId: string;
  adsenseId: string;
  colors: {
    primary: string;
    accent: string;
  };
}
