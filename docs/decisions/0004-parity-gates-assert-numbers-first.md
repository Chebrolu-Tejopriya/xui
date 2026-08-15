# 0004 — Parity gates assert numbers before screenshots

**Status:** accepted · **Recorded:** 2026-08-15

## Context

Every visual defect a human caught in this project had already passed a
screenshot review. Looking at a render and comparing it to a Figma frame feels
like verification and is not: a 2px height error, a border colour one step off,
an icon 3px above centre — all invisible at a glance, all real bugs that
shipped.

Three causes recur:

1. **Figma specs describe rectangles; browsers render live HTML.** Native
   controls carry user-agent styling the spec cannot warn about.
2. **Figma strokes take no layout space; CSS borders do.** Anything with an
   explicit size *and* a border renders larger than spec unless compensated.
3. **Reviewing at 1× hides 1–2px drift.** Only numbers catch it.

## Decision

Before a component is "done", assert computed values against the Figma spec —
then look at pixels.

```js
getComputedStyle(el).height          // must equal the Figma px exactly
getComputedStyle(el).backgroundColor // exact rgb(), compared to the token
rectB.left - rectA.right             // gaps, against the Figma gap
```

Then a same-scale image comparison, both images read side by side rather than
from memory. The gate runs **per variant, per state** — passing on a default
proves nothing about loading or disabled.

Caught by numbers, missed by eyes:

- table rows at 53px against a 52px spec (badge border + divider border)
- icon-only buttons with the glyph 3.5px high — `gapTop 4.5 / gapBottom 11.5`
  where both should be 8, because an inline `<svg>` sits on the text baseline
- pagination cells at 37px against 36px, from native `<select>` line-height

## Alternatives rejected

- **Screenshot diffing against a Figma export.** Genuinely good, and worth
  adding. Rejected as the *primary* gate: a diff says "different", not "3.5px
  too high because the svg is on the baseline". Numbers name the cause.
- **Trust the spec and skip verification.** The spec is right; the render is
  what ships. Every bug above had a correct spec.
- **Visual regression only (Chromatic).** Catches *changes*, not initial wrongness
  — it would have locked in the 53px row as the baseline.

## Consequences

- Slower to call something done, with real measurement work per state.
- Bugs are diagnosed, not just detected: a number points at a cause.
- The gate is skippable under pressure. It is written as a mandatory skill with
  a hook reminder for exactly that reason.
- Some findings are *correct* and look wrong (Calendar's dual-tone opacity split
  is faithful). Numbers settle those arguments quickly.
