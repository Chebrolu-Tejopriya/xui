import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';
import { ArrowBackwardIcon } from '../../icons';
import {
  MaintenanceIllustration,
  ErrorIllustration,
  NoDataIllustration,
} from '../../assets/illustrations';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

/**
 * The three screens Figma draws, in the order they appear in
 * "Empty States" 9899:141035 — no actions, two actions, one action. The copy
 * is Figma's verbatim, including the "maintainance" spelling.
 */
export const Maintenance: Story = {
  args: {
    illustration: <MaintenanceIllustration />,
    title: 'We are under maintainance',
    description: 'Please be patient, our team is working to get this site up again',
  },
};

export const SomethingWentWrong: Story = {
  args: {
    illustration: <ErrorIllustration />,
    title: 'Something went wrong',
    description: 'Oh no! Something just broke! Rest assured our awesome team is getting it fixed.',
    actions: (
      <>
        <Button size="large">Go to KoinX Home</Button>
        <Button size="large" variant="outline">
          Read our Informative Blogs
        </Button>
      </>
    ),
  },
};

/**
 * Figma hides the description on this one — the title and the action carry it.
 * The component treats `description` as optional for exactly this reason
 * rather than making callers pass an empty string.
 */
export const NoData: Story = {
  args: {
    illustration: <NoDataIllustration />,
    title: 'No Details Found',
    actions: (
      <Button size="large" iconLeft={<ArrowBackwardIcon />}>
        Back to Integrations
      </Button>
    ),
  },
};

/**
 * Without an illustration — the layout still holds, which is what makes this
 * usable inside a table cell or a card rather than only as a full page.
 */
export const TextOnly: Story = {
  args: {
    title: 'No transactions match these filters',
    description: 'Try widening the date range or clearing a filter.',
    actions: <Button variant="outline">Clear filters</Button>,
  },
};

export const Playground: Story = {
  args: {
    illustration: <NoDataIllustration />,
    title: 'No Details Found',
    description: "Looks like you haven't added any transactions yet. Add transactions to get started.",
  },
};
