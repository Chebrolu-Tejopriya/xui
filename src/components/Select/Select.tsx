import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  className,
}: SelectProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : internal;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === selectedValue);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const pick = (v: string) => {
    setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          styles.trigger,
          open && styles.open,
          selected && styles.hasValue,
          loading && styles.loading,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.value}>{loading ? placeholder : (selected?.label ?? placeholder)}</span>
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {open && (
        <ul role="listbox" className={styles.menu}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === selectedValue}
                disabled={opt.disabled}
                className={[styles.option, opt.value === selectedValue && styles.optionSelected]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => pick(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
