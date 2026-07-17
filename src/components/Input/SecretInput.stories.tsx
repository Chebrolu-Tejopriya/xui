import type { Meta, StoryObj } from '@storybook/react-vite';
import { SecretInput } from './SecretInput';
import { InfoIcon } from './storyIcons';

const meta: Meta<typeof SecretInput> = {
  title: 'Components/Input/Secret (API Key)',
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
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof SecretInput>;

export const Playground: Story = {};

export const Revealed: Story = {
  args: { defaultValue: '79pxki7em1m01u98bcjxz8bs', defaultRevealed: true },
};
