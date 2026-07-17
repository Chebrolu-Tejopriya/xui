import { Fragment } from 'react';
import type { ReactNode } from 'react';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const content = (
            <>
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {item.label}
            </>
          );
          return (
            <Fragment key={i}>
              <li>
                {item.href && !item.disabled && !isLast ? (
                  <a href={item.href} className={styles.item}>
                    {content}
                  </a>
                ) : (
                  <span
                    className={[
                      styles.item,
                      item.disabled && styles.disabled,
                      isLast && styles.current,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {content}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className={styles.separator}>
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
