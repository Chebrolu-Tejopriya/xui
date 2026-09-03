export { createIcon } from './createIcon';
export type { IconProps, IconVariant } from './createIcon';
export * from './icons';

// Coin-type badges. A separate family from Icons v2: one fixed 40x40 shape with
// its own palette, not a currentColor glyph in four tones.
export { createCoinIcon } from './createCoinIcon';
export type { CoinIconProps } from './createCoinIcon';
export * from './coin-icons';

// The Figma "Icon Library" (261:140). A third family: single-tone 24px glyphs
// that DO take currentColor, so unlike the coin badges they follow the theme.
// Where a name is already an Icons v2 export, v2 keeps it and this one is
// suffixed `GeneralIcon` — see scripts/gen-general-icons.mjs.
export { createGeneralIcon } from './createGeneralIcon';
export type { GeneralIconProps } from './createGeneralIcon';
export * from './general-icons';
