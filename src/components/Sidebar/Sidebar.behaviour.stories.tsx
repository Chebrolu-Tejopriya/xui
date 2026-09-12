import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Sidebar, SidebarNav, SidebarItem, SidebarSubItem } from './Sidebar';
import { OverviewIcon, WalletIcon, TaxesIcon } from '../../icons';

/**
 * The collapsed rail: hover shows a tooltip, click shows a flyout, and the two
 * are mutually exclusive.
 *
 * This is the check I once wrote as a throwaway script, ran by hand, and then
 * deleted — which is the worst possible outcome, because the behaviour is
 * fiddly enough to need a test and nothing was left behind to catch it. Four
 * separate rules interact here and none of them is visible in a screenshot.
 *
 * Tagged `behaviour`; the visual suite skips it.
 */
const meta: Meta = {
  title: 'Components/Sidebar/Behaviour',
  tags: ['behaviour'],
};
export default meta;

const Rail = () => (
  <div style={{ display: 'flex', height: 420 }}>
    <Sidebar collapsed>
      <SidebarNav>
        <SidebarItem icon={OverviewIcon} label="Overview" />
        <SidebarItem icon={WalletIcon} label="Data Sources">
          <SidebarSubItem label="Integrations" />
          <SidebarSubItem label="Wallets" />
        </SidebarItem>
        <SidebarItem icon={TaxesIcon} label="Taxes">
          <SidebarSubItem label="Reports" />
        </SidebarItem>
      </SidebarNav>
    </Sidebar>
    <div data-testid="page" style={{ flex: 1 }}>
      page
    </div>
  </div>
);

export const HoverShowsTooltipClickShowsFlyout: StoryObj = {
  render: () => <Rail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const withSub = canvas.getByRole('button', { name: /Data Sources/i });

    // Hover: a tooltip, and NOT a flyout. Getting this wrong means the panel
    // flickers open every time the pointer crosses the rail.
    await userEvent.hover(withSub);
    await expect(await canvas.findByRole('tooltip')).toBeVisible();
    await expect(canvas.queryByRole('group')).toBeNull();

    // Click: the flyout, and the tooltip must go — showing both at once is the
    // bug this pair exists to prevent.
    await userEvent.click(withSub);
    const flyout = await canvas.findByRole('group');
    await expect(within(flyout).getByText('Integrations')).toBeVisible();
    await expect(canvas.queryByRole('tooltip')).toBeNull();
  },
};

export const OnlyOneFlyoutAtATime: StoryObj = {
  render: () => <Rail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Data Sources/i }));
    await expect(within(await canvas.findByRole('group')).getByText('Integrations')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: /Taxes/i }));
    const flyouts = canvas.getAllByRole('group');
    await expect(flyouts, 'opening one flyout must close the other').toHaveLength(1);
    await expect(within(flyouts[0]).getByText('Reports')).toBeVisible();
  },
};

export const ClickAwayClosesTheFlyout: StoryObj = {
  render: () => <Rail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Data Sources/i }));
    await canvas.findByRole('group');

    // A click-opened panel needs a click-away, or it is stuck open until you
    // happen to click the same item again.
    await userEvent.click(canvas.getByTestId('page'));
    await expect(canvas.queryByRole('group')).toBeNull();
  },
};

export const ItemWithoutChildrenHasNoFlyout: StoryObj = {
  render: () => <Rail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Overview has no sub-items. It should still tooltip, and never open an
    // empty panel.
    await userEvent.click(canvas.getByRole('button', { name: /Overview/i }));
    await expect(canvas.queryByRole('group')).toBeNull();
  },
};
