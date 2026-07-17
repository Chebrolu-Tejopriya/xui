import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Dialog } from './Dialog';
import type { DialogVariant } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};
export default meta;

type Story = StoryObj<typeof Dialog>;

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

export const Default: Story = { render: () => <Demo variant="default" /> };
export const Destructive: Story = { render: () => <Demo variant="destructive" /> };
export const Alert: Story = { render: () => <Demo variant="alert" /> };
