<script setup lang="ts">
import { computed } from "vue";
import { TIME_ICONS } from "@/configs/gameplay.config.js";

interface Props {
  allTime: number;
  remainingTime: number;
  isNight?: boolean;
}

const props = defineProps({
  allTime: {
    type: Number,
    required: true,
  },
  remainingTime: {
    type: Number,
    required: true,
  },
  isNight: {
    type: Boolean,
    default: false,
  },
});

const iconSrc = computed(() => {
  return props.isNight ? TIME_ICONS.MOON : TIME_ICONS.SUN;
});

const progress = computed(() => {
  if (props.allTime <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, props.remainingTime / props.allTime));
});

const firePosition = computed(() => {
  return `${(1 - progress.value) * 100}%`;
});
</script>

<template>
  <div class="time-progress" role="progressbar" aria-label="Remaining time" aria-valuemin="0" :aria-valuemax="allTime" :aria-valuenow="remainingTime">
    <div class="time-progress__track">
      <div
        class="time-progress__value"
        :style="{
          transform: `scaleX(${progress})`,
        }"
      ></div>
    </div>

    <img
      class="time-progress__fire"
      :src="iconSrc"
      alt=""
      aria-hidden="true"
      :style="{
        left: firePosition,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.time-progress {
  position: relative;

  width: 240px;
  height: 50px;

  display: flex;
  align-items: center;

  // Чтобы крайние положения огонька не обрезались.
  margin-inline: 25px;

  &__track {
    width: 100%;
    height: 18px;
    padding: 3px;
    overflow: hidden;

    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    background: rgba(18, 18, 24, 0.85);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
  }

  &__value {
    width: 100%;
    height: 100%;

    background: #d99b47;
    border-radius: 2px;

    transform-origin: right center;
    transition: transform 100ms linear;
    will-change: transform;
  }

  &__fire {
    position: absolute;
    top: 50%;

    width: 50px;
    height: 50px;

    object-fit: contain;
    pointer-events: none;

    transform: translate(-50%, -50%);
    transition: left 100ms linear;
    will-change: left;
  }
}
</style>
