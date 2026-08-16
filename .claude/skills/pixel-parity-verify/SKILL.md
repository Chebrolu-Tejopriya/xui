---
name: pixel-parity-verify
description: Mandatory final gate before declaring any XUI component (or variant) done — proves the render matches Figma by comparing a Figma PNG export against a same-scale Storybook screenshot plus computed-style numbers, and applies the known browser-vs-Figma correction checklist (native form controls, border box model, VECTOR nodes whose bounding box is not their shape, behaviour assertions for interactive parts, docs-source hang). Run whenever a component is added or visually reworked; a coarse screenshot review is NOT sufficient.
---

# Pixel parity verify (XUI gate)

Every visual miss the user has caught in this project passed a casual
screenshot review and failed the checks below. The failure pattern is
always one of four things — check for all four, every time:

1. **Figma specs describe static rectangles; the implementation uses live
   HTML.** Native controls carry invisible user-agent styling that the
   Figma spec cannot warn about.
2. **Figma strokes take no layout space; CSS borders do.** Anything with
   an explicit height/width plus a border renders bigger than spec unless
   compensated.
3. **Screenshot review at 1x hides 1–2px drift and wrong assets.** Only
   numbers and same-scale image comparison catch it.
4. **A `VECTOR` node's bounding box is not its shape.** Width, height and
   fill describe the box the geometry sits in, never the geometry. See §4.

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

### 4. Vector nodes: export the path, never infer it

**If `get_metadata` reports `type: "VECTOR"`, the numbers next to it are a
bounding box. Stop and export the geometry.** Building from width, height
and fill produces a rectangle, and a rectangle is the one shape a vector
node is least likely to be — anything genuinely rectangular is a `RECTANGLE`
or a frame.

This shipped wrong once already. The Sidebar's selected-item rail reads as
`3 × 22.5`, brand fill, so it went in as a `width: 3px` block. The design is
a trapezoid tapering to the right:

```
M2.5 2.7334 V19.7656 L0.5 21.4326 V1.06738 Z
```

Full height on the outer edge, inset ~8% top and bottom on the inner one.
At 3px wide the difference is a few pixels of slope — invisible in a 1x
review, obvious to the designer who drew it.

Export it (Plugin API; `get_design_context` will not give you path data):

```js
mcp__figma__use_figma({ /* … */ })   // node.exportAsync({ format: 'SVG_STRING' })
```

Then reproduce the geometry rather than approximating it:

- a pseudo-element with `clip-path: polygon(…)` when it must stay out of
  layout (what the rail uses)
- an inline `<svg>` with the path when it is content
- never a `border-radius` guess at a curve you have not read

Applies equally to `BOOLEAN_OPERATION`, `STAR`, `POLYGON` and any node
whose name suggests artwork. When in doubt, export — it costs one call.

### 5. Behaviour is outside this gate — verify it separately

This gate proves a component *looks* right and says nothing about whether
it still works. An icon-only button that renders perfectly at every frame
was silently dropping every click (ADR 0011): the icon rewrote its own DOM
on each render, so mousedown and mouseup landed on different nodes and the
browser never synthesised `click`. Every screenshot and computed-style
assertion passed throughout.

So for anything interactive, add assertions on behaviour, not appearance:

```js
el.addEventListener('click', …)     // count events actually received
new MutationObserver(…)             // DOM churn during an interaction
```

Drive it with real input (`locator.click()`, `.hover()`), not `el.click()` —
a direct DOM call bypasses the hit-testing and event sequence where these
faults live. Assert the resulting state (`aria-expanded`, which overlay is
present) rather than eyeballing a screenshot of it.

### 6. Story-infra guards (both have bitten this repo)

- Matrix/showcase stories MUST set
  `parameters: { docs: { source: { type: 'code' } } }` — the dynamic JSX
  source serializer loops forever on these trees and pegs the preview
  renderer (hang, not crash).
- Screenshot scripts: `animations: 'disabled'`, and if a story hangs in
  the dev iframe but passes vitest, suspect the serializer above, not
  the component.

### 7. Scope

Run the full gate for: new components, new variants, any CSS rework of
an existing component. The gate is per-VARIANT, per-STATE — a component
passing on its default state proves nothing about loading/disabled/
static states (their fills and borders are intentionally irregular in
this design system; pattern inference is how the misses happened).

Companions: [[figma-component-parity]] (what to fetch),
[[component-showcase-stories]] (story shape). This skill is the exit
check after both.
