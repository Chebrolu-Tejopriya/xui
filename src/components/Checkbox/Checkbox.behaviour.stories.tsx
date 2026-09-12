import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';

/**
 * Does clicking actually hit the thing you clicked?
 *
 * This is the bug teja found in the playground, and no gate here could have:
 * Checkbox, Radio and Switch each render a `<label>` wrapping the input, and a
 * label is `inline-flex`. CSS BLOCKIFIES a flex item's display, so inside any
 * flex parent that computed to `flex` and the label stretched the full column —
 * 968px measured. The control looked perfect. Clicking anywhere in an empty
 * row toggled it.
 *
 * A screenshot cannot see a hit area. That is the whole argument for this file.
 *
 * Tagged `behaviour`, so the visual suite skips it — these stories exist to be
 * clicked, not photographed.
 */
const meta: Meta = {
  title: 'Components/Checkbox/Behaviour',
  tags: ['behaviour'],
};
export default meta;

/** The width the label used to swallow. Wide enough that a stretch is obvious. */
const WIDE = 900;

export const LabelDoesNotSwallowTheRow: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: WIDE, gap: 24 }}>
      <Checkbox label="Checkbox" data-testid="cb" />
      <Radio name="r" label="Radio" data-testid="rb" />
      <Switch label="Switch" data-testid="sw" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const id of ['cb', 'rb', 'sw']) {
      const input = canvasElement.querySelector(`[data-testid="${id}"]`)!;
      const label = input.closest('label')!;
      const box = label.getBoundingClientRect();

      // The real assertion. `fit-content` is what holds this; `inline-flex`
      // alone does not, because a flex parent blockifies it.
      await expect(
        box.width,
        `${id}: the label spans ${Math.round(box.width)}px of a ${WIDE}px column — ` +
          `it must hug its content, or clicking empty space toggles the control`,
      ).toBeLessThan(300);
    }
  },
};

export const ClickingTheLabelToggles: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: WIDE, gap: 24 }}>
      <Checkbox label="Notify me" />
      <Switch label="Dark mode" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Clicking the TEXT must toggle — that is what a label is for, and it is
    // the half of the behaviour the fit-content fix must not have broken.
    const checkbox = canvas.getByRole('checkbox', { name: 'Notify me' });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(canvas.getByText('Notify me'));
    await expect(checkbox).toBeChecked();

    const toggle = canvas.getByRole('switch', { name: 'Dark mode' });
    await userEvent.click(canvas.getByText('Dark mode'));
    await expect(toggle).toBeChecked();
  },
};

export const ClickingBesideTheLabelDoesNot: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: WIDE, gap: 24 }}>
      <Checkbox label="Notify me" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Notify me' });
    const label = canvas.getByText('Notify me').closest('label')!;
    const box = label.getBoundingClientRect();

    // Click far to the right of the label, inside the column but outside the
    // control. Before `fit-content` this landed on the label and toggled.
    await userEvent.pointer({
      target: canvasElement,
      coords: { clientX: box.right + 200, clientY: box.top + box.height / 2 },
      keys: '[MouseLeft]',
    });
    await expect(
      checkbox,
      'clicking empty space to the right of the label must not toggle the checkbox',
    ).not.toBeChecked();
  },
};
