import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Default' },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Default" />
      <Checkbox label="Selected" defaultChecked />
      <Checkbox label="Partial Selected" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};
