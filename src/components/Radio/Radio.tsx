import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radio.module.css';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered beside the control. */
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label className={[styles.root, className].filter(Boolean).join(' ')} htmlFor={inputId}>
        <input {...rest} ref={ref} id={inputId} type="radio" className={styles.input} />
        <span className={styles.circle} aria-hidden="true" />
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
