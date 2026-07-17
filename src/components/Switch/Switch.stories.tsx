import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Playground: Story = { args: { label: 'Notifications' } };

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="With icon" icon defaultChecked />
      <Switch label="With icon (off)" icon />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
