import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Input } from '../Input';
import { EditIcon } from '../../icons';
import { Drawer } from './Drawer';
import type { DrawerPlacement } from './Drawer';

/**
 * A drawer only makes sense at a phone width, so these open on iPhone 6
 * (375x667). The device picker in the toolbar changes it — every viewport
 * Storybook ships is in the list.
 */
const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  globals: { viewport: { value: 'iphone6', isRotated: false } },
};
export default meta;

const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget sapien sem. ' +
  'Sed viverra vehicula justo, nec dapibus nisl pharetra vel. Cras posuere aliquet justo, ' +
  'a efficitur justo dictum sed. Nam ullamcorper, purus et consequat sagittis, nisi tortor ' +
  'efficitur nulla, in fermentum leo lorem quis mauris. Curabitur rhoncus, elit nec blandit ' +
  'fermentum, eros elit fermentum mi, ac vestibulum neque quam et magna.';

const text = { margin: 0, font: 'var(--type-body-1)', color: 'var(--content-primary)' } as const;
const row = { display: 'flex', gap: 'var(--spacing-12)' } as const;

type DemoProps = {
  placement?: DrawerPlacement;
  title?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  overlayBlur?: boolean;
  headingIcon?: boolean;
  draggable?: boolean;
  height?: string;
  label?: string;
};

function Demo({
  placement = 'bottom',
  title = 'Drawer Title',
  body = <p style={text}>{BODY}</p>,
  footer,
  overlayBlur,
  headingIcon,
  draggable,
  height,
  label = 'Open Drawer',
}: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        title={title}
        footer={footer}
        overlayBlur={overlayBlur}
        draggable={draggable}
        height={height}
        headingIcon={headingIcon ? <EditIcon size={20} /> : undefined}
      >
        {body}
      </Drawer>
    </>
  );
}

const oneButton = <Button fullWidth>Button</Button>;
const twoButtons = (
  <div style={row}>
    <Button fullWidth>Button</Button>
    <Button fullWidth variant="outline">
      Button
    </Button>
  </div>
);

/** A bottom sheet that hugs its content. */
export const DefaultDrawer: StoryObj = { render: () => <Demo /> };

/** The scrim behind the panel is blurred. */
export const WithOverlayBlur: StoryObj = {
  render: () => <Demo overlayBlur label="Open Drawer with overlay blur" />,
};

/** An extra action in the header, beside the close control. */
export const DrawerWithExtraHeadingIcon: StoryObj = { render: () => <Demo headingIcon /> };

/** Anchored to the right edge, full height. */
export const RightDrawer: StoryObj = { render: () => <Demo placement="right" /> };

/** A sheet with its action pinned below the scrolling body. */
export const FixedBottomDrawer: StoryObj = { render: () => <Demo footer={oneButton} /> };

/** The same pinned actions, on the right-hand panel. */
export const RightDrawerWithFixedBottom: StoryObj = {
  render: () => <Demo placement="right" footer={twoButtons} />,
};

/**
 * Fills the viewport.
 *
 * NOTE: their `full_height` variant is a right-hand panel at full height,
 * which is what our `right` already is. `full` spans both axes, so on a phone
 * the two look alike and on a desktop they do not. Worth a designer's call.
 */
export const FullHeightDrawer: StoryObj = { render: () => <Demo placement="full" /> };

/** Swipe off — it closes by button, scrim or Escape only. */
export const NonDraggableDrawer: StoryObj = {
  render: () => <Demo draggable={false} label="Open non-draggable drawer" />,
};

/** The header keeps the close control with no title beside it. */
export const RightDrawerWithoutTitle: StoryObj = {
  render: () => (
    <Demo placement="right" title="" body={<p style={text}>Drawer content</p>} footer={twoButtons} />
  ),
};

/** A form in the body; the actions stay put while it scrolls. */
export const DrawerWithInputFields: StoryObj = {
  render: () => (
    <Demo
      body={
        <>
          <div style={row}>
            <Input label="First Name" defaultValue="Tech" />
            <Input label="Last Name" defaultValue="KoinX" />
          </div>
          <Input label="Email" placeholder="tech@koinx.com" />
          <Input label="Phone Number" placeholder="999999999" />
        </>
      }
      footer={
        <div style={row}>
          <Button variant="outline" fullWidth>
            Cancel
          </Button>
          <Button fullWidth>Save</Button>
        </div>
      }
    />
  ),
};
