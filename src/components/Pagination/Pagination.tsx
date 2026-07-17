import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional rows-per-page control. */
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowsPerPageChange?: (rows: number) => void;
  /** Compact (mobile) sizing. */
  compact?: boolean;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50],
  onRowsPerPageChange,
  compact = false,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={[styles.root, compact && styles.compact, className].filter(Boolean).join(' ')}
    >
      {rowsPerPage != null && (
        <div className={styles.rows}>
          <span className={styles.rowsLabel}>Rows per page:</span>
          <select
            className={styles.rowsSelect}
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.group}>
        <label className={styles.pageCell}>
          <select
            className={styles.pageSelect}
            value={page}
            onChange={(e) => onPageChange(Number(e.target.value))}
            aria-label="Page"
          >
            {Array.from({ length: pageCount }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <span className={styles.pageCount}>of {pageCount} Pages</span>
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
