import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [(Story) => <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  args: {
    content: 'Some Text',
    placement: 'top',
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} content="Some Text" placement={p}>
          <Button variant="outline">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithoutArrow: Story = {
  args: {
    content: 'Some Text',
    withArrow: false,
    children: <Button variant="outline">Hover me</Button>,
  },
};
