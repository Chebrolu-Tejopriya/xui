import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { PasswordInput } from './PasswordInput';
import { SecretInput } from './SecretInput';
import { DateInput } from './DateInput';
import { Dropdown } from './Dropdown';
import { PhoneInput } from './PhoneInput';
import { AmountInput } from './AmountInput';
import { Otp } from './Otp';

const InfoIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.5V11M8 5.4v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IndiaFlag = (
  <svg viewBox="0 0 24 24">
    <rect width="24" height="8" y="0" fill="#FF9933" />
    <rect width="24" height="8" y="8" fill="#FFFFFF" />
    <rect width="24" height="8" y="16" fill="#138808" />
    <circle cx="12" cy="12" r="2.2" fill="none" stroke="#000080" strokeWidth="0.5" />
  </svg>
);

const UsdIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#0052fe" />
    <text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">
      $
    </text>
  </svg>
);

const EthIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#627eea" />
    <path d="M12 4v6.2L17.5 13 12 4Z" fill="white" fillOpacity="0.7" />
    <path d="M12 4 6.5 13 12 10.2V4Z" fill="white" />
    <path d="M12 15.4v4.6l5.5-7.6-5.5 3Z" fill="white" fillOpacity="0.7" />
    <path d="M12 20v-4.6L6.5 12.4 12 20Z" fill="white" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'Email',
    helperText: 'Enter your email address',
    helperIcon: InfoIcon,
  },
  argTypes: {
    helperIcon: { control: false },
    trailing: { control: false },
    leading: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 384 }}>
      <Input label="Email" placeholder="Email" helperText="Enter your email address" helperIcon={InfoIcon} />
      <Input label="Email" mandatory placeholder="Email" helperText="Mandatory field" helperIcon={InfoIcon} />
      <Input label="Email" defaultValue="pietro.schirano@gmail.com" helperText="Completed" helperIcon={InfoIcon} />
      <Input label="Email" error defaultValue="not-an-email" helperText="Please enter a valid email" helperIcon={InfoIcon} />
      <Input label="Email" disabled placeholder="Email" helperText="Disabled" helperIcon={InfoIcon} />
    </div>
  ),
};

export const PasswordVariant: Story = {
  name: 'Type: Password',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <PasswordInput
        label="Password"
        mandatory
        placeholder="Password"
        helperText="Enter Password"
        helperIcon={InfoIcon}
        forgotPasswordLabel="Forgot Password?"
      />
    </div>
  ),
};

export const SecretVariant: Story = {
  name: 'Type: Password / API Key / Secret Key',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 384 }}>
      <SecretInput
        label="API Key"
        mandatory
        placeholder="Enter API Key"
        helperText="Your API key is encrypted and stored securely."
        helperIcon={InfoIcon}
      />
      <SecretInput
        label="API Key"
        mandatory
        defaultValue="79pxki7em1m01u98bcjxz8bs"
        defaultRevealed
        helperText="Your API key is encrypted and stored securely."
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

export const DateVariant: Story = {
  name: 'Type: Date',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <DateInput
        label="Date"
        mandatory
        defaultValue="Jan 24th, 2024"
        helperText="Enter transaction date"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

const dropdownOptions = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
];

export const DropdownVariant: Story = {
  name: 'Type: Dropdown',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <Dropdown
        label="Select"
        mandatory
        options={dropdownOptions}
        helperText="Enter your email address"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

const dropdownWithIconOptions = [
  { value: 'btc', label: 'Bitcoin', icon: EthIcon },
  { value: 'eth', label: 'Ethereum', icon: EthIcon },
  { value: 'sol', label: 'Solana', icon: EthIcon },
];

export const DropdownWithIconVariant: Story = {
  name: 'Type: Dropdown with icon',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <Dropdown
        label="Select"
        mandatory
        options={dropdownWithIconOptions}
        defaultValue="eth"
        helperText="Enter your email address"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

export const MobileNumberVariant: Story = {
  name: 'Type: Mobile Number',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <PhoneInput
        label="Mobile Number"
        mandatory
        countryFlag={IndiaFlag}
        countryCode="+91"
        placeholder="9678384383"
        helperText="Enter registered mobile number"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

export const AmountVariant: Story = {
  name: 'Type: Amount',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <AmountInput
        label="Amount"
        mandatory
        currencyIcon={UsdIcon}
        currencyCode="USD"
        placeholder="123.45"
        helperText="Enter amount"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

export const AmountStaticVariant: Story = {
  name: 'Type: Amount-Static',
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <AmountInput
        label="Amount"
        mandatory
        interactive={false}
        currencyIcon={EthIcon}
        currencyCode="ETH"
        defaultValue="123.45"
        helperText="Enter amount"
        helperIcon={InfoIcon}
      />
    </div>
  ),
};

export const OtpVariant: Story = {
  name: 'Type: OTP',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Otp label="Enter 6 Digit OTP" mandatory onResend={() => {}} />
      <Otp label="Enter 6 Digit OTP" mandatory defaultValue="1234" expiresInLabel="Expires in 5 minutes" />
    </div>
  ),
};
