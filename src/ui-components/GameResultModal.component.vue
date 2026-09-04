<script setup>
import UiModal from "@/ui-components/UiModal.component.vue";
import { computed, onBeforeUnmount, onMounted } from "vue";
const baseUrl = import.meta.env.BASE_URL || "/";
const winnerSrc = `${baseUrl}assets/img/Winner_stamp.png`;
const loserSrc = `${baseUrl}assets/img/Loser_stamp.png`;

const props = defineProps({
  isGameOver: {
    type: Boolean,
    required: true,
  },
  isWin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["again"]);

const onAgain = () => {
  emit("again");
};

const onKeyDown = (e) => {
  if (!props.isGameOver) return;
  if (e.key === "Enter") onAgain();
};

const resultImageSrc = computed(() => (props.isWin ? winnerSrc : loserSrc));

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <UiModal :model-value="isGameOver" target=".platformer-screen__game-wrapper" max-width="520px">
    <div class="game-result-modal">
      <h2 class="game-result-modal__title">
        {{ isWin ? "Ты выжил!" : "Ты погиб!" }}
      </h2>

      <div class="game-result-modal__image">
        <img :src="resultImageSrc" alt="result" />
      </div>

      <button class="game-result-modal__btn" @click="onAgain">Заного (Enter)</button>
    </div>
  </UiModal>
</template>

<style scoped lang="scss">
.game-result-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  user-select: none;

  &__title {
    font-size: 32px;
    font-weight: 800;
    text-transform: uppercase;
    color: #ffffff;
    text-align: center;
    margin: 0;
    letter-spacing: 2px;
    text-shadow:
      0 2px 10px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(255, 255, 255, 0.2);
  }

  &__image {
    width: 100%;
    display: flex;
    justify-content: center;

    img {
      width: 100%;
      max-height: 260px;
      height: auto;
      display: block;
      object-fit: contain;
    }
  }

  &__text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin: 0;
    line-height: 1.5;
  }

  &__btn {
    display: block;
    margin: 8px auto 0;
    padding: 12px 36px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    color: #ffffff;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 1.5px;
    font-family: inherit;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.16);
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
