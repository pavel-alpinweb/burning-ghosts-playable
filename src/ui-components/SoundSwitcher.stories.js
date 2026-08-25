import SoundSwitcherComponent from './SoundSwitcher.component.vue';

export default {
  title: 'Game Widgets/SoundSwitcher',
  component: SoundSwitcherComponent,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #a09380; padding: 100px; min-height: 200px;"><story /></div>',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Кнопка переключения звука. Получает состояние `isPlaySound` через props и уведомляет об изменении через событие `toggle`.',
      },
    },
  },
  argTypes: {
    isPlaySound: {
      control: 'boolean',
      description: 'Состояние звука (включен/выключен)',
    },
    onToggle: { action: 'toggle' },
  },
};

export const SoundOn = {
  args: {
    isPlaySound: true,
  },
};

export const SoundOff = {
  args: {
    isPlaySound: false,
  },
};

export const Interactive = {
  render: (args) => ({
    components: { SoundSwitcherComponent },
    setup() {
      return { args };
    },
    template: `
      <SoundSwitcherComponent 
        v-bind="args" 
        @toggle="() => { args.isPlaySound = !args.isPlaySound; }" 
      />
    `,
  }),
  args: {
    isPlaySound: true,
  },
};