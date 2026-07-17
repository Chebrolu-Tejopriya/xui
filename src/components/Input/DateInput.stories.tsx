import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from './DateInput';
import { InfoIcon } from './storyIcons';

const meta: Meta<typeof DateInput> = {
  title: 'Components/Input/Date',
  component: DateInput,
  args: {
    label: 'Date',
    defaultValue: 'Jan 24th, 2024',
    helperText: 'Enter transaction date',
    helperIcon: InfoIcon,
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    helperIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof DateInput>;

export const Playground: Story = {};
