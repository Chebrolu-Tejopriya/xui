import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  /** Unique value identifying the tab. */
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? internal;
  const baseId = useId();

  const select = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div role="tablist" className={[styles.tabs, className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            id={`${baseId}-${item.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            disabled={item.disabled}
            className={[styles.tab, active && styles.active].filter(Boolean).join(' ')}
            onClick={() => select(item.value)}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
