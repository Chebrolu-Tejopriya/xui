# 0014 — XUI stays single-brand; cool greys constrain the hue

**Status:** accepted · **Recorded:** 2026-08-16
**Supersedes:** [0013](0013-brand-is-a-runtime-axis.md)

## Context

[0013](0013-brand-is-a-runtime-axis.md) made brand a runtime axis: semantics
named `--brand-NN`, and `[data-brand]` swapped the ramp beside `[data-theme]`.
It worked — all four brand × theme combinations resolved through to painted
components — and it was cheap, because brand touches only 7 of 65 semantics.

It was still the wrong thing to build, for a reason the mechanism could not
show: **XUI's greys are cool greys.** The scale runs from `#f1f5f9` through
`#64748b` to `#0f172a` — blue-leaning at every step. A brand hue does not sit
in isolation; it sits on those greys, beside them, and against them in borders
and text. Warm hues — yellow, orange, red, purple — do not reconcile with a
cool neutral. The result reads as a mismatch rather than as a theme, and no
amount of token plumbing fixes it, because the constraint is in the neutral
scale that everything else is built on.

So the axis would have been a promise the palette could not keep: it invites a
brand the system cannot render well, and the failure appears only after someone
has committed to a colour.

## Decision

**XUI is single-brand. The brand-bearing semantics name `--blue-NN` directly,
as they did before 0013, and the `--brand-NN` alias layer is removed.**

Reverted in full: `src/tokens/brand.css` deleted, `semantic.css` restored to
the blue scale, and the `build-rulebook.mjs` / `lint-tokens.mjs` changes that
existed only to serve the alias layer taken back out.

## Alternatives rejected

- **Keep the alias layer, unused, in case brands return.** Rejected: an
  indirection with no second case is speculative generality, and this one is
  actively misleading — `--brand-09` tells every future reader, human or agent,
  that brands are swappable when the palette says they are not. Git holds it at
  `2900f7a` if the constraint ever changes.
- **Ship multi-brand but restrict it to cool hues.** Rejected as a distinction
  nobody will honour at the moment of choosing. "Blues and blue-greens only" is
  not a design system feature, it is a caveat.
- **Re-cut the greys as neutral so any hue works.** The real fix if multi-brand
  were required, and correspondingly large: every surface, border and content
  token in both themes, re-derived and re-verified against Figma. Rejected
  because multi-brand is not required — see 0001, the file defines cool greys.

## Consequences

- The token layering returns to primitives → semantics, two layers, as
  [0005](0005-semantic-tokens-only-in-product-code.md) describes.
- The rulebook and linter lose a special case; `xemantics` needs no new axis.
- **The constraint is recorded, which is the point.** The next person to
  propose multi-brand should arrive at this page and read "the greys are cool"
  before writing any code, rather than rediscovering it after a designer picks
  orange.
- If XUI is ever genuinely needed beyond KoinX, the honest sequence is: re-cut
  the neutral scale first, then reinstate 0013's alias layer, which was sound
  as a mechanism.
- Two KoinX-specific items noted in 0013 remain, and now simply stay that way:
  the wordmark and mark in `src/assets/brand.tsx`, and the KoinX reference in
  `typography.css`.
