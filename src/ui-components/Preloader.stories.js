import Preloader from './Preloader.component.vue';
import { EventBus } from '@/utils/utils';
import * as EventNames from '@/configs/eventNames.config.js';

export default {
  title: "Base UI Components/Preloader",
  component: Preloader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Preloader controlled via EventBus events.",
      },
    },
  },
  argTypes: {
    // Event descriptions
    PRELOADING_PROGRESS: {
      action: "PRELOADING_PROGRESS",
      table: {
        category: "Events",
        type: { summary: "number" },
      },
      description: "Triggered when loading progress is updated",
    },
    COMPLETE_PRELOADING: {
      action: "COMPLETE_PRELOADING",
      table: {
        category: "Events",
        type: { summary: "boolean" },
      },
      description: "Triggered when loading is complete",
    },
  },
};

const Template = (args) => ({
  components: { Preloader },
  template: `
    <div style="height: 50vh; background: gray;">
        <Preloader />
    </div>`,
});

export const Default = Template.bind({});
