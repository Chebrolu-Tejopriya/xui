import type { Meta, StoryObj } from '@storybook/react-vite';
import { SecretInput } from './SecretInput';
import { InfoIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const meta: Meta<typeof SecretInput> = {
  title: 'Components/Input',
  component: SecretInput,
  args: {
    label: 'API Key',
    placeholder: 'Enter API Key',
    helperText: 'Your API key is encrypted and stored securely.',
    helperIcon: InfoIcon,
    mandatory: true,
    error: false,
    disabled: false,
    defaultRevealed: false,
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    helperIcon: { control: false },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof SecretInput>;

export const SecretKey: Story = {
  name: 'Secret Key',
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default (masked)', node: <SecretInput {...args} defaultValue="79pxki7em1m01u98bcjxz8bs" /> },
        { label: 'Focused', node: <SecretInput {...args} autoFocus /> },
        { label: 'Revealed', node: <SecretInput {...args} defaultValue="79pxki7em1m01u98bcjxz8bs" defaultRevealed /> },
        { label: 'Error', node: <SecretInput {...args} error helperText="This key is invalid or expired." /> },
        { label: 'Disabled', node: <SecretInput {...args} defaultValue="79pxki7em1m01u98bcjxz8bs" disabled /> },
      ]}
    />
  ),
};
