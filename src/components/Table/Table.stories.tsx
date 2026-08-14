import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  PriorityMeter,
} from './Table';
import type { PriorityLevel } from './Table';
import { Checkbox } from '../Checkbox';
import { Badge } from '../Badge';
import type { BadgeVariant } from '../Badge';
import { AddUserIcon } from '../../icons';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
};
export default meta;

type Filing = {
  id: string;
  client: string;
  plan: string;
  status: 'Pending' | 'In Progress' | 'Done' | 'Report Issue';
  priority: PriorityLevel;
  filingType: 'Only Spot' | 'Derivatives';
  assignedTo: string;
  assignedOn: string;
};

const STATUS_VARIANT: Record<Filing['status'], BadgeVariant> = {
  Pending: 'label-neutral',
  'In Progress': 'label-info',
  Done: 'label-positive',
  'Report Issue': 'label-negative',
};

const FILING_VARIANT: Record<Filing['filingType'], BadgeVariant> = {
  'Only Spot': 'label-warning',
  Derivatives: 'label-accent',
};

const COLS = { select: 40, client: 174, plan: 238, actions: 100 } as const;

/** Two context rows so the playground reads as a real table. */
const SAMPLE: Filing[] = [
  { id: 'a', client: 'Amir Hassan', plan: 'Comprehensive ITR Filing', status: 'Pending', priority: 3, filingType: 'Derivatives', assignedTo: 'Meera Iyer', assignedOn: '18 Aug 2026' },
  { id: 'b', client: 'Marcus Johnson', plan: 'Salary ITR Filing', status: 'Done', priority: 2, filingType: 'Only Spot', assignedTo: 'Sneha Kapoor', assignedOn: '03 Sep 2026' },
];

/** Vertical 3-dot "more" affordance (no exact match in the icon set yet). */
function MoreVert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="5" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="19" r="1.7" fill="currentColor" />
    </svg>
  );
}

function RowActions() {
  return (
    <span style={{ display: 'inline-flex', gap: 16, alignItems: 'center', color: 'var(--content-tertiary)' }}>
      <AddUserIcon size={18} aria-label="Assign" />
      <MoreVert />
    </span>
  );
}

function FilingHeader({ someChecked }: { someChecked: boolean }) {
  return (
    <TableHead>
      <TableRow>
        <TableHeaderCell width={COLS.select} align="center">
          <Checkbox indeterminate={someChecked} aria-label="Select all" readOnly />
        </TableHeaderCell>
        <TableHeaderCell width={COLS.client}>Client Name</TableHeaderCell>
        <TableHeaderCell width={COLS.plan}>Plan</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell align="center">Priority</TableHeaderCell>
        <TableHeaderCell>Filing Type</TableHeaderCell>
        <TableHeaderCell>Assigned To</TableHeaderCell>
        <TableHeaderCell>Assigned On</TableHeaderCell>
        <TableHeaderCell width={COLS.actions} />
      </TableRow>
    </TableHead>
  );
}

function FilingRow({ row, checked }: { row: Filing; checked: boolean }) {
  return (
    <TableRow selected={checked}>
      <TableCell width={COLS.select} align="center">
        <Checkbox checked={checked} readOnly aria-label={`Select ${row.client}`} />
      </TableCell>
      <TableCell width={COLS.client}>{row.client}</TableCell>
      <TableCell width={COLS.plan}>{row.plan}</TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      </TableCell>
      <TableCell align="center">
        <PriorityMeter level={row.priority} />
      </TableCell>
      <TableCell>
        <Badge variant={FILING_VARIANT[row.filingType]}>{row.filingType}</Badge>
      </TableCell>
      <TableCell>{row.assignedTo}</TableCell>
      <TableCell>{row.assignedOn}</TableCell>
      <TableCell width={COLS.actions} align="center">
        <RowActions />
      </TableCell>
    </TableRow>
  );
}

type PlaygroundArgs = {
  selected: boolean;
  priority: PriorityLevel;
  status: Filing['status'];
  filingType: Filing['filingType'];
};

