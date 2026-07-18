import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from './DateInput';
import { InfoIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const meta: Meta<typeof DateInput> = {
  title: 'Components/Input',
  component: DateInput,
  args: {
    label: 'Date',
    placeholder: 'Select a date',
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
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof DateInput>;

export const Date: Story = {
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <DateInput {...args} /> },
        { label: 'Focused', node: <DateInput {...args} autoFocus /> },
        { label: 'Completed', node: <DateInput {...args} defaultValue="Jan 24th, 2024" /> },
        { label: 'Error', node: <DateInput {...args} error defaultValue="Jan 35th, 2024" helperText="Invalid date" /> },
        { label: 'Disabled', node: <DateInput {...args} defaultValue="Jan 24th, 2024" disabled /> },
      ]}
    />
  ),
};
