<template>
  <div :style="anchorStyles" class="ui-anchor">
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  target: { type: String, default: ".game-container" },
  anchor: {
    type: String,
    default: "top-left",
    validator: (val) => ["top-left", "top-right", "bottom-left", "bottom-right"].includes(val),
  },
  offsetX: { type: Number, default: 10 },
  offsetY: { type: Number, default: 10 },
});

const canvasRect = ref({ left: 0, top: 0, width: 0, height: 0 });

const updateCanvasRect = () => {
  const container = document.querySelector(props.target);
  const canvas = container?.querySelector("canvas");
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    canvasRect.value = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }
};

let observer = null;
let rafId = null;
let rafRetryCount = 0;

const startRafCheckLoop = (maxFrames = 10) => {
  rafRetryCount = 0;

  const loop = () => {
    updateCanvasRect();

    // Проверка: прекращаем, если canvas уже измерен
    if (canvasRect.value.width > 0 && canvasRect.value.height > 0) return;

    rafRetryCount++;
    if (rafRetryCount < maxFrames) {
      rafId = requestAnimationFrame(loop);
    }
  };

  rafId = requestAnimationFrame(loop);
};

const observeCanvas = () => {
  const targetNode = document.querySelector(props.target);
  if (!targetNode) return;

  observer = new MutationObserver(() => {
    updateCanvasRect();
    startRafCheckLoop();
  });

  observer.observe(targetNode, { childList: true, subtree: true });
};

const handleFullscreenChange = () => {
  startRafCheckLoop(10);
};

onMounted(() => {
  updateCanvasRect();
  observeCanvas();
  startRafCheckLoop(10);

  window.addEventListener("resize", startRafCheckLoop);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener("resize", startRafCheckLoop);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});

// Вычисление позиции UI-элемента
const anchorStyles = computed(() => {
  const { left, top, width, height } = canvasRect.value;

  let style = {
    position: "fixed",
    zIndex: 10,
  };

  switch (props.anchor) {
    case "top-left":
      style.left = `${left + props.offsetX}px`;
      style.top = `${top + props.offsetY}px`;
      break;
    case "top-right":
      style.left = `${left + width - props.offsetX}px`;
      style.top = `${top + props.offsetY}px`;
      style.transform = "translateX(-100%)";
      break;
    case "bottom-left":
      style.left = `${left + props.offsetX}px`;
      style.top = `${top + height - props.offsetY}px`;
      style.transform = "translateY(-100%)";
      break;
    case "bottom-right":
      style.left = `${left + width - props.offsetX}px`;
      style.top = `${top + height - props.offsetY}px`;
      style.transform = "translate(-100%, -100%)";
      break;
  }

  return style;
});
</script>

<style scoped>
.ui-anchor {
  pointer-events: auto;
}
</style>
