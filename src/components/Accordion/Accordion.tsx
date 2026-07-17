import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Accordion.module.css';

export interface AccordionItemData {
  value: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  /** Values expanded by default. */
  defaultValue?: string[];
  className?: string;
}

export function Accordion({ items, multiple = false, defaultValue = [], className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultValue);

  const toggle = (value: string) => {
    setOpen((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : multiple
          ? [...prev, value]
          : [value],
    );
  };

  return (
    <div className={[styles.accordion, className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const expanded = open.includes(item.value);
        return (
          <div key={item.value} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={expanded}
              onClick={() => toggle(item.value)}
            >
              <span className={styles.title}>{item.title}</span>
              <svg
                className={[styles.chevron, expanded && styles.chevronOpen].filter(Boolean).join(' ')}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {expanded && <div className={styles.content}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
