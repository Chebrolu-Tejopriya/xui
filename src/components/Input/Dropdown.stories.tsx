import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { InfoIcon, UsdIcon, EthIcon, BtcIcon, WarningIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const options = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
];

const optionsWithIcons = [
  { value: 'usd', label: 'USD', icon: UsdIcon },
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

/* Figma type=dropdown (918:7029-7081). Focused omitted: the trigger is a
   button and programmatic focus is fragile in headless rendering. */
export const Dropdown_: Story = {
  name: 'Dropdown',
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <Dropdown {...args} /> },
        { label: 'Completed', node: <Dropdown {...args} defaultValue="eth" /> },
        {
          label: 'Error',
          node: (
            <Dropdown
              {...args}
              defaultValue="sol"
              error
              helperText="Invalid Input"
              helperIcon={WarningIcon}
            />
          ),
        },
        { label: 'Disabled', node: <Dropdown {...args} disabled /> },
      ]}
    />
  ),
};

/* Figma type=dropdown with icon (918:7209-7265). Same chrome; the option
   icon (24px, 4px gap) appears only once a value is selected — the default
   and disabled states are visually identical to the plain dropdown. */
export const DropdownWithIcon: Story = {
  name: 'Dropdown with icon',
  args: { options: optionsWithIcons },
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <Dropdown {...args} /> },
        { label: 'Completed', node: <Dropdown {...args} defaultValue="usd" /> },
        {
          label: 'Error',
          node: (
            <Dropdown
              {...args}
              defaultValue="usd"
              error
              helperText="Invalid Input"
              helperIcon={WarningIcon}
            />
          ),
        },
        { label: 'Disabled', node: <Dropdown {...args} disabled /> },
      ]}
    />
  ),
};
