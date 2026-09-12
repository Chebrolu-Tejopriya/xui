# Figma → code

Reading the file, and what to do when it is ambiguous. Format: see `README.md`.

---

## Use the native Figma MCP

> owner-correction · 2026-08-28 · teja · confident

*"use figma native mcp instead of figma console mcp."*

---

## When Figma is unclear, fix it properly anyway

> owner-correction · 2026-09-04 · teja · confident

*"for the tab icons you fix it properly even in if figma is not clear."*

"Figma doesn't say" is not a reason to ship something that reads wrong. Decide,
make it right, and record the decision as `beyondFigma` so it is visible.

Sits in tension with *build only what Figma defines* — the reconciliation is:
do not invent COMPONENTS or TOKENS, but do settle craft-level details Figma
never expressed, and say that you did.

---

## Verify the scope asked for, not the whole file

> owner-correction · 2026-07-18 · teja · confident

*"don't do all these just the semantics colors should be verified for now
against the figma and the code."*

---

## Variant axes live on the COMPONENT_SET, not the variants

> gotcha · 2026-09-03 · claude · confident

`componentPropertyDefinitions` is on the parent set. Reading variant frames
cannot see an axis that exists — which is exactly how Select and Tabs shipped
without their whole Medium size while every parity check passed.

`scripts/check-variant-axes.mjs` now reads a committed snapshot of every set's
axes and fails when one is unimplemented and unexcused.

---

## Figma exports a COMPONENT wrapped in its set's chrome

> gotcha · 2026-09-02 · claude · confident

Exporting a single component brings the set's `#AAAAAA` background rect and a
`#9747FF` dashed frame at 1413×803. Take only the `<g id="Property 1=…">`
group. The first coin-icon pass shipped the chrome.
