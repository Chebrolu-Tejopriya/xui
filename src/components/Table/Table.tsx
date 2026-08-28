import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Table.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/** Horizontal alignment of a cell's content. */
export type TableAlign = 'start' | 'center' | 'end';

const alignClass: Record<TableAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
};

/**
 * Composable data-table primitives. Compose columns freely:
 *
 *   <Table>
 *     <TableHead>
 *       <TableRow>
 *         <TableHeaderCell width={40} align="center"><Checkbox /></TableHeaderCell>
 *         <TableHeaderCell width={174}>Client Name</TableHeaderCell>
 *         <TableHeaderCell>Status</TableHeaderCell>
 *       </TableRow>
 *     </TableHead>
 *     <TableBody>
 *       <TableRow selected>
 *         <TableCell width={40} align="center"><Checkbox checked /></TableCell>
 *         <TableCell width={174}>Rony Joseph</TableCell>
 *         <TableCell><Badge variant="label-info">Pending</Badge></TableCell>
 *       </TableRow>
 *     </TableBody>
 *   </Table>
 *
 * Cells with a `width` are fixed; cells without one share the remaining space
 * equally (flex: 1). Tokens: header `surface-secondary` + `border-secondary`
 * underline; rows `surface-raised`, `surface-secondary` on hover,
 * `surface-brand-secondary` when selected; `border-secondary` container border
 * + dividers; 8px radius; 52px row height.
 */
export function Table({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="table" className={cx(styles.table, className)} {...rest}>
      {children}
    </div>
  );
}

export function TableHead({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="rowgroup" className={cx(styles.head, className)} {...rest}>
      {children}
    </div>
  );
}

export function TableBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="rowgroup" className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Selected row — paints `surface-brand-secondary` (blue tint), distinct
   *  from the grey hover state. */
  selected?: boolean;
}

export function TableRow({ selected, className, children, ...rest }: TableRowProps) {
  return (
    <div
      role="row"
      data-selected={selected || undefined}
      className={cx(styles.row, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Column width in px. Omit for a flexible column (equal share). */
  width?: number;
  /**
   * Let the column grow past `width`, using it as the starting size rather
   * than a cap — Figma's "fill container". Columns then share the spare
   * space in proportion to their designed widths, so a wide column stays
   * wide. Without this, a row of equal-share columns gives every column the
   * same width and the long ones wrap, which breaks the 52px row height.
   */
  fill?: boolean;
  /** Horizontal alignment of the content. Defaults to `start`. */
  align?: TableAlign;
  children?: ReactNode;
}

function widthStyle(width?: number, fill?: boolean): CSSProperties {
  if (width == null) return { flex: '1 1 0', minWidth: 0 };
  // grow, never shrink: below the columns' combined width the table scrolls
  // rather than squeezing text into a wrap that breaks the 52px row.
  return fill ? { flex: `1 0 ${width}px`, minWidth: 0 } : { width, flex: '0 0 auto' };
}

export function TableCell({ width, fill, align = 'start', className, style, children, ...rest }: TableCellProps) {
  return (
    <div
      role="cell"
      className={cx(styles.cell, alignClass[align], className)}
      style={{ ...widthStyle(width, fill), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function TableHeaderCell({ width, fill, align = 'start', className, style, children, ...rest }: TableCellProps) {
  return (
    <div
      role="columnheader"
      className={cx(styles.headerCell, alignClass[align], className)}
      style={{ ...widthStyle(width, fill), ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Escalating priority meter — four bars of increasing height, `level` of them
 * filled in the level's color (the rest `surface-tertiary`):
 *  1 low (grey) · 2 (purple) · 3 (orange) · 4 critical (red).
 */
export type PriorityLevel = 1 | 2 | 3 | 4;

export interface PriorityMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  level?: PriorityLevel;
}

const PRIORITY_BARS: { h: number; w: number }[] = [
  { h: 8.235, w: 3.137 },
  { h: 11.16, w: 3.137 },
  { h: 15.08, w: 3.137 },
  { h: 19, w: 3 },
];

const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  1: 'var(--label-neutral-content)',
  2: 'var(--label-accent-content)',
  3: 'var(--surface-warning-primary)',
  4: 'var(--surface-error-primary)',
};

export function PriorityMeter({ level = 1, className, ...rest }: PriorityMeterProps) {
  const color = PRIORITY_COLOR[level];
  return (
    <div
      className={cx(styles.priority, className)}
      role="img"
      aria-label={`Priority ${level} of 4`}
      {...rest}
    >
      {PRIORITY_BARS.map((bar, i) => (
        <span
          key={i}
          className={styles.bar}
          style={{
            height: bar.h,
            width: bar.w,
            background: i < level ? color : 'var(--surface-tertiary)',
          }}
        />
      ))}
    </div>
  );
}
