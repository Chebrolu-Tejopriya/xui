import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { InfoIcon, EthIcon, BtcIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const options = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
];

const optionsWithIcons = [
  { value: 'btc', label: 'Bitcoin', icon: BtcIcon },
  { value: 'eth', label: 'Ethereum', icon: EthIcon },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Input',
  component: Dropdown,
  args: {
    label: 'Select',
    placeholder: 'Select an option',
    options,
    helperText: 'Choose a network',
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
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Dropdown_: Story = {
  name: 'Dropdown',
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <Dropdown {...args} /> },
        { label: 'Selected', node: <Dropdown {...args} defaultValue="eth" /> },
        { label: 'With icon', node: <Dropdown {...args} options={optionsWithIcons} defaultValue="eth" /> },
        { label: 'Error', node: <Dropdown {...args} error helperText="Please select a network" /> },
        { label: 'Disabled', node: <Dropdown {...args} defaultValue="eth" disabled /> },
      ]}
    />
  ),
};
