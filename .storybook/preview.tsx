import type { Preview } from '@storybook/react-vite';
import { CopyImportChip, PACKAGE_NAME } from './CopyImportChip';
import '../src/tokens/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      // NOTE: as of Storybook 10.5 this nested order did not visibly reorder
      // the sidebar (it falls back to filename-glob order). Kept as the
      // documented-correct intent; revisit if SB ordering behavior changes.
      storySort: {
        method: 'alphabetical',
        // Within a component group, list explicitly-ordered stories first
        // (e.g. Input's variant leaves), then anything else alphabetically.
        order: [
          'Foundations',
          'Components',
          [
            'Button',
            ['Primary', 'Secondary', 'Destructive', 'Outline', 'Subtle', 'Ghost', 'Link', 'Icon Only'],
            'Input',
            [
              'Default',
              'Password',
              'Secret Key',
              'Date',
              'Dropdown',
              'Dropdown with icon',
              'Mobile Number',
              'Amount',
              'Amount-Static',
              'OTP',
            ],
          ],
        ],
      },
    },

    backgrounds: { disable: true },

    a11y: {
      test: 'todo',
    },
  },

  globalTypes: {
    theme: {
      description: 'XUI color theme',
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

      // Copy-import chip: derived from the story's component, overridable
      // via parameters.copyImport (string), suppressible with `false`.
      const override = context.parameters.copyImport;
      const component = context.component as { displayName?: string; name?: string } | undefined;
      const componentName = component?.displayName || component?.name;
      const importCode =
        override === false
          ? null
          : (override ?? (componentName ? `import { ${componentName} } from '${PACKAGE_NAME}';` : null));

      return (
        <>
          {importCode && <CopyImportChip code={importCode} />}
          <Story />
        </>
      );
    },
  ],
};

export default preview;
