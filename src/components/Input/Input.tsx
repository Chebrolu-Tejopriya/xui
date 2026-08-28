import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field label. */
  label?: ReactNode;
  /** Marks the field as mandatory (red asterisk next to the label). */
  mandatory?: boolean;
  /** Helper text below the field; rendered in error color when `error` is set. */
  helperText?: ReactNode;
  /** Icon shown before the helper text. */
  helperIcon?: ReactNode;
  /** Error state: red border + red helper text. */
  error?: boolean;
  /** Element rendered at the end of the field (icon, button…). */
  trailing?: ReactNode;
  /** Element rendered at the start of the field. */
  leading?: ReactNode;
  /**
   * Field height. `medium` (48px) is the library's Input_v2 spec and the
   * default. `small` (44px) is the height the dashboard's filter bar uses, so
   * the search sits level with the 44px selects beside it.
   */
  size?: 'medium' | 'small';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      mandatory = false,
      helperText,
      helperIcon,
      error = false,
      trailing,
      leading,
      size = 'medium',
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
          className={[styles.field, styles[size], error && styles.error, disabled && styles.disabled]
            .filter(Boolean)
            .join(' ')}
        >
          {leading && <span className={styles.adornment}>{leading}</span>}
          <input
            {...rest}
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={styles.input}
          />
          {trailing && <span className={styles.adornment}>{trailing}</span>}
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

Input.displayName = 'Input';
