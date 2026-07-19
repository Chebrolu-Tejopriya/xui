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
  /** Control height: large 42px, medium 36px, small 32px (icon-only squares: 36/32/30). */
  size?: ButtonSize;
  /** Shows a spinner (replacing any icons) and disables interaction. */
  loading?: boolean;
  /** Icon rendered before the label (18/16/14px per size, 6px gap). */
  iconLeft?: ReactNode;
  /** Icon rendered after the label. */
  iconRight?: ReactNode;
  /**
   * Figma "just icon" type: a fixed outline-styled square (white surface,
   * border, 36/32/30px per size) regardless of `variant`. Pass the icon as
   * `children`.
   */
  iconOnly?: boolean;
  /** Figma "just icon circle": fully-rounded, 44/40/38px per size. */
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
        {!loading && !iconOnly && iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        {(iconOnly ? !loading : children != null) && (
          <span className={styles.label}>{children}</span>
        )}
        {!loading && !iconOnly && iconRight && <span className={styles.icon}>{iconRight}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
