# Building UI with XUI

Read this before writing any UI in this design system. The machine-readable
contract is **[`xui.manifest.json`](./xui.manifest.json)** — every component, its
props and variants, the full token inventory, and the composition rules. Load
that file when you need exact names; this page is the orientation.

```
xui.rulebook.json   colour truth   primitives -> semantics, hex -> token, per theme
xui.manifest.json   the contract   components + props + variants + tokens + rules
```

Both are **generated** (`npm run ds:build`) from `src/tokens/*.css` and
`src/components/**`, so they cannot drift from the code. Never edit them by hand.

## The three rules that matter most

1. **Never write a raw colour.** No `#hex`, no `rgb()`, and no primitive
   (`var(--gray-04)`). Use a semantic token: `var(--surface-tertiary)`.
   Primitives exist only to define semantics.
2. **Semantic tokens are theme-reactive.** The same token resolves in light and
   dark automatically. A hardcoded colour silently breaks dark mode — this is
   the single most common bug in this repo's history.
3. **Compose existing components.** If a pattern needs something that doesn't
   exist, say so rather than hand-rolling a one-off.

`npm run lint:tokens` enforces rule 1 and tells you which token to use
(`--fix` rewrites the unambiguous ones). It's the code-side mirror of the
**xemantics** Figma plugin — both resolve a colour through the same rulebook,
so design and code agree.

## Picking a token

| You are styling | Use |
| --- | --- |
| page background | `surface-primary` |
| card, panel, table row | `surface-raised` |
| table header, hovered row, subtle button | `surface-secondary` |
| inset wells, disabled fills | `surface-tertiary` |
| a **selected** row or nav item | `surface-brand-secondary` |
| primary action | `surface-brand-primary` → hover `surface-brand-solid` |
| body text | `content-primary` |
| supporting text | `content-secondary` |
| placeholder / meta / icons beside text | `content-tertiary` |
| text on a solid brand or status fill | `content-absolute-white` (never `content-primary`) |
| control border | `border-primary` |
| table borders & dividers | `border-secondary` |
| status / category pills | a `label-*` pair (`label-info-bg` + `label-info-content`) |

Spacing, radius, and typography have tokens too (`--radius-mid`,
`--spacing-lg`, `--type-body-2`) — see `tokens` in the manifest.

## Composing a screen

```tsx
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell,
         Badge, Checkbox, Button, WalletIcon } from 'xui';
```

A data-table page is: page header (title + primary action) → filter/search
toolbar → `Table` → `Pagination`. Selection surfaces a floating action bar.

Component-specific rules an agent gets wrong without being told (the full list
is `componentRules` in the manifest):

- **Table** — rows are 52px; hover is `surface-secondary` but **selected is
  `surface-brand-secondary`** — different states. Dividers are inset
  box-shadows, not borders, so rows keep their exact height. Give a cell a
  `width` for a fixed column, omit it for an equal-share one.
- **Button** — heights 44/36/32. Icon-only is its own treatment (bordered
  square/circle), not the variant squared off; pass the icon as `children` and
  always set `aria-label`. `secondary` is the orange family, intentionally.
- **Badge** — use `label-*` variants for status pills; they're 20px tall.
- **Icons** — four tones: `outlined`, `solid`, `dualtone` (defaults to
  `content-tertiary`), `dualtone-selected` (brand). 69 icons, 11 categories.

## Anti-patterns

- `background: #fff` for a card — stays white in dark mode. Use `surface-raised`.
- `content-primary` on a brand-filled button — invisible in one theme.
- A CSS border on a fixed-height element without shaving the padding — renders
  2px taller than spec. Figma strokes take no layout space; CSS borders do.
- Re-implementing a table with `<div>`s when `Table`/`TableRow`/`TableCell`
  already encode the spec.
- `surface-secondary` for a selected row — that's the *hover* treatment.

## Checks

```bash
npm run ds:check      # rebuild the contract + lint tokens
npm run lint          # oxlint
npm run build         # tsc + vite
npm run storybook     # visual review at :6006
```

Design changes come from Figma, not from guessing — the parity skills in
`.claude/skills/` (`figma-component-parity`, `figma-icon-parity`,
`figma-variable-parity`, `pixel-parity-verify`) define how to pull a spec and
prove a render matches it.
