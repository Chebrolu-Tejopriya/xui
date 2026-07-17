import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    items: [
      { value: 'file', label: 'File' },
      { value: 'edit', label: 'Edit' },
      { value: 'profile', label: 'Profile' },
      { value: 'settings', label: 'Settings' },
    ],
    defaultValue: 'profile',
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};

export const WithDisabled: Story = {
  args: {
    items: [
      { value: 'file', label: 'File' },
      { value: 'edit', label: 'Edit', disabled: true },
      { value: 'profile', label: 'Profile' },
    ],
  },
};