/** Configure the first row live — selection (blue), priority level, status &
 *  filing pills — with two context rows below it. */
export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    selected: { control: 'boolean' },
    priority: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4] },
    status: { control: { type: 'select' }, options: ['Pending', 'In Progress', 'Done', 'Report Issue'] },
    filingType: { control: { type: 'inline-radio' }, options: ['Only Spot', 'Derivatives'] },
  },
  args: { selected: true, priority: 1, status: 'In Progress', filingType: 'Derivatives' },
  render: (args) => (
    <Table>
      <FilingHeader someChecked={args.selected} />
      <TableBody>
        <FilingRow
          row={{
            id: 'x',
            client: 'Rony Joseph',
            plan: 'Comprehensive ITR Filing',
            status: args.status,
            priority: args.priority,
            filingType: args.filingType,
            assignedTo: 'James Smith',
            assignedOn: '30 Jul 2026',
          }}
          checked={args.selected}
        />
        {SAMPLE.map((row) => (
          <FilingRow key={row.id} row={row} checked={false} />
        ))}
      </TableBody>
    </Table>
  ),
  parameters: { docs: { source: { type: 'code' } } },
};

/** Row states + the four priority levels + empty & loading, stacked. */
export const States: StoryObj = {
  render: () => {
    const label = (t: string) => (
      <p style={{ font: 'var(--type-subtitle-3)', color: 'var(--content-tertiary)', margin: '20px 0 6px' }}>{t}</p>
    );
    const miniHeader = (
      <TableHead>
        <TableRow>
          <TableHeaderCell width={COLS.select} align="center">
            <Checkbox aria-label="Select all" readOnly />
          </TableHeaderCell>
          <TableHeaderCell width={COLS.client}>Client Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="center">Priority</TableHeaderCell>
        </TableRow>
      </TableHead>
    );
    const miniRow = (opts: { selected?: boolean }) => (
      <TableRow selected={opts.selected}>
        <TableCell width={COLS.select} align="center">
          <Checkbox checked={opts.selected} readOnly aria-label="row" />
        </TableCell>
        <TableCell width={COLS.client}>Rony Joseph</TableCell>
        <TableCell>
          <Badge variant="label-info">Pending</Badge>
        </TableCell>
        <TableCell align="center">
          <PriorityMeter level={2} />
        </TableCell>
      </TableRow>
    );
    return (
      <div style={{ maxWidth: 560 }}>
        {label('Default · Selected (blue) · hover a row for the grey state')}
        <Table>
          {miniHeader}
          <TableBody>
            {miniRow({})}
            {miniRow({ selected: true })}
            {miniRow({})}
          </TableBody>
        </Table>

        {label('Priority levels — 1 low → 4 critical')}
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end', padding: '8px 4px' }}>
          {([1, 2, 3, 4] as PriorityLevel[]).map((l) => (
            <span key={l} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <PriorityMeter level={l} />
              <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>{l}</span>
            </span>
          ))}
        </div>

        {label('Empty')}
        <Table>
          {miniHeader}
          <TableBody>
            <TableRow>
              <TableCell align="center" style={{ flex: '1 1 0', color: 'var(--content-tertiary)', font: 'var(--type-body-2)' }}>
                No filings yet
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {label('Loading')}
        <Table>
          {miniHeader}
          <TableBody>
            {[0, 1, 2].map((i) => (
              <TableRow key={i}>
                <TableCell width={COLS.select} align="center">
                  <Skeleton w={20} />
                </TableCell>
                <TableCell width={COLS.client}>
                  <Skeleton w={110} />
                </TableCell>
                <TableCell>
                  <Skeleton w={72} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton w={24} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
  parameters: { docs: { source: { type: 'code' } } },
};

function Skeleton({ w }: { w: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: w,
        height: 12,
        borderRadius: 'var(--radius-xs)',
        background: 'var(--surface-tertiary)',
      }}
    />
  );
}
