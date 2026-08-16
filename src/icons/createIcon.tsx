import type { ReactNode, SVGProps } from 'react';

/**
 * The four Figma "Icons v2" tones:
 *  - `outlined`          — single-stroke line icon (the default)
 *  - `solid`             — filled shape with the glyph knocked out
 *  - `dualtone`          — filled backing shape at 40% + full-opacity glyph
 *  - `dualtone-selected` — the same dual-tone shape, in the brand color
 *
 * All render in `currentColor`; `dualtone-selected` just defaults its color to
 * the brand token (Figma's grey-default / blue-selected pair) and is still
 * overridable via `color`/`style`.
 */
export type IconVariant = 'outlined' | 'solid' | 'dualtone' | 'dualtone-selected';

/** The three distinct path assets an icon ships (selected reuses the dualtone shape). */
export type IconShape = 'outlined' | 'solid' | 'dualtone';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Tone variant. Defaults to `outlined`. */
  variant?: IconVariant;
  /** Width & height in px (or any CSS length). Defaults to 24. */
  size?: number | string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  'aria-label'?: string;
}

/**
 * Builds a named, tree-shakeable icon component from its 3 tone shapes.
 *
 * `shapes` holds JSX elements built once at module scope by
 * `scripts/gen-icons.mjs`, not markup strings. Because each is referentially
 * stable, React skips the subtree entirely on re-render and the icon's DOM
 * nodes persist. That is load-bearing, not an optimisation: the previous
 * `dangerouslySetInnerHTML` version rewrote the <svg>'s children every render
 * (React compares that prop by reference), replacing the node under the
 * pointer mid-click so the browser never fired `click` — see ADR 0011.
 */
export function createIcon(displayName: string, shapes: Record<IconShape, ReactNode>) {
  function Icon({ variant = 'outlined', size = 24, style, ...props }: IconProps) {
    const labelled = props['aria-label'] != null;
    const shape: IconShape = variant === 'dualtone-selected' ? 'dualtone' : variant;
    // The dual-tone tones carry the Figma design colors by default: grey
    // (content-tertiary = Gray/09, the DualTone-Default swatch) for `dualtone`,
    // brand for `dualtone-selected`. Outlined/solid inherit currentColor.
    // All are overridable via `color`/`style`. Knockout cut-outs inside the
    // markup use --xui-icon-knockout (defaults to --surface-raised) so badges
    // and rings match the surface the icon sits on in either theme.
    const toneColor =
      variant === 'dualtone-selected'
        ? 'var(--content-brand-primary)'
        : variant === 'dualtone'
          ? 'var(--content-tertiary)'
          : undefined;
    const mergedStyle = toneColor ? { color: toneColor, ...style } : style;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        style={mergedStyle}
        {...props}
      >
        {shapes[shape]}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
