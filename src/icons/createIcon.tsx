import type { SVGProps } from 'react';

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

/** Builds a named, tree-shakeable icon component from its 3 tone-shape path markups. */
export function createIcon(displayName: string, paths: Record<IconShape, string>) {
  function Icon({ variant = 'outlined', size = 24, style, ...props }: IconProps) {
    const labelled = props['aria-label'] != null;
    const shape: IconShape = variant === 'dualtone-selected' ? 'dualtone' : variant;
    const mergedStyle =
      variant === 'dualtone-selected'
        ? { color: 'var(--content-brand-primary)', ...style }
        : style;
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
        dangerouslySetInnerHTML={{ __html: paths[shape] }}
        {...props}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
