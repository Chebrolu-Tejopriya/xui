import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconRegistry, ICON_VARIANTS } from './index';
import type { IconVariant } from './index';

const meta: Meta = {
  title: 'Icons Library/Icons V2',
  parameters: { layout: 'fullscreen', copyImport: "import { iconRegistry } from '@koinx/xui';" },
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

function Gallery() {
  const [query, setQuery] = useState('');
  const [variant, setVariant] = useState<IconVariant>('outlined');
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = iconRegistry.filter((i) => !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    const byCat = new Map<string, typeof filtered>();
    for (const i of filtered) {
      if (!byCat.has(i.category)) byCat.set(i.category, []);
      byCat.get(i.category)!.push(i);
    }
    return [...byCat.entries()];
  }, [query]);

  const total = iconRegistry.length;

  const onCopy = (name: string) => {
    copyText(`import { ${name} } from 'xui';`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  return (
    <div style={{ padding: 24, font: 'var(--type-body-2)', color: 'var(--content-primary)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '12px 0',
          background: 'var(--surface-primary)',
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${total} icons…`}
          style={{
            flex: 1,
            minWidth: 220,
            height: 40,
            padding: '0 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-primary)',
            background: 'var(--surface-raised)',
            color: 'var(--content-primary)',
            font: 'var(--type-body-2)',
            outline: 'none',
          }}
        />
        <div style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 'var(--radius-sm)', background: 'var(--surface-secondary)' }}>
          {ICON_VARIANTS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setVariant(v.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                font: 'var(--type-subtitle-3)',
                whiteSpace: 'nowrap',
                background: variant === v.value ? 'var(--surface-raised)' : 'transparent',
                color: variant === v.value ? 'var(--content-brand-primary)' : 'var(--content-secondary)',
                boxShadow: variant === v.value ? 'var(--elevation-sm)' : 'none',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {groups.map(([category, icons]) => (
        <section key={category} style={{ marginTop: 24 }}>
          <h3 style={{ font: 'var(--type-heading-6)', color: 'var(--content-secondary)', margin: '0 0 12px' }}>
            {category} <span style={{ color: 'var(--content-tertiary)' }}>({icons.length})</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 8 }}>
            {icons.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                title={`Copy import { ${name} } from 'xui'`}
                onClick={() => onCopy(name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 8px',
                  borderRadius: 'var(--radius-mid)',
                  border: '1px solid var(--border-primary)',
                  background: copied === name ? 'var(--surface-brand-secondary)' : 'var(--surface-raised)',
                  color: 'var(--content-primary)',
                  cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                <Icon variant={variant} size={28} />
                <span
                  style={{
                    font: 'var(--type-body-3)',
                    color: 'var(--content-tertiary)',
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    lineHeight: 1.3,
                  }}
                >
                  {copied === name ? 'Copied!' : name}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export const Gallery_: StoryObj = { name: 'Gallery', render: () => <Gallery /> };
