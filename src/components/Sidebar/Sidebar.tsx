import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ComponentType, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react';
import styles from './Sidebar.module.css';
import type { IconProps } from '../../icons';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

type Ctx = {
  collapsed: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  /** Which item is currently showing a collapsed overlay — at most one. */
  hoverId: string | null;
  setHoverId: Dispatch<SetStateAction<string | null>>;
};
const SidebarContext = createContext<Ctx>({
  collapsed: false, openId: null, setOpenId: () => {}, hoverId: null, setHoverId: () => {},
});

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Rail mode — 61px, icons only. Expanded is 224px. */
  collapsed?: boolean;
  /**
   * Show the collapse/expand pull-tab on the right edge. Omit it and no tab
   * renders — some apps drive collapse from elsewhere.
   */
  onToggleCollapsed?: () => void;
  /** Label of the sub-list open on first render (e.g. deep-linking a section). */
  defaultOpenId?: string;
  children?: ReactNode;
}

/**
 * App navigation rail.
 *
 *   <Sidebar collapsed={collapsed} onToggleCollapsed={toggle}>
 *     <SidebarHeader>…logo…</SidebarHeader>
 *     <SidebarNav>
 *       <SidebarItem icon={OverviewIcon} label="Home" selected />
 *       <SidebarItem icon={WalletIcon} label="Data Sources">
 *         <SidebarSubItem label="Integrations" />
 *       </SidebarItem>
 *     </SidebarNav>
 *     <SidebarFooter>…</SidebarFooter>
 *   </Sidebar>
 *
 * 224px expanded / 61px collapsed, `surface-raised` with a `border-tertiary`
 * right edge. Items are 36px tall; selected paints `surface-brand-secondary`
 * with a tapered `content-brand-primary` rail and a brand-toned icon.
 *
 * Sub-lists behave as an accordion — opening one closes the others. Collapsed,
 * hovering any item names it in a tooltip, and clicking one that has sub-items
 * opens them in a flyout panel. The two are mutually exclusive: the flyout
 * dismisses on click-away, on moving to another item, or on leaving the rail.
 */
export function Sidebar({
  collapsed = false,
  onToggleCollapsed,
  defaultOpenId,
  className,
  children,
  onMouseLeave,
  ...rest
}: SidebarProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // A collapsed flyout is click-opened, so it needs a click-away to close.
  // Clicks inside the panel don't count: it renders within the nav subtree.
  useEffect(() => {
    if (!collapsed || openId === null) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [collapsed, openId]);
  return (
    <SidebarContext.Provider value={{ collapsed, openId, setOpenId, hoverId, setHoverId }}>
      <nav
        ref={navRef}
        className={cx(styles.sidebar, collapsed && styles.collapsed, className)}
        data-collapsed={collapsed || undefined}
        onMouseLeave={(e) => {
          // A collapsed flyout is click-opened, so leaving the rail dismisses
          // it — otherwise returning to that item shows a stale overlay where
          // its tooltip belongs. The panel is `fixed` but still a DOM
          // descendant, so this does not fire while the pointer is inside it.
          if (collapsed) setOpenId(null);
          onMouseLeave?.(e);
        }}
        {...rest}
      >
        {children}
        {onToggleCollapsed && (
          <button
            type="button"
            className={styles.toggle}
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
          </button>
        )}
      </nav>
    </SidebarContext.Provider>
  );
}

export function SidebarHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

/** Scrollable list of items; takes the space between header and footer. */
export function SidebarNav({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.nav, className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.footer, className)} {...rest}>
      {children}
    </div>
  );
}

export interface SidebarItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * The icon component itself (not an element) — the item picks the tone:
   * `dualtone` normally, `dualtone-selected` when selected.
   */
  icon?: ComponentType<IconProps>;
  label: string;
  selected?: boolean;
  /** Sub-items. Expanded: an indented list. Collapsed: a click-opened flyout. */
  children?: ReactNode;
}

