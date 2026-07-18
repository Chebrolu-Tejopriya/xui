import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { PhoneInput } from './PhoneInput';
import { InfoIcon, IndiaFlag, UsFlag } from './storyIcons';
import { StateShowcase } from './storyLayout';

const countryFlagMap = { IN: IndiaFlag, US: UsFlag };

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/Input',
  component: PhoneInput,
  args: {
    label: 'Mobile Number',
    countryCode: '+91',
    countryFlag: 'IN' as unknown as ReactNode,
    placeholder: '9678384383',
    helperText: 'Enter registered mobile number',
    helperIcon: InfoIcon,
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    countryCode: { control: 'text' },
    helperText: { control: 'text' },
    helperIcon: { control: false },
    countryFlag: {
      control: 'select',
      options: Object.keys(countryFlagMap),
      mapping: countryFlagMap,
      description: 'Flag shown in the country-code badge — pick a preset to preview.',
    },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const MobileNumber: Story = {
  name: 'Mobile Number',
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <PhoneInput {...args} /> },
        { label: 'Focused', node: <PhoneInput {...args} autoFocus /> },
        { label: 'Completed', node: <PhoneInput {...args} defaultValue="9678384383" /> },
        { label: 'Error', node: <PhoneInput {...args} error helperText="Enter a valid 10-digit number" /> },
        { label: 'Disabled', node: <PhoneInput {...args} defaultValue="9678384383" disabled /> },
      ]}
    />
  ),
};
