import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Drawer } from './Drawer';
import type { DrawerPlacement } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
};
export default meta;

const BODY =
  'Lorem ipsum dolor sit amet consectetur. Erat pellentesque id lectus velit ac vitae urna mollis. ' +
  'Nam lacus consequat viverra dolor amet. Aliquet nunc bibendum sit aliquam aliquet eu.';

function Demo({ placement, cta }: { placement: DrawerPlacement; cta: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {placement} drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        title="Drawer Title"
        footer={cta ? <Button fullWidth onClick={() => setOpen(false)}>Got it</Button> : undefined}
      >
        <p style={{ margin: 0, font: 'var(--type-body-1)', color: 'var(--content-primary)' }}>
          {BODY}
        </p>
      </Drawer>
    </>
  );
}

/**
 * Four placements behind one control rather than four near-identical stories.
 *
 * `right` is the existing mobile-nav geometry, read from the working file.
 * `left`, `bottom` and `full` come from the XUI file's Drawer section
 * (1416:47417), where `bottom` is a sheet that hugs its content rather than
 * filling the screen.
 */
export const Placement: StoryObj<{ placement: DrawerPlacement; cta: boolean }> = {
  args: { placement: 'bottom', cta: true },
  argTypes: {
    placement: { control: 'inline-radio', options: ['right', 'left', 'bottom', 'full'] },
    cta: { control: 'boolean', description: 'Figma draws every placement with and without a call to action.' },
  },
  render: ({ placement, cta }) => <Demo placement={placement} cta={cta} />,
};

/** The nav panel AppShell opens below 900px. */
export const Navigation: StoryObj = {
  render: () => <Demo placement="right" cta={false} />,
};
