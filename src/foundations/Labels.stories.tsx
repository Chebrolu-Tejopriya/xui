import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Labels',
};
export default meta;

// Figma Colors-Semantics/Label — 8 named categories, each a bg/content pair.
const categories = [
  'positive',
  'negative',
  'warning',
  'info',
  'accent',
  'accent-2',
  'accent-3',
  'neutral',
] as const;

export const Categories: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {categories.map((c) => (
        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 12px',
              borderRadius: 'var(--radius-max)',
              background: `var(--label-${c}-bg)`,
              color: `var(--label-${c}-content)`,
              font: 'var(--type-subtitle-3)',
            }}
          >
            {c.replace(/-/g, ' ')}
          </span>
          <code style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)', fontFamily: 'monospace' }}>
            --label-{c}-bg / --label-{c}-content
          </code>
        </div>
      ))}
    </div>
  ),
};
