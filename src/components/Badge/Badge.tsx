import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'accent-primary'
  | 'accent-secondary'
  | 'accent-positive'
  | 'accent-negative';

export type BadgeSize = 'default' | 'large';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Adds a border in the accent's primary color (accent variants only). */
  bordered?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  outline: styles.outline,
  destructive: styles.destructive,
  'accent-primary': styles.accentPrimary,
  'accent-secondary': styles.accentSecondary,
  'accent-positive': styles.accentPositive,
  'accent-negative': styles.accentNegative,
};

export function Badge({
  variant = 'primary',
  size = 'default',
  bordered = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={[
        styles.badge,
        variantClass[variant],
        size === 'large' && styles.large,
        bordered && styles.bordered,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </span>
  );
}
