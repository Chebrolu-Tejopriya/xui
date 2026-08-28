import type { ComponentType, HTMLAttributes } from 'react';
import styles from './BottomNav.module.css';
import type { IconProps } from '../../icons';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type BottomNavProps = HTMLAttributes<HTMLElement>;

export interface BottomNavItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The icon component itself, not an element — the item picks the tone. */
  icon: ComponentType<IconProps>;
  label: string;
  selected?: boolean;
}

/**
 * Mobile tab bar. 54px tall; items are a fixed 74px spread space-between,
 * with a 24px icon over a Label/4 caption 6px below it.
 *
 *   <BottomNav>
 *     <BottomNavItem icon={OverviewIcon} label="Overview" selected />
 *     <BottomNavItem icon={WalletIcon} label="Portfolio" />
 *   </BottomNav>
 *
 * Hides itself above 900px. Like `SidebarItem`, selection is carried by icon
 * tone as well as colour, so it does not depend on hue alone.
 */
export function BottomNav({ className, children, ...rest }: BottomNavProps) {
  return (
    // The shell hides the rail below 900px by selecting its <nav> children;
    // this marks which one is not the rail.
    <nav data-bottom-nav="" className={cx(styles.bottomNav, className)} {...rest}>
      {children}
    </nav>
  );
}

export function BottomNavItem({
  icon: Icon,
  label,
  selected = false,
  className,
  ...rest
}: BottomNavItemProps) {
  return (
    <button
      type="button"
      className={cx(styles.item, selected && styles.itemSelected, className)}
      data-selected={selected || undefined}
      aria-current={selected ? 'page' : undefined}
      {...rest}
    >
      <Icon size={24} variant={selected ? 'dualtone-selected' : 'dualtone'} />
      <span className={styles.label}>{label}</span>
    </button>
  );
}
