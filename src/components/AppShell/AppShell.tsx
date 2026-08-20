import type { HTMLAttributes } from 'react';
import styles from './AppShell.module.css';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export type AppShellProps = HTMLAttributes<HTMLDivElement>;

/**
 * The frame every product screen sits in — nav rail on the left, scrolling
 * content column on the right.
 *
 *   <AppShell>
 *     <Sidebar collapsed={collapsed} onToggleCollapsed={toggle}>…</Sidebar>
 *     <AppShellMain>
 *       <PageHeader title="Dashboard" />
 *       …
 *     </AppShellMain>
 *   </AppShell>
 *
 * Geometry is Figma's: a 24px gap between rail and content and 24px of
 * padding on the right, which at the 1440 design width leaves the content
 * column at exactly 1168. `AppShellMain` flexes to fill rather than fixing
 * that number, so the shell holds at any viewport and still matches the
 * mock at 1440.
 *
 * Takes the Sidebar as a child rather than a prop so the rail keeps its own
 * API — collapse, accordion, flyouts — instead of being configured through
 * this one.
 */
export function AppShell({ className, children, ...rest }: AppShellProps) {
  return (
    <div className={cx(styles.shell, className)} {...rest}>
      {children}
    </div>
  );
}

/** The content column. Stacks its children 8px apart with 16px top/bottom. */
export function AppShellMain({ className, children, ...rest }: AppShellProps) {
  return (
    <main className={cx(styles.main, className)} {...rest}>
      {children}
    </main>
  );
}
