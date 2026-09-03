import type { Meta, StoryObj } from '@storybook/react-vite';
import { generalIcons, tradeTypeIconNames } from '../icons';
import type { GeneralIconName } from '../icons';

/**
 * The Figma "Trade Types" section (XUI 974:395).
 *
 * These are NOT their own components. All six are instances of masters that live
 * in the Icon Library's Transactions group, so they are generated once and shown
 * twice — here as the set a ledger row picks from, and in General Icons among
 * everything else. Generating them a second time would put two identical
 * components in the package and let them drift apart.
 */
const meta: Meta = {
  title: 'Foundations/Trade Type Icons',
  parameters: { layout: 'fullscreen' },
};
export default meta;

/** What each one labels in a transaction list. */
const MEANING: Record<string, string> = {
  DepositIcon: 'Value coming in',
  WithdrawIcon: 'Value going out',
  TransferIcon: 'Moved between accounts you own — not a taxable event',
  TradeIcon: 'A swap of one asset for another',
  MarginTradeIcon: 'A trade opened with borrowed funds',
  FuturesTradeIcon: 'A contract settled later, not an asset held now',
};

function Gallery() {
  return (
    <div style={{ padding: 'var(--spacing-32)', background: 'var(--surface-primary)', minHeight: '100vh' }}>
      <h1 style={{ font: 'var(--type-heading-2)', color: 'var(--content-primary)', margin: 0 }}>
        Trade type icons
      </h1>
      <p style={{ font: 'var(--type-body-2)', color: 'var(--content-secondary)', maxWidth: 720 }}>
        The six kinds a transaction row can be. They render in <code>currentColor</code> like every
        General icon, so a row can tint them by state without a second asset.
      </p>

      <p
        style={{
          font: 'var(--type-body-3)',
          color: 'var(--content-tertiary)',
          maxWidth: 720,
          marginBottom: 'var(--spacing-32)',
        }}
      >
        Not a separate family — the same components as the Transactions group in{' '}
        <b>General Icons</b>, shown here as the set they form.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--spacing-12)',
        }}
      >
        {tradeTypeIconNames.map((name) => {
          const Icon = generalIcons[name as GeneralIconName];
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-16)',
                padding: 'var(--spacing-16)',
                borderRadius: 'var(--radius-mid)',
                border: '1px solid var(--border-secondary)',
                background: 'var(--surface-raised)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  flex: 'none',
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-max)',
                  background: 'var(--surface-brand-secondary)',
                  color: 'var(--content-brand-primary)',
                }}
              >
                <Icon size={24} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    font: 'var(--type-subtitle-2)',
                    color: 'var(--content-primary)',
                  }}
                >
                  {name.replace(/Icon$/, '')}
                </span>
                <span
                  style={{ display: 'block', font: 'var(--type-body-3)', color: 'var(--content-secondary)' }}
                >
                  {MEANING[name] ?? ''}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const AllTradeTypeIcons: StoryObj = { render: () => <Gallery /> };
