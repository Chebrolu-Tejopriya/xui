import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';
import { StateShowcase } from '../Input/storyLayout';

/* Icons approximating the Figma Tabs/WithIcons frame (report/edit/verified/settings). */
const FileIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <rect x="4" y="2.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const EditIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="m12.8 3.7 3.5 3.5L7 16.5l-4 .9.5-4.4 9.3-9.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const VerifiedIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="m10 1.8 2 1.9 2.7-.4 1 2.6 2.5 1.1-.6 2.7 1.7 2.2-1.7 2.2.6 2.7-2.5 1.1-1 2.6-2.7-.4-2 1.9-2-1.9-2.7.4-1-2.6-2.5-1.1.6-2.7L.7 12l1.7-2.2-.6-2.7 2.5-1.1 1-2.6 2.7.4 2-1.9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="m7 10 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SettingsIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 2v2.4M10 15.6V18M18 10h-2.4M4.4 10H2m13.1-5.1-1.7 1.7M6.6 13.4l-1.7 1.7m0-10.2 1.7 1.7m6.8 6.8 1.7 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const items: TabItem[] = [
  { value: 'file', label: 'File' },
  { value: 'edit', label: 'Edit' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
];

const itemsHover: TabItem[] = [
  { value: 'file', label: 'File', hover: true },
  { value: 'edit', label: 'Edit' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
];

const itemsWithIcons: TabItem[] = [
  { value: 'file', label: 'File', icon: FileIcon },
  { value: 'edit', label: 'Edit', icon: EditIcon },
  { value: 'profile', label: 'Profile', icon: VerifiedIcon },
  { value: 'settings', label: 'Settings', icon: SettingsIcon },
];

const underlineItems: TabItem[] = [
  { value: 'file', label: 'File' },
  { value: 'edit', label: 'Edit' },
  { value: 'view', label: 'View' },
  { value: 'profile', label: 'Profile' },
];

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    items,
    defaultValue: 'profile',
  },
  argTypes: {
    items: { control: false },
    variant: { control: false },
    defaultValue: { control: 'text', description: 'Initially selected tab value.' },
    value: { control: false },
  },
  parameters: {
    controls: { expanded: true },
    // Static source only — the dynamic JSX serializer hangs on matrix trees
    // (see Button.stories.tsx).
    docs: { source: { type: 'code' } },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

/* Figma Tabs/Default (1128:16565 / 16685 / 16649). */
export const Default: Story = {
  render: (args) => (
    <StateShowcase
      width={560}
      rows={[
        { label: 'Default', node: <Tabs {...args} /> },
        { label: 'Hover', node: <Tabs {...args} items={itemsHover} /> },
        { label: 'Disabled', node: <Tabs {...args} disabled /> },
      ]}
    />
  ),
};

/* Figma Tabs/WithIcons (1135:16411 / 16416 / 16421). */
export const WithIcons: Story = {
  name: 'With icons',
  args: { items: itemsWithIcons },
  render: (args) => (
    <StateShowcase
      width={560}
      rows={[
        { label: 'Default', node: <Tabs {...args} /> },
        { label: 'Disabled', node: <Tabs {...args} disabled /> },
      ]}
    />
  ),
};

/* Figma Tabs underline variant (1128:16638). */
export const Underline: Story = {
  args: { items: underlineItems, defaultValue: 'view' },
  render: (args) => (
    <StateShowcase
      width={560}
      rows={[
        { label: 'Default', node: <Tabs {...args} variant="underline" /> },
        {
          label: 'Hover',
          node: (
            <Tabs
              {...args}
              variant="underline"
              items={[{ ...underlineItems[0], hover: true }, ...underlineItems.slice(1)]}
            />
          ),
        },
        { label: 'Disabled', node: <Tabs {...args} variant="underline" disabled /> },
      ]}
    />
  ),
};
