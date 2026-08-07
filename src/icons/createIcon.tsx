import type { SVGProps } from 'react';

/**
 * Icon tone variants, mirroring the Figma "Icons v2" set:
 *  - `outlined` — single-stroke line icon (the default)
 *  - `solid`    — filled shape with the glyph knocked out
 *  - `dualtone` — filled backing shape at 40% + full-opacity glyph, one color
 *
 * All three render in `currentColor`; Figma's "DualTone-Selected" is simply
 * `dualtone` in a brand color, so it's a color choice, not a separate asset.
 */
export type IconVariant = 'outlined' | 'solid' | 'dualtone';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Tone variant. Defaults to `outlined`. */
  variant?: IconVariant;
  /** Width & height in px (or any CSS length). Defaults to 24. */
  size?: number | string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  'aria-label'?: string;
}

/** Builds a named, tree-shakeable icon component from its 3 tone-variant path markups. */
export function createIcon(displayName: string, paths: Record<IconVariant, string>) {
  function Icon({ variant = 'outlined', size = 24, ...props }: IconProps) {
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
        dangerouslySetInnerHTML={{ __html: paths[variant] }}
        {...props}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
