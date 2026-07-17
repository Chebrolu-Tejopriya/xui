import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './Dialog.module.css';

export type DialogVariant = 'default' | 'destructive' | 'alert';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Body copy. */
  description?: ReactNode;
  /** Extra content below the description. */
  children?: ReactNode;
  variant?: DialogVariant;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  /** Hide the top-right close icon. */
  hideClose?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  variant = 'default',
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  onConfirm,
  hideClose = false,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const confirmVariant =
    variant === 'destructive' ? 'destructive' : variant === 'alert' ? 'secondary' : 'primary';

  const confirm = (
    <Button variant={confirmVariant} size="large" fullWidth onClick={onConfirm}>
      {confirmLabel}
    </Button>
  );
  const cancel = (
    <Button variant="outline" size="large" fullWidth onClick={onClose}>
      {cancelLabel}
    </Button>
  );

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>{title}</h2>
        {description != null && <p className={styles.description}>{description}</p>}
        {children}
        <div className={styles.actions}>
          {variant === 'destructive' ? (
            <>
              {confirm}
              {cancel}
            </>
          ) : (
            <>
              {cancel}
              {confirm}
            </>
          )}
        </div>
        {!hideClose && (
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
