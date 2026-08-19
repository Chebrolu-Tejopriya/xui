# 0013 — Brand is a runtime axis, not a fork

**Status:** accepted · **Recorded:** 2026-08-16

## Context

XUI was built from the KoinX Figma file and had KoinX baked in at the token
layer: the seven brand-bearing semantics named `--blue-NN` directly. teja's
requirement is that XUI serve more than KoinX, with the brand colour switchable
the way light and dark already are — "a shift in the top".

Reading the tokens first made this much smaller than it sounded. Brand touches
**7 of 65 semantics** — `surface-brand-primary/solid/subtle/secondary`,
`content-brand-primary/secondary`, `border-brand` — and between them only **4
steps** of the blue ramp: 03, 08, 09 (Base), 10. Everything else is greys and
status colours, which are not brand-dependent.

## Decision

**Insert a `--brand-NN` alias layer between primitives and semantics, and let
`[data-brand]` redefine it — a second runtime axis beside `[data-theme]`.**

```
primitives (--blue-09)  ->  brand ramp (--brand-09)  ->  semantics (--content-brand-primary)
                                    ^
                            [data-brand='acme'] swaps this
```

The default brand is KoinX blue expressed as *aliases*, not hex:

```css
:root { --brand-09: var(--blue-09); /* … */ }
```

That matters. The blue scale is already theme-reactive, so `--brand-09`
inherits light/dark for free and needs no second block — and an app that sets
no `data-brand` resolves byte-identically to before the layer existed.

Two rules fall out, both recorded in `brand.css`:

- **Brand × theme is a matrix, not a list.** A new brand supplies a light ramp
  *and* a dark ramp. One defined only for light breaks the moment a user flips
  the theme.
- **Both attributes sit on the same element** (`document.documentElement`),
  because the dark ramp is selected by `[data-theme='dark'][data-brand='acme']`
  and a compound selector cannot span two elements.

Step roles are fixed by index — 09 is Base for every brand — because the
semantics bind by number, not by name.

## Alternatives rejected

- **Redefine the seven semantics per brand** (`[data-brand='acme'] { --content-brand-primary: … }`).
  Fewer moving parts, and tempting. Rejected because it inverts the token
  layering from [0005](0005-semantic-tokens-only-in-product-code.md): brands
  would supply *semantics* rather than a palette, so every new brand has to
  understand XUI's seven roles instead of handing over the 12-step ramp their
  designer already drew in Figma. It also loses the eight unused steps, which
  are exactly what future semantics will draw on.
- **A build-time theme (Sass-style, one stylesheet per brand).** Smaller CSS
  per app. Rejected outright: the requirement is a runtime switch alongside
  light/dark, and a build-time split cannot show two brands on one page or in
  one Storybook.
- **Rename the blue scale to `--brand-*` and drop the alias.** One layer fewer.
  Rejected because blue is still a real hue in the palette — status and
  informational colours use it independently of brand, and collapsing the two
  would make an info state follow the brand.
- **Keep `--blue-*` in semantics and override the blue scale per brand.**
  Works mechanically, but makes "blue" mean "whatever the brand is", which is
  the same conflation as above and much harder to read.

## Consequences

- A brand is now a data file, not a fork. Adding one is ~24 declarations.
- The rulebook needed teaching. `build-rulebook.mjs` drops any semantic whose
  alias is not a known primitive, so the first run after this change silently
  emitted **58 semantics instead of 65** — all seven brand tokens gone, with no
  error. It now reads `brand.css` and follows the default brand one hop, so a
  raw `#0052fe` still resolves to the brand semantics for the linter.
- `lint-tokens.mjs` treats `--brand-NN` as a primitive: using it directly in
  product code is a finding, same as `--blue-09`.
- Still KoinX-specific and **not** addressed here: the wordmark and mark in
  `src/assets/brand.tsx` (Sidebar's story imports them directly, so the library
  cannot yet render another company's logo) and a KoinX reference in
  `typography.css`. Those are slots, not tokens, and want their own change.
- The xemantics Figma plugin now has a dimension it does not model — its
  `HEX_LIGHT`/`HEX_DARK` maps assume one palette. Swapping brand in Figma will
  need the same axis before design and code agree again.
- Verified with a throwaway probe ramp injected at runtime rather than by
  inventing a second brand's colours, which would have violated
  [0001](0001-figma-is-the-single-source-of-truth.md). All four
  brand × theme combinations resolve correctly through to painted components.
