import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, screen } from 'storybook/test';
import { Dialog } from './Dialog';

/**
 * How a Dialog closes — and, just as important, how it does not.
 *
 * Dismissal is an interaction spec and Figma carries none of it, so every rule
 * here was decided in code (ADR-recorded as "beyond Figma"). A decision nobody
 * wrote a test for is a decision that quietly stops being true: escape-to-close
 * survives exactly as long as the next person to touch the key handler.
 *
 * The dialog renders through a PORTAL, so it is not inside `canvasElement` —
 * these query `screen`, not `within(canvasElement)`. Getting that wrong is how
 * you write a passing test for a dialog that never opened.
 *
 * Tagged `behaviour`; the visual suite skips it.
 */
const meta: Meta = {
  title: 'Components/Dialog/Behaviour',
  tags: ['behaviour'],
};
export default meta;

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this transaction?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
}

const open = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
  return screen.findByRole('dialog');
};

export const EscapeCloses: StoryObj = {
  render: () => <Harness />,
  play: async () => {
    await open();
    await userEvent.keyboard('{Escape}');
    await expect(
      screen.queryByRole('dialog'),
      'Escape must close the dialog — it is the only dismissal a keyboard user has',
    ).toBeNull();
  },
};

export const ScrimClickCloses: StoryObj = {
  render: () => <Harness />,
  play: async () => {
    const dialog = await open();
    // The scrim is the dialog's parent; clicking the panel itself must not
    // bubble into it. Both halves are one rule and both are tested here,
    // because a stopPropagation that goes missing breaks only the second.
    await userEvent.click(dialog.parentElement!);
    await expect(screen.queryByRole('dialog')).toBeNull();
  },
};

export const ClickingInsideDoesNotClose: StoryObj = {
  render: () => <Harness />,
  play: async () => {
    const dialog = await open();
    await userEvent.click(dialog);
    await expect(
      screen.queryByRole('dialog'),
      'clicking the panel must NOT close it — the scrim handler must stop at the edge',
    ).not.toBeNull();

    // And the close button still works after all that.
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expect(screen.queryByRole('dialog')).toBeNull();
  },
};

export const IsModalToAssistiveTech: StoryObj = {
  render: () => <Harness />,
  play: async () => {
    const dialog = await open();
    // Without aria-modal a screen reader keeps reading the page behind it,
    // which is invisible in every screenshot ever taken of this component.
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  },
};
