import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from './FileUpload';
import type { FileUploadProps, UploadedFile } from './FileUpload';
import { StateShowcase } from '../Input/storyLayout';

const sampleFiles: UploadedFile[] = [
  { name: 'Binance_TradeHistory_Document.csv' },
  { name: 'Binance_Deposits_and_Withdrawls.csv' },
];

/** Stateful wrapper: picking/dropping files adds rows, delete removes them. */
function Demo({ initialFiles = [], ...props }: Partial<FileUploadProps> & { initialFiles?: UploadedFile[] }) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  return (
    <FileUpload
      {...props}
      files={files}
      onFilesSelected={(picked) =>
        setFiles((cur) => {
          const next = picked.map((f) => ({ name: f.name }));
          return props.multiple ? [...cur, ...next] : next;
        })
      }
      onRemove={(i) => setFiles((cur) => cur.filter((_, idx) => idx !== i))}
    />
  );
}

const meta: Meta<typeof FileUpload> = {
  title: 'Components/File Upload',
  component: FileUpload,
  args: {
    title: 'Click or drag file to this area to upload',
    description: 'Files supported: Spot Trades, Deal Trades, Partial Fills, Deposit/Withdrawals',
    label: 'Upload File',
    compactText: 'Click to upload',
    disabled: false,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    label: { control: 'text' },
    compactText: { control: 'text' },
    variant: { control: false },
    files: { control: false },
    multiple: { control: false },
    onFilesSelected: { control: false },
    onRemove: { control: false },
  },
  parameters: {
    controls: { expanded: true },
    // Static source only — the dynamic JSX serializer hangs on matrix trees
    // (see Button.stories.tsx).
    docs: { source: { type: 'code' } },
  },
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

/* Figma Default frame (947:5469 / 5509 / 5471). */
export const Default: Story = {
  render: (args) => (
    <StateShowcase
      width={620}
      rows={[
        { label: 'Upload', node: <Demo {...args} /> },
        { label: 'Single file uploaded', node: <Demo {...args} initialFiles={[sampleFiles[0]]} /> },
        {
          label: 'Multiple files uploaded (list above dropzone)',
          node: <Demo {...args} multiple initialFiles={sampleFiles} />,
        },
      ]}
    />
  ),
};

/* Figma Compact frames (948:5359 / 5370 / 5389 / 5413). */
export const Compact: Story = {
  render: (args) => (
    <StateShowcase
      width={430}
      rows={[
        { label: 'Upload', node: <Demo {...args} variant="compact" /> },
        {
          label: 'Uploaded (single: box becomes the file row)',
          node: <Demo {...args} variant="compact" initialFiles={[sampleFiles[0]]} />,
        },
        {
          label: 'Multiple files',
          node: <Demo {...args} variant="compact" multiple initialFiles={sampleFiles} />,
        },
      ]}
    />
  ),
};
