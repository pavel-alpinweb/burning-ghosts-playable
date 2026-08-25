import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next.use(LanguageDetector).init({
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        menu: {
          start: "Start",
          settings: "Settings",
        },
      },
    },
    ru: {
      translation: {
        menu: {
          start: "Начать",
          settings: "Настройки",
        },
      },
    },
  },
});

export default i18next;
