# 0007 — Composable primitives over configured components

**Status:** accepted · **Recorded:** 2026-08-15

## Context

The first Tier-2 pattern (a pattern being a composition of components, above
Button and below a full page) was the data table, built from a real KoinX
filings screen: nine columns mixing checkboxes, text, status pills, a priority
meter, dates and row actions.

Two shapes were possible. A configured component takes the whole table as
props:

```tsx
<DataTable columns={[…]} data={rows} selectable />
```

Composable primitives expose the parts:

```tsx
<Table><TableHead>…</TableHead><TableBody><TableRow selected>…</TableRow></TableBody></Table>
```

The deciding question was not which is nicer to write, but which an agent can
use correctly for a table nobody anticipated.

## Decision

Ship composable primitives — `Table`, `TableHead`, `TableBody`, `TableRow`,
`TableCell`, `TableHeaderCell` — with the design spec encoded *inside* them:
52px rows, `surface-secondary` header, `border-secondary` dividers drawn as
inset shadows, hover vs selected as distinct states.

A `DataTable` convenience wrapper may come later, built *on* the primitives, so
nothing is rebuilt.

## Alternatives rejected

- **Configured `DataTable` first.** Less code per table and a tidier demo.
  Rejected because every config API eventually meets a layout it cannot express,
  and the escape hatch is `render` props — at which point it is the composable
  API with extra indirection. For an agent, a config object is also a harder
  target: it must learn a bespoke schema instead of composing JSX it already
  reads fluently.
- **Both at once.** Doubles the surface before either is proven.
- **Copy the Figma structure literally**, one component per Figma layer.
  Rejected: Figma nests wrappers for layout reasons that have no meaning in CSS
  flexbox.

## Consequences

- More lines at each call site, and the caller can build an off-spec table.
  Mitigated by encoding the spec in the primitives — the *default* composition
  is correct.
- The primitives are the pattern's contract; the manifest documents them and
  `componentRules` states the non-obvious parts (selected ≠ hover, `width` for
  fixed columns).
- The table's deferred chrome (kebab menu, filter toolbar, selection bar) can be
  added without touching what shipped.
- Sets the template for every later pattern: primitives first, conveniences
  after, spec baked in rather than documented.
