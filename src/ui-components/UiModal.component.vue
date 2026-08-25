<template>
  <transition name="fade">
    <div v-if="visible" class="ui-modal">
      <div :style="overlayStyles" class="ui-modal__overlay" @click.self="close">
        <div class="ui-modal__content" :style="contentStyles" @click.stop>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: Boolean,
  target: { type: String, default: ".game-container" },
  maxWidth: { type: String, default: "90%" },
  maxHeightPadding: { type: Number, default: 40 },
});

const emit = defineEmits(["update:modelValue"]);
const visible = computed(() => props.modelValue);

const close = () => {
  emit("update:modelValue", false);
};

const onKeyDown = (e) => {
  if (e.key === "Escape" && visible.value) {
    close();
  }
};

// === Canvas resize logic ===
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
    if (canvasRect.value.width > 0 && canvasRect.value.height > 0) return;
    if (++rafRetryCount < maxFrames) {
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
  startRafCheckLoop();
};

onMounted(() => {
  updateCanvasRect();
  observeCanvas();
  startRafCheckLoop();

  window.addEventListener("resize", startRafCheckLoop);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener("resize", startRafCheckLoop);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  window.removeEventListener("keydown", onKeyDown);
});

// === Computed styles ===
const overlayStyles = computed(() => {
  const { left, top, width, height } = canvasRect.value;
  return {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
});

const contentStyles = computed(() => {
  return {
    maxWidth: props.maxWidth,
    maxHeight: `${canvasRect.value.height - props.maxHeightPadding}px`,
  };
});
</script>

<style scoped lang="scss">
.ui-modal {
  &__overlay {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  &__content {
    box-sizing: border-box;
    background: #858f64;
    border-radius: 12px;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
}
</style>
