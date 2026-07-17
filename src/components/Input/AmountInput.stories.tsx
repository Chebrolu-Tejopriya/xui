import type { Meta, StoryObj } from '@storybook/react-vite';
import { AmountInput } from './AmountInput';
import { InfoIcon, UsdIcon, EthIcon } from './storyIcons';

const meta: Meta<typeof AmountInput> = {
  title: 'Components/Input/Amount',
  component: AmountInput,
  args: {
    label: 'Amount',
    currencyCode: 'USD',
    currencyIcon: UsdIcon,
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
    currencyIcon: { control: false },
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
    currencyIcon: EthIcon,
    defaultValue: '123.45',
  },
};
