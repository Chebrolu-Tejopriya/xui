import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Button } from './Button';
import type { ButtonProps, ButtonVariant } from './Button';
import { StateShowcase } from '../Input/storyLayout';

/* Icons matching the Figma "with icon" button variants (Icons/email, Icons/Add). */
const EmailIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <rect x="2.5" y="4" width="15" height="12" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="m3.5 5.5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const iconMap: Record<string, ReactNode> = {
  None: undefined,
  Email: EmailIcon,
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
      description: 'Heights 42/36/32px (Figma Size=Large/Medium/Small).',
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
          <Button {...args} variant={variant} iconLeft={EmailIcon} />
          <Button {...args} variant={variant} iconRight={ArrowRightIcon} />
        </Row>
      ),
    },
    { label: 'Loading', node: <Row><Button {...args} variant={variant} loading /></Row> },
    { label: 'Disabled', node: <Row><Button {...args} variant={variant} disabled /></Row> },
    {
      label: 'Sizes (42 / 36 / 32)',
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
