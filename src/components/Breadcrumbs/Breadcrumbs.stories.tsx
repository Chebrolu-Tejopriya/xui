import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { FolderIcon } from '../../icons';

/* Real library icons, not drawings of them. These were freehand <svg>s until a row
   of hand-drawn tab icons turned out to be optically ragged - one painted 45% of
   its box, another 94% and overflowed it. The library's glyphs sit in a 43-63%
   band because they came off one grid, so a story that draws its own is both
   misrepresenting the system and dodging the only set anything keeps honest. */
const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [
      { label: 'Home', href: '#', icon: <FolderIcon /> },
      { label: 'Portfolio', href: '#', icon: <FolderIcon /> },
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
