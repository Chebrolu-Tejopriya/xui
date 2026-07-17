import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip text. */
  content: ReactNode;
  /** Where the bubble appears relative to the trigger. */
  placement?: TooltipPlacement;
  /** Hide the beak/arrow. */
  withArrow?: boolean;
  /** The trigger element. */
  children: ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  placement = 'top',
  withArrow = true,
  children,
  className,
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={visible ? id : undefined}
    >
      {children}
      {visible && (
        <span role="tooltip" id={id} className={[styles.bubble, styles[placement]].join(' ')}>
          {content}
          {withArrow && <span className={[styles.arrow, styles[`arrow-${placement}`]].join(' ')} aria-hidden="true" />}
        </span>
      )}
    </span>
  );
}
