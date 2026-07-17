import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const FolderIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5.5A1.5 1.5 0 0 1 4 4h4l2 2h6a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [
      { label: 'Home', href: '#', icon: FolderIcon },
      { label: 'Portfolio', href: '#', icon: FolderIcon },
      { label: 'Holdings' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Playground: Story = {};

export const WithDisabled: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Archived', disabled: true },
      { label: 'Item' },
    ],
  },
};
