# 0012 — Collapsed sidebar: hover names, click opens, never both

**Status:** accepted · **Recorded:** 2026-08-16

## Context

The Figma file specifies what the collapsed rail's overlay *looks* like —
`Overlay/*`, 241px, `surface-raised`, `radius-mid`, `elevation-md` — and the
tooltip's appearance separately. It says nothing about what **triggers** either,
or what dismisses them. Static frames cannot: both are interaction states.

That gap has to be filled to ship the component, and the first fill was wrong.
Hover opened the flyout, which conflated two jobs: a collapsed rail needs to
tell you what an icon *is* (every item, cheaply) and let you reach a section's
children (only items that have them). Hover-to-open served the second and
starved the first — items with sub-items never showed their name.

Making the flyout click-opened fixed that but introduced a subtler fault: it
stayed open until an explicit click-away, so returning to that item showed a
stale overlay where its tooltip belonged, and hovering a neighbour put a tooltip
and an overlay on screen together.

## Decision

**Hover names the item. Click opens its section. Only ever one of them.**

| Gesture | Result |
|---|---|
| Hover any item | Tooltip with the item's label |
| Click an item with sub-items | Flyout panel; its tooltip suppressed |
| Click it again | Flyout closes, tooltip returns |
| Click a leaf item | Any open flyout dismisses |
| Move to another item | Flyout dismisses, that item's tooltip shows |
| Leave the rail | Flyout dismisses |
| Click outside the rail | Flyout dismisses |

Dismissal on pointer-leave is safe because the panel is `position: fixed` but
still a **DOM descendant** of the `<nav>` — so `mouseleave` does not fire while
the pointer is inside it, including while crossing the 8px gap.

Expanded, none of this applies: sub-lists are inline and mouse-leave does not
close them. The rule is guarded on `collapsed`.

## Alternatives rejected

- **Hover opens the flyout** (the original). Rejected: it denies a name to
  exactly the items with the most going on, and makes a 241px panel appear from
  a passing mouse.
- **Flyout persists until click-away, like a menu.** The conventional behaviour,
  and defensible. Rejected because this rail also has a hover affordance: a
  persistent panel means hover and click results coexist, and the user reads
  the leftover overlay as "hover opened this". A menu bar has no competing
  hover state; this does.
- **Suppress the tooltip whenever any flyout is open.** Removes the double-overlay
  symptom without addressing staleness — you would hover an item and get
  nothing at all.
- **Open on hover after a delay, as submenus often do.** Rejected as more state
  (timers, intent detection) for a rail with at most a dozen entries, and it
  still leaves the naming problem unsolved during the delay.

## Consequences

- Every collapsed item can be identified by hover, including sections.
- At most one overlay is on screen at any time, in any gesture sequence.
- Pointer-leave dismissal depends on the panel remaining a DOM descendant of
  the `<nav>`. Portalling it later would silently break that; the code says so
  at the handler.
- This is behaviour Figma does not specify, so it is **ours, not the design's** —
  flagged under [0001](0001-figma-is-the-single-source-of-truth.md) and worth
  confirming with the designer, who may want the hover/click split reflected in
  the file as explicit interaction notes.
- Verified behaviourally rather than visually, for the reason in
  [0011](0011-icon-markup-is-hoisted-per-shape.md): a parity gate cannot see any
  of this.
