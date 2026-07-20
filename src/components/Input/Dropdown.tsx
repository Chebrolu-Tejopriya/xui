import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Input.module.css';
import menuStyles from '../Menu.module.css';

/* Figma Icons/Check (585:2470). */
const CheckIcon = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m2.5 8.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface DropdownOption {
  value: string;
  label: ReactNode;
  /** Optional leading icon — matches Figma's "dropdown with icon" type. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Field label. */
  label?: ReactNode;
  /** Marks the field as mandatory (red asterisk next to the label). */
  mandatory?: boolean;
  /** Helper text below the field; rendered in error color when `error` is set. */
  helperText?: ReactNode;
  /** Icon shown before the helper text. */
  helperIcon?: ReactNode;
  /** Error state: red ring + red helper text. */
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

/** XUI Input — `type=dropdown` / `type=dropdown with icon` variants: an Input-chrome trigger + option list. */
export function Dropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  label,
  mandatory = false,
  helperText,
  helperIcon,
  error = false,
  disabled = false,
  className,
}: DropdownProps) {
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const selectedValue = value !== undefined ? value : internal;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const inputId = autoId;
  const helperId = helperText != null ? `${inputId}-helper` : undefined;

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
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {label != null && (
        <label
          className={[styles.label, disabled && styles.labelDisabled].filter(Boolean).join(' ')}
          htmlFor={inputId}
        >
          {label}
          {mandatory && (
            <span className={styles.mandatory} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div ref={rootRef} className={styles.dropdownRoot}>
        <button
          type="button"
          id={inputId}
          className={[
            styles.field,
            styles.trigger,
            error && styles.error,
            disabled && styles.disabled,
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.valueGroup}>
            {selected?.icon && <span className={styles.leadingIcon}>{selected.icon}</span>}
            <span className={[styles.value, !selected && styles.placeholder].filter(Boolean).join(' ')}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
          <span className={styles.leadingChevron}>{ChevronDownIcon}</span>
        </button>
        {open && (
          <ul role="listbox" className={[menuStyles.menu, menuStyles.menuFullWidth].join(' ')}>
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    className={[menuStyles.item, isSelected && menuStyles.itemSelected]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => pick(opt.value)}
                  >
                    {isSelected && <span className={menuStyles.check}>{CheckIcon}</span>}
                    {opt.icon && <span className={styles.leadingIcon}>{opt.icon}</span>}
                    <span className={menuStyles.itemLabel}>{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {helperText != null && (
        <p id={helperId} className={[styles.helper, error && styles.helperError].filter(Boolean).join(' ')}>
          {helperIcon && <span className={styles.helperIcon}>{helperIcon}</span>}
          {helperText}
        </p>
      )}
    </div>
  );
}
