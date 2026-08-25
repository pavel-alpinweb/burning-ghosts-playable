<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { EventBus, createI18nContentHelpers } from "@/utils/utils";
import * as EventNames from "@/configs/eventNames.config.js";
import i18next from "@/i18n.js";
import { UI_LOCALIZATION } from "@/configs/uiLocalization.config.js";

const { tContent } = createI18nContentHelpers(i18next);
const progress = ref(0);
const isShowing = ref(true);

onMounted(() => {
  EventBus.on(EventNames.PRELOADING_PROGRESS, (value) => {
    progress.value = Math.floor(value * 100);
  });

  EventBus.on(EventNames.COMPLETE_PRELOADING, (value) => {
    isShowing.value = !value;
  });
});

onBeforeUnmount(() => {
  EventBus.off(EventNames.PRELOADING_PROGRESS);
  EventBus.off(EventNames.COMPLETE_PRELOADING);
});
</script>

<template>
  <transition name="fade">
    <div v-if="isShowing" class="preloader">
      <h2 class="preloader__progress">
        {{ tContent(UI_LOCALIZATION.loading) }}... {{ progress }}%
      </h2>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &__progress {
    color: #fff;
  }
}
</style>
