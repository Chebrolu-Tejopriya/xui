import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { AmountInput } from './AmountInput';
import { InfoIcon, UsdIcon, EthIcon, InrIcon, BtcIcon } from './storyIcons';

const currencyIconMap = { USD: UsdIcon, ETH: EthIcon, INR: InrIcon, BTC: BtcIcon };

const meta: Meta<typeof AmountInput> = {
  title: 'Components/Input/Amount',
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
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof AmountInput>;

export const Playground: Story = {};

export const Static: Story = {
  name: 'Amount-Static',
  args: {
    interactive: false,
    currencyCode: 'ETH',
    currencyIcon: 'ETH' as unknown as ReactNode,
    defaultValue: '123.45',
  },
};
