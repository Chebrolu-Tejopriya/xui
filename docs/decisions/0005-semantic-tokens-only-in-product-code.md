# 0005 — Product code uses semantic tokens only

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The colour system has three layers: primitives (`--gray-04`, the raw scale),
semantics (`--surface-tertiary`, meaning), and labels. Only semantics are
theme-reactive — they re-resolve under `[data-theme='dark']`. A primitive
reference or a raw hex renders the same colour in both themes, which is
sometimes fine and usually a dark-mode bug.

These bugs are invisible in light mode, so they accumulate. The icon set shipped
with hardcoded `white` knockouts that looked perfect on a white canvas and
rendered as white blobs on dark. A first sweep of the codebase found eight
components reaching directly into primitives.

This is the same problem the **xemantics** Figma plugin solves on the design
side, where designers pick primitives from the swatch panel because they are
right there.

## Decision

Product code uses semantic tokens. No raw hex, no `rgb()`, no `var(--gray-04)`.
Primitives exist only to define semantics, and are private to `src/tokens/`.

Enforced by `npm run lint:tokens`, the code-side mirror of xemantics: it finds
violations, resolves each to the token that should replace it, and rewrites the
unambiguous ones. Both tools read the same derived rulebook, so design and code
resolve a colour identically.

Three carve-outs, each explicit:

- **Token files** define colour; that is where hex belongs.
- **Brand artwork** (currency logos, flags) keeps fixed brand colours —
  `xui-lint-ignore-file`, mirroring xemantics' protected-artwork rule.
- **Colours the design itself leaves on a primitive** — `xui-lint-ignore` with
  the reason. Figma binds Switch's hover fill to raw `Gray/06`; no semantic
  exists at that step, so code matches the design rather than inventing one.

## Alternatives rejected

- **Ban primitives outright, no escape hatch.** Cleaner rule. Rejected because
  the design genuinely uses raw primitives in places — a rule that forces code
  to diverge from Figma is the wrong rule. The escape hatch requires a reason.
- **Auto-fix everything the linter finds.** Rejected: the same primitive means a
  different token by context (`gray-08` as a border vs as text). Suggesting a
  wrong-group token is helpful; applying it is a silent bug. The linter suggests
  across groups, auto-applies only within.
- **Rely on review.** This is what we were doing. Eight violations.

## Consequences

- Zero raw colours in product code; the whole surface is theme-correct.
- New colours require a token decision up front, which is friction — and the
  point.
- The linter is another artefact to maintain, sharing the rulebook with the
  manifest and the plugin.
- Comment-stripping and ignore directives took two rounds to get right; false
  positives (hex quoted in doc comments) would have made it ignorable.
