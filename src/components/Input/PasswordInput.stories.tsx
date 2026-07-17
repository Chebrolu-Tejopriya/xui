import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';
import { InfoIcon } from './storyIcons';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Input/Password',
  component: PasswordInput,
  args: {
    label: 'Password',
    placeholder: 'Password',
    helperText: 'Enter Password',
    helperIcon: InfoIcon,
    forgotPasswordLabel: 'Forgot Password?',
    mandatory: true,
    error: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    forgotPasswordLabel: { control: 'text' },
    helperIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 384 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Playground: Story = {};
