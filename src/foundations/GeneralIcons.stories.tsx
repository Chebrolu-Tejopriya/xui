import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { generalIcons, generalIconCategories } from '../icons';
import type { GeneralIconName } from '../icons';

/**
 * The Figma "Icon Library" (XUI 261:140), grouped as it groups itself.
 *
 * The third icon family, and the middle case of the three. Icons v2 carries four
 * tones; the coin badges carry their own fixed palette. These are single-tone
 * 24px glyphs that render in `currentColor` — so they follow the theme and take
 * a colour from whatever they sit inside, which the swatches below demonstrate.
 *
 * Where a name is already an Icons v2 export, v2 keeps the plain name and the
 * one here is suffixed `GeneralIcon`. They are different drawings.
 */
const meta: Meta = {
  title: 'Foundations/General Icons',
  parameters: { layout: 'fullscreen' },
};
export default meta;

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

const SIZES = [16, 20, 24, 32] as const;
const COLORS = [
  ['Primary', 'var(--content-primary)'],
  ['Secondary', 'var(--content-secondary)'],
  ['Brand', 'var(--content-brand-primary)'],
  ['Error', 'var(--content-error-primary)'],
] as const;

const control = {
  height: 44,
  padding: '0 var(--spacing-12)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  font: 'var(--type-subtitle-2)',
  background: 'var(--surface-raised)',
  color: 'var(--content-primary)',
} as const;

function Gallery() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<number>(24);
  const [color, setColor] = useState<string>('var(--content-primary)');
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(generalIconCategories)
      .map(
        ([cat, names]) =>
          [cat, names.filter((n) => !q || n.toLowerCase().includes(q) || cat.toLowerCase().includes(q))] as const,
      )
      .filter(([, names]) => names.length > 0);
  }, [query]);

  const total = Object.keys(generalIcons).length;
  const shown = groups.reduce((n, [, names]) => n + names.length, 0);

  const onCopy = (name: string) => {
    copyText(`import { ${name} } from '@koinx/xui';`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div style={{ padding: 'var(--spacing-32)', background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <h1 style={{ font: 'var(--type-heading-2)', color: 'var(--content-primary)', margin: 0 }}>General icons</h1>
      <p style={{ font: 'var(--type-body-2)', color: 'var(--content-secondary)', maxWidth: 720 }}>
        The Figma “Icon Library”. Single-tone 24px glyphs that render in <code>currentColor</code>, so
        they inherit colour and follow the theme — change the swatch to see it. Click one to copy its
        import.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-12)',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: 'var(--spacing-24) 0',
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or category…"
          style={{
            flex: '1 1 255px',
            maxWidth: 320,
            height: 44,
            padding: '0 var(--spacing-12)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-primary)',
            background: 'var(--surface-raised)',
            color: 'var(--content-primary)',
            font: 'var(--type-body-2)',
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              style={{
                ...control,
                border: `1px solid ${s === size ? 'var(--border-brand)' : 'var(--border-primary)'}`,
                background: s === size ? 'var(--surface-brand-secondary)' : 'var(--surface-raised)',
              }}
            >
              {s}px
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          {COLORS.map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => setColor(value)}
              style={{
                ...control,
                border: `1px solid ${value === color ? 'var(--border-brand)' : 'var(--border-primary)'}`,
                color: value,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>
          {shown} of {total}
        </span>
      </div>

      {groups.map(([cat, names]) => (
        <section key={cat} style={{ marginBottom: 'var(--spacing-40)' }}>
          <h2
            style={{
              font: 'var(--type-heading-5)',
              color: 'var(--content-primary)',
              margin: '0 0 var(--spacing-16)',
            }}
          >
            {cat} <span style={{ color: 'var(--content-tertiary)' }}>({names.length})</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 'var(--spacing-12)',
            }}
          >
            {names.map((name) => {
              const Icon = generalIcons[name as GeneralIconName];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onCopy(name)}
                  title={`import { ${name} } from '@koinx/xui';`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-8)',
                    padding: 'var(--spacing-16) var(--spacing-8)',
                    borderRadius: 'var(--radius-mid)',
                    border: '1px solid var(--border-secondary)',
                    background: 'var(--surface-raised)',
                    cursor: 'pointer',
                    color,
                  }}
                >
                  <Icon size={size} />
                  <span
                    style={{
                      font: 'var(--type-body-3)',
                      color: 'var(--content-primary)',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                    }}
                  >
                    {copied === name ? 'Copied!' : name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export const AllGeneralIcons: StoryObj = { render: () => <Gallery /> };
