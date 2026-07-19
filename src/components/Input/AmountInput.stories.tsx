import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { AmountInput } from './AmountInput';
import { InfoIcon, UsdIcon, EthIcon, InrIcon, BtcIcon, WarningIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const currencyIconMap = { USD: UsdIcon, ETH: EthIcon, INR: InrIcon, BTC: BtcIcon };

const meta: Meta<typeof AmountInput> = {
  title: 'Components/Input',
  component: AmountInput,
  args: {
    label: 'Amount',
    currencyCode: 'USD',
    // Stored as the mapping key ('USD') — Storybook resolves it to the real
    // JSX icon via argTypes.currencyIcon.mapping before it reaches the component.
    currencyIcon: 'USD' as unknown as ReactNode,
    placeholder: '123.45',
    helperText: 'Enter amount',
    helperIcon: InfoIcon,
    interactive: true,
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    currencyCode: { control: 'text' },
    helperText: { control: 'text' },
    helperIcon: { control: false },
    currencyIcon: {
      control: 'select',
      options: Object.keys(currencyIconMap),
      mapping: currencyIconMap,
      description: 'Icon shown in the currency badge — pick a preset to preview.',
    },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof AmountInput>;

export const Amount: Story = {
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <AmountInput {...args} /> },
        { label: 'Focused', node: <AmountInput {...args} autoFocus /> },
        { label: 'Completed', node: <AmountInput {...args} defaultValue="123.45" /> },
        { label: 'Error', node: <AmountInput {...args} error helperText="Amount exceeds your balance" helperIcon={WarningIcon} /> },
        { label: 'Disabled', node: <AmountInput {...args} defaultValue="123.45" disabled /> },
      ]}
    />
  ),
};

export const AmountStatic: Story = {
  name: 'Amount-Static',
  args: { interactive: false, currencyCode: 'ETH', currencyIcon: 'ETH' as unknown as ReactNode },
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <AmountInput {...args} /> },
        { label: 'Focused', node: <AmountInput {...args} defaultValue="123.45" autoFocus /> },
        { label: 'Completed', node: <AmountInput {...args} defaultValue="123.45" /> },
        {
          label: 'Error',
          node: (
            <AmountInput
              {...args}
              defaultValue="123.45.6"
              error
              helperText="Invalid Input"
              helperIcon={WarningIcon}
            />
          ),
        },
        { label: 'Disabled', node: <AmountInput {...args} defaultValue="123.45" disabled /> },
      ]}
    />
  ),
};
