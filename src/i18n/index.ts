import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

const STORAGE_KEY = 'kordom:lang';

const savedLang = localStorage.getItem(STORAGE_KEY);

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: savedLang || 'ko',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
