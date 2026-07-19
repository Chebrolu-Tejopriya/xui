import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';
import { InfoIcon, WarningIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Input',
  component: PasswordInput,
  args: {
    label: 'Password',
    placeholder: 'Password',
    helperText: 'Enter Password',
    helperIcon: InfoIcon,
    forgotPasswordLabel: 'Forgot Password?',
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    forgotPasswordLabel: { control: 'text' },
    helperIcon: { control: false },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Password: Story = {
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <PasswordInput {...args} /> },
        { label: 'Focused', node: <PasswordInput {...args} autoFocus /> },
        { label: 'Completed', node: <PasswordInput {...args} defaultValue="hunter2-swordfish" /> },
        { label: 'Error', node: <PasswordInput {...args} error helperText="Incorrect password" helperIcon={WarningIcon} /> },
        { label: 'Disabled', node: <PasswordInput {...args} disabled /> },
      ]}
    />
  ),
};
