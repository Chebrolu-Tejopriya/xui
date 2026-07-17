import { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label rendered beside the box. */
  label?: ReactNode;
  /** Renders the partially-selected (indeterminate) state. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className, id, ...rest }, forwardedRef) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label className={[styles.root, className].filter(Boolean).join(' ')} htmlFor={inputId}>
        <input
          {...rest}
          ref={(node) => {
            innerRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          id={inputId}
          type="checkbox"
          className={styles.input}
        />
        <span className={styles.box} aria-hidden="true">
          <svg className={styles.check} viewBox="0 0 12 12" fill="none">
            <path d="M2 6.2 4.8 9 10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className={styles.dash} viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
