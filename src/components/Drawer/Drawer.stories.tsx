import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { InfoIcon } from '../../icons';
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

type DemoProps = {
  placement: DrawerPlacement;
  cta: boolean;
  overlayBlur?: boolean;
  headingIcon?: boolean;
  title?: string;
  width?: string;
  height?: string;
  draggable?: boolean;
};

function Demo({ placement, cta, overlayBlur, headingIcon, title = 'Drawer Title', width, height, draggable }: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {placement} drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        overlayBlur={overlayBlur}
        width={width}
        height={height}
        draggable={draggable}
        headingIcon={headingIcon ? <InfoIcon size={20} /> : undefined}
        title={title}
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

function FormDemo() {
  const [open, setOpen] = useState(false);
  const row = { display: 'flex', gap: 'var(--spacing-12)' } as const;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="bottom"
        title="Drawer Title"
        footer={
          <div style={row}>
            <Button variant="outline" fullWidth onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <div style={row}>
          <Input label="First Name" defaultValue="Tech" />
          <Input label="Last Name" defaultValue="KoinX" />
        </div>
        <Input label="Email" placeholder="tech@koinx.com" />
        <Input label="Phone Number" placeholder="999999999" />
      </Drawer>
    </>
  );
}

/** Blurs the scrim behind the panel, using the system's only blur value. */
export const OverlayBlur: StoryObj = {
  render: () => <Demo placement="right" cta={false} overlayBlur />,
};

/** A glyph before the title. */
export const HeadingIcon: StoryObj = {
  render: () => <Demo placement="right" cta headingIcon />,
};

/** The header still holds the close control with no title to sit beside. */
export const WithoutTitle: StoryObj = {
  render: () => <Demo placement="right" cta={false} title="" />,
};

/** `width` overrides the placement's default — ignored by bottom and full. */
export const CustomWidth: StoryObj = {
  render: () => <Demo placement="right" cta={false} width="480px" />,
};

/* ---- Beyond the Figma Drawer section ----
   The XUI file draws `bottom` as a sheet that hugs its content. These three
   exist because the library KoinX developers already use distinguishes a
   fixed-height bottom drawer from a full-height one, and ships a form inside
   a drawer as its own case. Marked here rather than left to look like design. */

/** BEYOND FIGMA. A bottom sheet pinned to a set height rather than hugging. */
export const FixedHeightBottom: StoryObj = {
  render: () => <Demo placement="bottom" cta height="320px" />,
};

/** BEYOND FIGMA. The sheet taken to the full viewport height. */
export const FullHeightBottom: StoryObj = {
  render: () => <Demo placement="bottom" cta height="100%" />,
};

/** BEYOND FIGMA. A form inside a drawer — the body scrolls, the actions stay put. */
export const WithInputFields: StoryObj = {
  render: () => <FormDemo />,
};

/** BEYOND FIGMA. Swipe off, so the panel only closes by button, scrim or Escape. */
export const NonDraggable: StoryObj = {
  render: () => <Demo placement="bottom" cta draggable={false} />,
};
