import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Drawer.module.css';
import { CloseIcon } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type DrawerPlacement = 'right' | 'left' | 'bottom' | 'full';

export interface DrawerClassNames {
  titleWrapper?: string;
  title?: string;
  closeIcon?: string;
  body?: string;
  footer?: string;
}

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
  /** A glyph before the title, in the header. */
  headingIcon?: ReactNode;
  /**
   * Blur the scrim behind the panel. Off by default, as in the library this
   * mirrors. The amount is `--blur-locked` (16px) — the only blur value the
   * token set defines, reused rather than inventing a second one.
   */
  overlayBlur?: boolean;
  /** Override the placement's width, e.g. "480px" or "40vw". Ignored by `bottom` and `full`, which span their axis. */
  width?: string;
  /**
   * Override the placement's height, e.g. "320px" or "100%".
   *
   * BEYOND FIGMA. The XUI file draws `bottom` as a sheet that hugs its
   * content; this exists because the library KoinX developers already use
   * distinguishes a fixed-height bottom drawer from a full-height one, and a
   * sheet that can only hug cannot express either.
   */
  height?: string;
  /** Class hooks for the parts `className` cannot reach. */
  classNames?: DrawerClassNames;
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
  headingIcon,
  overlayBlur = false,
  width,
  height,
  classNames = {},
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
      <div
        className={cx(styles.scrim, overlayBlur && styles.scrimBlur)}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Navigation'}
        className={cx(styles.panel, styles[placement], className)}
        style={{
            ...(width ? { width } : null),
            // An explicit height also lifts the sheet's 90vh cap — otherwise
            // height="100%" silently renders at 90% and looks like a bug in
            // the caller's CSS rather than a default here.
            ...(height ? { height, maxHeight: 'none' } : null),
            ...rest.style,
          }}
        {...rest}
      >
        <div className={styles.header}>
          <span className={cx(styles.titleWrapper, classNames.titleWrapper)}>
            {headingIcon && <span className={styles.headingIcon}>{headingIcon}</span>}
            <span className={cx(styles.title, classNames.title)}>{title}</span>
          </span>
          <button type="button" className={cx(styles.close, classNames.closeIcon)} onClick={onClose} aria-label="Close menu">
            <CloseIcon size={24} />
          </button>
        </div>
        <div className={cx(styles.body, classNames.body)}>{children}</div>
        {footer && <div className={cx(styles.footer, classNames.footer)}>{footer}</div>}
      </div>
    </>,
    document.body,
  );
}
