import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'subtle'
  | 'ghost'
  | 'link';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to XUI Button `type` variants. */
  variant?: ButtonVariant;
  /** Control height: large 42px, medium 36px, small 32px. */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Icon rendered before the label. */
  iconLeft?: ReactNode;
  /** Icon rendered after the label. */
  iconRight?: ReactNode;
  /** Square icon-only button. Pass the icon as `children`. */
  iconOnly?: boolean;
  /** With `iconOnly`, renders a fully-rounded (circle) button. */
  circle?: boolean;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  children?: ReactNode;
}

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      iconLeft,
      iconRight,
      iconOnly = false,
      circle = false,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        data-loading={loading || undefined}
        className={cx(
          styles.button,
          styles[variant],
          styles[size],
          iconOnly && styles.iconOnly,
          circle && styles.circle,
          fullWidth && styles.fullWidth,
          className,
        )}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {!iconOnly && iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        {children != null && <span className={styles.label}>{children}</span>}
        {!iconOnly && iconRight && <span className={styles.icon}>{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
