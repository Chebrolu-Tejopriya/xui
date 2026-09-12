import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';

/**
 * What a Select does when you use it — none of which a screenshot can see.
 *
 * Tagged `behaviour`, so the visual suite skips it: these exist to be clicked,
 * not photographed.
 */
const meta: Meta = {
  title: 'Components/Select/Behaviour',
  tags: ['behaviour'],
};
export default meta;

const options = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'fixed', label: 'Fixed Asset' },
];

/* Room below the trigger so the panel is not clipped, and space to the side to
   click "outside" without leaving the canvas. */
const stage = { padding: 24, height: 360, width: 600 } as const;

function Controlled() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={stage}>
      <Select options={options} value={value} onChange={setValue} placeholder="Choose an account" />
      <p data-testid="chosen">{value ?? 'nothing'}</p>
    </div>
  );
}

export const OpensPicksAndCloses: StoryObj = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Choose an account/i });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).toBeNull();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const list = await canvas.findByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(3);

    await userEvent.click(within(list).getByRole('option', { name: 'Bank' }));

    // The three things picking an option has to do, and the last is the one
    // that breaks quietly: a menu that stays open after a choice looks fine in
    // every screenshot ever taken of it.
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('bank');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).toBeNull();
  },
};

export const EscapeAndClickAwayClose: StoryObj = {
  render: () => (
    <div style={stage}>
      <Select options={options} placeholder="Choose an account" />
      <div data-testid="elsewhere" style={{ marginTop: 200, height: 60 }}>
        elsewhere
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Choose an account/i });

    await userEvent.click(trigger);
    await canvas.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    await expect(
      canvas.queryByRole('listbox'),
      'Escape must close the panel — a dropdown you cannot dismiss traps the keyboard',
    ).toBeNull();

    await userEvent.click(trigger);
    await canvas.findByRole('listbox');
    await userEvent.click(canvas.getByTestId('elsewhere'));
    await expect(
      canvas.queryByRole('listbox'),
      'clicking away must close the panel',
    ).toBeNull();
  },
};

export const DisabledDoesNotOpen: StoryObj = {
  render: () => (
    <div style={stage}>
      <Select options={options} placeholder="Choose an account" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Choose an account/i });
    // `disabled` that only greys the trigger is the classic half-fix: it looks
    // right in both themes and still opens.
    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await expect(canvas.queryByRole('listbox')).toBeNull();
  },
};
