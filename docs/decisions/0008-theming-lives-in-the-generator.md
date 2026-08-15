# 0008 — Theming lives in the generator; extracted data stays faithful

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The 69 icons are exported from Figma as SVG, normalised, and compiled into
React components. Figma's export carries literal paints: `#64748B` for a
dual-tone glyph, `white` for a badge knockout, `#F7324C` for a notification dot.

Those literals cannot ship — white knockouts became white blobs on dark
backgrounds, and a dual-tone glyph forced to `currentColor` rendered white in
dark mode when the design says grey.

The obvious fix is to tokenise during extraction: rewrite the paints as you pull
them. That destroys the only faithful record of what Figma contains, and when a
mapping later proves wrong there is nothing to re-derive it from — only a
re-export.

## Decision

Two stages, with a strict boundary.

**Extraction** (`scripts/icon-data/*.json`) stays faithful. Strip the `<svg>`
wrapper, normalise glyph colours to `currentColor`, round coordinates. Keep
everything else exactly as Figma gives it, including `white` knockouts and
`opacity="0.4"`.

**Generation** (`scripts/gen-icons.mjs` + `createIcon.tsx`) applies design
meaning:

| Figma paint | Becomes |
|---|---|
| white cut-out | `var(--xui-icon-knockout, var(--surface-raised))` |
| red accent dot | `var(--surface-error-primary)` |
| dual-tone glyph | `var(--content-tertiary)` |
| dual-tone selected | `var(--content-brand-primary)` |

A mapping bug is then a one-line generator change plus a regeneration — no
re-extraction, no touching 69 files.

Corollary: per-path tokens are emitted as inline `style`, because SVG
presentation attributes cannot resolve `var()` and fail silently.

## Alternatives rejected

- **Tokenise during extraction.** One stage, less machinery. Rejected on
  reversibility: the faithful record is the thing that makes a bad mapping cheap
  to fix.
- **Hand-edit the generated components.** Rejected — generated files are
  rewritten wholesale; edits vanish. See [0002](0002-derive-artefacts-never-hand-maintain.md).
- **Ship `currentColor` everywhere and let callers colour icons.** Simplest, and
  wrong: the design *specifies* dual-tone grey and a red dot. Losing that pushes
  design decisions onto every call site.

## Consequences

- The same class of bug (dark-mode blobs, wrong tone colour) is fixed once,
  centrally, for all 69 icons — which is exactly how it played out.
- Two stages to understand, and a rule to hold: never bake tokens into
  `icon-data/`.
- The data files are verbose and unreadable. They are a record, not a source to
  edit.
