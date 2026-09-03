# 0023 — Icon slots size whatever they are given, not only an `<svg>`

Status: accepted

## Context

Every icon slot in XUI is typed `ReactNode` and was sized like this:

```css
.icon { display: inline-flex; }
.icon > svg { width: 12px; height: 12px; }
```

`> svg` matches an SVG element and nothing else. Pass an `<img>`, a wrapper
`<span>`, a Next.js `<Image>`, or any third-party icon that renders one, and the
slot applied no sizing at all.

Measured on `Badge` with the same glyph:

| passed as | result |
|---|---|
| `<svg width=40>` | 20px badge — clamped |
| `<img width=40>` | **44px badge — not** |
| `<img width=24>` | 28px badge |
| `<img width=16>` | 20px badge — passes only because 16 equals the line box |

Which is the worst shape a defect can take: correct at the one size people try
first, wrong at every other, and silent throughout. It was found building a real
screen in the playground, where the design's chip icons are gradient-filled and
therefore exported assets rather than XUI icons.

`Input.leadingIcon` had already been patched by hand to `> svg, > img` — in one
slot. So this had been hit before and fixed locally instead of systemically.

## Decision

**The selector, not the numbers.** `> svg` becomes `> *`, in 23 rules across 11
components. Every width and height is untouched; what changes is which children
the rule reaches.

`> *` matches any element, so it covers `img`, wrappers and third-party icons.
It does not match a bare text node, so passing an emoji string behaves exactly
as before.

## Alternatives rejected

**Move the size onto the slot and let the child fill it.** The first plan, and
it was abandoned once the real rules were read: several slots are already sized
with the child at `100%` (Toast's 40px disc, Dialog's 64px, Input's leading
icons), and Pagination's chevron is 12x8, not square. Moving numbers around 25
rules of three different shapes is more to get wrong than changing one token in
each, for no additional behaviour.

**Extend to `> svg, > img`.** What the one hand-patched slot did. It fixes the
case in front of you and leaves wrappers and every future node type broken —
which is precisely how this became a system-wide problem from a local fix.

**Add a `size` prop and require icons to honour it.** Pushes the burden onto
every caller and every third-party icon, and does nothing for the ones that
ignore it.

**Leave it and document it.** Considered, because the slots are typed
`ReactNode` and one could argue the caller should size their own icon. Rejected:
a type that accepts anything and works for one thing is the bug, not the
documentation gap.

## Consequences

- Any element passed to an icon slot is now sized by the component. A 40px
  `<img>` in a Badge yields a 20px badge instead of a 44px one.
- **Zero visual change**, and that was the acceptance test rather than an
  assertion. Local baselines were brought level first (228 passed, 0 failed),
  the change made, then the suite run again against those same unmoved
  baselines: 228 passed, 0 failed. A single moved pixel would have meant the
  change was not behaviour-preserving.
- Dialog's `.icon svg` was a descendant selector and is now a child one, which
  narrows it while widening the accepted type.
- A wrapper element whose own child is unsized still overflows. `> *` sizes the
  wrapper, not what is inside it. That is better than today and not a guarantee.
- The pattern is now consistent, so the next component to gain an icon slot has
  one shape to copy rather than two.
