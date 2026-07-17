import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge', variant: 'primary', size: 'default' },
  argTypes: {
    iconLeft: { control: false },
    iconRight: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="accent-primary">Accent</Badge>
      <Badge variant="accent-secondary">Accent</Badge>
      <Badge variant="accent-positive">Positive</Badge>
      <Badge variant="accent-negative">Negative</Badge>
    </div>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="accent-primary" bordered>
        Accent
      </Badge>
      <Badge variant="accent-secondary" bordered>
        Accent
      </Badge>
      <Badge variant="accent-positive" bordered>
        Positive
      </Badge>
      <Badge variant="accent-negative" bordered>
        Negative
      </Badge>
    </div>
  ),
};

export const Large: Story = {
  args: { size: 'large', children: 'Badge – Large' },
};