export function SidebarItem({
  icon: Icon,
  label,
  selected = false,
  children,
  className,
  onClick,
  ...rest
}: SidebarItemProps) {
  const { collapsed, openId, setOpenId, hoverId, setHoverId } = useContext(SidebarContext);
  const ref = useRef<HTMLButtonElement>(null);
  /**
   * Collapsed overlays are positioned `fixed` from the trigger's rect rather
   * than absolutely. The nav is a scroll container, and an absolutely
   * positioned child cannot escape one — which is also why the shared Tooltip
   * component isn't reused here. The bubble below uses its tokens so the two
   * look identical.
   */
  const [rect, setRect] = useState<DOMRect | null>(null);
  // Idempotent on purpose. `getBoundingClientRect()` returns a fresh object
  // every call, so an unguarded setRect re-renders on every mouseenter — and
  // the browser re-fires mouseenter whenever the DOM under the cursor changes.
  const show = () => {
    if (hoverId === label) return;
    // Moving onto a different item dismisses a click-opened flyout, so a
    // tooltip and an overlay are never on screen at the same time.
    if (collapsed && openId !== null && openId !== label) setOpenId(null);
    setRect(ref.current?.getBoundingClientRect() ?? null);
    setHoverId(label);
  };
  const hide = () => setHoverId((cur) => (cur === label ? null : cur));
  // The tooltip is gated on the sidebar's single hoverId, so a stale one can
  // never linger if a mouseleave is missed.

  const listId = useId();
  const hasSub = children != null;
  // Accordion: the sidebar tracks a single open item, keyed by label.
  // One open item at a time — inline when expanded, a flyout when collapsed.
  const open = hasSub && openId === label;

  const button = (
    <button
      ref={ref}
      type="button"
      className={cx(styles.item, selected && styles.itemSelected, className)}
      data-selected={selected || undefined}
      aria-current={selected ? 'page' : undefined}
      aria-expanded={hasSub ? open : undefined}
      aria-controls={open ? listId : undefined}
      onClick={(e) => {
        if (hasSub) {
          setRect(ref.current?.getBoundingClientRect() ?? null);
          setOpenId(open ? null : label);
        } else {
          // Navigating to a leaf dismisses whatever section was open.
          setOpenId(null);
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {Icon && (
        <span className={styles.iconSlot}>
          <Icon variant={selected ? 'dualtone-selected' : 'dualtone'} size={20} />
        </span>
      )}
      {!collapsed && <span className={styles.label}>{label}</span>}
      {hasSub && !collapsed && (
        <span className={cx(styles.chevron, open && styles.chevronOpen)}>
          <ChevronDownIcon size={16} />
        </span>
      )}
    </button>
  );

  if (collapsed) {
    const showFlyout = Boolean(open && rect);
    // The tooltip yields to the flyout, so the two never show together.
    const showTip = Boolean(hoverId === label && rect && !showFlyout);
    return (
      <div
        className={styles.collapsedWrap}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {button}
        {showFlyout && rect && (
          <div
            className={styles.flyout}
            role="group"
            aria-label={label}
            style={{ top: rect.top - 12, left: rect.right + 8 }}
          >
            <div className={styles.flyoutTitle}>{label}</div>
            <div className={styles.flyoutList}>{children}</div>
          </div>
        )}
        {showTip && rect && (
          <span
            role="tooltip"
            className={styles.tip}
            style={{ top: rect.top + rect.height / 2, left: rect.right + 8 }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {button}
      {open && (
        <div className={styles.subList} id={listId}>
          {children}
        </div>
      )}
    </>
  );
}

export interface SidebarSubItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  selected?: boolean;
}

export function SidebarSubItem({ label, selected = false, className, ...rest }: SidebarSubItemProps) {
  return (
    <button
      type="button"
      className={cx(styles.subItem, selected && styles.subItemSelected, className)}
      data-selected={selected || undefined}
      aria-current={selected ? 'page' : undefined}
      {...rest}
    >
      {label}
    </button>
  );
}
