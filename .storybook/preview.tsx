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
      /* Components sort alphabetically, which is what a reader scanning a
         sidebar of 20+ entries expects.

         A comparator rather than the `order` array it replaces: listing a
         component there to fix its STORY order also pins the COMPONENT to the
         top, which is why Button and Input used to sit above Accordion. It
         also had to be edited every time a component was added — the same
         hand-kept-list problem the visual suite avoids by reading index.json.

         (The old note here said sorting did not work at all. It did; the
         `order` array was doing exactly what it was told.)

         Three rules, in order:
           1. Docs first within a component.
           2. Then STORY_ORDER if that component defines one — Button leads
              with Primary, not Destructive, because the sidebar should read
              as a hierarchy, not an index.
           3. Everything else alphabetical, roots in ROOT_ORDER. */
      storySort: (a, b) => {
        const ROOT_ORDER = ['Foundations', 'Components'];
        const STORY_ORDER = {
          'Components/Button': [
            'Primary', 'Secondary', 'Destructive', 'Outline', 'Subtle', 'Ghost', 'Link', 'Icon Only',
          ],
          'Components/Input': [
            'Default', 'Password', 'Secret Key', 'Date', 'Dropdown', 'Dropdown with icon',
            'Mobile Number', 'Amount', 'Amount-Static', 'OTP',
          ],
        };

        if (a.title === b.title) {
          if (a.name === 'Docs') return -1;
          if (b.name === 'Docs') return 1;
          const order = STORY_ORDER[a.title];
          if (!order) return 0; // keep the order the story file declares them in
          // An unlisted story sorts after every listed one rather than jumping
          // to the front, which is what indexOf's -1 would do.
          const rank = (n) => (order.indexOf(n) === -1 ? order.length : order.indexOf(n));
          return rank(a.name) - rank(b.name);
        }

        const rootOf = (t) => t.split('/')[0];
        const ra = rootOf(a.title);
        const rb = rootOf(b.title);
        if (ra !== rb) {
          // A root not in ROOT_ORDER goes after the known ones, alphabetically.
          const ia = ROOT_ORDER.indexOf(ra);
          const ib = ROOT_ORDER.indexOf(rb);
          if (ia === -1 && ib === -1) return ra.localeCompare(rb);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        }
        return a.title.localeCompare(b.title, undefined, { numeric: true });
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
