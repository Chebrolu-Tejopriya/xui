---
name: pixel-parity-verify
description: Mandatory final gate before declaring any XUI component (or variant) done — proves the render matches Figma by comparing a Figma PNG export against a same-scale Storybook screenshot plus computed-style numbers, and applies the known browser-vs-Figma correction checklist (native form controls, border box model, docs-source hang). Run whenever a component is added or visually reworked; a coarse screenshot review is NOT sufficient.
---

# Pixel parity verify (XUI gate)

Every visual miss the user has caught in this project passed a casual
screenshot review and failed the checks below. The failure pattern is
always one of three things — check for all three, every time:

1. **Figma specs describe static rectangles; the implementation uses live
   HTML.** Native controls carry invisible user-agent styling that the
   Figma spec cannot warn about.
2. **Figma strokes take no layout space; CSS borders do.** Anything with
   an explicit height/width plus a border renders bigger than spec unless
   compensated.
3. **Screenshot review at 1x hides 1–2px drift and wrong assets.** Only
   numbers and same-scale image comparison catch it.

## The gate (run before saying "done")

### 1. Numeric assertions via Playwright

Screenshot review comes second; numbers come first. For each state row:

```js
getComputedStyle(el).height      // must equal the Figma px exactly
getComputedStyle(el).backgroundColor / color / borderColor  // exact rgb()
// gaps: rectB.left - rectA.right against the Figma gap value
```

Known traps this catches:
- Native `<select>`/`<input>`/`<button>` line-height inflating cell
  heights (Pagination cells rendered 37px vs spec 36px).
- Border-inclusive sizing: an element with `height: Hpx` + border is
  correct (border-box), but one sized by padding + line-height + border
  is 2px over — shave the padding (`.outline` button: 7px/15px, not
  8px/16px).

### 2. Native-control reset checklist

If the component renders any of these, the corresponding reset is
non-negotiable:

- `<select>` → `appearance: none`, explicit height, custom chevron as an
  inline SVG in `currentColor` inside a positioned wrapper (NOT a
  hardcoded data-URI — it must follow the theme). Padding-right must
  reserve icon width + Figma gap.
- `<input>` → font/color/line-height set explicitly; never trust UA
  defaults inside a fixed-height field.
- `<button>` → `font-family` reset (UA buttons default to system font).

### 3. Same-scale image comparison against Figma

```
mcp__figma__download_assets({ nodeId, fileKey, defaultFormat: "png", defaultScale: 3 })
curl -sL -o figma-ref.png "<url>"
```

Then screenshot the Storybook story at `deviceScaleFactor: 3` (crop to
the component) and LOOK AT BOTH IMAGES side by side. Read both images —
do not diff mentally from memory. Check specifically: chevrons/arrows
(shape, size, weight), border colors at corners, text weight of labels
vs values (Figma often mixes Regular labels with Medium values in one
row), icon colors (download the SVG asset and read the hex — never
assume the token; this project has had #334155 vs #64748B and
#e2e8f0-vs-#cbd5e1 inversions that "looked fine").

### 4. Story-infra guards (both have bitten this repo)

- Matrix/showcase stories MUST set
  `parameters: { docs: { source: { type: 'code' } } }` — the dynamic JSX
  source serializer loops forever on these trees and pegs the preview
  renderer (hang, not crash).
- Screenshot scripts: `animations: 'disabled'`, and if a story hangs in
  the dev iframe but passes vitest, suspect the serializer above, not
  the component.

### 5. Scope

Run the full gate for: new components, new variants, any CSS rework of
an existing component. The gate is per-VARIANT, per-STATE — a component
passing on its default state proves nothing about loading/disabled/
static states (their fills and borders are intentionally irregular in
this design system; pattern inference is how the misses happened).

Companions: [[figma-component-parity]] (what to fetch),
[[component-showcase-stories]] (story shape). This skill is the exit
check after both.
