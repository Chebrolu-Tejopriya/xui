import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

const EyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const EyeOffIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export interface SecretInputProps
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
  /** Controlled reveal state. Omit to let the component manage it internally. */
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
}

/** XUI Input — `type=Password API Key Secret Key` variant: masked value with a show/hide toggle. */
export const SecretInput = forwardRef<HTMLInputElement, SecretInputProps>(
  (
    {
      label,
      mandatory = false,
      helperText,
      helperIcon,
      error = false,
      revealed,
      defaultRevealed = false,
      onRevealChange,
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
    const [internalRevealed, setInternalRevealed] = useState(defaultRevealed);
    const isRevealed = revealed ?? internalRevealed;

    const toggle = () => {
      const next = !isRevealed;
      setInternalRevealed(next);
      onRevealChange?.(next);
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
        <div
          className={[styles.field, error && styles.error, disabled && styles.disabled]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type={isRevealed ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={styles.input}
          />
          <button
            type="button"
            className={styles.toggleButton}
            disabled={disabled}
            onClick={toggle}
            aria-label={isRevealed ? 'Hide value' : 'Show value'}
            aria-pressed={isRevealed}
          >
            {isRevealed ? EyeOffIcon : EyeIcon}
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

SecretInput.displayName = 'SecretInput';
