import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
};
export default meta;

const scales = ['gray', 'blue', 'orange', 'green', 'red'] as const;
const steps = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const semantic = [
  ['surface-primary', 'surface-secondary', 'surface-tertiary', 'surface-raised'],
  ['surface-brand-primary', 'surface-brand-hover', 'surface-brand-disabled', 'surface-brand-secondary'],
  ['surface-success-primary', 'surface-warning-primary', 'surface-error-primary'],
  ['content-primary', 'content-secondary', 'content-tertiary', 'content-brand', 'content-error'],
  ['border-primary', 'border-secondary', 'border-brand', 'border-error'],
];

function Swatch({ token, name }: { token: string; name: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 84 }}>
      <div
        style={{
          height: 48,
          borderRadius: 6,
          background: `var(${token})`,
          border: '1px solid var(--border-secondary)',
        }}
      />
      <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>{name}</span>
    </div>
  );
}

export const Primitives: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {scales.map((scale) => (
        <div key={scale}>
          <h3 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 8px' }}>
            {scale[0].toUpperCase() + scale.slice(1)}
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {steps.map((s) => (
              <Swatch key={s} token={`--fibon-${scale}-${s}`} name={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Semantic: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {semantic.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {row.map((name) => (
            <Swatch key={name} token={`--${name}`} name={name} />
          ))}
        </div>
      ))}
    </div>
  ),
};
