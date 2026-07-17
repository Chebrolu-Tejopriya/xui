import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Toast.module.css';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: ToastVariant;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** 40px illustration/icon at the start. */
  icon?: ReactNode;
  /** Action button label; rendered as an outline button. */
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Show the close (×) control. */
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Toast({
  variant = 'default',
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  dismissible = false,
  onDismiss,
  className,
  ...rest
}: ToastProps) {
  return (
    <div
      role="status"
      className={[styles.toast, styles[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        {title != null && <p className={styles.title}>{title}</p>}
        {subtitle != null && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actionLabel != null && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {dismissible && (
        <button type="button" className={styles.close} aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
