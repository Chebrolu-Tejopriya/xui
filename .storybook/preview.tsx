import type { Preview } from '@storybook/react-vite';
import { CopyImportChip, PACKAGE_NAME } from './CopyImportChip';
import '../src/tokens/index.css';

const preview: Preview = {
  /* Generates a Docs page per component: description, props table with types
     and defaults, and every story inline. addon-docs was installed from the
     start but autodocs was never switched on, so the build produced 77 stories
     and ZERO docs pages — no API reference existed anywhere in the system. */
  tags: ['autodocs'],

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
      // `component.name` is the function's name, which minifies to junk in a
      // production build — the deployed docs showed `import { D } from …`.
      // The story title is a string literal and survives minification, so it
      // is the reliable source; `.name` stays only as a last resort.
      const fromTitle = context.title?.split('/').pop();
      const componentName = component?.displayName || fromTitle || component?.name;
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
