import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const InfoIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.5V11M8 5.4v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'Email',
    helperText: 'Enter your email address',
    helperIcon: InfoIcon,
    mandatory: false,
    error: false,
    disabled: false,
  },
  argTypes: {
    helperIcon: { control: false },
    trailing: { control: false },
    leading: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 384 }}>
      <Input label="Email" placeholder="Email" helperText="Enter your email address" helperIcon={InfoIcon} />
      <Input label="Email" mandatory placeholder="Email" helperText="Mandatory field" helperIcon={InfoIcon} />
      <Input label="Email" defaultValue="pietro.schirano@gmail.com" helperText="Completed" helperIcon={InfoIcon} />
      <Input label="Email" error defaultValue="not-an-email" helperText="Please enter a valid email" helperIcon={InfoIcon} />
      <Input label="Email" disabled placeholder="Email" helperText="Disabled" helperIcon={InfoIcon} />
    </div>
  ),
};
