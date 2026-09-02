import type { ReactNode, SVGProps } from 'react';

export interface CoinIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width & height in px (or any CSS length). Defaults to 40, the size Figma draws. */
  size?: number | string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  'aria-label'?: string;
}

/**
 * Builds a named, tree-shakeable coin-type icon from its shape.
 *
 * These are NOT Icons v2. Where an `Icon` is a single-colour glyph that renders
 * in `currentColor` across four tones, a coin icon is a fixed 40x40 badge —
 * a slate disc with a two-colour glyph on it — identifying a transaction type
 * in a ledger. It carries its own palette and therefore ignores `color`.
 *
 * `shape` is a JSX element built once at module scope by
 * scripts/gen-coin-icons.mjs, not a markup string, for the reason in ADR 0011:
 * a referentially stable child lets React skip the subtree, so the DOM nodes
 * survive a re-render. The `dangerouslySetInnerHTML` alternative rewrites them
 * under the pointer mid-gesture and the browser never fires `click`.
 */
export function createCoinIcon(displayName: string, shape: ReactNode) {
  function CoinIcon({ size = 40, ...props }: CoinIconProps) {
    const labelled = props['aria-label'] != null;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
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
  CoinIcon.displayName = displayName;
  return CoinIcon;
}
