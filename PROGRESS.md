# XUI Design System — Progress

Status as of **2026-07-17**. React + TypeScript + Vite + Storybook implementation of the
XUI design system, sourced from the Figma file **XUI (Copy)**
(`figma.com/design/4O4jP8lf2a2kl1XcQaXEqe`).

Repository: <https://github.com/Chebrolu-Tejopriya/xui> (branch `main`)

---

## ✅ Completed

### 1. Project setup
- Vite + React 19 + TypeScript scaffold.
- Storybook 10 (react-vite) with addons: docs, a11y, vitest, Chromatic.
- Example/boilerplate stories removed.
- Git initialized, pushed to GitHub. Commits authored as
  `chebrolutejopriya <chebrolutejopriya@gmail.com>`; pushes authenticate per-repo as
  `Chebrolu-Tejopriya` via the username-in-remote-URL trick (machine-wide login stays
  untouched for other repos).

### 2. Design tokens (`src/tokens/`)
All values pulled from the Figma variable collections — light **and** dark.

| File | Contents |
|---|---|
| `primitives.css` | `--xui-*` color scales: Gray/Blue/Orange/Green/Red 01–12 for light (`:root`) and dark (`[data-theme='dark']`), absolutes, overlay scrims, secondary accents |
| `semantic.css` | Surface / Content / Border semantics mapped onto primitives (theme-aware), border radius (`none/xxs/xs/sm/mid/lg/xl/max/full`), border widths (regular 1px, thick 1.5px), spacing + padding + size collections, elevation shadows (transparent in dark per Figma), overlay/locked scrims |
| `labels.css` | Label collection: `--label-fg-*` / `--label-bg-*` pairs for A–Z and 0–9 (72 tokens) |
| `typography.css` | Inter type scale: Heading 0–6, Subtitle 1–4, Body 0–3, Button 1–3, Label 3–4 |
| `index.css` | Imports all of the above + Inter font + body defaults |

Theme switching works by setting `data-theme="light" | "dark"` on the root element —
semantics resolve automatically.

### 3. Components (`src/components/`) — 16 built
Each has `Component.tsx`, `Component.module.css` (CSS Modules), stories, and a barrel export.

| Component | Coverage |
|---|---|
| Button | 7 variants (primary/secondary/destructive/outline/subtle/ghost/link) × 3 sizes (42/36/32px) × states (hover, disabled, loading), icon left/right, icon-only square + circle, full-width |
| Input | Label, mandatory `*`, helper text + icon, error, disabled, focus ring (2px brand), leading/trailing adornments |
| Select | Trigger + menu, brand-colored selected value, loading spinner, disabled options |
| Checkbox | Checked, unchecked, indeterminate (partial), disabled |
| Radio | Default, selected, disabled |
| Switch | M3-style 52×32 (48×28 icon variant), hover/disabled states, check/close glyphs |
| Badge | Solid (primary/secondary/outline/destructive) + accent tints (primary/secondary/positive/negative) ± border, default + large |
| Tabs | Boxed (brand-filled active) + underline variants, with-icons, hover, disabled |
| Accordion | Single/multiple expand, rotating chevron |
| Tooltip | 4 placements, with/without arrow |
| Dialog | default / destructive / alert variants with exact Figma button layouts, portal + scrim + Esc |
| Toast | default/success/warning/error tinted variants, action button, dismissible |
| Avatar | 5 sizes (20–64px), image with initials fallback on Label tint |
| Breadcrumbs | Icons, hover, disabled, current-page state |
| FileUpload | Figma Default (dropzone card, single/multi lists) + Compact (48px labelled row) |
| Pagination | All 5 Figma variants: Desktop v1/v2/v2-small, Mobile v1/v2 (short label, borderless arrows) |

### 4. Storybook
- `Foundations/Colors` — primitive scales + full semantic swatches.
- `Foundations/Typography` — complete type scale.
- `Foundations/Labels` — all 36 label fg/bg pairs.
- Per-component Playground + variant/state stories.
- **Theme toolbar toggle** (paintbrush icon) switches every story light ↔ dark.
- Run locally: `npm run storybook` → <http://localhost:6006>.
  If it crashes with `importers[path] is not a function`, delete
  `node_modules/.cache/storybook` and restart.

### 5. Token audits (two passes)
- Swept `get_variable_defs` across every section of the ⚛️ Primary Components page —
  light originals **and** the `4707:*` dark copies — plus the Colors-page palettes and
  example screens.
- Fixed after audit: added `content-quaternary/disabled/brand-secondary/warning-primary`,
  `surface-error-tertiary`, `surface-success-disabled`, `border-tertiary`,
  `radius-xxs/mid/none`, spacing/padding/size tokens, exact elevation scrims,
  `border-width-thick = 1.5px` (was wrongly 2px), Label collection, Body/0, Label/3,
  Heading/4, Subtitle/4; removed invented `content-success`, `surface-success-hover`;
  renamed `content-brand`→`content-brand-primary`, `content-error`→`content-error-primary`.
- Dark copies confirmed all dark semantic mappings; dark elevation scrim is transparent.
- Prefix renamed `--fibon-*` → `--xui-*` ("Fibon" was a mishearing of "Figma").

---

## ⏳ Open items

1. **Unbound hover semantics** — user reports tokens like `surface-raised_hover` exist in
   the Figma Variables panel. They are not bound to any layer, so the Figma API cannot
   return them. Waiting on the names/values (screenshot of the Variables panel) to add.
2. **Chromatic publishing** — plan agreed: `develop` branch = staging previews,
   `main` permalink = public URL, GitHub Actions auto-publish. Waiting on the user to
   sign up at chromatic.com (as Chebrolu-Tejopriya) and provide the `chpt_…` project token.
3. **Second-pass components** (in Figma, not yet built): Drawer, Stepper, Slider, Menu,
   Filter, Date/Calendar pickers, Amount, Locked, Widgets (charts),
   Scrollbar, Info, and the 🌟 Icon Library page.
4. **Input error-state spec** — the Figma fetch for it errored; standard red border +
   red helper was applied. Verify against Figma when convenient.

---

## Conventions

- **Never** use `--xui-*` primitives directly in components — go through semantic tokens.
- Components: folder per component, CSS Modules, `forwardRef` where a DOM ref is useful,
  controlled + uncontrolled support where sensible.
- Stories: one `Playground` with controls + fixed stories per variant/state group.
- Verify before pushing: `npx tsc --noEmit -p tsconfig.app.json` and `npm run build-storybook`.
