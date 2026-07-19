import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination';
import { StateShowcase } from '../Input/storyLayout';

/** Stateful wrapper so every row is interactive in the showcase. */
function Demo(props: Partial<PaginationProps> & { pageCount: number }) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(props.rowsPerPage);
  return (
    <Pagination
      {...props}
      page={page}
      onPageChange={setPage}
      rowsPerPage={rows}
      onRowsPerPageChange={setRows}
    />
  );
}

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    pageCount: 10,
  },
  argTypes: {
    pageCount: { control: { type: 'number', min: 1 }, description: 'Total pages.' },
    page: { control: false },
    rowsPerPage: { control: false },
    size: { control: false, description: 'medium 36px / small 32px cells — fixed per row below.' },
    mobile: { control: false },
    onPageChange: { control: false },
    onRowsPerPageChange: { control: false },
  },
  parameters: {
    controls: { expanded: true },
    // Static source only — the dynamic JSX serializer hangs on matrix trees
    // (see Button.stories.tsx).
    docs: { source: { type: 'code' } },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

/* One row per Figma variant (801:4413-4430, 1920:22973). */
export const Pagination_: Story = {
  name: 'Pagination',
  render: (args) => (
    <StateShowcase
      width={560}
      rows={[
        { label: 'Desktop / v1', node: <Demo pageCount={args.pageCount} /> },
        { label: 'Desktop / v2', node: <Demo pageCount={args.pageCount} rowsPerPage={10} /> },
        {
          label: 'Desktop / v2-small',
          node: <Demo pageCount={args.pageCount} rowsPerPage={10} size="small" />,
        },
        { label: 'Mobile / v1', node: <Demo pageCount={args.pageCount} size="small" /> },
        {
          label: 'Mobile / v2',
          node: <Demo pageCount={args.pageCount} rowsPerPage={10} size="small" mobile />,
        },
      ]}
    />
  ),
};
