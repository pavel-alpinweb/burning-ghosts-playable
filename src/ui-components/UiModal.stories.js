import { ref } from "vue";
import UiModal from "./UiModal.component.vue";

export default {
  title: "Base UI Components/Modal",
  component: UiModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A modal window positioned relative to a canvas element within a specified container. Supports closing via Escape key and clicking outside the content.",
      },
    },
  },
  argTypes: {
    modelValue: {
      control: "boolean",
      description: "Controls the visibility of the modal window (v-model)",
      defaultValue: false,
    },
    target: {
      control: "text",
      description: "CSS selector of the container with the canvas that the modal is positioned against",
      defaultValue: "#story-game-container",
    },
    maxWidth: {
      control: "text",
      description: "Maximum width of the modal content",
      defaultValue: "90%",
    },
    maxHeightPadding: {
      control: "number",
      description: "Height offset (in pixels) subtracted from the canvas height for the maximum content height",
      defaultValue: 40,
    },
  },
};

const Template = (args) => ({
  components: { UiModal },
  setup() {
    const isOpen = ref(args.modelValue ?? false);

    // Синхронизация пропа modelValue с локальным состоянием
    const updateModelValue = (val) => {
      isOpen.value = val;
    };

    return { args, isOpen, updateModelValue };
  },
  template: `
        <div>
          <div id="story-game-container" style="width:800px; height:400px; border:1px solid #ccc; margin:0 auto; position:relative;">
            <canvas id="story-canvas" width="800" height="400" style="display:block; width:100%; height:100%; background:#222;"></canvas>
          </div>
          <button @click="isOpen = true">Open Modal</button>
          <UiModal 
            v-bind="args" 
            :modelValue="isOpen" 
            @update:modelValue="updateModelValue"
          >
            <template #default>
              <h2>Modal Title</h2>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <p>This is the modal content.</p>
              <button @click="updateModelValue(false)">Close</button>
            </template>
          </UiModal>
        </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  modelValue: false,
  target: "#story-game-container",
  maxWidth: "400px",
  maxHeightPadding: 40,
};
