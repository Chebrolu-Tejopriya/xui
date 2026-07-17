import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { PhoneInput } from './PhoneInput';
import { InfoIcon, IndiaFlag, UsFlag } from './storyIcons';

const countryFlagMap = { IN: IndiaFlag, US: UsFlag };

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/Input/Mobile Number',
  component: PhoneInput,
  args: {
    label: 'Mobile Number',
    countryCode: '+91',
    // Stored as the mapping key ('IN') — Storybook resolves it to the real
    // JSX flag via argTypes.countryFlag.mapping before it reaches the component.
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
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Playground: Story = {};
