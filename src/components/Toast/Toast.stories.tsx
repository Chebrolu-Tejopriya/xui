import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';
import { CalendarIcon } from '../../icons';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    title: 'Scheduled: Catch up',
    subtitle: 'Friday, February 10, 2023 at 5.57 PM',
    actionLabel: 'Undo',
    icon: <CalendarIcon style={{ color: 'var(--surface-brand-primary)' }} />,
  },
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Toast {...args} variant="default" />
      <Toast {...args} variant="success" />
      <Toast {...args} variant="warning" />
      <Toast
        {...args}
        variant="error"
        title="Something went wrong"
        subtitle="Lorem ipsum dolor sit amet conset."
        actionLabel="Try Again"
      />
    </div>
  ),
};

export const Dismissible: Story = { args: { dismissible: true } };
