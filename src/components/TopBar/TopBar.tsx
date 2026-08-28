import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TopBar.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  /** Right-hand cluster — notifications, the drawer trigger. */
  actions?: ReactNode;
}

/**
 * Mobile header. 48px tall with 16px sides, brand on the left and `actions` on
 * the right.
 *
 *   <TopBar actions={<button onClick={open}>…</button>}>
 *     <KoinXWordmark />
 *   </TopBar>
 *
 * Hides itself above 900px, where the Sidebar rail takes over — so a screen
 * renders both and neither needs a media query of its own.
 */
export function TopBar({ actions, className, children, ...rest }: TopBarProps) {
  return (
    <header className={cx(styles.topBar, className)} {...rest}>
      {children}
      {actions && <span className={styles.actions}>{actions}</span>}
    </header>
  );
}
