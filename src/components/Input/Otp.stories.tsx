import type { Meta, StoryObj } from '@storybook/react-vite';
import { Otp } from './Otp';

const meta: Meta<typeof Otp> = {
  title: 'Components/Input/OTP',
  component: Otp,
  args: {
    label: 'Enter 6 Digit OTP',
    length: 6,
    mandatory: true,
    error: false,
    disabled: false,
    resendPrefixLabel: "Didn't Receive?",
    resendLabel: 'Resend OTP',
  },
  argTypes: {
    label: { control: 'text' },
    onResend: { control: false },
    onComplete: { control: false },
    onChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Otp>;

export const Playground: Story = {
  args: { onResend: () => {} },
};

export const Expiry: Story = {
  args: { defaultValue: '1234', expiresInLabel: 'Expires in 5 minutes' },
};
