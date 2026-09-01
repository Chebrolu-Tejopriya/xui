import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import styles from './Drawer.module.css';
import { CloseIcon } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/** The axis a placement is thrown along, and the sign that dismisses it. */
const DRAG_AXIS: Record<DrawerPlacement, { axis: 'x' | 'y'; sign: 1 | -1 } | null> = {
  bottom: { axis: 'y', sign: 1 },
  right: { axis: 'x', sign: 1 },
  left: { axis: 'x', sign: -1 },
  full: null,
};

/** Past a quarter of its own size, a throw is a dismissal rather than a nudge. */
const DISMISS_FRACTION = 0.25;

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
   * Beyond Figma — the XUI file draws `bottom` as a sheet that hugs its
   * content — and approved by the designer: a fixed height, with the body
   * scrolling once the content outgrows it. That scrolling is the body's
   * `overflow-y: auto` plus `min-height: 0`; the header and footer are
   * `flex: none`, so only the middle moves.
   */
  height?: string;
  /** Class hooks for the parts `className` cannot reach. */
  classNames?: DrawerClassNames;
  /**
   * Swipe the panel away along its own axis — down for `bottom`, right for
   * `right`, left for `left`. On by default, as in the library this mirrors.
   *
   * Beyond Figma and approved by the designer. No gesture library: pointer
   * events, ~40 lines. It stays
   * out of the way of the things it would otherwise break — a drag starting in
   * a text field is ignored, and a scrollable body only hands over the gesture
   * once it is scrolled to the top, so a sheet full of content still scrolls.
   * `full` never drags; there is no edge to throw it towards.
   */
  draggable?: boolean;
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
  draggable = true,
  title = 'Menu',
  footer,
  className,
  children,
  ...rest
}: DrawerProps) {
  // ---- Swipe to dismiss -------------------------------------------------
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; from: number; scrolled: boolean } | null>(null);
  const [offset, setOffset] = useState(0);
  const axis = draggable ? DRAG_AXIS[placement] : null;

  const endDrag = useCallback(
    (commit: boolean) => {
      const panel = panelRef.current;
      const active = drag.current;
      drag.current = null;
      if (!panel || !active || !axis) return;
      const size = axis.axis === 'y' ? panel.offsetHeight : panel.offsetWidth;
      setOffset(0);
      if (commit && Math.abs(offset) > size * DISMISS_FRACTION) onClose();
    },
    [axis, offset, onClose],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!axis || e.button !== 0) return;
    const t = e.target as HTMLElement;
    // A drag starting in a field is the user selecting text, not throwing the
    // panel away.
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    // A scrollable body keeps the gesture until it is back at the top, so a
    // sheet full of content still scrolls.
    const scroller = t.closest<HTMLElement>(`.${styles.body}`);
    drag.current = {
      id: e.pointerId,
      from: axis.axis === 'y' ? e.clientY : e.clientX,
      scrolled: !!scroller && scroller.scrollTop > 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (!active || !axis || active.id !== e.pointerId || active.scrolled) return;
    const delta = (axis.axis === 'y' ? e.clientY : e.clientX) - active.from;
    // Only towards the edge it came from; the other way does nothing.
    const travelled = axis.sign === 1 ? Math.max(0, delta) : Math.min(0, delta);
    if (travelled !== 0) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setOffset(travelled);
    }
  };

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
        ref={panelRef}
        className={cx(styles.panel, styles[placement], offset !== 0 && styles.dragging, className)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => endDrag(true)}
        onPointerCancel={() => endDrag(false)}
        style={{
            ...(offset !== 0 ? { transform: `translate${axis?.axis === 'y' ? 'Y' : 'X'}(${offset}px)` } : null),
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
            <span className={cx(styles.title, classNames.title)}>{title}</span>
          </span>
          <span className={styles.headerActions}>
            {headingIcon && <span className={styles.headingIcon}>{headingIcon}</span>}
            <button type="button" className={cx(styles.close, classNames.closeIcon)} onClick={onClose} aria-label="Close menu">
              <CloseIcon size={24} />
            </button>
          </span>
        </div>
        <div className={styles.divider} />
        <div className={cx(styles.body, classNames.body)}>{children}</div>
        {footer && <div className={cx(styles.footer, classNames.footer)}>{footer}</div>}
      </div>
    </>,
    document.body,
  );
}
