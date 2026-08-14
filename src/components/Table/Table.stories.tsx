import { useState } from 'react';
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

// —— sample data (KoinX filings) ————————————————————————————————————————
type Filing = {
  id: string;
  client: string;
  plan: string;
  status: 'Pending' | 'In Progress' | 'Done' | 'KoinX Report Issue';
  priority: PriorityLevel;
  filingType: 'Only Spot' | 'Derivatives';
  assignedTo: string;
  assignedOn: string;
};

const FILINGS: Filing[] = [
  { id: '1', client: 'Amir Hassan', plan: 'Comprehensive ITR Filing', status: 'Pending', priority: 3, filingType: 'Derivatives', assignedTo: 'Meera Iyer', assignedOn: '18 Aug 2026' },
  { id: '2', client: 'Laura Fitzgerald', plan: 'Crypto ITR Filing', status: 'In Progress', priority: 1, filingType: 'Only Spot', assignedTo: 'Karan Nair', assignedOn: '12 Jul 2026' },
  { id: '3', client: 'Marcus Johnson', plan: 'Salary ITR Filing', status: 'Done', priority: 2, filingType: 'Only Spot', assignedTo: 'Sneha Kapoor', assignedOn: '03 Sep 2026' },
  { id: '4', client: 'James Chen', plan: 'Salary ITR Filing', status: 'Pending', priority: 4, filingType: 'Only Spot', assignedTo: 'Arjun Mehta', assignedOn: '22 Jul 2026' },
  { id: '5', client: 'Natalie Brooks', plan: 'Crypto ITR Filing', status: 'Done', priority: 1, filingType: 'Derivatives', assignedTo: 'Vikram Patel', assignedOn: '05 Sep 2026' },
  { id: '6', client: 'Olivia Patel', plan: 'Comprehensive ITR Filing', status: 'Pending', priority: 3, filingType: 'Only Spot', assignedTo: 'James Smith', assignedOn: '30 Jul 2026' },
  { id: '7', client: 'Elena Rodriguez', plan: 'Comprehensive ITR Filing', status: 'KoinX Report Issue', priority: 4, filingType: 'Only Spot', assignedTo: 'Rahul Verma', assignedOn: '11 Aug 2026' },
  { id: '8', client: 'David Kim', plan: 'Crypto ITR Filing', status: 'Pending', priority: 2, filingType: 'Only Spot', assignedTo: 'Anita Desai', assignedOn: '27 Aug 2026' },
  { id: '9', client: 'Sarah Mitchell', plan: 'Salary ITR Filing', status: 'Pending', priority: 1, filingType: 'Only Spot', assignedTo: 'Priya Sharma', assignedOn: '15 Aug 2026' },
];

const STATUS_VARIANT: Record<Filing['status'], BadgeVariant> = {
  Pending: 'label-neutral',
  'In Progress': 'label-info',
  Done: 'label-positive',
  'KoinX Report Issue': 'label-negative',
};

const FILING_VARIANT: Record<Filing['filingType'], BadgeVariant> = {
  'Only Spot': 'label-warning',
  Derivatives: 'label-accent',
};

const COLS = {
  select: 40,
  client: 174,
  plan: 238,
  actions: 100,
} as const;

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

function FilingHeader({
  allChecked,
  someChecked,
  onToggleAll,
}: {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
}) {
  return (
    <TableHead>
      <TableRow>
        <TableHeaderCell width={COLS.select} align="center">
          <Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onChange={onToggleAll} aria-label="Select all" />
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

function FilingRow({
  row,
  checked,
  onToggle,
}: {
  row: Filing;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TableRow selected={checked}>
      <TableCell width={COLS.select} align="center">
        <Checkbox checked={checked} onChange={onToggle} aria-label={`Select ${row.client}`} />
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

// —— Stories ————————————————————————————————————————————————————————————

function KoinXFilingsDemo() {
  const [sel, setSel] = useState<Set<string>>(() => new Set(['2', '8']));
  const allChecked = sel.size === FILINGS.length;
  const someChecked = sel.size > 0;
  const toggleAll = () =>
    setSel((s) => (s.size === FILINGS.length ? new Set() : new Set(FILINGS.map((f) => f.id))));
  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  return (
    <Table>
      <FilingHeader allChecked={allChecked} someChecked={someChecked} onToggleAll={toggleAll} />
      <TableBody>
        {FILINGS.map((row) => (
          <FilingRow key={row.id} row={row} checked={sel.has(row.id)} onToggle={() => toggle(row.id)} />
        ))}
      </TableBody>
    </Table>
  );
}

/** The KoinX filings table — header, selectable rows, status & filing-type
 *  label pills, escalating priority meters, row actions. */
export const KoinXFilings: StoryObj = {
  render: () => <KoinXFilingsDemo />,
  parameters: { docs: { source: { type: 'code' } } },
};

type PlaygroundArgs = {
  selected: boolean;
  priority: PriorityLevel;
  status: Filing['status'];
  filingType: Filing['filingType'];
};

/** Configure a single row live — selection, priority level, status pill. */
export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    selected: { control: 'boolean' },
    priority: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4] },
    status: {
      control: { type: 'select' },
      options: ['Pending', 'In Progress', 'Done', 'KoinX Report Issue'],
    },
    filingType: { control: { type: 'inline-radio' }, options: ['Only Spot', 'Derivatives'] },
  },
  args: { selected: true, priority: 3, status: 'In Progress', filingType: 'Derivatives' },
  render: (args) => (
    <Table>
      <FilingHeader allChecked={false} someChecked={args.selected} onToggleAll={() => {}} />
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
          onToggle={() => {}}
        />
      </TableBody>
    </Table>
  ),
  parameters: { docs: { source: { type: 'code' } } },
};

/** Every row state + the four priority levels + empty & loading, stacked. */
export const States: StoryObj = {
  render: () => {
    const label = (t: string) => (
      <p style={{ font: 'var(--type-subtitle-3)', color: 'var(--content-tertiary)', margin: '20px 0 6px' }}>{t}</p>
    );
    const miniHeader = (
      <TableHead>
        <TableRow>
          <TableHeaderCell width={COLS.select} align="center">
            <Checkbox aria-label="Select all" />
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
        {label('Default · Selected · (hover the first row)')}
        <Table>
          {miniHeader}
          <TableBody>
            {miniRow({})}
            {miniRow({ selected: true })}
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
