import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomNav, BottomNavItem } from './BottomNav';
import { OverviewIcon, PortfolioIcon, TransactionsIcon, TaxesIcon } from '../../icons';

/**
 * Mobile tab bar — 54px tall, items a fixed 74px, space-between.
 *
 * This had no story for its whole life, which meant no docs page, no visual
 * baseline and no parity audit: a shipped, publicly exported component that
 * nothing in the repo ever looked at. `check:coverage` now fails when a
 * component folder has no story, so it cannot happen again quietly.
 *
 * Selection is carried by icon TONE as well as colour — `dualtone-selected`
 * against `dualtone` — so it does not depend on hue alone and survives a
 * colour-blind reading.
 */
const meta: Meta<typeof BottomNav> = {
  title: 'Components/BottomNav',
  component: BottomNav,
  // It hides itself above 900px, so at desktop width the story would photograph
  // as an empty strip. Everything here is pinned to a phone.
  parameters: {
    viewport: { defaultViewport: 'iphone14' },
    layout: 'fullscreen',
  },
  tags: ['phone'],
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  render: () => (
    <BottomNav>
      <BottomNavItem icon={OverviewIcon} label="Overview" selected />
      <BottomNavItem icon={PortfolioIcon} label="Portfolio" />
      <BottomNavItem icon={TransactionsIcon} label="Transactions" />
      <BottomNavItem icon={TaxesIcon} label="Taxes" />
    </BottomNav>
  ),
};

/** Each position selected in turn — the tone swap is the thing to check. */
export const Selection: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {['Overview', 'Portfolio', 'Transactions', 'Taxes'].map((active) => (
        <BottomNav key={active}>
          <BottomNavItem icon={OverviewIcon} label="Overview" selected={active === 'Overview'} />
          <BottomNavItem icon={PortfolioIcon} label="Portfolio" selected={active === 'Portfolio'} />
          <BottomNavItem icon={TransactionsIcon} label="Transactions" selected={active === 'Transactions'} />
          <BottomNavItem icon={TaxesIcon} label="Taxes" selected={active === 'Taxes'} />
        </BottomNav>
      ))}
    </div>
  ),
};
