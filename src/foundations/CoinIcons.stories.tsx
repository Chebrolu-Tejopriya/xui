import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { coinIcons, coinIconCategories } from '../icons';
import type { CoinIconName } from '../icons';

/**
 * The Figma "Coin Type" set (XUI 2441:12895), grouped as it groups itself.
 *
 * Separate from Foundations > Icons on purpose: an Icon is a single-colour glyph
 * that renders in currentColor across four tones, while a coin icon is a fixed
 * 40x40 badge carrying its own palette. They do not share an API and should not
 * share a page.
 */
const meta: Meta = {
  title: 'Foundations/Coin Icons',
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

const SIZES = [24, 32, 40, 56] as const;

function Gallery() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<number>(40);
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(coinIconCategories)
      .map(([cat, names]) => [cat, names.filter((n) => !q || n.toLowerCase().includes(q) || cat.toLowerCase().includes(q))] as const)
      .filter(([, names]) => names.length > 0);
  }, [query]);

  const total = Object.keys(coinIcons).length;
  const shown = groups.reduce((n, [, names]) => n + names.length, 0);

  const onCopy = (name: string) => {
    copyText(`import { ${name} } from '@koinx/xui';`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div style={{ padding: 'var(--spacing-32)', background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <h1 style={{ font: 'var(--type-heading-2)', color: 'var(--content-primary)', margin: 0 }}>Coin icons</h1>
      <p style={{ font: 'var(--type-body-2)', color: 'var(--content-secondary)', maxWidth: 720 }}>
        Transaction-type badges from the Figma “Coin Type” set. Unlike Icons v2 these are
        multi-colour artwork at a fixed size — they take <code>size</code> but ignore{' '}
        <code>color</code>, and their palette is not theme-reactive. Click one to copy its import.
      </p>

      <div style={{ display: 'flex', gap: 'var(--spacing-12)', alignItems: 'center', margin: 'var(--spacing-24) 0' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or category…"
          style={{
            flex: '1 1 255px',
            maxWidth: 360,
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
                height: 44,
                padding: '0 var(--spacing-12)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                font: 'var(--type-subtitle-2)',
                border: `1px solid ${s === size ? 'var(--border-brand)' : 'var(--border-primary)'}`,
                background: s === size ? 'var(--surface-brand-secondary)' : 'var(--surface-raised)',
                color: 'var(--content-primary)',
              }}
            >
              {s}px
            </button>
          ))}
        </div>
        <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>
          {shown} of {total}
        </span>
      </div>

      {groups.map(([cat, names]) => (
        <section key={cat} style={{ marginBottom: 'var(--spacing-40)' }}>
          <h2 style={{ font: 'var(--type-heading-5)', color: 'var(--content-primary)', margin: '0 0 var(--spacing-16)' }}>
            {cat} <span style={{ color: 'var(--content-tertiary)' }}>({names.length})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 'var(--spacing-12)' }}>
            {names.map((name) => {
              const Icon = coinIcons[name as CoinIconName];
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
                    color: 'var(--content-primary)',
                  }}
                >
                  <Icon size={size} />
                  <span style={{ font: 'var(--type-body-3)', textAlign: 'center', wordBreak: 'break-word' }}>
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

export const AllCoinIcons: StoryObj = { render: () => <Gallery /> };
