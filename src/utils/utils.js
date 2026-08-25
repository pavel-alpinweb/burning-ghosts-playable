import Phaser from "phaser";
import { ref } from "vue";

export const EventBus = new Phaser.Events.EventEmitter();

export const createI18nContentHelpers = (i18nextInstance) => {
  const currentLanguage = ref(i18nextInstance.language);

  const handleLanguageChanged = (language) => {
    currentLanguage.value = language;
  };

  i18nextInstance.on("languageChanged", handleLanguageChanged);

  const tContent = (value, fallback = "") => {
    if (!value || typeof value !== "object") return value ?? fallback;

    const lang = currentLanguage.value?.startsWith("ru") ? "ru" : "en";
    return value[lang] ?? value.ru ?? value.en ?? fallback;
  };

  return { tContent, currentLanguage };
};
