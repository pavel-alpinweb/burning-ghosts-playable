<script setup lang="ts">
import SoundOnIcon from "/public/assets/img/icons/sound-on.svg";
import SoundOffIcon from "/public/assets/img/icons/sound-off.svg";

defineProps<{
  isPlaySound: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
}>();
</script>

<template>
  <button class="sound-switcher" @click="emit('toggle')">
    <SoundOnIcon v-if="isPlaySound" class="sound-switcher__icon" />
    <SoundOffIcon v-else class="sound-switcher__icon" />
  </button>
</template>

<style scoped lang="scss">
.sound-switcher {
  z-index: 1000;
  width: 50px;
  height: 50px;
  cursor: pointer;
  border: none;
  background: #7f4837;
  color: #d99b47;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #b56f44;
  }

  &__icon {
    width: 32px;
    height: 32px;
    fill: currentColor;

    :deep(g) {
      fill: currentColor;
    }

    :deep(path) {
      fill: currentColor;
    }
  }
}
</style>
