import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Continue',
    variant: 'primary',
    size: 'large',
    loading: false,
    iconOnly: false,
    circle: false,
  },
  argTypes: {
    iconLeft: { control: false },
    iconRight: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    size: "medium"
  }
};

const PlusIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button size="large">Large</Button>
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button iconLeft={PlusIcon}>Icon left</Button>
      <Button iconRight={PlusIcon}>Icon right</Button>
      <Button iconOnly aria-label="Add">
        {PlusIcon}
      </Button>
      <Button iconOnly circle aria-label="Add">
        {PlusIcon}
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>
      <Button fullWidth>Full width</Button>
    </div>
  ),
};
