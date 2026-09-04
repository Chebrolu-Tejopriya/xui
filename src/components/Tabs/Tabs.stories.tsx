import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';
import { StateShowcase } from '../Input/storyLayout';
import { ReportsIcon, EditIcon, UserIcon, SettingsIcon } from '../../icons';

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

/* Real Icons v2, not drawings of them.
   This story used to build its four icons inline — freehand <svg>s with a comment
   admitting they "approximate" the Figma frame. They did not approximate it well:
   in an identical 20px box the file glyph painted 12x15 and the profile one
   18.6x20.2, overflowing the box, so a row of them read as ragged no matter how
   exactly the tab centred it. The library's own glyphs sit in a 43-63% band and
   line up, which is the argument for a story never drawing its own. */
const itemsWithIcons: TabItem[] = [
  { value: 'file', label: 'File', icon: <ReportsIcon /> },
  { value: 'edit', label: 'Edit', icon: <EditIcon /> },
  { value: 'profile', label: 'Profile', icon: <UserIcon /> },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
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

/** Live Tabs — switch the variant (boxed / underline) and toggle disabled. */
export const Playground: Story = {
  args: { variant: 'boxed', disabled: false },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['boxed', 'underline'],
      description: 'Figma boxed (brand-filled active) / underline (brand underline).',
    },
    disabled: { control: 'boolean', description: 'Disable the whole tablist.' },
  },
  render: (args) => <Tabs {...args} />,
};

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

/**
 * Figma's `Tabs/Default` set (1128:16648) carries Size=[Large|Medium]. Large is
 * 42, not the 44 XUI shipped — a Figma stroke takes no layout space and the CSS
 * border does, so the container's vertical padding is shaved by 1. Medium is 36,
 * reached by dropping the label to Subtitle/2 as well as trimming padding.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', alignItems: 'flex-start' }}>
      <span style={{ font: 'var(--type-body-3)', color: 'var(--content-secondary)' }}>large — 42px, the default</span>
      <Tabs {...args} size="large" />
      <span style={{ font: 'var(--type-body-3)', color: 'var(--content-secondary)' }}>medium — 36px</span>
      <Tabs {...args} size="medium" />
    </div>
  ),
};
