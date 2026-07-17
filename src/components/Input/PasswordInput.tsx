import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Field label. */
  label?: ReactNode;
  /** Marks the field as mandatory (red asterisk next to the label). */
  mandatory?: boolean;
  /** "Forgot password?" link rendered opposite the label. Omit to hide it. */
  forgotPasswordLabel?: ReactNode;
  onForgotPassword?: () => void;
  forgotPasswordHref?: string;
  /** Helper text below the field; rendered in error color when `error` is set. */
  helperText?: ReactNode;
  /** Icon shown before the helper text. */
  helperIcon?: ReactNode;
  /** Error state: red ring + red helper text. */
  error?: boolean;
}

/** XUI Input — `type=password` variant (login password: no reveal toggle, optional "Forgot password?" link). */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      mandatory = false,
      forgotPasswordLabel,
      onForgotPassword,
      forgotPasswordHref,
      helperText,
      helperIcon,
      error = false,
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
        {(label != null || forgotPasswordLabel != null) && (
          <div className={styles.labelRow}>
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
            {forgotPasswordLabel != null &&
              (forgotPasswordHref ? (
                <a href={forgotPasswordHref} className={styles.forgotLink}>
                  {forgotPasswordLabel}
                </a>
              ) : (
                <button type="button" className={styles.forgotLink} onClick={onForgotPassword}>
                  {forgotPasswordLabel}
                </button>
              ))}
          </div>
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
            type="password"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={styles.input}
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

PasswordInput.displayName = 'PasswordInput';
