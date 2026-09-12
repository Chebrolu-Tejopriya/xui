# Tokens & styling

Naming, scales, and what not to invent. Format: see `README.md`.

---

## Do not reinvent type styles — use Figma's

> owner-correction · 2026-08-20 · teja · confident

*"use how ever we have in figma xui font styles, don't reinvent anything."*

Every text style comes from the Figma file. If a size or a tracking value seems
missing, it is a question for the designer, not a gap to fill with judgement.
`--tracking-subtitle-2` was invented once and the token linter caught it.

---

## Token names carry no `xui` prefix

> owner-correction · 2026-07-17 · teja · confident

*"here we don't need to have 'xui' just the name is enough like gray-01."*

---

## Show the mapped variable, not the hex

> owner-correction · 2026-07-17 · teja · confident

*"for semantics it should show the variable that is mapped instead of hex code."*

A semantic token's value is another token. Documentation that prints `#64748b`
instead of `var(--gray-09)` hides the only thing worth knowing.

---

## Primitives are not for product code

> decision · confident

`--gray-01`, `--blue-07` and the rest exist to define semantics and nothing
else. Product code uses `--content-*`, `--surface-*`, `--border-*`.
`npm run lint:tokens` enforces it.

This is why the manifest lists 118 tokens while the CSS defines 202 — the
difference is primitives, deliberately withheld. Listing them would invite the
bug the linter exists to catch.

---

## Contrast: `--content-tertiary` on `--surface-primary` misses AA

> gotcha · 2026-09-07 · claude · confident

`#64748b` on `#f1f5f9` is **4.34:1** where WCAG AA wants 4.5 — short by 0.16.
It is used for every caption, helper row and count in the system, so that one
pair produced 162 of ~180 contrast failures when a11y checking was turned on.

Not fixable in code: it is a token decision for the designer. Recorded on
Guides → Status. Also failing: white on error red (3.8), white on warning
orange (2.84).
