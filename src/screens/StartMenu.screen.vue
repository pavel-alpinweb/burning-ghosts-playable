<script setup lang="ts">
import { useRouter } from "vue-router";
import LanguageSwitcherComponent from "@/ui-components/LanguageSwitcher.component.vue";
import { createI18nContentHelpers } from "@/utils/utils.js";
import i18next from "@/i18n.js";
import { UI_LOCALIZATION } from "@/configs/uiLocalization.config.js";
import MainLogo from "/public/assets/img/Logo.svg?component";

const router = useRouter();
const { tContent } = createI18nContentHelpers(i18next);

const goToGame = (event) => {
  event.preventDefault();
  router.push("/topdown");
};
</script>

<template>
  <div class="start-menu-screen">
    <div class="start-menu-screen__controls">
      <LanguageSwitcherComponent />
    </div>
    <div class="start-menu-screen__content">
      <div class="start-menu-screen__logo-container">
        <MainLogo class="start-menu-screen__logo" />
      </div>
      <h1 class="start-menu-screen__title">
        <span class="start-menu-screen__title-main">{{ tContent(UI_LOCALIZATION.main_title) }}</span>
        <span class="start-menu-screen__title-sub">{{ tContent(UI_LOCALIZATION.main_description) }}</span>
      </h1>
      <form class="start-menu-screen__form" @submit="goToGame">
        <button class="start-menu-screen__btn">
          {{ tContent(UI_LOCALIZATION.start_button) }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.start-menu-screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 40px;
  background: #a09380 url("/public/assets/img/background/sky.png") center center;
  background-size: cover;

  &__controls {
    position: fixed;
    top: 20px;
    right: 20px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: scale(0.8);
    z-index: 1;
  }

  &__logo-container {
    width: 180px;
    height: auto;
    margin-bottom: -15px;
    filter: drop-shadow(4px 4px 0px #2c1f1a);
    animation: float 4s ease-in-out infinite;
  }

  &__logo {
    width: 100%;
    height: 100%;
  }

  &__title {
    color: #2c1f1a;
    text-align: center;
    display: flex;
    flex-direction: column;
    line-height: 1;
    margin-bottom: 25px;

    &-main {
      font-size: 80px;
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 4px 4px 0px #7f4837;
      color: #d99b47;
    }

    &-sub {
      font-size: 24px;
      margin-top: 5px;
      font-weight: normal;
      opacity: 0.9;
      letter-spacing: 2px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 400px;
  }

  &__btn {
    width: 80%;
    height: 70px;
    cursor: pointer;
    border: none;
    background: #7f4837;
    background-size: 100%;
    color: #d99b47;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 36px;
    font-family: inherit;
    transition: background 0.2s ease;

    &:hover {
      background: #b56f44;
    }
  }
}


@media (min-height: 800px) {
  .start-menu-screen__content {
    transform: scale(1);
    margin-bottom: 100px;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
