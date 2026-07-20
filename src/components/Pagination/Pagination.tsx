import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './Pagination.module.css';
import menuStyles from '../Menu.module.css';

/* Figma icon/chevron-down & Icons/expand_more — both #334155 (content-secondary). */
const SelectChevron = (
  <svg viewBox="0 0 10 7" fill="none" aria-hidden="true">
    <path d="M8.825.5 5 4.317 1.175.5 0 1.675 5 6.675l5-5L8.825.5Z" fill="currentColor" />
  </svg>
);

/* Figma Icons/Check (585:2470) — leading icon of the selected menu item. */
const CheckIcon = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m2.5 8.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Trigger + Figma Select menu (583:4488) replacing the unstylable native popup. */
function MenuSelect({
  value,
  options,
  onChange,
  triggerClass,
  chevron,
  ariaLabel,
}: {
  value: number;
  options: number[];
  onChange: (v: number) => void;
  triggerClass: string;
  chevron: ReactNode;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selected = listRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    (selected ?? listRef.current?.querySelector('button'))?.focus();
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const items = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[Math.min(idx + 1, items.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[Math.max(idx - 1, 0)]?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <span ref={rootRef} className={styles.selectWrap}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {value}
        {chevron}
      </button>
      {open && (
        <ul role="listbox" className={menuStyles.menu} ref={listRef} onKeyDown={onMenuKeyDown}>
          {options.map((n) => {
            const selected = n === value;
            return (
              <li key={n}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[menuStyles.item, selected && menuStyles.itemSelected]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {selected && <span className={menuStyles.check}>{CheckIcon}</span>}
                  <span className={menuStyles.itemLabel}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
}

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional rows-per-page control (Figma Desktop/v2, v2-small, Mobile/v2). */
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowsPerPageChange?: (rows: number) => void;
  /** Cell height: medium 36px (Desktop v1/v2), small 32px (v2-small, Mobile). */
  size?: 'medium' | 'small';
  /**
   * Figma Mobile/v2 treatment: short "of N" label and borderless arrow
   * cells. Implies nothing about width — pair with `size="small"`.
   */
  mobile?: boolean;
  className?: string;
}

/** XUI Pagination — Figma variants Desktop/v1, Desktop/v2, Desktop/v2-small, Mobile/v1, Mobile/v2. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50],
  onRowsPerPageChange,
  size = 'medium',
  mobile = false,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={[styles.root, size === 'small' && styles.small, mobile && styles.mobile, className]
        .filter(Boolean)
        .join(' ')}
    >
      {rowsPerPage != null && (
        <div className={styles.rows}>
          <span className={styles.rowsLabel}>Rows per page:</span>
          <MenuSelect
            value={rowsPerPage}
            options={rowsPerPageOptions}
            onChange={(n) => onRowsPerPageChange?.(n)}
            triggerClass={styles.rowsSelect}
            chevron={<span className={[styles.selectChevron, styles.rowsChevron].join(' ')}>{SelectChevron}</span>}
            ariaLabel="Rows per page"
          />
        </div>
      )}
      <div className={styles.group}>
        <span className={styles.pageCell}>
          <MenuSelect
            value={page}
            options={Array.from({ length: pageCount }, (_, i) => i + 1)}
            onChange={onPageChange}
            triggerClass={styles.pageSelect}
            chevron={<span className={[styles.selectChevron, styles.pageChevron].join(' ')}>{SelectChevron}</span>}
            ariaLabel="Page"
          />
        </span>
        <span className={styles.pageCount}>{mobile ? `of ${pageCount}` : `of ${pageCount} Pages`}</span>
        <button
          type="button"
          className={styles.arrow}
          disabled={page <= 1}
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={[styles.arrow, styles.arrowLast].join(' ')}
          disabled={page >= pageCount}
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
