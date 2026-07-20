# XUI Design System — Progress

Status as of **2026-07-20**. React + TypeScript + Vite + Storybook implementation of the
XUI design system, sourced from the Figma file **XUI (Copy)**
(`figma.com/design/4O4jP8lf2a2kl1XcQaXEqe`).

Repository: <https://github.com/Chebrolu-Tejopriya/xui> (branch `main`)

**Goal:** an *agentic* design system — consumed by designers, developers, AND coding
agents. Storybook is the shared reference: every component shows its full Figma state
matrix at a glance, Controls expose every Figma customization, and copy chips give
paste-ready imports.

---

## 🧭 Standing decisions (read these first)

1. **Figma is the only source of truth — nothing invented.** If a needed behavior is
   not defined in Figma (scroll, focus, offsets, fallbacks…), it must be flagged and
   approved by the user BEFORE building. Approved beyond-Figma decisions so far:
   - dropdown menus cap at 300px and scroll internally
   - keyboard focus in menus reuses the hover treatment
   - menus open 4px below their trigger
   All three are documented in `src/components/Menu.module.css`.
2. **The Figma "Select" component (section 583:3525) is THE menu spec** for every
   dropdown-style menu (Select, Input Dropdown, Pagination selects, future menus).
   Shared implementation: `src/components/Menu.module.css`. Native `<select>` popups
   are banned — they leak unstylable browser UI.
3. **Package name is `xui`.** Copy chips show `import { X } from 'xui'`;
   `package.json` has `name: "xui"` + an `exports` map pointing at the component
   barrel. Publishing later needs a build step (JS + d.ts) — imports in apps won't
   need to change.
4. **Every new/reworked component must pass the `pixel-parity-verify` gate**
   (`.claude/skills/pixel-parity-verify/`): computed-style assertions + same-scale
   Figma-PNG-vs-screenshot comparison + native-control reset checklist. A PostToolUse
   hook in `.claude/settings.json` reminds the agent automatically whenever a file
   under `src/components/` is written.
5. **Showcase story pattern** (`.claude/skills/component-showcase-stories/`): one nav
   leaf per Figma variant, each leaf stacking ALL states of that variant, args-driven
   Controls threaded into every row. `StateShowcase` in
   `src/components/Input/storyLayout.tsx` is the shared layout.
6. **Figma-vs-CSS box model**: Figma strokes take no layout space; CSS borders do.
   Elements sized by padding+line-height must shave the border (e.g. outline Button
   pads 7/15 not 8/16); flush badges overlap the field border with -1px margins.
7. Commits authored as `teja <chebrolutejopriya@gmail.com>` (repo-local git config).

---

## ✅ Completed

### 1. Project setup
- Vite + React 19 + TypeScript scaffold.
- Storybook 10 (react-vite) with addons: docs, a11y, vitest, Chromatic, MCP.
- `npm test` runs the story test suite (vitest browser mode + Playwright chromium).
  CJS deps of the addon-vitest setup (`aria-query`, `lz-string`, `pretty-format`,
  `dom-accessibility-api`) are pre-bundled in `vite.config.ts` — required for browser
  mode to work.
- Git on GitHub; commits as `teja`, push authenticates as `Chebrolu-Tejopriya`.

### 2. Design tokens (`src/tokens/`)
All values pulled from the Figma variable collections — light **and** dark.

| File | Contents |
|---|---|
| `primitives.css` | `--xui-*` color scales: Gray/Blue/Orange/Green/Red 01–12 for light (`:root`) and dark (`[data-theme='dark']`), absolutes, overlay scrims, secondary accents |
| `semantic.css` | Surface / Content / Border semantics mapped onto primitives (theme-aware), border radius, border widths, spacing/padding/size, elevation shadows, overlay/locked scrims |
| `labels.css` | Label collection: `--label-fg-*` / `--label-bg-*` pairs for A–Z and 0–9 (72 tokens) |
| `typography.css` | Inter type scale: Heading 0–6, Subtitle 1–4, Body 0–3, Button 1–3, Label 3–4 |
| `index.css` | Imports all of the above + Inter font + body defaults |

Theme switching: `data-theme="light" | "dark"` on the root element.

### 3. Components (`src/components/`) — 16 built

| Component | Coverage |
|---|---|
| Button | **Full 28-node Figma audit.** 7 variants × 3 sizes (42/36/32) × Default/Hover/Loading/Disabled; per-variant loading fills (primary→solid, secondary/destructive→subtle, outline mutes border+text, subtle→surface-primary, ghost/link mute text; 4px gap, 20/16/14 spinner, icons hidden while loading); text-button icons 18/16/14 at 6px gap; icon-only = Figma "just icon" (outline-style squares 36/32/30, circles 44/40/38, icons 20/16/14) regardless of variant; `[data-hover]` twins for static hover rows |
| Input family | **Full 10-state Amount/Amount-Static audit** + base 5-state audit. Shared field chrome: 48px, radius 6, double-ring focus/error (2px color + 2px surface gap + 1px border), error interior lifts to surface-raised, disabled hides the mandatory asterisk (space kept), flush badges overlap the field border. Variants: Default, Password, Secret Key, Date, **Dropdown + Dropdown with icon (two leaves, like Figma)**, Mobile Number, Amount, Amount-Static, OTP. Error helper rows use Icons/warning_amber in error red |
| Select | Trigger per Figma select frame; menu = shared Figma Select spec (see decisions) |
| Checkbox | Checked, unchecked, indeterminate, disabled |
| Radio | Default, selected, disabled |
| Switch | M3-style 52×32 (48×28 icon variant), hover/disabled, check/close glyphs |
| Badge | Solid + accent tints ± border, default + large |
| Tabs | Boxed (brand-filled active, px-5/py-4 container) + **underline variant** (2px brand underline + brand text), with-icons (20px), whole-tablist disabled (active = brand-subtle + 70% white label) |
| Accordion | Single/multiple expand, rotating chevron |
| Tooltip | 4 placements, with/without arrow |
| Dialog | default / destructive / alert with exact Figma button layouts, portal + scrim + Esc |
| Toast | default/success/warning/error tints, action button, dismissible |
| Avatar | 5 sizes, image with initials fallback on Label tint |
| Breadcrumbs | Icons, hover, disabled, current-page |
| FileUpload | Figma Default (radius-16 card, dashed dropzone, 56px brand cloud; single lists BELOW dropzone, multiple ABOVE — per Figma) + Compact (48px labelled row; single uploaded replaces the box with a solid-bordered file row). Real file input + drag-and-drop. Icons verified: cloud=brand, attach=tertiary, delete=error-red |
| Pagination | All 5 Figma variants (Desktop v1/v2/v2-small, Mobile v1/v2 with short "of N" + borderless 32px arrows). Cells exactly 36/32px (30px v2-small rows select). Page + rows selects are custom listboxes using the shared Figma menu — arrows/Escape/outside-click |

