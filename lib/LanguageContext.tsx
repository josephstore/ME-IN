'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, supportedLanguages, defaultLanguage, getCurrentLanguage, setLanguage, getTranslation } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLanguageState(currentLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguage(lang);
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
