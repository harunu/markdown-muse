import { useState, useCallback } from 'react';

export type Language = 'tr' | 'en';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE: Language = 'tr';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'tr' || stored === 'en') ? stored : DEFAULT_LANGUAGE;
  });

  const switchLanguage = useCallback((lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  }, []);

  return { language, switchLanguage };
}

export default useLanguage;
