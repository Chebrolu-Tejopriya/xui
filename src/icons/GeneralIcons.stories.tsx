import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { generalIcons } from './index';
import type { GeneralIconName } from './index';

/**
 * The Figma "Icon Library" (XUI 261:140) — 158 glyphs, as one flat searchable list.
 *
 * The third icon family, and the middle case of the three. Icons v2 carries four
 * tones; the coin badges carry their own fixed palette. These are single-tone 24px
 * glyphs that render in `currentColor` — so they follow the theme and take a colour
 * from whatever they sit inside.
 *
 * Flat on purpose. This gallery used to group by category, but the categories were
 * ours rather than Figma's — an artefact of which batch each icon was read in — so
 * "Arrows & controls" held a calendar, a paperclip and a copy glyph. A wrong
 * taxonomy is worse than none: it sends you to the wrong shelf and then convinces
 * you the icon isn't there. Search instead; the names are the Figma layer names.
 *
 * Where a name is already an Icons v2 export, v2 keeps the plain name and the one
 * here is suffixed `GeneralIcon`. They are different drawings.
 */
const meta: Meta = {
  title: 'Icons Library/General Icons',
  parameters: { layout: 'fullscreen', copyImport: "import { generalIcons } from '@koinx/xui';" },
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

const control = {
  height: 44,
  padding: '0 var(--spacing-12)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  font: 'var(--type-subtitle-2)',
  background: 'var(--surface-raised)',
  color: 'var(--content-primary)',
} as const;

/* Sorted once at module scope: the order must not depend on the query. */
const ALL = (Object.keys(generalIcons) as GeneralIconName[]).sort((a, b) => a.localeCompare(b));

function Gallery() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<number>(24);
  const [copied, setCopied] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL.filter((n) => n.toLowerCase().includes(q)) : ALL;
  }, [query]);

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
        each one takes its colour from whatever it sits inside and follows the theme. Click one to
        copy its import. Names are the Figma layer names, so searching for what the design calls it
        works.
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
          placeholder="Search 158 icons…"
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
        <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>
          {shown.length} of {ALL.length}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 'var(--spacing-12)',
        }}
      >
        {shown.map((name) => {
          const Icon = generalIcons[name];
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

      {shown.length === 0 && (
        <p style={{ font: 'var(--type-body-2)', color: 'var(--content-tertiary)' }}>
          Nothing matches “{query}”.
        </p>
      )}
    </div>
  );
}

export const AllGeneralIcons: StoryObj = { render: () => <Gallery /> };
