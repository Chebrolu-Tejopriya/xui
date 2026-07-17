import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

const ChevronDownIcon = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface PhoneInputProps
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
  /** Country flag/icon shown in the leading badge. */
  countryFlag?: ReactNode;
  /** Dialing code text, e.g. "+91". */
  countryCode: string;
  /**
   * Called when the country badge is clicked. This renders the badge as a
   * static display by default (matching Figma) — pass this to wire your own
   * country picker; the chevron is purely a visual affordance either way.
   */
  onCountryClick?: () => void;
}

/** XUI Input — `type=Mobile Number` variant: country-code badge + number field. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      mandatory = false,
      helperText,
      helperIcon,
      error = false,
      countryFlag,
      countryCode,
      onCountryClick,
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
          className={[styles.field, styles.fieldFlush, error && styles.error, disabled && styles.disabled]
            .filter(Boolean)
            .join(' ')}
        >
          {onCountryClick ? (
            <button
              type="button"
              className={[styles.leadingBadge, styles.trigger, disabled && styles.leadingBadgeDisabled]
                .filter(Boolean)
                .join(' ')}
              disabled={disabled}
              onClick={onCountryClick}
            >
              {countryFlag && (
                <span className={[styles.leadingIcon, disabled && styles.leadingIconMuted].filter(Boolean).join(' ')}>
                  {countryFlag}
                </span>
              )}
              {countryCode}
              <span className={styles.leadingChevron}>{ChevronDownIcon}</span>
            </button>
          ) : (
            <span className={[styles.leadingBadge, disabled && styles.leadingBadgeDisabled].filter(Boolean).join(' ')}>
              {countryFlag && (
                <span className={[styles.leadingIcon, disabled && styles.leadingIconMuted].filter(Boolean).join(' ')}>
                  {countryFlag}
                </span>
              )}
              {countryCode}
            </span>
          )}
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="numeric"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={[styles.input, styles.flushInput].join(' ')}
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

PhoneInput.displayName = 'PhoneInput';
