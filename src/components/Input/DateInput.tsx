import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

const CalendarIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 9.5h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
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
  /** Called when the calendar icon is clicked — wire this to your own date-picker overlay. */
  onCalendarClick?: () => void;
}

/**
 * XUI Input — `type=Date` variant. This renders the field chrome and calendar
 * icon from Figma but does not include a calendar picker overlay — wire
 * `onCalendarClick` to your own picker (e.g. a positioned popover) and pass
 * the formatted date in as `value`.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      mandatory = false,
      helperText,
      helperIcon,
      error = false,
      onCalendarClick,
      className,
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helperId = helperText != null ? `${inputId}-helper` : undefined;

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
        <div
          className={[styles.field, error && styles.error, disabled && styles.disabled]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="text"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={styles.input}
          />
          <button
            type="button"
            className={styles.toggleButton}
            disabled={disabled}
            onClick={onCalendarClick}
            aria-label="Open calendar"
          >
            {CalendarIcon}
          </button>
        </div>
        {helperText != null && (
          <p id={helperId} className={[styles.helper, error && styles.helperError].filter(Boolean).join(' ')}>
            {helperIcon && <span className={styles.helperIcon}>{helperIcon}</span>}
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';
