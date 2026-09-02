# Figma to code

### From a Figma frame to XUI code

Figma is the source of truth for XUI — nothing goes in that is not in the file,
and anything beyond it is recorded as a decision rather than slipped in
(ADR 0001). This page is the procedure for actually doing that, and the traps
that make a frame and a browser disagree.

---

### 1. Find the component before you measure anything

Most frames are already built. Reading pixel values off a design that XUI
already implements is the most common way to spend an afternoon rebuilding
something worse.

```bash
# agents
list_xui_components
```

Or read **Choosing Components**, which covers the cases where two components
look alike in a frame and behave differently in a browser.

Only measure the parts *between* components — page padding, a card, a grid.

### 2. Read the binding, not the pixel

A Figma layer's fill is either **bound to a variable** or a **raw hex**. They
need different handling, and the difference matters more than it looks.

**Bound to a variable.** The variable path *is* the answer. `Surface/Raised` is
`--surface-raised`. Do not translate the resolved colour — translate the name.
The whole point of the binding is that it survives a theme change; a hex does
not (ADR 0006).

**A raw hex.** Resolve it rather than guessing:

```
get_xui_tokens({ hex: "#f1f5f9" })

  #f1f5f9 is the primitive gray-02.
  Use one of these semantic tokens instead: var(--surface-primary)
```

Or let the linter do it after the fact:

```bash
npx xui-lint-tokens src
```

**The same hex is not always the same token.** `#ffffff` as a background is
`--surface-raised`; as text it is something else entirely. Context decides, which
is why the resolver takes the CSS property into account and why an unresolvable
case is *suggested* rather than auto-fixed.

### 3. Spacing: read the auto-layout, then check the scale

Select the frame, read its gap and padding from the auto-layout panel. Then
check the number is on XUI's scale: `2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 64`.

**If it is off the scale, that is a question, not a rounding error.** Write the
literal value, flag it, and ask. XUI's EmptyState shipped with a literal `21px`
and `37px` for exactly this reason; both turned out to be nudges and became
`--spacing-20` and `--spacing-40` — but that was the designer's call to make,
not the implementer's. A silent 1px "correction" is still a deviation from the
source of truth.

### 4. The traps

These are the ones this codebase has actually been caught by, more than once.

#### A stroke takes no space; a border does

This is the single most repeated correction in XUI. In Figma a stroke is drawn
*on* the shape and changes nothing about layout. In CSS a border is part of the
box.

So a 44px frame with a 1px stroke and 12px padding becomes a **46px** element if
you write it literally. Shave the padding, or set `box-sizing: border-box` and
pin the height.

#### A frame is one width; a page is not

Figma draws at 1440. Pasting those pixel widths onto a table's columns is
precisely what stops it being responsive — fixed columns cannot shrink, so they
overflow and get clipped.

Translate *intent*, not measurement: a column that holds text should fill and
share spare space (`width={n} fill`); only content that cannot reflow gets a
fixed width — a checkbox, a meter, a row of icons.

#### Text is measured at the string that happens to be there

Figma frequently pins a text block to a width with wrapping off, so the number
you measure only holds for that exact sentence. XUI's EmptyState draws its text
at 330 with the description set to nowrap — the text overflows its own frame in
the file. A real description has to wrap, so that number became a `max-width`
cap taken from the widest line the design actually draws, not a width.

The related version: a **label** must never be the thing that truncates. Widths
measured off a Figma filter bar were 1–3px short of the placeholders they held,
so every label rendered an ellipsis.

#### A selected value is wider than its placeholder

Placeholders are Body; a chosen value renders in Subtitle at 500 weight. A box
sized to fit the placeholder clips the moment someone picks something.

#### A VECTOR node's bounding box is not its shape

Measuring an icon's frame gives you the box, not the glyph. Icons in XUI carry
their own sizing; pass `size`, do not wrap them in a measured div.

### 5. What Figma cannot tell you

A static frame has no time in it. These are **not** in the file and never will
be, so they are decisions to make and flag rather than values to read:

- What dismisses an overlay — Escape, a scrim click, a swipe
- What scrolls when content outgrows its box
- Hover, focus and active states not drawn as separate frames
- What happens between 375 and 1440
- Motion of any kind

XUI records these as "beyond Figma" on the **Status** page, split into what a
designer has approved and what is still ours to decide. Add to that list rather
than deciding quietly.

### 6. Verify by measuring, not by looking

A screenshot comparison catches a wrong colour. It does not catch a box that is
2px too tall, and that is the error that actually happens.

Measure the rendered element and compare the numbers to the frame:

```js
const r = el.getBoundingClientRect();
const c = getComputedStyle(el);
// r.height, c.padding, c.borderWidth — against the Figma frame
```

XUI's Drawer header was found to be 8px short of the design this way, after a
screenshot review had passed it. The cause was a close control rendering as a
bare 24px glyph where Figma draws a 32×32 instance — invisible by eye, obvious
in a measurement.
