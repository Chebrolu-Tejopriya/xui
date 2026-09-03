import type { ReactNode, SVGProps } from 'react';

export interface GeneralIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width & height in px (or any CSS length). Defaults to 24, the size Figma draws. */
  size?: number | string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  'aria-label'?: string;
}

/**
 * Builds a named, tree-shakeable icon from the Figma "Icon Library".
 *
 * Three factories, because there are three families and they differ in ways a
 * single one would only paper over:
 *
 *   createIcon         Icons v2 — four tones, so it takes a shape per tone
 *   createGeneralIcon  this — one shape, 24px, renders in currentColor
 *   createCoinIcon     the 40px transaction badges — one shape, fixed palette,
 *                      and it ignores `color` because it has its own
 *
 * `shape` is a JSX element built once at module scope by
 * scripts/gen-general-icons.mjs, not a markup string — ADR 0011: a
 * referentially stable child lets React skip the subtree, so the DOM nodes
 * survive a re-render instead of being replaced under the pointer mid-gesture.
 */
export function createGeneralIcon(displayName: string, shape: ReactNode) {
  function GeneralIcon({ size = 24, ...props }: GeneralIconProps) {
    const labelled = props['aria-label'] != null;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        {...props}
      >
        {shape}
      </svg>
    );
  }
  GeneralIcon.displayName = displayName;
  return GeneralIcon;
}
