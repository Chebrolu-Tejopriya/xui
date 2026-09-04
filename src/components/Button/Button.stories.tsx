import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { EmailIcon, AddPlusIcon, ArrowForwardIcon } from '../../icons';
import type { ButtonProps, ButtonVariant } from './Button';
import { StateShowcase } from '../Input/storyLayout';

/* Real library icons, not drawings of them. These were freehand <svg>s until a row
   of hand-drawn tab icons turned out to be optically ragged - one painted 45% of
   its box, another 94% and overflowed it. The library's glyphs sit in a 43-63%
   band because they came off one grid, so a story that draws its own is both
   misrepresenting the system and dodging the only set anything keeps honest. */
const MailIcon = <EmailIcon />;
const PlusIcon = <AddPlusIcon />;
const ArrowRightIcon = <ArrowForwardIcon />;

const iconMap: Record<string, ReactNode> = {
  None: undefined,
  Email: MailIcon,
  Plus: PlusIcon,
  Arrow: ArrowRightIcon,
};

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Continue',
    size: 'large',
    loading: false,
    disabled: false,
    fullWidth: false,
    iconLeft: 'None' as unknown as ReactNode,
    iconRight: 'None' as unknown as ReactNode,
  },
  argTypes: {
    children: { control: 'text', description: 'Button label.' },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
      description: 'Heights 44/36/32px (Figma Size=Large/Medium/Small).',
    },
    iconLeft: {
      control: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Leading icon (Figma "with icon on left") — pick a preset to preview.',
    },
    iconRight: {
      control: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: 'Trailing icon (Figma "with icon on right").',
    },
    // Fixed per story leaf — the leaves ARE the variants.
    variant: { control: false },
    iconOnly: { control: false },
    circle: { control: false },
  },
  parameters: {
    controls: { expanded: true },
    // Static source only: addon-docs' dynamic JSX serializer (the "Show code"
    // snippet) goes into a pathological loop on these matrix trees and pegs
    // the preview renderer. Verified via bisect 2026-07-19 — do not remove.
    docs: { source: { type: 'code' } },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

/**
 * A single live Button to experiment with — every prop is editable in the
 * Controls panel: variant, size, the two icon booleans (Figma "Show left/right
 * icon"), icon-only / circle, loading, disabled, full width, and the label.
 * The per-variant leaves below fix `variant`; this one unlocks it.
 */
export const Playground: Story = {
  args: { variant: 'primary' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'subtle', 'ghost', 'link'],
      description: 'Visual style (Figma `type`). Ignored when `iconOnly` is on.',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Figma "just icon" — a fixed outline square; pass the icon as `iconLeft`.',
    },
    circle: { control: 'boolean', description: 'Figma "just icon circle" (with `iconOnly`).' },
    fullWidth: { control: 'boolean' },
  },
  render: ({ iconOnly, iconLeft, children, ...rest }) =>
    // Icon-only expects an icon, not the text label — default to a plus if the
    // icon control is left on "None", else the label spills out of the square.
    iconOnly ? (
      <Button {...rest} iconOnly aria-label="Action">
        {iconLeft ?? PlusIcon}
      </Button>
    ) : (
      <Button {...rest} iconLeft={iconLeft}>
        {children}
      </Button>
    ),
};

const sizes = ['large', 'medium', 'small'] as const;

/* Buttons hug their content in Figma; without this wrapper the showcase
   column stretches each row's button to full width. */
function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;
}

/** The Figma state matrix for one text-button variant, threaded with args. */
function variantRows(variant: ButtonVariant, args: ButtonProps) {
  return [
    { label: 'Default', node: <Row><Button {...args} variant={variant} /></Row> },
    { label: 'Hover', node: <Row><Button {...args} variant={variant} data-hover="" /></Row> },
    {
      label: 'Icon left / icon right',
      node: (
        <Row>
          <Button {...args} variant={variant} iconLeft={MailIcon} />
          <Button {...args} variant={variant} iconRight={ArrowRightIcon} />
        </Row>
      ),
    },
    { label: 'Loading', node: <Row><Button {...args} variant={variant} loading /></Row> },
    { label: 'Disabled', node: <Row><Button {...args} variant={variant} disabled /></Row> },
    {
      label: 'Sizes (44 / 36 / 32)',
      node: (
        <Row>
          {sizes.map((s) => (
            <Button key={s} {...args} variant={variant} size={s} />
          ))}
        </Row>
      ),
    },
  ];
}

const variantStory = (variant: ButtonVariant): Story => ({
  render: (args) => <StateShowcase width={520} rows={variantRows(variant, args)} />,
});

export const Primary: Story = variantStory('primary');
export const Secondary: Story = variantStory('secondary');
export const Destructive: Story = variantStory('destructive');
export const Outline: Story = variantStory('outline');
export const Subtle: Story = variantStory('subtle');
export const Ghost: Story = variantStory('ghost');
export const Link: Story = variantStory('link');

export const IconOnly: Story = {
  name: 'Icon Only',
  args: { children: undefined },
  render: (args) => (
    <StateShowcase
      width={520}
      rows={[
        {
          label: 'Square (36 / 32 / 30)',
          node: (
            <Row>
              {sizes.map((s) => (
                <Button key={s} {...args} iconOnly size={s} aria-label="Add">
                  {PlusIcon}
                </Button>
              ))}
            </Row>
          ),
        },
        {
          label: 'Square · hover',
          node: (
            <Row>
              <Button {...args} iconOnly data-hover="" aria-label="Add">
                {PlusIcon}
              </Button>
            </Row>
          ),
        },
        {
          label: 'Square · loading',
          node: (
            <Row>
              {sizes.map((s) => (
                <Button key={s} {...args} iconOnly size={s} loading aria-label="Add">
                  {PlusIcon}
                </Button>
              ))}
            </Row>
          ),
        },
        {
          label: 'Circle (44 / 40 / 38)',
          node: (
            <Row>
              {sizes.map((s) => (
                <Button key={s} {...args} iconOnly circle size={s} aria-label="Add">
                  {PlusIcon}
                </Button>
              ))}
            </Row>
          ),
        },
        {
          label: 'Circle · loading',
          node: (
            <Row>
              {sizes.map((s) => (
                <Button key={s} {...args} iconOnly circle size={s} loading aria-label="Add">
                  {PlusIcon}
                </Button>
              ))}
            </Row>
          ),
        },
        {
          label: 'Disabled',
          node: (
            <Row>
              <Button {...args} iconOnly disabled aria-label="Add">
                {PlusIcon}
              </Button>
              <Button {...args} iconOnly circle disabled aria-label="Add">
                {PlusIcon}
              </Button>
            </Row>
          ),
        },
      ]}
    />
  ),
};
