# 0015 — AppShell flexes; the rail is fixed and the content scrolls

**Status:** accepted · **Recorded:** 2026-08-16

## Context

Every KoinX product screen sits in the same frame. Read from the file rather
than measured off a screenshot, Professionals and Taxes agree exactly:

```
Frame 1973341304   1440 wide   HORIZONTAL, gap 24, padding-right 24
  Menu              224 wide   (padding-right 1 — the stroke)
  Content          1168 wide   VERTICAL, gap 8, padding 16 top/bottom
```

`224 + 24 + 1168 + 24 = 1440`. Books runs its content flush to the rail
instead; teja ruled the 24px gutter the house standard, so Books moves onto it.

Two things the frames cannot say: what happens at a width that is not 1440, and
what scrolls.

## Decision

**`AppShellMain` flexes; it does not hard-code 1168.**

```css
.shell { display: flex; gap: var(--spacing-24); padding-right: var(--spacing-24); }
.main  { flex: 1 1 auto; min-width: 0; }
```

At 1440 this resolves to exactly 1168, so the mock is matched by arithmetic
rather than by assertion — and the shell still holds at other widths. It also
means the collapsed rail needs no special case: 61px in, the column becomes
1331 on its own.

**The rail is fixed and the content column scrolls** (`overflow-y: auto` on
`.main`). Beyond the design, flagged as ours.

**The Sidebar is a child, not a prop.** `<AppShell><Sidebar/><AppShellMain/></AppShell>`
rather than `<AppShell sidebar={…}>`.

## Alternatives rejected

- **Fix the content column at 1168px.** Literally faithful to the frame.
  Rejected because it is faithful to the *artboard*, not the design: the number
  is a consequence of 1440 minus the rail and gutters, and freezing it breaks
  every other viewport and forces a second rule for the collapsed rail.
- **Scroll the whole page instead of the column.** Simpler, and what a static
  mock implies. Rejected because the nav disappears on long screens —
  Transactions and the Reports cluster are far taller than the viewport, and
  losing the rail there is exactly when you need it.
- **Take the Sidebar as a prop.** Tidier signature. Rejected per
  [0007](0007-composable-primitives-over-configured-components.md): the rail has
  its own API — collapse, accordion, flyouts, click-away — and routing that
  through AppShell would mean re-exposing all of it as shell props.
- **Cap the column with a `max-width`.** Sensible on an ultra-wide monitor.
  Rejected as invention: the file says nothing about it, and picking a number
  would be my taste, not the design's. Left open below.

## Consequences

- One shell for all three products; Books gains the 24px gutter it lacked.
- Geometry verified at 1440 in both rail states — 224/61, gap 24,
  content 1168/1331, right gutter 24, sum 1440 — plus main's gap 8 and
  padding 16.
- Independent scroll is **not** in Figma. It is verified behaviourally (rail
  top unchanged while the column scrolls 285px, page `scrollY` stays 0) rather
  than visually, per [0011](0011-icon-markup-is-hoisted-per-shape.md).
- **Open:** no `max-width` on the column, so it stretches indefinitely on very
  wide displays. A 1168-wide table at 2560 will look sparse. Worth a designer's
  call before the first wide-screen complaint rather than after.
