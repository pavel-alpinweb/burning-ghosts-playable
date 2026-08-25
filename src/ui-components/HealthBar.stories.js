import HealthBar from './HealthBar.component.vue';

export default {
  title: 'Game Widgets/HealthBar',
  component: HealthBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Visual health bar for displaying character or entity health status in percentage.',
      },
    },
  },
  argTypes: {
    currentHealth: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current health level in percentage',
    },
    maxHealth: {
      control: { type: 'number', min: 1 },
      description: 'Maximum health value',
    },
  },
};
export const Full = {
  args: {
    currentHealth: 100,
    maxHealth: 100,
  },
};
export const Half = {
  args: {
    currentHealth: 50,
    maxHealth: 100,
  },
};
export const Low = {
  args: {
    currentHealth: 20,
    maxHealth: 100,
  },
};