Shared menu: `src/components/Menu.module.css` — white panel, 1px surface-primary
border, radius 6, elevation-sm, 5px padding; items 6×8px Subtitle/2
content-secondary radius 6, unselected indent 32px; selected = surface-primary fill
+ 16px check; hover/focus = surface-primary; disabled = content-quaternary.

### 4. Storybook (the agentic showcase)
- **Nav = Figma variants.** Button → Primary…Link + Icon Only; Input → 9 leaves
  incl. Dropdown / Dropdown with icon; Tabs → Default / With icons / Underline;
  File Upload → Default / Compact; Pagination → single leaf with all 5 variant rows.
- Every leaf stacks its full state matrix (Default/Hover/Loading/Disabled/Sizes etc.)
  with live Controls; icon props use select+mapping so they're pickable.
- **Copy-import chips** on every component story: `import { X } from 'xui';` with a
  one-click Copy button. Auto-derived from `meta.component`; override or suppress via
  `parameters.copyImport`. Implementation: `.storybook/CopyImportChip.tsx` (also holds
  the `PACKAGE_NAME` constant) + global decorator in `.storybook/preview.tsx`.
- **Foundations/Colors: click any swatch to copy `var(--token)`** (primitives,
  accents, labels, semantics). Typography doesn't have copy yet.
- Theme toolbar toggle switches light ↔ dark.
- Run: `npm run storybook` → <http://localhost:6006>.

### 5. Token audits (two passes) — unchanged, see git history for details.

---

## ⚠️ Known Storybook traps (cost hours — don't rediscover)

1. **Matrix stories MUST set `parameters: { docs: { source: { type: 'code' } } }`.**
   addon-docs' dynamic JSX source serializer ("Show code") loops forever on
   showcase-matrix trees and pegs the preview renderer — the story tab hangs on the
   loading skeleton with 100% CPU. Bisected + verified 2026-07-19. Already set on
   Button/Pagination/Tabs/FileUpload metas; copy the parameter into every new
   showcase meta.
2. **Cache corruption**: if Storybook crashes with `importers[path] is not a
   function` or behaves impossibly, `rm -rf node_modules/.cache/storybook
   node_modules/.vite` and restart.
3. Headless screenshots: pass `animations: 'disabled'`; never force focus
   programmatically (hangs captures — use native `autoFocus` or omit the row).
4. Full `npm test` occasionally has random 15s-timeout flakes under load
   (different stories each run). Re-run or test the target folder;
   single-component runs are reliable.

---

## ⏳ Open items / next steps

1. **Icon library** — user is locating the icon source in Figma. Plan agreed:
   download real SVGs → `src/icons/` (one component each, currentColor) → searchable
   Storybook gallery with click-to-copy `import { InfoIcon } from 'xui'`. Then replace
   the hand-drawn story icons (storyIcons.tsx, Button/Tabs/FileUpload inline icons)
   with the real assets.
2. **Typography copy chips** — same click-to-copy as Colors, for `var(--type-*)`.
3. **Second-pass components** (in Figma, not yet built): Drawer, Stepper, Slider,
   Menu, Filter, Date/Calendar pickers, Locked, Widgets (charts), Scrollbar, Info.
   Workflow per component: metadata → fetch EVERY state (figma-component-parity) →
   build → showcase stories → pixel-parity-verify gate → user checks locally → commit.
4. **Publishing prep** — build step (tsup/vite lib mode) + d.ts so `xui` can be
   npm-published; imports already match.
5. **Unbound hover semantics** — `surface-raised_hover` etc. exist in Figma Variables
   but aren't bound to layers; waiting on a Variables-panel screenshot to add them.
6. **Chromatic publishing** — waiting on the user's `chpt_…` project token.
7. **Push to GitHub** — local `main` is several commits ahead; push when user says so.

---

## Conventions

- **Never** use `--xui-*` primitives directly in components — semantic tokens only.
- Components: folder per component, CSS Modules, `forwardRef` where useful,
  controlled + uncontrolled where sensible.
- Stories: showcase pattern (see standing decision 5); expanded Controls;
  `docs.source.type = 'code'` on matrix stories.
- Native form controls always get explicit resets (appearance/height/font) —
  see the pixel-parity-verify skill.
- Verify before pushing: `npx tsc --noEmit -p tsconfig.app.json`, `npm test`,
  and the parity gate for anything visual.
