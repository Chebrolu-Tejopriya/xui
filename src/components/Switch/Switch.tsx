import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered beside the switch. */
  label?: ReactNode;
  /** Shows check / close glyphs inside the handle (compact 48×28 variant). */
  icon?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, icon = false, className, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label className={[styles.root, className].filter(Boolean).join(' ')} htmlFor={inputId}>
        <input {...rest} ref={ref} id={inputId} type="checkbox" role="switch" className={styles.input} />
        <span className={[styles.track, icon && styles.withIcon].filter(Boolean).join(' ')} aria-hidden="true">
          <span className={styles.handle}>
            {icon && (
              <>
                <svg className={styles.iconOn} viewBox="0 0 14 14" fill="none">
                  <path d="M2.9 7.3 5.8 10 11 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className={styles.iconOff} viewBox="0 0 14 14" fill="none">
                  <path d="M3.5 3.5 10.5 10.5 M10.5 3.5 3.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </>
            )}
          </span>
        </span>
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
