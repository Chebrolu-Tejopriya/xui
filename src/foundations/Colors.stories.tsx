import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
};
export default meta;

const scales = ['gray', 'blue', 'orange', 'green', 'red'] as const;
const steps = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const accents = ['blue', 'yellow', 'green', 'purple', 'gray'] as const;
const labelKeys = [...'abcdefghijklmnopqrstuvwxyz0123456789'];

// Mirrors src/tokens/semantic.css — semantic token -> primitive it maps to.
// Exact mirror of the Figma "Semantics" variable collection (45 tokens).
const semanticValueMap: Record<string, string> = {
  'surface-primary': 'gray-02',
  'surface-raised': 'gray-01',
  'surface-secondary': 'gray-03',
  'surface-tertiary': 'gray-04',
  'surface-brand-primary': 'blue-09',
  'surface-brand-solid': 'blue-10',
  'surface-brand-subtle': 'blue-08',
  'surface-brand-secondary': 'blue-03',
  'surface-success-primary': 'green-09',
  'surface-success-solid': 'green-10',
  'surface-success-subtle': 'green-08',
  'surface-success-secondary': 'green-04',
  'surface-success-tertiary': 'green-03',
  'surface-error-primary': 'red-09',
  'surface-error-solid': 'red-10',
  'surface-error-subtle': 'red-08',
  'surface-error-secondary': 'red-04',
  'surface-error-tertiary': 'red-03',
  'surface-warning-primary': 'orange-09',
  'surface-warning-solid': 'orange-10',
  'surface-warning-subtle': 'orange-08',
  'surface-warning-secondary': 'orange-04',
  'surface-warning-tertiary': 'orange-03',
  'surface-warning-quaternary': 'orange-02',
  'surface-absolute': 'absolute-white',
  'content-primary': 'gray-12',
  'content-secondary': 'gray-10',
  'content-tertiary': 'gray-09',
  'content-quaternary': 'gray-08',
  'content-brand-primary': 'blue-09',
  'content-brand-secondary': 'blue-08',
  'content-success-primary': 'green-09',
  'content-success-secondary': 'green-10',
  'content-error-primary': 'red-09',
  'content-warning-primary': 'orange-09',
  'content-absolute-white': 'absolute-white',
  'content-absolute-black': 'absolute-black',
  'content-on-solid': 'gray-01',
  'border-primary': 'gray-07',
  'border-secondary': 'gray-05',
  'border-tertiary': 'gray-04',
  'border-brand': 'blue-09',
  'border-error': 'red-09',
  'border-warning': 'orange-06',
  'border-pure': 'gray-01',
};

const semanticGroups = {
  Surface: [
    'surface-primary', 'surface-raised', 'surface-secondary', 'surface-tertiary',
    'surface-brand-primary', 'surface-brand-solid', 'surface-brand-subtle', 'surface-brand-secondary',
    'surface-success-primary', 'surface-success-solid', 'surface-success-subtle', 'surface-success-secondary', 'surface-success-tertiary',
    'surface-error-primary', 'surface-error-solid', 'surface-error-subtle', 'surface-error-secondary', 'surface-error-tertiary',
    'surface-warning-primary', 'surface-warning-solid', 'surface-warning-subtle', 'surface-warning-secondary', 'surface-warning-tertiary', 'surface-warning-quaternary',
    'surface-absolute',
  ],
  Content: [
    'content-primary', 'content-secondary', 'content-tertiary', 'content-quaternary',
    'content-brand-primary', 'content-brand-secondary',
    'content-success-primary', 'content-success-secondary',
    'content-error-primary',
    'content-warning-primary',
    'content-absolute-white', 'content-absolute-black',
    'content-on-solid',
  ],
  Border: [
    'border-primary', 'border-secondary', 'border-tertiary',
    'border-brand',
    'border-error',
    'border-warning',
    'border-pure',
  ],
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function SwatchCard({ token, name, subtext }: { token: string; name: string; subtext: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await copyText(`var(${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy var(${token})`}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: `var(${token})`,
          border: '1px solid var(--border-secondary)',
          flex: 'none',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <div
          style={{
            font: 'var(--type-subtitle-2)',
            color: 'var(--content-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        <div
          style={{
            font: 'var(--type-body-3)',
            color: copied ? 'var(--content-success-primary)' : 'var(--content-tertiary)',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? 'Copied!' : subtext}
        </div>
      </div>
    </button>
  );
}

function Swatch({ token, name }: { token: string; name: string }) {
  const [hexValue, setHexValue] = React.useState('');

  React.useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    setHexValue(value || `var(${token})`);
  }, [token]);

  return <SwatchCard token={token} name={name} subtext={hexValue} />;
}

function SemanticSwatch({ name }: { name: string }) {
  const mapped = semanticValueMap[name];
  return <SwatchCard token={`--${name}`} name={name} subtext={mapped ? `var(--${mapped})` : ''} />;
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
              <Swatch key={s} token={`--${scale}-${s}`} name={s} />
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 8px' }}>
          Accent
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {accents.map((a) => (
            <Swatch key={a} token={`--accent-${a}`} name={a} />
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 8px' }}>
          Label — Foreground
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {labelKeys.map((k) => (
            <Swatch key={k} token={`--label-fg-${k}`} name={k.toUpperCase()} />
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 8px' }}>
          Label — Background
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {labelKeys.map((k) => (
            <Swatch key={k} token={`--label-bg-${k}`} name={k.toUpperCase()} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Semantic: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {Object.entries(semanticGroups).map(([category, tokens]) => (
        <div key={category}>
          <h3 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 12px' }}>
            {category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {tokens.map((name) => (
              <SemanticSwatch key={name} name={name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
