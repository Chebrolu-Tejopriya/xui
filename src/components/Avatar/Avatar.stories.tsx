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
    /* A data URI, not a remote URL. This was https://i.pravatar.cc/128?img=13,
       which made the story depend on a third-party server: the visual suite
       failed it intermittently with ~3,000 differing pixels, because whether
       the image arrived (and which one) varied per run. A baseline cannot be
       hostage to someone else's CDN, and Storybook now renders offline. */
    src:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E" +
      "%3Crect width='128' height='128' fill='%23cbe0ff'/%3E" +
      "%3Ccircle cx='64' cy='48' r='24' fill='%230052fe'/%3E" +
      "%3Cpath d='M16 128c0-30 21-48 48-48s48 18 48 48z' fill='%230052fe'/%3E%3C/svg%3E",
    alt: 'User avatar',
    size: 'xl',
  },
};
