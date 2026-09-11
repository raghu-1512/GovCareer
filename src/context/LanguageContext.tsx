import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  SUPPORTED_LANGUAGES,
  LanguageOption,
  UI_TRANSLATIONS, 
  SECTOR_TRANSLATIONS, 
  EDUCATION_TRANSLATIONS, 
  CATEGORY_TRANSLATIONS, 
  STATUS_TRANSLATIONS 
} from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  t: (key: string, defaultText?: string) => string;
  translateSector: (sector: string) => string;
  translateEducation: (edu: string) => string;
  translateCategory: (cat: string) => string;
  translateStatus: (status: string) => string;
  isTelugu: boolean;
}

const LANGUAGE_STORAGE_KEY = 'govcareer_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'te' : language === 'te' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, defaultText?: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (entry) {
      if (entry[language]) return entry[language];
      if (entry['en']) return entry['en'];
    }
    return defaultText || key;
  };

  const translateSector = (sector: string): string => {
    if (SECTOR_TRANSLATIONS[sector]) {
      return SECTOR_TRANSLATIONS[sector][language] || SECTOR_TRANSLATIONS[sector]['en'] || sector;
    }
    return sector;
  };

  const translateEducation = (edu: string): string => {
    if (EDUCATION_TRANSLATIONS[edu]) {
      return EDUCATION_TRANSLATIONS[edu][language] || EDUCATION_TRANSLATIONS[edu]['en'] || edu;
    }
    return edu;
  };

  const translateCategory = (cat: string): string => {
    if (CATEGORY_TRANSLATIONS[cat]) {
      return CATEGORY_TRANSLATIONS[cat][language] || CATEGORY_TRANSLATIONS[cat]['en'] || cat;
    }
    return cat;
  };

  const translateStatus = (status: string): string => {
    if (STATUS_TRANSLATIONS[status]) {
      return STATUS_TRANSLATIONS[status][language] || STATUS_TRANSLATIONS[status]['en'] || status;
    }
    return status;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
        translateSector,
        translateEducation,
        translateCategory,
        translateStatus,
        isTelugu: language === 'te',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
