import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { InfoIcon, WarningIcon } from './storyIcons';
import { StateShowcase } from './storyLayout';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'Email',
    helperText: 'Enter your email address',
    helperIcon: InfoIcon,
    mandatory: false,
    error: false,
    disabled: false,
  },
  argTypes: {
    helperIcon: { control: false },
    trailing: { control: false },
    leading: { control: false },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

type Story = StoryObj<typeof Input>;

// The primary view for this variant: every state, labelled and stacked.
// `args` is threaded into each row, so the Controls panel stays live —
// tweaking `label`, `placeholder`, `mandatory`, etc. updates all states at once.
export const Default: Story = {
  render: (args) => (
    <StateShowcase
      rows={[
        { label: 'Default', node: <Input {...args} /> },
        { label: 'Focused', node: <Input {...args} autoFocus /> },
        {
          label: 'Completed',
          node: <Input {...args} defaultValue="pietro.schirano@gmail.com" />,
        },
        {
          label: 'Error',
          node: <Input {...args} error helperText="Please enter a valid email" helperIcon={WarningIcon} />,
        },
        { label: 'Disabled', node: <Input {...args} disabled /> },
      ]}
    />
  ),
};

/** A single live Input to experiment with — edit the label, placeholder,
 *  helper text, and toggle mandatory / error / disabled. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 384 }}>
      <Input {...args} />
    </div>
  ),
};

/**
 * Two field heights, both taken from Figma. `medium` (48) is the library's
 * Input_v2 field. `small` (44) is what the dashboard's filter bar uses, so a
 * search sits level with the 44px selects beside it — at 48 it overhung them
 * by 4px, which is what made that row look misaligned.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 384 }}>
      {(['medium', 'small'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <code
            style={{
              font: 'var(--type-body-3)',
              color: 'var(--content-tertiary)',
              fontFamily: 'monospace',
              width: 96,
            }}
          >
            {size} · {size === 'medium' ? 48 : 44}px
          </code>
          <Input size={size} placeholder="Search..." />
        </div>
      ))}
    </div>
  ),
};
