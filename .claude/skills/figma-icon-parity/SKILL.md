---
name: figma-icon-parity
description: Audit the XUI icon set against the Figma "Icons v2" page — every icon, every tone (outlined/solid/dualtone/dualtone-selected), in BOTH light and dark — and reconcile code to match. Use when adding/re-extracting icons, when the user says an icon "isn't the same as design" or "the color is different", reports a white blob / wrong dual-tone color in dark mode, or wants an icon parity check.
---

# Figma icon parity

Sibling to [[pixel-parity-verify]] (per-component render proof) and
[[figma-variable-parity]] (token collection). This one is icons-specific: it
knows the XUI icon pipeline and the handful of failure modes that hide until you
look in **dark mode**.

## The pipeline (know it before you touch anything)

```
Figma "Icons v2"  ──extract+normalize──►  scripts/icon-data/*.json  ──gen──►  src/icons/icons.tsx
   (design SoT)      (use_figma export)        (raw, faithful)      gen-icons.mjs   (GENERATED)
```

- **`scripts/icon-data/NN-*.json`** — raw inner-SVG per icon, one entry per shape
  (`outlined`/`solid`/`dualtone`), normalized to `currentColor` + 2-dp coords.
  This is the *faithful* record of Figma. Keep Figma's own values here
  (`white`, `currentColor`, `opacity="0.4"`) — do NOT theme it here.
- **`scripts/gen-icons.mjs`** — generator. PascalCase names, builds
  `iconRegistry` + `ICON_VARIANTS`, and (crucially) **`themePaints()`** maps
  Figma's raw paints → design tokens. This is where theming lives.
- **`src/icons/icons.tsx`** — GENERATED. Never hand-edit; re-run
  `node scripts/gen-icons.mjs` after changing data or the generator.
- **`src/icons/createIcon.tsx`** — the factory. Owns the **tone→color** mapping.
- **`src/foundations/Icons.stories.tsx`** — the gallery (search + 4-tone toggle).

Figma: file `CZHLKqp4fOchbR6FkTcPC8`, page canvas `3151:11527`. Each icon is a
component named `Label/Variant`; the four variants are `DualTone-Default`,
`DualTone-Selected`, `Outlined`, `Solid`. Code ships 3 shape assets and exposes
4 tones (selected reuses the dualtone shape in brand color).

## The token contract (what each paint MUST resolve to)

These are the design colors — confirmed against the KoinX semantic system
(`Gray/09` = `content-tertiary`, `Blue/09` = `content-brand-primary`,
`Red/09` = `surface-error-primary`). Verify code matches this, not raw hex:

| Figma paint | Renders as | Where |
|---|---|---|
| outlined / solid glyph | `currentColor` (colorable) | createIcon: no tone color |
| dualtone glyph (grey, `#64748B`) | `var(--content-tertiary)` | createIcon `variant==='dualtone'` |
| dualtone-selected glyph (blue, `#0052FE`) | `var(--content-brand-primary)` | createIcon `variant==='dualtone-selected'` |
| white cut-out (badge ring, knockout) | `var(--xui-icon-knockout, var(--surface-raised))` | gen `themePaints()` |
| notification/alert accent dot (red `#F7324C`) | `var(--surface-error-primary)` | gen `themePaints()` |

`currentColor` and the tone colors go on the `<svg>` (via `color`); per-path
tokens must use inline `style` — **SVG presentation attributes can't resolve
`var()`**, so `fill="var(--x)"` silently fails. `themePaints()` emits `style=…`.

## Step 1 — Render both sides, in BOTH themes

**Figma side (authoritative).** `get_screenshot` returns icons at native 24px —
too small. Upscale via the Plugin API instead (load `figma:figma-use` first):

```js
const page = await figma.getNodeByIdAsync('3151:11527');
await figma.setCurrentPageAsync(page);
for (const id of ['<node ids>']) {           // per-variant component ids from get_metadata
  const n = await figma.getNodeByIdAsync(id);
  await n.screenshot({ scale: 8 });           // ~192px, returned inline
}
return { shot: true };
```

**Code side.** Screenshot the gallery per tone, light AND dark. Dark is where
bugs surface — force it in Playwright:

```js
await p.getByRole('button', { name: 'Dual-tone', exact: true }).click();
await p.evaluate(() => {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.body.style.background = 'var(--surface-primary)';
});
```

Compare the same icon, same tone, side by side.

## Step 2 — The five known failure modes

1. **White blob in dark.** A hardcoded `white` fill/stroke (badge ring, solid
   knockout) rendered literally instead of the surface behind it. → route through
   `themePaints()` to `--xui-icon-knockout`. Affected historically:
   AddWallet, Notification-dot, Tools (solid), Reports (solid).
2. **Lost accent color.** The extraction normalizer flattens *every* hex to
   `currentColor`, which erases intentional accents. Notification-dot's dot is
   red (`surface-error-primary`) in Figma but came through monochrome. → detect
   any icon whose Figma export has a 3rd color (not `#64748B`/`#0052FE`/white)
   and map that paint to its token in `themePaints()`.
3. **Dual-tone renders `currentColor` (white in dark) instead of grey.**
   DualTone-Default is a *specific* color (grey), not "inherit". → createIcon
   defaults `dualtone` to `content-tertiary`, `dualtone-selected` to
   `content-brand-primary`. (This was the real "Calendar looks different" bug —
   the SVG was faithful; the tone color default was wrong.)
4. **clipPath ID collisions.** Figma exports `clip0_<node>`; two instances on a
   page collide. → give unique, stable ids in the data (e.g. `ins_o`/`ins_d`).
5. **Opacity distribution looks off but IS faithful.** e.g. Calendar's body is
   full-opacity, header 40% — that's what `exportAsync` returns. Don't "correct"
   the design; confirm the render matches Figma and move on. The fix for
   "looks heavy/bright" is almost always #3 (tone color), not the opacity.

## Step 3 — Fix in the right layer, then regenerate

- Wrong **paint → token** mapping → `themePaints()` in `gen-icons.mjs`.
- Wrong **tone → color** (dualtone/selected) → `createIcon.tsx`.
- Wrong/missing **geometry** (truncated shape, wrong icon) → re-extract that icon
  into its `icon-data/*.json` (norm: strip `<svg>` wrapper, hex→`currentColor`
  keeping white, round 2dp, collapse whitespace; `use_figma` return truncates at
  ~20KB so batch ≤ ~13 icons).
- **Never edit `src/icons/icons.tsx`.** Run `node scripts/gen-icons.mjs`.

## Step 4 — Verify

- `node scripts/gen-icons.mjs` (prints icon count — must stay 69).
- `npx tsc -p tsconfig.app.json --noEmit`, `npx oxlint src/icons scripts/gen-icons.mjs`, `npm run build`.
- Gallery renders all icons, **both themes**, all four tones — re-screenshot and
  confirm: no white blobs in dark, accents present, dual-tone grey, selected
  blue. State coverage honestly (which tones/themes you actually looked at).

## Guardrails

- Data files stay faithful to Figma; theming happens only in the generator /
  factory. Don't bake tokens into `icon-data/*.json`.
- Faithful ≠ what looks right on a white canvas. Always check dark — the design
  is grey/red/surface-reactive, and only dark exposes hardcoded white.
- A single icon complaint ("Calendar is different") is usually a *systemic* tone
  or knockout bug affecting many icons — fix it centrally in the generator/
  factory, then re-verify the whole set, not just the one named icon.
