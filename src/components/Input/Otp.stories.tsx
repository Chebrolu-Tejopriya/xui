import type { Meta, StoryObj } from '@storybook/react-vite';
import { Otp } from './Otp';
import { StateShowcase } from './storyLayout';

const meta: Meta<typeof Otp> = {
  title: 'Components/Input',
  component: Otp,
  args: {
    label: 'Enter 6 Digit OTP',
    length: 6,
    mandatory: true,
    error: false,
    disabled: false,
    resendPrefixLabel: "Didn't Receive?",
    resendLabel: 'Resend OTP',
    onResend: () => {},
  },
  argTypes: {
    label: { control: 'text' },
    onResend: { control: false },
    onComplete: { control: false },
    onChange: { control: false },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof Otp>;

export const OTP: Story = {
  render: (args) => (
    <StateShowcase
      width={440}
      rows={[
        { label: 'Default', node: <Otp {...args} /> },
        { label: 'Filled', node: <Otp {...args} defaultValue="136194" /> },
        { label: 'Error', node: <Otp {...args} defaultValue="136194" error errorText="OTP Doesn't match" /> },
        { label: 'Expiry', node: <Otp {...args} defaultValue="136194" expiresInLabel="Expires in 5:00" /> },
        { label: 'Disabled', node: <Otp {...args} defaultValue="1234" disabled /> },
      ]}
    />
  ),
};
