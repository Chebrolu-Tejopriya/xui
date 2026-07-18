---
name: figma-variable-parity
description: Audit a whole Figma variable collection (Semantics, Tokens, or any named collection) against code + Storybook by reading the ENTIRE collection via the Figma Plugin API — then reconcile code to match it exactly. Use when the user asks "are the colors/tokens the same as Figma", "run a parity check on the semantic variables", wants code made an exact mirror of a Figma collection, or when a token audit must be complete (every token) rather than sampled.
---

# Figma variable-collection parity

Sibling to [[sync-figma-tokens]] (screenshot-driven, user pastes the Variables
panel) and [[figma-component-parity]] (per-component state matrix). This one is
for a **complete, MCP-driven audit of an entire variable collection** — every
token, read straight from Figma, diffed against both code sources, then
reconciled.

## Why not get_variable_defs

`mcp__figma__get_variable_defs` is **node-scoped** — it only returns variables
*bound to the node subtree you pass it*. It can never enumerate a full
collection, and it silently omits any token no queried component happens to
use. A node-scoped audit here missed 3 real value bugs. **Do not use it for
collection parity.** (It's still fine for "what does this one component bind".)

## Step 1 — Dump the full collection via the Plugin API

Load the `figma:figma-use` skill first, then run this **read-only** `use_figma`
script (pass `skillNames: "figma-use"`). It returns every variable's name and
the primitive it aliases in Light mode — the exact mapping to diff against code:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const col = collections.find(c => /semantic/i.test(c.name)); // or /tokens/i, etc.
if (!col) return { error: 'not found', collections: collections.map(c => c.name) };
const mode = col.modes.find(m => /light/i.test(m.name)) || col.modes[0];
const h = n => Math.round(n * 255).toString(16).padStart(2, '0');
const out = [];
for (const id of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v) continue;
  const val = v.valuesByMode[mode.modeId];
  let resolvesTo;
  if (val && val.type === 'VARIABLE_ALIAS') {
    const t = await figma.variables.getVariableByIdAsync(val.id);
    resolvesTo = t ? t.name : '(unresolved alias)';      // e.g. "Green/04"
  } else if (val && typeof val === 'object' && 'r' in val) {
    resolvesTo = '#' + h(val.r) + h(val.g) + h(val.b);   // raw color, no alias
  } else {
    resolvesTo = JSON.stringify(val);
  }
  out.push({ name: v.name, resolvesTo });
}
return { collection: col.name, mode: mode.name, count: out.length, vars: out };
```

XUI file key: `4O4jP8lf2a2kl1XcQaXEqe`. The Semantics collection is 45 tokens
(25 Surface / 13 Content / 7 Border) and uses a `-solid`/`-subtle` naming
scheme (NOT `-hover`/`-disabled`). Figma mixes `_` and `-` in leaf names
(e.g. `surface-success_subtle`) — code normalizes all to kebab-case hyphens.

## Step 2 — The three sources

1. Figma collection (from Step 1) — source of truth.
2. `src/tokens/semantic.css` — the CSS custom properties.
3. `src/foundations/Colors.stories.tsx` — has BOTH a `semanticValueMap`
   (token → primitive, for display) AND a `semanticGroups` list (which tokens
   render, grouped). Both must be updated together with semantic.css, or the
   Storybook swatch page drifts from the stylesheet.

Diff Figma ↔ semantic.css by resolved primitive (Figma `Green/04` == code
`var(--green-04)`). Primitives were already verified elsewhere, so matching the
alias name is sufficient — no need to re-check hexes.

## Step 3 — Sort every mismatch into three buckets

- **Value bug** — same/related token, wrong primitive (e.g. code
  `surface-success-secondary: green-03` but Figma says `Green/04`). Code is
  objectively wrong; fix the alias.
- **Name drift** — right value, different name (e.g. code
  `surface-brand-hover` = Figma `surface-brand-solid`, both blue-10). A rename;
  value-preserving so zero visual change.
- **Code-only** — token exists in code, not in Figma at all. Remove for an
  exact mirror (confirm no component depends on it first).

Also flag **Figma-only** tokens (in Figma, absent from code) — those need
adding.

## Step 4 — Reconcile (only when the user wants code = Figma exactly)

1. **Grep the blast radius first**, before renaming anything, so no component
   ends up pointing at a deleted variable:
   ```
   grep -rnE 'surface-(brand|error|warning|success)-(hover|disabled)|<other old names>' src
   ```
2. Rewrite the collection block in `semantic.css` to the exact Figma inventory
   (names + aliases), preserving the non-color sections (radius/spacing/scrims).
3. Rename references in component `.module.css` with a scoped sweep. **`sed -i`
   flips line endings on this repo** — it rewrites every file it touches, so
   afterward separate real content changes from EOL-only churn:
   ```
   git diff --ignore-all-space -- <file>   # empty => EOL-only, revert it
   ```
   `git checkout --` the EOL-only files so the commit stays clean.
4. Update `semanticValueMap` AND `semanticGroups` in Colors.stories.tsx to the
   same inventory.

## Step 5 — Verify

- Count: `grep -cE '^\s*--surface-' semantic.css` etc. must equal Figma's
  per-group counts (25/13/7 for XUI). Watch out: `--border-` also matches
  `--border-width-*` — exclude those.
- `npx tsc -p tsconfig.app.json --noEmit`, `npx oxlint src`, `npx vite build`.
- Screenshot the `foundations-colors--semantic` story (wait ~4s; it's slow to
  render) and confirm it shows exactly the Figma set. Screenshot one or two
  renamed-token components (Button) to confirm value-preserving renames caused
  no visual change.

## Guardrails

- Never conclude "all tokens match" from a node-scoped sample — only the
  full-collection dump justifies that claim. State coverage honestly.
- Renames touch many component files — confirm the naming direction with the
  user before a large sweep (they may want to keep code names and only fix
  values). Value bugs are safe to fix without asking; renames are not.
- Keep code ↔ Storybook in lockstep — they share every token, so any change to
  semantic.css needs the mirrored change in Colors.stories.tsx.
