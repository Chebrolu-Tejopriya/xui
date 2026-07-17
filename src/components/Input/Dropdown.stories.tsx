import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { InfoIcon, EthIcon } from './storyIcons';

const options = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
];

const optionsWithIcons = [
  { value: 'btc', label: 'Bitcoin', icon: EthIcon },
  { value: 'eth', label: 'Ethereum', icon: EthIcon },
  { value: 'sol', label: 'Solana', icon: EthIcon },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Input/Dropdown',
  component: Dropdown,
  args: {
    label: 'Select',
    placeholder: 'Select an option',
    options,
    helperText: 'Enter your email address',
    helperIcon: InfoIcon,
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    helperIcon: { control: false },
    options: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Playground: Story = {};

export const WithIcon: Story = {
  args: { options: optionsWithIcons, defaultValue: 'eth' },
};
