import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  /** Unique value identifying the tab. */
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Renders the item in its hover treatment (showcase/stories only). */
  hover?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Figma variants: `boxed` — white bordered container with brand-filled
   * active item (Tabs/Default, Tabs/WithIcons); `underline` — bottom-border
   * container, active item underlined in brand (Tabs 1128:16638).
   */
  variant?: 'boxed' | 'underline';
  /** Disables the whole tablist (Figma Property 1=Disabled). */
  disabled?: boolean;
  className?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'boxed',
  disabled = false,
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? internal;
  const baseId = useId();

  const select = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div
      role="tablist"
      className={[styles.tabs, variant === 'underline' && styles.underline, className]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            id={`${baseId}-${item.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            disabled={disabled || item.disabled}
            data-hover={item.hover || undefined}
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
