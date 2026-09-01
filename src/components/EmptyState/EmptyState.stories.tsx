import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';
import { ArrowBackwardIcon, AddUserIcon } from '../../icons';
import {
  MaintenanceIllustration,
  ErrorIllustration,
  NoDataIllustration,
} from '../../assets/illustrations';

/**
 * The three illustrations the design ships, as a dropdown on every story —
 * so switching between "no connection", "maintenance" and "no details" is one
 * control rather than the same story written out three more times.
 */
const ILLUSTRATIONS = {
  'No connection': <ErrorIllustration />,
  Maintenance: <MaintenanceIllustration />,
  'No details': <NoDataIllustration />,
  None: undefined,
};

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  argTypes: {
    illustration: {
      name: 'illustration',
      options: Object.keys(ILLUSTRATIONS),
      mapping: ILLUSTRATIONS,
      control: { type: 'select' },
      description:
        'Pick one of the three shipped illustrations, or None. `mapping` turns the ' +
        'label into the component, so the control stays readable instead of showing JSX.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

/**
 * The whole anatomy: illustration, title, description, actions, footer.
 * Every part below the title is optional, and each is dropped from the DOM
 * rather than rendered empty — the gaps close instead of leaving a hole.
 */
export const Default: Story = {
  args: {
    // The label, not the node: `mapping` resolves it, and the dropdown then
    // shows which one is selected instead of "[object Object]".
    illustration: 'No details',
    title: 'No team members found.',
    description: "Looks like you haven't added any team members yet. Invite members to get started.",
    actions: <Button size="large" iconLeft={<AddUserIcon />}>Invite new members</Button>,
    footer: 'Tip: Invite more team members to get more rewards and points.',
  },
};

/** The text still centres and the rhythm holds without artwork — this is the shape that fits inside a card or a table cell. */
export const WithoutIllustration: Story = {
  args: { ...Default.args, illustration: 'None' },
};

/** Nothing for the user to do here — the state is informational. */
export const WithoutActions: Story = {
  args: { ...Default.args, actions: undefined },
};

/** The common case: a nudge would be noise once there is a clear action. */
export const WithoutFooter: Story = {
  args: { ...Default.args, footer: undefined },
};

/** Title only. Every other part omitted. */
export const TitleOnly: Story = {
  args: { title: 'No results' },
};

/**
 * `className` lands on the root; `classNames` reaches the parts it cannot.
 * Here the title is tinted and the footer boxed, to show the hooks are real
 * rather than declared.
 */
export const WithCustomClasses: Story = {
  render: (args) => (
    <>
      <style>{`
        .es-title { color: var(--content-brand-primary); }
        .es-footer {
          padding: var(--spacing-8) var(--spacing-12);
          border-radius: var(--radius-sm);
          background: var(--surface-secondary);
        }
      `}</style>
      <EmptyState {...args} classNames={{ title: 'es-title', footer: 'es-footer' }} />
    </>
  ),
  args: Default.args,
};

/* ---- The three screens Figma draws, in "Empty States" 9899:141035 ---- */

/** Figma's copy, with its "maintainance" spelling corrected — designer's call. */
export const Maintenance: Story = {
  args: {
    illustration: 'Maintenance',
    title: 'We are under maintenance',
    description: 'Please be patient, our team is working to get this site up again',
  },
};

export const SomethingWentWrong: Story = {
  args: {
    illustration: 'No connection',
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

/** Figma hides the description on this one — the title and the action carry it. */
export const NoData: Story = {
  args: {
    illustration: 'No details',
    title: 'No Details Found',
    actions: (
      <Button size="large" iconLeft={<ArrowBackwardIcon />}>
        Back to Integrations
      </Button>
    ),
  },
};

export const Playground: Story = { args: Default.args };
