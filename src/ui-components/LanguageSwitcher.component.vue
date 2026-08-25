<script setup lang="ts">
import i18next from "@/i18n.js";
import { createI18nContentHelpers } from "@/utils/utils.js";
import { UI_LOCALIZATION } from "@/configs/uiLocalization.config.js";

const { tContent, currentLanguage: rawLanguage } = createI18nContentHelpers(i18next);

const handleLanguageToggle = () => {
  const newLanguage = rawLanguage.value.startsWith("ru") ? "en" : "ru";
  i18next.changeLanguage(newLanguage);
};
</script>

<template>
  <button class="language-switcher" @click="handleLanguageToggle">
    {{ tContent(UI_LOCALIZATION.language_label) }}
  </button>
</template>

<style scoped lang="scss">
.language-switcher {
  z-index: 1000;
  width: 80px;
  height: 50px;
  cursor: pointer;
  border: none;
  background: #7f4837;
  color: #d99b47;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 24px;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #b56f44;
  }
}
</style>