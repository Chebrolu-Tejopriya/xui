import type { HTMLAttributes, ReactNode } from 'react';
import styles from './EmptyState.module.css';

/** Per-part class hooks, for the cases `className` on the root cannot reach. */
export interface EmptyStateClassNames {
  illustration?: string;
  text?: string;
  title?: string;
  description?: string;
  actions?: string;
  footer?: string;
}

// `title` is omitted from the DOM attributes: HTMLAttributes types it as a
// string (the native tooltip), which would forbid passing a node here.
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration above the text. Figma draws these at 240x205. */
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
  /**
   * A closing line under the actions — the "Tip: …" nudge.
   *
   * BEYOND THE DESIGN: none of the three Figma screens has one. It exists
   * because the library KoinX developers already use has it, and a component
   * that cannot express what they ship today is not a migration they can make.
   * Flagged for the designer: it renders as Subtitle/1 in content-tertiary,
   * quieter than the description, which is a choice made here rather than read
   * from Figma.
   */
  footer?: ReactNode;
  /** Class hooks for the inner parts. `className` still lands on the root. */
  classNames?: EmptyStateClassNames;
}

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

/**
 * The screen shown when there is nothing to show — no results, no data yet, or
 * an error. An illustration, a title, an optional line of explanation,
 * whatever the user should do next, and an optional closing nudge.
 *
 *   <EmptyState
 *     illustration={<NoDataIllustration />}
 *     title="No team members found."
 *     description="Looks like you haven't added any team members yet."
 *     actions={<Button iconLeft={<AddUserIcon />}>Invite new members</Button>}
 *     footer="Tip: Invite more team members to get more rewards and points."
 *   />
 *
 * Every part except the title is optional, and each is dropped from the DOM
 * rather than rendered empty — so the gaps close instead of leaving a hole
 * where a part used to be.
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
  footer,
  classNames = {},
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cx(styles.root, className)} {...rest}>
      {illustration && (
        <div className={cx(styles.illustration, classNames.illustration)}>{illustration}</div>
      )}
      <div className={styles.body}>
        <div className={cx(styles.text, classNames.text)}>
          <p className={cx(styles.title, classNames.title)}>{title}</p>
          {description && (
            <p className={cx(styles.description, classNames.description)}>{description}</p>
          )}
        </div>
        {actions && <div className={cx(styles.actions, classNames.actions)}>{actions}</div>}
        {footer && <p className={cx(styles.footer, classNames.footer)}>{footer}</p>}
      </div>
    </div>
  );
}
