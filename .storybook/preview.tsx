import type { Preview } from '@storybook/react-vite';
import '../src/tokens/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: { disable: true },

    a11y: {
      test: 'todo',
    },
  },

  globalTypes: {
    theme: {
      description: 'Fibon color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.setAttribute('data-theme', theme);
      document.body.style.background = 'var(--surface-primary)';
      return <Story />;
    },
  ],
};

export default preview;
