import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
  { value: 'ada', label: 'Cardano', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { options },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Playground: Story = {};

export const Selected: Story = { args: { defaultValue: 'eth' } };

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };
