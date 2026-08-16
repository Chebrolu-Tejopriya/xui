# 0011 — Icon markup is hoisted per shape, not rebuilt per render

**Status:** accepted · **Recorded:** 2026-08-16

## Context

Clicking an item in the collapsed sidebar did nothing. Not "the handler ran and
the state was wrong" — the handler never ran, and neither did the story's own
`onClick`. Instrumenting the native event sequence showed why:

```
pointerdown  target=path  inBtn=true
mousedown    target=path  inBtn=true
pointerup    target=path  inBtn=true
mouseup      target=path  inBtn=true
(no click)
```

Every pointer event landed inside the button, and the browser still refused to
synthesise `click`. A `MutationObserver` on the icon explained it: the `<svg>`
element survived, but its children were replaced (`childList +3/-3`) on *every*
re-render — including the one triggered between `mousedown` and `mouseup` by
the button taking focus. `click` only fires when mousedown and mouseup resolve
to the same node, so replacing the `<path>` under the cursor cancels it.

The cause is in `createIcon`:

```tsx
dangerouslySetInnerHTML={{ __html: paths[shape] }}
```

`paths[shape]` is a module constant, so the *markup* never changed — but the
wrapper object was a fresh literal each render. React compares
`dangerouslySetInnerHTML` **by reference**, not by comparing `__html`, so it
rewrote the subtree every time.

This was never a Sidebar bug. Every icon-bearing control in XUI dropped clicks
whenever anything re-rendered it mid-interaction; the sidebar merely re-rendered
on hover, so it failed every time instead of intermittently.

## Decision

**Build one `{ __html }` object per shape at factory time and reuse it.**

```tsx
export function createIcon(displayName: string, paths: Record<IconShape, string>) {
  const html: Record<IconShape, { __html: string }> = {
    outlined: { __html: paths.outlined },
    solid:    { __html: paths.solid },
    dualtone: { __html: paths.dualtone },
  };
  // …
  <svg dangerouslySetInnerHTML={html[shape]} />
```

The reference is now stable for the lifetime of the module, so React skips the
subtree entirely unless the shape actually changes. The icon's DOM is inert
across re-renders.

Paired with it, in `Sidebar`, `show()` became idempotent — `getBoundingClientRect()`
returns a fresh object on every call, so an unguarded `setRect` re-rendered on
every `mouseenter`, and the rewritten icon DOM re-fired `mouseover`/`mouseenter`
underneath the cursor. The two defects sustained a render loop between them:
measured DOM mutations for one hover-and-click pass went from unbounded to 8.

## Alternatives rejected

- **Wrap `Icon` in `React.memo`.** Treats the symptom and only sometimes: the
  sidebar passes `variant` and `size` as stable primitives so memo would have
  held, but any caller passing `style={{…}}` or a handler inline defeats it and
  the click silently dies again. A correctness property should not depend on
  call-site discipline — same reasoning as
  [0007](0007-composable-primitives-over-configured-components.md).
- **Emit the paths as real JSX children instead of `dangerouslySetInnerHTML`.**
  The genuinely clean fix, and where this should end up. Rejected *for now*
  because it means teaching `gen-icons.mjs` to parse SVG into React elements and
  re-generating all 69 icons — a change to the generator ([0002](0002-derive-artefacts-never-hand-maintain.md))
  and a much larger diff than the defect warrants. Recorded as follow-up.
  **Adopted 2026-08-16** — see the update below.
- **`pointer-events: none` on the icon.** Would stop the `<path>` from ever
  being an event target, so mousedown and mouseup would both resolve to the
  button. Rejected as a disguise: the DOM churn, and its cost, would remain, and
  the loop in the sidebar would still run.
- **Stop re-rendering on hover only.** Fixes the sidebar and leaves the landmine
  armed for every other component.

## Consequences

- Icon-bearing buttons receive clicks reliably, including while re-rendering.
- Icons no longer rewrite their subtree on re-render — less work on every list,
  table and nav that draws them.
- `dangerouslySetInnerHTML` is compared by reference. That is not obvious and it
  fails *silently and remotely* — the symptom surfaced two components away from
  the cause. The hoisting carries a comment saying so.
- A parity gate would not have caught this. It is a behaviour defect, not a
  visual one — the icon rendered perfectly at every moment. Worth remembering
  when weighing [0004](0004-parity-gates-assert-numbers-first.md): screenshots
  and computed styles say nothing about whether a control still works.

## Update — 2026-08-16: `dangerouslySetInnerHTML` removed entirely

The follow-up above is done. `gen-icons.mjs` now converts the extracted SVG
markup to JSX children, and `createIcon` takes `Record<IconShape, ReactNode>`:

```tsx
export const OverviewIcon = createIcon('OverviewIcon', {
  outlined: (
    <>
      <path fillRule="evenodd" d="…" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  // …
});
```

The converter is a ~40-line tokeniser in the generator, no dependency added.
It handles the whole vocabulary the extracted data uses — 6 element types, ~20
attributes, no text nodes — kebab-to-camel attribute names, `style` strings to
objects, and nested `defs`/`clipPath`. It throws on unbalanced markup rather
than emitting something that will not compile.

This is strictly better than hoisting the `{ __html }` object: the shapes are
now element trees built once at module scope, so React compares them by
reference and skips the subtree outright, and there is no raw-HTML sink in the
component at all.

Verified by walking the rendered DOM against the source markup for all 69 icons
in all 4 variants — tag names and full attribute maps, order-insensitive — plus
the interaction assertions from
[0012](0012-collapsed-sidebar-overlay-model.md):

```
Outlined   icons=69  nodes=214  mismatches=0
Solid      icons=69  nodes=122  mismatches=0
Dual-tone  icons=69  nodes=187  mismatches=0
Selected   icons=69  nodes=187  mismatches=0
```

One benign difference the comparison surfaced: switching variants leaves an
empty `style=""` on nodes React previously styled, because clearing a style
property empties the attribute rather than removing it. No rendering effect.
