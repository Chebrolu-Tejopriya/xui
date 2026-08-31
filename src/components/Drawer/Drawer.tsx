import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Drawer.module.css';
import { CloseIcon } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type DrawerPlacement = 'right' | 'left' | 'bottom' | 'full';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  /** Header text. Figma shows "Menu". */
  title?: ReactNode;
  /** Pinned below the list — the theme switcher and profile, as the rail has. */
  footer?: ReactNode;
  children?: ReactNode;
  /**
   * Where the panel sits. `right` (default) is the existing mobile-nav
   * geometry; `left`, `bottom` and `full` come from the XUI file's Drawer
   * section (1416:47417), where `bottom` is a sheet that hugs its content.
   */
  placement?: DrawerPlacement;
}

/**
 * Mobile navigation panel — 320px from the right, over a scrim.
 *
 *   <Drawer open={open} onClose={close} title="Menu" footer={<Profile />}>
 *     <SidebarItem icon={OverviewIcon} label="Overview" selected />
 *   </Drawer>
 *
 * Holds `SidebarItem`s unchanged: Figma draws the same 36px rows, 8px apart,
 * with the same tapered brand rail on the selected one, so the rail's item is
 * the drawer's item.
 *
 * Beyond the design, and therefore ours: it closes on the scrim, on Escape, and
 * locks body scroll while open. Figma cannot express any of that — see ADR 0012
 * for the same reasoning applied to the collapsed rail's flyout.
 */
export function Drawer({
  open,
  onClose,
  placement = 'right',
  title = 'Menu',
  footer,
  className,
  children,
  ...rest
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // A drawer over a scrolling page that still scrolls behind is disorienting.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Navigation'}
        className={cx(styles.panel, styles[placement], className)}
        {...rest}
      >
        <div className={styles.header}>
          <span>{title}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
            <CloseIcon size={24} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>,
    document.body,
  );
}
