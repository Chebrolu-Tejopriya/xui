import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Satoshi Nakamoto', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} size={s} name="Satoshi Nakamoto" />
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/128?img=13',
    alt: 'User avatar',
    size: 'xl',
  },
};
