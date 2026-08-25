import i18next from "@/i18n";
import { createI18nContentHelpers } from "@/utils/utils.js";
import "../src/style.scss";
import { setup } from "@storybook/vue3-vite"; // путь к твоему файлу стилей

setup((app) => {
  const { tContent } = createI18nContentHelpers(i18next);

  app.provide("tContent", tContent);
});

export const globalTypes = {
  locale: {
    name: "Language",
    description: "Storybook language",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "ru", title: "Русский" },
      ],
      showName: true,
    },
  },
};

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
