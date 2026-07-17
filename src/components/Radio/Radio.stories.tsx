import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  args: { label: 'Default', name: 'demo' },
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Playground: Story = {};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio name="group" label="Default" />
      <Radio name="group" label="Selected" defaultChecked />
      <Radio name="group2" label="Disabled" disabled />
    </div>
  ),
};
