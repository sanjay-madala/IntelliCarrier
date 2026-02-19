import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('intellicarrier-lang') || 'en'; }
    catch { return 'en'; }
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'th' : 'en';
      try { localStorage.setItem('intellicarrier-lang', next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    // Traverse translations[language] by dot-separated path
    const value = getNestedValue(translations[language], key);
    if (value !== undefined && typeof value === 'string') return value;
    // Fall back to English
    const enValue = getNestedValue(translations.en, key);
    if (enValue !== undefined && typeof enValue === 'string') return enValue;
    // Fall back to key itself
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
