import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const items = [
  {
    value: 'a11y',
    title: 'Is it accessible',
    content:
      'Lorem ipsum dolor sit amet consectetur. Nibh elit malesuada eu amet orci maecenas interdum et. Nibh imperdiet sed volutpat vel turpis donec nec ridiculus interdum.',
  },
  { value: 'styled', title: 'Is it styled', content: 'Yes, it matches the Fibon design system.' },
  { value: 'animated', title: 'Is it animated', content: 'The chevron rotates on expand.' },
];

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { items },
  decorators: [(Story) => <div style={{ width: 450 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Playground: Story = {};

export const Expanded: Story = { args: { defaultValue: ['a11y'] } };

export const Multiple: Story = { args: { multiple: true, defaultValue: ['a11y', 'styled'] } };
