import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { TickCircleIcon, WarningAlertIcon, DeleteIcon } from '../../icons';
import { Dialog } from './Dialog';
import type { ReactNode } from 'react';
import type { DialogVariant, DialogProps } from './Dialog';

/**
 * Every story here opens its overlay before the shot.
 *
 * Without this the visual suite photographed a button and nothing else: the
 * stories start closed, and the panel portals to document.body so it would sit
 * outside the captured element even when open. The `opens-overlay` tag tells
 * the suite to wait for it and to capture the whole viewport instead.
 */
const openOverlay: NonNullable<Meta['play']> = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: /^Open/i }));
};

const meta: Meta<typeof Dialog> = {
  tags: ['opens-overlay'],
  play: openOverlay,
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

/** Live Dialog — pick the variant and edit the title/description, then open it. */
export const Playground: Story = {
  args: {
    variant: 'default',
    title: 'Are you absolutely sure?',
    description:
      'Are you sure you want to proceed with this action? Please confirm to continue.',
    hideClose: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive', 'alert'] },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    hideClose: { control: 'boolean', description: 'Hide the top-right close icon.' },
    open: { control: false },
    onClose: { control: false },
    onConfirm: { control: false },
    children: { control: false },
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

function Demo({ variant }: { variant: DialogVariant }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {variant} dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        variant={variant}
        title="Are you absolutely sure?"
        description="Are you sure you want to proceed with this action? Please confirm to continue."
      />
    </>
  );
}

/** Named component so the hook lives in a real component (rules-of-hooks). */
function PlaygroundDemo(args: Omit<DialogProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} />
    </>
  );
}

/**
 * Figma pairs each variant with its own glyph and colour — XUI file
 * "Dialog with Icon" 1138:5672. Read from the file, not chosen here:
 *
 *   default      Icons/check_solid    #0052FE
 *   alert        Icons/warning_amber  #FB6F04
 *   destructive  Iconly/delete        #F7324C
 *
 * The colour is applied by the component from the variant, so a destructive
 * dialog cannot end up with a blue trash can.
 */
const VARIANT_ICON: Record<DialogVariant, ReactNode> = {
  default: <TickCircleIcon variant="solid" />,
  alert: <WarningAlertIcon variant="solid" />,
  destructive: <DeleteIcon variant="solid" />,
};

function IconDemo({ variant }: { variant: DialogVariant }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {variant} dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        variant={variant}
        icon={VARIANT_ICON[variant]}
        title="Are you absolutely sure?"
        description="Are you sure you want to proceed with this action? Please confirm to continue."
      />
    </>
  );
}

/**
 * An icon turns the dialog into its centred form. One story with a variant
 * switch rather than three that differ by a single word.
 */
export const WithIcon: StoryObj<{ variant: DialogVariant }> = {
  args: { variant: 'destructive' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive', 'alert'] },
  },
  render: ({ variant }) => <IconDemo variant={variant} />,
};

export const Default: Story = { render: () => <Demo variant="default" /> };
export const Destructive: Story = { render: () => <Demo variant="destructive" /> };
export const Alert: Story = { render: () => <Demo variant="alert" /> };
