import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './locales/pt.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

const savedLang = localStorage.getItem('vanguard-lang') || 'pt';

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
  },
  lng: savedLang,
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('vanguard-lang', lng);
  document.documentElement.lang = lng;
});

export default i18n;
