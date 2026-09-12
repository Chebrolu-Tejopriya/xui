import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from './TopBar';
import { KoinXWordmark } from '../../assets/brand';
import { NotificationDotIcon, MenuIcon } from '../../icons';

/**
 * Mobile header — 48px tall, 16px sides, brand left and `actions` right.
 *
 * Like [[BottomNav]] this shipped with no story at all, so nothing in the repo
 * ever rendered it: no docs page, no visual baseline, no parity audit.
 * `check:coverage` now fails on a component folder with no story.
 *
 * It hides itself above 900px, where the Sidebar rail takes over — which is why
 * every story here is pinned to a phone viewport. Rendered at desktop width it
 * photographs as an empty strip, and a baseline of an empty strip is worse than
 * no baseline: it passes forever.
 */
const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: {
    viewport: { defaultViewport: 'iphone14' },
    layout: 'fullscreen',
  },
  tags: ['phone'],
};
export default meta;

type Story = StoryObj<typeof TopBar>;

/* A bare icon button — the header takes whatever trigger the screen needs, and
   the shell owns what it opens. */
const iconButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'var(--content-primary)',
  cursor: 'pointer',
} as const;

export const Default: Story = {
  render: () => (
    <TopBar
      actions={
        <button type="button" style={iconButton} aria-label="Notifications">
          <NotificationDotIcon size={24} />
        </button>
      }
    >
      <KoinXWordmark />
    </TopBar>
  ),
};

/** Two actions — the cluster lays out right-aligned however many it is given. */
export const MultipleActions: Story = {
  render: () => (
    <TopBar
      actions={
        <>
          <button type="button" style={iconButton} aria-label="Notifications">
            <NotificationDotIcon size={24} />
          </button>
          <button type="button" style={iconButton} aria-label="Open menu">
            <MenuIcon size={24} />
          </button>
        </>
      }
    >
      <KoinXWordmark />
    </TopBar>
  ),
};

/** No actions at all — the brand should stay left, not centre. */
export const BrandOnly: Story = {
  render: () => (
    <TopBar>
      <KoinXWordmark />
    </TopBar>
  ),
};
