import type { ReactNode } from 'react';

/**
 * Right-hand "all states at a glance" showcase used by every Input-family
 * story. Renders each state as a labelled row, stacked — so a designer sees
 * default / focused / completed / error / disabled together without clicking
 * between stories.
 *
 * The "Focused" row (input-based variants only) is produced with native
 * `autoFocus` on that instance, which yields the component's real
 * `:focus-within` ring. Button/grid variants (Dropdown, OTP) omit the focused
 * row — their focus state is a subtle ring and programmatic focus proved
 * fragile in headless rendering.
 */
export function StateShowcase({
  width = 384,
  rows,
}: {
  width?: number;
  rows: { label: string; node: ReactNode }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            style={{
              font: 'var(--type-subtitle-3)',
              color: 'var(--content-tertiary)',
              letterSpacing: '0.02em',
            }}
          >
            {r.label}
          </span>
          {r.node}
        </div>
      ))}
    </div>
  );
}
