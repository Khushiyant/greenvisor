import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    // Default namespace used
    defaultNS: 'common',
    ns: ['common'],
    // React already safes from XSS
    react: {
      useSuspense: true,
    },
  });

export default i18n;