import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Labels',
};
export default meta;

const keys = [...'abcdefghijklmnopqrstuvwxyz0123456789'];

export const Pairs: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 720 }}>
      {keys.map((k) => (
        <span
          key={k}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderRadius: 'var(--radius-max)',
            background: `var(--label-bg-${k})`,
            color: `var(--label-fg-${k})`,
            font: 'var(--type-subtitle-3)',
          }}
        >
          Label {k.toUpperCase()}
        </span>
      ))}
    </div>
  ),
};
