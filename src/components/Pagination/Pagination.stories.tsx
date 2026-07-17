import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
};
export default meta;

type Story = StoryObj<typeof Pagination>;

function Demo({ withRows, compact }: { withRows?: boolean; compact?: boolean }) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  return (
    <Pagination
      page={page}
      pageCount={10}
      onPageChange={setPage}
      compact={compact}
      {...(withRows ? { rowsPerPage: rows, onRowsPerPageChange: setRows } : {})}
    />
  );
}

export const Default: Story = { render: () => <Demo /> };
export const WithRowsPerPage: Story = { render: () => <Demo withRows /> };
export const Compact: Story = { render: () => <Demo withRows compact /> };
