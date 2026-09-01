import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** A quieter second line under the label. */
  subLabel?: ReactNode;
  /** A glyph before the label. */
  icon?: ReactNode;
  /** An image before the label, rendered in a 20px round frame. */
  image?: string;
  /** A glyph at the end of the row. */
  rightIcon?: ReactNode;
  disabled?: boolean;
  /** Extra terms the search should match, beyond the visible label. */
  keywords?: string[];
}

/** A titled run of options. Figma draws these as a heading section, its items, then a rule. */
export interface SelectGroup {
  label: ReactNode;
  options: SelectOption[];
}

export type SelectItems = SelectOption[] | SelectGroup[];

export interface SelectProps {
  /** Flat options, or groups — Figma's dropdown draws both. */
  options: SelectItems;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  /** Trigger width. Figma's default is 204px. */
  width?: string;
  /** Show the check against the selected row. On by default, as Figma draws it. */
  check?: boolean;
  /** Put a search field at the top of the panel. */
  searchInput?: boolean;
  searchPlaceholder?: string;
  emptySearchMessage?: string;
  onSearchChange?: (value: string) => void;
  /** Wipe the query when the panel closes rather than keeping it for next time. */
  clearSearchOnClose?: boolean;
  /** Sort options by label rather than keeping the order given. */
  sortedOptions?: boolean;
  /** Show a cross in the trigger to clear the selection back to `defaultValue`. */
  isClearable?: boolean;
}

const isGroup = (o: SelectOption | SelectGroup): o is SelectGroup =>
  Object.prototype.hasOwnProperty.call(o, 'options');

/** Groups and flat lists are the same shape internally: one unnamed group, or many named ones. */
function toGroups(options: SelectItems): SelectGroup[] {
  if (options.length === 0) return [];
  return isGroup(options[0])
    ? (options as SelectGroup[])
    : [{ label: null, options: options as SelectOption[] }];
}

const textOf = (node: ReactNode): string =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : '';

const matches = (o: SelectOption, q: string) => {
  const hay = [textOf(o.label), textOf(o.subLabel), ...(o.keywords ?? [])].join(' ').toLowerCase();
  return hay.includes(q);
};

export function Select({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  className,
  width,
  check = true,
  searchInput = false,
  searchPlaceholder = 'Search',
  emptySearchMessage = 'No results found.',
  onSearchChange,
  clearSearchOnClose = false,
  sortedOptions = false,
  isClearable = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internal;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return toGroups(options)
      .map((g) => {
        let items = q ? g.options.filter((o) => matches(o, q)) : g.options;
        if (sortedOptions) {
          items = [...items].sort((a, b) => textOf(a.label).localeCompare(textOf(b.label)));
        }
        return { ...g, options: items };
      })
      // A group whose every option was filtered out should take its heading with it.
      .filter((g) => g.options.length > 0);
  }, [options, query, sortedOptions]);

  const selected = useMemo(
    () => toGroups(options).flatMap((g) => g.options).find((o) => o.value === selectedValue),
    [options, selectedValue],
  );

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    if (clearSearchOnClose && query) {
      setQuery('');
      onSearchChange?.('');
    }
  };

  const pick = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    close();
  };

  const search = (v: string) => {
    setQuery(v);
    onSearchChange?.(v);
  };

  // Figma: the cross replaces the chevron once something other than the default
  // is chosen, and clearing returns to the default rather than to nothing.
  const clearable = isClearable && selected != null && selectedValue !== defaultValue;

  const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={cx(styles.root, className)} style={width ? { width } : undefined}>
      <button
        type="button"
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cx(
          styles.trigger,
          open && styles.open,
          selected && styles.hasValue,
          loading && styles.loading,
        )}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {selected?.icon && <span className={styles.optionIcon}>{selected.icon}</span>}
        {selected?.image && <img className={styles.optionImage} src={selected.image} alt="" />}
        <span className={styles.value}>
          {loading ? placeholder : (selected?.label ?? placeholder)}
        </span>
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : clearable ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear selection"
            className={styles.clear}
            onClick={(e) => {
              e.stopPropagation();
              if (value === undefined) setInternal(defaultValue);
              if (defaultValue != null) onChange?.(defaultValue);
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className={styles.panel}>
          {searchInput && (
            <div className={styles.search}>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={styles.searchIcon}>
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                className={styles.searchField}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => search(e.target.value)}
              />
            </div>
          )}

          {groups.length === 0 ? (
            <p className={styles.empty}>{emptySearchMessage}</p>
          ) : (
            <ul role="listbox" className={styles.list}>
              {groups.map((group, gi) => (
                <li key={gi} className={styles.group}>
                  {/* Figma separates groups with a rule rather than extra space. */}
                  {gi > 0 && <div className={styles.divider} />}
                  {group.label != null && <p className={styles.groupLabel}>{group.label}</p>}
                  <ul className={styles.groupList}>
                    {group.options.map((opt) => {
                      const isSelected = opt.value === selectedValue;
                      return (
                        <li key={opt.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            disabled={opt.disabled}
                            className={cx(
                              styles.item,
                              isSelected && styles.itemSelected,
                              !check && styles.itemNoCheck,
                            )}
                            onClick={() => pick(opt.value)}
                          >
                            {check && (
                              <span className={styles.check} aria-hidden="true">
                                {isSelected && (
                                  <svg viewBox="0 0 16 16" fill="none">
                                    <path d="m3.5 8.5 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>
                            )}
                            {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                            {opt.image && <img className={styles.optionImage} src={opt.image} alt="" />}
                            <span className={styles.itemText}>
                              <span className={styles.itemLabel}>{opt.label}</span>
                              {opt.subLabel && <span className={styles.itemSubLabel}>{opt.subLabel}</span>}
                            </span>
                            {opt.rightIcon && <span className={styles.optionIcon}>{opt.rightIcon}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
