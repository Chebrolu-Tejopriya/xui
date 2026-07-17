import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

const ChevronDownIcon = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface AmountInputProps
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
  /** Currency/crypto logo shown in the leading badge. */
  currencyIcon?: ReactNode;
  /** Currency code text, e.g. "USD" or "ETH". */
  currencyCode: string;
  /**
   * `false` renders the Figma "Amount-Static" variant: no chevron, muted
   * badge/value colors, and the field is forced read-only — for displaying
   * a computed/converted amount rather than collecting input.
   */
  interactive?: boolean;
  onCurrencyClick?: () => void;
}

/** XUI Input — `type=Amount` / `type=Amount-Static` variants: currency badge + numeric field. */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      label,
      mandatory = false,
      helperText,
      helperIcon,
      error = false,
      currencyIcon,
      currencyCode,
      interactive = true,
      onCurrencyClick,
      className,
      id,
      disabled,
      readOnly,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helperId = helperText != null ? `${inputId}-helper` : undefined;
    const isStatic = !interactive;

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
          {isStatic ? (
            <span className={[styles.leadingBadge, styles.leadingBadgeMuted].filter(Boolean).join(' ')}>
              {currencyIcon && <span className={styles.leadingIcon}>{currencyIcon}</span>}
              {currencyCode}
            </span>
          ) : onCurrencyClick ? (
            <button
              type="button"
              className={[styles.leadingBadge, styles.trigger].filter(Boolean).join(' ')}
              disabled={disabled}
              onClick={onCurrencyClick}
            >
              {currencyIcon && <span className={styles.leadingIcon}>{currencyIcon}</span>}
              {currencyCode}
              <span className={styles.leadingChevron}>{ChevronDownIcon}</span>
            </button>
          ) : (
            <span className={styles.leadingBadge}>
              {currencyIcon && <span className={styles.leadingIcon}>{currencyIcon}</span>}
              {currencyCode}
              <span className={styles.leadingChevron}>{ChevronDownIcon}</span>
            </span>
          )}
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            readOnly={isStatic || readOnly}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={[styles.input, isStatic && styles.placeholder].filter(Boolean).join(' ')}
          />
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

AmountInput.displayName = 'AmountInput';
