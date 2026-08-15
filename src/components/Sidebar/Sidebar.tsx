import { createContext, useContext, useId, useState } from 'react';
import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import styles from './Sidebar.module.css';
import type { IconProps } from '../../icons';
import { ChevronDownIcon } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Rail mode — 61px, icons only. Expanded is 224px. */
  collapsed?: boolean;
  children?: ReactNode;
}

/**
 * App navigation rail.
 *
 *   <Sidebar collapsed={collapsed}>
 *     <SidebarHeader>…logo…</SidebarHeader>
 *     <SidebarNav>
 *       <SidebarItem icon={OverviewIcon} label="Home" selected />
 *       <SidebarItem icon={WalletIcon} label="Data Sources">
 *         <SidebarSubItem label="Connected" />
 *       </SidebarItem>
 *     </SidebarNav>
 *     <SidebarFooter>…</SidebarFooter>
 *   </Sidebar>
 *
 * 224px expanded / 61px collapsed, `surface-raised` with a `border-tertiary`
 * right edge. Items are 36px tall; selected paints `surface-brand-secondary`
 * with a 3px `content-brand-primary` rail and a brand-toned icon.
 */
export function Sidebar({ collapsed = false, className, children, ...rest }: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <nav
        className={cx(styles.sidebar, collapsed && styles.collapsed, className)}
        data-collapsed={collapsed || undefined}
        {...rest}
      >
        {children}
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
  /** Sub-items. Renders a chevron and an indented list when expanded. */
  children?: ReactNode;
  /** Start with the sub-list open. */
  defaultOpen?: boolean;
}

export function SidebarItem({
  icon: Icon,
  label,
  selected = false,
  children,
  defaultOpen = false,
  className,
  onClick,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = useContext(SidebarContext);
  const [open, setOpen] = useState(defaultOpen);
  const listId = useId();
  const expandable = children != null && !collapsed;

  return (
    <>
      <button
        type="button"
        className={cx(styles.item, selected && styles.itemSelected, className)}
        data-selected={selected || undefined}
        aria-current={selected ? 'page' : undefined}
        aria-expanded={expandable ? open : undefined}
        aria-controls={expandable ? listId : undefined}
        title={collapsed ? label : undefined}
        onClick={(e) => {
          if (expandable) setOpen((o) => !o);
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
        {expandable && (
          <span className={cx(styles.chevron, open && styles.chevronOpen)}>
            <ChevronDownIcon size={16} />
          </span>
        )}
      </button>
      {expandable && open && (
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
