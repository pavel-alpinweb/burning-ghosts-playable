import LanguageSwitcherComponent from './LanguageSwitcher.component.vue';
import i18next from '@/i18n.js';

export default {
  title: 'Game Widgets/LanguageSwitcher',
  component: LanguageSwitcherComponent,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="background: #a09380; padding: 100px; min-height: 200px;"><story /></div>',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Language toggle button (RU/EN). Uses the global i18next instance.',
      },
    },
  },
};

export const Default = {
  render: () => ({
    components: { LanguageSwitcher: LanguageSwitcherComponent },
    template: '<LanguageSwitcher />',
  }),
};

export const InRussian = {
  render: () => ({
    components: { LanguageSwitcher: LanguageSwitcherComponent },
    setup() {
      i18next.changeLanguage('ru');
    },
    template: '<LanguageSwitcher />',
  }),
};

export const InEnglish = {
  render: () => ({
    components: { LanguageSwitcher: LanguageSwitcherComponent },
    setup() {
      i18next.changeLanguage('en');
    },
    template: '<LanguageSwitcher />',
  }),
};