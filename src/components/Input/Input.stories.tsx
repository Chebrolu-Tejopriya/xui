import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { InfoIcon, WarningIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

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
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof Input>;

// The primary view for this variant: every state, labelled and stacked.
// `args` is threaded into each row, so the Controls panel stays live —
// tweaking `label`, `placeholder`, `mandatory`, etc. updates all states at once.
export const Default: Story = {
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <Input {...args} /> },
        { label: 'Focused', node: <Input {...args} autoFocus /> },
        {
          label: 'Completed',
          node: <Input {...args} defaultValue="pietro.schirano@gmail.com" />,
        },
        {
          label: 'Error',
          node: <Input {...args} error helperText="Please enter a valid email" helperIcon={WarningIcon} />,
        },
        { label: 'Disabled', node: <Input {...args} disabled /> },
      ]}
    />
  ),
};
