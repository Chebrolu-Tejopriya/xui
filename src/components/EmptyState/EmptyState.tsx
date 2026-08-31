import type { HTMLAttributes, ReactNode } from 'react';
import styles from './EmptyState.module.css';

// `title` is omitted from the DOM attributes: HTMLAttributes types it as a
// string (the native tooltip), which would forbid passing a node here.
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration above the text. Figma draws these at 240x204. */
  illustration?: ReactNode;
  /** One line, Heading/2. */
  title: ReactNode;
  /** Supporting sentence below the title. Optional — the 404 screen has one, the "No Details Found" screen hides it. */
  description?: ReactNode;
  /**
   * Buttons below the text. A slot rather than `primaryAction`/`secondaryAction`
   * props (ADR 0007): the three screens in Figma use none, one and two buttons,
   * and a slot covers all three without the component knowing about any of them.
   */
  actions?: ReactNode;
}

/**
 * The screen shown when there is nothing to show — no results, no data yet, or
 * an error. An illustration, a title, an optional line of explanation, and
 * whatever the user should do next.
 *
 *   <EmptyState
 *     illustration={<PlugIllustration />}
 *     title="Something went wrong"
 *     description="Oh no! Something just broke! Rest assured our awesome team is getting it fixed."
 *     actions={
 *       <>
 *         <Button size="large">Go to KoinX Home</Button>
 *         <Button size="large" variant="outline">Read our Informative Blogs</Button>
 *       </>
 *     }
 *   />
 *
 * Centres itself in whatever box it is given, so a page-level 404 and an empty
 * table cell use the same component — the container decides how much room it
 * gets, not this.
 */
export function EmptyState({
  illustration,
  title,
  description,
  actions,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
      {illustration && <div className={styles.illustration}>{illustration}</div>}
      <div className={styles.body}>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
