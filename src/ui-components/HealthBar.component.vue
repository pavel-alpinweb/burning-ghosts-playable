<script setup lang="ts">
import { computed, ref } from "vue";
import IconHeart from "/public/assets/img/icons/heart.svg";

const props = defineProps({
  currentHealth: {
    type: Number,
    default: 100,
  },
  maxHealth: {
    type: Number,
    default: 100,
  },
});

  let fuelPercentage = computed(() => props.currentHealth / (props.maxHealth / 100));

  const color = computed(() => {
    if (fuelPercentage.value >= 60) {
      return '#95c11f';
    } else if (fuelPercentage.value >= 40 && fuelPercentage.value <= 59) {
      return '#ffff00';
    } else {
      return '#8a0000';
    }
  });

</script>

<template>
  <div class="health-bar">
    <IconHeart class="health-bar__icon" :style="{ color: color }" />
    <div class="health-bar__fuel-bar-wrapper">
      <div class="health-bar__fuel-bar" :style="{ width: `${fuelPercentage}%`, background: color }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.health-bar {
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;

  &__icon {
    width: 50px;
    height: 50px;
  }

  &__fuel-bar-wrapper {
    display: flex;
    align-items: center;
    width: 300px;
    height: 100%;
  }
  &__fuel-bar {
    height: 50%;
    transition: all 0.3s linear;
  }
}
</style>