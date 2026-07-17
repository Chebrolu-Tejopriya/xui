import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneInput } from './PhoneInput';
import { InfoIcon, IndiaFlag } from './storyIcons';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/Input/Mobile Number',
  component: PhoneInput,
  args: {
    label: 'Mobile Number',
    countryCode: '+91',
    countryFlag: IndiaFlag,
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
    countryFlag: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Playground: Story = {};
